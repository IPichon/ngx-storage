// IMPORTANT: build-in types with their given mappers according to how you logically build them.

// // REGEXP
import { StoreService } from '../store.service/store.service';

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
