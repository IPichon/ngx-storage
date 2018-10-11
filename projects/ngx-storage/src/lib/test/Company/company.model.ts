import * as _ from 'lodash';
import { Cacheable } from '../../main';

@Cacheable('Company')
export class Company {
  name: string;

  constructor(company: Partial<Company>) {
    _.cloneDeep(company);
  }
}
