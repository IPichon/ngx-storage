import 'reflect-metadata';
import { flatMap } from 'rxjs/internal/operators';
import { Observable, of } from 'rxjs';
import { StoreService } from './store.service/store.service';
import { LocalForageService } from './utils/local-forage';
import { Injector } from '@angular/core';

const injector: Injector =
  Injector.create({
    providers: [
      {provide: StoreService, useClass: StoreService, deps: [LocalForageService]},
      {provide: LocalForageService, useClass: LocalForageService, deps: []}
    ]
  });

/**
 * todo documentation
 * @param {string} key
 * @returns {any}
 * @constructor
 */
export function CacheResult(key: string) {
  return function cache(target: any, property: string, descriptor: TypedPropertyDescriptor<Function>) {
    const _store = injector.get(StoreService);
    const method = descriptor.value;

    descriptor.value = function (): Observable<any> {
      const args = arguments;
      const callId = `${key}@${Array.from(args).toString()}`;
      return _store.get(callId).pipe(flatMap(
        savedResult => {
          if (savedResult) {
            return of(savedResult);
          }
          method.apply(this, args).subscribe(result => {
              _store.put(callId, result);
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
