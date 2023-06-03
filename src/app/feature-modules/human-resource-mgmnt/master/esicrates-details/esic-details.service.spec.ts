import { TestBed } from '@angular/core/testing';

import { EsicDetailsService } from './esic-details.service';

describe('EsicDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsicDetailsService = TestBed.get(EsicDetailsService);
    expect(service).toBeTruthy();
  });
});
