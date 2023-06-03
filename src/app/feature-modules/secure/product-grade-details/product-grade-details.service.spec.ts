import { TestBed } from '@angular/core/testing';

import { ProductGradeDetailsService } from './product-grade-details.service';

describe('ProductGradeDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductGradeDetailsService = TestBed.get(ProductGradeDetailsService);
    expect(service).toBeTruthy();
  });
});
