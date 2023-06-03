import { TestBed } from '@angular/core/testing';

import { AuthorizationValidatorService } from './authorization-validator.service';

describe('AuthorizationValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthorizationValidatorService = TestBed.get(AuthorizationValidatorService);
    expect(service).toBeTruthy();
  });
});
