import { TestBed } from '@angular/core/testing';
import { LocalForageService } from '../utils/local-forage';
import { DummySample } from '../test/dummy.samples';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { StoreService } from './store.service';
import 'reflect-metadata';

describe('Store', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreService,
        LocalForageService
      ],
      imports: []
    });
  });

  describe('function put and get', () => {
    describe('given a stored custom class value', () => {
      let value;
      let result;
      it('should returned the original value', done => {
        value = DummySample;
        putAndGet(value).subscribe(res => {
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
        putAndGet(value).subscribe(res => {
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
        putAndGet(value).subscribe(res => {
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
        putAndGet(value).subscribe(res => {
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
        putAndGet(value).subscribe(res => {
          result = res;
          expect(result).toEqual(value);
          done();
        });
      });
    });
  });
});


function putAndGet(value): Observable<any> {
  return StoreService.put('value', value).pipe(flatMap(d => {
    return StoreService.get('value');
  }));
}
