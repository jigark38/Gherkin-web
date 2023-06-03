import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackedInventoryComponent } from './packed-inventory.component';

describe('PackedInventoryComponent', () => {
  let component: PackedInventoryComponent;
  let fixture: ComponentFixture<PackedInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackedInventoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
