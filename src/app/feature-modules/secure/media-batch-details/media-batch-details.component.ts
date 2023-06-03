import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MediaBatchDetailsService } from './media-batch-details.component.service';
import {
  OfficeLocationDetails, MediaProcessDetails, PendingOrderdetails, MediaBatchDetails, EmployeeIDAndName, MaterialDetails, MediaStockAndBatchDetail
  , MediaBatchProductionDetails, MediaBatchMaterialDetails
} from './media-batch-details.component.model';

import { MatSelect } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/corecomponents/modal/modal.service';
import { Calendar } from 'primeng/calendar/calendar';
import { timer } from 'rxjs';
import moment from 'moment';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';



@Component({
  selector: 'app-media-batch-details',
  templateUrl: './media-batch-details.component.html',
  styleUrls: ['./media-batch-details.component.css']
})
export class MediaBatchDetailsComponent implements OnInit {
  @ViewChild('unitNameDDL', { static: false }) unitNameDDL: MatSelect;
  @ViewChild('mediaNameDDL', { static: false }) mediaNameDDL: MatSelect;
  @ViewChild('unitEmployeeNameDDL', { static: false }) unitEmployeeNameDDL: MatSelect;
  officeLocationDetails: OfficeLocationDetails[];
  mediaProcessDetails: MediaProcessDetails[];
  pendingOrderdetails: PendingOrderdetails[];
  mediaBatchDetails: MediaBatchDetails;
  selectedPendingOrderDetails: PendingOrderdetails;
  employeeIDAndName: EmployeeIDAndName[];
  materialDetails: MaterialDetails[];
  mediaStockAndBatchDetails: MediaStockAndBatchDetail[];
  selectedUnit: any;
  selectedMedia: any;
  selectedEmployee: any;
  showNext = false;
  index = 0;
  showGrid = false;
  showBack = false;
  mediaBatchDetailsForm: FormGroup;
  selectedQuantity: number;
  selectedMediaProcessCode: string;
  selectedBatchDate: string;
  selectedMediaDetailsRow: number;
  selectedStockAndBatchDetailsRow: number;
  totalIssueQuantity: number;
  totalAmount: number;
  scheduleOrderSelected: boolean;
  batchDetailsSelected: boolean;
  selectedBatchNOs: any[] = [];
  selectedBatchNosString: string;
  mediaBatchMaterialDetails: MediaBatchMaterialDetails[] = [];
  constructor(
    private batchDetailsService: MediaBatchDetailsService, private datepipe: DatePipe,
    private modalservice: ModalService, private alertService: AlertService
  ) { }

  ngOnInit() {
    try {
      this.selectedBatchNosString = "";
      this.selectedBatchNOs = [];
      this.scheduleOrderSelected = true;
      this.batchDetailsSelected = false;
      this.totalAmount = 0;
      this.totalIssueQuantity = 0;
      this.selectedQuantity = 100;
      this.getOfficeLocations();
      this.getMediaProcessDetails();
      this.createForm();
      this.getEmployeeIdAndName();
    } catch (error) {
      // console.log('', error);
    }
  }

  createForm() {
    try {
      this.mediaBatchDetailsForm = new FormGroup({
        orgOfficeNo: new FormControl('', [Validators.required]),
        mediaBatchProductionDate: new FormControl('', [Validators.required]),
        //mediaBatchProductionNo: new FormControl('', [Validators.required]),
        mediaBatchProductionVisibleNo: new FormControl('', [Validators.required]),
        employeeID: new FormControl(0, [Validators.required]),
        mediaBatchSize: new FormControl('', [Validators.required, Validators.pattern(/^\d*$/)]),
        productionQuantity: new FormControl('', [Validators.required]),
        mediaBatchUOM: new FormControl('', [Validators.required]),
        sNaOH: new FormControl('', [Validators.required]),
        sAgNO3: new FormControl('', [Validators.required]),
        sBRINE: new FormControl('', [Validators.required]),
        water: new FormControl('', [Validators.required]),
        mediaBatchRemarks: new FormControl('', [Validators.required])

      });

      this.mediaBatchDetailsForm.controls.mediaBatchProductionDate.setValue(new Date());
      //this.mediaBatchDetailsForm.controls.orgOfficeNo.disable();
      //this.mediaBatchDetailsForm.controls.mediaBatchProductionDate.disable();
      //this.mediaBatchDetailsForm.controls.mediaBatchProductionNo.disable();
      //this.mediaBatchDetailsForm.controls.mediaBatchProductionVisibleNo.disable();
      //this.mediaBatchDetailsForm.controls.employeeID.disable();
      //this.mediaBatchDetailsForm.controls.mediaBatchSize.disable();
      //this.mediaBatchDetailsForm.controls.productionQuantity.disable();
      //this.mediaBatchDetailsForm.controls.mediaBatchUOM.disable();
      //this.mediaBatchDetailsForm.controls.sNaOH.disable();
      //this.mediaBatchDetailsForm.controls.sAgNO3.disable();
      //this.mediaBatchDetailsForm.controls.sBRINE.disable();
      //this.mediaBatchDetailsForm.controls.water.disable();
      //this.mediaBatchDetailsForm.controls.mediaBatchRemarks.disable();

    } catch (error) {
      // console.log('Error in create form Harvet GRN:', error);
    }
  }

  getOfficeLocations() {
    try {
      this.batchDetailsService.getOfficeLocationsOrderByName().subscribe(res => {
        this.officeLocationDetails = res;
      }, (error) => {
        // console.log('', error);
      });

    } catch (error) {
      // console.log('', error);
    }
  }

  getMediaProcessDetails() {
    try {
      this.batchDetailsService.getMediaProcessDetailsOrderByName().subscribe(res => {
        this.mediaProcessDetails = res;
      }, (error) => {

      });

    } catch (error) {

    }
  }


  getPendingOrderDetails() {
    try {
      this.batchDetailsService.getPendingOrderScheduleDetails().subscribe(res => {
        //console.log(res);
        this.pendingOrderdetails = res;
      }, (error) => {

      });

    } catch (error) {

    }
  }

  getEmployeeIdAndName() {
    try {
      this.batchDetailsService.getEmployeeIdAndName().subscribe(res => {
        console.log(res);
        this.employeeIDAndName = res;
      }, (error) => {

      });

    } catch (error) {

    }
  }

  changeUnit(event: any) {
    this.selectedUnit = event;
  }

  loadPendingOrderDetails(event: any) {
    try {
      this.selectedMedia = event;
      if (this.selectedUnit != null) {
        this.getPendingOrderDetails();
      }
    } catch (error) {
      // console.log('', error);
    }
  }

  checkSelected(event: any) {

    try {
      this.selectedPendingOrderDetails = event;
      if (this.selectedPendingOrderDetails !== null) {
        this.showNext = true;
        this.selectedQuantity += this.selectedPendingOrderDetails.bSProductionQtyinUOM;
      }
    } catch (error) {
      // console.log('Error in Pending Order selection in Media batch Details:', error);
    }
  }

  populateMediaMaterialGrid() {
    //console.log("calling grid");
    try {
      //if (this.selectedPendingOrderDetails != null) {
      //let param = {
      //  date: this.mediaBatchDetailsForm.controls.mediaBatchProductionDate,
      //  mediaProcessCode: this.selectedMedia.mediaProcessName,
      //  totalQty: this.mediaBatchDetailsForm.controls.productionQuantity
      //}
      let param = {
        "date": "2020-11-19T07:22:14.386Z",
        "mediaProcessCode": "MPC_1",
        "totalQty": 0.0
      };
      //console.log("calling grid 2");
      this.batchDetailsService.getMediaMaterialDetails(param).subscribe(res => {
        //console.log(res);
        this.materialDetails = res;
      }, (error) => {
        console.log('Error', error);
      });
      //}
      // 
    } catch (error) {
      // 
    }
  }



  changeEmployee(event: any) {
    this.selectedEmployee = event;
  }

  openNext() {
    try {
      this.scheduleOrderSelected = false;
      this.batchDetailsSelected = true;
      this.index = (this.index === 1) ? 0 : this.index + 1;
      let year = new Date().getFullYear().toString().substr(-2);
      let batchProdNo = "MB - 1 / " + year;
      this.showNext = false;
      this.showBack = true;
      //console.log(this.showNext);
      this.mediaBatchDetailsForm.patchValue({
        orgOfficeNo: this.selectedUnit.OrgOfficeNo,
        productionQuantity: this.selectedQuantity,
        mediaBatchProductionVisibleNo: batchProdNo
      });
      this.updatemediaBatchProductionDate(new Date());

    } catch (error) {
      // console.log('Error in Next navigation:', error);
    }
  }


  showStockBatchDetails(material, row) {
    this.selectedBatchNosString = "";
    this.selectedBatchNOs = [];
    this.selectedMediaDetailsRow = row;
    document.getElementById('material' + row).style.color = "red";
    this.populateStockAndBatchGrid();
  }

  populateStockAndBatchGrid() {
    try {
      this.batchDetailsService.getStockAndBatchDetailsFirst(this.selectedBatchDate).subscribe(res => {
        //console.log(res);
        this.mediaStockAndBatchDetails = res;
      }, (error) => {
        //console.log('Error', error);
      });

    } catch (error) {
      // 
    }
  }

  updatemediaBatchProductionDate(dateObject) {

    var dateToDB = moment(dateObject.value).format("YYYY-MM-DD");
    //console.log(dateToDB);
    this.selectedBatchDate = dateToDB.toString();
  }
  calculateAmount(mediaStockAndBatchDetail) {

    return (mediaStockAndBatchDetail.issueQty * 10);
    //mediaStockAndBatchDetail.rmGRNMaterialWiseTotalRate

  }
  onCheckboxChange(event, row) {
    if (event.target.checked == true) {
      // this.selectedBatchNOs.push()
      //let batchNo = '';
      if (this.mediaStockAndBatchDetails[row].flag == "A") {
        let no = this.mediaStockAndBatchDetails[row].rmStockLOTGRNNo;
        let id = this.selectedBatchNOs.indexOf(no);
        if (id == -1 || this.selectedBatchNOs == []) {
          this.selectedBatchNOs.push(this.mediaStockAndBatchDetails[row].rmStockLOTGRNNo);
        }
      }
      else if (this.mediaStockAndBatchDetails[row].flag == "B") {
        let no = this.mediaStockAndBatchDetails[row].rmBatchNo;
        let id = this.selectedBatchNOs.indexOf(no);
        if (id == -1 || this.selectedBatchNOs == []) {
          this.selectedBatchNOs.push(this.mediaStockAndBatchDetails[row].rmBatchNo);
        }
      }
      this.selectedBatchNosString = this.selectedBatchNOs.join();
      //this.materialDetails[this.selectedMediaDetailsRow].materialBatchNo = this.selectedBatchNosString;
      document.getElementById('materialBatchNo' + this.selectedMediaDetailsRow).innerHTML = this.selectedBatchNosString;

      this.setMaterialDetails(this.mediaStockAndBatchDetails[row].flag, this.mediaStockAndBatchDetails[row]);
    }
    else {
      if (this.mediaStockAndBatchDetails[row].flag == "A") {
        let no = this.mediaStockAndBatchDetails[row].rmStockLOTGRNNo;
        let id = this.selectedBatchNOs.indexOf(no);
        if (id >= 0 || this.selectedBatchNOs != []) {
          this.selectedBatchNOs.splice(id);
        }
      }
      else if (this.mediaStockAndBatchDetails[row].flag == "B") {
        let no = this.mediaStockAndBatchDetails[row].rmBatchNo;
        let id = this.selectedBatchNOs.indexOf(no);
        if (id >= 0 || this.selectedBatchNOs != []) {
          this.selectedBatchNOs.splice(id);
        }
      }
      this.selectedBatchNosString = this.selectedBatchNOs.join();
      //this.materialDetails[this.selectedMediaDetailsRow].materialBatchNo = this.selectedBatchNosString;
      document.getElementById('materialBatchNo' + this.selectedMediaDetailsRow).innerHTML = this.selectedBatchNosString;

      this.findIndexAndSplice(this.mediaStockAndBatchDetails[row].flag, this.mediaStockAndBatchDetails[row]);
    }
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  setMaterialDetails(flag, object: MediaStockAndBatchDetail) {
    if (flag == "A") {
      let selectedObject = new MediaBatchMaterialDetails();
      selectedObject.stockNo = object.stockNo;
      selectedObject.rMStockLOTGRNNo = object.rmStockLOTGRNNo;
      selectedObject.rMStockLotGrnRate = object.rmStockLotGrnRate;
      selectedObject.rMBatchNo = null;
      selectedObject.rMGRNNO = null;
      selectedObject.rMGRNMaterialwiseTotalRate = null;

      this.mediaBatchMaterialDetails.push(selectedObject);

    }
    else if (flag == "B") {
      let selectedObject = new MediaBatchMaterialDetails();

      selectedObject.stockNo = null;
      selectedObject.rMStockLOTGRNNo = null;
      selectedObject.rMStockLotGrnRate = null;
      selectedObject.rMGRNNO = object.rmGrnNo;
      selectedObject.rMBatchNo = object.rmBatchNo;
      selectedObject.rMGRNMaterialwiseTotalRate = object.rmGRNMaterialWiseTotalRate
      this.mediaBatchMaterialDetails.push(selectedObject);
    }
  }

  findIndexAndSplice(flag, object) {
    if (flag == "A") {
      let selectedObject = new MediaBatchMaterialDetails();
      selectedObject.stockNo = object.stockNo;
      selectedObject.rMStockLOTGRNNo = object.rmStockLOTGRNNo;
      selectedObject.rMStockLotGrnRate = object.rmStockLotGrnRate;
      selectedObject.rMBatchNo = null;
      selectedObject.rMGRNNO = null;
      selectedObject.rMGRNMaterialwiseTotalRate = null;

      let id = this.mediaBatchMaterialDetails.indexOf(selectedObject);
      if (id >= 0) {
        this.mediaBatchMaterialDetails.splice(id);
      }

    }
    else if (flag == "B") {
      let selectedObject = new MediaBatchMaterialDetails();

      selectedObject.stockNo = null;
      selectedObject.rMStockLOTGRNNo = null;
      selectedObject.rMStockLotGrnRate = null;
      selectedObject.rMGRNNO = object.rmGrnNo;
      selectedObject.rMBatchNo = object.rmBatchNo;
      selectedObject.rMGRNMaterialwiseTotalRate = object.rmGRNMaterialWiseTotalRate

      let id = this.mediaBatchMaterialDetails.indexOf(selectedObject);
      if (id >= 0) {
        this.mediaBatchMaterialDetails.splice(id);
      }

    }
  }

  calculateTotalIssueQty(qty: number, row: number) {
    if (this.totalIssueQuantity != 0) {
      let val = this.totalIssueQuantity;
      this.totalIssueQuantity = parseInt(val.toString()) + parseInt(qty.toString());
    }
    else {
      this.totalIssueQuantity = parseInt(qty.toString());
    }
    if (this.totalAmount == 0) {
      this.totalAmount = (this.mediaStockAndBatchDetails[row].issueQty * this.mediaStockAndBatchDetails[row].rmGRNMaterialWiseTotalRate);

    }
    else {
      this.totalAmount = this.totalAmount + (this.mediaStockAndBatchDetails[row].issueQty * this.mediaStockAndBatchDetails[row].rmGRNMaterialWiseTotalRate);
    }

    document.getElementById('TotalissueQty').innerText = "";
    document.getElementById('TotalAmount').innerText = "";

    document.getElementById('TotalissueQty').innerText = this.totalIssueQuantity.toString();
    document.getElementById('TotalAmount').innerText = this.totalAmount.toString();

    document.getElementById('materialConsumedQty' + this.selectedMediaDetailsRow).innerHTML = "";
    document.getElementById('materialConsumedQty' + this.selectedMediaDetailsRow).innerHTML = this.totalAmount.toString();

  }

  saveMediaBatchDetails() {
    const mediaProdDetails: MediaBatchProductionDetails = this.getMediaBatchProductionDetails();
    //console.log("Media Batch Details", mediaProdDetails);
    //console.log("Material Details", this.mediaBatchMaterialDetails);

    if (this.mediaStockAndBatchDetails.length > 0) {
      if (this.mediaBatchMaterialDetails.length > 0) {
        let param = {
          mediaMaterialDetails: this.mediaBatchMaterialDetails,
          mediaProductionDetails: mediaProdDetails,
          status: ''
        }
        this.batchDetailsService.saveMediaBatchMaterialDetails(param).subscribe(res => {
          if (res.status == "Success") {
            alert("Data Saved Successfully");
          }
          else {
            alert("Data cannot be saved");
          }
        })
      }
    }
  }

  getMediaBatchProductionDetails(): MediaBatchProductionDetails {
    try {
      if (this.mediaBatchDetailsForm.valid) {
        const mediaBatchProductionDetails: MediaBatchProductionDetails = new Object() as MediaBatchProductionDetails;

        mediaBatchProductionDetails.orgofficeNo = this.mediaBatchDetailsForm.controls.orgOfficeNo.value;
        mediaBatchProductionDetails.mediaBatchProductionDate = this.mediaBatchDetailsForm.controls.mediaBatchProductionDate.value;
        mediaBatchProductionDetails.mediaBatchProductionVisibleNo = this.mediaBatchDetailsForm.controls.mediaBatchProductionVisibleNo.value;
        mediaBatchProductionDetails.employeeID = this.mediaBatchDetailsForm.controls.employeeID.value;
        mediaBatchProductionDetails.productionQuantity = this.mediaBatchDetailsForm.controls.productionQuantity.value;
        mediaBatchProductionDetails.mediaBatchSize = this.mediaBatchDetailsForm.controls.mediaBatchSize.value;
        mediaBatchProductionDetails.mediaBatchUOM = this.mediaBatchDetailsForm.controls.mediaBatchUOM.value;
        mediaBatchProductionDetails.sNaOH = this.mediaBatchDetailsForm.controls.sNaOH.value;
        mediaBatchProductionDetails.sAgNO3 = this.mediaBatchDetailsForm.controls.sAgNO3.value;
        mediaBatchProductionDetails.sBRINE = this.mediaBatchDetailsForm.controls.sBRINE.value;
        mediaBatchProductionDetails.water = this.mediaBatchDetailsForm.controls.water.value;
        mediaBatchProductionDetails.mediaBatchRemarks = this.mediaBatchDetailsForm.controls.mediaBatchRemarks.value;

        return mediaBatchProductionDetails;
      }
      else {
        return null;
      }
    }
    catch (error) {

    }
  }

  clear() {
    try {
      this.unitNameDDL.writeValue(null);
      this.mediaNameDDL.writeValue(null);
      this.unitEmployeeNameDDL.writeValue(null);

      this.mediaBatchDetailsForm.reset();
      this.index = 0;
      this.showBack = false;


      this.pendingOrderdetails = [];
      this.mediaBatchDetails = new MediaBatchDetails();
      this.selectedPendingOrderDetails = new PendingOrderdetails();
      this.employeeIDAndName = [];
      this.materialDetails = [];
      this.mediaStockAndBatchDetails = [];
      this.selectedUnit = null;
      this.selectedMedia = null;
      this.selectedEmployee = null;
      this.showNext = false;
      this.index = 0;
      this.showGrid = false;
      this.showBack = false;

      this.selectedQuantity = 0;
      this.selectedMediaProcessCode = '';
      this.selectedBatchDate = '';
      this.selectedMediaDetailsRow = 0;
      this.selectedStockAndBatchDetailsRow = 0;
      this.totalIssueQuantity = 0;
      this.totalAmount = 0;
      this.scheduleOrderSelected = true;
      this.batchDetailsSelected = false;
      this.selectedBatchNOs = [];
      this.selectedBatchNosString = '';
      this.mediaBatchMaterialDetails = [];
    } catch (error) {
      // console.log('Error in clearing form Harvet GRN:', error);
    }
  }
}
