import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsStockReportComponent } from './materials-stock-report.component';

describe('MaterialsStockReportComponent', () => {
  let component: MaterialsStockReportComponent;
  let fixture: ComponentFixture<MaterialsStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
