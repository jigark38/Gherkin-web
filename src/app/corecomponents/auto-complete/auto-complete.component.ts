import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatAutocompleteTrigger } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EditItemDialogComponent } from '../edit-item-dialog/edit-item-dialog.component';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit, OnChanges {

  @ViewChild('auto', { static: false }) auto: MatAutocompleteTrigger;

  selectedOptionValue: string;
  @Input() placeholder = '';
  @Input() selectedValueFormControl = new FormControl();
  @Input() options: string[];
  @Input() maxLength: number;
  @Input() isEditAllow: boolean;
  @Output() selectedValueChangeBlur = new EventEmitter();
  @Input()
  get selectedValue(): string {
    return this.selectedOptionValue;
  }
  @Output() selectedValueChange = new EventEmitter();
  // tslint:disable-next-line: adjacent-overload-signatures
  set selectedValue(val) {
    this.selectedOptionValue = val;
    this.selectedValueChange.emit(this.selectedOptionValue);
  }

  @Output() saveitemToList = new EventEmitter();
  @Output() updateItemToList = new EventEmitter();
  matchedOptions: string[];
  filteredOptions: Observable<string[]>;
  notMatched: boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.selectedValueFormControl.valueChanges
      .subscribe((value) => {
        this.filterValues(value);
      }
      );
  }


  openPopup(selectedValue: string) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do You Want to save \'<b>' + selectedValue + '</b>\'?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveitemToList.emit(this.selectedValue.trim());
      } else {

      }

    });
  }


  openPopupForEdit(selectedValue: string) {
    const oldVal = selectedValue;

    const dialogRef = this.dialog.open(EditItemDialogComponent, {
      width: '350px',
      data: oldVal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateItemToList.emit({ oldValue: oldVal, newValue: result });
      } else {

      }

    });
  }

  filterValues(value: string) {
    if (value) {
      this.matchedOptions = this._filter(value);
    } else {
      this.notMatched = false;
      this.matchedOptions = this.options;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options && changes.options) {
      // console.log(changes.options);
      this.filterValues(this.selectedValue);
    }
  }

  editItem(e) {
    this.openPopupForEdit(e);
  }

  optionSelected(event) {
    this.selectedOptionValue = event.option.value;
    this.selectedValueChange.emit(this.selectedOptionValue);
  }

  blurTextbox(obj) {
    this.selectedOptionValue = obj.currentTarget.value;
    this.selectedValueChange.emit(this.selectedOptionValue);
    // setTimeout(() => {
    if (!this.auto.panelOpen) {
      this.selectedValueChangeBlur.emit(this.selectedOptionValue);
    }
    // }, 100);

  }

  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    if (this.options) {
      const matched = this.options.filter(option => option.toLowerCase().includes(filterValue));
      if (matched && matched.length === 0) {
        this.notMatched = true;
      } else {
        this.notMatched = false;
      }
      return matched;
    }
    return this.options;
  }

  addField() {
    this.openPopup(this.selectedValue);
    // this.saveitemToList.emit(this.selectedValue);
  }

}
