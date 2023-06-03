import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengSidenavbarComponent } from './primeng-sidenavbar.component';

describe('PrimengSidenavbarComponent', () => {
  let component: PrimengSidenavbarComponent;
  let fixture: ComponentFixture<PrimengSidenavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimengSidenavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengSidenavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
