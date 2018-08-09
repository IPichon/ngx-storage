import { Injectable } from '@angular/core';
import { cloneDeep, isArray, isFunction, isObject } from 'lodash';
import {assert} from '../utils/assert';
import 'reflect-metadata';

export interface StorageMapper {
  serializer?(any: any): any;
  deserializer?(any: any): any;
}

interface ObjectWrapper<T> {
  value: T;
  constructorKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SerializationService {

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

  // tslint:disable-next-line
  private _serialize(obj: any): ObjectWrapper<any> {
    let value = cloneDeep(obj);
    let constructorKey;
    // if object is prototyped
    if (isObject(obj)) {
      // make a key to save its constructor
      const constructor = obj.constructor;
      if (constructor !== Object.prototype.constructor) {
        const serial =  Reflect.getMetadata('serial', constructor);
        const mapper = SerializationService.mappers.get(serial);
        if (mapper && isFunction(mapper.serializer)) {
          value = cloneDeep(mapper.serializer(obj));
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
  recursiveSerialize(obj: any, exclusions: any): any {
    obj = this._serialize(obj);
    // attempt serialization for all nested object.
    // Use a for... in instead of a Object.keys to be able to break the loop in case of infinite recursion
    for (const i in obj.value) {
      if (obj.value.hasOwnProperty(i)) {
        const o = obj.value[i];
        if (isObject(o)) {
          if ((isArray(o) && o.length === 0) || exclusions.has(o)) {
            continue;
          }

          // add this to exclusions, to avoid self-reference to cause infinite recursion
          exclusions.add(o);
          obj.value[i] = this.recursiveSerialize(o, exclusions);
          exclusions.delete(o);
        }
      }
    }

    return obj;
  }

  // tslint:disable-next-line
  private _deserialize(wrapper: ObjectWrapper<any>): any {
    const serial = wrapper.constructorKey;
    let obj = wrapper.value;
    if (isObject(obj) && serial) {
      // found a serialized object!
      const mapper = SerializationService.mappers.get(serial);
      assert(mapper && isFunction(mapper.deserializer), `Failed deserialization: missing mappers to deserialize ${serial}`);
      obj = mapper.deserializer(obj);
    }

    return obj;
  }

  /**
   * @param obj
   * @returns
   * recursively deserialize object
   */
  recursiveDeserialize(obj: any): any {
    for (const i in obj.value) {
      if (obj.value.hasOwnProperty(i)) {
        const o = obj.value[i];
        if (isObject(o)) {
          obj.value[i] = this.recursiveDeserialize(o);
        }
      }
    }

    return this._deserialize(obj);
  }
}

// IMPORTANT: build-in types with their given mappers according to how you logically build them.

// // REGEXP
SerializationService.addConstructor(RegExp, 'Regexp', {
  serializer:  (regexp: RegExp): any => ({
    source: regexp.source,
    flags: regexp.flags
  }),
  deserializer: (obj: any): any => new RegExp(obj.source, obj.flags)
});

// DATE
SerializationService.addConstructor(Date, 'Date', {
    serializer: (date: Date): any => {
      return { value: (date ?  date.toISOString() : '') };
    },
    deserializer: (obj: any): any =>  new Date(obj.value)
});
