import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalTaxRatesComponent } from './professional-tax-rates.component';

describe('ProfessionalTaxRatesComponent', () => {
  let component: ProfessionalTaxRatesComponent;
  let fixture: ComponentFixture<ProfessionalTaxRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalTaxRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalTaxRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
