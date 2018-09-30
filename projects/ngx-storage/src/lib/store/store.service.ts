import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LocalForageService } from './local-forage';
import { map } from 'rxjs/internal/operators';

export interface StorageMapper {
  serializer?(any: any): any;
  deserializer?(any: any): any;
}

export interface ObjectWrapper<T> {
  value: T;
  constructorKey?: string;
}


@Injectable()
export class StoreService {
  /**
   * {Map<string, {serializer, deserializer}>}
   * this map is used to store all known mappers such as custom Types ( Mission, Skill, Resume etc)
   *  each of them should be added as needed
   *  it should be filled with the addConstructor method
   *  serializer and deserializer can be inferred from the object constructor if it uses constructor by copy
   *  otherwise specific mappers should be given as parametr to the method
   */
  private static mappers: Map<string, StorageMapper> = new Map();

  /**
   * @param objectClass
   * @param name
   * @param mappers (optional)
   *
   * method to add mappers for a Type so it can be serialize/deserialize
   * if no mappers are given they will be inferred from the constructor
   * the key will be used to know which constructor to use for deserilization
   */
  static addConstructor(objectClass: any, name: string, mappers?: StorageMapper) {
    const ctor = objectClass.prototype.constructor;

    const key = Reflect.getOwnMetadata('serial', ctor);
    assert(!key, `constructor ${ctor.name} already registered with key ${key}`);
    Reflect.defineMetadata('serial', name, objectClass.prototype.constructor);
    this.mappers.set(name, mappers);
  }

  constructor() {}

  // LOCAL STORAGE INTERACTIONS

  /**
   * @param key - the key of the stored value
   * @param obj - the object to be stored
   * @returns
   */
  static put(key: string, obj: any): Observable<any> {
    // create value to store with metadata
    const storedValue = {
      _meta: {
        lastSaved: new Date()
      },
      value: StoreService.recursiveSerialize(obj, new Set())
    };

    return LocalForageService.setItem(key, JSON.stringify(storedValue));
  }

  /**
   * @param key - the key of the stored value to be retrieved
   * @returns an observable of the desired value
   */
  static get(key: string): Observable<any> {
    return LocalForageService.getItem(key).pipe(map(
      fromStore => {
        if (fromStore) {
          const storedValue = JSON.parse(fromStore);
          const value = storedValue.value;

          return StoreService.recursiveDeserialize(_.cloneDeep(value));
        } else {
          throwError('Could not load data from LocalStorage');
        }
      }
    ));
  }

  /**
   * @param  key: string - the key of the item to be removed
   * @returns Observable<any>
   */
  static removeItem(key: string): Observable<any> {
    return LocalForageService.removeItem(key);
  }

  private static _serialize(obj: any): ObjectWrapper<any> {
    let value = _.cloneDeep(obj);
    let constructorKey;
    // if object is prototyped
    if (_.isObject(obj)) {
      // make a key to save its constructor
      const constructor = obj.constructor;
      if (constructor !== Object.prototype.constructor) {
        const serial =  Reflect.getMetadata('serial', constructor);
        const mapper = StoreService.mappers.get(serial);
        if (mapper && _.isFunction(mapper.serializer)) {
          value = _.cloneDeep(mapper.serializer(obj));
        }
        constructorKey = serial;
      }
    }
    return {
      value,
      constructorKey
    };
  }

  /**
   * @param obj: object to be serialized
   * @param exclusions: set of object that should not serialized to avoid infinite recursion
   * @returns
   */
  static recursiveSerialize(obj: any, exclusions: any): any {
    obj = StoreService._serialize(obj);
    // attempt serialization for all nested object.
    // Use a for... in instead of a Object.keys to be able to break the loop in case of infinite recursion
    for (const i in obj.value) {
      if (obj.value.hasOwnProperty(i)) {
        const o = obj.value[i];
        if (_.isObject(o)) {
          if ((_.isArray(o) && o.length === 0) || exclusions.has(o)) {
            continue;
          }

          // add this to exclusions, to avoid self-reference to cause infinite recursion
          exclusions.add(o);
          obj.value[i] = StoreService.recursiveSerialize(o, exclusions);
          exclusions.delete(o);
        }
      }
    }

    return obj;
  }

  private static _deserialize(wrapper: ObjectWrapper<any>): any {
    const serial = wrapper.constructorKey;
    let obj = wrapper.value;
    if (_.isObject(obj) && serial) {
      // found a serialized object!
      const mapper = StoreService.mappers.get(serial);
      assert(mapper && _.isFunction(mapper.deserializer), `Failed deserialization: missing mappers to deserialize ${serial}`);
      obj = mapper.deserializer(obj);
    }

    return obj;
  }

  /**
   * @param obj
   * @returns
   * recursively deserialize object
   */
  static recursiveDeserialize(obj: any): any {
    for (const i in obj.value) {
      if (obj.value.hasOwnProperty(i)) {
        const o = obj.value[i];
        if (_.isObject(o)) {
          obj.value[i] = this.recursiveDeserialize(o);
        }
      }
    }

    return StoreService._deserialize(obj);
  }
}




// REGEXP
StoreService.addConstructor(RegExp, 'Regexp', {
  serializer:  (regexp: RegExp): any => ({
    source: regexp.source,
    flags: regexp.flags
  }),
  deserializer: (obj: any): RegExp => new RegExp(obj.source, obj.flags)
});

// DATE
StoreService.addConstructor(Date, 'Date', {
  serializer: (date: Date): any => {
    return { value: (date ?  date.toISOString() : '') };
  },
  deserializer: (obj: any): Date =>  new Date(obj.value)
});

// SET
StoreService.addConstructor(Set, 'Set', {
  serializer: (set: Set<any>): any => {
    return { value: Array.from(set) };
  },
  deserializer: (obj: any): Set<any> =>  new Set(obj.value)
});

// MAP
StoreService.addConstructor(Map, 'Map', {
  serializer: (map1: Map<any, any>): any => {
    return { value: Array.from(map1) };
  },
  deserializer: (obj: any): Map<any, any> =>  new Map(obj.value)
});
