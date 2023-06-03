import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTranToAreaOfficeOgpComponent } from './mat-tran-to-area-office-ogp.component';

describe('MatTranToAreaOfficeOgpComponent', () => {
  let component: MatTranToAreaOfficeOgpComponent;
  let fixture: ComponentFixture<MatTranToAreaOfficeOgpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatTranToAreaOfficeOgpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTranToAreaOfficeOgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
