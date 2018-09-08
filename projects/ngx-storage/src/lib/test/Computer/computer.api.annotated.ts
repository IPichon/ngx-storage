import { CacheResult } from '../../memoiz.decorator';
import { ComputerApi } from './computer.api';

export class ComputerApiAnnotated {

  @CacheResult('getComputerPage')
  getPage(index, size) {
    return new ComputerApi().getPage(index, size);
  }

  @CacheResult('getOneComputer')
  getOne(id) {
    return new ComputerApi().getOne(id);
  }
}
