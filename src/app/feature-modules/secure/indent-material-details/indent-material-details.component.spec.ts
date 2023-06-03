import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentMaterialDetailsComponent } from './indent-material-details.component';

describe('IndentMaterialDetailsComponent', () => {
  let component: IndentMaterialDetailsComponent;
  let fixture: ComponentFixture<IndentMaterialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentMaterialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentMaterialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
