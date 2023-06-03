import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAttendanceReportComponent } from './daily-attendance-report.component';

describe('DailyAttendanceReportComponent', () => {
  let component: DailyAttendanceReportComponent;
  let fixture: ComponentFixture<DailyAttendanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
