import { Company } from './company.model';

export class CompanySamples {

  readonly c1 = new Company({name: 'Apple'});
  readonly c2 = new Company({name: 'Thinking Machines'});
  readonly c3 = new Company({name: 'RCA'});
  readonly c4 = new Company({name: 'Netronics'});
  readonly c5 = new Company({name: 'Tandy Corporation'});
  readonly c6 = new Company({name: 'Commodore International'});
  readonly c7 = new Company({name: 'Mos technology'});

  readonly page1 = [this.c1, this.c2, this.c3, this.c4, this.c5];
  readonly page2 = [this.c6, this.c7];

}
