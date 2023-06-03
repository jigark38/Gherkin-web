import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingWeightmentDetailsComponent } from './grading-weightment-details.component';

describe('GradingWeightmentDetailsComponent', () => {
  let component: GradingWeightmentDetailsComponent;
  let fixture: ComponentFixture<GradingWeightmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradingWeightmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradingWeightmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
