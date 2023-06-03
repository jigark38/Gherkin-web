import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsTransferDetailsComponent } from './inputs-transfer-details.component';

describe('InputsTransferDetailsComponent', () => {
  let component: InputsTransferDetailsComponent;
  let fixture: ComponentFixture<InputsTransferDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsTransferDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
