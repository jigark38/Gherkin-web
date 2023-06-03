import { TestBed } from '@angular/core/testing';

import { WebservicewrapperService } from './webservicewrapper.service';

describe('WebservicewrapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebservicewrapperService = TestBed.get(WebservicewrapperService);
    expect(service).toBeTruthy();
  });
});
