import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGreensInwardReportComponent } from './daily-greens-inward-report.component';

describe('DailyGreensInwardReportComponent', () => {
  let component: DailyGreensInwardReportComponent;
  let fixture: ComponentFixture<DailyGreensInwardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyGreensInwardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyGreensInwardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
