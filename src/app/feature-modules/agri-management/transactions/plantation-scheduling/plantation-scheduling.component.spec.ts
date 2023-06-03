import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantationSchedulingComponent } from './plantation-scheduling.component';

describe('PlantationSchedulingComponent', () => {
  let component: PlantationSchedulingComponent;
  let fixture: ComponentFixture<PlantationSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantationSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantationSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
