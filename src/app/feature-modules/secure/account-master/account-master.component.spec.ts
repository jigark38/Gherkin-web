import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMasterComponent } from './account-master.component';

describe('AccountMasterComponent', () => {
  let component: AccountMasterComponent;
  let fixture: ComponentFixture<AccountMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
