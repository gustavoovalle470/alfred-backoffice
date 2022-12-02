import { TestBed } from '@angular/core/testing';

import { MenulinkService } from './menulink.service';

describe('MenulinkService', () => {
  let service: MenulinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenulinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
