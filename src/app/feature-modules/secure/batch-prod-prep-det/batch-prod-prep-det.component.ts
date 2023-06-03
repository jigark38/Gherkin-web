import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BatchProdPrepDetService } from './batch-prod-prep-det.service';

import {
  BatchScheduleDetailsForProd, BatchScheduleDummyProductionForProd, BatchScheduleGreensGRNDetailsForProd
} from './batch-prod-prep-det.component.model';

import { MatSelect } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/corecomponents/modal/modal.service';
import { Calendar } from 'primeng/calendar/calendar';
import { timer } from 'rxjs';
import moment from 'moment';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};
@Component({
  selector: 'app-batch-prod-prep-det',
  templateUrl: './batch-prod-prep-det.component.html',
  styleUrls: ['./batch-prod-prep-det.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})



export class BatchProdPrepDetComponent implements OnInit {
  @ViewChild('unitNameDDL', { static: false })      unitNameDDL       : MatSelect;
  @ViewChild('batchScheduleDDL', { static: false }) batchScheduleDDL  : MatSelect;
  @ViewChild('unitMediaDDL', { static: false })     unitMediaDDL      : MatSelect;
  
  ddlUnit: any = [];
  ddlMedia: any = [];
  ddlScheduledBy: any = [];
  ddlProductGroup: any = [];
  ddlProductName: any = [];
  ddlGrade: any = [];
  ddlPreseveredIn: any = [];

  tabIndex: number = 0;
  batchSchedule: string = "Scheduled Orders";
  mediaFilter: string = "";
  disableNext: boolean = true;
  disableModify: boolean = true;
  disableSave: boolean = true;
  checkedGreenRow: boolean = false;
  latestbatchNo: any;

  selectedProductName: any;
  selectedGradeSize: any;
  selectedQuantityPackIn: any;
  selectedProductQuantityUOM: any;
  selectedQuantitySum: any;
  showProductionDetailsRow: boolean;
  selectedDate: string;
  selectedOrgOfficeNo: number;
  batchScheduleGreensGRNDetailsForProdList: BatchScheduleGreensGRNDetailsForProd[] = [];
  batchProductionForm: FormGroup;


  constructor(private batchProdPrepDetService: BatchProdPrepDetService, private alertService: AlertService) { }
  greensRecievedDetails: any = [];
  ngOnInit() {
    this.createForm();
    this.onInit();
    this.generateBatchNo();
  }
  createForm() {
    try {


      this.batchProductionForm = new FormGroup({
        scheduledBy: new FormControl('', [Validators.required]),
        preservedIn: new FormControl('', [Validators.required]), // TODO
        batchNoOfMedia: new FormControl('', [Validators.required]),
        batchDate: new FormControl('', [Validators.required]),
        batchNo: new FormControl('', [Validators.required]),
        approximateBatchSize: new FormControl('', [Validators.required]),
        productionScheduleFor: new FormControl('', [Validators.required]),
        productGroup: new FormControl('', [Validators.required]),
        productName: new FormControl('', [Validators.required]),
        grade: new FormControl('', [Validators.required]),
        packUOM: new FormControl('KGS', [Validators.required]),
        quantityPackIn: new FormControl('', [Validators.required, Validators.pattern(/^\d{0,6}(\.\d{1,3})?/)]),
        quantityPackInNos: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        productQuantityUOM: new FormControl('', [Validators.required]),
        mediaDescription: new FormControl('', [Validators.required]),
      });
    }
    catch (error) {

    }
  }
  onInit() {
    this.showProductionDetailsRow = false;
    this.batchProdPrepDetService.GetOrgofficelocationDetails().subscribe(x => {
      this.ddlUnit = x;
    });
    this.batchProdPrepDetService.GetMediaProcess().subscribe(x => {
      this.ddlMedia = x;
      this.ddlPreseveredIn = x;
    });
    this.batchProdPrepDetService.GetScheduledBy().subscribe(x => {
      this.ddlScheduledBy = x;
    });
    this.batchProdPrepDetService.GetProductGroup().subscribe(x => {
      this.ddlProductGroup = x;
    });

  }

  ddlProductGroupChange() {
    this.batchProdPrepDetService.GetProductName(this.batchProductionForm.controls.productGroup.value).subscribe(x => {
      this.ddlProductName = x;
    });
  }

  ddlProductNameChange() {

    this.batchProdPrepDetService.GetGrade(this.batchProductionForm.controls.productName.value).subscribe(x => {
      this.ddlGrade = x;
    });
  }

  blurmediaDescription() {
    this.disableSave = false;
  }

  unitSelected(event): void {
    //if (!event.target.value) {
    //  return;
    //}

    if (event) {
      this.selectedOrgOfficeNo = event.value;
      this.batchProdPrepDetService.GetGreenReceivedByOrgOfficeNo(event.value).subscribe(x => {
        this.greensRecievedDetails = x;
      });
    }
  }

  greenDetailsSelected(event): void {
    let oneValuechecked = this.greensRecievedDetails.some(e => e.isSelected == true);
    if (oneValuechecked!=true) {
      this.disableNext = true;
    }
    else {
      if (this.batchSchedule == "Dummy Batch") {
        this.disableNext = false;
      }
    }
  }

  batchScheduleSelected(event): void {
    this.batchSchedule = event.value;
    if (event.value == "Dummy Batch") {
      let oneValuechecked = this.greensRecievedDetails.some(e => e.isSelected == true);
      if (oneValuechecked) {
        this.disableNext = false;
      }
      else {
        this.disableNext = true;
      }
    }
    else {
      this.disableNext = true;
    }

  }

  mediaSelected(event): void {
    // if (event) {
    //   this.batchProdPrepDetService.GetGreenReceivedByOrgOfficeNo(event.target['value']).subscribe(x => {
    //     this.greensRecievedDetails = x;
    //   });
    // }
  }

  onTabChange(e) {
    this.tabIndex = e.index;
  }


  next() {
    try {

      this.tabIndex = 1;
     
      this.calculateTotalQuantitySelected();

    } catch (error) {

    }
  }

  calculateTotalQuantitySelected() {
    try {
      let totalQuantity = 0;
      for (let i = 0; i < this.greensRecievedDetails.length; i++) {
        if (this.greensRecievedDetails[i].isSelected == true) {
          if (totalQuantity == 0) {
            if (this.greensRecievedDetails[i].QuantityAfterGradingTotal != null) {
              totalQuantity = parseInt(this.greensRecievedDetails[i].QuantityAfterGradingTotal.toString());
            }
          }
          else {
            if (this.greensRecievedDetails[i].QuantityAfterGradingTotal != null) {
              totalQuantity = totalQuantity + parseInt(this.greensRecievedDetails[i].QuantityAfterGradingTotal.toString());
            }
          }
        }
      }
      this.selectedQuantitySum = totalQuantity;

      this.batchProductionForm.patchValue({
        approximateBatchSize: this.selectedQuantitySum
      });
    }
    catch (error) {
      console.log("Error from calculateTotalQuantitySelected");
    }
  }

  batchNoChange(value) {
    let batchString = "";
    var strDate = new Date();
    var shortYear = strDate.getFullYear();
    var twoDigitYear = shortYear.toString().substr(-2);

    if (this.latestbatchNo == 0) {
      this.latestbatchNo = 1;
    }
    else {
      this.latestbatchNo = parseInt(this.latestbatchNo) + 1;
    }
    batchString = twoDigitYear + " " + value + "-" + this.latestbatchNo;

    this.batchProductionForm.patchValue({
      batchNo: batchString
    });
  }

  clear() {

   
    this.unitNameDDL.writeValue(null);
    this.batchScheduleDDL.writeValue(null);
    this.unitMediaDDL.writeValue(null);

    this.greensRecievedDetails = [];
    this.disableSave = true;
    this.createForm();
    this.showProductionDetailsRow = false;
    //this.onInit();
    this.generateBatchNo();

    this.tabIndex= 0;
    this.batchSchedule= "Scheduled Orders";
    this.mediaFilter= "";
    this.disableNext= true;
    this.disableModify = true;
    this.disableSave= true;
    this.checkedGreenRow= false;
    this.latestbatchNo=0;

    this.selectedProductName = null;
    this.selectedGradeSize = null;
    this.selectedQuantityPackIn = null;
    this.selectedProductQuantityUOM = null;
    this.selectedQuantitySum = null;
    this.showProductionDetailsRow = false;
    this.selectedDate = "";
    this.selectedOrgOfficeNo = 0;
    this.batchScheduleGreensGRNDetailsForProdList = [];

  }

  generateBatchNo() {
    this.batchProdPrepDetService.GetLatestbatchNo().subscribe(res => {
      this.latestbatchNo = res;
      
    });
  }

  calculatUOM() {
    try {
      let packIN = this.batchProductionForm.controls.quantityPackIn.value;
      let packINNos = this.batchProductionForm.controls.quantityPackInNos.value;
      let result = parseFloat((parseFloat(packIN.toString()) * parseInt(packINNos.toString())).toString());

      //console.log(result);
      this.batchProductionForm.patchValue({
        productQuantityUOM: result,
        approximateBatchSize: this.selectedQuantitySum
      });

      this.setPendingProductionScheduledetailsValue();
    }
    catch (error) {

    }

  }

  setPendingProductionScheduledetailsValue() {
    try {
      this.showProductionDetailsRow = true;

      let productName = this.ddlProductName.findIndex(e => e.varietyCode == this.batchProductionForm.controls.productName.value);
      let grade = this.ddlGrade.findIndex(e => e.gradeCode == this.batchProductionForm.controls.grade.value);

      this.selectedProductName = this.ddlProductName[productName].varietyName;
      this.selectedGradeSize = this.ddlGrade[grade].gradeFrom + " " + this.ddlGrade[grade].gradeTo;
      this.selectedQuantityPackIn = this.batchProductionForm.controls.quantityPackInNos.value;
      this.selectedProductQuantityUOM = this.batchProductionForm.controls.productQuantityUOM.value;
    }
    catch (error) {

    }


  }

  updatemediaBatchProductionDate(dateObject) {
    var dateToDB = moment(dateObject.value).format("YYYY-MM-DD");
    this.selectedDate = dateToDB.toString();
  }

  getBatchScheduleDetails(): BatchScheduleDetailsForProd {
    try {
      if (this.batchProductionForm.valid) {
        const batchScheduleDetails: BatchScheduleDetailsForProd = new Object() as BatchScheduleDetailsForProd;

        batchScheduleDetails.orgofficeNo = this.selectedOrgOfficeNo;
        batchScheduleDetails.employeeID = this.batchProductionForm.controls.scheduledBy.value;
        batchScheduleDetails.mediaProcessCode = this.batchProductionForm.controls.preservedIn.value;
        batchScheduleDetails.batchProductionProcessIdentity = this.batchProductionForm.controls.batchNoOfMedia.value;
        batchScheduleDetails.batchProductionDate = new Date(this.selectedDate);
        //batchScheduleDetails.batchProductionNo: number;
        batchScheduleDetails.batchProductionProcesswise = this.batchProductionForm.controls.batchNo.value;
        batchScheduleDetails.batchSizeApprox = this.batchProductionForm.controls.approximateBatchSize.value;
        batchScheduleDetails.pSThroughDetails = this.batchProductionForm.controls.productionScheduleFor.value;
        batchScheduleDetails.mediaProcessDescRemarks = this.batchProductionForm.controls.mediaDescription.value;


        return batchScheduleDetails;
      }
      else {
        return null;
      }
    }
    catch (error) {

    }
  }

  getBatchScheduleDummyProduction(): BatchScheduleDummyProductionForProd {
    try {
      if (this.batchProductionForm.valid) {
        const batchScheduleDummyProduction: BatchScheduleDummyProductionForProd = new Object() as BatchScheduleDummyProductionForProd;


        batchScheduleDummyProduction.fPVarietyCode = this.batchProductionForm.controls.productName.value;
        batchScheduleDummyProduction.fPGradeCode = this.batchProductionForm.controls.grade.value;
        batchScheduleDummyProduction.packUOM = this.batchProductionForm.controls.packUOM.value;
        batchScheduleDummyProduction.qtyDrum = this.batchProductionForm.controls.quantityPackIn.value;
        batchScheduleDummyProduction.pSQuantity = this.batchProductionForm.controls.quantityPackInNos.value;
        batchScheduleDummyProduction.pSQtyUOM = this.batchProductionForm.controls.productQuantityUOM.value;
        batchScheduleDummyProduction.fPGroupCode = this.batchProductionForm.controls.productGroup.value;
        batchScheduleDummyProduction.mediaProcessDescRemarks = this.batchProductionForm.controls.mediaDescription.value;

        return batchScheduleDummyProduction;
      }
      else {
        return null;
      }
    }
    catch (error) {

    }
  }

  setBatchScheduleGreensGRNDetailsForProduction() {
    try {
      if (this.batchProductionForm.valid) {
        for (let i = 0; i < this.greensRecievedDetails.length; i++) {
          if (this.greensRecievedDetails[i].isSelected == true) {
            let object = new BatchScheduleGreensGRNDetailsForProd();

            object.harvestGRNNo = this.greensRecievedDetails[i].harvestGRNNo;
            object.greensGradeQtyNo = this.greensRecievedDetails[i].GreensGradingQtyNo;
            object.cropNameCode = this.greensRecievedDetails[i].cropCode;
            object.cropSchemeCode = this.greensRecievedDetails[i].CropSchemeCode;
            object.bSGradingQuantity = this.greensRecievedDetails[i].QuantityAfterGradingTotal;
            this.batchScheduleGreensGRNDetailsForProdList.push(object);
          }
        }
        return true;
      }
      else {
        return false;
      }
    }
    catch (error) {

    }
  }

  save() {

    try {
      let status = this.setBatchScheduleGreensGRNDetailsForProduction();
      if (status == true) {
        const batchScheduleDetails: BatchScheduleDetailsForProd = this.getBatchScheduleDetails();
        const batchScheduleDummyProduction: BatchScheduleDummyProductionForProd = this.getBatchScheduleDummyProduction();

        let batchDetails = {
          batchScheduleDetails: batchScheduleDetails,
          batchScheduleDummyProduction: batchScheduleDummyProduction,
          batchScheduleGreensGRNDetails: this.batchScheduleGreensGRNDetailsForProdList
        }

        this.batchProdPrepDetService.SaveProductionBatchDetails(batchDetails).subscribe(res => {
         
          if (res.IsSucceed == true) {
            if (res.Data.status == "Success") {
              this.showSuccess();
              this.clear();
            }
            else {
              this.showError();
            }
          }
          else {
            this.showError();
          }
        });
        
      }

    }
    catch (error) {
      this.showError();
    }
  }

  showSuccess() {
    this.alertService.success('Production Batch preparation Details Added Successfully');
  }
  showError() {
    this.alertService.error('Error in adding the details.');
  }


}
