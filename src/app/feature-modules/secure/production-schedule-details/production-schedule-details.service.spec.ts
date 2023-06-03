import { TestBed } from '@angular/core/testing';

import { ProductionScheduleDetailsService } from './production-schedule-details.service';

describe('ProductionScheduleDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductionScheduleDetailsService = TestBed.get(ProductionScheduleDetailsService);
    expect(service).toBeTruthy();
  });
});
