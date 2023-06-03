import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { EsicDetailsService } from './esic-details.service';
import { ESICRates } from './esic-details.model';
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

@Component({
  selector: 'app-esicrates-details',
  templateUrl: './esicrates-details.component.html',
  styleUrls: ['./esicrates-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ESICRatesDetailsComponent implements OnInit {
  enableNew: boolean;
  enableSave: boolean;
  enableClear = true;
  enableModify: boolean;
  @ViewChild('dateOfEntry', { static: false }) DateOfEntry: ElementRef;

  ESICRatesDetailsForm = new FormGroup({
    ESIPassingNo: new FormControl(''),
    DateOfEntry: new FormControl('', [Validators.required]),
    LoginUserName: new FormControl('', [Validators.required]),
    EffectiveDate: new FormControl('', [Validators.required]),
    FromDate: new FormControl('', [Validators.required]),
    ToDate: new FormControl('', [Validators.required]),
    MaxLimit: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    EmployerContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{0,2})$|^\d{0,2}$/)]),
    EmployeeContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{0,2})$|^\d{0,2}$/)]),
    TotalContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{0,2})$|^\d{0,2}$/)]),
  });
  loggedInUser: any;
  ESICRateList: ESICRates[] = [];
  ESICRate = new ESICRates();
  submitted: boolean;
  min = 0;
  max = 10;
  selectedRowId: number;

  constructor(private authService: AuthenticationService, private esicService: EsicDetailsService, private alertService: AlertService) {
    this.loggedInUser = this.authService.getUserdetails();
  }

  ngOnInit() {
    this.InitData();
  }

  InitData() {
    try {
      this.ESICRatesDetailsForm.reset();
      this.enableNew = true;
      this.enableSave = false;
      this.enableModify = false;
      this.ESICRatesDetailsForm.disable();

      this.esicService.getESICRates().subscribe((data: ESICRates[]) => {
        if (data) {
          this.ESICRateList = data;
        }
      });
    } catch (error) {

    }
  }
  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }
  addNewESIC() {
    try {
      this.ESICRate = new ESICRates();
      this.submitted = false;
      this.ESICRatesDetailsForm.reset();
      this.ESICRatesDetailsForm.enable();
      this.enableNew = false;
      this.enableSave = true;
      this.enableModify = false;
      this.selectedRowId = 0;
      this.ESICRatesDetailsForm.controls.LoginUserName.setValue(this.loggedInUser.userName);
      this.ESICRatesDetailsForm.controls.DateOfEntry.setValue(new Date());
      setTimeout(() => {
        this.DateOfEntry.nativeElement.focus();
      }, 100);
      // this.DateOfEntry.nativeElement.focus();
    } catch (error) {

    }
  }

  selectedESIC(i) {
    try {
      this.ESICRatesDetailsForm.enable();
      this.ESICRate = this.ESICRateList[i];
      this.ESICRatesDetailsForm.controls.DateOfEntry.setValue(this.ESICRate.entryDate);
      this.ESICRatesDetailsForm.controls.LoginUserName.setValue(this.ESICRate.enteredEmpId);
      this.ESICRatesDetailsForm.controls.EffectiveDate.setValue(this.ESICRate.esiEffectiveDate);
      this.ESICRatesDetailsForm.controls.FromDate.setValue(this.ESICRate.esiEffectiveFromDate);
      this.ESICRatesDetailsForm.controls.ToDate.setValue(this.ESICRate.esiEffectiveToDate);
      this.ESICRatesDetailsForm.controls.MaxLimit.setValue(this.ESICRate.esiMaxLimit);
      this.ESICRatesDetailsForm.controls.EmployerContribution.setValue(this.ESICRate.esiEmployerCount);
      this.ESICRatesDetailsForm.controls.EmployeeContribution.setValue(this.ESICRate.esiEmployeeCount);
      this.ESICRatesDetailsForm.controls.TotalContribution.setValue(this.ESICRate.esiTotalCount);
      this.selectedRowId = this.ESICRate.esiPassingNo;
      this.ESICRatesDetailsForm.disable();
      this.enableNew = false;
      this.enableSave = false;
      this.enableModify = true;

    } catch (error) {

    }
  }

  modifyESIC() {
    try {
      this.ESICRatesDetailsForm.enable();
      this.enableNew = false;
      this.submitted = false;
      this.enableSave = true;
      this.enableModify = false;
    } catch (error) {

    }
  }

  getCurrentDate() {
    let date = new Date(Date.now());
    // tslint:disable-next-line: one-variable-per-declaration
    let day, month, hour, minute, seconds;
    if (date.getDate() < 10) {
      day = `0${date.getDate()}`;
    } else {
      day = date.getDate();
    }
    if (date.getMonth() > 8) {
      month = `0${date.getMonth() + 1}`;
    } else {
      month = date.getMonth() + 1;
    }
    if (date.getHours() < 10) {
      hour = `0${date.getHours()}`;
    } else {
      hour = date.getHours();
    }
    if (date.getMinutes() < 10) {
      minute = `0${date.getMinutes()}`;
    } else {
      minute = date.getMinutes();
    }
    if (date.getSeconds() < 10) {
      seconds = `0${date.getSeconds()}`;
    } else {
      seconds = date.getSeconds();
    }

    return `${day}-${month}-${date.getFullYear()} ${hour}:${minute}:${seconds}`;
  }

  saveESIC() {
    try {
      this.submitted = true;
      const esic: ESICRates = new ESICRates();
      // const formatedDate = this.getCurrentDate();
      esic.enteredEmpId = this.ESICRatesDetailsForm.controls.LoginUserName.value;
      esic.entryDate = this.ESICRatesDetailsForm.controls.DateOfEntry.value;
      esic.esiEffectiveDate = this.ESICRatesDetailsForm.controls.EffectiveDate.value;
      esic.esiEffectiveFromDate = this.ESICRatesDetailsForm.controls.FromDate.value;
      esic.esiEffectiveToDate = this.ESICRatesDetailsForm.controls.ToDate.value;
      esic.esiEmployeeCount = this.ESICRatesDetailsForm.controls.EmployeeContribution.value;
      esic.esiEmployerCount = this.ESICRatesDetailsForm.controls.EmployerContribution.value;
      esic.esiMaxLimit = this.ESICRatesDetailsForm.controls.MaxLimit.value;
      esic.esiTotalCount = this.ESICRatesDetailsForm.controls.TotalContribution.value;

      if (this.ESICRate !== undefined && this.ESICRate.esiPassingNo > 0) {
        esic.esiPassingNo = this.ESICRate.esiPassingNo;
        this.esicService.updateESICRates(esic).subscribe(data => {
          if (data) {
            this.InitData();
            this.alertService.success('ESIC Rates updated successfully!');
            this.enableNew = true;
            this.enableSave = false;
            this.enableModify = false;
            this.selectedRowId = 0;
          }
        }, err => {
          this.alertService.error('Error has occured while updating ESIC Rates.');
        });
      } else {
        this.esicService.addESICRates(esic).subscribe(data => {
          if (data) {
            this.InitData();
            this.alertService.success('ESIC Rates saved successfully!');
            this.enableNew = true;
            this.enableSave = false;
            this.enableModify = false;
            this.selectedRowId = 0;
          }
        }, err => {
          this.alertService.error('Error has occured while saving ESIC Rates.');
        });
      }

    } catch (error) {

    }
  }
  sum() {
    try {
      const employeeContrib = parseFloat(this.ESICRatesDetailsForm.controls.EmployeeContribution.value);
      const employerContrib = parseFloat(this.ESICRatesDetailsForm.controls.EmployerContribution.value);
      let tot;
      if (!isNaN(employeeContrib) && !isNaN(employerContrib)) {
        tot = (employeeContrib + employerContrib).toFixed(2);
      } else if (!isNaN(employeeContrib)) {
        tot = (employeeContrib).toFixed(2);
      } else if (!isNaN(employerContrib)) {
        tot = (employerContrib).toFixed(2);
      } else {
        tot = 0;
      }
      this.ESICRatesDetailsForm.controls.TotalContribution.setValue(tot);
    } catch (error) {

    }
  }

  clearFields() {
    try {
      this.ESICRatesDetailsForm.controls.LoginUserName.setValue(this.loggedInUser.userName);
      this.ESICRatesDetailsForm.reset();
      this.ESICRatesDetailsForm.disable();
      this.enableNew = true;
      this.enableSave = false;
      this.enableModify = false;
      this.selectedRowId = 0;
    } catch (error) {

    }
  }

}
