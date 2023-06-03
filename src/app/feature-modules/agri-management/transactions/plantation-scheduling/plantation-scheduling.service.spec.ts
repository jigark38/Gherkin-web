import { TestBed } from '@angular/core/testing';

import { PlantationSchedulingService } from './plantation-scheduling.service';

describe('PlantationSchedulingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlantationSchedulingService = TestBed.get(PlantationSchedulingService);
    expect(service).toBeTruthy();
  });
});
