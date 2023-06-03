import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProdPrepDetComponent } from './batch-prod-prep-det.component';

describe('BatchProdPrepDetComponent', () => {
  let component: BatchProdPrepDetComponent;
  let fixture: ComponentFixture<BatchProdPrepDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchProdPrepDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchProdPrepDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
