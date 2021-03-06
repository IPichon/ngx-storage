import { of, throwError } from 'rxjs';
import { ComputerSamples } from './computerSamples';

export class ComputerApi {
  samples = new ComputerSamples();

  getOne(id) {
    console.log('computing result...');
    if (id === 1 ) {
      return of(this.samples.c1);
    }
    if (id === 2 ) {
      return of(this.samples.c2);
    }
  }

  getPage(index: number, size: number) {
    console.log('computing result...');

    if (index === 1 && size === 5) {
      return of(this.samples.page1size5);
    }

    if (index === 2 && size === 5) {
      return of(this.samples.page2size5);
    }

    if (index === 1 && size === 10) {
      return of(this.samples.page1size10);
    }

    return throwError('Could not load data');
  }

  deleteOne(id: number) {
    console.error('we meet again');
    return of('');
  }
}
