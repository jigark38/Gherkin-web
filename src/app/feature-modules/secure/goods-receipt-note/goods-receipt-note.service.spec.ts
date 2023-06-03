import { TestBed } from '@angular/core/testing';

import { GoodsReceiptNoteService } from './goods-receipt-note.service';

describe('GoodsReceiptNoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoodsReceiptNoteService = TestBed.get(GoodsReceiptNoteService);
    expect(service).toBeTruthy();
  });
});
