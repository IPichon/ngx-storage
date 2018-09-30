import { flatMap } from 'rxjs/internal/operators';
import { Observable, of, throwError } from 'rxjs';
import { StorageMapper, StoreService } from './store/store.service';
import { assert } from './utils/assert';
import { LocalForageService } from './store/local-forage';

/**
 * DECORATOR:
 * whan applied to a method, if the method is call for the first time with some arguments,
 * it will execute all instructions in order to return the result and will cache it in the localstorage
 * if called a second time with the same arguments, then it will retrieve the result from the localstorage directly
 *
 * @param {string} key
 * @returns {any}
 * @constructor
 */
export function CacheResult(key: string) {
  return function cache(target: any, property: string, descriptor: TypedPropertyDescriptor<Function>) {
    const method = descriptor.value;

    descriptor.value = function (): Observable<any> {
      const args = arguments;
      const callId = `${key}@${Array.from(args).toString()}`;
      return StoreService.get(callId).pipe(flatMap(
        savedResult => {
          if (savedResult) {
            return of(savedResult);
          }
          method.apply(this, args).subscribe(result => {
              StoreService.put(callId, result);
            },
            error => {
              console.log(error);
            });
          return method.apply(this, args);
        }
      ));
    };
  };
}

/**
 * @param key
 * @constructor
 */
export function ClearCache(key: string) {
  return function clear(target: any, property: string, descriptor: TypedPropertyDescriptor<Function>) {
    const method = descriptor.value;
    descriptor.value = function (): Observable<any> {
      const args = arguments;
      return LocalForageService.keys().pipe((flatMap(
        keys => {
          keys.filter(k => k.startsWith(`${key}@`))
            .forEach(k => LocalForageService.removeItem(k));
          return method.apply(this, args);
        })));
    };
  };
}


/**
 * DECORATOR:
 * if applied to a class, it will register this class to be able to rebuild typed instance retrieved from the localstorage
 * NB: it can only be applied to objects with a prototype
 *
 * @param {string} constructorKey
 * @param {StorageMapper} mappers
 * @returns {(target: any) => any}
 */
export function Cacheable(constructorKey: string, mappers?: StorageMapper) {
  return function add(target: any) {
    mappers = mappers || {};

    // retrives object constructor
    assert(target.prototype, `${target} requires a prototype.`);
    const ctor = target.prototype.constructor;

    // get or generate mappers
    const serializer = mappers.serializer || target.prototype.serializer || ((item: any) => item);
    const deserializer = mappers.deserializer || target.prototype.deserializer || ((item: any) => new ctor(item));

    StoreService.addConstructor(target, constructorKey, {serializer, deserializer});

    return target;
  };
}
