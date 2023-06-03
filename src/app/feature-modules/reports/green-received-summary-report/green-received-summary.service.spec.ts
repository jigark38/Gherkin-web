import { TestBed } from '@angular/core/testing';

import { GreenReceivedSummaryService } from './green-received-summary.service';

describe('GreenReceivedSummaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GreenReceivedSummaryService = TestBed.get(GreenReceivedSummaryService);
    expect(service).toBeTruthy();
  });
});
