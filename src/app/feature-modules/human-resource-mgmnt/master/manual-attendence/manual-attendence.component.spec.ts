import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAttendenceComponent } from './manual-attendence.component';

describe('ManualAttendenceComponent', () => {
  let component: ManualAttendenceComponent;
  let fixture: ComponentFixture<ManualAttendenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAttendenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
