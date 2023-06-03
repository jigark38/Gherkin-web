import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropRateComponent } from './crop-rate.component';

describe('CropRateComponent', () => {
  let component: CropRateComponent;
  let fixture: ComponentFixture<CropRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
