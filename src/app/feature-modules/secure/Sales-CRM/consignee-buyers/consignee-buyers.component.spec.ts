import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeBuyersComponent } from './consignee-buyers.component';

describe('ConsigneeBuyersComponent', () => {
  let component: ConsigneeBuyersComponent;
  let fixture: ComponentFixture<ConsigneeBuyersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsigneeBuyersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
