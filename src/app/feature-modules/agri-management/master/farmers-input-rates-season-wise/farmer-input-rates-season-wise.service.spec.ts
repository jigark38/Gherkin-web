import { TestBed } from '@angular/core/testing';

import { FarmerInputRatesSeasonWiseService } from './farmer-input-rates-season-wise.service';

describe('FarmerInputRatesSeasonWiseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FarmerInputRatesSeasonWiseService = TestBed.get(FarmerInputRatesSeasonWiseService);
    expect(service).toBeTruthy();
  });
});
