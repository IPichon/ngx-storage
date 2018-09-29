import 'reflect-metadata';
import { flatMap } from 'rxjs/internal/operators';
import { Observable, of } from 'rxjs';
import { StoreService } from './store.service/store.service';

/**
 * todo documentation
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
