import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmerWiseSummaryComponent } from './farmer-wise-summary.component';

describe('FarmerWiseSummaryComponent', () => {
  let component: FarmerWiseSummaryComponent;
  let fixture: ComponentFixture<FarmerWiseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerWiseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerWiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
