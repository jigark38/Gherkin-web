import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AttendanceDetailSearchModel, DaywiseAttendaceModel, OfficeLocationModel, AttendanceRequestmodel } from './daywise-attendance-finalization.model';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DaywiseAttendaceFinalizationService } from './daywise-attendace-finalization.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MomentUtcDateAdapter } from 'src/app/shared/directives/moment-utc-date-adapter';
import { parse } from '@babel/core';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
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
  selector: 'app-daywise-attendance-finalization',
  templateUrl: './daywise-attendance-finalization.component.html',
  styleUrls: ['./daywise-attendance-finalization.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DaywiseAttendanceFinalizationComponent implements OnInit {
  daywiseattendaceForm: FormGroup;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('unitLocationField', { static: false }) unitLocationField: MatSelect;
  actions: any = { enabled: true, showEdit: true };
  lstEmployee: DaywiseAttendaceModel[] = [];
  tempEmployeeList: DaywiseAttendaceModel[] = [];
  filterLstEmployee: DaywiseAttendaceModel[] = [];
  isModifyMode: boolean;
  officeLocationList: OfficeLocationModel[] = [];
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  isFindMode: boolean;
  orgCols: any[];
  departmentList = [];
  employeeId: string;
  employeeName: string;
  lstSubDepartment: any[] = [];
  min = 0;
  max = 10;
  dataNotFound = false;
  selectedRowId = 0;
  isSearchById: boolean = false;
  selectedRow: any;
  clearBtnCliked: boolean = false;
  disblSaveBtn: boolean = true;
  disblAttFinlizeBtn: boolean = false;
  filterByValue: string = '';

  constructor(public authService: AuthenticationService,
    private DaywiseAttendaceFinalizationService: DaywiseAttendaceFinalizationService,
    private readonly formBuilder: FormBuilder,
    private alertService: AlertService,
    private dialog: MatDialog,
    private datePipe: DatePipe,

  ) { }

  @ViewChild('saveBtn', { read: ElementRef, static: false }) saveBtn: ElementRef;



  ngOnInit() {

    try {
      this.formCreation();
      this.loadAllDepartment();
      const defaultData = {
        departMentName: 'ALL',
        departmentCode: 'ALL'
      };
      this.departmentList.push(defaultData);
      this.loadUnitNames();
    } catch (error) {

    }
  }

  formCreation() {
    this.daywiseattendaceForm = this.formBuilder.group({
      unitLocation: ['', [Validators.required]],
      department: ['ALL', [Validators.required]],
      AttendanceDate: ['', [Validators.required]],
      detailsOrderBy: ['', [Validators.nullValidator]],
      subDepartmentCode: ['', [Validators.nullValidator]],
      workerOrstaff: ['Worker', [Validators.nullValidator]],
      searchByID: ['', [Validators.nullValidator]],
      UpdatedBy: [this.authService.getUserdetails().userName, [Validators.nullValidator]],
      UpdatedDate: [null, [Validators.nullValidator]],
      employeeName: ['', [Validators.nullValidator]],
      gender: [''],
      inTimeUpdated: ['', [Validators.nullValidator]],
      outTimeUpdated: ['', [Validators.nullValidator]],
      duration: ['', [Validators.nullValidator]],
      employeeDepartment: ['', [Validators.nullValidator]],
      employeeSubDepartmentCode: ['', [Validators.nullValidator]],
      filterBy: [''],
      parentCheckBox : [false]
    });
    this.daywiseattendaceForm.disable();
    // this.daywiseattendaceForm.controls.UpdatedDate.disable();
    // this.daywiseattendaceForm.controls.UpdatedBy.disable();
  }


  loadUnitNames() {
    try {
      this.DaywiseAttendaceFinalizationService.getOfficeLocations().subscribe((data: OfficeLocationModel[]) => {
        if (data) {
          this.officeLocationList = data;
          //this.getEmployeeByDivision();
        }
      }, err => {
        this.officeLocationList = [];
      });
    } catch (error) {

    }
  }


  loadAllDepartment() {
    this.DaywiseAttendaceFinalizationService.getAllDepartment().subscribe((res: any) => {
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

  attendenceFinilClick() {
    this.disblAttFinlizeBtn = true;
    this.clearBtnCliked = false;
    this.daywiseattendaceForm.enable();
    this.daywiseattendaceForm.controls.UpdatedDate.disable();
    this.daywiseattendaceForm.controls.UpdatedBy.disable();
    this.formCreation();
  }

  changeDept(event: any) {
    this.daywiseattendaceForm.controls.subDepartmentCode.setValue("");
    this.lstSubDepartment = [];
    this.loadSubdepartments(event.value);

  }

  async loadSubdepartments(deptCode: any) {
    this.lstSubDepartment = await this.DaywiseAttendaceFinalizationService.getSubDepartments(deptCode).toPromise();
  }


  getEmployeeByDivision() {
    this.lstEmployee = [];
    this.selectedRowId = null;
    this.min = 0;
    this.max = 10;
    this.DaywiseAttendaceFinalizationService.getEmployeeByDivision(this.daywiseattendaceForm.value.workerOrstaff)
      .subscribe((res: DaywiseAttendaceModel[]) => {
        this.filterLstEmployee = res;
        //this.filterLstEmployee.sort((a, b) => (a.indRegId > b.indRegId) ? 1 : ((b.indRegId > a.indRegId) ? -1 : 0))
        if (res.length === 0) {
          this.dataNotFound = true;
          this.lstEmployee = [];
        } else {
          this.dataNotFound = false;
          res.forEach(element => {

            element.slNo = this.lstEmployee.length + 1;
            this.lstEmployee.push(element);
          });
        }

      });
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  modifyEmployeeceDetails(item) {
    this.selectedRow = item;
    this.isSearchById = true;
    this.selectedRowId = item.indRegId;
    this.loadSubdepartments(item.departmentCode);
    this.daywiseattendaceForm.patchValue({
      employeeName: item.employeeName,
      duration: item.duration ? item.duration : '',
      inTimeUpdated: item.inTime ? item.inTime.trim() : '',
      outTimeUpdated: item.outTime ? item.outTime.trim() : '',
      employeeDepartment: item.departmentCode,
      employeeSubDepartmentCode: item.subDepartmentCode,
      searchByID: item.indRegId
    });
    //this.daywiseattendaceForm.controls.employeeDepartment.setValue(item.department);
  }

  filterEmployeeList() {
    console.log((Number)(this.daywiseattendaceForm.controls.searchByID.value));
    if (this.daywiseattendaceForm.controls.unitLocation.value == "") {
      this.alertService.error('please select unit location');
      return;
    }
    else if (this.daywiseattendaceForm.controls.AttendanceDate.value == "" || this.daywiseattendaceForm.controls.AttendanceDate.value == '') {
      this.alertService.error('please select attendance date');
      return;
    }
    else if (((Number)(this.daywiseattendaceForm.controls.searchByID.value)) === NaN) {
      this.alertService.error('please enter a valid biometric id');
      return;
    }
    if (this.daywiseattendaceForm.controls.searchByID.value > 0 && this.daywiseattendaceForm.controls.AttendanceDate.value != null) {
      var serchModel = new AttendanceDetailSearchModel();
      serchModel.date = this.daywiseattendaceForm.controls.AttendanceDate.value;
      serchModel.biometricNo = this.daywiseattendaceForm.controls.searchByID.value;

      this.DaywiseAttendaceFinalizationService.GetEmployeeById(serchModel).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.lstEmployee = [];
          this.lstEmployee = res.Data;
        }
      })
      //= this.tempEmployeeList.filter(f => f.employeeId === this.daywiseattendaceForm.controls.searchByID.value);
    } else {
      this.lstEmployee = [];
      this.lstEmployee = this.tempEmployeeList;
    }
    this.isSearchById = false;
    this.ClearData()
  }

  ClearData() {
    this.daywiseattendaceForm.patchValue({
      employeeName: null,
      duration: null,
      inTimeUpdated: null,
      outTimeUpdated: null,
      employeeDepartment: null,
      employeeSubDepartmentCode: null
    });
  }

  saveEmployee() {
    const createData = this.daywiseattendaceForm.value;
    const userDetails = {
      userId: createData.userId,
      userName: createData.userName,
      password: createData.password
    };
  }

  updateEmployeeDetails(rowItem) {
    if (this.selectedRow != null) {
      
      let empModel = new AttendanceRequestmodel();
      empModel.orgOfficeNo = this.daywiseattendaceForm.controls.unitLocation.value;
      empModel.attendanceDate = this.daywiseattendaceForm.controls.AttendanceDate.value;
      empModel.attndUpdatedDate = new Date();
      empModel.entryUpdatedByEmployeeID = this.authService.getUserdetails().employeeId;
      const data :DaywiseAttendaceModel[] = [];
      data.push(rowItem);
      empModel.attendances = data;
      this.DaywiseAttendaceFinalizationService.updateAttendanceDetail(empModel).subscribe((res: any) => {
        if (res.IsSucceed) {

          this.alertService.success('Updated successfully');
        }
        else {
          this.alertService.error('Error in updating details');
        }
      })
    }

  }

  orderEmployeesBy() {
    var orderBy = this.daywiseattendaceForm.controls.detailsOrderBy.value;
    if (orderBy == "department") {
      this.lstEmployee.sort((a, b) => (a.department > b.department) ? 1 : ((b.department > a.department) ? -1 : 0))
    }
    else if (orderBy == "id") {
      this.lstEmployee.sort((a, b) => (a.indRegId > b.indRegId) ? 1 : ((b.indRegId > a.indRegId) ? -1 : 0))
    }
    else {
      this.lstEmployee.sort((a, b) => (a.inTime > b.inTime) ? 1 : ((b.inTime > a.inTime) ? -1 : 0))
    }
  }

  filterBy() {
    this.daywiseattendaceForm.controls.searchByID.setValue("");
    this.daywiseattendaceForm.controls.inTimeUpdated.setValue("");
    this.daywiseattendaceForm.controls.outTimeUpdated.setValue("");
    this.daywiseattendaceForm.controls.duration.setValue("");
    this.daywiseattendaceForm.controls.employeeDepartment.setValue("");
    this.daywiseattendaceForm.controls.employeeSubDepartmentCode.setValue("");
    this.daywiseattendaceForm.controls.employeeName.setValue("");
    this.daywiseattendaceForm.controls.parentCheckBox.setValue(false);
    this.disblSaveBtn = true;

    var filtrBy = this.daywiseattendaceForm.controls.filterBy.value;
    this.filterByValue = filtrBy;
    if (filtrBy == "singlePunch") {
      this.lstEmployee = this.tempEmployeeList.filter(x => (x.inTime == null && x.outTime != null) || (x.inTime != null && x.outTime == null));
    }
    else if (filtrBy == "attended") {
      this.lstEmployee = this.tempEmployeeList.filter(x => (x.inTime != null && x.outTime != null));
      
      var unCheckList = this.lstEmployee.filter(emp => emp.isChecked == false);
      if (unCheckList.length) {
        this.daywiseattendaceForm.controls.parentCheckBox.setValue(false);
      } else {
        this.disblSaveBtn = false;
        this.daywiseattendaceForm.controls.parentCheckBox.setValue(true);
      }
    }
    else if (filtrBy == "missed") {
      this.lstEmployee = this.tempEmployeeList.filter(x => (x.outTime == null && x.inTime == null));
    }
    else {
      this.lstEmployee = this.tempEmployeeList;
    }
  }

  OnDateChange() {
    this.getAttendanceDetail();
  }

  getAttendanceDetail() {

    this.daywiseattendaceForm.controls.searchByID.setValue("");
    this.daywiseattendaceForm.controls.inTimeUpdated.setValue("");
    this.daywiseattendaceForm.controls.outTimeUpdated.setValue("");
    this.daywiseattendaceForm.controls.duration.setValue("");
    this.daywiseattendaceForm.controls.employeeDepartment.setValue("");
    this.daywiseattendaceForm.controls.employeeSubDepartmentCode.setValue("");
    this.daywiseattendaceForm.controls.employeeName.setValue("");
    this.daywiseattendaceForm.controls.filterBy.setValue('');

    if (!this.clearBtnCliked) {
      if (this.daywiseattendaceForm.controls.unitLocation.value == "") {
        this.alertService.error('please select unit location');
        return;
      }
      else if (this.daywiseattendaceForm.controls.AttendanceDate.value == "" || this.daywiseattendaceForm.controls.AttendanceDate.value == '') {
        this.alertService.error('please select attendance date');
        return;
      }
      var serchModel = new AttendanceDetailSearchModel();
      serchModel.orgOfficeNo = this.daywiseattendaceForm.controls.unitLocation.value;
      serchModel.date = this.daywiseattendaceForm.controls.AttendanceDate.value;
      if (this.daywiseattendaceForm.controls.workerOrstaff.value == null) {
        this.daywiseattendaceForm.controls.workerOrstaff.setValue("Worker");
      }
      serchModel.division = this.daywiseattendaceForm.controls.workerOrstaff.value;
      if (this.daywiseattendaceForm.controls.department.value == null) {
        this.daywiseattendaceForm.controls.department.setValue("ALL");
      }
      serchModel.deptCode = this.daywiseattendaceForm.controls.department.value;
      serchModel.subDeptCode = this.daywiseattendaceForm.controls.subDepartmentCode.value;
      this.tempEmployeeList = [];
      this.DaywiseAttendaceFinalizationService.getAttendanceDetail(serchModel).subscribe((res: any) => {
        if (res.IsSucceed) {
          if (res.Data.length === 0) {
            this.dataNotFound = true;
            this.lstEmployee = [];
          } else {
            this.dataNotFound = false;
            this.lstEmployee = [];
            res.Data.forEach(element => {
              element.slNo = this.lstEmployee.length + 1;
              element.shiftDuration = element.shiftDuration.slice(0, 5);
              this.lstEmployee.push(element);
            });
          }
          this.tempEmployeeList = this.lstEmployee
          this.orderEmployeesBy();
        }
        else {
          this.alertService.error('Error in geting details');
        }
      })
    }

  }

  calculateDuration() {
    if (/^(2[0-4]|[01]?[0-9]):([0-5]?[0-9])$/.test(this.daywiseattendaceForm.controls.inTimeUpdated.value) && /^(2[0-4]|[01]?[0-9]):([0-5]?[0-9])$/.test(this.daywiseattendaceForm.controls.outTimeUpdated.value)) {
      let intime: string = this.daywiseattendaceForm.controls.inTimeUpdated.value;
      let outtime: string = this.daywiseattendaceForm.controls.outTimeUpdated.value;

      let inHour: number = Number(intime.split(":")[0]);
      let inMinutes: number = Number(intime.split(":")[1]);
      let outHour: number = Number(outtime.split(":")[0]);
      let outMinutes: number = Number(outtime.split(":")[1]);

      let inTimeMinuts = (inHour * 60) + inMinutes;
      let outTimeMinuts = (outHour * 60) + outMinutes;

      let durationMinutes = inTimeMinuts > outTimeMinuts ? inTimeMinuts - outTimeMinuts : outTimeMinuts - inTimeMinuts;

      let hours = Math.floor(durationMinutes / 60);
      let minutes = durationMinutes % 60;
      var result = '';
      if (String(minutes).length == 1) {
        result = hours + ":" + '0' + minutes;
      }
      else {
        result = hours + ":" + minutes;
      }

      this.daywiseattendaceForm.controls.duration.setValue(result);
      return result; 

    }
    else {
      this.daywiseattendaceForm.controls.subDepartmentCode.setValue('');
      this.daywiseattendaceForm.controls.duration.setValue('');
    }


    // if (intime != "" && outtime != "" && intime != null && outtime != null) {

    // }
    // else {
    //   return "";
    // }
  }

  reset() {
    this.clearBtnCliked = true;
    this.lstEmployee = new Array<DaywiseAttendaceModel>();
    this.tempEmployeeList = new Array<DaywiseAttendaceModel>();
    this.filterLstEmployee = new Array<DaywiseAttendaceModel>();
    this.daywiseattendaceForm.reset();
    this.daywiseattendaceForm.disable();
    this.disblAttFinlizeBtn = false;
  }

  UpdateAttendance() {
    if (/^(2[0-4]|[01]?[0-9]):([0-5]?[0-9])$/.test(this.daywiseattendaceForm.controls.inTimeUpdated.value) && /^(2[0-4]|[01]?[0-9]):([0-5]?[0-9])$/.test(this.daywiseattendaceForm.controls.outTimeUpdated.value)) {
      const index = this.lstEmployee.findIndex(key => key.indRegId == this.selectedRowId);
      this.lstEmployee[index].isEdited = true;
      this.lstEmployee[index].inTime = this.daywiseattendaceForm.controls.inTimeUpdated.value;
      this.lstEmployee[index].outTime = this.daywiseattendaceForm.controls.outTimeUpdated.value;
      this.lstEmployee[index].duration = this.daywiseattendaceForm.controls.duration.value;
      this.lstEmployee[index].dateTimeRecord = this.daywiseattendaceForm.controls.AttendanceDate.value;
      this.lstEmployee[index].departmentCode = this.daywiseattendaceForm.controls.employeeDepartment.value;
      this.lstEmployee[index].subDepartmentCode = this.daywiseattendaceForm.controls.employeeSubDepartmentCode.value;
      this.lstEmployee[index].isChecked = true;
      this.selectedRowId = 0;
      this.selectedRow = null;
      var unCheckList = this.lstEmployee.filter(emp => emp.isChecked == true);
      if (unCheckList.length) {
        this.disblSaveBtn = false;
      } else {
        this.disblSaveBtn = true;
      }

     //Clear the form once updated the grid
      this.daywiseattendaceForm.controls.searchByID.setValue("");
      this.daywiseattendaceForm.controls.inTimeUpdated.setValue("");
      this.daywiseattendaceForm.controls.outTimeUpdated.setValue("");
      this.daywiseattendaceForm.controls.duration.setValue("");
      this.daywiseattendaceForm.controls.employeeDepartment.setValue("");
      this.daywiseattendaceForm.controls.employeeSubDepartmentCode.setValue("");
      this.daywiseattendaceForm.controls.employeeName.setValue("");

      // this.updateEmployeeDetails(this.lstEmployee[index]);
      // //delete the item once saved 
      // this.lstEmployee = this.lstEmployee.filter(emp => emp.indRegId != this.selectedRowId);

      // if (index > -1 && this.lstEmployee.length > 1) {

      //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //     width: '350px',
      //     data: 'Do you want to update more Details?'
      //   });

      //   dialogRef.afterClosed().subscribe(result => {
      //     if (result) {
      //       this.modifyEmployeeceDetails(this.lstEmployee[index + 1]);
      //     } else {
      //       this.selectedRowId = 0;
      //       this.selectedRow = null;
      //       this.disblSaveBtn = false;
      //     }
      //   });

      // }
      // else {
      //   this.disblSaveBtn = false;
      //   this.saveBtn.nativeElement.focus();

      //   this.reset();
      // }
    }
    else {
      this.alertService.error('Enter valid in and out time');
    }


  }

  save() {
    this.disblSaveBtn = true;
    var list = this.lstEmployee.filter(emp => emp.isChecked == true);
    if(list.length){
      let empModel = new AttendanceRequestmodel();
      empModel.orgOfficeNo = this.daywiseattendaceForm.controls.unitLocation.value;
      empModel.attendanceDate = this.daywiseattendaceForm.controls.AttendanceDate.value;
      empModel.attndUpdatedDate = new Date();
      empModel.entryUpdatedByEmployeeID = this.authService.getUserdetails().employeeId;
      empModel.attendances = list;
      this.DaywiseAttendaceFinalizationService.updateAttendanceDetail(empModel).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.reset();
          this.alertService.success('Updated successfully');
        }
        else {
          this.alertService.error('Error in updating details');
        }
      })
    }   
  }

  OnlyNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,4}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  CheckChildRow(item) {
    const index = this.lstEmployee.findIndex(key => key.indRegId == item.indRegId);
    if (this.lstEmployee[index].isChecked === true) {
      this.lstEmployee[index].isChecked = false;

      var unCheckList = this.lstEmployee.filter(emp => emp.isChecked == false);
      if (unCheckList.length) {
        this.daywiseattendaceForm.controls.parentCheckBox.setValue(false);
      } else {
        this.daywiseattendaceForm.controls.parentCheckBox.setValue(true);
      }

    } else {
      this.lstEmployee[index].isChecked = true;

      var checkList = this.lstEmployee.filter(emp => emp.isChecked == false);
      if (checkList.length) {
        this.daywiseattendaceForm.controls.parentCheckBox.setValue(false);
      } else {
        this.daywiseattendaceForm.controls.parentCheckBox.setValue(true);
      }
    }

    var list = this.lstEmployee.filter(emp => emp.isChecked == true);
    if (list.length) {
      this.disblSaveBtn = false;
    } else {
      this.disblSaveBtn = true;
    }
  }

  CheckParentRow() {
    if (this.daywiseattendaceForm.controls.parentCheckBox.value) {
      this.lstEmployee.forEach(x1 => x1.isChecked = false);
      var unCheckList = this.lstEmployee.filter(emp => emp.isChecked == false);
      if (unCheckList.length) {
        this.disblSaveBtn = true;
      } else {
        this.disblSaveBtn = false;
      }
    } else {
      this.lstEmployee.forEach(x1 => x1.isChecked = (x1.inTime != null && x1.outTime != null));
      var unCheckList = this.lstEmployee.filter(emp => emp.isChecked == false);
      if (unCheckList.length) {
        this.disblSaveBtn = true;
      } else {
        this.disblSaveBtn = false;
      }
    }
  }
}
