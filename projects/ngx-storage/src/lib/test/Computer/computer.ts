import { Company } from '../Company/company.model';
import * as _ from 'lodash';
import { Cacheable } from '../../memoiz.decorator';

@Cacheable('Compute')
export class Computer {
  name: string;
  released: Date;
  discontinued: Date;
  manufactor: Company;

  constructor(computer: Partial<Computer>) {
    _.cloneDeep(computer);
  }
}
