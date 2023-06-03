import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { inherits } from 'util';
import { ShiftDetails } from './shift-details.model';
import { ShiftDetailsService } from './shift-details.service';
import moment from 'moment';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MatSelect, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';

@Component({
  selector: 'app-shift-details',
  templateUrl: './shift-details.component.html',
  styleUrls: ['./shift-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: GHERKIN_DATE_FORMATS },
  ],
})
export class ShiftDetailsComponent implements OnInit {
  shiftForm: FormGroup;
  shiftList: ShiftDetails[] = null;

  disableSaveButton = true;
  disableCancelButton = true;
  disableModButton = true;
  //  disableClearButton = true;
  disableNewButton = false;

  // edit
  isModifyMode = false;
  selectedRowShiftNo: number;

  userData: any;
  // check for cancle errors
  showStatusError = false;
  showCancelDateError = false;
  min = 0;
  max = 10;
  @ViewChild('entryDateInput', { static: false }) entryDateInputRef: ElementRef;
  @ViewChild('shiftCanelSelect', { static: false }) shiftCanelMatSelect: MatSelect;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;

  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  constructor(
    private shiftSerivce: ShiftDetailsService, private alertService: AlertService,
    private authService: AuthenticationService) {
    this.userData = this.authService.getUserdetails();
  }

  ngOnInit() {
    this.initalizeForm();
    this.onClearClick();
  }
  initalizeForm(): void {
    try {
      this.shiftForm = new FormGroup({
        shiftNo: new FormControl(1),
        entryDate: new FormControl('', [Validators.required]),
        empID: new FormControl(), // this.userData.userName),
        enteredBy: new FormControl(this.userData.userName),
        shiftEffectiveDate: new FormControl('', [Validators.required]),
        shiftName: new FormControl('', [Validators.required]),
        shiftTimeFrom: new FormControl(null, [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]),
        shiftTimeTo: new FormControl(null, [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]),
        shiftDuration: new FormControl(null, [Validators.required]),
        shiftBreakTimeFrom: new FormControl(null, [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]),
        shiftBreakTimeTo: new FormControl(null, [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]),
        shiftBreakDuration: new FormControl(null),
        ShiftRotation: new FormControl('', [Validators.required]),
        shiftRotationDays: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        shiftStatus: new FormControl(),
        shiftCancellationEffectiveFromDate: new FormControl(null),
      });
    } catch (error) {
      console.log('Error on initalizeForm: ', error);
    }
  }
  shiftTimeChange() {
    try {
      if (this.shiftForm.controls.shiftTimeFrom.touched && this.shiftForm.controls.shiftTimeFrom.valid
        && this.shiftForm.controls.shiftTimeTo.touched && this.shiftForm.controls.shiftTimeTo.valid) {
        const from = this.shiftForm.controls.shiftTimeFrom.value;
        const to = this.shiftForm.controls.shiftTimeTo.value;
        const fromVal = from.split(':');
        let fromMins = +fromVal[1];
        fromMins += fromVal[0] * 60;

        const toVal = to.split(':');
        let toMins = +toVal[1];
        toMins += toVal[0] * 60;
        if (fromMins > toMins) {
          toMins += 1440;
        }
        const durationMin = toMins - fromMins;
        const durationHrs = Math.trunc(durationMin / 60);
        const durationMins = durationMin % 60;
        this.shiftForm.controls.shiftDuration.setValue(durationHrs + ':' + durationMins);

      } else {
        this.shiftForm.controls.shiftDuration.setValue('00:00');
      }
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  breakTimeChange() {
    try {
      if (this.shiftForm.controls.shiftBreakTimeFrom.touched && this.shiftForm.controls.shiftBreakTimeFrom.valid
        && this.shiftForm.controls.shiftBreakTimeTo.touched && this.shiftForm.controls.shiftBreakTimeTo.valid) {
        const from = this.shiftForm.controls.shiftBreakTimeFrom.value;
        const to = this.shiftForm.controls.shiftBreakTimeTo.value;
        const fromVal = from.split(':');
        let fromMins = +fromVal[1];
        fromMins += fromVal[0] * 60;

        const toVal = to.split(':');
        let toMins = +toVal[1];
        toMins += toVal[0] * 60;
        if (fromMins > toMins) {
          toMins += 1440;
        }
        const durationMin = toMins - fromMins;
        const durationHrs = Math.trunc(durationMin / 60);
        const durationMins = durationMin % 60;
        this.shiftForm.controls.shiftBreakDuration.setValue(durationHrs + ':' + durationMins);

      } else {
        this.shiftForm.controls.shiftBreakDuration.setValue('00:00');
      }

    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  rowSelected(model: ShiftDetails) {
    try {
      if (!this.isModifyMode) {
        return;
      }
      this.selectedRowShiftNo = model.shiftNo;
      this.shiftForm.disable();
      this.shiftForm.controls.shiftStatus.enable();

      this.shiftForm.controls.shiftCancellationEffectiveFromDate.enable();
      this.disableSaveButton = false;
      this.populateModifyFields(model);
      setTimeout(() => {
        this.shiftCanelMatSelect.focus();
      }, 100);
    } catch (error) {

    }
  }

  focusOutShiftRotationDay() {
    try {
      if (!this.isModifyMode && this.shiftForm.valid) {
        this.saveButton.nativeElement.focus();
      }
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  focusOutShiftCancel() {
    try {
      if (this.isModifyMode) {
        if (this.shiftForm.controls.shiftStatus.touched
          && this.shiftForm.controls.shiftStatus.value != null
          && this.shiftForm.controls.shiftStatus.status === 'VALID') {
          this.showStatusError = false;
        } else {
          this.showStatusError = true;
        }
      }
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }
  paginate(e) {
    try {
      this.min = (+e.first);
      this.max = (+e.first + +e.rows);
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }
  cancellationDateChange(date: any) {
    try {
      if (this.isModifyMode) {
        if (this.shiftForm.controls.shiftCancellationEffectiveFromDate.touched
          && this.shiftForm.controls.shiftCancellationEffectiveFromDate.value != null
          && this.shiftForm.controls.shiftCancellationEffectiveFromDate.status === 'VALID') {
          this.showCancelDateError = false;
        } else {
          this.showCancelDateError = true;
        }
      }
      this.saveButton.nativeElement.focus();
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }
  populateModifyFields(model: ShiftDetails) {
    try {
      this.shiftForm.controls.shiftNo.setValue(model.shiftNo);
      this.shiftForm.controls.entryDate.setValue(model.entryDate);
      this.shiftForm.controls.shiftEffectiveDate.setValue(model.shiftEffectiveDate);
      this.shiftForm.controls.shiftName.setValue(model.shiftName);
      this.shiftForm.controls.shiftTimeFrom.setValue(model.shiftTimeFrom);
      this.shiftForm.controls.shiftTimeTo.setValue(model.shiftTimeTo);
      this.shiftForm.controls.shiftDuration.setValue(model.shiftDuration);
      this.shiftForm.controls.shiftBreakTimeFrom.setValue(model.shiftBreakTimeFrom);
      this.shiftForm.controls.shiftBreakTimeTo.setValue(model.shiftBreakTimeTo);
      this.shiftForm.controls.shiftBreakDuration.setValue(model.shiftBreakDuration);
      this.shiftForm.controls.ShiftRotation.setValue(model.ShiftRotation);
      this.shiftForm.controls.shiftRotationDays.setValue(model.shiftRotationDays);
      this.shiftForm.controls.shiftStatus.setValue(model.shiftStatus);
      this.shiftForm.controls.shiftCancellationEffectiveFromDate.setValue(model.shiftCancellationEffectiveFromDate);
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  getShiftDetails(): ShiftDetails {
    try {
      if (this.shiftForm.valid) {
        const shiftDetails = new ShiftDetails();
        shiftDetails.shiftNo = this.shiftForm.controls.shiftNo.value;
        shiftDetails.empID = this.userData.userId;
        shiftDetails.entryDate = this.shiftForm.controls.entryDate.value;
        shiftDetails.shiftEffectiveDate = this.shiftForm.controls.shiftEffectiveDate.value;
        shiftDetails.shiftName = this.shiftForm.controls.shiftName.value;
        shiftDetails.shiftTimeFrom = this.shiftForm.controls.shiftTimeFrom.value;
        shiftDetails.shiftTimeTo = this.shiftForm.controls.shiftTimeTo.value;
        shiftDetails.shiftDuration = this.shiftForm.controls.shiftDuration.value;
        shiftDetails.shiftBreakTimeFrom = this.shiftForm.controls.shiftBreakTimeFrom.value;
        shiftDetails.shiftBreakTimeTo = this.shiftForm.controls.shiftBreakTimeTo.value;
        shiftDetails.shiftBreakDuration = this.shiftForm.controls.shiftBreakDuration.value;
        shiftDetails.ShiftRotation = this.shiftForm.controls.ShiftRotation.value;
        shiftDetails.shiftRotationDays = this.shiftForm.controls.shiftRotationDays.value;
        shiftDetails.shiftStatus = this.shiftForm.controls.shiftStatus.value;
        shiftDetails.shiftCancellationEffectiveFromDate = this.shiftForm.controls.shiftCancellationEffectiveFromDate.value;
        return shiftDetails;
      } else {
        this.shiftForm.markAllAsTouched();
        return null;
      }
    } catch (error) {
      console.log('Error on getPOP: ', error);
    }
  }

  onSave() {
    try {
      const sDetails: ShiftDetails = this.getShiftDetails();
      if (!sDetails) {
        return;
      }
      if (this.isModifyMode) {
        if (this.shiftForm.controls.shiftStatus.value == null) {
          this.showStatusError = true;
        }
        if (this.shiftForm.controls.shiftCancellationEffectiveFromDate.value == null) {
          this.showCancelDateError = true;
        }
        if (this.showStatusError || this.showCancelDateError) {
          return;
        }
        this.disableSaveButton = true;
        this.shiftSerivce.cancelShift(sDetails).subscribe(() => {
          this.alertService.success('Shift Cancellation Details Saved Successfully.');
          this.onClearClick();
        }, err => {
          this.alertService.error('Error has occured while canceling shift.');
          this.disableSaveButton = false;
        });
      } else {
        this.disableSaveButton = true;
        sDetails.shiftNo = 0;
        this.shiftSerivce.saveShiftDetails(sDetails).subscribe(() => {
          this.alertService.success('"Shift Details" Saved Successfully.');
          this.onClearClick();
        }, err => {
          this.alertService.error('Error has occured while saving Shift Details.');
        });
      }
    } catch (error) {
      this.disableSaveButton = false;
      console.log('Error on onSavePOP: ', error);
    }
  }

  onNewShiftClick() {
    this.shiftList = [];
    this.shiftForm.enable();
    this.shiftForm.controls.enteredBy.setValue(this.userData.userName);
    this.shiftForm.controls.enteredBy.disable();
    this.shiftForm.controls.shiftDuration.disable();
    this.shiftForm.controls.shiftBreakDuration.disable();
    this.disableSaveButton = false;
    this.disableModButton = true;
    this.disableCancelButton = true;
    //  this.disableClearButton = false;
    this.disableNewButton = true;
    this.isModifyMode = false;

    this.shiftForm.controls.entryDate.setValue(new Date());
    setTimeout(() => {
      this.entryDateInputRef.nativeElement.focus();
    }, 100);

  }
  getShiftList() {
    try {
      this.shiftSerivce.getShiftList().subscribe((res: ShiftDetails[]) => {
        if (res) {
          this.shiftList = res;
          // slicing timespan(00:00:00) as timepicker only accepts 00:00(not seconds)
          this.shiftList.map(x => x.shiftTimeFrom = x.shiftTimeFrom.slice(0, 5));
          this.shiftList.map(x => x.shiftTimeTo = x.shiftTimeTo.slice(0, 5));
          this.shiftList.map(x => x.shiftDuration = x.shiftDuration.slice(0, 5));
          this.shiftList.map(x => x.shiftBreakTimeFrom = x.shiftBreakTimeFrom.slice(0, 5));
          this.shiftList.map(x => x.shiftBreakTimeTo = x.shiftBreakTimeTo.slice(0, 5));
          this.shiftList.map(x => x.shiftBreakDuration = x.shiftBreakDuration.slice(0, 5));
        }
      });
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }
  // Button Click events
  onClearClick() {
    try {
      this.isModifyMode = false;
      this.shiftForm.reset();
      this.shiftList = [];
      this.shiftForm.disable();
      this.disableSaveButton = true;
      this.disableCancelButton = false;
      this.disableModButton = true;
      //      this.disableClearButton = true;
      this.disableNewButton = false;
      this.showCancelDateError = false;
      this.showStatusError = false;
      this.selectedRowShiftNo = 0;
      this.min = 0;
      this.max = 10;
      this.getShiftList();

    } catch (error) {
      console.log('Error on onClearClick: ', error);
    }
  }
  onModClick() { }
  onCancelClick() {
    this.disableCancelButton = true;
    this.isModifyMode = true;
    this.disableModButton = true;
    //    this.disableClearButton = false;
    this.disableNewButton = true;
    setTimeout(() => {
      //  this.cropGroupMatSelect.focus();
    }, 100);

  }
}



