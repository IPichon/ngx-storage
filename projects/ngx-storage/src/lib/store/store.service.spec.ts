import { TestBed } from '@angular/core/testing';
import { StoreService } from './store.service';
import { LocalForageService } from '../utils/local-forage';
import { DummySample } from '../test/dummy.samples';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';


describe('StoreService', () => {
  let store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreService,
        LocalForageService
      ],
      imports: []
    });
    store = TestBed.get(StoreService);
  });

  describe('function put and get', () => {
    describe('given a stored custom class value', () => {
      let value;
      let result;
      it('should returned the original value', done => {
        value = DummySample;
        putAndGet(store, value).subscribe(res => {
          result = res;
          expect(result).toEqual(value);
          done();
        });
      });
    });

    describe('given a regexp', () => {
      let value;
      let result;
      it('should returned the original value', done => {
        value = new RegExp('toto', 'ig');
        putAndGet(store, value).subscribe(res => {
          result = res;
          expect(result).toEqual(value);
          done();
        });
      });
    });

    describe('given a Set', () => {
      let value;
      let result;
      it('should returned the original value', done => {
        value = new Set(['some', 'stuff']);
        putAndGet(store, value).subscribe(res => {
          result = res;
          expect(result).toEqual(value);
          done();
        });
      });
    });

    describe('given a Map', () => {
      let value;
      let result;
      it('should returned the original value', done => {
        value = new Map([[1, 'stuff'], [2, 'stuff']]);
        putAndGet(store, value).subscribe(res => {
          result = res;
          expect(result).toEqual(value);
          done();
        });
      });
    });

    describe('given a Date', () => {
      let value;
      let result;
      it('should returned the original value', done => {
        value = new Date();
        putAndGet(store, value).subscribe(res => {
          result = res;
          expect(result).toEqual(value);
          done();
        });
      });
    });
  });
});


function putAndGet(store, value): Observable<any> {
  return store.put('value', value).pipe(flatMap(d => {
    return store.get('value');
  }));
}
