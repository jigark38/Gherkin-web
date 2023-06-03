import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePunchDetailsComponent } from './attendance-punch-details.component';

describe('AttendancePunchDetailsComponent', () => {
  let component: AttendancePunchDetailsComponent;
  let fixture: ComponentFixture<AttendancePunchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendancePunchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancePunchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
