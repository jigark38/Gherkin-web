import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyHarvestDetailsComponent } from './daily-harvest-details.component';

describe('DailyHarvestDetailsComponent', () => {
  let component: DailyHarvestDetailsComponent;
  let fixture: ComponentFixture<DailyHarvestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyHarvestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyHarvestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
