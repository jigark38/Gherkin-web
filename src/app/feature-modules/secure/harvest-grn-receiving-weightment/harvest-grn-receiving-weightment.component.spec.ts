import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestGrnReceivingWeightmentComponent } from './harvest-grn-receiving-weightment.component';

describe('HarvestGrnReceivingWeightmentComponent', () => {
  let component: HarvestGrnReceivingWeightmentComponent;
  let fixture: ComponentFixture<HarvestGrnReceivingWeightmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestGrnReceivingWeightmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestGrnReceivingWeightmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
