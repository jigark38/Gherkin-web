import { TestBed } from '@angular/core/testing';

import { DialyGreensService } from './dialy-greens.service';

describe('DialyGreensService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialyGreensService = TestBed.get(DialyGreensService);
    expect(service).toBeTruthy();
  });
});
