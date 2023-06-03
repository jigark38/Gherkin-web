import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGreensComponent } from './daily-greens.component';

describe('DailyGreensComponent', () => {
  let component: DailyGreensComponent;
  let fixture: ComponentFixture<DailyGreensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyGreensComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyGreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
