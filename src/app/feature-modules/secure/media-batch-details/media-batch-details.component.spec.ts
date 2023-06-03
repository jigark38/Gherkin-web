import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaBatchDetailsComponent } from './media-batch-details.component';

describe('MediaBatchDetailsComponent', () => {
  let component: MediaBatchDetailsComponent;
  let fixture: ComponentFixture<MediaBatchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaBatchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaBatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
