import { ngColumnType } from 'src/app/shared/components/ng-grid/grid.models';
import { DatePipe } from '@angular/common';
import { ProvidentFunRatesServiceService } from './provident-fund-rates.service';
import { ActionParams } from './../../../../shared/components/ng-grid/grid.models';
import { AuthenticationService } from './../../../../shared/services/authentication-service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { combineLatest } from 'rxjs';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

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
  selector: 'app-provident-fund-rates',
  templateUrl: './provident-fund-rates.component.html',
  styleUrls: ['./provident-fund-rates.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ProvidentFundRatesComponent implements OnInit {
  mode: string;
  pfRateDetailsForm: FormGroup;
  pfRateCols: any[];
  actionParams: ActionParams;
  pfRateDetails: any[];
  employee: any;
  submitted: boolean;
  selectedRow: any;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;
  pfRateDetailsGridData: any;
  min = 0;
  max = 10;
  enableSave: boolean;

  constructor(private authService: AuthenticationService,
    // tslint:disable-next-line:align
    private formBuilder: FormBuilder, private service: ProvidentFunRatesServiceService,
    // tslint:disable-next-line:align
    private alertService: AlertService,
    // tslint:disable-next-line:align
    private el: ElementRef, private datePipe: DatePipe) { }

  ngOnInit() {
    this.employee = this.authService.getUserdetails();
    this.createForm();
    this.getProvidentFundRateDetails();
  }

  createForm = () => {
    try {
      this.mode = 'Add';
      this.pfRateDetailsForm = this.formBuilder.group({
        entrydate: new FormControl('', [Validators.required]),
        enteredEmpId: new FormControl('', [Validators.required]),
        pfEffectiveDate: new FormControl('', [Validators.required]),
        pfPassingNo: new FormControl(''),
        pfEffectiveFromDate: new FormControl('', [Validators.required]),
        pfEffectiveToDate: new FormControl('', [Validators.required]),
        pfStartingAmount: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(6)]),
        pfEmployeeContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
        pfEmployerEPFContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
        pfEmployerEPSContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
        pfEPFMaxLimit: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(10)]),
        pfEPFAdminCharges: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,1}\.\d{1,3})$|^\d{0,3}$/)]),
        pfEDLISCharges: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,1}\.\d{1,3})$|^\d{0,3}$/)]),
        pfEDLISAdminCharges: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,1}\.\d{1,3})$|^\d{0,3}$/)]),
        pfTotalEmployerContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,3})$|^\d{0,3}$/)]),
      });

      this.onChanges();
      this.pfRateDetailsForm.reset();
      this.pfRateDetailsForm.disable();

    } catch (error) {
      console.log(error);
    }
  }

  getProvidentFundRateDetails() {
    this.service.getProvidentFundRateDetails().subscribe((data: any) => {
      this.pfRateDetails = data;
    });
  }

  onChanges() {
    combineLatest([this.pfRateDetailsForm.get('pfEmployerEPFContribution').valueChanges, this.pfRateDetailsForm.get('pfEmployerEPSContribution').valueChanges
      , this.pfRateDetailsForm.get('pfEPFAdminCharges').valueChanges,
    this.pfRateDetailsForm.get('pfEDLISCharges').valueChanges
      , this.pfRateDetailsForm.get('pfEDLISAdminCharges').valueChanges]
    )
      .subscribe(([pfEmployerEPFContribution, pfEmployerEPSContribution, pfEPFAdminCharges, pfEDLISCharges, pfEDLISAdminCharges]): any => {
        let pfTotalEmployerContribution = +pfEmployerEPFContribution + +pfEmployerEPSContribution + +pfEPFAdminCharges + +pfEDLISCharges +
          +pfEDLISAdminCharges;
        if (pfTotalEmployerContribution) {
          pfTotalEmployerContribution = +pfTotalEmployerContribution.toFixed(3);
        }
        this.pfRateDetailsForm.get('pfTotalEmployerContribution').patchValue(pfTotalEmployerContribution);
      });
  }

  pfRateSelectedRowEvent(event) {
    this.selectedRow = event;
    this.pfRateDetailsForm.patchValue(this.selectedRow);
    this.mode = 'Update';
    this.enableSave = false;
    this.pfRateDetailsForm.disable();
  }

  clearForm() {
    this.pfRateDetailsForm.reset();
    this.submitted = false;
    this.mode = 'Add';
    this.selectedRow = null;
    this.pfRateDetailsForm.disable();
    this.enableSave = false;
    this.getProvidentFundRateDetails();
  }

  addpfRateDetails() {
    this.pfRateDetailsForm.reset();
    this.pfRateDetailsForm.enable();
    this.submitted = false;
    this.selectedRow = null;
    this.enableSave = true;
    this.pfRateDetailsForm.controls.enteredEmpId.setValue(this.employee.userName);
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="entrydate"]').focus();
    }, 100);
    this.mode = '';
  }

  modifypfRateDetails() {
    this.mode = '';
    this.pfRateDetailsForm.enable();
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="entrydate"]').focus();
    }, 100);
    this.enableSave = true;
    this.selectedRow = null;
  }

  savepfRateDetails() {
    this.submitted = true;
    if (this.pfRateDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    this.saveDetailsToDb();
  }

  saveDetailsToDb() {
    try {
      const formData = this.pfRateDetailsForm.getRawValue();
      formData.pfEffectiveDate = this.updateDateFormate(formData.pfEffectiveDate);
      formData.pfEffectiveFromDate = this.updateDateFormate(formData.pfEffectiveFromDate);
      formData.pfEffectiveToDate = this.updateDateFormate(formData.pfEffectiveToDate);
      formData.entrydate = this.updateDateFormate(formData.entrydate);
      if (!formData.pfPassingNo) {
        formData.pfPassingNo = -1;
        this.service.saveProvidentFundRateDetail(formData)
          .subscribe(res => {
            if (res) {
              this.alertService.success('PF Rates Created Sucessfully');
              this.getProvidentFundRateDetails();
              this.clearForm();
            }
          },
            error => {
              this.alertService.error(error);
            });
      } else {
        this.service.updateProvidentFundRateDetail(formData)
          .subscribe(res => {
            if (res) {
              this.alertService.success('PF Rates Updated Sucessfully');
              this.getProvidentFundRateDetails();
              this.clearForm();
            }
          },
            error => {
              this.alertService.error(error);
            });
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  updateDateFormate(dateUpdate) {
    const date = new Date(dateUpdate);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  focusSave() {
    this.saveFocus.nativeElement.focus();
  }

}
