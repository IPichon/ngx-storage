import { SerializationService, StorageMapper } from '../serialization/serialization.service';
import { assert } from '../utils/assert';

export function Storable(constructorKey: string, mappers?: StorageMapper) {
  return function add(target: any) {
    mappers = mappers || {};

    assert(target.prototype, `${target} requires a prototype.`);
    const ctor = target.prototype.constructor;

    const serializer = mappers.serializer || target.prototype.serializer || ((item: any) => item);
    const deserializer = mappers.deserializer || target.prototype.deserializer || ((item: any) => new ctor(item));
    SerializationService.addConstructor(target.prototype.constructor, constructorKey, {serializer, deserializer});

    return target;
  };
}
