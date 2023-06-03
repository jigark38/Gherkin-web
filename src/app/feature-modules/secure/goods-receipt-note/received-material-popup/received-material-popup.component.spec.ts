import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedMaterialPopupComponent } from './received-material-popup.component';

describe('ReceivedMaterialPopupComponent', () => {
  let component: ReceivedMaterialPopupComponent;
  let fixture: ComponentFixture<ReceivedMaterialPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedMaterialPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedMaterialPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
