import { Storable } from '../utils/serializable.decorator';
import * as _ from 'lodash'

@Storable('Inner')
export class Inner {
  defaults = {
    regex: undefined,
    stuff: []
  };
  regexp: RegExp;
  stuff: string[];
  constructor(inner: Partial<Inner>) {
    _.cloneDeep(this, inner);
  }
}

@Storable('Dummy')
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
