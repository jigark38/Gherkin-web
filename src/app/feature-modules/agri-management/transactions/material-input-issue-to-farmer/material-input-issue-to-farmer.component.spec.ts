import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInputIssueToFarmerComponent } from './material-input-issue-to-farmer.component';

describe('MaterialInputIssueToFarmerComponent', () => {
  let component: MaterialInputIssueToFarmerComponent;
  let fixture: ComponentFixture<MaterialInputIssueToFarmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInputIssueToFarmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInputIssueToFarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
