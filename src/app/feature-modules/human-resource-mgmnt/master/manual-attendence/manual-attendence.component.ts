import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { stat } from 'fs';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { ManualAttendenceBind, ManualAttendenceDto, StatusDate } from './manual-attendence.model';
import { ManualAttendenceService } from './manual-attendence.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-manual-attendence',
  templateUrl: './manual-attendence.component.html',
  styleUrls: ['./manual-attendence.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})



export class ManualAttendenceComponent implements OnInit {
  employeeId: string;
  employeeUserName: string;
  allAreas: any[];
  manualAttendenceList: ManualAttendenceDto[] = [];
  manualAttendenceBidingList: ManualAttendenceBind[] = [];
  manualAttendeceDataToBeSaved: ManualAttendenceDto[] = [];
  dateList: any[] = [];
  currentMonth: number;
  totalCount: number;
  pageIndex = 1;
  pageSize = 5;
  constructor(private service: WebservicewrapperService,
    // tslint:disable-next-line: align
    private manualAttendenceService: ManualAttendenceService,
    // tslint:disable-next-line: align
    private readonly authService: AuthenticationService,
    // tslint:disable-next-line: align
    private alertService: AlertService,
    // tslint:disable-next-line: align
    private datePipe: DatePipe) { }
  isNewEnabled: boolean;
  isSaveEnabled: boolean;
  isFindEnabled: boolean;
  isModifyEnabled: boolean;
  headerTitleMonth = 'Attendance Details';
  min = 0;
  max = 5;
  manualAttendenceForm = new FormGroup({
    loginUserName: new FormControl(''),
    fromDate: new FormControl('', [this.fromDateValidation.bind(this)]),
    toDate: new FormControl('', [this.toDateValidation.bind(this)]),
    area: new FormControl('', [Validators.required]),
    passingDate: new FormControl('')
  });

  ngOnInit() {
    this.isNewEnabled = true;
    this.isSaveEnabled = false;
    this.isFindEnabled = true;
    this.isModifyEnabled = true;
    this.manualAttendenceForm.disable();
    this.employeeId = this.authService.getUserdetails().userId;
    this.employeeUserName = this.authService.getUserdetails().userName;
    this.manualAttendenceForm.controls.loginUserName.setValue(this.employeeUserName);
    this.manualAttendenceForm.controls.loginUserName.disable();
    this.getAllHarvestArea();

  }

  new() {
    this.isNewEnabled = false;
    this.isSaveEnabled = true;
    this.isFindEnabled = false;
    this.isModifyEnabled = false;
    this.manualAttendenceForm.enable();
    this.manualAttendenceForm.controls.loginUserName.disable();
  }
  clear() {
    this.isNewEnabled = true;
    this.isSaveEnabled = false;
    this.isFindEnabled = true;
    this.isModifyEnabled = true;
    this.manualAttendenceForm.reset();
    this.manualAttendenceForm.disable();
    this.manualAttendenceForm.controls.loginUserName.disable();
    this.manualAttendenceBidingList = [];
    this.manualAttendeceDataToBeSaved = [];
    this.manualAttendenceList = [];
    this.totalCount = 0;
    this.min = 0;
    this.max = 5;
    this.pageIndex = 1;
    this.pageSize = 5;
    this.dateList = [];
  }

  editRow(attendence: ManualAttendenceBind, isEditDone: boolean) {
    attendence.show = !isEditDone;
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
    this.pageIndex = (this.max / 5);
    this.pageSize = 5;
    this.onAreaChange();
  }

  fromDateValidation(formControl: FormControl) {
    if (!formControl || !formControl.value) {
      return { error: 'From Date is Required.' };
    }
    let toDateValue: string;
    if (this.manualAttendenceForm.controls.toDate && this.manualAttendenceForm.controls.toDate.value) {
      toDateValue = this.manualAttendenceForm.controls.toDate.value;
    }

    const date = new Date(formControl.value);
    if (new Date() <= date) {
      return { error: 'From Date can not be today or future date.' };
    }
    if (date && date.getDate() !== 1) {
      return { error: 'From Date should be first day of the month.' };
    }
  }

  toDateValidation(formControl: FormControl) {
    if (!formControl || !formControl.value) {
      return { error: 'To Date is Required.' };
    }
    let fromDateValue: string;
    if (this.manualAttendenceForm.controls.fromDate && this.manualAttendenceForm.controls.fromDate.value) {
      fromDateValue = this.manualAttendenceForm.controls.fromDate.value;
    }

    const date = new Date(formControl.value);
    if (new Date() <= date) {
      return { error: 'To Date can not be today or future date.' };
    }
    if (date && !this.isLastDayOfMonth(date) ||
      (fromDateValue && new Date(fromDateValue).getMonth() !== date.getMonth())) {
      return { error: 'From Date should be last day of the month.' };
    }
  }

  blurToDate() {
    this.dateList = [];
    const fromDate = this.manualAttendenceForm.controls.fromDate.value;
    const toDate = this.manualAttendenceForm.controls.toDate.value;
    const date = new Date(toDate);
    const lastDay: number = date.getDate(); // new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    this.currentMonth = date.getMonth() + 1;
    if (toDate && fromDate && this.manualAttendenceForm.controls.toDate.valid) {
      for (let i = 1; i <= lastDay; i++) {
        const dateItem = new Date(date.getFullYear(), date.getMonth(), i);
        this.dateList.push({ date: dateItem, isWH: dateItem.getDay() === 0 });
      }
      this.headerTitleMonth = 'Attendance Details for ' + this.datePipe.transform(date, 'MMM');
    }
  }

  populateAttendenceList() {

    // let distinctEmp : string[] = [];
    const distinctEmp = [...new Set(this.manualAttendenceList.map(item => item.employeeID))];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < distinctEmp.length; i++) {
      const selectedEmp = distinctEmp[i];
      const manualAtt = new ManualAttendenceBind();
      manualAtt.statusDatePair = [];
      const matchedList = this.manualAttendenceList.filter(a => a.employeeID === selectedEmp);
      if (matchedList && matchedList.length > 0) {
        // this.manualAttendenceBidingList.push();

        manualAtt.employeeID = matchedList[0].employeeID;
        manualAtt.employeeName = matchedList[0].employeeName;
        manualAtt.areaId = matchedList[0].areaId;
        manualAtt.areaName = matchedList[0].areaName;
        manualAtt.designation = matchedList[0].designation;

        matchedList.map(a => {
          a.manualAttendanceDate = a.manualAttendanceDate === '0001-01-01T00:00:00' ? null : a.manualAttendanceDate;
          this.dateList.forEach(b => {
            const statusDate = new StatusDate();
            if (a.manualAttendanceDate && new Date(a.manualAttendanceDate).toLocaleDateString() === new Date(b.date).toLocaleDateString()) {
              statusDate.attendenceDate = new Date(a.manualAttendanceDate);
              if (a.manualAttendanceStatus) {
                statusDate.status = a.manualAttendanceStatus;
              } else {
                if (statusDate.attendenceDate.getDay() === 0) {
                  statusDate.status = 'WH';
                } else {
                  statusDate.status = 'P';
                }
              }
              statusDate.manualAttendanceID = a.manualAttendanceID;
              manualAtt.statusDatePair.push(statusDate);
            } else if (!a.manualAttendanceDate && new Date() > new Date(b.date)) {
              statusDate.attendenceDate = new Date(b.date);
              if (statusDate.attendenceDate.getDay() === 0) {
                statusDate.status = 'WH';
              } else {
                statusDate.status = 'P';
              }
              statusDate.manualAttendanceID = a.manualAttendanceID;
              manualAtt.statusDatePair.push(statusDate);
            }
          });
        });
        this.dateList.forEach(dt => {
          if (new Date() > new Date(dt.date) && !(manualAtt.statusDatePair.
            filter(att => new Date(att.attendenceDate).toLocaleDateString() === new Date(dt.date).toLocaleDateString())[0])) {
            const statusDate = new StatusDate();
            statusDate.attendenceDate = new Date(dt.date);
            if (statusDate.attendenceDate.getDay() === 0) {
              statusDate.status = 'WH';
            } else {
              statusDate.status = 'P';
            }
            statusDate.manualAttendanceID = manualAtt.manualAttendanceID;
            manualAtt.statusDatePair.push(statusDate);
          }
        });
        this.manualAttendenceBidingList.push(manualAtt);
      }


    }
  }

  isLastDayOfMonth(date) {
    return date.getDate() <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }


  prepareDateForSave() {
    this.manualAttendeceDataToBeSaved = [];
    this.manualAttendenceBidingList.forEach(manualAttendece => {
      manualAttendece.statusDatePair.forEach(statusPair => {
        if (statusPair && statusPair.attendenceDate && statusPair.status) {
          const newAttenObj = new ManualAttendenceDto();
          newAttenObj.areaId = manualAttendece.areaId;
          newAttenObj.areaName = manualAttendece.areaName;
          newAttenObj.manualAttendanceID = statusPair.manualAttendanceID ? statusPair.manualAttendanceID : 0;
          newAttenObj.manualAttendanceProcessID = manualAttendece.manualAttendanceProcessID ? manualAttendece.manualAttendanceProcessID : 0;
          newAttenObj.employeeID = manualAttendece.employeeID;
          newAttenObj.employeeName = manualAttendece.employeeName;
          newAttenObj.loginUserName = this.employeeId;
          newAttenObj.manualAttendanceDate = statusPair.attendenceDate.toLocaleDateString();
          newAttenObj.manualAttendanceStatus = statusPair.status;
          this.manualAttendeceDataToBeSaved.push(newAttenObj);
        }
      });
    });
  }

  save() {
    this.prepareDateForSave();
    if (this.manualAttendeceDataToBeSaved && this.manualAttendeceDataToBeSaved.length > 0) {
      this.manualAttendenceService.saveManualAttendence(this.manualAttendeceDataToBeSaved).subscribe((data) => {
        if (data && data.Data) {
          this.alertService.success('Manual Attenendance Saved for current page successfully.');
          this.clear();
        }
      });
    }
  }

  getAllHarvestArea() {
    try {
      this.service.GetHarvestAllArea().subscribe(
        (data) => {
          this.allAreas = data;
          this.allAreas.unshift({ areaId: 'All', areaName: 'All' });
        },
        (error) => console.log(error)
      );
    } catch (error) {

    }
  }

  onAreaChange() {
    const area = this.manualAttendenceForm.controls.area.value;
    const fromDate = this.manualAttendenceForm.controls.fromDate.value;
    const toDate = this.manualAttendenceForm.controls.toDate.value;
    this.manualAttendenceList = [];
    this.totalCount = 0;
    this.manualAttendenceBidingList = [];
    if (area && fromDate && toDate) {
      // area = (area === 'All') ? '' : area;
      this.manualAttendenceService.getManualAttendenceDetailsList(area,
        new Date(fromDate).toLocaleDateString(), new Date(toDate).toLocaleDateString(), this.pageIndex, this.pageSize).subscribe((data) => {
          if (data && data.Data) {
            this.manualAttendenceList = data.Data.attendanceData;
            this.totalCount = data.Data.totalCount;
            this.manualAttendenceBidingList = [];
            this.populateAttendenceList();
          }
        });
    }
  }

}
