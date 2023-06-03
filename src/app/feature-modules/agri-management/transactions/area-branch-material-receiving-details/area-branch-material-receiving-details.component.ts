import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AreaBranchMaterialReceivingDetailsService } from './area-branch-material-receiving-details.service';
import { DatePipe } from '@angular/common';
import { MaterialReceivablesList } from './area-branch-material-receiving-details.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY HH:mm:ss',
  },
  display: {
    dateInput: 'DD-MMM-YYYY hh:mm:ss',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-area-branch-material-receiving-details',
  templateUrl: './area-branch-material-receiving-details.component.html',
  styleUrls: ['./area-branch-material-receiving-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AreaBranchMaterialReceivingDetailsComponent implements OnInit {
  @ViewChild('areaID', { static: false }) areaDropdown: any;
  @ViewChild('RMMaterialReceivedQuantity', { static: false }) RMMaterialReceivedQuantity: any;
  @ViewChild('MRExpensesPaid', { static: false }) MRExpensesPaid: any;
  areaDetailsForm: FormGroup;
  areaCodesList: any[];
  materialReceivablesCols: any[];
  materialReceivablesList: MaterialReceivablesList[];
  materialReceivablesSaveList: MaterialReceivablesList[] = [];
  disableOtherControls = true;
  schemeCode = '';
  matClickd = false;
  saveDisabled = true;
  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder, private datePipe: DatePipe,
    private areaService: AreaBranchMaterialReceivingDetailsService) { }

  ngOnInit() {
    this.createForm();
    this.initData();
    this.setAreaMRNo();
    this.areaDetailsForm.disable();
  }
  initData() {

    this.materialReceivablesCols = [
      { field: '', header: 'Sl. No.', style: { width: '62px' } },
      { field: '', header: 'Select', style: { width: '52px' } },
      { field: '', header: 'Desp. Date / OGP No', style: { width: '140px' } },
      { field: '', header: 'Driver Name / Contact No', style: { width: '180px' } },
      { field: '', header: 'Material Group / Name', style: { width: '160px' } },
      { field: '', header: 'Desp. Qty / UOM', style: { width: '140px' } },
      { field: '', header: 'Recd. Qty', style: { width: '90px', 'text-align': 'right' } },
      { field: '', header: 'Short / Damage', style: { width: '110px', 'text-align': 'right' } },
    ];

    this.bindAreaCodesDropdown();
  }

  createForm = () => {
    try {

      this.areaDetailsForm = this.formBuilder.group({
        AreaID: ['', [Validators.required]],
        RMTransferNo: ['', [Validators.required]],
        OGPNO: ['', [Validators.required]],
        // CropSchemeCode: ['', [Validators.required]],
        PSNumber: ['', [Validators.required]],
        AreaMRDate: [new Date(), [Validators.required]],
        AreaMRNo: ['', [Validators.required]],
        AreaMRNNoVisible: new FormControl({ value: 'MRN', disabled: true }, [Validators.required, Validators.maxLength(30)]),
        MRExpensesPaid: ['', [Validators.required, Validators.maxLength(8), Validators.pattern(/^[0-9]{1,8}$/)]],
        MRRemarks: ['', [Validators.maxLength(300)]],
        RawMaterialGroup: new FormControl({ value: '', disabled: true }),
        RawMaterialDetailsName: new FormControl({ value: '', disabled: true }),
        RMMaterialTransferQty: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^[0-9]{1,13}(\.[0-9]{1,3})?$/)]),
        RMMaterialReceivedQuantity: ['', [Validators.required, Validators.pattern(/^[0-9]{1,13}(\.[0-9]{1,3})?$/)]],
        MRShortfallDamageQty: ['', [Validators.required, Validators.pattern(/^[0-9]{1,13}(\.[0-9]{1,3})?$/)]],
        SeasonFromToDate: new FormControl({ value: '', disabled: true }),
        AreaBranchIncharge: new FormControl({ value: '', disabled: true })
      });

    } catch (error) {
      this.alertService.error('Error while creating areaDetailsForm! - ' + error);
    }
  }

  bindAreaCodesDropdown() {
    // console.log('areacodebinding dropsown');
    this.areaService.getAreaCode().subscribe((data: any) => {
      // console.log(data);
      this.areaCodesList = data;
    }, error => {
      this.alertService.error('Error while getting Area Codes dropdown! - ' + error);
    });
  }

  areaChange(event) {
    try {
      // console.log(event);
      this.areaDetailsForm.controls.AreaID.setValue(event.value);
      this.bindMaterialReceivablesList(event.value);
      this.setAreaMRNNoVisible();
      this.materialReceivablesSaveList = [];
    } catch (error) {
      this.alertService.error('Error while area change! - ' + error);
    }
  }

  materialAcceptanceClick() {
    this.matClickd = true;
    this.areaDetailsForm.enable();
    this.disableOtherControls = false;
    this.disableAutoFillControls();
  }

  disableAutoFillControls() {
    this.areaDetailsForm.controls.SeasonFromToDate.disable();
    this.areaDetailsForm.controls.AreaBranchIncharge.disable();
    this.areaDetailsForm.controls.AreaMRNNoVisible.disable();
    this.areaDetailsForm.controls.RawMaterialDetailsName.disable();
    this.areaDetailsForm.controls.RawMaterialGroup.disable();
    this.areaDetailsForm.controls.RMMaterialTransferQty.disable();
    this.areaDropdown._elementRef.nativeElement.focus();
  }

  bindMaterialReceivablesList(areaId) {
    try {
      this.areaService.getGridData(areaId).subscribe((data: any) => {
        // console.log(data);
        if (data.IsSucceed) {
          this.materialReceivablesList = data.Data;
          this.materialReceivablesList.map(m => m.IsSelected = false);
          this.materialReceivablesList.forEach((element, index) => {
            element.rowIndex = index + 1;
          });
        }
        // console.log(this.materialReceivablesList);
      }, error => {
        this.alertService.error('Error while binding grid data! - ' + error);
      });

    } catch (error) {
      this.alertService.error('Error while bind Material Receivable grid! - ' + error);
    }
  }

  materialReceivablesSelect(event, item: MaterialReceivablesList) {
    try {
      const result = this.materialReceivablesSaveList.filter(m => m.OGPNo === item.OGPNo);
      // console.log('filtered', result);
      if (this.materialReceivablesSaveList.length > 0 && (!result || result.length === 0)) {
        // this.materialReceivablesList.map(m => m.IsSelected = false);
        event.target.checked = false;
        this.alertService.warning('Please save the updated rows firsts before select other OGP No!');
        return false;
      }
      this.areaDetailsForm.controls.RMTransferNo.setValue(item.RMTransferNo);
      this.areaDetailsForm.controls.OGPNO.setValue(item.OGPNo);
      this.areaDetailsForm.controls.RawMaterialDetailsName.setValue(item.RawMaterialDetailsName);
      this.areaDetailsForm.controls.RawMaterialGroup.setValue(item.RawMaterialGroup);
      this.areaDetailsForm.controls.RMMaterialTransferQty.setValue(item.RMMaterialTransferQty + ' / '
        + item.RawMaterialUOM);
      this.areaDetailsForm.controls.RMMaterialReceivedQuantity.enable();
      this.areaDetailsForm.controls.MRShortfallDamageQty.enable();
      this.areaDetailsForm.controls.RMMaterialReceivedQuantity.setValue(item.RMMaterialReceivedQuantity);
      this.areaDetailsForm.controls.MRShortfallDamageQty.setValue(item.MRShortfallDamageQty);
      this.materialReceivablesList.map(m => m.IsSelected = false);
      item.IsSelected = true;
      this.schemeCode = item.CropSchemeCode;
      // this.materialReceivablesList[this.materialReceivablesList.indexOf(item)].IsSelected = true;

      this.getSeasonDatesDetails(this.areaDetailsForm.controls.AreaID.value, item.RMTransferNo);
      this.getAreaBranchInchargeDetails(this.areaDetailsForm.controls.AreaID.value, item.RMTransferNo);
      // console.log(this.materialReceivablesSaveList, this.materialReceivablesList);
      console.log(this.RMMaterialReceivedQuantity);
      if (this.materialReceivablesSaveList.length === 0) {
        this.MRExpensesPaid.nativeElement.focus();
      } else {
        this.RMMaterialReceivedQuantity.nativeElement.focus();
      }
    } catch (error) {
      this.alertService.error('Error while material Receivables row Select! - ' + error);
    }
  }

  getSeasonDatesDetails(areaId, RMTransferNo) {
    try {
      this.areaService.getSeasonDates(areaId, RMTransferNo).subscribe((data: any) => {
        // console.log(data);
        this.areaDetailsForm.controls.SeasonFromToDate.setValue(
          this.datePipe.transform(data[0].SeasonFromDate, 'dd-MMM-yyyy') +
          ' / ' +
          this.datePipe.transform(data[0].SeasonFromDate, 'dd-MMM-yyyy')
        );
        this.areaDetailsForm.controls.PSNumber.setValue(data[0].PSNumber);
      }, error => {
        this.alertService.error('Error while binding season dates! - ' + error);
      });
    } catch (error) {
      this.alertService.error('Error while binding season dates! - ' + error);
    }
  }

  getAreaBranchInchargeDetails(areaId, RMTransferNo) {
    try {
      this.areaService.getAreaBranchIncharge(areaId, RMTransferNo).subscribe((data: any) => {
        // console.log(data);
        this.areaDetailsForm.controls.AreaBranchIncharge.setValue(data[0].EmployeeName);
      }, error => {
        this.alertService.error('Error while binding incharge data! - ' + error);
      });
    } catch (error) {
      this.alertService.error('Error while bind incharge data! - ' + error);
    }
  }

  onReceivedDateSelect(event) {
    // console.log(event);
    this.setAreaMRNNoVisible();
  }

  setAreaMRNNoVisible() {
    const selectedArea = this.areaCodesList.filter(a =>
      a.areaId === this.areaDetailsForm.controls.AreaID.value);

    this.areaDetailsForm.controls.AreaMRNNoVisible.setValue(
      selectedArea[0].areaCode + '/MRN/' +
      this.areaDetailsForm.controls.AreaMRNo.value + '/' +
      this.datePipe.transform(this.areaDetailsForm.controls.AreaMRDate.value, 'dd-MMM-yyyy')
    );
  }

  setAreaMRNo() {
    try {
      this.areaService.getAreaMRNo().subscribe((data: any) => {
        // console.log(data);
        this.areaDetailsForm.controls.AreaMRNo.setValue(data);
      }, error => {
        this.alertService.error('Error while getting Area MR No! - ' + error);
      });
    } catch (error) {
      this.alertService.error('Error while getting Area MR No! - ' + error);
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.areaDetailsForm.controls).forEach(key => {
      this.areaDetailsForm.controls[key].markAsTouched();
    });
  }

  updateSelectedMaterialReceivableRow() {
    this.markFormGroupTouched();
    // console.log(this.orderDetailsForm);
    if (!this.areaDetailsForm.valid) {
      return false;
    }
    const RMMaterialReceivedQuantity = this.areaDetailsForm.controls.RMMaterialReceivedQuantity.value;
    const MRShortfallDamageQty = this.areaDetailsForm.controls.MRShortfallDamageQty.value;
    // this.materialReceivablesList.filter(f => f.IsSelected)
    //   .map(m => m.RMMaterialReceivedQuantity = RMMaterialReceivedQuantity)
    //   .map(m => m.MRShortfallDamageQty = MRShortfallDamageQty);
    const changedItem = this.materialReceivablesList.filter(f => f.IsSelected);
    changedItem[0].RMMaterialReceivedQuantity = RMMaterialReceivedQuantity;
    changedItem[0].MRShortfallDamageQty = MRShortfallDamageQty;
    // if (this.materialReceivablesSaveList.length === 0) {
    //   this.materialReceivablesSaveList.push(this.materialReceivablesList.filter(f => f.IsSelected)[0]);
    // }
    this.materialReceivablesSaveList = this.materialReceivablesSaveList.filter(f => f.rowIndex !== changedItem[0].rowIndex);
    this.materialReceivablesSaveList.push(changedItem[0]);
    this.areaDetailsForm.controls.RawMaterialDetailsName.setValue('');
    this.areaDetailsForm.controls.RawMaterialGroup.setValue('');
    this.areaDetailsForm.controls.RMMaterialTransferQty.setValue('');
    this.areaDetailsForm.controls.RMMaterialReceivedQuantity.setValue('');
    this.areaDetailsForm.controls.MRShortfallDamageQty.setValue('');
    this.areaDetailsForm.controls.RawMaterialDetailsName.disable();
    this.areaDetailsForm.controls.RawMaterialGroup.disable();
    this.areaDetailsForm.controls.RMMaterialTransferQty.disable();
    this.areaDetailsForm.controls.RMMaterialReceivedQuantity.disable();
    this.areaDetailsForm.controls.MRShortfallDamageQty.disable();
    console.log(this.materialReceivablesSaveList, changedItem);
    this.saveDisabled = false;
  }

  saveAreaBMRDetails() {
    this.markFormGroupTouched();
    // console.log(this.orderDetailsForm);
    if (!this.areaDetailsForm.valid) {
      return false;
    }

    this.saveDisabled = true;
    const payload = {
      AreaID: this.areaDetailsForm.controls.AreaID.value,
      RMTransferNo: this.areaDetailsForm.controls.RMTransferNo.value,
      OGPNO: this.areaDetailsForm.controls.OGPNO.value,
      CropSchemeCode: this.schemeCode,
      PSNumber: this.areaDetailsForm.controls.PSNumber.value,
      AreaMRDate: this.areaDetailsForm.controls.AreaMRDate.value,
      AreaMRNo: this.areaDetailsForm.controls.AreaMRNo.value,
      AreaMRNNoVisible: this.areaDetailsForm.controls.AreaMRNNoVisible.value,
      MRExpensesPaid: this.areaDetailsForm.controls.MRExpensesPaid.value,
      MRRemarks: this.areaDetailsForm.controls.MRRemarks.value,
      AreaMaterialReceivedDetails: []
    };
    this.materialReceivablesSaveList.forEach(element => {
      payload.AreaMaterialReceivedDetails.push({
        AreaMRNo: this.areaDetailsForm.controls.AreaMRNo.value,
        MRDetailsAGNo: 0,
        RawMaterialGroupCode: element.RawMaterialGroupCode,
        RawMaterialDetailsCode: element.RawMaterialDetailsCode,
        RMMaterialTransferQty: element.RMMaterialTransferQty,
        RMMaterialReceivedQuantity: element.RMMaterialReceivedQuantity,
        MRShortfallDamageQty: element.MRShortfallDamageQty
      });
    });
    try {
      this.areaService.saveAreaMRDetails(payload).subscribe((data: any) => {
        if (data.IsSucceed) {
          this.alertService.success('Material Received details entered Successfully');
          this.clearBtnClick();
        }
      }, error => {
        this.alertService.error('Error while saving Area MR Details! - ' + error);
      });
    } catch (error) {
      this.alertService.error('Error while saving Area MR Details! - ' + error);
    }
  }

  clearBtnClick() {
    Object.keys(this.areaDetailsForm.controls).forEach(key => {
      this.areaDetailsForm.controls[key].setValue('');
    });
    this.areaDetailsForm.reset();
    this.materialReceivablesSaveList = [];
    this.materialReceivablesList = [];
    this.setAreaMRNo();
    this.areaDetailsForm.controls.AreaMRDate.setValue(new Date());
    this.disableAutoFillControls();
    this.matClickd = false;
    this.saveDisabled = true;
  }
}
