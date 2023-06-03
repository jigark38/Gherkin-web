import { TestBed } from '@angular/core/testing';

import { InWardReportService } from './in-ward-report.service';

describe('InWardReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InWardReportService = TestBed.get(InWardReportService);
    expect(service).toBeTruthy();
  });
});
