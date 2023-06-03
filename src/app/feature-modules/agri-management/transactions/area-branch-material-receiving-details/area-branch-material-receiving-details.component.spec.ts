import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaBranchMaterialReceivingDetailsComponent } from './area-branch-material-receiving-details.component';

describe('AreaBranchMaterialReceivingDetailsComponent', () => {
  let component: AreaBranchMaterialReceivingDetailsComponent;
  let fixture: ComponentFixture<AreaBranchMaterialReceivingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaBranchMaterialReceivingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaBranchMaterialReceivingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
