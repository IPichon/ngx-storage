import 'reflect-metadata';
import { TestBed } from '@angular/core/testing';
import { StoreService } from './store/store.service';
import { LocalForageService } from './store/local-forage';
import {
  expectMethodBodyNotToHaveBeenCalled,
  expectMethodBodyToHaveBeenCalled,
  prepareCache1,
  prepareCache2, prepareClear1,
  prepareResultCache1,
  prepareResultCache2
} from './test/utils/setup';

describe('Memoiz feature', () => {
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
  const args1 = [1, 5];
  const args2 = [2, 5];
  const args3 = [1, 10];

  const cache1 = prepareCache1();
  const cache2 = prepareCache2();
  const clear1 = prepareClear1();

  let resFun1args1, resFun1args2, resFun1args3, resFun2args1, resFun2args2;
  prepareResultCache1(args1).subscribe(result => resFun1args1 = result);
  prepareResultCache1(args2).subscribe(result => resFun1args2 = result);
  prepareResultCache1(args3).subscribe(result => resFun1args3 = result);

  prepareResultCache2(args1).subscribe(result => resFun2args1 = result);
  prepareResultCache2(args2).subscribe(result => resFun2args2 = result);


  describe('@CacheResult decorator', () => {
    describe('given two function annotated with @CacheResult', () => {
      describe('calling the first function', () => {
        describe('for the first time', () => {
          describe('with a given set of param', () => {

            it('should call method body', (done) => {
              expectMethodBodyToHaveBeenCalled(cache1, args1, done);
            });

            it('should return the result', (done) => {
              cache1(...args1).subscribe(result => {
                expect(result).toEqual(resFun1args1);
                done();
              });
            });
          });

          describe('with another set of param', () => {

            it('should call method body', (done) => {
              expectMethodBodyToHaveBeenCalled(cache1, args2, done);
            });

            it('should return the result', (done) => {
              cache1(...args2).subscribe(result => {
                expect(result).toEqual(resFun1args2);
                done();
              });
            });
          });
        });

        describe('for the second time', () => {
          beforeEach((done) => {
            cache1(...args1).subscribe(() => done());
          });

          describe('with the same param as the first time', () => {

            it('should NOT call method body', (done) => {
              expectMethodBodyNotToHaveBeenCalled(cache1, args1, done);
            });

            it('should return the result', (done) => {
              cache1(...args1).subscribe(result => {
                expect(result).toEqual(resFun1args1);
                done();
              });
            });
          });

          describe('with other params never used before', () => {
            it('should call method body', (done) => {
              expectMethodBodyToHaveBeenCalled(cache1, args3, done);
            });

            it('should return the result', (done) => {
              cache1(...args3).subscribe(result => {
                expect(result).toEqual(resFun1args3);
                done();
              });
            });
          });

          describe('with params that returned an error the first time', () => {
            /* An error could be exceptional ( db timeout, lost connection etc), so we do not want to store this result */
            beforeEach((done) => {
              cache1(undefined, undefined).subscribe(
                res => res, () => done()
              );
            });

            it('should call method body', (done) => {
              const mySpy = spyOn(console, 'log');
              cache1(undefined, undefined).subscribe(
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
            cache1(...args1).subscribe(
              () => done()
            );
          });

          describe('with the same params', () => {
            it('should call method body', (done) => {
              expectMethodBodyToHaveBeenCalled(cache2, args1, done);
            });

            it('should return the result', (done) => {
              cache2(...args1).subscribe(result => {
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
              expectMethodBodyNotToHaveBeenCalled(cache2, args1, done);
            });

            it('should return the result', (done) => {
              cache2(...args1).subscribe(result => {
                expect(result).toEqual(resFun2args1);
                done();
              });
            });
          });
        });
      });
    });
  });


  describe('@ClearCache', () => {

    describe('given a method clear1 annotated with @ClearCache', () => {
      describe('passed a method cache1 not annotated with @CacheResult', () => {
        it(`should throw an assertion error with message
          'Cannot clear cache for uncached method + method name'`, () => {
        });
      });

      describe('passed a method cache1 annotated @CacheResult', () => {
        describe('calling cache1 method', () => {
          beforeEach((done) => {
            cache1(...args1).subscribe(() => done());
          });
          describe('and calling clear1 after', () => {
            beforeEach((done) => {
              clear1(1).subscribe(() => done());
            });
          });
          describe('and calling cache1 with the same set of args afterwards', () => {
            it('should call the method body', (done) => {
              expectMethodBodyToHaveBeenCalled(cache1, args1, done);
            });
            it('should return the result', () => {

            });
          });
        });

        describe('calling cache2 method', () => {
          beforeEach((done) => {
              cache2(...args1).subscribe(() => done());
            }
          );
          describe('and calling clear1 after', () => {
            beforeEach((done) => {
              clear1(1).subscribe(() => done());
            });
            describe('and calling cache2 with the same set of args afterwards', () => {
              it('should NOT call the method body', (done) => {
                expectMethodBodyNotToHaveBeenCalled(cache2, args1, done);
              });
              it('should return the result', () => {

              });
            });
          });
        });
      });

    });
  });
  afterAll(() => {
    LocalForageService.clear();
  });
  it('should not find any cached result for the method any more', () => {
  });

  it('should not clear the result of others methods from the cache', () => {

  });
});



