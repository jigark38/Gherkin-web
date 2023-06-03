import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CullingPackDetailsComponent } from './culling-pack-details.component';

describe('CullingPackDetailsComponent', () => {
  let component: CullingPackDetailsComponent;
  let fixture: ComponentFixture<CullingPackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingPackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingPackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
