import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGridComponent } from './ng-grid.component';

describe('NgGridComponent', () => {
  let component: NgGridComponent;
  let fixture: ComponentFixture<NgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
