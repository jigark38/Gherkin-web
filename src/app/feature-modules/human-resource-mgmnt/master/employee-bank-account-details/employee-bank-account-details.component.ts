import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BankDetailsService } from './employee-bank-account-details.service';
import {
  Organisation,
  Department,
  SubDepartment,
  Designation,
  Employee,
  Bank,
  BankDetail,
  EmployeeBankAccountDetail,
  BankDetailGrid,
} from './employee-bank-account-details.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { DatePipe } from '@angular/common';

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
  selector: 'app-employee-bank-account-details',
  templateUrl: './employee-bank-account-details.component.html',
  styleUrls: ['./employee-bank-account-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
})
export class EmployeeBankAccountDetailsComponent implements OnInit {
  @ViewChild('entryDate', { static: false }) entryDate: ElementRef;

  bankDetailsForm: FormGroup;

  organisationDetails: Array<Organisation>;
  preferredAccount: Array<string>;
  modeOfAccount: Array<string>;
  departments: Array<Department>;
  subDepartments: Array<SubDepartment>;
  designations: Array<Designation>;
  employees: Array<Employee>;
  banks: Array<Bank>;
  bankDetails: Array<BankDetail>;
  employeeBankDetails: Array<EmployeeBankAccountDetail>;
  bankDetailsGrid: Array<BankDetailGrid>;

  employeeId: string;
  employeeName: string;
  selectedOrgAccount: boolean;
  employeeBankAccountDetails: EmployeeBankAccountDetail;
  saveDisabled: boolean;
  addEmployeeDisabled: boolean;
  findDisabled: boolean;
  modifyDisabled: boolean;

  constructor(
    private readonly bankDetailsService: BankDetailsService,
    private readonly formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {
    this.modeOfAccount = [
      'Organisation Salary Account',
      'Employee Personal Account',
    ];
    this.preferredAccount = ['Yes', 'No'];
    this.selectedOrgAccount = false;
    this.bankDetails = new Array(0);
    this.employeeBankAccountDetails = new EmployeeBankAccountDetail();
    this.saveDisabled = true;
    this.addEmployeeDisabled = false;
    this.findDisabled = false;
    this.modifyDisabled = false;
    this.bankDetailsGrid = new Array(0);
  }

  ngOnInit() {
    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;
    this.employeeBankAccountDetails.enteredEmployeeId = this.employeeId;

    this.bankDetailsService.getOrgofficelocationDetails().subscribe(
      (result) => {
        this.organisationDetails = result;
      },
      (error) => {
        this.alertService.error('Error while getting Organisation details!');
      }
    );

    this.bankDetailsService.getAllDepartments().subscribe(
      (result) => {
        this.departments = result;
      },
      (error) => {
        this.alertService.error('Error while getting all Departments!');
      }
    );

    this.bankDetailsService.getBankAccountDetails().subscribe(
      (result) => {
        this.banks = result;
      },
      (error) => {
        this.alertService.error('Error while getting Bank Account details!');
      }
    );
    this.buildInputForm();
  }

  buildInputForm() {
    this.bankDetailsForm = this.formBuilder.group({
      orgNameControl: [{ value: '', disabled: true }, [Validators.required]],
      usernameControl: [
        { value: this.employeeName, disabled: true },
        [Validators.required],
      ],
      entryDateControl: [{ value: '', disabled: true }, [Validators.required]],
      accountModeControl: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      departmentControl: [{ value: '', disabled: true }, [Validators.required]],
      subDepartmentControl: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      designationControl: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      employeeControl: [{ value: '', disabled: true }, [Validators.required]],
      bankDetailControl: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(75)],
      ],
      branchControl: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(50)],
      ],
      branchIfscControl: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(15)],
      ],
      preferredAccountControl: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      accountNumberControl: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(30)],
      ],
      effectiveDateControl: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      nomineeControl: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(50)],
      ],
      nomineeRelationshipControl: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(30)],
      ],
    });
    this.valueChangesListener();
  }

  valueChangesListener(): void {
    this.bankDetailsForm.controls.entryDateControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.entryDate = new Date(value);
      }
    );

    this.bankDetailsForm.controls.orgNameControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.orgOfficeNo = value;
      }
    );

    this.bankDetailsForm.controls.accountModeControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.resetFormFields('accountmode');
          this.employeeBankAccountDetails.modeOfAccount = value;
          if (value === 'Organisation Salary Account') {
            this.bankDetails = new Array(0);
            this.selectedOrgAccount = true;
            this.banks.map((bank) => {
              const bankDetail = new BankDetail();
              bankDetail.bankCode = bank.bankCode;
              bankDetail.bankNameAccountNumber =
                bank.bankName + ' / ' + bank.bankAccountNumber;
              this.bankDetails.push(bankDetail);
            });
          } else {
            this.selectedOrgAccount = false;
          }
        }
      }
    );

    this.bankDetailsForm.controls.bankDetailControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          let bankNameAccount: string;
          const bankDetail = this.bankDetails.find(
            (code) => code.bankCode === value
          );
          if (bankDetail) {
            bankNameAccount = bankDetail.bankNameAccountNumber;
          }
          if (bankNameAccount && bankNameAccount.includes('/')) {
            const bankName = bankNameAccount.split('/')[0];
            this.employeeBankAccountDetails.bankName = bankName;
          }

          if (this.selectedOrgAccount) {
            this.bankDetailsForm.controls.branchControl.disable();
            this.bankDetailsForm.controls.branchIfscControl.disable();
            const bank = this.banks.find((data) => data.bankCode === value);
            this.bankDetailsForm.controls.branchControl.setValue(
              bank.bankBranch
            );
            this.bankDetailsForm.controls.branchIfscControl.setValue(
              bank.bankIFSC
            );
          } else {
            this.bankDetailsForm.controls.branchControl.enable();
            this.bankDetailsForm.controls.branchIfscControl.enable();
            this.employeeBankAccountDetails.bankName = value;
          }
        }
      }
    );

    this.bankDetailsForm.controls.branchControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.bankBranch = value;
      }
    );

    this.bankDetailsForm.controls.branchIfscControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.bankIfsc = value;
      }
    );

    this.bankDetailsForm.controls.departmentControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.resetFormFields('department');
          console.log(value);
          this.bankDetailsService.getSubDepartment(value).subscribe(
            (result) => {
              this.subDepartments = result;
              console.log(result);
            },
            (error) => {
              this.alertService.error(
                'Error while getting Sub Department details!'
              );
            }
          );
        }
      }
    );

    this.bankDetailsForm.controls.subDepartmentControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.resetFormFields('subdepartment');
          this.bankDetailsService.getDesgBySubDeprt(value).subscribe(
            (result) => {
              this.designations = result;
            },
            (error) => {
              this.alertService.error(
                'Error while getting Designation details!'
              );
            }
          );
        }
      }
    );

    this.bankDetailsForm.controls.designationControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.resetFormFields('designation');
          this.bankDetailsService.getEmployeByDesg(value).subscribe(
            (result) => {
              this.employees = result;
            },
            (error) => {
              this.alertService.error('Error while getting Employee details!');
            }
          );
        }
      }
    );

    this.bankDetailsForm.controls.employeeControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankDetails = new Array(0);
        this.bankDetailsGrid = new Array(0);
        if (value) {
          this.getEmployeeBankAccountDetails(value);
          this.employeeBankAccountDetails.empId = value;
        }
      }
    );

    this.bankDetailsForm.controls.accountNumberControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.bankAccountNumber = value;
      }
    );

    this.bankDetailsForm.controls.effectiveDateControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.accountEffectiveDateFrom = new Date(
          value
        );
      }
    );

    this.bankDetailsForm.controls.nomineeControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.nomineeName = value;
      }
    );

    this.bankDetailsForm.controls.nomineeRelationshipControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.nomineeRelationship = value;
      }
    );

    this.bankDetailsForm.controls.preferredAccountControl.valueChanges.subscribe(
      (value) => {
        this.employeeBankAccountDetails.preferredAccount = value;
      }
    );
  }

  enableFormControls() {
    this.bankDetailsForm.enable();
    this.bankDetailsForm.controls.usernameControl.disable();
  }

  getEmployeeBankAccountDetails(empId: string): void {
    this.employeeBankDetails = new Array(0);
    this.bankDetailsGrid = new Array(0);
    this.bankDetailsService
      .getBankDetailsByEmployee(empId)
      .subscribe((result) => {
        this.employeeBankDetails = result;
        if (this.employeeBankDetails) {
          this.employeeBankDetails.map((bank) => {
            const bankDetailGrid = new BankDetailGrid();
            bankDetailGrid.bankName = bank.bankName;
            bankDetailGrid.bankBranchIfsc =
              bank.bankBranch + ' / ' + bank.bankIfsc;
            bankDetailGrid.preferredAccount = bank.preferredAccount;
            bankDetailGrid.accountEffectiveDateFrom = this.datePipe.transform(
              bank.accountEffectiveDateFrom,
              'dd-MMM-yyyy'
            );
            // );
            bankDetailGrid.bankAccountNumber = bank.bankAccountNumber;
            this.bankDetailsGrid.push(bankDetailGrid);
          });
        }
      });
  }

  resetFormFields(selectedField: string): void {
    switch (selectedField) {
      case 'accountmode':
        this.bankDetailsForm.controls.branchControl.enable();
        this.bankDetailsForm.controls.branchIfscControl.enable();
        this.bankDetailsForm.controls.accountNumberControl.enable();
        this.bankDetailsForm.controls.bankDetailControl.setValue('');
        this.bankDetailsForm.controls.branchControl.setValue('');
        this.bankDetailsForm.controls.branchIfscControl.setValue('');
        this.bankDetailsForm.controls.accountNumberControl.setValue('');
        break;
      case 'department':
        this.bankDetailsForm.controls.subDepartmentControl.setValue('');
        this.bankDetailsForm.controls.designationControl.setValue('');
        this.bankDetailsForm.controls.employeeControl.setValue('');
        break;
      case 'subdepartment':
        this.bankDetailsForm.controls.designationControl.setValue('');
        this.bankDetailsForm.controls.employeeControl.setValue('');
        break;
      case 'designation':
        this.bankDetailsForm.controls.employeeControl.setValue('');
        break;
    }
  }

  addEmployeeAccount() {
    this.enableFormControls();
    this.addEmployeeDisabled = true;
    this.saveDisabled = false;
    this.findDisabled = true;
    this.modifyDisabled = true;
    this.bankDetailsForm.controls.entryDateControl.setValue(new Date());
    setTimeout(() => {
      this.entryDate.nativeElement.focus();
    }, 100);
  }

  saveBankDetails(): void {
    this.bankDetailsService
      .addBankDetails(this.employeeBankAccountDetails)
      .subscribe(
        (result) => {
          this.alertService.success(
            'Employee Bank Account Created Successfully.'
          );
          this.getEmployeeBankAccountDetails(
            this.employeeBankAccountDetails.empId
          );
        },
        (error) => {
          this.alertService.error('Error saving Bank Account Details!');
        }
      );
  }

  clear(): void {
    this.bankDetailsForm.reset();
    this.bankDetailsForm.disable();
    this.addEmployeeDisabled = false;
    this.bankDetailsGrid = new Array(0);
    this.employeeBankDetails = new Array(0);
    this.saveDisabled = true;
    this.findDisabled = false;
    this.modifyDisabled = false;
    this.bankDetailsForm.controls.usernameControl.setValue(this.employeeName);
  }
}
