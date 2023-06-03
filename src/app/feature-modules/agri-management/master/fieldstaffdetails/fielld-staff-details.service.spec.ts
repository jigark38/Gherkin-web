import { TestBed } from '@angular/core/testing';

import { FielldStaffDetailsService } from './fielld-staff-details.service';

describe('FielldStaffDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FielldStaffDetailsService = TestBed.get(FielldStaffDetailsService);
    expect(service).toBeTruthy();
  });
});
