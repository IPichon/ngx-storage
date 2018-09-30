import { Injectable } from '@angular/core';
import * as LocalForage from 'localforage';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';

@Injectable()
export class LocalForageService {

  static localForage = LocalForage;

  static setItem(key: string, value: any): Observable<any> {
    return fromPromise(this.localForage.setItem(key, value));
  }

  static getItem(key: string): Observable<any> {
    return fromPromise(this.localForage.getItem(key));
  }

  static removeItem(key: string): Observable<void> {
    return fromPromise(this.localForage.removeItem(key));
  }

  static clear(): Observable<void> {
    return fromPromise(this.localForage.clear());
  }

  static count(): Observable<number> {
    return fromPromise(this.localForage.length());
  }

  static key(index: any): Observable<string> {

    return fromPromise(this.localForage.key(index));
  }

  static keys(): Observable<string[]> {

    return fromPromise(this.localForage.keys());
  }

  static iterate(fn: (value: any, key: string, iterationNumber: number) => void): Observable<void> {
    return fromPromise(this.localForage.iterate(fn));
  }

}
