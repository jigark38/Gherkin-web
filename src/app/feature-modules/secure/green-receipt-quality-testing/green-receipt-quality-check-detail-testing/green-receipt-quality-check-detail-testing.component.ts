import { forkJoin } from 'rxjs';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GreenReceptionQualityCheck, GreenReceptionQualityDetails } from '../green-receipt-quality-testing';
import { GreenReceiptQualityTestingService } from '../green-receipt-quality-testing.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { Output, EventEmitter } from '@angular/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY HH:MM',
  },
  display: {
    dateInput: 'DD-MMM-YYYY HH:MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-green-receipt-quality-check-detail-testing',
  templateUrl: './green-receipt-quality-check-detail-testing.component.html',
  styleUrls: ['./green-receipt-quality-check-detail-testing.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    MessageService
  ],
})
export class GreenReceiptQualityCheckDetailTestingComponent implements OnInit, OnChanges {
  greenQualityCheckDetailsForm: FormGroup;
  greenQualityInspectionDetailsForm: FormGroup;
  greenReceptionQualityCheck: GreenReceptionQualityCheck = new GreenReceptionQualityCheck();
  greenReceptionQualityDetails: GreenReceptionQualityDetails = new GreenReceptionQualityDetails();
  @Input() inwardGridSelectedRowData: any;
  @Input() OrgOfficeNo: any;
  @Input() greenRecpDetailsGridSelectedRowData: any;
  organisationUnitList: any;
  areasList: any;
  cropsList: any;
  employeesList: any;
  vehicalNo: any;
  harvestGrnDate: any;
  @Output() isSucess = new EventEmitter(); 

  constructor(private formBuilder: FormBuilder, private greenReceiptQualityTestingService: GreenReceiptQualityTestingService,
    // tslint:disable-next-line:align
    private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();

  }

  getCommonServices() {
    forkJoin(this.greenReceiptQualityTestingService.getAllUnit(), this.greenReceiptQualityTestingService.getAllAreas(),
      this.greenReceiptQualityTestingService.getAllCrops(), this.greenReceiptQualityTestingService.getAllEmployees())
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.organisationUnitList = data[0];
          this.areasList = data[1];
          this.cropsList = data[2];
          this.employeesList = data[3];
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.greenRecpDetailsGridSelectedRowData) {
      this.bindFormControls();
    } else {
      this.clearForm();
    }
  }

  clearForm() {
    this.createForm();
    this.harvestGrnDate = this.vehicalNo = null;
  }
  createForm() {
    // this.greenReceptionQualityCheck = new GreenReceptionQualityCheck();
    // this.greenReceptionQualityDetails = new GreenReceptionQualityDetails();
    this.greenQualityCheckDetailsForm = this.formBuilder.group({
      ...this.greenReceptionQualityCheck
    });
    this.greenQualityCheckDetailsForm.controls.greensRecvSampleQty.setValidators([Validators.required, Validators.pattern(/^[0-9]{0,4}$/)]);
    // this.greenQualityCheckDetailsForm.controls.greensRecvTrunkCondition.setValidators([Validators.required]);
    // this.greenQualityCheckDetailsForm.controls.greensCheckedEmployeeId.setValidators([Validators.required]);
    // this.greenQualityCheckDetailsForm.controls.greensRecvAGNo.setValidators([Validators.required]);
    // this.greenQualityCheckDetailsForm.controls.greensRecvRemarks.setValidators([Validators.required]);

    this.greenQualityInspectionDetailsForm = this.formBuilder.group({
      ...this.greenReceptionQualityDetails
    });
    // this.greenQualityInspectionDetailsForm.controls.borrerQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.borrerQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.ffQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.ffQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.softQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.softQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.fungusQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.fungusQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.stemsQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.stemsQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.virusQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.virusQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.flowersQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.flowersQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.muddyQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.muddyQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.peanutQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.peanutQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.calQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.calQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.endcorpQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.endcorpQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    this.greenQualityInspectionDetailsForm.controls.rottenQCUOM.setValidators([]);
    this.greenQualityInspectionDetailsForm.controls.rottenQCQty.setValidators([Validators.pattern(/^\d{0,3}(\.\d{0,3})?$/)]);
    // this.greenQualityCheckDetailsForm.get('orgofficeNo').disable({ onlySelf: true });
    // this.greenQualityCheckDetailsForm.get('areaId').disable({ onlySelf: true });
    // this.greenQualityCheckDetailsForm.get('harvestGRNNo').disable({ onlySelf: true });
    this.getCommonServices();
  }

  bindFormControls() {
    this.greenReceiptQualityTestingService.getQualityCheckAndInspection(
      this.greenRecpDetailsGridSelectedRowData.harvestGRNNo).subscribe(
        (data: any) => {
          if (data != null && data.greenReceptionQualityCheck != null && data.greenReceptionQualityDetails != null) {
            this.greenQualityCheckDetailsForm.patchValue({
              greenQualityCheckNo: data.greenReceptionQualityCheck.greenQualityCheckNo,
              orgofficeNo: data.greenReceptionQualityCheck.orgofficeNo,
              areaId: data.greenReceptionQualityCheck.areaId,
              harvestGRNNo: data.greenReceptionQualityCheck.harvestGRNNo,
              greensRecvSampleDate: data.greenReceptionQualityCheck.greensRecvSampleDate,
              greensRecvSampleQty: data.greenReceptionQualityCheck.greensRecvSampleQty,
              greensRecvTrunkCondition: data.greenReceptionQualityCheck.greensRecvTrunkCondition,
              greensCheckedEmployeeId: data.greenReceptionQualityCheck.greensCheckedEmployeeId.toString(),
              greensVerifiedEmployeeId: data.greenReceptionQualityCheck.greensVerifiedEmployeeId.toString(),
              greensRecvAGNo: data.greenReceptionQualityCheck.greensRecvAGNo,
              greensRecvRemarks: data.greenReceptionQualityCheck.greensRecvRemarks,
              harvestGrnDate: new Date(this.greenRecpDetailsGridSelectedRowData.harvestGrnValidDate)
            });
            this.greenQualityInspectionDetailsForm.patchValue({
              greensQCDetailsNo: data.greenReceptionQualityDetails.greensQCDetailsNo,
              greensQualityCheckNo: data.greenReceptionQualityDetails.greensQualityCheckNo,
              borrerQCUOM: data.greenReceptionQualityDetails.borrerQCUOM,
              borrerQCQty: data.greenReceptionQualityDetails.borrerQCQty,
              ffQCUOM: data.greenReceptionQualityDetails.ffQCUOM,
              ffQCQty: data.greenReceptionQualityDetails.ffQCQty,
              softQCUOM: data.greenReceptionQualityDetails.softQCUOM,
              softQCQty: data.greenReceptionQualityDetails.softQCQty,
              fungusQCUOM: data.greenReceptionQualityDetails.fungusQCUOM,
              fungusQCQty: data.greenReceptionQualityDetails.fungusQCQty,
              stemsQCUOM: data.greenReceptionQualityDetails.stemsQCUOM,
              stemsQCQty: data.greenReceptionQualityDetails.stemsQCQty,
              virusQCUOM: data.greenReceptionQualityDetails.virusQCUOM,
              virusQCQty: data.greenReceptionQualityDetails.virusQCQty,
              flowersQCUOM: data.greenReceptionQualityDetails.flowersQCUOM,
              flowersQCQty: data.greenReceptionQualityDetails.flowersQCQty,
              muddyQCUOM: data.greenReceptionQualityDetails.muddyQCUOM,
              muddyQCQty: data.greenReceptionQualityDetails.muddyQCQty,
              peanutQCUOM: data.greenReceptionQualityDetails.peanutQCUOM,
              peanutQCQty: data.greenReceptionQualityDetails.peanutQCQty,
              calQCUOM: data.greenReceptionQualityDetails.calQCUOM,
              calQCQty: data.greenReceptionQualityDetails.calQCQty,
              endcorpQCUOM: data.greenReceptionQualityDetails.endcorpQCUOM,
              endcorpQCQty: data.greenReceptionQualityDetails.endcorpQCQty,
              rottenQCUOM: data.greenReceptionQualityDetails.rottenQCUOM,
              rottenQCQty: data.greenReceptionQualityDetails.rottenQCQty
            });
          } else {
            this.greenQualityCheckDetailsForm.patchValue({
              orgofficeNo: +this.OrgOfficeNo,
              inwardGatePassNo: this.inwardGridSelectedRowData.inwardGatePassNo,
              areaId: this.greenRecpDetailsGridSelectedRowData.areaId,
              harvestGRNNo: this.greenRecpDetailsGridSelectedRowData.harvestGRNNo,
              greensRecvSampleDate: new Date(),
              harvestGrnDate: new Date(this.greenRecpDetailsGridSelectedRowData.harvestGrnValidDate)
            });
          }
          this.vehicalNo = this.inwardGridSelectedRowData.invVehicleNo;
          this.harvestGrnDate = this.greenRecpDetailsGridSelectedRowData.harvestGrnDate;
        });

  }

  saveFormData() { 
    if (this.greenQualityCheckDetailsForm.valid && this.greenQualityInspectionDetailsForm.valid) {
      const createQualityCheckAndInspection = {
        greenReceptionQualityCheck: this.greenQualityCheckDetailsForm.value,
        greenReceptionQualityDetails: this.greenQualityInspectionDetailsForm.value
      };
      this.greenReceiptQualityTestingService.createQualityCheckAndInspection(createQualityCheckAndInspection).subscribe((res: any) => {
        if (res) {
          if (createQualityCheckAndInspection.greenReceptionQualityCheck.greenQualityCheckNo > 0) {
            this.isSucess.emit(true); 
            this.alertService.success('Green Quality Check and Inspection Updated Successfully');
          } else {
            this.alertService.success('Green Quality Check and Inspection Created Successfully');
            this.isSucess.emit(true); 
          }
          this.clearForm();
        }
      });
    }
  }


}
