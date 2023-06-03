import { AuthenticationService } from './../../../../shared/services/authentication-service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfessionalTaxRatesService } from './professional-tax-rates.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
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
  selector: 'app-professional-tax-rates',
  templateUrl: './professional-tax-rates.component.html',
  styleUrls: ['./professional-tax-rates.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ProfessionalTaxRatesComponent implements OnInit {
  @ViewChild('salaryFrom', { static: false }) salaryFrom: ElementRef;
  @ViewChild('dateofEntry', { static: false }) dateofEntry: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('professionalTax', { static: false }) professionalTax: ElementRef;
  @ViewChild('salaryTo', { static: false }) salaryTo: ElementRef;


  professionalTaxRatesForm: FormGroup;
  professionTaxRateList = [];
  addedtaxAmountExempted;
  professionalTaxRateDetails = [];
  professionalTaxSlabs = [];
  professionalTaxDetailData;
  professionTaxRateDetailList = [];
  disablemodifyData = false;
  modifyData = false;
  pTPasssingNo;
  pTPassingSlabID;
  employeeId;
  employeeUserName;
  addNewData = true;
  saveData = true;
  modifyDataInfo = true;
  selectedRowId = 0;
  min = 0;
  max = 10;
  salaryAmountFrom = 0;
  salaryAmountTo = 0;
  maxIntValue = 2147483647;
  showSalaryFromError = false;
  showSalaryToError = false;

  constructor(public readonly dialog: MatDialog,
    // tslint:disable-next-line: align
    private readonly formBuilder: FormBuilder,
    // tslint:disable-next-line: align
    private readonly professionalTaxRatesService: ProfessionalTaxRatesService,
    // tslint:disable-next-line: align
    private readonly alertService: AlertService,
    // tslint:disable-next-line: align
    private readonly authService: AuthenticationService) { }

  ngOnInit() {
    try {
      this.formCreation();
      this.getProfessionTaxRate();
      this.addNewData = false;
      this.scrollToBottom();
      this.disablemodifyData = true;
      this.modifyData = true;
    } catch (error) {
      console.log('on init error', error);
    }
  }

  formCreation() {
    try {
      this.professionalTaxRatesForm = this.formBuilder.group({
        dateOfEntry: [
          '',
          [Validators.required]
        ],
        loginUserName: ['', [Validators.required]],
        effectiveDate: ['', [Validators.required]],
        monthlyChalanDate: ['', [Validators.required]],
        directorPayableAmount: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        taxAmountExempted: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        salaryForm: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        salaryTo: ['', [Validators.pattern(/^[0-9]*$/)]],
        professionalTaxAmount: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
      });
      this.employeeId = this.authService.getUserdetails().userId;
      this.employeeUserName = this.authService.getUserdetails().userName;
      this.professionalTaxRatesForm.controls.loginUserName.setValue(this.employeeUserName);
    } catch (error) {
      console.log('form creation error', error);
    }
  }

  navigateToEmployeeContribution(event, professionalTaxValue) {
    try {
      // tslint:disable-next-line: radix
      const taxAmount = (parseInt(professionalTaxValue.taxAmountExempted) + 1).toString();
      this.professionalTaxRatesForm.controls.salaryForm.setValue(taxAmount);
      this.salaryFrom.nativeElement.focus();
    } catch (error) {
      console.log('navigate to employee Contribution', error);
    }
  }

  updateModifyFieldData(professionalTaxDetail) {
    try {
      this.professionTaxRateDetailList.forEach(element => {
        if (element.pTPasssingNo === this.pTPasssingNo) {
          this.professionalTaxDetailData = {
            dateofEntry: element.DateofEntry === professionalTaxDetail.dateOfEntry ? professionalTaxDetail.dateOfEntry :
              this.updateDateFormate(professionalTaxDetail.dateOfEntry),
            loginUserName: this.employeeId,
            effectiveDate: element.EffectiveDate === professionalTaxDetail.effectiveDate ?
              professionalTaxDetail.effectiveDate :
              this.updateDateFormate(professionalTaxDetail.effectiveDate),
            monthlyChallanDate: professionalTaxDetail.monthlyChalanDate,
            // tslint:disable-next-line: radix
            directorsPayable: parseInt(professionalTaxDetail.directorPayableAmount),
            // tslint:disable-next-line: radix
            taxAmountExemptedSalary: parseInt(professionalTaxDetail.taxAmountExempted),
            // tslint:disable-next-line: radix
            pTPasssingNo: parseInt(this.pTPasssingNo),
            ProfessionalTaxSlabs: []
          };
        }
      });

      this.professionalTaxSlabs = [];
      const slabDetail = {
        // tslint:disable-next-line: radix
        salaryFrom: parseInt(professionalTaxDetail.salaryForm),
        // tslint:disable-next-line: radix
        salaryTo: parseInt(professionalTaxDetail.salaryTo),
        // tslint:disable-next-line: radix
        professionalTaxAmount: parseInt(professionalTaxDetail.professionalTaxAmount),
        // tslint:disable-next-line: radix
        pTPassingSlabID: parseInt(this.pTPassingSlabID)
      };
      this.professionalTaxSlabs.push(slabDetail);
      this.saveButton.nativeElement.focus();
    } catch (error) {
      console.log('update modifyfield data', error);
    }
  }
  updateTaxRateDetail(event, professionalTaxDetail) {
    try {
      if (professionalTaxDetail.professionalTaxAmount !== '' && professionalTaxDetail.professionalTaxAmount !== null) {
        if (professionalTaxDetail.salaryTo === '' || professionalTaxDetail.salaryTo === null
        ) {
          if (!isNaN(professionalTaxDetail.professionalTaxAmount)) {
            this.showPopupDialogForConfirmation(professionalTaxDetail, event);
          }
        } else {
          if (!isNaN(professionalTaxDetail.professionalTaxAmount)) {
            if (this.disablemodifyData) {
              this.updateModifyFieldData(professionalTaxDetail);
            } else {
              this.showPopupDialog(professionalTaxDetail);
            }
          }
        }
      }
    } catch (error) {
      console.log('professionalData', error);
    }
  }

  showPopupDialogForConfirmation(professionalTaxDetail, event) {
    try {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do want to complete the Slabs with max Salary ?'
      });


      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (professionalTaxDetail.salaryTo === ''
            || professionalTaxDetail.salaryTo === null) {
            professionalTaxDetail.salaryTo = 'Max';
          }
          if (!isNaN(professionalTaxDetail.professionalTaxAmount)) {
            if (this.disablemodifyData) {
              this.updateModifyFieldData(professionalTaxDetail);
            } else {
              if (this.addedtaxAmountExempted === professionalTaxDetail.taxAmountExempted) {
                this.updateSlabDetail(professionalTaxDetail);
              } else {
                this.updateProfessionTaxRateInfo(professionalTaxDetail);
                this.updateSlabDetails(professionalTaxDetail);
                professionalTaxDetail.slNO = this.professionTaxRateList.length + 1;
                this.professionTaxRateList.push(professionalTaxDetail);
              }
              this.addedtaxAmountExempted = '';
              this.saveData = false;
              const target = event.target;
              target.blur();
              this.scrollToBottom();
              this.saveButton.nativeElement.focus();
            }
          }
        } else {
          this.salaryTo.nativeElement.focus();
        }

      });
    } catch (error) {
      console.log('showPopupDialogForConfirmation', error);
    }
  }

  updateDateFormate(dateUpdate) {
    try {
      const date = new Date(dateUpdate);
      date.setDate(date.getDate() + 1);
      return date.toISOString();
    } catch (error) {
      console.log('updateDateFormate', error);
    }
  }

  showPopupDialog(professionalTaxDetail) {
    try {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you want to add more Salary Slabs ?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.popupOnSuccess(professionalTaxDetail);
        } else {
          if (!isNaN(professionalTaxDetail.professionalTaxAmount)) {
            if (this.addedtaxAmountExempted === professionalTaxDetail.taxAmountExempted) {
              this.updateSlabDetail(professionalTaxDetail);
            } else {
              this.updateProfessionTaxRateInfo(professionalTaxDetail);
              this.updateSlabDetails(professionalTaxDetail);
              professionalTaxDetail.slNO = this.professionTaxRateList.length + 1;
              this.professionTaxRateList.push(professionalTaxDetail);
            }
            this.addedtaxAmountExempted = '';
            this.saveData = false;
            this.saveButton.nativeElement.focus();
          }
        }

      });
    } catch (error) {
      console.log('showPopupDialog', error);
    }
  }

  popupOnSuccess(professionalTaxDetail) {
    try {
      this.salaryTo.nativeElement.focus();
      // tslint:disable-next-line: radix
      const salaryTo = (parseInt(professionalTaxDetail.salaryTo) + 1).toString();
      this.professionalTaxRatesForm.controls.salaryForm.setValue(salaryTo);
      if (this.professionTaxRateList.length === 0) {
        this.updateProfessionTaxRateInfo(professionalTaxDetail);
        this.updateSlabDetails(professionalTaxDetail);
        professionalTaxDetail.slNO = this.professionTaxRateList.length + 1;
        this.addedtaxAmountExempted = professionalTaxDetail.taxAmountExempted;
        this.professionTaxRateList.push(professionalTaxDetail);
      } else if (this.professionTaxRateList[this.professionTaxRateList.length - 1].taxAmountExempted !== ''
        && this.professionTaxRateList[this.professionTaxRateList.length - 1].taxAmountExempted !== this.addedtaxAmountExempted) {
        this.addedtaxAmountExempted = professionalTaxDetail.taxAmountExempted;
        this.updateProfessionTaxRateInfo(professionalTaxDetail);
        this.updateSlabDetails(professionalTaxDetail);
        professionalTaxDetail.slNO = this.professionTaxRateList.length + 1;
        this.professionTaxRateList.push(professionalTaxDetail);
      } else {
        if (this.addedtaxAmountExempted === professionalTaxDetail.taxAmountExempted) {
          this.updateSlabDetail(professionalTaxDetail);
        }
      }
      this.professionalTaxRatesForm.controls.salaryTo.reset();
      this.professionalTaxRatesForm.controls.professionalTaxAmount.reset();
    } catch (error) {
      console.log('popupOnSuccess', error);
    }
  }

  updateSlabDetail(professionalTaxDetail) {
    try {
      const professionalTaxRate = {
        slNO: this.professionTaxRateList.length + 1,
        effectiveDate: '',
        directorPayableAmount: '',
        taxAmountExempted: '',
        salaryForm: professionalTaxDetail.salaryForm === 'Max' ? 0 : professionalTaxDetail.salaryForm,
        salaryTo: professionalTaxDetail.salaryTo,
        professionalTaxAmount: professionalTaxDetail.professionalTaxAmount
      };
      this.updateSlabDetails(professionalTaxDetail);
      this.professionTaxRateList.push(professionalTaxRate);
    } catch (error) {
      console.log('updateSlabDetail', error);
    }
  }

  updateProfessionTaxRateInfo(professionalTaxDetail) {
    try {
      this.professionalTaxDetailData = {
        dateofEntry: this.updateDateFormate(professionalTaxDetail.dateOfEntry),
        loginUserName: this.employeeId,
        effectiveDate: this.updateDateFormate(professionalTaxDetail.effectiveDate),
        monthlyChallanDate: this.updateDateFormate(professionalTaxDetail.monthlyChalanDate),
        // tslint:disable-next-line: radix
        directorsPayable: parseInt(professionalTaxDetail.directorPayableAmount),
        // tslint:disable-next-line: radix
        taxAmountExemptedSalary: parseInt(professionalTaxDetail.taxAmountExempted),
        professionalTaxSlabs: []
      };
      this.professionalTaxSlabs = [];
    } catch (error) {
      console.log('updateProfessionTaxRateInfo', error);
    }
  }

  updateSlabDetails(professionalTaxDetail) {
    try {
      const slabDetail = {
        // tslint:disable-next-line: radix
        salaryFrom: parseInt(professionalTaxDetail.salaryForm),
        // tslint:disable-next-line: radix
        salaryTo: professionalTaxDetail.salaryTo === 'Max' ? 0 : parseInt(professionalTaxDetail.salaryTo),
        // tslint:disable-next-line: radix
        professionalTaxAmount: parseInt(professionalTaxDetail.professionalTaxAmount)
      };
      this.professionalTaxSlabs.push(slabDetail);
    } catch (error) {
      console.log('updateSlabDetails', error);
    }
  }

  saveProfessionalTaxRate() {
    try {
      if (this.disablemodifyData) {
        this.modifyProfessionalData();
      } else {
        this.saveProfessionalData();
      }
    } catch (error) {
      console.log('saveProfessionalTaxRate', error);
    }
  }

  modifyProfessionalData() {
    try {
      this.professionalTaxDetailData.professionalTaxSlabs = this.professionalTaxSlabs;
      this.professionalTaxRatesService.modifyProfessionalTaxRateDatails(
        this.professionalTaxDetailData, this.pTPasssingNo).subscribe(res => {
          this.alertService.success('Data Updated Successfully');
          this.modifyData = false;
          this.selectedRowId = 0;
          this.disablemodifyData = false;
          this.professionalTaxRatesForm.reset();
          this.getProfessionTaxRate();
          this.addNewData = false;
          this.saveData = true;
          this.modifyDataInfo = true;
          this.professionalTaxRatesForm.controls.loginUserName.setValue(this.employeeUserName);
        },
          error => {
            this.alertService.error('Data couldnt be updated');
            console.log('error data', error);
          });
    } catch (error) {
      console.log('modifyProfessionalData', error);
    }
  }

  saveProfessionalData() {
    try {
      this.professionalTaxDetailData.professionalTaxSlabs = this.professionalTaxSlabs;
      this.professionalTaxRatesService.saveProfessionalTaxRateDatails(this.professionalTaxDetailData).subscribe(res => {
        this.professionalTaxRatesForm.reset();
        this.getProfessionTaxRate();
        this.addNewData = false;
        this.saveData = true;
        this.modifyDataInfo = true;
        this.professionalTaxRatesForm.controls.loginUserName.setValue(this.employeeUserName);
        this.alertService.success('Professional Tax Rates Created Successfully');
      },
        error => {
          this.alertService.error('Professional Tax Rates data couldnt be saved');
          console.log('error professional tax', error);
        });
    } catch (error) {
      console.log('saveProfessionalData', error);
    }
  }

  clearProfessionalTaxRate() {
    try {
      this.min = 0;
      this.max = 10;
      this.professionalTaxRatesForm.reset();
      this.addNewData = false;
      this.selectedRowId = 0;
      this.modifyData = false;
      this.disablemodifyData = false;
      this.getProfessionTaxRate();
      this.professionalTaxRatesForm.controls.loginUserName.setValue(this.employeeUserName);
    } catch (error) {
      console.log('clearProfessionalTaxRate', error);
    }
  }

  addNewProfessionalTaxRate() {
    try {
      this.addNewData = true;
      this.professionTaxRateList = [];
      this.disablemodifyData = false;
      this.modifyData = false;
      this.dateofEntry.nativeElement.focus();
    } catch (error) {
      console.log('addNewProfessionalTaxRate', error);
    }
  }

  getProfessionTaxRate() {
    try {
      this.professionalTaxRatesService.getProfessionalTaxRateDetails().subscribe((res: any) => {
        console.log('res data list', res);
        this.professionTaxRateList = [];
        console.log('professionaTax', this.professionTaxRateList);
        this.professionTaxRateDetailList = res;
        res.forEach(element => {
          for (let index = 0; index < element.professionalTaxSlabs.length; index++) {
            // const element = array[index];
            if (index === 0) {
              const professionSlabData = {
                slNO: this.professionTaxRateList.length + 1,
                effectiveDate: element.effectiveDate,
                directorPayableAmount: element.directorsPayable,
                taxAmountExempted: element.taxAmountExemptedSalary,
                salaryForm: element.professionalTaxSlabs[index].salaryFrom,
                salaryTo: element.professionalTaxSlabs[index].salaryTo === this.maxIntValue ? 'Max'
                  : element.professionalTaxSlabs[index].salaryTo,
                professionalTaxAmount: element.professionalTaxSlabs[index].professionalTaxAmount,
                pTPasssingNo: element.pTPasssingNo,
                pTPassingSlabID: element.professionalTaxSlabs[index].pTPassingSlabID
              };
              this.professionTaxRateList.push(professionSlabData);
            } else {
              const professionSlabData = {
                slNO: this.professionTaxRateList.length + 1,
                effectiveDate: '',
                directorPayableAmount: '',
                taxAmountExempted: '',
                salaryForm: element.professionalTaxSlabs[index].salaryFrom,
                salaryTo: element.professionalTaxSlabs[index].salaryTo === this.maxIntValue ? 'Max'
                  : element.professionalTaxSlabs[index].salaryTo,
                professionalTaxAmount: element.professionalTaxSlabs[index].professionalTaxAmount,
                pTPasssingNo: element.pTPasssingNo,
                pTPassingSlabID: element.professionalTaxSlabs[index].pTPassingSlabID
              };
              this.professionTaxRateList.push(professionSlabData);
            }
          }
        });
        console.log('professionTaxRateList', this.professionTaxRateList);
      },
        error => {
          this.alertService.error('Professional tax rate list fetched unsucessfully');
          console.log('error data list', error);
        });
    } catch (error) {
      console.log('getProfessionTaxRate', error);
    }
  }

  modifyProfessionTaxRate(taxRate) {
    try {
      this.modifyData = true;
      this.disablemodifyData = true;
      this.selectedRowId = taxRate.slNO;
      this.professionTaxRateDetailList.forEach(element => {
        if (element.pTPasssingNo === taxRate.pTPasssingNo) {
          this.pTPasssingNo = element.pTPasssingNo;
          this.pTPassingSlabID = taxRate.pTPassingSlabID;
          this.professionalTaxRatesForm.controls.dateOfEntry.setValue(element.dateofEntry);
          this.professionalTaxRatesForm.controls.loginUserName.setValue(this.employeeUserName);
          this.professionalTaxRatesForm.controls.effectiveDate.setValue(element.effectiveDate);
          this.professionalTaxRatesForm.controls.monthlyChalanDate.setValue(element.monthlyChallanDate);
          this.professionalTaxRatesForm.controls.directorPayableAmount.setValue(element.directorsPayable);
          this.professionalTaxRatesForm.controls.taxAmountExempted.setValue(element.taxAmountExemptedSalary);
          this.professionalTaxRatesForm.controls.salaryForm.setValue(taxRate.salaryForm);
          this.professionalTaxRatesForm.controls.salaryTo.setValue(taxRate.salaryTo);
          this.professionalTaxRatesForm.controls.professionalTaxAmount.setValue(taxRate.professionalTaxAmount);
        }
      });
      this.modifyDataInfo = false;
      this.addNewData = true;
    } catch (error) {
      this.alertService.error('Professional tax rate modify stored unsucessfully');
      console.log('modifyProfessionTaxRate', error);
    }
  }

  modifyProfessionDetail() {
    try {
      this.modifyData = false;
      this.modifyDataInfo = true;
      this.saveData = false;
    } catch (error) {
      console.log('modifyProfessionTaxRate', error);
    }
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  scrollToBottom() {
    try {
      window.scroll({ top: 2800, left: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error in Scrolling bottom!', error);
    }

  }

  checkSalaryFromValidation(professionalTaxValue) {
    console.log(professionalTaxValue);
    // tslint:disable-next-line: radix
    if (parseInt(professionalTaxValue.salaryForm) <= parseInt(professionalTaxValue.taxAmountExempted)) {
      this.showSalaryFromError = true;
    } else {
      this.showSalaryFromError = false;
    }
  }

  checkSalaryToValidation(professionalTaxValue) {
    if (professionalTaxValue.salaryTo !== null) {
      // tslint:disable-next-line: radix
      if (parseInt(professionalTaxValue.salaryTo) <= parseInt(professionalTaxValue.salaryForm)) {
        this.showSalaryToError = true;
      } else {
        this.showSalaryToError = false;
      }
    } else {
      this.showSalaryToError = false;
    }
  }
}
