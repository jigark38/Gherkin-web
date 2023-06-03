import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGradeDetailsComponent } from './product-grade-details.component';

describe('ProductGradeDetailsComponent', () => {
  let component: ProductGradeDetailsComponent;
  let fixture: ComponentFixture<ProductGradeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGradeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGradeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
