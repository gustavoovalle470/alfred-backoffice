import { TestBed } from '@angular/core/testing';

import { ModuleconfigService } from './moduleconfig.service';

describe('ModuleconfigService', () => {
  let service: ModuleconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
