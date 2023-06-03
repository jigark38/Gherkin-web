import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedandInputTransferComponent } from './feedand-input-transfer.component';

describe('FeedandInputTransferComponent', () => {
  let component: FeedandInputTransferComponent;
  let fixture: ComponentFixture<FeedandInputTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedandInputTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedandInputTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
