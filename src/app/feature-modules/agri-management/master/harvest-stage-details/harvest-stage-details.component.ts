import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect, MatDatepicker } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { HarvestStageDetailsModel, HarvestStageDetailsData, HarvestStageMasterModel, EffectiveDateForHarvestDetails } from './harvest-stage-details.model';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MomentUtcDateAdapter } from 'src/app/shared/directives/moment-utc-date-adapter';
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
  selector: 'app-harvest-stage-details',
  templateUrl: './harvest-stage-details.component.html',
  styleUrls: ['./harvest-stage-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class HarvestStageDetailsComponent implements OnInit {

  @ViewChild('dateOfCreation', { static: false }) dateOfCreation: ElementRef;
  @ViewChild('cropPhaseName', { static: false }) cropPhaseName: ElementRef;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;
  @ViewChild('dateOfEntry', { static: false }) dateOfEntry: ElementRef;
  @ViewChild('cropGroupNameField', { static: false }) cropGroupNameField: MatSelect;

  harvestStageDetailsForm: FormGroup;

  harvestGetData: any;
  harvestGridsObject: HarvestStageDetailsModel[];
  effectiveDateList: EffectiveDateForHarvestDetails[];

  harvestStageDetailsModel: HarvestStageDetailsData;

  submitted = false;
  SelectedRowId = 0;
  IsRowSelected = false;
  isModifyMode = false;
  isModifyGrid: boolean;
  stockToBeModified: any;
  isLoading = false;
  isHarvestDataExist = false;
  showDateToError: boolean;
  showDateFromError: boolean;
  showDuplicateError: boolean;
  enableNewHarvest: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  isFindMode: boolean;
  isNewHarvestDetailMode: boolean;
  showEffectiveDateDDL: boolean;
  cropNameList: any[];
  employeeId: string;
  employeeName: string;

  defaultPackageOfPractice: string;

  constructor(public authService: AuthenticationService, private formBuilder: FormBuilder, public dialog: MatDialog,
    private service: WebservicewrapperService, private alertService: AlertService) {
    this.harvestGridsObject = [];
    this.effectiveDateList = [];
  }

  ngOnInit() {
    this.enableNewHarvest = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;

    this.isNewHarvestDetailMode = false;
    this.isFindMode = false;
    this.isModifyGrid = false;
    this.isModifyMode = false;
    this.showEffectiveDateDDL = false;
    const emp = this.authService.getUserdetails();
    this.employeeId = emp.employeeId;
    this.employeeName = emp.userName;

    this.defaultPackageOfPractice = 'FERTILISER';

    this.createForm();
    this.service.GetHarvestStageDetailsData().subscribe(
      (data) => {
        this.harvestGetData = data;
      },
      (error) => {

      }
    );

    this.harvestStageDetailsForm.controls.cropGroupName.valueChanges.subscribe(res => {
      if (res) {
        const corpName = this.harvestGetData.CropGroups.filter(a => a.CropGroupCode === res)[0];
        if (corpName) {
          this.cropNameList = this.harvestGetData.Crops.filter(a => a.CropGroupCode === res);
        } else {
          this.cropNameList = [];
        }
      }
    });

    this.harvestStageDetailsForm.controls.daysTo.valueChanges.subscribe(res => {
      if (res && !isNaN(res) && this.harvestStageDetailsForm.controls.daysTo.valid) {
        const daysFrom = +this.harvestStageDetailsForm.controls.daysAfterSowingFrom.value;
        if (!isNaN(daysFrom) && res) {
          if (daysFrom > +res) {
            this.showDateToError = true;
          } else {
            this.showDateToError = false;
          }
        } else {
          this.showDateToError = false;
        }
      } else {
        this.showDateToError = false;
      }
    });


    this.harvestStageDetailsForm.controls.daysAfterSowingFrom.valueChanges.subscribe(res => {
      if (res && !isNaN(res) && this.harvestStageDetailsForm.controls.daysAfterSowingFrom.valid) {
        if (this.harvestGridsObject && this.harvestGridsObject.length > 0) {
          const anyGreater = this.harvestGridsObject.filter(a => (+a.daysTo > +res && +a.daysTo > 0))[0];
          if (anyGreater) {
            this.showDateFromError = true;
          } else {
            const anyGreaterWithNull = this.harvestGridsObject.filter(a => (+a.daysAfterSowingFrom > +res && !a.daysTo))[0];
            if (anyGreaterWithNull) {
              this.showDateFromError = true;
            } else {
              this.showDateFromError = false;
            }

          }
        }
        const dayTo = this.harvestStageDetailsForm.controls.daysTo.value;
        if (!isNaN(dayTo) && dayTo) {
          if (+dayTo < +res) {
            this.showDateToError = true;
          } else {
            this.showDateToError = false;
          }
        } else {
          this.showDateToError = false;
        }
      } else {
        this.showDateToError = false;
      }
    });

  }

  cropNameSelectionChanged() {
    this.effectiveDateList = [];
    this.service.GetEffectiveDateList(this.harvestStageDetailsForm.controls.cropName.value).subscribe(
      (data) => {
        this.isLoading = false;
        this.effectiveDateList = data;
      },
      (error) => {
        this.isLoading = false;
        this.alertService.error('There is some error while prococessing your request. Please try again.');
      }
    );
  }

  effectiveDateSelectionChanged() {
    this.service.GetHarvestStageDetails(this.harvestStageDetailsForm.controls.effectiveDate.value).subscribe(
      (data) => {
        this.isLoading = false;
        this.setHarvestStageDetails(data);
      },
      (error) => {
        this.isLoading = false;
        this.alertService.error('There is some error while prococessing your request. Please try again.');
      }
    );
  }

  createForm() {
    try {
      this.harvestStageDetailsForm = this.formBuilder.group({
        dateOfEntry: ['', Validators.required],
        enteredBy: ['', Validators.required],
        cropGroupName: ['', Validators.required],
        cropName: ['', Validators.required],
        effectiveDate: ['', Validators.required],
        cropPhaseName: ['', Validators.required],
        daysAfterSowingFrom: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        daysTo: ['', [Validators.pattern(/^[0-9]*$/)]],
        harvestDetails: ['', Validators.required],
        hbomDivisionFor: ['']
      });
      this.harvestStageDetailsForm.disable();
    } catch (error) {
      console.log(error);
    }
  }

  get f() { return this.harvestStageDetailsForm.controls; }

  Modify() {
    try {
      this.enableNewHarvest = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
      this.isFindMode = false;
      this.isModifyMode = true;
      this.showEffectiveDateDDL = true;
      this.harvestStageDetailsForm.controls.cropGroupName.enable();
      this.harvestStageDetailsForm.controls.cropName.enable();
      this.harvestStageDetailsForm.controls.effectiveDate.enable();
      this.cropGroupNameField.focus();
      this.harvestStageDetailsForm.controls.enteredBy.setValue(this.employeeName);
      this.harvestStageDetailsForm.controls.enteredBy.disable();
    } catch (error) {

    }
  }

  updateHarvestStage() {
    try {
      this.harvestGridsObject.find(a => a.id === this.stockToBeModified.id).cropPhaseName
        = this.harvestStageDetailsForm.controls.cropPhaseName.value;
      this.harvestGridsObject.find(a => a.id === this.stockToBeModified.id).daysAfterSowingFrom
        = this.harvestStageDetailsForm.controls.daysAfterSowingFrom.value;
      this.harvestGridsObject.find(a => a.id === this.stockToBeModified.id).daysTo
        = this.harvestStageDetailsForm.controls.daysTo.value;
      this.harvestGridsObject.find(a => a.id === this.stockToBeModified.id).harvestDetails
        = this.harvestStageDetailsForm.controls.harvestDetails.value;
      this.harvestStageDetailsForm.controls.cropPhaseName.reset();
      this.harvestStageDetailsForm.controls.daysAfterSowingFrom.reset();
      this.harvestStageDetailsForm.controls.daysTo.reset();
      this.harvestStageDetailsForm.controls.harvestDetails.reset();
    } catch (error) {
      console.log(error);
    }
  }

  RowSelected(RowId: any, model: any) {
    this.SelectedRowId = RowId;
    this.IsRowSelected = true;
    this.stockToBeModified = model;
    this.isModifyGrid = true;

    const data = this.harvestGridsObject.filter(a => a.id === this.stockToBeModified.id).pop();
    this.harvestStageDetailsForm.controls.cropPhaseName.setValue(data.cropPhaseName);
    this.harvestStageDetailsForm.controls.daysAfterSowingFrom.setValue(data.daysAfterSowingFrom);
    this.harvestStageDetailsForm.controls.daysTo.setValue(data.daysTo);
    this.harvestStageDetailsForm.controls.harvestDetails.setValue(data.harvestDetails);

    if (!this.isFindMode) {
      this.harvestStageDetailsForm.controls.cropPhaseName.enable();
      this.harvestStageDetailsForm.controls.daysAfterSowingFrom.enable();
      this.harvestStageDetailsForm.controls.daysTo.enable();
      this.harvestStageDetailsForm.controls.harvestDetails.enable();
      this.cropPhaseName.nativeElement.focus();
    }
  }

  reset() {
    this.harvestStageDetailsForm.reset();
    this.harvestStageDetailsForm.disable();
    this.harvestStageDetailsForm.controls.enteredBy.setValue(this.employeeName);
    this.harvestStageDetailsForm.controls.enteredBy.disable();
    this.isHarvestDataExist = false;
    this.harvestGridsObject = [];
    this.effectiveDateList = [];
    this.isModifyMode = false;
    this.IsRowSelected = false;
    this.enableNewHarvest = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.isFindMode = false;
    this.isNewHarvestDetailMode = false;
    this.showDuplicateError = false;
    this.showDateToError = false;
    this.showDateFromError = false;
    this.showEffectiveDateDDL = false;
    this.harvestStageDetailsModel = new HarvestStageDetailsData();
  }

  newHarvestDetails() {
    try {
      this.harvestStageDetailsForm.enable();
      setTimeout(() => {
        this.dateOfEntry.nativeElement.focus();
      }, 100);
      this.harvestStageDetailsForm.controls.enteredBy.setValue(this.employeeName);
      this.harvestStageDetailsForm.controls.enteredBy.disable();
      this.harvestStageDetailsForm.controls.dateOfEntry.setValue(new Date());
      this.harvestStageDetailsForm.controls.hbomDivisionFor.setValue(this.defaultPackageOfPractice);
      this.enableNewHarvest = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
      this.isNewHarvestDetailMode = true;
    } catch (error) {

    }
  }

  blurCropPhraseName() {
    try {
      let isExist = false;
      if (this.stockToBeModified) {
        isExist = this.harvestGridsObject.filter(a => a.cropPhaseName.toLowerCase().trim() ===
          this.harvestStageDetailsForm.controls.cropPhaseName.value.toLowerCase().trim() && a.id !== this.stockToBeModified.id).length > 0;
      } else {
        isExist = this.harvestGridsObject.filter(a => a.cropPhaseName.toLowerCase().trim() ===
          this.harvestStageDetailsForm.controls.cropPhaseName.value.toLowerCase().trim()).length > 0;
      }

      if (isExist) {
        this.showDuplicateError = true;
      } else {
        this.showDuplicateError = false;
      }
    } catch (error) {

    }
  }

  pushHarvestStage() {
    try {
      this.submitted = true;

      if (this.harvestStageDetailsForm.invalid || this.showDateToError || this.showDateFromError) {
        return;
      }
      this.submitted = false;
      this.isHarvestDataExist = true;

      this.blurCropPhraseName();
      if (this.showDuplicateError) {
        this.saveFocus.nativeElement.focus();
        return;
      }

      if (this.isModifyGrid) {
        this.updateHarvestStage();
      } else {
        const detail = new HarvestStageDetailsModel();
        detail.id = 0;
        detail.cropPhaseName = this.harvestStageDetailsForm.controls.cropPhaseName.value;
        detail.daysAfterSowingFrom = this.harvestStageDetailsForm.controls.daysAfterSowingFrom.value;
        detail.daysTo = this.harvestStageDetailsForm.controls.daysTo.value;
        detail.harvestDetails = this.harvestStageDetailsForm.controls.harvestDetails.value;
        this.harvestGridsObject.push(detail);
      }
      this.SelectedRowId = null;
      this.IsRowSelected = false;
      this.stockToBeModified = null;
      this.isModifyGrid = false;

      if (!this.isModifyMode) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more items?'
        });

        dialogRef.afterClosed().subscribe(result => {
          this.harvestStageDetailsForm.controls.cropPhaseName.reset();
          this.harvestStageDetailsForm.controls.daysAfterSowingFrom.reset();
          this.harvestStageDetailsForm.controls.daysTo.reset();
          this.harvestStageDetailsForm.controls.harvestDetails.reset();
          //this.harvestStageDetailsForm.controls.hbomDivisionFor.setValue(this.defaultPackageOfPractice); 
          if (result) {
            setTimeout(() => {
              this.cropPhaseName.nativeElement.focus();
            }, 100);
          } else {
            this.harvestStageDetailsForm.controls.cropPhaseName.disable();
            this.harvestStageDetailsForm.controls.daysAfterSowingFrom.disable();
            this.harvestStageDetailsForm.controls.daysTo.disable();
            this.harvestStageDetailsForm.controls.harvestDetails.disable();
            setTimeout(() => {
              this.saveFocus.nativeElement.focus();
            }, 100);
          }
        });
      } else {
        this.harvestStageDetailsForm.controls.cropPhaseName.disable();
        this.harvestStageDetailsForm.controls.daysAfterSowingFrom.disable();
        this.harvestStageDetailsForm.controls.daysTo.disable();
        this.harvestStageDetailsForm.controls.harvestDetails.disable();
      }
    } catch (error) {
      console.log(error);
    }
  }

  getHarvestDetails() {
    try {

      const harvestStageDetails = new HarvestStageDetailsData();
      harvestStageDetails.harvestStageMaster = new HarvestStageMasterModel();
      harvestStageDetails.harvestStageDetails = [];

      if (this.harvestStageDetailsModel && this.harvestStageDetailsModel.harvestStageMaster && this.harvestStageDetailsModel.harvestStageMaster.id > 0) {
        harvestStageDetails.harvestStageMaster.id = this.harvestStageDetailsModel.harvestStageMaster.id;
      } else {
        harvestStageDetails.harvestStageMaster.id = 0;
      }
      harvestStageDetails.harvestStageMaster.dateOfEntry = this.harvestStageDetailsForm.controls.dateOfEntry.value;
      harvestStageDetails.harvestStageMaster.enteredBy = this.employeeId;
      harvestStageDetails.harvestStageMaster.cropGroupName = this.harvestStageDetailsForm.controls.cropGroupName.value;
      harvestStageDetails.harvestStageMaster.cropName = this.harvestStageDetailsForm.controls.cropName.value;
      harvestStageDetails.harvestStageMaster.effectiveDate = this.harvestStageDetailsForm.controls.effectiveDate.value;
      harvestStageDetails.harvestStageMaster.hbomDivisionFor = this.harvestStageDetailsForm.controls.hbomDivisionFor.value;

      harvestStageDetails.harvestStageDetails = this.harvestGridsObject;
      return harvestStageDetails;
    } catch (error) {
    }
  }

  setHarvestStageDetails(data: HarvestStageDetailsData) {
    this.harvestStageDetailsForm.controls.dateOfEntry.setValue(data.harvestStageMaster.dateOfEntry);
    this.harvestStageDetailsForm.controls.cropGroupName.setValue(data.harvestStageMaster.cropGroupName);
    this.harvestStageDetailsForm.controls.cropName.setValue(data.harvestStageMaster.cropName);
    this.harvestStageDetailsForm.controls.effectiveDate.setValue(data.harvestStageMaster.effectiveDate);
    this.harvestStageDetailsForm.controls.hbomDivisionFor.setValue(data.harvestStageMaster.hbomDivisionFor);
    this.harvestStageDetailsForm.controls.enteredBy.disable();

    this.harvestStageDetailsModel = data;

    this.harvestGridsObject = data.harvestStageDetails;
    this.showEffectiveDateDDL = false;
    this.harvestStageDetailsForm.controls.hbomDivisionFor.enable();
    if (this.isFindMode) {
      this.harvestStageDetailsForm.disable();
    }
  }

  submitForm() {
    try {
      if (this.isModifyGrid) {
        this.pushHarvestStage();
      }
      this.submitted = false;
      this.isLoading = true;
      const harvestDetails = this.getHarvestDetails();

      this.service.PostHarvestStageData(harvestDetails).subscribe(
        (data) => {
          this.isLoading = false;
          this.submitted = false;
          if (data.ResponseMessage === 'More than 1 entry for same crop phase name' ||
            data.ResponseMessage === 'Record already exists with same crop phase name') {
            this.alertService.error('More than 1 entry for same crop phase name.');
            this.reset();
            return;
          }
          // console.log(data);
          this.reset();
          this.alertService.success('Your harvest stage details added successfully.');
        },
        (error) => {
          this.isLoading = false;
          this.submitted = false;
          this.alertService.error('There is some error while prococessing your request. Please try again.');
        }
      );
    } catch (error) {

    }
  }

  find() {
    try {
      this.enableNewHarvest = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.isFindMode = true;
      this.showEffectiveDateDDL = true;
      this.harvestStageDetailsForm.controls.cropGroupName.enable();
      this.harvestStageDetailsForm.controls.cropName.enable();
      this.harvestStageDetailsForm.controls.effectiveDate.enable();
      this.cropGroupNameField.focus();
      this.harvestStageDetailsForm.controls.enteredBy.setValue(this.employeeName);
      this.harvestStageDetailsForm.controls.enteredBy.disable();
    } catch (error) {

    }
  }
}

