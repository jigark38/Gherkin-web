import { TestBed } from '@angular/core/testing';

import { CropRateService } from './crop-rate.service';

describe('CropRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CropRateService = TestBed.get(CropRateService);
    expect(service).toBeTruthy();
  });
});
