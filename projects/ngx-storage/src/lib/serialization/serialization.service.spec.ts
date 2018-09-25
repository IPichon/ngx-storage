import { inject, TestBed } from '@angular/core/testing';
import { SerializationService } from './serialization.service';

describe('SerializationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SerializationService
      ],
      imports: []
    });
  });

  it('should be created', inject([SerializationService], (service: SerializationService) => {
    expect(service).toBeTruthy();
  }));

  describe('function serialize and deserialize recursively', () => {
    describe('given a string', () => {
      it('should return the original value after', inject([SerializationService], (service: SerializationService) => {
        const original = 'Angular is great!';
        const serialized = service.recursiveSerialize(original, []);
        const deserialized = service.recursiveDeserialize(serialized);
        expect(deserialized).toEqual(original);
      }));
    });

    describe('given an array', () => {
      it('should return the original value', inject([SerializationService], (service: SerializationService) => {
        const original = ['Angular', 'is', 'great', '!' ];
        const serialized = service.recursiveSerialize(original, []);
        const deserialized = service.recursiveDeserialize(serialized);
        expect(deserialized).toEqual(original);
      }));
    });

    describe('given a type with a given set of mappers', () => {
      it('should return the original value with the correct typê', inject([SerializationService], (service: SerializationService) => {
        const original = new RegExp('angular is( great || wonderful)');
        const serialized = service.recursiveSerialize(original, []);
        const deserialized = service.recursiveDeserialize(serialized);
        expect(deserialized).toEqual(original);
      }));
    });
  });
});
