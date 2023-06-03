import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldstaffdetailsComponent } from './fieldstaffdetails.component';

describe('FieldstaffdetailsComponent', () => {
  let component: FieldstaffdetailsComponent;
  let fixture: ComponentFixture<FieldstaffdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldstaffdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldstaffdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
