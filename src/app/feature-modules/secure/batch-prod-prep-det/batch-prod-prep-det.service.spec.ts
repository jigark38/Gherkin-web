import { TestBed } from '@angular/core/testing';

import { BatchProdPrepDetService } from './batch-prod-prep-det.service';

describe('BatchProdPrepDetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BatchProdPrepDetService = TestBed.get(BatchProdPrepDetService);
    expect(service).toBeTruthy();
  });
});
