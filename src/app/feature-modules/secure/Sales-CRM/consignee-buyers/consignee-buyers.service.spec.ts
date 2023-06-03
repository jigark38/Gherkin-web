import { TestBed } from '@angular/core/testing';

import { ConsigneeBuyersService } from './consignee-buyers.service';

describe('ConsigneeBuyersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsigneeBuyersService = TestBed.get(ConsigneeBuyersService);
    expect(service).toBeTruthy();
  });
});
