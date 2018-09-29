import { inject, TestBed } from '@angular/core/testing';
import 'reflect-metadata';
import { StoreService } from '../store.service/store.service';
import { LocalForageService } from '../utils/local-forage';
import { ComputerApi } from './Computer/computer.api';
import { ComputerApiAnnotated } from './Computer/computer.api.annotated';
import { CompanyApiAnnotated } from './Company/company.api.annotated';
import { CompanyApi } from './Company/company.api';

describe('CacheResult decorator', () => {
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

  /*TODO : need to write tests for :
  - calling another function with the same arguments ( once again no overlap shoudl exist)
  - calling the function and having an error as a result --> result should not be stored)
  ?? handling cases where another function need to clear the cache ( for instance because you update a collection)
   */

  describe('given two function annotated with @CacheResult', () => {
    let aComputerApi, aCompanyApi;
    let fun1;
    let fun2;

    let args1, args2, args3;
    let fun1result1, fun1result2, fun1res3;
    let fun2result1, fun2result2;

    beforeEach(() => {
      aComputerApi = new ComputerApiAnnotated();
      aCompanyApi = new CompanyApiAnnotated();
      fun1 = (...args) => {
        return aComputerApi.getPage(...args);
      };
      fun2 = (...args) => {
        return aCompanyApi.getPage(...args);
      };

      // prepare args
      args1 = [1, 5];
      args2 = [2, 5];
      args3 = [1, 10];

      const computerApi = new ComputerApi();
      const companyApi = new CompanyApi();
      // prepare results for fun1
      computerApi.getPage(args1[0], args1[1]).subscribe(result => {
        fun1result1 = result;
      });
      computerApi.getPage(args2[0], args2[1]).subscribe(result => {
        fun1result2 = result;
      });

      computerApi.getPage(args3[0], args3[1]).subscribe(result => {
        fun1res3 = result;
      });

      // prepare results for fun2
      companyApi.getPage(args1[0], args1[1]).subscribe(result => {
        fun2result1 = result;
      });
      companyApi.getPage(args2[0], args2[1]).subscribe(result => {
        fun2result2 = result;
      });

    });

    describe('calling the first function', () => {
      describe('for the first time', () => {
        describe('with a given set of param', () => {
          it('should call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun1(...args1).subscribe(result => {
              expect(mySpy).toHaveBeenCalled();
              done();
            });
          });

          it('should return the result', (done) => {
            fun1(...args1).subscribe(result => {
              expect(result).toEqual(fun1result1);
              done();
            });

          });

        });

        describe('with another set of param', () => {
          it('should call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun1(...args2).subscribe(result => {
              expect(mySpy).toHaveBeenCalled();
              done();
            });
          });
          it('should return the result', (done) => {
            fun1(...args2).subscribe(result => {
              expect(result).toEqual(fun1result2);
              done();
            });
          });

        });

      });

      describe('for the second time', () => {
        beforeEach((done) => {
          fun1(...args1).subscribe(res => {
            done();
          });
        });

        describe('with the same param as the first time', () => {
          it('should NOT call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun1(...args1).subscribe(result => {
              expect(mySpy).not.toHaveBeenCalled();
              done();
            });
          });
          it('should return the result', (done) => {
            fun1(...args1).subscribe(result => {
              expect(result).toEqual(fun1result1);
              done();
            });
          });

        });

        describe('with other params never used before', () => {
          it('should call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun1(...args3).subscribe(result => {
              expect(mySpy).toHaveBeenCalled();
              done();
            });
          });
          it('should return the result', (done) => {
            fun1(...args3).subscribe(result => {
              expect(result).toEqual(fun1res3);
              done();
            });

          });

        });

        describe('with params that returned an error the first time', () => {
          /* An error could be exceptional ( db timeout, lost connection etc), so we do not want to store this result */
          beforeEach((done) => {
            fun1(undefined, undefined).subscribe(
              res => res,
              error => done()
            );
          });
          it('should call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun1(undefined, undefined).subscribe(
              res => res,
              error => {
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
            res => done()
          );
        });

        describe('with the same params', () => {
          it('should call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun2(...args1).subscribe(result => {
              expect(mySpy).toHaveBeenCalled();
              done();
            });
          });

          it('should return the result', (done) => {
            fun2(...args1).subscribe(result => {
              expect(result).toEqual(fun2result1);
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

          it('should NOT call console.log', (done) => {
            const mySpy = spyOn(console, 'log');
            fun2(...args1).subscribe(result => {
              expect(mySpy).not.toHaveBeenCalled();
              done();
            });
          });

          it('should return the result', (done) => {
            fun2(...args1).subscribe(result => {
              expect(result).toEqual(fun2result1);
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
