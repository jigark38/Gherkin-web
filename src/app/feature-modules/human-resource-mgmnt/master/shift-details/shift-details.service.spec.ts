import { TestBed } from '@angular/core/testing';

import { ShiftDetailsService } from './shift-details.service';

describe('ShiftDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShiftDetailsService = TestBed.get(ShiftDetailsService);
    expect(service).toBeTruthy();
  });
});
