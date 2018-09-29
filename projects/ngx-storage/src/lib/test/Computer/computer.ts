import { StoreService } from '../../store/store.service';
import { Company } from '../Company/company.model';
import * as _ from 'lodash';

@StoreService.store('Compute')
export class Computer {
  name: string;
  released: Date;
  discontinued: Date;
  manufactor: Company;

  constructor(computer: Partial<Computer>) {
    _.cloneDeep(computer);
  }
}
