import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAndDesignationComponent } from './department-and-designation.component';

describe('DepartmentAndDesignationComponent', () => {
  let component: DepartmentAndDesignationComponent;
  let fixture: ComponentFixture<DepartmentAndDesignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentAndDesignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentAndDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
