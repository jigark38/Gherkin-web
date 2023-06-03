import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SowingFarmerDetailsService } from 'src/app/feature-modules/agri-management/transactions/sowing-farmer-details/sowing-farmer-details.service';
import { DialyGreensService } from 'src/app/feature-modules/reports/daily-greens-receiving-report/dialy-greens.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { DailyAttendanceReportService } from './daily-attendance-report.service';
import { OfficeLocationModel } from 'src/app/feature-modules/secure/inward-gate-pass/inward-gate-pass.models';
import { Department } from '../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { SubDepartment } from '../../human-resource-mgmnt/master/employee-bank-account-details/employee-bank-account-details.model';
import { ShiftDetails } from 'src/app/feature-modules/human-resource-mgmnt/master/shift-details/shift-details.model';
import { DailyAttendance } from 'src/app/feature-modules/reports/daily-attendance-report/daily-attendance-report.model';
declare let jsPDF;
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
  selector: 'app-daily-attendance-report',
  templateUrl: './daily-attendance-report.component.html',
  styleUrls: ['./daily-attendance-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DailyAttendanceReportComponent implements OnInit {
  max = 0;
  min = 10;
  formDialyAttendanceReport: FormGroup;
  units: OfficeLocationModel[];
  status: ["All", "On Roll", "Off Roll"];
  divison: ["All", "Staff", "Worker"];
  departments: Array<Department>;
  subDepartments: Array<SubDepartment>;
  shifts: ShiftDetails[];
  gridData = [];
  document: any;
  userDetails: any;
  selectTabFirst = true;
  maleCount: number;
  femaleCount: number;

  constructor(private readonly formBuilder: FormBuilder,
    private alertService: AlertService,
    private areas: SowingFarmerDetailsService,
    private attendanceService: DailyAttendanceReportService,
    public authService: AuthenticationService) {
    this.formDialyAttendanceReport = this.formBuilder.group({
      dialydate: [''],
      unitName: [''],
      statusName: [''],
      divisionName: [''],
      departmentName: [''],
      subDepartmentName: [''],
      shiftName: [''],
      filter: [''],
      category: ['All'],
      gender: ['All'],
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
    this.getShiftList();
  }
  departmentValueChange() {
    try {
      const departmentCode = this.formDialyAttendanceReport.controls.departmentName.value;
      if (departmentCode) {
        if (departmentCode != 'All') {
          this.formDialyAttendanceReport.controls.subDepartmentName.setValue('');
          this.getSubDepartments(departmentCode);
        }
        else {
          this.subDepartments = [];
          this.formDialyAttendanceReport.controls.subDepartmentName.setValue('');
        }
      } else {
        this.subDepartments = [];
        this.formDialyAttendanceReport.controls.subDepartmentName.setValue('');
      }
    } catch (error) {
    }
  }
  getShiftList() {
    try {
      this.attendanceService.getShiftList().subscribe((res: ShiftDetails[]) => {
        if (res) {
          this.shifts = res;
          this.shifts.map(x => x.shiftTimeFrom = x.shiftTimeFrom.slice(0, 5));
          this.shifts.map(x => x.shiftTimeTo = x.shiftTimeTo.slice(0, 5));
          this.shifts.map(x => x.shiftDuration = x.shiftDuration.slice(0, 5));
          this.shifts.map(x => x.shiftBreakTimeFrom = x.shiftBreakTimeFrom.slice(0, 5));
          this.shifts.map(x => x.shiftBreakTimeTo = x.shiftBreakTimeTo.slice(0, 5));
          this.shifts.map(x => x.shiftBreakDuration = x.shiftBreakDuration.slice(0, 5));
        }
      });
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
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
  printbtnClick() {
    this.getAttendanceDetails('print');
  }
  exportPdf() {
    this.getAttendanceDetails('export');
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
  getAttendanceDetails(event: any) {
    this.attendanceService.getAttendanceDetails(this.formDialyAttendanceReport.value).subscribe(
      (data: any) => {
        if (data && data.Data && data.Data.ColumnsName) {
          this.downloadPdf(data.Data, event);
          console.log(data);
        } else {
          this.document = null;
          this.alertService.error('No Data Found');
        }
      },
      error => {
        this.alertService.error('Error While Loading Data');
      }
    );
  }

  viewData() {
    this.attendanceService.getAttendanceDetailsForView(this.formDialyAttendanceReport.value).subscribe(
      (data: DailyAttendance[]) => {
        this.gridData = data;
        this.maleCount = this.gridData.filter(a => a.gender == 'Male').length;
        this.femaleCount = this.gridData.filter(a => a.gender == 'Female').length;
      },
      error => {
        this.maleCount = 0;
        this.femaleCount = 0;
        this.alertService.error('Error While Loading Data');
      }
    );
  }

  downloadPdf(data: any, event: any) {
    var doc = new jsPDF();

    const listOne = [];
    let selectedDate = this.formDialyAttendanceReport.controls.dialydate.value._i;
    var dd = selectedDate.date;
    var mm = selectedDate.month + 1;

    var yyyy = selectedDate.year;
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    listOne['Date'] = dd + '-' + mm + '-' + yyyy;
    listOne['Staff/Worker'] = this.formDialyAttendanceReport.controls.divisionName.value;
    listOne['Total Nos.'] = data.Total;
    listOne['On/Off Roll'] = this.formDialyAttendanceReport.controls.statusName.value;
    listOne['Punching Category'] = this.formDialyAttendanceReport.controls.category.value;
    listOne['No. of Male'] = data.GridData.filter(a => a[4] == 'Male').length;

    const listTwo = [];
    listTwo['Department'] = data.Department;
    listTwo['Sub Dept.'] = data.SubDepartment;
    listTwo['Order By'] = this.formDialyAttendanceReport.controls.filter.value;
    listTwo['Shift'] = data.ShiftName;
    listTwo['No. of Female'] = data.GridData.filter(a => a[4] == 'Female').length;

    // doc.setFontType('bold');

    this.userDetails = this.authService.getUserdetails();
    doc.text(10, 290, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
    if (this.userDetails.userName == "Npadmin") {
      doc.addImage("../assets/Naturalalogo.jpeg", "JPEG", 10, 8, 50, 12);
    } else {
      doc.text(data.Organisation.organisationName, 10, 15);
    }

    doc.setFontSize(12);
    doc.text(80, 20, 'DAILY ATTENDANCE REPORT');

    doc.setFontSize(10);
    let count = 35;
    Object.entries(listOne).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(15, count, key.trim().toUpperCase());
      doc.text(57, count, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(60, count, value.toString().trim().toUpperCase());
      count = count + 7;
    });

    let count2 = 35;
    Object.entries(listTwo).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(110, count2, key.trim().toUpperCase());
      doc.text(152, count2, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(155, count2, value.toString().trim().toUpperCase());
      count2 = count2 + 7;
    });
    this.userDetails = this.authService.getUserdetails();

    let i; let j;
    let pageNumber = 2;
    const gridSplitData = data.GridData.slice(0, 20);
    const length = data.GridData.length - 21;


    doc.autoTable({
      startY: count + 3,
      theme: 'grid',
      head: [data.ColumnsName],
      body: gridSplitData,
      styles: { fontSize: 7 },
      columnStyles: {
        1: {
          halign: 'right'
        },
        5: {
          halign: 'right'
        },
        6: {
          halign: 'right'
        },
        7: {
          halign: 'right'
        },
        8: {
          halign: 'right'
        }
      }
    });


    doc.text(180, 290, 'page 1');

    let chunk = 30;
    if (length > 0) {
      for (i = 20, j = data.GridData.length; i < j; i += chunk) {

        doc = doc.addPage();

        doc.page = pageNumber;
        const gridSplitData = data.GridData.slice(i, i + chunk);

        doc.autoTable({
          startY: 20,
          theme: 'grid',
          head: [data.ColumnsName],
          body: gridSplitData,
          styles: { fontSize: 7 },
          columnStyles: {
            1: {
              halign: 'right'
            },
            5: {
              halign: 'right'
            },
            6: {
              halign: 'right'
            },
            7: {
              halign: 'right'
            },
            8: {
              halign: 'right'
            }
          }
        });

        doc.text(10, 290, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
        doc.text(180, 290, 'page ' + pageNumber);
        pageNumber++;
      }
    }
    this.document = doc;
    if (event == "print") {
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
    else {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
      const day = date.getDate();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const secconds = date.getSeconds();

      const seedatetime = month + '.' + day + '.' + year + ' - ' + hour + ':' + minutes + ':' + secconds;


      this.document.save('DialyAttendanceReport' + seedatetime + '.pdf');
    }
  }
  clear() {
    this.document = null;
    this.formDialyAttendanceReport.controls.dialydate.reset();
    this.formDialyAttendanceReport.controls.unitName.reset();
    this.formDialyAttendanceReport.controls.statusName.reset();
    this.formDialyAttendanceReport.controls.divisionName.reset();
    this.formDialyAttendanceReport.controls.departmentName.reset();
    this.formDialyAttendanceReport.controls.subDepartmentName.reset();
    this.formDialyAttendanceReport.controls.shiftName.reset();
    this.formDialyAttendanceReport.controls.filter.reset();
  }
}
