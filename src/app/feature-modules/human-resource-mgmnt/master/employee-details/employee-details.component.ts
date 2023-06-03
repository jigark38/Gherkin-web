import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  Contract,
  Department,
  Designation,
  Employee,
  EmployeeDocument,
  EmployeePayment,
  Skills,
  SubDepartment
} from './employee-details.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDatepicker, MatDialog, MatInput, MatSelect } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, concat, forkJoin } from 'rxjs';
import { debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { CameraCaptureDialogComponent } from 'src/app/corecomponents/camera-capture-dialog/camera-capture-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeService } from './employee-details.service';
import { RegexMaster } from 'src/app/shared/regex.master';
import { OfficeLocationModel } from 'src/app/feature-modules/secure/inward-gate-pass/inward-gate-pass.models';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
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
  selector: 'app-employee-information-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmployeeInformationDetailsComponent implements OnInit {

  @ViewChild('dateOfCreation', { static: false }) dateOfCreation: ElementRef;
  @ViewChild('biometric', { static: false }) biometric: ElementRef;
  @ViewChild('documentName', { static: false }) documentName: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('modifyButton', { static: false }) modifyButton: ElementRef;
  @ViewChild('departmentSearchField', { static: false }) departmentSearchField: MatSelect;


  orgCols = [
    { field: 'employeeId', header: 'Employee Id' },
    { field: 'empBiometricId', header: 'Biometric Id' },
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'orgOfficeName', header: 'Employee Under' },
    { field: 'departmenName', header: 'Department' },
    { field: 'subDepartmentName', header: 'Sub Department' },
    { field: 'designationName', header: 'Designation' },
    { field: 'employeeTOTExp', header: 'TotalExperience' },
  ];
  actions: any = { enabled: true, showEdit: true };
  employeeList: Employee[] = [];

  employeeInformationForm = new FormGroup({
    CreationDate: new FormControl('', [Validators.required]),
    LoginUserName: new FormControl('', [Validators.required]),
    Comployee: new FormControl('', [Validators.required]),
    Contractor: new FormControl(),
    BioMetricId: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    EmployeeNmae: new FormControl('', [Validators.required]),
    Gender: new FormControl('', [Validators.required]),
    EmployeeDivision: new FormControl('', [Validators.required]),
    DOB: new FormControl('', [Validators.required]),
    FatherSpouseName: new FormControl(''),
    RelationShip: new FormControl(''),
    ContactNumber: new FormControl('', [Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)]),
    AlternateContactNumber: new FormControl('', [Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)]),
    // tslint:disable-next-line: max-line-length
    Email: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)]),
    MaritalStatus: new FormControl(''),
    NoOfDependends: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    PresentAddress: new FormControl(''),
    PermanantAddress: new FormControl(''),
    BloodGroup: new FormControl(''),
    Department: new FormControl('', [Validators.required]),
    DepartmentSearch: new FormControl(''),
    SubDepartment: new FormControl('', [Validators.required]),
    Designation: new FormControl('', [Validators.required]),
    Skills: new FormControl('', [Validators.required]),
    EmpJoiningDate: new FormControl(''),
    InHouseExperience: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    TotalExperience: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    PfNumber: new FormControl(''),
    ESINumer: new FormControl(''),
    AadharNumber: new FormControl('', [Validators.pattern(/^\S*$/)]),
    PassportNumber: new FormControl('', [Validators.pattern(/^\S*$/)]),
    PanNumber: new FormControl('', [Validators.pattern(/^\S*$/)]),
    PermanantDesc: new FormControl('', [Validators.required]),
    PaymentTenure: new FormControl(''),
    Basic: new FormControl('', [Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]),
    HRA: new FormControl('', [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    DearnessAllowance: new FormControl('', [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    ConveyanceAllowance: new FormControl('', [Validators.pattern(/^(?:\d{0,9}\.\d{1,2})$|^\d{0,9}$/)]),
    MedicalAllowance: new FormControl('', [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    Incentives: new FormControl('', [Validators.pattern(/^(?:\d{0,9}\.\d{1,2})$|^\d{0,9}$/)]),
    EducationAllowance: new FormControl('', [Validators.pattern(/^(?:\d{0,9}\.\d{1,2})$|^\d{0,9}$/)]),
    OtherAllowances: new FormControl('', [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
    TotalSalary: new FormControl('', [Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,20}$/)]),
    NameOfDocument: new FormControl('')
  });

  public mobNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  public previewText = 'Hide';
  public hidePreview = false;
  biometricIdList: Employee[];
  biometricIdListOptions: string[] = [];

  employeeNameList: Employee[];
  employeeOptionsList: string[] = [];

  documentList: EmployeeDocument[] = [];
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 300 },
      height: { ideal: 200 }
    }
  };
  videoWidth = 0;
  videoHeight = 0;
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  isLoading: boolean;
  isLoadingEmployeeName: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  disableButton: boolean;
  biometricIdError: boolean;
  selectedEmployeeForEdit: Employee;
  selectedEmployeePamyentForEdit: EmployeePayment;
  isFileError: boolean;
  subDepartmentError: boolean;
  designationError: boolean;
  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  officeLocationList: OfficeLocationModel[];

  constructor(public authService: AuthenticationService, private empService: EmployeeService, private dialog: MatDialog,
    // tslint:disable-next-line: align
    private sanitizer: DomSanitizer, private alertService: AlertService) { }

  employeeImage: any;
  fileImageBlog: Blob;
  departmentList: Department[];
  departmentOptionsList: string[];

  subDepartmentList: SubDepartment[];
  subDepartmentOptionList: string[];

  designationList: Designation[];
  designationOptionList: string[];

  skillsList: Skills[];
  skillsOptionsList: string[];

  contractList: Contract[];
  contractOptionsList: string[];
  employeeId: string;
  employeeName: string;

  ngOnInit() {
    try {

      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;
      const emp = this.authService.getUserdetails();
      this.employeeName = emp.userName;
      this.employeeId = emp.employeeId;
      this.employeeInformationForm.controls.LoginUserName.setValue(this.employeeName);
      this.getDepartments();
      this.getSkills();
      this.getContracts();
      this.getOfficeLocations();
      this.employeeInformationForm.controls.Comployee.valueChanges.subscribe(() => {
        // tslint:disable-next-line: triple-equals
        if (this.employeeInformationForm.controls.Comployee.value == 1) {
          // this.employeeInformationForm.controls.Contractor.disable();
        } else {
          // this.employeeInformationForm.controls.Contractor.enable();
        }
      });

      this.employeeInformationForm.controls.EmployeeNmae.valueChanges.pipe(
        map(a => {
          if (!this.isFindOn && !this.isModifyOn) {
            return null;
          } else {
            return a;
          }
        }),
        debounceTime(300),
        tap(() => this.isLoadingEmployeeName = true),
        switchMap(value => this.empService.getEmployeeByEmployeeName(value)
          .pipe(
            finalize(() => this.isLoadingEmployeeName = false),
          )
        )
      ).subscribe(m => {
        // console.log(m);
        this.employeeNameList = m;
        this.employeeOptionsList = m.map(a => a.employeeName.toString());
      });

      this.employeeInformationForm.controls.BioMetricId.valueChanges.pipe(
        map(a => {
          if (!this.isFindOn && !this.isModifyOn) {
            return 0;
          } else {
            return a;
          }
        }),
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.empService.getEmployeeByBiometricId(+value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe(m => {
        // console.log(m);
        this.biometricIdList = m;
        this.biometricIdListOptions = m.map(a => a.empBiometricId.toString());
      });

      this.employeeInformationForm.disable();

    } catch (error) {

    }

  }

  getOfficeLocations() {
    try {
      this.empService.getOfficeLocations().subscribe((data: OfficeLocationModel[]) => {
        if (data) {
          this.officeLocationList = data;
        }
      }, err => {
        this.officeLocationList = [];
      });
    } catch (error) {

    }
  }

  biometricIdBlur() {
    try {
      const biometricId = +this.employeeInformationForm.controls.BioMetricId.value;
      const orgId = this.employeeInformationForm.controls.Comployee.value;
      if (!(orgId && !Number.isNaN(orgId))) {
        this.biometricIdError = false;
        return;
      }
      if (biometricId && !Number.isNaN(biometricId)) {
        if ((biometricId && !this.selectedEmployeeForEdit) || (this.selectedEmployeeForEdit && +
          this.selectedEmployeeForEdit.empBiometricId !== biometricId)) {

          this.empService.checkDuplicateBiometricId(biometricId, +orgId).subscribe((data: boolean) => {
            if (data) {
              this.biometricIdError = data;
            } else {
              this.biometricIdError = false;
            }
          });
        } else {
          this.biometricIdError = false;
        }
      }
    } catch (error) {

    }
  }

  getSkills() {
    try {
      this.empService.getSkills().subscribe((data: Skills[]) => {
        this.skillsList = data;
        this.skillsOptionsList = data.map(a => a.skillsName);
      });
    } catch (error) {
      this.skillsList = [];
      this.skillsOptionsList = [];
    }
  }
  skillValueChange(event) {

  }

  createEmployeePayment(employeePayment: EmployeePayment) {
    try {
      return new Observable((obs) => {
        // this.disableButton = true;
        this.empService.createEmployeePayment(employeePayment).subscribe((data: EmployeePayment) => {
          this.disableButton = false;
          obs.next();
          obs.complete();
        }, err => {
          // this.disableButton = false;
          obs.error();
        });
      });

    } catch (error) {

    }
  }

  getContracts() {
    try {
      this.empService.getContracts().subscribe((data: Contract[]) => {
        if (data) {
          this.contractList = data;
          this.contractOptionsList = data.map(a => a.contractorName);
        }
      });
    } catch (error) {

    }
  }

  contractValueChange(event) {

  }
  savesContractItemToList(contract: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (contract && !this.contractList.filter(a => a.contractorName == contract)[0]) {
        const contractObj: Contract = new Object() as Contract;
        contractObj.contractorName = contract;
        this.empService.addContract(contractObj).subscribe((data: Contract) => {
          if (data) {
            this.contractList.push(data);
            this.contractOptionsList.push(data.contractorName);
            this.contractOptionsList = this.contractOptionsList.slice();
            this.alertService.success('Contract added successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving contract.');
        });
      }
    } catch (error) {

    }
  }

  saveskillItemToList(skill: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (skill && !this.skillsList.filter(a => a.departmentCode == skill)[0]) {
        const skillObj: Skills = new Object() as Skills;
        skillObj.skillsName = skill;
        this.empService.addSkill(skillObj).subscribe((data: Skills) => {
          if (data) {
            this.skillsList.push(data);
            this.skillsOptionsList.push(data.skillsName);
            this.skillsOptionsList = this.skillsOptionsList.slice();
            this.alertService.success('Skill created successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving the skill.');
        });
      }
    } catch (error) {

    }
  }

  getDepartments() {
    try {

      this.empService.getDepartments().subscribe((data: Department[]) => {
        if (data) {
          this.departmentList = data;
          this.departmentOptionsList = data.map(a => a.departMentName);
        }
      }, err => {
        this.alertService.error('Error has occured while fetching departments.');
        this.departmentList = [];
        this.departmentOptionsList = [];
      });
    } catch (error) {

    }
  }

  savesDepartmentItemToList(department: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (department && !this.departmentList.filter(a => a.departMentName == department.trim())[0]) {
        const departmentObj: Department = new Object() as Department;
        departmentObj.departMentName = department.trim();
        this.empService.addDepartment(departmentObj).subscribe((data: Department) => {
          this.departmentList.push(data);
          this.departmentOptionsList.push(data.departMentName);
          this.departmentOptionsList = this.departmentOptionsList.slice();
          this.alertService.success('Department ' + department + ' saved successfully.');
        },
          err => {
            this.alertService.error('Error has occured while saving department.');
          });
      }
    } catch (error) {

    }
  }

  departmentValueChange(event) {
    try {
      if (event) {
        // tslint:disable-next-line: triple-equals
        const selectedDepartment = this.departmentList.filter(a => a.departMentName == event.trim())[0];
        if (selectedDepartment) {
          this.employeeInformationForm.controls.SubDepartment.setValue('');
          this.employeeInformationForm.controls.Designation.setValue('');
          this.getSubDepartments(selectedDepartment.departmentCode).subscribe(() => { });
        }
      } else {
        this.subDepartmentList = [];
        this.subDepartmentOptionList = [];
        this.employeeInformationForm.controls.SubDepartment.setValue('');
        this.employeeInformationForm.controls.Designation.setValue('');
      }
    } catch (error) {

    }
  }

  updateDepartment(event) {
    if (event && event.oldValue && event.newValue) {
      const matchedItem = this.departmentList.filter(a => a.departMentName === event.oldValue)[0];
      if (matchedItem) {
        const department = {
          Id: matchedItem.Id,
          departmentCode: matchedItem.departmentCode,
          departMentName: event.newValue,
          SubDepartments: matchedItem.SubDepartments
        };

        this.empService.updateDepartment(department).subscribe((res: Department) => {
          if (res) {
            this.departmentList.map(a => {
              if (a.departmentCode === res.departmentCode) {
                a.departMentName = res.departMentName;
              }
            });
            this.departmentOptionsList = this.departmentList.map(a => a.departMentName);
            this.departmentOptionsList = this.departmentOptionsList.slice();
            this.alertService.success('Department Updated successfully.');
          }
        });
      }
    }
  }

  getSubDepartments(departmentCode: string) {
    try {
      return new Observable((sub) => {
        this.empService.getSubDepartments(departmentCode).subscribe((data: SubDepartment[]) => {
          this.subDepartmentList = data;
          // tslint:disable-next-line: triple-equals
          this.subDepartmentError = data && data.length == 0;
          this.subDepartmentOptionList = data.map(a => a.subDepartmentName);
          sub.next();
        }, err => {
          this.subDepartmentList = [];
          this.subDepartmentOptionList = [];
          this.subDepartmentError = true;
          sub.error(err);
        });
      });
    } catch (error) {

    }
  }

  subDepartmentValueChange(event) {
    try {

      if (event) {
        // tslint:disable-next-line: triple-equals
        const selectedSubDepartment = this.subDepartmentList.filter(a => a.subDepartmentName == event.trim())[0];
        if (selectedSubDepartment) {
          this.employeeInformationForm.controls.Designation.setValue('');
          this.getDesignations(selectedSubDepartment.subDepartmentCode).subscribe(() => { });
        }
      } else {
        this.designationList = [];
        this.designationOptionList = [];
        this.employeeInformationForm.controls.Designation.setValue('');
      }

    } catch (error) {

    }
  }

  updateSubDepartment(event) {
    if (event && event.oldValue && event.newValue) {
      const matchedItem = this.subDepartmentList.filter(a => a.subDepartmentName === event.oldValue)[0];
      if (matchedItem) {
        const subDepartment = {
          Id: matchedItem.Id,
          subDepartmentCode: matchedItem.subDepartmentCode,
          subDepartmentName: event.newValue,
          departmentCode: matchedItem.departmentCode,
          Designations: matchedItem.Designations
        };
        this.empService.updateSubDepartment(subDepartment).subscribe((res: SubDepartment) => {
          if (res) {
            this.subDepartmentList.map(a => {
              if (a.subDepartmentCode === res.subDepartmentCode) {
                a.subDepartmentName = res.subDepartmentName;
              }
            });
            this.subDepartmentOptionList = this.subDepartmentList.map(a => a.subDepartmentName);
            this.subDepartmentOptionList = this.subDepartmentOptionList.slice();
            this.alertService.success('Division Updated successfully.');
          }
        });
      }
    }
  }

  savesSubDepartmentItemToList(subDeparment) {
    try {
      // tslint:disable-next-line: triple-equals
      if (subDeparment && !this.subDepartmentList.filter(a => a.subDepartmentName == subDeparment.trim())[0]) {
        const subDeparmentObj: SubDepartment = new Object() as SubDepartment;
        subDeparmentObj.subDepartmentName = subDeparment.trim();
        // tslint:disable-next-line: triple-equals
        const department = this.departmentList.filter(a => a.departMentName == this.employeeInformationForm.controls.Department.value)[0];
        if (department) {
          subDeparmentObj.departmentCode = department.departmentCode;
          this.empService.addSubDepartment(subDeparmentObj).subscribe((data: SubDepartment) => {
            this.subDepartmentList.push(data);
            this.subDepartmentOptionList.push(data.subDepartmentName);
            this.subDepartmentOptionList = this.subDepartmentOptionList.slice();
            this.subDepartmentError = false;
            this.alertService.success('Sub department created successfully.');
          }, err => {
            this.alertService.error('Error has occured while saving Sub department.');
          });
        } else {
          this.alertService.warning('Please select department to add sub department.');
        }
      }
    } catch (error) {

    }
  }

  getDesignations(subDepartmentCode: string) {
    try {
      return new Observable((obs) => {
        this.empService.getDesingnations(subDepartmentCode).subscribe((data: Designation[]) => {
          this.designationList = data;
          // tslint:disable-next-line: triple-equals
          this.designationError = data && data.length == 0;
          this.designationOptionList = data.map(a => a.designattionName);
          obs.next();
        }, err => {
          this.designationError = true;
          this.designationList = [];
          this.designationOptionList = [];
        });
      });
    } catch (error) {

    }
  }

  designationValueChange(event) {

  }

  updateDesignation(event) {
    if (event && event.oldValue && event.newValue) {
      const matchedItem = this.designationList.filter(a => a.designattionName === event.oldValue)[0];
      if (matchedItem) {
        const designation = {
          Id: matchedItem.Id,
          designationCode: matchedItem.designationCode,
          designattionName: event.newValue,
          departmentCode: matchedItem.departmentCode,
          subDepartmentCode: matchedItem.subDepartmentCode,
          Employees: matchedItem.Employees
        };
        this.empService.updateDesignation(designation).subscribe((res: Designation) => {
          if (res) {
            this.designationList.map(a => {
              if (a.designationCode === res.designationCode) {
                a.designattionName = res.designattionName;
              }
            });
            this.designationOptionList = this.designationList.map(a => a.designattionName);
            this.designationOptionList = this.designationOptionList.slice();
            this.alertService.success('Designation Updated successfully.');
          }
        });
      }
    }
  }

  updateSkill(event) {
    if (event && event.oldValue && event.newValue) {
      const matchedItem = this.skillsList.filter(a => a.skillsName === event.oldValue)[0];
      if (matchedItem) {
        const skill = {
          Id: matchedItem.Id,
          skillsCode: matchedItem.skillsCode,
          skillsName: event.newValue,
          departmentCode: matchedItem.departmentCode
        };
        this.empService.updateSkill(skill).subscribe((res: Skills) => {
          if (res) {
            this.skillsList.map(a => {
              if (a.skillsCode === res.skillsCode) {
                a.skillsName = res.skillsName;
              }
            });
            this.skillsOptionsList = this.skillsList.map(a => a.skillsName);
            this.skillsOptionsList = this.skillsOptionsList.slice();
            this.alertService.success('Skill Updated successfully.');
          }
        });
      }
    }
  }

  saveDesignationItemToList(designation: string) {
    try {
      // tslint:disable-next-line: triple-equals
      if (designation && !this.designationList.filter(a => a.designattionName == designation)[0]) {
        // tslint:disable-next-line: triple-equals
        const subDepartment = this.subDepartmentList.filter(a => a.subDepartmentName ==
          this.employeeInformationForm.controls.SubDepartment.value)[0];
        if (subDepartment) {
          const designationObj: Designation = new Object() as Designation;
          designationObj.designattionName = designation;
          designationObj.subDepartmentCode = subDepartment.subDepartmentCode;
          this.empService.addDesignation(designationObj).subscribe((data: Designation) => {
            if (data) {
              this.designationList.push(data);
              this.designationOptionList.push(data.designattionName);
              this.designationOptionList = this.designationOptionList.slice();
              this.designationError = false;
              this.alertService.success('Designation saved successfully.');
            }
          }, err => {
            this.alertService.error('Error has occured while saving designation.');
          });
        } else {
          this.alertService.warning('Please select Sub Department first.');
        }
      }
    } catch (error) {

    }
  }

  startCameraPopup(): void {
    try {
      const dialogRef = this.dialog.open(CameraCaptureDialogComponent, {
        width: '400px',
        height: '400px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed -' + result);
        if (result) {
          const img = URL.createObjectURL(result);
          this.employeeImage = this.sanitizer.bypassSecurityTrustUrl(img);
          this.fileImageBlog = result;
        }

      });
    } catch (error) {

    }
  }

  getEmployeePaymentByEmployeeId(employeeId: string) {
    try {
      this.empService.getEmployeePaymentByEmployeeId(employeeId).subscribe((data: EmployeePayment) => {
        if (data) {
          this.selectedEmployeePamyentForEdit = data;
          this.setEmployeePayment(data);
        }
      }, err => {
        this.alertService.error('Error has occured while getting employee payment.');
      });
    } catch (error) {

    }
  }



  getEditItem(e) {
    try {
      if (this.isModifyOn) {
        this.employeeInformationForm.enable();
        this.employeeInformationForm.controls.TotalSalary.disable();
        this.employeeInformationForm.controls.LoginUserName.disable();
      }
      this.selectedEmployeeForEdit = e;
      this.setEmployee(e);
      this.getEmployeePaymentByEmployeeId(e.employeeId);
    } catch (error) {

    }
  }

  optionSelectedBiometric(event) {
    try {
      // tslint:disable-next-line: triple-equals
      const selectedEmployee = this.biometricIdList.filter(a => a.empBiometricId == event.option.value)[0];
      if (selectedEmployee) {
        this.biometricIdError = false;
        if (this.isModifyOn) {
          this.employeeInformationForm.enable();
          this.employeeInformationForm.controls.TotalSalary.disable();
          this.employeeInformationForm.controls.LoginUserName.disable();
        }
        this.selectedEmployeeForEdit = selectedEmployee;
        this.setEmployee(selectedEmployee);
        this.getEmployeePaymentByEmployeeId(selectedEmployee.employeeId);

      }
    } catch (error) {

    }
  }

  optionSelectedEmpoyeeName(event) {
    try {

      // tslint:disable-next-line: triple-equals
      const selectedEmployee = this.employeeNameList.filter(a => a.employeeName == event.option.value)[0];
      if (selectedEmployee) {
        if (this.isModifyOn) {
          this.employeeInformationForm.enable();
          this.employeeInformationForm.controls.TotalSalary.disable();
          this.employeeInformationForm.controls.LoginUserName.disable();
        }
        this.selectedEmployeeForEdit = selectedEmployee;
        this.setEmployee(selectedEmployee);
        this.getEmployeePaymentByEmployeeId(selectedEmployee.employeeId);

      }
    } catch (error) {

    }
  }

  setEmployeePayment(employeePayment: EmployeePayment) {
    try {
      this.employeeInformationForm.controls.PaymentTenure.setValue(employeePayment.employeePaymentCategory);
      this.employeeInformationForm.controls.Basic.setValue(employeePayment.employeeBasicSalary);
      this.employeeInformationForm.controls.HRA.setValue(employeePayment.employeeHRA);
      this.employeeInformationForm.controls.DearnessAllowance.setValue(employeePayment.employeeDA);
      this.employeeInformationForm.controls.ConveyanceAllowance.setValue(employeePayment.employeeCA);
      this.employeeInformationForm.controls.MedicalAllowance.setValue(employeePayment.employeeMA);
      this.employeeInformationForm.controls.Incentives.setValue(employeePayment.employeeIncentives);
      this.employeeInformationForm.controls.EducationAllowance.setValue(employeePayment.educationAllowance);
      this.employeeInformationForm.controls.OtherAllowances.setValue(employeePayment.employeeOA);
      this.employeeInformationForm.controls.TotalSalary.setValue(employeePayment.employeeGrossSalary);
      this.CalculateTotal();
    } catch (error) {

    }
  }

  setEmployee(employee: Employee) {
    try {

      this.employeeInformationForm.controls.CreationDate.setValue(employee.employeeCreationDate);
      this.employeeInformationForm.controls.LoginUserName.setValue(this.employeeName);
      this.employeeInformationForm.controls.Comployee.setValue(employee.orgOfficeNo);
      // tslint:disable-next-line: triple-equals
      const contract = this.contractList.filter(a => a.contractorCode == employee.contractorCode)[0];
      if (contract) {
        this.employeeInformationForm.controls.Contractor.setValue(contract.contractorName);

      }
      this.employeeInformationForm.controls.BioMetricId.setValue(employee.empBiometricId);
      this.employeeInformationForm.controls.EmployeeNmae.setValue(employee.employeeName);
      this.employeeInformationForm.controls.Gender.setValue(employee.employeeGender);
      this.employeeInformationForm.controls.EmployeeDivision.setValue(employee.employeeDivision);
      this.employeeInformationForm.controls.DOB.setValue(employee.employeeDOB);
      this.employeeInformationForm.controls.FatherSpouseName.setValue(employee.employeeFatherSpouseName);
      this.employeeInformationForm.controls.RelationShip.setValue(employee.employeeRelationship);
      this.employeeInformationForm.controls.ContactNumber.setValue(employee.employeeContactNo);
      this.employeeInformationForm.controls.AlternateContactNumber.setValue(employee.employeeAltContactNo);
      this.employeeInformationForm.controls.Email.setValue(employee.employeeMailId === 'NA' ? '' : employee.employeeMailId);
      this.employeeInformationForm.controls.MaritalStatus.setValue(employee.employeeMaritalStatus);
      this.employeeInformationForm.controls.NoOfDependends.setValue(employee.employeeNoOfDependents);
      this.employeeInformationForm.controls.PresentAddress.setValue(employee.employeePresentAddress);
      this.employeeInformationForm.controls.PermanantAddress.setValue(employee.employeePermanentAddress);
      this.employeeInformationForm.controls.BloodGroup.setValue(employee.employeeBloodGroup);
      // tslint:disable-next-line: triple-equals
      const department = this.departmentList.filter(a => a.departmentCode == employee.departmentCode)[0];
      if (department) {
        setTimeout(() => {
          this.employeeInformationForm.controls.Department.setValue(department.departMentName);
        }, 100);
        this.setSubDepartmentAndDesignation(employee);
      }
      // tslint:disable-next-line: triple-equals
      const skill = this.skillsList.filter(a => a.skillsCode == employee.skillsCode)[0];
      if (skill) {
        this.employeeInformationForm.controls.Skills.setValue(skill.skillsName);
      }
      this.employeeInformationForm.controls.EmpJoiningDate.setValue(employee.employeeDOJ);
      this.employeeInformationForm.controls.InHouseExperience.setValue(employee.employeeIHExp);
      this.employeeInformationForm.controls.TotalExperience.setValue(employee.employeeTOTExp);
      this.employeeInformationForm.controls.PfNumber.setValue(employee.employeePFNo);
      this.employeeInformationForm.controls.ESINumer.setValue(employee.employeeEsiNo);
      this.employeeInformationForm.controls.AadharNumber.setValue(employee.employeeAadharNo);
      this.employeeInformationForm.controls.PassportNumber.setValue(employee.employeePassportNo);
      this.employeeInformationForm.controls.PanNumber.setValue(employee.employeePan);
      this.employeeInformationForm.controls.PermanantDesc.setValue(employee.employeeStatusAsOn);
      this.getDocumentsByEmployeeId(employee.employeeId, employee.employeeName);
      // this.loadImageOfEmployee(employee.Employee_ID);

    } catch (error) {

    }
  }
  setSubDepartmentAndDesignation(employee: Employee) {
    try {
      this.getSubDepartments(employee.departmentCode).subscribe(() => {
        // tslint:disable-next-line: triple-equals
        const subDepartment = this.subDepartmentList.filter(a => a.subDepartmentCode == employee.subDepartmentCode)[0];
        if (subDepartment) {
          this.employeeInformationForm.controls.SubDepartment.setValue(subDepartment.subDepartmentName);
          this.getDesignations(subDepartment.subDepartmentCode).subscribe(() => {
            // tslint:disable-next-line: triple-equals
            const designation = this.designationList.filter(a => a.designationCode == employee.designationCode)[0];
            if (designation) {
              this.employeeInformationForm.controls.Designation.setValue(designation.designattionName);
            }
          });
        }
      });

    } catch (error) {

    }
  }

  changeEmployeeUnder() {
    try {
      if ((this.isFindOn || this.isModifyOn) && !this.selectedEmployeeForEdit) {
        setTimeout(() => {
          this.departmentSearchField.focus();
        }, 100);
      }
    } catch (error) {

    }
  }

  optionSelectedDepartmentSearch(e) {
    try {
      const deptCode = this.departmentList.filter(a => a.departMentName ===
        this.employeeInformationForm.controls.DepartmentSearch.value)[0];
      if (deptCode) {
        const empUnder = this.employeeInformationForm.controls.Comployee.value;
        this.empService.getEmployeesByDeptCode(empUnder, deptCode.departmentCode).subscribe((data: Employee[]) => {
          if (data) {

            this.employeeList = data;
          }
        });
      }
    } catch (error) {

    }
  }

  getEmployee(): Employee {
    try {
      if (this.employeeInformationForm.valid && !this.biometricIdError) {
        // tslint:disable-next-line: no-shadowed-variable
        const employeeDetails: Employee = new Object() as Employee;
        employeeDetails.employeeCreationDate = new Date(this.employeeInformationForm.controls.CreationDate.value).toLocaleString();
        employeeDetails.empCreatedId = this.employeeId;
        employeeDetails.orgOfficeNo = this.employeeInformationForm.controls.Comployee.value;
        // tslint:disable-next-line: triple-equals
        const contract = this.contractList.filter(a => a.contractorName == this.employeeInformationForm.controls.Contractor.value)[0];
        if (contract) {
          employeeDetails.contractorCode = contract.contractorCode;
        }

        employeeDetails.empBiometricId = this.employeeInformationForm.controls.BioMetricId.value;
        employeeDetails.employeeName = this.employeeInformationForm.controls.EmployeeNmae.value;
        employeeDetails.employeeGender = this.employeeInformationForm.controls.Gender.value;
        employeeDetails.employeeDivision = this.employeeInformationForm.controls.EmployeeDivision.value;
        employeeDetails.employeeDOB = new Date(this.employeeInformationForm.controls.DOB.value).toLocaleString();
        employeeDetails.employeeFatherSpouseName = this.employeeInformationForm.controls.FatherSpouseName.value;
        employeeDetails.employeeRelationship = this.employeeInformationForm.controls.RelationShip.value;
        employeeDetails.employeeContactNo = this.employeeInformationForm.controls.ContactNumber.value;
        employeeDetails.employeeAltContactNo = this.employeeInformationForm.controls.AlternateContactNumber.value;
        employeeDetails.employeeMailId = this.employeeInformationForm.controls.Email.value;
        employeeDetails.employeeMaritalStatus = this.employeeInformationForm.controls.MaritalStatus.value;
        employeeDetails.employeeNoOfDependents = this.employeeInformationForm.controls.NoOfDependends.value;
        employeeDetails.employeePresentAddress = this.employeeInformationForm.controls.PresentAddress.value;
        employeeDetails.employeePermanentAddress = this.employeeInformationForm.controls.PermanantAddress.value;
        employeeDetails.employeeBloodGroup = this.employeeInformationForm.controls.BloodGroup.value;
        // tslint:disable-next-line: triple-equals
        const department = this.departmentList.filter(a => a.departMentName == this.employeeInformationForm.controls.Department.value)[0];
        if (department) {
          employeeDetails.departmentCode = department.departmentCode;
        }
        // tslint:disable-next-line: triple-equals
        const subDepartment = this.subDepartmentList.filter(a => a.subDepartmentName ==
          this.employeeInformationForm.controls.SubDepartment.value)[0];
        if (subDepartment) {
          employeeDetails.subDepartmentCode = subDepartment.subDepartmentCode;
        }
        // tslint:disable-next-line: triple-equals
        const designation = this.designationList.filter(a => a.designattionName ==
          this.employeeInformationForm.controls.Designation.value)[0];
        if (designation) {
          employeeDetails.designationCode = designation.designationCode;
        }
        // tslint:disable-next-line: triple-equals
        const skill = this.skillsList.filter(a => a.skillsName == this.employeeInformationForm.controls.Skills.value)[0];
        if (skill) {
          employeeDetails.skillsCode = skill.skillsCode;
        }
        employeeDetails.employeeDOJ = new Date(this.employeeInformationForm.controls.EmpJoiningDate.value).toLocaleString();
        employeeDetails.employeeIHExp = this.employeeInformationForm.controls.InHouseExperience.value;
        employeeDetails.employeeTOTExp = +this.employeeInformationForm.controls.TotalExperience.value;
        employeeDetails.employeePFNo = this.employeeInformationForm.controls.PfNumber.value;
        employeeDetails.employeeEsiNo = this.employeeInformationForm.controls.ESINumer.value;
        employeeDetails.employeeAadharNo = this.employeeInformationForm.controls.AadharNumber.value;
        employeeDetails.employeePassportNo = this.employeeInformationForm.controls.PassportNumber.value;
        employeeDetails.employeePan = this.employeeInformationForm.controls.PanNumber.value;
        employeeDetails.employeeStatusAsOn = this.employeeInformationForm.controls.PermanantDesc.value;

        return employeeDetails;

      } else {
        this.markFieldAsTouched(this.employeeInformationForm);
        return null;
      }
    } catch (error) {

    }
  }

  getEmployeePayment(employee: Employee): EmployeePayment {
    try {
      const employeePayment: EmployeePayment = new EmployeePayment();
      employeePayment.employeePaymentCategory = this.employeeInformationForm.controls.PaymentTenure.value;
      employeePayment.employeeBasicSalary = +this.employeeInformationForm.controls.Basic.value;
      employeePayment.employeeHRA = +this.employeeInformationForm.controls.HRA.value;
      employeePayment.employeeDA = +this.employeeInformationForm.controls.DearnessAllowance.value;
      employeePayment.employeeCA = +this.employeeInformationForm.controls.ConveyanceAllowance.value;
      employeePayment.employeeMA = +this.employeeInformationForm.controls.MedicalAllowance.value;
      employeePayment.employeeIncentives = +this.employeeInformationForm.controls.Incentives.value;
      employeePayment.educationAllowance = +this.employeeInformationForm.controls.EducationAllowance.value;
      employeePayment.employeeOA = +this.employeeInformationForm.controls.OtherAllowances.value;
      employeePayment.employeeGrossSalary = +this.employeeInformationForm.controls.TotalSalary.value;
      return employeePayment;
    } catch (error) {

    }
  }

  saveEmployee() {
    try {
      if (this.selectedEmployeeForEdit) {
        this.modifyEmployee();
        return;
      }
      if ((this.isFindOn || this.isModifyOn)) {
        return;
      }
      const employee: Employee = this.getEmployee();
      if (!employee) {
        return;
      }
      const employeePayment = this.getEmployeePayment(employee);
      this.disableButton = true;
      this.empService.addEmployee(employee).subscribe((data: Employee) => {
        this.disableButton = false;
        this.alertService.success('Employee created successfully.');

        if (data.employeeId) {
          employeePayment.employeeId = data.employeeId;
          this.disableButton = true;
          forkJoin(this.createEmployeePayment(employeePayment),
            this.uploadEmployeeDocument(data.employeeId, data.employeeName)).subscribe(() => {
              this.printEmployeePdf(employee, employeePayment);
              this.disableButton = false;
              this.clearEmployeeDetails();

            });

        }
      }, err => {
        this.disableButton = false;
        this.alertService.error('Error has occured while creating an employee.');
      });
    } catch (error) {

    }
  }


  printEmployeePdf(data: Employee, employeePayment: EmployeePayment) {

    const listOne = [];

    const permanentAddress = data.employeePermanentAddress ? data.employeePermanentAddress : 'No Data';
    const presentAddress = data.employeePresentAddress ? data.employeePresentAddress : 'No Data';

    // tslint:disable-next-line:no-string-literal
    listOne['NAME'] = data.employeeName;
    // tslint:disable-next-line:no-string-literal
    listOne['BioMetricId'] = data.empBiometricId;

    // tslint:disable-next-line: triple-equals
    listOne['Employee Under'] = this.officeLocationList.filter(a => a.orgOfficeNo == data.orgOfficeNo)[0].orgOfficeName;
    // tslint:disable-next-line:quotemark
    // tslint:disable-next-line:no-string-literal
    listOne['Gender'] = data.employeeGender;
    listOne['Father/Spouse'] = data.employeeFatherSpouseName;

    const listTwo = [];
    // tslint:disable-next-line:quotemark
    // tslint:disable-next-line:no-string-literal
    listTwo['RELATIONSHIP'] = data.employeeRelationship;
    if (this.contractList.filter(a => a.contractorCode === data.contractorCode)[0]) {
      // tslint:disable-next-line:no-string-literal
      listTwo['Contractor'] = this.contractList.filter(a => a.contractorCode === data.contractorCode)[0].contractorName;
    }

    listTwo['Alternate No'] = data.employeeAltContactNo;
    listTwo['Marital Status'] = data.employeeMaritalStatus;
    listTwo['Blood Group'] = data.employeeBloodGroup;
    // tslint:disable-next-line: triple-equals
    listTwo['Sub-Department'] = this.subDepartmentList.filter(a => a.subDepartmentCode == data.subDepartmentCode)[0].subDepartmentName;
    // tslint:disable-next-line:no-string-literal
    listTwo['Skills'] = this.skillsList.filter(a => a.skillsCode === data.skillsCode)[0].skillsName;
    listTwo['Joining Date'] = data.employeeDOJ;
    listTwo['Total Experience'] = data.employeeTOTExp;
    listTwo['ESI Number'] = data.employeeEsiNo;
    listTwo['Passport No'] = data.employeePassportNo;
    listTwo['Permanent or'] = data.employeePermanentAddress;

    const listThree = [];
    // tslint:disable-next-line:no-string-literal
    listThree['DOB'] = data.employeeDOB;
    listThree['Contact No'] = data.employeeContactNo;
    listThree['Email-Id'] = data.employeeMailId;
    listThree['No. of Dependents'] = data.employeeNoOfDependents;
    // tslint:disable-next-line:no-string-literal
    listThree['Department'] = this.departmentList.filter(a => a.departmentCode === data.departmentCode)[0].departMentName;
    // tslint:disable-next-line:no-string-literal
    listThree['Designation'] = this.designationList.filter(a => a.designationCode === data.designationCode)[0].designattionName;
    // tslint:disable-next-line:no-string-literal
    listThree['Division'] = data.employeeDivision;
    listThree['In House Exp.as on Date'] = data.employeeIHExp;
    listThree['PF Number(UIN)'] = data.employeePFNo;
    listThree['Aadhar No'] = data.employeeAadharNo;
    listThree['Permanent Account No'] = data.employeePan;
    // tslint:disable-next-line:no-string-literal
    // listThree['Designation'] = 'Manager';

    const SalaryDetails = [];
    // tslint:disable-next-line:no-string-literal
    SalaryDetails['NAME'] = data.employeeName;
    // tslint:disable-next-line:no-string-literal
    SalaryDetails['BioMetricId'] = data.empBiometricId;
    // tslint:disable-next-line:no-string-literal
    SalaryDetails['Department'] = this.departmentList.filter(a => a.departmentCode === data.departmentCode)[0].departMentName;
    // tslint:disable-next-line:no-string-literal
    SalaryDetails['Designation'] = this.designationList.filter(a => a.designationCode === data.designationCode)[0].designattionName;
    SalaryDetails['Monthly / Daily'] = employeePayment.employeePaymentCategory;
    SalaryDetails['Basic Salary'] = employeePayment.employeeBasicSalary;
    SalaryDetails['House Rental Allowance (HRA)'] = employeePayment.employeeHRA;
    SalaryDetails['Dearness Allowance (DA)'] = employeePayment.employeeDA;
    SalaryDetails['Conveyance Allowance (CA)'] = employeePayment.employeeCA;
    SalaryDetails['Medical Allowance (MA)'] = employeePayment.employeeMA;
    // tslint:disable-next-line:no-string-literal
    SalaryDetails['Incentives'] = employeePayment.employeeIncentives;
    // tslint:disable-next-line: no-string-literal
    SalaryDetails['EducationAllowance'] = employeePayment.educationAllowance; // @hitesh to be reviewed
    SalaryDetails['Other Allowances (OA)'] = employeePayment.employeeOA;
    SalaryDetails['Total Salary'] = employeePayment.employeeGrossSalary;


    let count = 27;
    const employeeImage = this.documentList.filter(a => a.employeeDocName === (data.employeeId + '-'
      + data.employeeName.replace(' ', '') + '.png'))[0];
    const doc = new jsPDF();
    const imgData = 'data:image/png;base64,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';
    doc.addImage(imgData, 'JPEG', 150, 21, 40, 35.3);
    doc.setFontSize(14);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text('Employee Information', 75, 15);
    doc.setFontSize(12);

    Object.entries(listOne).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(15, count, key.trim().toUpperCase());
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      doc.text(60, count, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(73, count, value.toString().trim().toUpperCase());
      count = count + 7;
    });
    count = count + 1;
    let countRef = count;
    Object.entries(listTwo).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(15, count, key.trim().toUpperCase());
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(15, count + 5, value.toString().trim().toUpperCase());
      count = count + 12;
    });

    Object.entries(listThree).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(100, countRef, key.trim().toUpperCase());
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(100, countRef + 5, value.toString().trim().toUpperCase());
      countRef = countRef + 12;
    });

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setTextColor(195, 195, 195);
    doc.text(15, count, 'Permanent Address'.trim().toUpperCase());
    doc.setFont('normal');
    doc.setFontType('normal');
    doc.setTextColor(0, 0, 0);
    doc.text(15, count + 5, permanentAddress.trim().toUpperCase());

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setTextColor(195, 195, 195);
    doc.text(100, count, 'Present Address'.trim().toUpperCase());
    doc.setFont('normal');
    doc.setFontType('normal');
    doc.setTextColor(0, 0, 0);
    doc.text(100, count + 5, presentAddress.trim().toUpperCase());
    doc.addPage();
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(14);
    doc.text('Salary Details', 85, 15);
    doc.setFontSize(12);
    count = 27;
    Object.entries(SalaryDetails).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(15, count, key.trim().toUpperCase());
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      doc.text(100.2, count + 0.2, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      // @hitesh check if its right or not
      if (value) {
        doc.text(113, count, value.toString().trim().toUpperCase());
      }
      count = count + 7;
    });
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
        const docGivenName = this.employeeInformationForm.controls.NameOfDocument.value;
        const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
        if (!docGivenName) {
          this.employeeInformationForm.controls.NameOfDocument.setValue(name);
        }
        const employeeDocument: EmployeeDocument = {
          employeeDocName: name,
          employeeDocDetails: file,
          employeeId: null
        };
        this.documentList.push(employeeDocument);


        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more documents?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.documentName.nativeElement.focus();
            this.employeeInformationForm.controls.NameOfDocument.setValue('');
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

  downloadFile(employeeDocument: EmployeeDocument) {
    try {

      if (!employeeDocument.docId) {
        const blob = new Blob([employeeDocument.employeeDocDetails], { type: employeeDocument.employeeDocDetails.type });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const downloadURL = URL.createObjectURL(blob);
        window.open(downloadURL);

      } else {
        this.empService.getDocumentByDocumentId(employeeDocument.docId).subscribe((data: Blob) => {

          const blob = new Blob([data], {
            type: employeeDocument.employeeDocName.toLowerCase().indexOf('.pdf') !== -1 ?
              'application/pdf' : 'image/' + employeeDocument.employeeDocName.split('.')[1]
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

  uploadEmployeeDocument(employeeId: string, employeeName: string) {
    try {
      return new Observable((obs) => {
        this.saveEmployeeImage(employeeId, employeeName);

        if (this.documentList && this.documentList.length > 0) {
          const fileUploadObs: Observable<any>[] = [];
          this.documentList.forEach(employeeDocument => {
            if (!employeeDocument.docId) {
              employeeDocument.employeeId = employeeId;
              fileUploadObs.push(this.empService.saveEmployeeImage(employeeDocument));
            }
          });
          // this.disableButton = true;
          if (fileUploadObs && fileUploadObs.length > 0) {
            concat(...fileUploadObs).subscribe(res => {
              this.disableButton = false;
              obs.next();
              obs.complete();
            }, err => {
              obs.error();
            });
          } else {
            obs.next();
            obs.complete();
          }
        } else {
          obs.next();
          obs.complete();
        }
      });
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

  saveEmployeeImage(employeeId: string, employeeName: string) {
    try {

      if (this.fileImageBlog) {
        // let file : File = this.fileImageBlog;
        // file
        const employeeDocument: EmployeeDocument = {
          employeeDocName: employeeId + '-' + employeeName.replace(' ', '') + '.png',
          employeeDocDetails: this.fileImageBlog,
          // tslint:disable-next-line: object-literal-shorthand
          employeeId: employeeId
        };
        // tslint:disable-next-line: triple-equals
        if (!this.documentList.filter(a => a.employeeDocName == employeeDocument.employeeDocName)[0]) {
          this.documentList.push(employeeDocument);
        }
      }
    } catch (error) {

    }
  }

  modifyClick() {
    try {
      this.findEmployee();
      this.enableSave = true;
      this.isModifyOn = true;
    } catch (error) {

    }
  }

  modifyEmployee() {
    try {
      if (!this.selectedEmployeeForEdit) {
        return;
      }

      const employee = this.getEmployee();
      employee.employeeId = this.selectedEmployeeForEdit.employeeId;

      const employeePamyent = this.getEmployeePayment(employee);
      employeePamyent.employeeId = this.selectedEmployeeForEdit.employeeId;
      this.disableButton = true;
      this.empService.updateEmployee(employee).subscribe((data: Employee) => {
        this.disableButton = false;
        if (data) {

          employeePamyent.ID = this.selectedEmployeePamyentForEdit ? this.selectedEmployeePamyentForEdit.ID : 0;
          this.disableButton = true;
          const emppaymentCall = this.selectedEmployeePamyentForEdit ? this.empService.updateEmployeePayment(employeePamyent)
            : this.empService.createEmployeePayment(employeePamyent);
          forkJoin(emppaymentCall,
            // tslint:disable-next-line: no-shadowed-variable
            this.uploadEmployeeDocument(employee.employeeId, employee.employeeName)).subscribe((data) => {
              this.disableButton = false;
              if (data) {
                this.clearEmployeeDetails();
                this.alertService.success('Employee modified successfully.');
              }
            }, err => {
              this.disableButton = false;
            });
        }
      }, err => {
        this.disableButton = false;
        this.alertService.error('Error has occured while updating the employee.');
      });
    } catch (error) {

    }
  }

  findEmployee() {
    this.isFindOn = true;
    this.employeeInformationForm.controls.BioMetricId.enable();
    this.employeeInformationForm.controls.EmployeeNmae.enable();
    this.employeeInformationForm.controls.DepartmentSearch.enable();
    this.employeeInformationForm.controls.Comployee.enable();
    this.biometric.nativeElement.focus();
    this.enableNew = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;
  }

  loadImageOfEmployee(documentId: number) {
    try {
      this.disableButton = true;
      this.empService.getDocumentByDocumentId(documentId).subscribe((data: Blob) => {
        this.disableButton = false;
        const img = URL.createObjectURL(data);
        this.employeeImage = this.sanitizer.bypassSecurityTrustUrl(img);
      }, error => {
        this.disableButton = false;
      });
    } catch (error) {

    }
  }

  getDocumentsByEmployeeId(employeeId: string, employeeName: string) {
    try {

      this.disableButton = true;
      this.empService.getDocumentsByEmployeeId(employeeId).subscribe((data: EmployeeDocument[]) => {
        this.disableButton = false;
        if (data) {
          this.documentList = data;
          // tslint:disable-next-line: triple-equals
          const employeeImage = this.documentList.filter(a => a.employeeDocName ==
            employeeId + '-' + employeeName.replace(' ', '') + '.png')[0];
          if (employeeImage) {
            this.loadImageOfEmployee(employeeImage.docId);
          }
        }
      }, err => {
        this.disableButton = false;
      });
    } catch (error) {

    }
  }

  clearEmployeeDetails() {
    try {


      this.employeeImage = null;
      this.biometricIdError = false;
      this.selectedEmployeeForEdit = null;
      this.selectedEmployeePamyentForEdit = null;

      this.subDepartmentList = [];
      this.subDepartmentOptionList = [];

      this.designationList = [];
      this.designationOptionList = [];

      this.biometricIdList = [];
      this.biometricIdListOptions = [];

      this.employeeNameList = [];
      this.employeeOptionsList = [];
      this.isFindOn = false;
      this.isModifyOn = false;
      this.documentList = [];

      this.employeeInformationForm.reset();
      this.employeeInformationForm.disable();
      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;
      this.employeeList = [];
      this.employeeInformationForm.controls.LoginUserName.setValue(this.employeeName);

    } catch (error) {

    }
  }

  CalculateTotal() {
    try {


      const Basic: number = this.employeeInformationForm.controls.Basic.value;
      const ConveyanceAllowance: number = this.employeeInformationForm.controls.ConveyanceAllowance.value;
      const DearnessAllowance: number = this.employeeInformationForm.controls.DearnessAllowance.value;
      const HRA = this.employeeInformationForm.controls.HRA.value;
      const Incentives = this.employeeInformationForm.controls.Incentives.value;
      const EducationAllowance = this.employeeInformationForm.controls.EducationAllowance.value;
      const MedicalAllowance = this.employeeInformationForm.controls.MedicalAllowance.value;
      const OtherAllowances = this.employeeInformationForm.controls.OtherAllowances.value;

      const total = +Basic + +ConveyanceAllowance +
        +DearnessAllowance + +HRA + +Incentives
        + +MedicalAllowance
        + +EducationAllowance
        + +OtherAllowances;
      this.employeeInformationForm.controls.TotalSalary.setValue(total);
    } catch (error) {

    }
  }

  handleError(error) {
    // console.log('Error: ', error);
  }

  // tslint:disable-next-line: adjacent-overload-signatures


  addNewEmployee() {
    try {
      this.clearEmployeeDetails();
      this.employeeInformationForm.enable();
      this.employeeInformationForm.controls.TotalSalary.disable();
      this.employeeInformationForm.controls.LoginUserName.disable();
      this.employeeInformationForm.controls.CreationDate.setValue(new Date());
      setTimeout(() => {
        this.dateOfCreation.nativeElement.focus();
      }, 100);
      this.enableNew = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
    } catch (error) {

    }
  }

}
