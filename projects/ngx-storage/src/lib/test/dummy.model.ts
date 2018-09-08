import * as _ from 'lodash';
import { StoreService } from '../store.service/store.service';

@StoreService.store('Inner')
export class Inner {
  regexp: RegExp;
  stuff: string[];
  constructor(inner: Partial<Inner>) {
    _.cloneDeep(this, inner);
  }
}

@StoreService.store('Dummy')
export class Dummy {

  static defaults = {
    name: '',
    birthDate: new Date(),
    inners: [],
    in: new Inner({})
  };

  name: string;
  birthDate: Date;
  inners: Inner[];
  in: Inner;

  constructor(dummy: Partial<Dummy>) {
    _.cloneDeep(this, dummy);
  }
}
