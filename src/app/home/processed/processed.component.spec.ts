import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedComponent } from './processed.component';

describe('ProcessedComponent', () => {
  let component: ProcessedComponent;
  let fixture: ComponentFixture<ProcessedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
