import { CacheResult } from '../../main';
import { CompanyApi } from './company.api';

export class CompanyApiAnnotated {

  @CacheResult('getCompanyPage')
  getPage(index, size) {
    return new CompanyApi().getPage(index, size);
  }
}
