import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenReceiptQualityTestingComponent } from './green-receipt-quality-testing.component';

describe('GreenReceiptQualityTestingComponent', () => {
  let component: GreenReceiptQualityTestingComponent;
  let fixture: ComponentFixture<GreenReceiptQualityTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreenReceiptQualityTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenReceiptQualityTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
