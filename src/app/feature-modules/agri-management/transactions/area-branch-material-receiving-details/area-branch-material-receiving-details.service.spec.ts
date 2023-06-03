import { TestBed } from '@angular/core/testing';

import { AreaBranchMaterialReceivingDetailsService } from './area-branch-material-receiving-details.service';

describe('AreaBranchMaterialReceivingDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AreaBranchMaterialReceivingDetailsService = TestBed.get(AreaBranchMaterialReceivingDetailsService);
    expect(service).toBeTruthy();
  });
});
