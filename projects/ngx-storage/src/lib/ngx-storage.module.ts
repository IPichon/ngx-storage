import { NgModule } from '@angular/core';
import { LocalForageService } from './store/local-forage';
import { environment } from '../../../../src/environments/environment.prod';
import { StoreService } from './store/store.service';

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
