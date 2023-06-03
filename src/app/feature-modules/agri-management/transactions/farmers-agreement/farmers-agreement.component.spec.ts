import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmersAgreementComponent } from './farmers-agreement.component';

describe('FarmersAgreementComponent', () => {
  let component: FarmersAgreementComponent;
  let fixture: ComponentFixture<FarmersAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmersAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmersAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
