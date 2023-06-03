import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardSearchComponent } from './inward-search.component';

describe('InwardSearchComponent', () => {
  let component: InwardSearchComponent;
  let fixture: ComponentFixture<InwardSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
