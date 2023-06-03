import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyHolidaysListComponent } from './yearly-holidays-list.component';

describe('YearlyHolidaysListComponent', () => {
  let component: YearlyHolidaysListComponent;
  let fixture: ComponentFixture<YearlyHolidaysListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyHolidaysListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyHolidaysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
