import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseAttendanceFinalizationComponent } from './daywise-attendance-finalization.component';

describe('DaywiseAttendanceFinalizationComponent', () => {
  let component: DaywiseAttendanceFinalizationComponent;
  let fixture: ComponentFixture<DaywiseAttendanceFinalizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaywiseAttendanceFinalizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseAttendanceFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
