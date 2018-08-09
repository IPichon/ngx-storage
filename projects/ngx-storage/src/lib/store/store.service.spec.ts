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
    let value;
    let result;
    describe('given a stored custom class value', () => {
      beforeEach(done => {
        value = DummySample;
        store.put('dummy', value).subscribe(d =>  {
          store.get('dummy').subscribe(v => {
            result = v;
            done();
          });
        });
      });
      it('should returned the original value', () => {
        expect(result).toEqual(value);
      });
    });

    describe('given a regexp', () => {
      beforeEach(done => {
        value = new RegExp('toto', 'ig');
        putAndGet(store, value).subscribe(res => {
          debugger;
          result = res;
          done();
        });
      });
      it('should returned the original value', () => {
        expect(result).toEqual(value);
      });
    });
  });
});


function putAndGet(store, value): Observable<any> {
  return store.put('value', value).pipe(flatMap(d => {
    return store.get('value');
  }));
}
