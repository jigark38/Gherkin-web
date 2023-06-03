import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialStocksComponent } from './raw-material-stocks.component';

describe('RawMaterialStocksComponent', () => {
  let component: RawMaterialStocksComponent;
  let fixture: ComponentFixture<RawMaterialStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
