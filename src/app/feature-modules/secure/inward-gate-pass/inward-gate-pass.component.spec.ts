import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardGatePassComponent } from './inward-gate-pass.component';

describe('InwardGatePassComponent', () => {
  let component: InwardGatePassComponent;
  let fixture: ComponentFixture<InwardGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
