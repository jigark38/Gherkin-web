import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestStageDetailsComponent } from './harvest-stage-details.component';

describe('HarvestStageDetailsComponent', () => {
  let component: HarvestStageDetailsComponent;
  let fixture: ComponentFixture<HarvestStageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestStageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestStageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
