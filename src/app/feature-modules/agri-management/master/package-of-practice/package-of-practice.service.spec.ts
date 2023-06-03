import { TestBed } from '@angular/core/testing';
import { PackageOfPracticeService } from './package-of-practice.service';

describe('PackageOfPracticeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackageOfPracticeService = TestBed.get(PackageOfPracticeService);
    expect(service).toBeTruthy();
  });
});
