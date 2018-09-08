import { of, throwError } from 'rxjs';
import { CompanySamples } from './company.samples';

export class CompanyApi {
  samples = new CompanySamples();

  getPage(index, size) {
    console.log('computing result...');
    if (index === 1 && size === 5) {
      return of(this.samples.page1);
    }
    if (index === 2 && size === 5) {
      return of(this.samples.page2);
    }

    return throwError('Cannot load data');
  }
}
