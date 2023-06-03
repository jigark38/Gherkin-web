import { TestBed } from '@angular/core/testing';

import { IndentMaterialDetailsService } from './indent-material-details.service';

describe('IndentMaterialDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndentMaterialDetailsService = TestBed.get(IndentMaterialDetailsService);
    expect(service).toBeTruthy();
  });
});
