import {NgModule} from '@angular/core';
import {SerializationService} from './serialization/serialization.service';
import {StoreService} from './store/store.service';
import {LocalForageService} from './utils/local-forage';
import {environment} from '../../../../src/environments/environment.prod';

@NgModule({
  imports: [
  ],
  providers: [
    StoreService,
    LocalForageService,
    SerializationService,
    {
      provide: 'env',
      useValue: environment
    }
  ]
})
export class NgxStorageModule { }
