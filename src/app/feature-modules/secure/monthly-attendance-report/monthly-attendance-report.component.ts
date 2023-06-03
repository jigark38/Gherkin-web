import { Component, OnInit } from '@angular/core';
// import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect, MatDatepicker } from '@angular/material';
// import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
// import moment from 'moment';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SowingFarmerDetailsService } from 'src/app/feature-modules/agri-management/transactions/sowing-farmer-details/sowing-farmer-details.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { OfficeLocationModel } from 'src/app/feature-modules/secure/inward-gate-pass/inward-gate-pass.models';
import { Department } from '../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { SubDepartment } from '../../human-resource-mgmnt/master/employee-bank-account-details/employee-bank-account-details.model';
import { DailyAttendanceReportService } from '../../reports/daily-attendance-report/daily-attendance-report.service';
declare let jsPDF;
// import * as _moment from 'moment';
// const moment = _rollupMoment || _moment;
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MMMM YYYY', // this is the format showing on the input element
    monthYearLabel: 'MMMM YYYY', // this is showing on the calendar 
  },
};
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material';
import { MonthlyAttendance } from './monthly-attendance-report.model';
import { MonthlyAttendanceReportService } from './monthly-attendance-report.service';
@Component({
  selector: 'app-monthly-attendance-report',
  templateUrl: './monthly-attendance-report.component.html',
  styleUrls: ['./monthly-attendance-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MonthlyAttendanceReportComponent implements OnInit {
  max = 0;
  min = 10;
  formMonthlyAttendanceReport: FormGroup;
  units: OfficeLocationModel[];
  status: ["All", "On Roll", "Off Roll"];
  divison: ["All", "Staff", "Worker"];
  ALLmonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthName: string = "";
  departments: Array<Department>;
  subDepartments: Array<SubDepartment>;
  gridData = [];
  document: any;
  userDetails: any;
  date = new FormControl(moment());
  daysofMonth = [];
  sundaysInMonth = [];
  IsdaysofMonth: Boolean = false;
  viewGrid: Boolean = false;
  uniqueEmployeeID: any;
  AttendedDate: Date;
  presentDays = [];
  absentDays = [];
  employeeDays = [];
  employeeDetails = [];
  constructor(private readonly formBuilder: FormBuilder,
    private alertService: AlertService,
    private areas: SowingFarmerDetailsService,
    private attendanceService: DailyAttendanceReportService,
    public authService: AuthenticationService,
    public monthlyAttendanceReportService: MonthlyAttendanceReportService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.daysofMonth = [];
    this.formMonthlyAttendanceReport = this.formBuilder.group({
      dialydate: [''],
      unitName: [''],
      statusName: [''],
      divisionName: [''],
      departmentName: [''],
      subDepartmentName: [''],
      shiftName: [''],
      employeeWise: [''],
      month: [''],
      year: [''],
      filter: [''],
      biometricId: []
    });
  }
  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }
  ngOnInit() {
    this.getOfficeLocations();
    this.attendanceService.getAllDepartments().subscribe(
      (result) => {
        this.departments = result;
      },
      (error) => {
        this.alertService.error('Error while getting all Departments!');
      }
    );
    // var b = "18.93";
    // var temp = new Array();
    // temp = b.split('.');
    // alert('Hours : ' + temp[0]);

    // var minutes = 100 / temp[1];
    // minutes = 60 / minutes;
    // alert('Minutes : ' + minutes);
    //this.date = null;
    // this.getShiftList();
  }
  chosenYearHandler(normalizedYear: Moment) {
    this.IsdaysofMonth = false;

    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {

    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.formMonthlyAttendanceReport.controls.month.setValue(ctrlValue._d);
    datepicker.close();
    //  var date =  this.formDialyAttendanceReport.controls.months.value;
    var date = this.formMonthlyAttendanceReport.controls.month.value;//new Date(this.formDialyAttendanceReport.controls.months.value);
    // var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    // var day = ("0" + date.getDate()).slice(-2);
    // var hours = ("0" + date.getHours()).slice(-2);
    // var minutes = ("0" + date.getMinutes()).slice(-2);
    // var yearyear1 = date.getFullYear();

    this.monthName = this.ALLmonths[date.getMonth()];
    var months = date.getMonth();
    var year = date.getFullYear();
    this.formMonthlyAttendanceReport.controls.month.patchValue(months);
    this.formMonthlyAttendanceReport.controls.year.patchValue(year);
    this.daysofMonth = [];
    this.daysofMonth = this.getDays(months, year);
    this.sundaysInMonth = this.getSundaysInMonth(months, year);
    //this.IsdaysofMonth = true;
    this.changeDetectorRef.detectChanges();
  }

  getDays(months, year) {

    let date = new Date(`${year}-${parseInt(months) + 1}-01`);
    let days = [];
    while (date.getMonth() === parseInt(months)) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }

    return days;
  }
  getSundaysInMonth(m, y) {
    var days = new Date(y, m, 0).getDate();
    var sundays = [(8 - (new Date(m + '/01/' + y).getDay())) % 7];
    for (var i = sundays[0] + 7; i < days; i += 7) {
      sundays.push(i);
    }
    return sundays;
  }

  getOfficeLocations() {
    try {
      this.attendanceService.getOfficeLocations().subscribe((data: OfficeLocationModel[]) => {
        if (data) {
          this.units = data;
        }
      }, err => {
        this.units = [];
      });
    } catch (error) {
    }
  }

  departmentValueChange() {
    try {
      const departmentCode = this.formMonthlyAttendanceReport.controls.departmentName.value;
      if (departmentCode) {
        if (departmentCode != 'All') {
          this.formMonthlyAttendanceReport.controls.subDepartmentName.setValue('');
          this.getSubDepartments(departmentCode);
        }
        else {
          this.subDepartments = [];
          this.formMonthlyAttendanceReport.controls.subDepartmentName.setValue('');
        }
      } else {
        this.subDepartments = [];
        this.formMonthlyAttendanceReport.controls.subDepartmentName.setValue('');
      }
    } catch (error) {
    }
  }

  getSubDepartments(departmentCode: string) {
    try {
      this.attendanceService.getSubDepartment(departmentCode).subscribe(
        (data: SubDepartment[]) => {
          this.subDepartments = data;
        },
        (err) => {
          this.alertService.error(
            'Error has occured while fetching sub departments.'
          );
          this.subDepartments = [];
        }
      );
    } catch (error) {
    }
  }

  monthAttandence() {

    this.monthlyAttendanceReportService.getMonthlyAttendanceDetails(this.formMonthlyAttendanceReport.value).subscribe(
      (data: MonthlyAttendance[]) => {
        debugger
        this.gridData = data['Data'];
        if (this.gridData.length > 0) {
          this.uniqueEmployeeID = [...new Set(this.gridData.map(item => item.EmployeeID))];
          this.uniqueEmployeeID.forEach(id => {
            this.presentDays = [];
            this.employeeDays = [];
            var uniqueAttendanceDate = this.gridData.filter(x => x.EmployeeID == id);
            var EmpAllDate = [...new Set(uniqueAttendanceDate.map(item => item.AttendanceDate))];
            for (let i = 0; i < EmpAllDate.length; i++) {
              var myarray = [];
              var convertDate = new Date(EmpAllDate[i]);
              var day = convertDate.getDate();
              this.presentDays.push(day);
              if (EmpAllDate.length == i + 1) {
                this.daysofMonth.forEach(eachday => {
                  var n = this.presentDays.includes(eachday);
                  var Details = this.gridData.filter(x => x.EmployeeID == id);
                  if (n == true) {
                    const days = {
                      Date: eachday,
                      Status: "P",
                    }
                    this.employeeDays.push(days);
                  } else {

                    const days = {
                      Date: eachday,
                      Status: "A",
                    }
                    this.employeeDays.push(days);
                  }
                  let OThours: number = 0;
                  let AttendedDays: number = 0;
                  let WeeklyOff: number = 0;
                  let OTinDays: number = 0;
                  let DaysPayable: number = 0;
                  let LeavesAvailed: number = 0;
                  let LeavesCarryForward: number = 0;
                  let OThoursHours: number = 0;
                  let OThoursMinutes: number = 0;
                  let OThoursTotalMinutes: number = 0;
                  if (this.daysofMonth.length === eachday) {
                    console.log("dsds")
                    for (let i = 0; i < uniqueAttendanceDate.length; i++) {

                      var data = this.gridData.filter(x => x.AttendanceDate == uniqueAttendanceDate[i].AttendanceDate);
                      debugger
                      if (uniqueAttendanceDate.length === i + 1) {

                        AttendedDays += 1;
                        WeeklyOff += this.WeeklyOffCalculation(uniqueAttendanceDate[i].EmployeeDivision, uniqueAttendanceDate[i].EmploymentStatusAsOn);
                        // OThoursHours += this.timeStringToFloat(data[0].OThours.toString());
                        OThours += uniqueAttendanceDate[i].OThours;
                        //console.log(uniqueAttendanceDate[0].OThours + " data[0].OThours " + OThours + " OThours " + OThoursHours + " OThoursHours    ===" + i + "=====" + uniqueAttendanceDate[i].EmpBiometricID);

                        debugger
                        OTinDays = this.OTinDaysCalculation(OThours.toString());
                        LeavesAvailed = 0;
                        LeavesCarryForward = 0;
                        DaysPayable = (AttendedDays + WeeklyOff + OTinDays + LeavesAvailed - LeavesCarryForward)
                        const details = {
                          OThours: this.decimaltominture(OThours),//this.decimaltominture(OThours.toString()),
                          EmployeeName: uniqueAttendanceDate[i].EmployeeName,
                          EmpBiometricID: uniqueAttendanceDate[i].EmpBiometricID,
                          EmployeeDays: this.employeeDays,
                          AllAttendedDays: AttendedDays,
                          AllWeeklyOff: WeeklyOff,
                          AllOThours: this.decimaltominture(OThours),//this.decimaltominture(OThours.toString()),
                          AllOTinDays: OTinDays,
                          AllLeavesAvailed: LeavesAvailed,
                          AllLeavesCarryForward: LeavesCarryForward,
                          AllDaysPayable: DaysPayable,
                        }
                        this.employeeDetails.push(details);
                        this.IsdaysofMonth = true;
                        //this.downloadPdf(details);
                      }
                      else {

                        AttendedDays += 1;
                        //WeeklyOff += 0;
                        //OThoursHours += this.timeStringToFloat(data[0].OThours.toString());
                        OThours += uniqueAttendanceDate[i].OThours;
                        console.log(uniqueAttendanceDate[i].OThours + " data[0].OThours " + OThours + " OThours " + OThoursHours + " OThoursHours    ===" + i + "=====" + uniqueAttendanceDate[i].EmpBiometricID);
                      }
                    }

                  }
                });
              }
            }
          });
        }
        else {
          this.alertService.error('No Data Has Loaded With This Inputs');
        }
      },
      error => {
        this.alertService.error('Error While Loading Data');
      });
  }

  viewData() {
    this.viewGrid = true;
  }
  // decimaltominture(OTHrs) {
  //   debugger
  //   var hoursMinutes = OTHrs.split('.');
  //   var hours = parseInt(hoursMinutes[0]);
  //   var minutes = parseInt(hoursMinutes[1]);
  //   var minsdecimal = (minutes / 100);
  //   var mins = Math.round(minsdecimal * 60);
  //   return (hours + "." + mins);
  // }
  decimaltominture(OTHrs) {
    debugger
    var stringhoursMinutes = OTHrs.toString();
    var hoursMinutes = stringhoursMinutes.split('.'); //OTHrs.split('.');
    var hours = parseInt(hoursMinutes[0]);
    var minutes = parseInt(hoursMinutes[1]);
    var minsdecimal = (minutes / 100);
    var mins = Math.round(minsdecimal * 60);
    var hrsmins = hours + "." + mins;
    var newHrMin = + hrsmins;
    return (Math.ceil(newHrMin * 20 - 0.5) / 20).toFixed(2);//(hours + "." + mins);

  }
  OTinDaysCalculation(OTHrs) {
    debugger
    var hoursMinutes = OTHrs.split('.');
    var hours = parseInt(hoursMinutes[0]);
    var minutes = parseInt(hoursMinutes[1]);
    var minsdecimal = (minutes / 100);
    var mins = Math.round(minsdecimal * 60);
    var totalHrs = hours + "." + mins;
    var totalHrsParse = parseInt(totalHrs);
    var days = (totalHrsParse / 8)
    console.log(days + " day");
    //return Math.ceil(days);
    return + (Math.ceil(days * 20 - 0.5) / 20).toFixed(2);
  }
  WeeklyOffCalculation(EmployeeDivision, EmploymentStatusAsOn) {
    var weekoff: number = 0;
    if (EmployeeDivision == 'Staff' && EmploymentStatusAsOn == "Permanent" && this.sundaysInMonth.length > 0) {
      weekoff = this.sundaysInMonth.length;
    }
    return weekoff;
  }


  timeStringToFloat(time) {

    var hoursMinutes = time.split('.');
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = Math.round(hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0);
    return (hours + minutes / 60);
  }

  printbtnClick() {
    if (this.formMonthlyAttendanceReport.controls.divisionName.value &&
      this.formMonthlyAttendanceReport.controls.departmentName.value &&
      this.formMonthlyAttendanceReport.controls.subDepartmentName.value) {
      this.downloadPdf();
      this.printPdf();
    } else {
      this.alertService.error('Select mandatory fields');
    }
  }

  printPdf() {
    if (this.document) {
      const doc = this.document;
      doc.autoPrint();
      const hiddFrame = document.createElement('iframe');
      hiddFrame.style.position = 'fixed';
      hiddFrame.style.width = '1px';
      hiddFrame.style.height = '1px';
      hiddFrame.style.opacity = '0.01';
      const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
      if (isSafari) {
        // fallback in safari
        hiddFrame.onload = () => {
          try {
            hiddFrame.contentWindow.document.execCommand('print', false, null);
          } catch (e) {
            hiddFrame.contentWindow.print();
          }
        };
      }
      hiddFrame.src = doc.output('bloburl');
      document.body.appendChild(hiddFrame);
    }
  }

  exportPdf() {
    //this.getAttendanceDetails('export');
    this.downloadPdf();
    debugger
    if (this.formMonthlyAttendanceReport.controls.divisionName.value &&
      this.formMonthlyAttendanceReport.controls.departmentName.value &&
      this.formMonthlyAttendanceReport.controls.subDepartmentName.value) {

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
      const day = date.getDate();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const secconds = date.getSeconds();

      const seedatetime = month + '.' + day + '.' + year + ' - ' + hour + ':' + minutes + ':' + secconds;
      this.document.save('Report ' + seedatetime + '.pdf');
    } else {
      this.alertService.error('Select mandatory fields');
    }
  }

  downloadPdf() {
    debugger
    var doc = new jsPDF();
    var departments = this.departments.filter(x => x.departmentCode === this.formMonthlyAttendanceReport.controls.departmentName.value);
    var subDepartments = this.subDepartments.filter(x => x.subDepartmentCode === this.formMonthlyAttendanceReport.controls.subDepartmentName.value);
    const listOne = [];
    listOne['Month'] = this.monthName + ' - ' + this.formMonthlyAttendanceReport.controls.year.value;

    if (departments.length > 0) {
      listOne['Department'] = departments[0].departMentName;
    }
    else {
      listOne['Department'] = "All";
    }


    const listTwo = [];
    listTwo['Staff / Worker'] = this.formMonthlyAttendanceReport.controls.divisionName.value;
    if (subDepartments.length > 0) {
      listTwo['Sub Department'] = subDepartments[0].subDepartmentName;
    }
    else {
      listTwo['Sub Department'] = "All";
    }


    // doc.setFontType('bold');
    //doc.text(data.Organisation.organisationName, 10, 12);
    doc.setFontSize(12);
    doc.text(50, 20, 'MONTHLY ATTENDANCE REPORT');

    doc.setFontSize(10);
    let count = 35;
    Object.entries(listOne).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(15, count, key.trim().toUpperCase());
      doc.text(45, count, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(47, count, value.toString().trim().toUpperCase());
      count = count + 7;
    });

    let count2 = 35;
    Object.entries(listTwo).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(110, count2, key.trim().toUpperCase());
      doc.text(146, count2, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(148, count2, value.toString().trim().toUpperCase());
      count2 = count2 + 7;
    });

    var columnNames = [];
    for (let i = 0; i < this.daysofMonth.length; i++) {
      const element = this.daysofMonth[i];
      debugger
      if (i == 0) {
        var Slno = "Sl. No";
        var EMPName = "EMP Name";
        var EID = "EID";
        columnNames.push(Slno, EMPName, EID, element);
      } else if (this.daysofMonth.length === i + 1) {
        var DA = "DA";
        var WO = "WO";
        var OTH = "OTH";
        var OTD = "OTD";
        var LU = "LU";
        var EID = "EID";
        var LCF = "LCF";
        var DP = "DP";
        columnNames.push(element, DA, WO, OTH, OTD, LU, LCF, DP);
      } else if (i < this.daysofMonth.length) {   // 22 ,24 ,
        columnNames.push(element);
      }
    }

    var filterdataColumn = [];
    for (let j = 0; j < this.employeeDetails.length; j++) {
      const eachdata = this.employeeDetails[j];
      const eachdata2 = Object.values(eachdata);
      filterdataColumn.push(eachdata2);
      debugger
      var filterdaysColumn = [];
      for (let k = 0; k < eachdata.EmployeeDays.length; k++) {
        var EmployeeDays = Object.values(eachdata.EmployeeDays[k].Status);
        filterdaysColumn.push(EmployeeDays[0]);
        if (eachdata.EmployeeDays.length === k + 1) {
          debugger
          filterdataColumn[j].splice(0, 1);
          filterdataColumn[j].splice(0, 0, j + 1);
          filterdataColumn[j].splice(3, 1);
          filterdataColumn[j].splice(3, 0, ...filterdaysColumn);
        }

      }
    }

    debugger
    doc.autoTable({
      startY: count + 3,
      theme: 'grid',
      head: [columnNames],
      body: filterdataColumn,
      styles: { fontSize: 2 }
    });
    this.userDetails = this.authService.getUserdetails();
    doc.text(10, 270, ("DA : Attended Days"));
    doc.text(60, 270, ("WO : Weekly Off"));
    doc.text(120, 270, ("OTH : OT Hours"));
    doc.text(160, 270, ("OTD : OT in Days"));

    doc.text(10, 280, ("LU : Leaves Availed"));
    doc.text(60, 280, ("LCF : Leaves Carry Forward"));
    doc.text(120, 280, ("DP : Days Payable"));

    // doc.text(180, 270, ("DA:Attended Days" + " " + "WO:Weekly Off"));

    doc.text(10, 290, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
    doc.text(180, 290, 'page ' + 1);
    this.document = doc;
  }

  clear() {
    this.gridData = [];
    this.document = null;
    this.userDetails = null;
    this.daysofMonth = [];
    this.IsdaysofMonth = false;
    this.viewGrid = false;
    this.presentDays = [];
    this.absentDays = [];
    this.employeeDays = [];
    this.employeeDetails = [];
    this.formMonthlyAttendanceReport.reset();
    this.date.reset;
  }
}
