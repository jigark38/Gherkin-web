import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionScheduleDetailsComponent } from './production-schedule-details.component';

describe('ProductionScheduleDetailsComponent', () => {
  let component: ProductionScheduleDetailsComponent;
  let fixture: ComponentFixture<ProductionScheduleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionScheduleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
