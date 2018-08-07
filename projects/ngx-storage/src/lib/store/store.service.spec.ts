import { TestBed } from '@angular/core/testing';
import { StoreService } from './store.service';
import { LocalForageService } from '../utils/local-forage';
import { ResumeSamples } from '../../../tests/samples/resume.samples';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoggerConfig } from '../../core/services/logger/logger.config';
import { environment } from '../../../environments/environment';
import { LightSkillSamples } from '../../../tests/samples/light-skill.samples';

describe('StoreService', () => {
  let store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreService,
        LocalForageService,
        {
          provide: LoggerConfig,
          useValue: environment.loggerConfig
        },
        ToastrService,
      ],
      imports: [ToastrModule.forRoot()]
    });
    store = TestBed.get(StoreService);
  });

  describe('function put and get', () => {
    let value;
    let result;
    describe('given a Resume value', () => {
      beforeEach(done => {
        value = ResumeSamples.resumeBackend;
        store.put('resume', value).subscribe(d =>  {
          store.get('resume').subscribe(v => {
            result = v;
            done();
          });
        });
      });
      it('should returned the original value', () => {
        expect(result).toEqual(value);
      });
    });
    describe('given an array of skills', () => {
      beforeEach(done => {
        value = LightSkillSamples.sampleGlobal;
        store.put('skillSample', [...value]).subscribe(d =>  {
          store.get('skillSample').subscribe(v => {
            result = v;
            done();
          });
        });
      });
      it('should returned the original value', () => {
        expect(result).toEqual(value);
      });
    });
  });
});
