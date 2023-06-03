import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComputationAndFinalizationComponent } from './salary-computation-and-finalization.component';

describe('SalaryComputationAndFinalizationComponent', () => {
  let component: SalaryComputationAndFinalizationComponent;
  let fixture: ComponentFixture<SalaryComputationAndFinalizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryComputationAndFinalizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryComputationAndFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
