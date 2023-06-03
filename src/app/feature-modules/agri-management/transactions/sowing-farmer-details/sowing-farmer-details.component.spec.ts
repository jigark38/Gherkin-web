import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SowingFarmerDetailsComponent } from './sowing-farmer-details.component';

describe('SowingFarmerDetailsComponent', () => {
  let component: SowingFarmerDetailsComponent;
  let fixture: ComponentFixture<SowingFarmerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowingFarmerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowingFarmerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
