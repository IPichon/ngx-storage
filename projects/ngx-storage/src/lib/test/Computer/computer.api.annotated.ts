import { CacheResult, ClearCache } from '../../memoiz.decorator';
import { ComputerApi } from './computer.api';

export class ComputerApiAnnotated {

  @CacheResult('getComputerPage')
  getPage(index: number, size: number) {
    return new ComputerApi().getPage(index, size);
  }

  @CacheResult('getOneComputer')
  getOne(id: number) {
    return new ComputerApi().getOne(id);
  }

  @ClearCache('getComputerPage')
  delete(id: number) {
    return new ComputerApi().deleteOne(id);
  }
}
