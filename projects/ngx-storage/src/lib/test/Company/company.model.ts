import { StoreService } from '../../store.service/store.service';
import * as _ from 'lodash';

@StoreService.store('Company')
export class Company {
  name: string;
  created: Date;

  constructor(company: Partial<Company>) {
    _.cloneDeep(company);
  }
}
