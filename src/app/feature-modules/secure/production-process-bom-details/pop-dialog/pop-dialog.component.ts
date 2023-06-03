import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog, MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-pop-dialog',
  templateUrl: './pop-dialog.component.html',
  styleUrls: ['./pop-dialog.component.css']
})
export class PopDialogComponent implements OnInit, OnChanges {
  @ViewChild('auto', { static: false }) auto: MatAutocompleteTrigger;
  selectedOptionValue: string;
  @Input() placeholder = '';
  @Input() selectedValueFormControl = new FormControl();
  @Input() options: string[];
  @Input() maxLength: number;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options && changes.options) {
      this.filterValues(this.selectedValue);
    }
  }

  filterValues(value: string) {
    if (value) {
      this.matchedOptions = this._filter(value);
    } else {
      this.matchedOptions = null;
    }
  }

  optionSelected(event) {
    this.selectedOptionValue = event.option.value;
    this.selectedValueChange.emit(this.selectedOptionValue);
  }

  blurTextbox(obj) {
    this.selectedOptionValue = obj.currentTarget.value;
    this.selectedValueChange.emit(this.selectedOptionValue);
    if (!this.auto.panelOpen) {
      this.selectedValueChangeBlur.emit(this.selectedOptionValue);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
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
}
