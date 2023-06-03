import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  DateAdapter,
  MatDialog,
  MatSelect,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DomSanitizer } from '@angular/platform-browser';
import { concat, forkJoin, Observable } from 'rxjs';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import {
  Department,
  Designation,
  SubDepartment,
} from '../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { EmployeeService } from '../../human-resource-mgmnt/master/employee-details/employee-details.service';
import { DriverDetail, DriverDocument } from './driver-details.model';
import { DriverDetailService } from './driver-details.service';

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
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class DriverDetailsComponent implements OnInit {
  @ViewChild('driverEntryDate', { static: false })
  driverEntryDate: ElementRef;
  @ViewChild('driverExpiryDate', { static: false })
  driverExpiryDate: ElementRef;
  @ViewChild('documentName', { static: false })
  documentName: ElementRef;
  @ViewChild('modifyButton', { static: false })
  modifyButton: ElementRef;
  @ViewChild('saveButton', { static: false })
  saveButton: ElementRef;
  @ViewChild('departmentRef', { static: false })
  departmentRef: MatSelect;

  @ViewChild('fileNameForDocument', { static: false })
  fileNameForDocument: ElementRef;

  disableButton: boolean;
  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  loggedInUserName: string;
  loggedInUserId: string;

  isFindOn: boolean;
  selectedDriverDetailForEdit: DriverDetail;

  departmentOptionsList: string[];
  departmentList: Department[];

  subDepartmentList: SubDepartment[];
  subDepartmentOptionList: string[];
  subDepartmentError: boolean;

  designationList: Designation[];
  designationError: boolean;

  employeeList: any = [];
  employeeError: boolean;
  selectedEmployeeId: string;

  licenceTypeList = ['Heavy', 'Light'];

  isFileError: boolean;

  documentList: DriverDocument[] = [];

  selectedDriverId: number;
  isModifyOn: boolean;

  isDocumentuploadDisabled = true;
  documentToUploadOnModify: DriverDocument[] = [];

  driverDetailsForm = new FormGroup({
    empName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    driverEntryDate: new FormControl({ value: '', disabled: true }, [Validators.required]),
    department: new FormControl({ value: '', disabled: true }, [Validators.required]),
    subDepartment: new FormControl({ value: '', disabled: true }, [Validators.required]),
    designation: new FormControl({ value: '', disabled: true }, [Validators.required]),
    employeeName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    contactNumber: new FormControl({ value: '', disabled: true }, [
      Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/),
    ]),
    drivingYearsExp: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/),
    ]),
    driverLicenseType: new FormControl({ value: '', disabled: true }, [Validators.required]),
    driverExpiryDate: new FormControl({ value: '', disabled: true }, [Validators.required]),
    nameOfDocument: new FormControl({ value: '', disabled: true }, [Validators.required]),
    driverLicenseNumber: new FormControl({ value: '', disabled: true }, [Validators.required]),
    drivingLicenseIssueAuthority: new FormControl({ value: '', disabled: true }, [Validators.required]),
  });
  constructor(
    public authService: AuthenticationService,
    private empService: EmployeeService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
    private driverDetailService: DriverDetailService
  ) { }

  ngOnInit() {
    this.enableNew = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.getDepartments();
    const emp = this.authService.getUserdetails();
    this.loggedInUserName = emp.userName;
    this.loggedInUserId = emp.employeeId;
    this.driverDetailsForm.controls.empName.setValue(`${emp.userName}`);
    this.driverDetailsForm.disable();
  }

  designationValueChange() {
    const designation = this.driverDetailsForm.controls.designation.value;
    this.getAllEmployeeByDesignationCode(designation);
  }

  getAllEmployeeByDesignationCode(designation: any) {
    try {
      if (this.isFindOn || this.isModifyOn) {
        this.driverDetailService.getAllEmployeeRegisterWithDriverDetails(designation).subscribe(
          (data: any) => {
            this.employeeList = data;
            this.employeeError = data && data.length === 0;
          },
          (err) => {
            this.alertService.error(
              'Error has occured while fetching employees.'
            );
            this.employeeError = true;
            this.employeeList = [];
          }
        );
      } else {
        this.driverDetailService.getAllEmployeeNotRegisterWithDriverDetails(designation).subscribe(
          (data: any) => {
            this.employeeList = data;
            this.employeeError = data && data.length === 0;
          },
          (err) => {
            this.alertService.error(
              'Error has occured while fetching employees.'
            );
            this.employeeError = true;
            this.employeeList = [];
          }
        );
      }
    } catch (error) { }
  }

  employeeValueChange() {
    const selectedEmpId: number = this.driverDetailsForm.controls.employeeName.value;
    const selectedEmp = this.employeeList.find(
      (emp) => emp.empId === selectedEmpId
    );
    this.selectedEmployeeId = this.driverDetailsForm.controls.employeeName.value;
    if (selectedEmp.contactNo) {
      this.driverDetailsForm.controls.contactNumber.setValue(
        `0${selectedEmp.contactNo}`
      );
    }
    this.driverDetailsForm.controls.contactNumber.disable();
    if (this.isFindOn && (!this.isModifyOn)) {
      this.isDocumentuploadDisabled = true;
      this.driverDetailService.getDriverDetailByEmployeeId(this.selectedEmployeeId).subscribe((data: any) => {

        this.driverDetailsForm.controls.empName.setValue(data.empCreatedID);
        this.driverDetailsForm.controls.empName.disable();

        this.driverDetailsForm.controls.driverEntryDate.setValue(data.driverEntryDate);
        this.driverDetailsForm.controls.driverEntryDate.disable();

        this.driverDetailsForm.controls.driverExpiryDate.setValue(data.driverExpiryDate);
        this.driverDetailsForm.controls.driverExpiryDate.disable();

        this.driverDetailsForm.controls.drivingYearsExp.setValue(data.drivingYearsExp);
        this.driverDetailsForm.controls.drivingYearsExp.disable();

        this.driverDetailsForm.controls.driverLicenseType.setValue(data.driverLicenseType);
        this.driverDetailsForm.controls.driverLicenseType.disable();

        this.driverDetailsForm.controls.driverLicenseNumber.setValue(data.driverLicenseNumber);
        this.driverDetailsForm.controls.driverLicenseNumber.disable();

        this.driverDetailsForm.controls.drivingLicenseIssueAuthority.setValue(data.drivingLicenseIssueAuthority);
        this.driverDetailsForm.controls.drivingLicenseIssueAuthority.disable();
        this.documentList = data.documentList;
      });
    }

    if (this.isModifyOn) {
      this.driverDetailService.getDriverDetailByEmployeeId(this.selectedEmployeeId).subscribe((data: any) => {

        this.driverDetailsForm.controls.contactNumber.enable();
        this.driverDetailsForm.controls.nameOfDocument.enable();

        this.driverDetailsForm.controls.empName.setValue(data.empCreatedID);
        this.driverDetailsForm.controls.empName.enable();

        this.driverDetailsForm.controls.driverEntryDate.setValue(data.driverEntryDate);
        this.driverDetailsForm.controls.driverEntryDate.enable();

        this.driverDetailsForm.controls.driverExpiryDate.setValue(data.driverExpiryDate);
        this.driverDetailsForm.controls.driverExpiryDate.enable();

        this.driverDetailsForm.controls.drivingYearsExp.setValue(data.drivingYearsExp);
        this.driverDetailsForm.controls.drivingYearsExp.enable();

        this.driverDetailsForm.controls.driverLicenseType.setValue(data.driverLicenseType);
        this.driverDetailsForm.controls.driverLicenseType.enable();

        this.driverDetailsForm.controls.driverLicenseNumber.setValue(data.driverLicenseNumber);
        this.driverDetailsForm.controls.driverLicenseNumber.enable();

        this.driverDetailsForm.controls.drivingLicenseIssueAuthority.setValue(data.drivingLicenseIssueAuthority);
        this.driverDetailsForm.controls.drivingLicenseIssueAuthority.enable();

        this.isDocumentuploadDisabled = false;
        this.documentList = data.documentList;
      });
    }
  }




  subDepartmentValueChange() {
    this.getDesignations(this.driverDetailsForm.controls.subDepartment.value);
  }

  licenceTypeChange() {
  }

  expiryDateChanged() {
  }

  getDesignations(subDepartmentCode: string) {
    try {
      this.empService.getDesingnations(subDepartmentCode).subscribe(
        (data: Designation[]) => {
          this.designationList = data;
          this.designationError = data && data.length === 0;
        },
        (err) => {
          this.alertService.error(
            'Error has occured while fetching designations.'
          );
          this.designationError = true;
          this.designationList = [];
        }
      );
    } catch (error) { }
  }

  departmentValueChange() {
    try {
      const departmentCode = this.driverDetailsForm.controls.department.value;
      if (departmentCode) {
        this.driverDetailsForm.controls.subDepartment.setValue('');
        this.driverDetailsForm.controls.designation.setValue('');
        this.getSubDepartments(departmentCode);
      } else {
        this.subDepartmentList = [];
        this.subDepartmentOptionList = [];
        this.driverDetailsForm.controls.subDepartment.setValue('');
        this.driverDetailsForm.controls.designation.setValue('');
      }
    } catch (error) {
    }
  }

  onFileChange(event) {
    try {
      if (!event.target.files[0].type.toLowerCase().match('image/jp.*')
        && !event.target.files[0].type.toLowerCase().match('image/pn.*')
        && !event.target.files[0].type.toLowerCase().match('application/pd.*')) {
        this.isFileError = true;
        return;
      }
      if (event && event.target.files && event.target.files.length) {
        this.isFileError = false;
        const file: File = event.target.files[0];
        const docGivenName = this.driverDetailsForm.controls.nameOfDocument.value;
        const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
        if (!docGivenName) {
          this.driverDetailsForm.controls.nameOfDocument.setValue(name);
        }
        const driverDocument: DriverDocument = {
          driverDocumentName: name,
          driverDocumentDetails: file,
          driverId: null
        };
        this.documentList.push(driverDocument);
        if (this.isModifyOn) {
          this.documentToUploadOnModify.push(driverDocument);
        }

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more documents?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.documentName.nativeElement.focus();
            this.driverDetailsForm.controls.nameOfDocument.setValue('');
          } else {
            if (this.isFindOn) {
              this.modifyButton.nativeElement.focus();
              return;
            }
            this.saveButton.nativeElement.focus();
          }

        });
      }
    } catch (error) {

    }
  }

  getSubDepartments(departmentCode: string) {
    try {
      this.empService.getSubDepartments(departmentCode).subscribe(
        (data: SubDepartment[]) => {
          this.subDepartmentList = data;
          this.subDepartmentError = data && data.length === 0;
        },
        (err) => {
          this.alertService.error(
            'Error has occured while fetching sub departments.'
          );
          this.subDepartmentList = [];
          this.subDepartmentError = true;
        }
      );
    } catch (error) {
    }
  }


  addNewDriverDetails() {
    try {
      this.clearDriverDetails();
      this.driverDetailsForm.enable();
      this.driverDetailsForm.controls.empName.setValue(`${this.loggedInUserName}`);
      this.driverDetailsForm.controls.empName.disable();
      this.driverDetailsForm.controls.driverEntryDate.setValue(new Date());
      setTimeout(() => {
        this.driverEntryDate.nativeElement.focus();
      }, 100);
      this.enableNew = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
      this.isDocumentuploadDisabled = false;
    } catch (error) {

    }
  }

  getFormattedDate(): any {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
  }

  saveDriverDetails() {
    try {
      const driverDetails: DriverDetail = this.getDriverDetail();
      if (!driverDetails) {
        return;
      }
      this.disableButton = true;
      if (this.isModifyOn) {
        this.driverDetailService.updateDriverDetail(driverDetails).subscribe((data: any) => {
          this.disableButton = false;
          this.alertService.success('Driver Details Updated successfully.');
          this.alertService.success('Now Uploading Your Documents....');

          if (data.DriverID) {
            this.disableButton = true;
            this.uploadDriverDocument(data.DriverID);
          }
        }, err => {
          this.disableButton = false;
          this.alertService.error('Error has occured while updating an Driver Details.');
        });

      } else {
        this.driverDetailService.addDriverDetail(driverDetails).subscribe((data: any) => {
          this.disableButton = false;
          this.alertService.success('Driver Details created successfully.');
          this.alertService.success('Now Uploading Your Documents....');

          if (data.DriverID) {
            this.disableButton = true;
            this.uploadDriverDocument(data.DriverID);
          }
        }, err => {
          this.disableButton = false;
          this.alertService.error('Error has occured while creating an Driver Details.');
        });

      }

    } catch (error) {

    }
  }

  uploadDriverDocument(driverId: string) {
    try {
      if ((!this.isModifyOn) && this.documentList && this.documentList.length > 0) {
        const fileUploadObs: Observable<any>[] = [];
        this.documentList.forEach(driveDetailDocument => {
          if (!driveDetailDocument.docUploadNumber) {
            driveDetailDocument.driverId = driverId;
            fileUploadObs.push(this.driverDetailService.uploadDriverDocument(driveDetailDocument));
          }
        });
        // this.disableButton = true;
        if (fileUploadObs && fileUploadObs.length > 0) {
          concat(...fileUploadObs).subscribe(res => {
            if (res.isSaved) {
              this.alertService.success(`${res.documentName} is Saved Successfully`);
              this.disableButton = false;
              this.clearDriverDetails();
              this.driverDetailsForm.disable();
            }
          }, err => {
            this.alertService.error(`Error has occured while Uploading Document, Please Try again!`);
          });
        }

      }


      //
      if (this.documentToUploadOnModify && this.documentToUploadOnModify.length > 0) {
        const fileUploadObs: Observable<any>[] = [];
        this.documentToUploadOnModify.forEach(driveDetailDocument => {
          if (!driveDetailDocument.docUploadNumber) {
            driveDetailDocument.driverId = driverId;
            fileUploadObs.push(this.driverDetailService.uploadDriverDocument(driveDetailDocument));
          }
        });
        // this.disableButton = true;
        if (fileUploadObs && fileUploadObs.length > 0) {
          concat(...fileUploadObs).subscribe(res => {
            if (res.isSaved) {
              this.alertService.success(`${res.documentName} is Saved Successfully`);
              this.disableButton = false;
              this.clearDriverDetails();
              this.driverDetailsForm.disable();
            }
          }, err => {
            this.alertService.error(`Error has occured while Uploading Document, Please Try again!`);
          });
        }

      }


    } catch (error) {
    }
  }


  findDriverDetails() {
    this.isFindOn = true;
    this.driverDetailsForm.controls.department.enable();
    this.departmentRef.focus();
    this.driverDetailsForm.controls.subDepartment.enable();
    this.driverDetailsForm.controls.designation.enable();
    this.driverDetailsForm.controls.employeeName.enable();
    this.enableNew = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;
  }


  downloadFile(driverDocument: any) {
    try {
      if (!driverDocument.documentUploadNumber) {
        const blob = new Blob([driverDocument.driverDocumentDetails], { type: driverDocument.driverDocumentDetails.type });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const downloadURL = URL.createObjectURL(blob);
        window.open(downloadURL);

      } else {

        console.log(driverDocument);
        this.driverDetailService.GetDriverDocumentByDocumentUploadNumber(driverDocument.docUploadNumber).subscribe((data: Blob) => {

          const blob = new Blob([data], {
            type: driverDocument.driverDocumentName.toLowerCase().indexOf('.pdf') !== -1 ?
              'application/pdf' : 'image/' + driverDocument.driverDocumentName.split('.')[1]
          });

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
          }
          const downloadURL = URL.createObjectURL(blob);
          window.open(downloadURL);
        });
      }
    } catch (error) {

    }
  }



  getDriverDetail(): DriverDetail {
    try {
      if (this.driverDetailsForm.valid) {
        const driverDetails: DriverDetail = new Object() as DriverDetail;
        if (this.isModifyOn) {
          driverDetails.driverId = this.selectedDriverId;
        } else {

        }
        driverDetails.empCreatedId = this.loggedInUserId;
        driverDetails.driverEntryDate = new Date(this.driverDetailsForm.controls.driverEntryDate.value);
        driverDetails.employeeId = this.selectedEmployeeId;
        driverDetails.drivingYearsExp = this.driverDetailsForm.controls.drivingYearsExp.value;
        driverDetails.driverLicenseType = this.driverDetailsForm.controls.driverLicenseType.value;
        driverDetails.driverLicenseNumber = this.driverDetailsForm.controls.driverLicenseNumber.value;
        driverDetails.driverExpiryDate = new Date(this.driverDetailsForm.controls.driverExpiryDate.value);
        driverDetails.drivingLicenseIssueAuthority = this.driverDetailsForm.controls.drivingLicenseIssueAuthority.value;
        return driverDetails;

      } else {
        this.markFieldAsTouched(this.driverDetailsForm);
        return null;
      }
    } catch (error) {

    }
  }

  markFieldAsTouched(form: FormGroup) {
    try {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } catch (error) {

    }
  }

  modifyDriverDetails() {
    try {
      this.findDriverDetails();
      this.enableSave = true;
      this.isModifyOn = true;
    } catch (error) {

    }
  }

  getDepartments() {
    try {
      this.empService.getDepartments().subscribe(
        (data: Department[]) => {
          if (data) {
            this.departmentList = data;
            this.departmentOptionsList = data.map((a) => a.departMentName);
          }
        },
        (err) => {
          this.alertService.error(
            'Error has occured while fetching departments.'
          );
          this.departmentList = [];
          this.departmentOptionsList = [];
        }
      );
    } catch (error) { }
  }


  clearDriverDetails() {
    try {
      this.selectedDriverDetailForEdit = null;

      this.subDepartmentList = [];
      this.subDepartmentOptionList = [];

      this.designationList = [];

      this.isFindOn = false;
      this.isModifyOn = false;
      this.documentList = [];

      this.driverDetailsForm.reset();
      this.driverDetailsForm.controls.empName.setValue(this.loggedInUserName);
      this.driverDetailsForm.disable();

      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;

      this.employeeList = [];
      this.documentList = [];
      this.fileNameForDocument.nativeElement.value = '';
    } catch (error) {

    }
  }

}
