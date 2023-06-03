import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect } from '@angular/material';
import { AlertService } from './../../../../corecomponents/alert/alert.service';
import { AuthenticationService } from './../../../../shared/services/authentication-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, LOCALE_ID } from '@angular/core';
import { AttendancePunchDetailsService } from './attendance-punch-details.service';
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
declare var $: any;

@Component({
  selector: 'app-attendance-punch-details',
  templateUrl: './attendance-punch-details.component.html',
  styleUrls: ['./attendance-punch-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AttendancePunchDetailsComponent implements OnInit {
  attendancePunchDetailsForm: FormGroup;
  employeeId;
  employeeUserName;
  attendancePunchDetails = [];
  selectedRowId = 0;
  getDetailFormInput = true;
  manualButton = true;
  locationDetails;
  departmentList = [];
  min = 0;
  max = 20;
  dataNotFound = false;
  recordCount = 'Attendance Punch Details: No of Records';

  @ViewChild('attendanceDate', { static: false }) attendanceDate: ElementRef;
  @ViewChild('orgazation', { static: false }) orgazation: MatSelect;
  @ViewChild('getDetails', { static: false }) getDetails: ElementRef;

  constructor(private readonly formBuilder: FormBuilder,
    // tslint:disable-next-line: align
    private readonly authService: AuthenticationService,
    // tslint:disable-next-line: align
    private readonly attendancePunchDetailsService: AttendancePunchDetailsService,
    // tslint:disable-next-line: align
    private readonly alertService: AlertService
  ) { }

  ngOnInit() {
    this.formCreation();
    this.getOfficeLocationDetails();
    const defaultData = {
      departMentName: 'ALL',
      departmentCode: 'ALL'
    };
    this.departmentList.push(defaultData);
    // this.getAllDepartment();
  }

  formCreation() {
    try {
      this.attendancePunchDetailsForm = this.formBuilder.group({
        dateOfEntry: [
          '',
          [Validators.required]
        ],
        loginUserName: ['', [Validators.required]],
        punchingCategory: ['Attended', [Validators.required]],
        detailsFor: ['ALL', [Validators.required]],
        organisation: ['', [Validators.required]],
        department: ['ALL', [Validators.required]],
        gender: ['ALL', [Validators.required]],
        division: ['ALL', [Validators.required]],
        biometricId: [''],
        filter: ['Time']
      });
      this.employeeId = this.authService.getUserdetails().userId;
      this.employeeUserName = this.authService.getUserdetails().userName;
      this.attendancePunchDetailsForm.controls.loginUserName.setValue(this.employeeUserName);

    } catch (error) {
      console.log('form creation error', error);
    }
  }

  clearDetail() {
    this.attendancePunchDetailsForm.reset();
    this.attendancePunchDetailsForm.controls.loginUserName.setValue(this.employeeUserName);
    this.attendancePunchDetailsForm.controls.punchingCategory.setValue('Attended');
    this.attendancePunchDetailsForm.controls.detailsFor.setValue('ALL');
    this.attendancePunchDetailsForm.controls.department.setValue('ALL');
    this.attendancePunchDetailsForm.controls.gender.setValue('ALL');
    this.attendancePunchDetailsForm.controls.division.setValue('ALL');
    this.attendancePunchDetailsForm.controls.filter.setValue('Time');
    this.getDetailFormInput = true;
    this.manualButton = true;
    this.getOfficeLocationDetails();
    this.dataNotFound = false;
    this.recordCount = 'Attendance Punch Details: No of Record';
    this.attendancePunchDetails = [];
  }

  getOfficeLocationDetails() {
    this.locationDetails = null;
    this.attendancePunchDetailsService.getOfficeLocationDetails().subscribe(res => {
      this.locationDetails = res;
      this.locationDetails.sort((a, b) => a.orgOfficeName.localeCompare(b.orgOfficeName));
      this.attendanceDate.nativeElement.focus();

    },
      error => {
        this.alertService.error('Error while getting Loaction Details!');
      });
  }

  getfieldStaff(event) {
    this.getDetailFormInput = false;
    this.getDepartmentByOrganisation(event);
    setTimeout(() => this.getDetails.nativeElement.focus(), 0);
  }

  getAttendanceDetails(formValue) {
    this.attendancePunchDetails = [];
    this.min = 0;
    this.max = 20;
    this.selectedRowId = null;
    this.attendancePunchDetailsService.getAttendanceDetails(formValue).subscribe((res: any) => {
      console.log('res', res);
      if (res.length === 0) {
        this.dataNotFound = true;
      } else {
        res.forEach(element => {

          element.slNo = this.attendancePunchDetails.length + 1;
          this.attendancePunchDetails.push(element);
        });
        this.recordCount = 'Attendance Punch Details: No of Record is ' + this.attendancePunchDetails.length;
      }
    }, error => {
      console.log('error', error);
      this.alertService.error('Error while getting Attendance Details!');

    });
  }

  getDepartmentByOrganisation(orgofficeNo) {
   if(orgofficeNo){
    this.attendancePunchDetailsService.getDepartmentByOrganisation(orgofficeNo).subscribe((res: any) => {
      this.departmentList = [];
      const defaultData = {
        departMentName: 'ALL',
        departmentCode: 'ALL'
      };
      this.departmentList.push(defaultData);
      res.forEach(element => {
        this.departmentList.push(element);
      });
      console.log('res getDepartmentByOrganisation', this.departmentList);

    },
      error => {
        console.log('error', error);
        this.alertService.error('Error while getting All department details by organization!');

      });
   }
  }

  goToOrganisation(event) {
    this.orgazation.focus();
  }

  getAllDepartment() {
    this.attendancePunchDetailsService.getAllDepartment().subscribe((res: any) => {
      this.departmentList = [];
      const defaultData = {
        departMentName: 'ALL',
        departmentCode: 'ALL'
      };
      this.departmentList.push(defaultData);
      res.forEach(element => {
        this.departmentList.push(element);
      });
      console.log('res getAllDepartment', this.departmentList);

    },
      error => {
        console.log('error', error);
        this.alertService.error('Error while getting All department Details!');

      });
  }

  modifyAttendanceDetails(item) {
    this.selectedRowId = item.slNo;
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }


}

