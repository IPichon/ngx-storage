import { NgModule } from '@angular/core';
import { LocalForageService } from './utils/local-forage';
import { environment } from '../../../../src/environments/environment.prod';
import { StoreService } from './store.service/store.service';

@NgModule({
  imports: [
  ],
  providers: [
    StoreService,
    LocalForageService,
    {
      provide: 'env',
      useValue: environment
    }
  ]
})
export class NgxStorageModule { }
