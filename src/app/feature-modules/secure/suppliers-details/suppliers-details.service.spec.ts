import { TestBed } from '@angular/core/testing';

import { SuppliersDetailsService } from './suppliers-details.service';

describe('SuppliersDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuppliersDetailsService = TestBed.get(SuppliersDetailsService);
    expect(service).toBeTruthy();
  });
});
