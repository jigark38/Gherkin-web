import { TestBed } from '@angular/core/testing';

import { DailyAttendanceReportService } from './daily-attendance-report.service';

describe('DailyAttendanceReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyAttendanceReportService = TestBed.get(DailyAttendanceReportService);
    expect(service).toBeTruthy();
  });
});
