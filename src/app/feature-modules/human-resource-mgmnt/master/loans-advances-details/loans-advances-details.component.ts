import { AlertService } from './../../../../corecomponents/alert/alert.service';
import { OrganisationModel } from './../../../organisation-details/org-details/orgnisation-model';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';
import { LoansAdvancesDetailsService } from './loans-advances-details.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Employee } from '../employee-details/employee-details.model';


@Component({
  selector: 'app-loans-advances-details',
  templateUrl: './loans-advances-details.component.html',
  styleUrls: ['./loans-advances-details.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: GHERKIN_DATE_FORMATS },
  ],
})
export class LoansAdvancesDetailsComponent implements OnInit, OnDestroy {
  loanDetailsForm: FormGroup;
  organisationDetails: OrganisationModel[];
  employee: any;
  departmentDetails: any;
  devisionDetails: any;
  designationDetails: any;
  employeeDetails: any;
  allEmployeeDetails: any;
  mode: string;
  loanDetails: any;
  subscriptions: Subscription[] = [];

  items: string[] = [
    'Short Term Loan',
    'Long Term Loan',
  ];
  saveMode: string;

  constructor(private formBuilder: FormBuilder, private service: LoansAdvancesDetailsService,
    // tslint:disable-next-line:align
    private authService: AuthenticationService, private el: ElementRef, private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();
    this.employee = this.authService.getUserdetails();
    this.getOrganizationDetails();
    this.getAllEmployeesBySpecficDesignation();
    this.mode = '';
    this.onChanges();
  }

  getAllEmployeesBySpecficDesignation() {
    this.service.GetEmployeeByDesignationsManager().subscribe((data: any) => {
      this.allEmployeeDetails = data;
    });
  }

  createForm() {
    this.loanDetailsForm = this.formBuilder.group({
      loanAdvNo: new FormControl({ value: '', disabled: true }, [Validators.required]),
      loginEmployeeID: new FormControl({ value: '', disabled: true }, [Validators.required]),
      entryDate: new FormControl({ value: '', disabled: true }, [Validators.required]),
      orgofficeNo: new FormControl({ value: '', disabled: true }, [Validators.required]),
      department: new FormControl({ value: '', disabled: true }, [Validators.required]),
      division: new FormControl({ value: '', disabled: true }, [Validators.required]),
      designation: new FormControl({ value: '', disabled: true }, [Validators.required]),
      biometricId: new FormControl({ value: '', disabled: true }),
      employeeID: new FormControl({ value: '', disabled: true }, [Validators.required]),
      lAType: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]),
      lARequistionDate: new FormControl({ value: '', disabled: true }, [Validators.required]),
      lARequistionAmount: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required]),
      lAApprovedDate: new FormControl({ value: '', disabled: true }, [Validators.required]),
      lAApprovedAmount: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required]),
      lANoOfInstl: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required]),
      lACondition: new FormControl({ value: '', disabled: true }, [Validators.required]),
      lAInterestPercentage: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,2}\.\d{1,3})$|^\d{0,3}$/)]),
      lAMonthlyDeduction: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.required]),
      lAApprovedEmployeeID: new FormControl({ value: '', disabled: true }, [Validators.required]),
      laDeductedTillDate: new FormControl({ value: '', disabled: true }),
      laInstallmentsTillPaid: new FormControl({ value: '', disabled: true }),
    });
  }

  getOrganizationDetails() {
    this.service.getOrganisationDetails().subscribe(data => {
      this.organisationDetails = data;
    });
  }

  onChanges() {
    // Department Subscription
    this.subscriptions.push(this.loanDetailsForm.controls.orgofficeNo.valueChanges.subscribe((orgofficeNo: any) => {
      if (orgofficeNo) {
        this.service.getDepartmentByOrganisation(orgofficeNo).subscribe((data: any) => {
          if (data) {
            this.departmentDetails = data;
            this.devisionDetails = null;
            this.designationDetails = null;
            this.employeeDetails = null;
          }
        },
          error => {
            this.alertService.error('No Data Found');
            this.departmentDetails = null;
            this.devisionDetails = null;
            this.designationDetails = null;
            this.employeeDetails = null;
          });
      }
    }));

    // Devision Subscription
    this.subscriptions.push(this.loanDetailsForm.controls.department.valueChanges.subscribe((department: any) => {
      if (department) {
        this.service.getDivision(department).subscribe((data: any) => {
          if (data) {
            this.devisionDetails = data;
            this.designationDetails = null;
            this.employeeDetails = null;
          }
        },
          error => {
            this.alertService.error('No Data Found');
            this.devisionDetails = null;
            this.designationDetails = null;
            this.employeeDetails = null;
          });
      }
    }));

    // Designation Subscription
    this.subscriptions.push(this.loanDetailsForm.controls.division.valueChanges.subscribe((division: any) => {
      if (division) {
        this.service.getDesignation(division).subscribe((data: any) => {
          if (data) {
            this.designationDetails = data;
            this.employeeDetails = null;
          }
        },
          error => {
            this.alertService.error('No Data Found');
            this.designationDetails = null;
            this.employeeDetails = null;
          });
      }
    }));

    // Employee Subscription
    this.subscriptions.push(this.loanDetailsForm.controls.designation.valueChanges.subscribe((designation: any) => {
      if (designation) {
        this.service.getAllEmployeeByDesignationCode(designation).subscribe((data: any) => {
          if (data) {
            this.employeeDetails = data;
            this.loanDetails = null;
          }
        },
          error => {
            this.alertService.error('No Data Found');
            this.employeeDetails = null;
            this.loanDetails = null;
          });
      }
    }));

  }

  getemployeeByBiometricIdonBlur() {
    let bioId = +this.loanDetailsForm.controls.biometricId.value;
    if (bioId == 0 || isNaN(bioId)) {
      return;
    }
    this.service.getEmployeeByBiometricId(bioId).subscribe((data: Employee[]) => {
      if (data && data.length > 0) {
        let dataEmployee = data.filter(a => a.empBiometricId == bioId.toString())[0];

        this.service.getOrganisationDetails().subscribe(data => {
          this.organisationDetails = data;
          this.loanDetailsForm.controls.orgofficeNo.setValue(dataEmployee.orgOfficeNo);
          this.service.getDepartmentByOrganisation(dataEmployee.orgOfficeNo).subscribe((data: any) => {
            if (data) {
              this.departmentDetails = data;
              this.devisionDetails = null;
              this.designationDetails = null;
              this.employeeDetails = null;
              this.loanDetailsForm.controls.department.setValue(dataEmployee.departmentCode);
              this.service.getDivision(dataEmployee.departmentCode).subscribe((data: any) => {
                if (data) {
                  this.devisionDetails = data;
                  this.designationDetails = null;
                  this.employeeDetails = null;
                  this.loanDetailsForm.controls.division.setValue(dataEmployee.subDepartmentCode);
                  this.service.getDesignation(dataEmployee.subDepartmentCode).subscribe((data: any) => {
                    if (data) {
                      this.designationDetails = data;
                      this.employeeDetails = null;
                      this.loanDetailsForm.controls.designation.setValue(dataEmployee.designationCode);
                      this.service.getAllEmployeeByDesignationCode(dataEmployee.designationCode).subscribe((data: any) => {
                        if (data) {
                          this.employeeDetails = data;
                          this.loanDetails = null;
                          this.loanDetailsForm.controls.biometricId.setValue(dataEmployee.empBiometricId);
                          this.loanDetailsForm.controls.employeeID.setValue(dataEmployee.employeeId);

                        }
                      },
                        error => {
                          this.alertService.error('No Data Found');
                          this.employeeDetails = null;
                          this.loanDetails = null;
                        });
                    }
                  },
                    error => {
                      this.alertService.error('No Data Found');
                      this.designationDetails = null;
                      this.employeeDetails = null;
                    });

                }
              },
                error => {
                  this.alertService.error('No Data Found');
                  this.devisionDetails = null;
                  this.designationDetails = null;
                  this.employeeDetails = null;
                });
            }
          },
            error => {
              this.alertService.error('No Data Found');
              this.departmentDetails = null;
              this.devisionDetails = null;
              this.designationDetails = null;
              this.employeeDetails = null;
            });
        });
      } else {
        this.loanDetailsForm.controls.orgofficeNo.setValue('');
        this.loanDetailsForm.controls.department.setValue('');
        this.loanDetailsForm.controls.division.setValue('');
        this.loanDetailsForm.controls.designation.setValue('');
        this.loanDetailsForm.controls.employeeID.setValue('');

      }

    });
  }
  createLoadAdvances() {
    this.loanDetailsForm.enable();
    this.getLoansAdvancesNo();
    this.loanDetailsForm.controls.loginEmployeeID.setValue(this.employee.userId);
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="entryDate"]').focus();
    }, 100);
    this.mode = 'add';
    this.saveMode = 'insert';
    this.items = [
      'Short Term Loan',
      'Long Term Loan',
    ];
  }

  getLoansAdvancesNo() {
    this.service.getLoansAdvancesNo().subscribe((data) => {
      this.loanDetailsForm.controls.loanAdvNo.setValue(data);
    });
  }

  search() {
    // this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="orgofficeNo"]').focus();
    }, 100);
    this.loanDetailsForm.controls.orgofficeNo.enable();
    this.loanDetailsForm.controls.department.enable();
    this.loanDetailsForm.controls.division.enable();
    this.loanDetailsForm.controls.designation.enable();
    this.loanDetailsForm.controls.biometricId.enable();

    this.loanDetailsForm.controls.employeeID.enable();
    this.loanDetailsForm.controls.loanAdvNo.enable();
    this.subscriptions.push(this.loanDetailsForm.controls.employeeID.valueChanges.subscribe((employeeId: any) => {
      if (this.loanDetailsForm.controls.orgofficeNo.value && employeeId) {
        this.service.seachLoansAdvances(this.loanDetailsForm.controls.orgofficeNo.value, employeeId).subscribe((data: any) => {
          if (data) {
            this.loanDetails = data;
          }
        },
          error => {
            this.alertService.error('Not Found');
            this.loanDetails = null;
          });
      }
    }));
    this.mode = 'find';
    this.items = [
      'Short Term Loan',
      'Long Term Loan',
    ];
  }

  clear() {
    // this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.loanDetailsForm.reset();
    this.loanDetailsForm.disable();
    this.mode = '';
    this.items = [
      'Short Term Loan',
      'Long Term Loan',
    ];
  }

  save() {
    const formData = this.loanDetailsForm.getRawValue();
    formData.entryDate = this.updateDateFormate(formData.entryDate);
    formData.lARequistionDate = this.updateDateFormate(formData.lARequistionDate);
    formData.lAApprovedDate = this.updateDateFormate(formData.lAApprovedDate);
    if (this.saveMode === 'insert') {
      this.service.createLoansAdvances(formData).subscribe((result) => {
        if (result) {
          this.alertService.success('Loans and Advance Record Created Sucessfully');
          this.clear();
        }
      },
        error => {
          this.alertService.error(error);
        });

    } else if (this.saveMode === 'update') {
      this.service.updateLoansAdvances(formData).subscribe((result) => {
        if (result) {
          this.alertService.success('Loans and Advance Record Updated Sucessfully');
          this.clear();
        }
      },
        error => {
          this.alertService.error(error);
        });
    }
  }

  modify() {
    const loadAdvanceDetail = this.loanDetails.filter(record => record.loanAdvNo === this.loanDetailsForm.controls.loanAdvNo.value);
    if (loadAdvanceDetail.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.loanDetailsForm.enable();
      this.saveItemToList(loadAdvanceDetail[0].lAType);
      this.loanDetailsForm.patchValue(loadAdvanceDetail[0]);
      this.loanDetailsForm.controls.loginEmployeeID.setValue(this.employee.userId);
      setTimeout(() => {
        this.el.nativeElement.querySelector('[formControlName="entryDate"]').focus();
      }, 100);
      this.saveMode = 'update';
      this.mode = 'update';
      this.onChanges();
    }
  }


  updateDateFormate(dateUpdate) {
    const date = new Date(dateUpdate);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }

  saveItemToList(option: string) {
    if (option) {
      if (!this.items.some(entry => entry === option)) {
        this.items.push(option);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
