import 'reflect-metadata';
import { TestBed } from '@angular/core/testing';
import { StoreService } from './store/store.service';
import { LocalForageService } from './store/local-forage';
import {
  expectMethodBodyNotToHaveBeenCalled,
  expectMethodBodyToHaveBeenCalled,
  prepareFun1,
  prepareFun2,
  prepareResultFun1,
  prepareResultFun2
} from './test/utils/setup';

describe('@CacheResult decorator', () => {
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

  describe('given two function annotated with @CacheResult', () => {
    const args1 = [1, 5];
    const args2 = [2, 5];
    const args3 = [1, 10];

    const fun1 = prepareFun1();
    const fun2 = prepareFun2();

    let resFun1args1, resFun1args2, resFun1args3, resFun2args1, resFun2args2;
    prepareResultFun1(args1).subscribe(result => resFun1args1 = result);
    prepareResultFun1(args2).subscribe(result => resFun1args2 = result);
    prepareResultFun1(args3).subscribe(result => resFun1args3 = result);

    prepareResultFun2(args1).subscribe(result => resFun2args1 = result);
    prepareResultFun2(args2).subscribe(result => resFun2args2 = result);

    describe('calling the first function', () => {
      describe('for the first time', () => {
        describe('with a given set of param', () => {

          it('should call method body', (done) => {
            expectMethodBodyToHaveBeenCalled(fun1, args1, done);
          });

          it('should return the result', (done) => {
            fun1(...args1).subscribe(result => {
              expect(result).toEqual(resFun1args1);
              done();
            });
          });
        });

        describe('with another set of param', () => {

          it('should call method body', (done) => {
            expectMethodBodyToHaveBeenCalled(fun1, args2, done);
          });

          it('should return the result', (done) => {
            fun1(...args2).subscribe(result => {
              expect(result).toEqual(resFun1args2);
              done();
            });
          });
        });
      });

      describe('for the second time', () => {
        beforeEach((done) => {
          fun1(...args1).subscribe(() => done());
        });

        describe('with the same param as the first time', () => {

          it('should NOT call method body', (done) => {
            expectMethodBodyNotToHaveBeenCalled(fun1, args1, done);
          });

          it('should return the result', (done) => {
            fun1(...args1).subscribe(result => {
              expect(result).toEqual(resFun1args1);
              done();
            });
          });
        });

        describe('with other params never used before', () => {
          it('should call method body', (done) => {
            expectMethodBodyToHaveBeenCalled(fun1, args3, done);
          });

          it('should return the result', (done) => {
            fun1(...args3).subscribe(result => {
              expect(result).toEqual(resFun1args3);
              done();
            });
          });
        });

        describe('with params that returned an error the first time', () => {
          /* An error could be exceptional ( db timeout, lost connection etc), so we do not want to store this result */
          beforeEach((done) => {
            fun1(undefined, undefined).subscribe(
              res => res, () => done()
            );
          });

          it('should call method body', (done) => {
            const mySpy = spyOn(console, 'log');
            fun1(undefined, undefined).subscribe(
              res => res,
              () => {
                expect(mySpy).toHaveBeenCalled();
                done();
              });
          });
        });
      });
    });
    afterAll(() => {
      LocalForageService.clear();
    });

    describe('calling the second function after calling the first', () => {
      describe('for the first time', () => {
        beforeEach((done) => {
          fun1(...args1).subscribe(
            () => done()
          );
        });

        describe('with the same params', () => {
          it('should call method body', (done) => {
            expectMethodBodyToHaveBeenCalled(fun2, args1, done);
          });

          it('should return the result', (done) => {
            fun2(...args1).subscribe(result => {
              expect(result).toEqual(resFun2args1);
              done();
            });
          });
        });
      });

      afterAll(() => {
        LocalForageService.clear();
      });

      describe('for the second time', () => {

        describe('with the same params', () => {

          it('should NOT call method body', (done) => {
            expectMethodBodyNotToHaveBeenCalled(fun2, args1, done);
          });

          it('should return the result', (done) => {
            fun2(...args1).subscribe(result => {
              expect(result).toEqual(resFun2args1);
              done();
            });
          });
        });
      });
    });
  });

  describe('@ClearCache', () => {

    describe('given a function annotated with clearCache', () => {
      describe('and passed a method not annotated with @CacheResult', () => {
        it(`should throw an assertion error with message
          'Cannot clear cache for uncached method + method name'`, () => {
        });
      });

      describe('and passed a method annotated @CacheResult', () => {
        it('should clear all result for this method from the cache', () => {
        });

        it('should not clear the result of others methods from the cache', () => {

        });
      });
    });
  });
});
