import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansAdvancesDetailsComponent } from './loans-advances-details.component';

describe('LoansAdvancesDetailsComponent', () => {
  let component: LoansAdvancesDetailsComponent;
  let fixture: ComponentFixture<LoansAdvancesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansAdvancesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansAdvancesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
