import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingMaterialDetailsComponent } from './buying-material-details.component';

describe('BuyingMaterialDetailsComponent', () => {
  let component: BuyingMaterialDetailsComponent;
  let fixture: ComponentFixture<BuyingMaterialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingMaterialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingMaterialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
