import { Injectable } from '@angular/core';
import { LocalForageService } from '../utils/local-forage';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { cloneDeep } from 'lodash';
import { SerializationService } from '../serialization/serialization.service';

/**
 * The purpose of this class is to interact with the localstorage to save and retrieve typed objects
 * it uses a custom serialization/deserialization method to rebuild typed objects after retrieving them from the localStorage
 * see Serialization class
 */
@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private _store: LocalForageService, private serializer: SerializationService) {}

  // LOCAL STORAGE INTERACTIONS

  /**
   * @param key - the key of the stored value
   * @param obj - the object to be stored
   * @returns
   */
  put(key: string, obj: any): Observable<any> {
    // create value to store with metadata
    const storedValue = {
      _meta: {
        lastSaved: new Date()
      },
      value: this.serializer.recursiveSerialize(obj, new Set())
    };

    return this._store.setItem(key, JSON.stringify(storedValue));
  }

  /**
   * @param key - the key of the stored value to be retrieved
   * @returns an observable of the desired value
   */
  get(key: string): Observable<any> {
    return this._store.getItem(key).pipe(map(
      fromStore => {
        if (fromStore) {
          const storedValue = JSON.parse(fromStore);
          const value = storedValue.value;

          return this.serializer.recursiveDeserialize(cloneDeep(value));
        } else {
          throwError('Could not load data from LocalStorage');
        }
      }
    ));
  }

  /**
   * @param key - key of the stored value
   * @returns an observable of the date on which the value was saved
   */
  getLastSaved(key: string): Observable<Date> {
    return this._store.getItem(key).pipe(map(
      fromStore => {
        if (fromStore) {
          const storedValue = JSON.parse(fromStore);

          return new Date(storedValue._meta.lastSaved);
        } else {
          throwError('Could not load data from LocalStorage');
        }
      }
    ));
  }

  /**
   * remove all values from localstorage
   * @returns Observable<any>
   */
  clearAll(): Observable<any> {
    return this._store.clear();
  }

  /**
   * @param  key: string - the key of the item to be removed
   * @returns Observable<any>
   */
  removeItem(key: string): Observable<any> {
    return this._store.removeItem(key);
  }
}
