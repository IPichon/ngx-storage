import { Injectable } from '@angular/core';
import * as LocalForage from 'localforage';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';

@Injectable()
export class LocalForageService {

  localForage = LocalForage;

  setItem(key: string, value: any): Observable<any> {
    return fromPromise(this.localForage.setItem(key, value));
  }

  getItem(key: string): Observable<any> {
    return fromPromise(this.localForage.getItem(key));
  }

  removeItem(key: string): Observable<void> {
    return fromPromise(this.localForage.removeItem(key));
  }

  clear(): Observable<void> {
    return fromPromise(this.localForage.clear());
  }

  count(): Observable<number> {
    return fromPromise(this.localForage.length());
  }

  key(index: any): Observable<string> {

    return fromPromise(this.localForage.key(index));
  }

  keys(): Observable<string[]> {

    return fromPromise(this.localForage.keys());
  }

  iterate(fn: (value: any, key: string, iterationNumber: number) => void): Observable<void> {
    return fromPromise(this.localForage.iterate(fn));
  }

}
