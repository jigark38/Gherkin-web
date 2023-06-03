import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreensTransportVehicleScheduleComponent } from './greens-transport-vehicle-schedule.component';

describe('GreensTransportVehicleScheduleComponent', () => {
  let component: GreensTransportVehicleScheduleComponent;
  let fixture: ComponentFixture<GreensTransportVehicleScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreensTransportVehicleScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreensTransportVehicleScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
