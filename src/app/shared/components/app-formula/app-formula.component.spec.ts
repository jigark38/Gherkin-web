import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormulaComponent } from './app-formula.component';

describe('AppFormulaComponent', () => {
  let component: AppFormulaComponent;
  let fixture: ComponentFixture<AppFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
