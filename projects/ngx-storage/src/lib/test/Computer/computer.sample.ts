import { Computer } from './computer';
import { CompanySamples } from '../Company/company.samples';

export class ComputerSample {

  readonly  c1 = new Computer({
    name: 'MacBook Pro 15.4 inch',
    released: undefined,
    discontinued: undefined,
    manufactor: new CompanySamples().c1
  });

  readonly c2 = new Computer({
    name: 'CM-2a',
    released: new Date(2018, 10, 4),
    discontinued: undefined,
    manufactor: undefined
  });

  readonly c3 = new Computer({
    name: 'CM-200',
    released: undefined,
    discontinued: undefined,
    manufactor:  new CompanySamples().c2
  });

  readonly c4 = new Computer({
    name: 'CM-5e',
    released: new Date(2016, 5, 13),
    discontinued: undefined,
    manufactor:  new CompanySamples().c2
  });

  readonly c5 = new Computer({
    name: 'CM-5',
    released: new Date(1991, 1, 1),
    discontinued: undefined,
    manufactor:  new CompanySamples().c2
  });

  readonly c6 = new Computer({
    name: 'MacBook Pro',
    released: new Date(200, 1, 10),
    discontinued: undefined,
    manufactor:  new CompanySamples().c1
  });

  readonly c7 = new Computer({
    name: 'Apple IIe',
    released: undefined,
    discontinued: undefined,
    manufactor: undefined
  });

  readonly c8 = new Computer({
    name: 'Apple IIc',
    released: undefined,
    discontinued: undefined,
    manufactor: undefined
  });

  readonly c9 = new Computer({
    name: 'Apple IIGS',
    released: new Date(200, 1, 10),
    discontinued: undefined,
    manufactor: undefined
  });

  readonly c10 = new Computer({
    name: 'Apple IIc Plus',
    released: new Date(200, 1, 10),
    discontinued: undefined,
    manufactor: undefined
  });



  readonly page1size5 = [this.c1, this.c2, this.c3, this.c4, this.c5];
  readonly page2size5 = [this.c6, this.c7, this.c8, this.c9, this.c10];
  readonly  page1size10 = [this.c1, this.c2, this.c3, this.c4, this.c5,
    this.c6, this.c7, this.c8, this.c9, this.c10];
}
