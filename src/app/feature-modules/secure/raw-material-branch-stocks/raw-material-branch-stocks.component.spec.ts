import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialBranchStocksComponent } from './raw-material-branch-stocks.component';

describe('RawMaterialBranchStocksComponent', () => {
  let component: RawMaterialBranchStocksComponent;
  let fixture: ComponentFixture<RawMaterialBranchStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialBranchStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialBranchStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
