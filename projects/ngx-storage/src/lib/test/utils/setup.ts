import { ComputerApiAnnotated } from '../Computer/computer.api.annotated';
import { CompanyApiAnnotated } from '../Company/company.api.annotated';
import { ComputerApi } from '../Computer/computer.api';
import { CompanyApi } from '../Company/company.api';

export function prepareCache1() {
  const aComputerApi = new ComputerApiAnnotated();
  return (...args) => {
    return aComputerApi.getPage(args[0], args[1]);
  };
}

export function prepareCache2() {
  const aCompanyApi = new CompanyApiAnnotated();
  return  (...args) => {
    return aCompanyApi.getPage(args[0], args[1]);
  };
}

export function prepareClear1() {
  const aComputerApi = new ComputerApiAnnotated();
  return (id) => aComputerApi.delete(id);
}

export function prepareResultCache1(args) {
  const computerApi = new ComputerApi();
  return computerApi.getPage(args[0], args[1]);
}

export function prepareResultCache2(args) {
  const companyApi = new CompanyApi();
  return companyApi.getPage(args[0], args[1]);
}

export function expectMethodBodyToHaveBeenCalled(fun, args, done) {
  const mySpy = spyOn(console, 'log');
  return fun(...args).subscribe(() => {
    expect(mySpy).toHaveBeenCalled();
    done();
  });
}

export function expectMethodBodyNotToHaveBeenCalled(fun, args, done) {
  const mySpy = spyOn(console, 'log');
  return fun(...args).subscribe(() => {
    expect(mySpy).not.toHaveBeenCalled();
    done();
  });
}
