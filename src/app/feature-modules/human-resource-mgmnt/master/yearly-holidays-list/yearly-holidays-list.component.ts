import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MatDialog, MatSelect, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, PageEvent } from '@angular/material';
import { YearlyHolidaysListService } from './yearly-holidays-list.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { YearlyCalendar, WeekDay, YearlyCalendarDetail, WeeklyHoliday, StatutoryHoliday } from './yearly-holidays-list.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/corecomponents/modal/modal.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

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
  selector: 'app-yearly-holidays-list',
  templateUrl: './yearly-holidays-list.component.html',
  styleUrls: ['./yearly-holidays-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class YearlyHolidaysListComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
    private yearlyHolidaysListService: YearlyHolidaysListService,
    protected alertService: AlertService,
    private modalService: ModalService
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  @ViewChild('StatutoryholidaysPassingNoDDL', { static: false }) statutoryholidaysPassingNoDDL: MatSelect;
  @ViewChild('WeeklyholidaysPassingNoDDL', { static: false }) weeklyholidaysPassingNoDDL: MatSelect;
  @ViewChild('StatutoryholidaysDate', { static: false }) statutoryholidaysDateEle: ElementRef;
  @ViewChild('SaveCommand', { static: false }) saveCommand: ElementRef;
  @ViewChild('FromDate', { static: false }) yearlyFromDateEle: ElementRef;
  @ViewChild('yesBtn', { static: false }) yesBtn: ElementRef;

  yearlyCalenderDetailsForm: FormGroup;
  weeklyHolidaysForm: FormGroup;
  statutoryHolidaysForm: FormGroup;
  employeeName: string;
  employeeId: string;
  weeklyHolidayList = Array<WeeklyHoliday>();
  weekDaysList = new Array<WeekDay>();
  statutoryHolidaysList = new Array<StatutoryHoliday>();
  yearlyCalendarDetailList = new Array<YearlyCalendarDetail>();
  selectedDays = new Array<number>();
  yearlyCalenderClicked = false;
  weeklyHolidayClicked = false;
  statutoryHolidayClicked = false;
  holidaysNo = 1;
  dayByDate = null;
  selectedweeklyDays = new Array<WeekDay>();
  getdyscalled = false;
  filtredGridData = new Array<YearlyCalendarDetail>();

  yearlyCalenderBtnDisable = false;
  weekdayHolidayBtnDisable = false;
  statutoryHolidayBtnDisable = false;
  modifyBtnDisable = false;
  saveBtnDisable = true;
  selectedDayId = null;
  minDate: Date;
  maxDate: Date;

  min = 0;
  max = 3;

  pageEvent: PageEvent;
  pageSizeOptions: Array<number> = [3, 5, 10];
  pageIndex = 0;
  pageSize: number = this.pageSizeOptions[0];

  ngOnInit() {
    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;
    this.InitializeYearlyCalenderDetailsForm();
    this.InitializeWeeklyHolidaysForm();
    this.InitializeStatutoryHolidaysForm();
    this.yearlyCalenderDetailsForm.reset();
    this.statutoryHolidaysForm.reset();
    this.GetAllWeekDays();
    this.GetYearlyCalenderDetail();
  }

  InitializeYearlyCalenderDetailsForm() {
    this.yearlyCalenderDetailsForm = new FormGroup({
      dateOfEntry: new FormControl({ value: null }, [Validators.required]),
      employeeId: new FormControl({ value: null }, [Validators.required]),
      holidaysPassingNo: new FormControl({ value: null }),
      calenderYearFromDate: new FormControl({ value: null }, [Validators.required]),
      calenderYearToDate: new FormControl({ value: null }, [Validators.required]),
      yearlyStatutoryHolidayCount: new FormControl({ value: null }, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
    });
  }

  InitializeWeeklyHolidaysForm() {
    this.weeklyHolidaysForm = new FormGroup({
      employeeId: new FormControl({ value: this.employeeId }, [Validators.required]),
      holidayPassingNo: new FormControl('', [Validators.required]),
      weekDaysId: new FormControl({ value: [] }),
    });
  }

  InitializeStatutoryHolidaysForm() {
    this.statutoryHolidaysForm = new FormGroup({
      employeeId: new FormControl({ value: null }),
      holidaysPassingNum: new FormControl('', [Validators.required]),
      statutoryHolidaysNo: new FormControl({ value: null }),
      holidaysDate: new FormControl({ value: null }, [Validators.required]),
      weekDaysId: new FormControl('', [Validators.required]),
      holidayOccasion: new FormControl({ value: null }, [Validators.required]),
    });
  }

  GetAllWeekDays() {
    this.yearlyHolidaysListService.GetAllWeekDays().subscribe(res => {
      this.weekDaysList = res;
    });
  }

  GetYearlyCalenderDetail() {
    this.yearlyHolidaysListService.GetYearlyCalendarDetailsByEmpId(this.employeeId).subscribe(res => {
      if (res != null) {
        this.yearlyCalendarDetailList = res;
        // this.filterHolidayData(null);
      } else {
        this.yearlyCalendarDetailList = new Array<YearlyCalendarDetail>();
      }
    });
  }

  onYealyCalenderClick() {
    this.onlySaveBtnActive();
    this.yearlyCalenderClicked = true;
    this.weeklyHolidayClicked = false;
    this.statutoryHolidayClicked = false;
    this.yearlyCalenderDetailsForm.enable();
    this.yearlyCalenderDetailsForm.controls.dateOfEntry.setValue(new Date());
    this.yearlyCalenderDetailsForm.controls.employeeId.setValue(this.employeeName);
    this.yearlyCalenderDetailsForm.controls.employeeId.disable();
    this.yearlyFromDateEle.nativeElement.focus();
    this.statutoryHolidaysForm.disable();
    this.weeklyHolidaysForm.disable();
  }
  onWeekDaysHolidayClick() {
    this.onlySaveBtnActive();
    this.yearlyCalenderClicked = false;
    this.weeklyHolidayClicked = true;
    this.statutoryHolidayClicked = false;
    this.weeklyHolidaysForm.enable();
    this.weeklyHolidayList = Array<WeeklyHoliday>();
    this.weeklyholidaysPassingNoDDL.focus();
    this.yearlyCalenderDetailsForm.disable();
    this.statutoryHolidaysForm.disable();
  }

  onStatutoryHolidayClick() {
    this.onlySaveBtnActive();
    this.yearlyCalenderClicked = false;
    this.weeklyHolidayClicked = false;
    this.statutoryHolidayClicked = true;
    this.statutoryHolidaysForm.enable();
    this.statutoryHolidaysList = new Array<StatutoryHoliday>();
    this.statutoryHolidaysForm.controls.statutoryHolidaysNo.setValue(1);
    this.statutoryHolidaysForm.controls.statutoryHolidaysNo.disable();
    this.statutoryholidaysPassingNoDDL.focus();
    this.yearlyCalenderDetailsForm.disable();
    this.weeklyHolidaysForm.disable();

  }

  onSubmit() {
    if (this.yearlyCalenderClicked === true) {
      this.addCalenderYear();
    } else if (this.weeklyHolidayClicked === true) {
      this.addWeeklyHolidays();
    } else if (this.statutoryHolidayClicked === true) {
      this.AddStatutoryHolidays();
    }
  }

  addCalenderYear() {
    let yearlyCalenderDetails = new YearlyCalendar();
    yearlyCalenderDetails = this.yearlyCalenderDetailsForm.value;
    yearlyCalenderDetails.dateOfEntry = new Date(this.yearlyCalenderDetailsForm.get('dateOfEntry').value);
    yearlyCalenderDetails.calenderYearFromDate = new Date(this.yearlyCalenderDetailsForm.get('calenderYearFromDate').value);
    yearlyCalenderDetails.calenderYearToDate = new Date(this.yearlyCalenderDetailsForm.get('calenderYearToDate').value);
    yearlyCalenderDetails.holidaysPassingNo = 0;
    yearlyCalenderDetails.employeeId = this.employeeId;
    const currentYear = new Date(this.yearlyCalenderDetailsForm.get('calenderYearFromDate').value).getFullYear();
    if (this.yearlyCalenderDetailsForm.valid) {
      if (this.yearlyCalendarDetailList.some(i => new Date(i.calenderYearFromDate).getFullYear() === currentYear)) {
        this.alertService.error('Mentioned year already exist!');
        return;
      }
      this.yearlyHolidaysListService.AddYearlyCalendarDetails(yearlyCalenderDetails).subscribe(res => {
        this.alertService.success('Yearly Calender Details Saved Successfully!');
        this.clear();
      },
        error => {
          this.alertService.error('Error while adding Yearly Calender Details!');
        });
    }
  }

  addWeeklyHolidays() {
    this.weeklyHolidayList = Array<WeeklyHoliday>();
    const holidayNo = this.weeklyHolidaysForm.get('holidayPassingNo').value;
    const selectedYearDetail = this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === holidayNo).weeklyHolidaysList;
    this.selectedDays.forEach(element => {
      if (!selectedYearDetail.map(x => x.weekDaysId).includes(element)) {
        const weeklyHolidays = new WeeklyHoliday();
        weeklyHolidays.id = 0;
        weeklyHolidays.employeeId = this.employeeId;
        weeklyHolidays.weekDaysId = element;
        weeklyHolidays.holidaysPassingNo = this.weeklyHolidaysForm.get('holidayPassingNo').value;
        this.weeklyHolidayList.push(weeklyHolidays);
      }
    });
    if (this.weeklyHolidayList.length === 0) {
      this.alertService.error('Please add weekly holidays!');
      return;
    }
    this.yearlyHolidaysListService.AddWeeklyHolidays(this.weeklyHolidayList).subscribe(res => {
      this.alertService.success('Weekdays Holidays Details Saved Successfully!');
      this.clear();
    },
      error => {
        this.alertService.error('Error while adding Weekdays Holidays Details!');
      });
  }
  AddStatutoryHolidays() {
    if (this.statutoryHolidaysList.length === 0) {
      this.alertService.error('Please add minimum one statutory holidays!');
      return;
    }
    this.yearlyHolidaysListService.AddStatutoryHolidays(this.statutoryHolidaysList).subscribe(res => {
      this.alertService.success('Yearly Statutory Holidays Details Saved Successfully!');
      this.clear();
    },
      error => {
        this.alertService.error('Error while adding Statutory Holidays Details!');
      });
  }

  firstAccordion($event) {
    this.onYealyCalenderClick();
  }
  secondAccordion($event) {
    this.onWeekDaysHolidayClick();
  }
  thirdAccordion($event) {
    this.onStatutoryHolidayClick();
  }

  onStatutoryControlBlur() {
    if (this.statutoryHolidaysForm.invalid) {
      return;
    }
    const statutoryHolidaydetail = new StatutoryHoliday();
    statutoryHolidaydetail.holidaysPassingNo = this.statutoryHolidaysForm.get('holidaysPassingNum').value;
    const statuHolidayList = this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === statutoryHolidaydetail.holidaysPassingNo)
      .statutoryHolidaysList;
    if (statuHolidayList.find(x => x.holidaysDate === this.statutoryHolidaysForm.get('holidaysDate').value) != null) {
      this.alertService.error('Added date already exist!');
      return;
    }
    statutoryHolidaydetail.weekDaysId = this.statutoryHolidaysForm.get('weekDaysId').value;
    statutoryHolidaydetail.holidayOccasion = this.statutoryHolidaysForm.get('holidayOccasion').value;
    statutoryHolidaydetail.holidaysDate = this.statutoryHolidaysForm.get('holidaysDate').value;
    statutoryHolidaydetail.employeeId = this.employeeId;
    statutoryHolidaydetail.statutoryHolidaysNo = statuHolidayList.length + 1;

    this.statutoryHolidaysList.push(statutoryHolidaydetail);
    this.yearlyCalendarDetailList.find(x => x.holidaysPassingNo === statutoryHolidaydetail.holidaysPassingNo)
      .statutoryHolidaysList.push(statutoryHolidaydetail);
    this.modalService.open('save-holidays-Modal');
    this.yesBtn.nativeElement.focus();
  }

  onAddMoreHoliday() {
    this.modalService.close('save-holidays-Modal');
    this.statutoryHolidaysForm.controls.holidaysPassingNum.disable();
    this.statutoryHolidaysForm.controls.statutoryHolidaysNo.setValue(this.statutoryHolidaysForm.get('statutoryHolidaysNo').value + 1);
    this.statutoryHolidaysForm.controls.statutoryHolidaysNo.disable();
    this.statutoryHolidaysForm.controls.holidaysDate.setValue('');
    this.statutoryHolidaysForm.controls.weekDaysId.setValue('');
    this.statutoryHolidaysForm.controls.holidayOccasion.setValue('');
    this.statutoryholidaysDateEle.nativeElement.focus();
  }

  onNoMoreHoliday() {
    this.modalService.close('save-holidays-Modal');
    this.statutoryHolidaysForm.controls.holidaysPassingNum.disable();
    this.statutoryHolidaysForm.controls.statutoryHolidaysNo.disable();
    this.saveCommand.nativeElement.focus();
  }

  getWeekdayName(weekDaysId) {
    return (this.weekDaysList.find(x => x.weekdaysId === weekDaysId)).weekdaysName;
  }

  clear() {
    this.markFormGroupUntouched(this.weeklyHolidaysForm);
    this.markFormGroupUntouched(this.statutoryHolidaysForm);
    this.markFormGroupUntouched(this.yearlyCalenderDetailsForm);
    this.getdyscalled = false;
    this.yearlyCalenderClicked = false;
    this.weeklyHolidayClicked = false;
    this.statutoryHolidayClicked = false;
    this.yearlyCalenderBtnDisable = false;
    this.weekdayHolidayBtnDisable = false;
    this.statutoryHolidayBtnDisable = false;
    this.modifyBtnDisable = false;
    this.saveBtnDisable = true;
    this.dayByDate = null;
    this.getdyscalled = false;
    this.GetYearlyCalenderDetail();
    this.weeklyHolidaysForm.reset();
    this.yearlyCalenderDetailsForm.reset();
    this.statutoryHolidaysForm.reset();
  }

  onlySaveBtnActive() {
    this.yearlyCalenderBtnDisable = true;
    this.weekdayHolidayBtnDisable = true;
    this.statutoryHolidayBtnDisable = true;
    this.modifyBtnDisable = true;
    this.saveBtnDisable = false;
  }

  private markFormGroupUntouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsUntouched();

      if ((control as any).controls) {
        this.markFormGroupUntouched(control as FormGroup);
      }
    });
  }

  focusSave() {
    this.saveCommand.nativeElement.focus();
  }

  filterDaybyDate(date: Date) {
    const d = new Date(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[d.getDay()];
    this.dayByDate = this.weekDaysList.filter(x => x.weekdaysName === dayName.toString().toUpperCase());
    this.selectedDayId = this.dayByDate[0].weekdaysId;
  }

  getDays() {
    if (this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === holidayNo).weeklyHolidaysList === undefined) {
      return;
    }
    this.getdyscalled = true;
    const holidayNo = this.weeklyHolidaysForm.get('holidayPassingNo').value;
    if (this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === holidayNo).weeklyHolidaysList.length > 0) {
      const selectedYearDetail = this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === holidayNo).weeklyHolidaysList;
      this.selectedDays = selectedYearDetail.map(a => a.weekDaysId);
    }

  }

  dayAlreadyExist(weekdaysId) {
    if (this.getdyscalled === false) {
      return false;
    }
    if (this.selectedDays === null) {
      return false;
    }
    if (this.selectedDays.includes(weekdaysId)) {
      return true;
    } else {
      return false;
    }
  }

  setDateRange() {
    const selectedPassingNum = this.statutoryHolidaysForm.get('holidaysPassingNum').value;
    const yearlyCalenderList = this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === selectedPassingNum);
    this.minDate = new Date(yearlyCalenderList.calenderYearFromDate);
    this.maxDate = new Date(yearlyCalenderList.calenderYearToDate);
    const statuHolidayList = this.yearlyCalendarDetailList.find(i => i.holidaysPassingNo === selectedPassingNum)
      .statutoryHolidaysList;
    this.statutoryHolidaysForm.controls.statutoryHolidaysNo.setValue(statuHolidayList.length + 1);
  }

  setGridData() {
    const startingPosition = this.pageSize * this.pageIndex;
    const endPosition = startingPosition + this.pageSize;
    this.filtredGridData = this.yearlyCalendarDetailList.slice(startingPosition, endPosition);
  }

  filterHolidayData(event?: PageEvent) {
    this.pageSize = event ? event.pageSize : this.pageSize;
    this.pageIndex = event ? event.pageIndex : this.pageIndex;
    this.setGridData();
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }
}
