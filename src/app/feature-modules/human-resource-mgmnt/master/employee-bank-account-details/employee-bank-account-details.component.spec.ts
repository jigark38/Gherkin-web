import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBankAccountDetailsComponent } from './employee-bank-account-details.component';

describe('EmployeeBankAccountDetailsComponent', () => {
  let component: EmployeeBankAccountDetailsComponent;
  let fixture: ComponentFixture<EmployeeBankAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeBankAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBankAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
