import { ActionParams, ngColumnType } from 'src/app/shared/components/ng-grid/grid.models';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  RMInputTransferDetails, OutwardGatePassDetails, RMInputMaterialTransferDetails,
  StockAndBatchDetailsList, StockAndBatchData, FeedTransferDetails
} from 'src/app/shared/models/input-transfer.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { InputTransferService } from 'src/app/shared/services/input-transfer.service';
import { NgForm } from '@angular/forms';
import data from './test-data.json';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { ModalService } from '../../../../corecomponents/modal/modal.service';
import { MatSelectChange } from '@angular/material';


@Component({
  selector: 'app-inputs-transfer-details',
  templateUrl: './inputs-transfer-details.component.html',
  styleUrls: ['./inputs-transfer-details.component.css']
})
export class InputsTransferDetailsComponent implements OnInit {

  allAreas: any[] = [];
  cropGroup: any[] = [];
  cropNameList: any[] = [];
  seasonList: any[] = [];
  cropCountList: any[] = [];
  employeeList: any[] = [];
  feedTransfer: RMInputTransferDetails;
  materialCols: any[];
  stockCols: any[];
  actionParams: ActionParams;
  disableFields = false;
  selectedMaterial: RMInputMaterialTransferDetails;
  selectedStocks: StockAndBatchDetailsList[];
  selectedMaterialName: string;
  isSaved = false;
  datePipe: DatePipe;
  agreementAcres = '';
  popPerAcre = '';
  locationDetails: any[] = [];
  dataFlag = '';
  saveDisabled = true;
  findDisabled = false;
  modifyDisabled = false;
  newMatDisabled = false;
  MaterialDetails: any[];
  selectedMat: any;
  showMatDDL = false;
  selectedGroup: any[];
  selectedName: any[];
  materialGroups: any[];
  materialNames: any[];
  allMaterialNames: any[];

  @ViewChild('form', { static: false }) ngForm: NgForm;
  @ViewChild('transferDate', { static: false }) transferDate: any;
  @ViewChild('FeedTransferDate', { read: ElementRef, static: false }) FeedTransferDate: ElementRef;
  @ViewChild('AreaID', { read: ElementRef, static: false }) AreaID: ElementRef;
  @ViewChild('YesBtn', { static: false }) yesBtn: ElementRef;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;
  @ViewChild('MaterialGroup', { read: ElementRef, static: false }) MaterialGroup: ElementRef;
  @ViewChild('MaterialName', { read: ElementRef, static: false }) MaterialName: ElementRef;

  constructor(private inputService: InputTransferService, private alertService: AlertService
    , private modalService: ModalService) {
  }

  ngOnInit() {
    this.resetForm();
  }

  onChangeAreaName() {
    const index = this.allAreas.findIndex(x => x.areaId === this.feedTransfer.AreaID);
    this.feedTransfer.areaCode = this.allAreas[index].areaCode;
    this.getAreaInchargeInfo();
  }


  getCropNameCodeList() {
    try {
      this.inputService.getCropCode(this.feedTransfer.CropGroupCode).subscribe(res => {
        if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
          this.cropNameList = res.Data;
        }
        // console.log('CropNameList', res);
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Crop details!');
      });
    } catch (error) {
      console.error('Error in Getting crop details!', error);
    }

  }

  getSeasonDetails() {
    try {
      this.inputService.getSeasonFromTo(this.feedTransfer.CropNameCode).subscribe(res => {
        this.seasonList = res;
        // console.log(res);
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Crop details!');
      });
    } catch (error) {
      console.error('Error in Getting Crop Season!', error);
    }
  }

  getCropCount() {
    try {
      this.materialCols = [];
      const detailsByCropPsNum = this.inputService.getMatDetailsByCropPsNumber(this.feedTransfer.CropNameCode, this.feedTransfer.PsNumber);
      const getCropCount = this.inputService.getCropCount(this.feedTransfer.PsNumber);
      const getHbomDetails = this.inputService.getGetHBOMPracticePerAcreages(this.feedTransfer.CropNameCode, this.feedTransfer.PsNumber);
      const aggrementDetails = this.inputService.getFarmerAgreementAcres(this.feedTransfer.CropNameCode, this.feedTransfer.PsNumber);

      forkJoin([aggrementDetails, detailsByCropPsNum, getCropCount, getHbomDetails]).subscribe((results) => {
        this.FarmerAgreementAcres(results[0]);
        this.matDetailsByCropPsNumber(results[1]);
        this.cropCountList = results[2];
        this.HBOMPracticePerAcreages(results[3]);

      },
        (error) => {
          this.alertService.error('Error while processing your request. Try Again!');
        });
    } catch (error) {
      console.error('Error in getting getCropCount!', error);
    }
  }

  matDetailsByCropPsNumber(res) {
    try {
      if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
        const materialData = res.Data[0].HBOMDetails.map(item => {
          item.popStdperUOM = item.hbomChemicalVolume + ' ' + item.hbomChemicalUOM;
          if (item.hbomPracticePerAcrage === 'ONE ACRE') {
            item.qtyRequired = (2 * this.feedTransfer.agreementAcres * item.hbomChemicalVolume).toFixed(2);
          } else if (item.hbomPracticePerAcrage === 'HALF ACRE') {
            item.qtyRequired = (this.feedTransfer.agreementAcres * item.hbomChemicalVolume).toFixed(2);
          }
          return item;
        });
        this.feedTransfer.transferDetailsList = materialData;
        this.feedTransfer.transferDetailsList.map(item => {
          // tslint:disable-next-line: no-string-literal
          item.transferredTillDate = item['transferredAmount'] === undefined ? 0 : item['transferredAmount'];
          item.tobeIssueQty = item.qtyRequired - item.transferredTillDate;
        });
      }
    } catch (error) {
      console.error('Error in getting getCropCount!', error);
    }
  }

  HBOMPracticePerAcreages(res) {
    if (res[0] === 'HALF ACRE') {
      this.popPerAcre = 'HALF ACRE';
    } else {
      this.popPerAcre = 'ONE ACRE';
    }

    this.showTables();
  }

  FarmerAgreementAcres(res) {
    this.feedTransfer.agreementAcres = res;
    this.agreementAcres = this.feedTransfer.agreementAcres.toString();
  }

  getAreaInchargeInfo() {
    this.inputService.getEmployeeCode(this.feedTransfer.AreaID).subscribe(res => {
      // console.log('EmployeeList', res);
      this.employeeList = res;
      if (this.employeeList.length === 0) {
        this.feedTransfer.empID = 'Not Available';
      } else {
        if (this.feedTransfer.TransferDate) {
          const filteredEmpList = this.employeeList.filter(x =>
            new Date(x.effectiveDate) <= new Date(this.feedTransfer.TransferDate)
            && x.staffType.toLowerCase() === 'incharge');
          // console.log('FilterListEmployee', filteredEmpList, this.employeeList);
          if (filteredEmpList.length === 0) {
            this.feedTransfer.empID = 'Not Available';
          } else {
            this.feedTransfer.empID = filteredEmpList[0].employeeID;
            // tslint:disable-next-line: no-shadowed-variable
            this.inputService.getEmployeeByEmpId(this.feedTransfer.empID).subscribe(res => {
              //  console.log('EmployeeList', res);
              this.feedTransfer.areaIncharge = res.employeeName;
            },
              error => {
                console.error(error);
                this.alertService.error('Error in fetching Employee Details');
              });
          }

        }
      }

    }, error => {
      console.error(error);
      this.alertService.error('Error in fetching Field Staff Details');
    });
  }

  newMaterialClick() {
    try {

      this.resetForm();
      this.initData();
      this.disableFields = false;
      this.findDisabled = true;
      this.modifyDisabled = true;
      this.newMatDisabled = true;
      this.saveDisabled = true;
      this.FeedTransferDate.nativeElement.focus();
    } catch (error) {
      console.error('Error in New Material Click!', error);
    }
  }

  resetForm() {
    try {
      this.isSaved = false;
      this.saveDisabled = true;
      this.findDisabled = false;
      this.modifyDisabled = false;
      this.newMatDisabled = false;

      // this.isSearchResults = false;
      // this.isFindEnabled = false;
      if (this.ngForm) {
        this.disableFields = false;
        this.ngForm.reset();
      }

      this.disableFields = true;

      this.agreementAcres = '';
      this.popPerAcre = '';
      this.selectedMaterialName = '';
      this.materialCols = [];
      this.feedTransfer = new RMInputTransferDetails();
      this.feedTransfer.gatePassDetails = new OutwardGatePassDetails();
      this.feedTransfer.TransferDate = new Date();
      this.feedTransfer.gatePassDetails.ogpDate = new Date();
      this.feedTransfer.InutTransferRemarks = '';
      this.scrollTop();
      this.showTables();
      this.showMatDDL = false;
      this.materialNames = [];
      this.materialGroups = [];

    } catch (error) {
      console.error('Error in Clearing form!', error);
    }
  }


  scrollTop() {
    try {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error in Scrolling top!', error);
    }
  }

  initData() {

    try {
      this.feedTransfer = new RMInputTransferDetails();
      this.feedTransfer.gatePassDetails = new OutwardGatePassDetails();
      this.feedTransfer.TransferDate = new Date();
      this.feedTransfer.gatePassDetails.ogpDate = new Date();
      this.feedTransfer.InutTransferRemarks = '';
      this.selectedStocks = [];
      this.datePipe = new DatePipe('en-US');

      const getAllAreas = this.inputService.getAllAreas();
      const getCropGroups = this.inputService.getCropGroup();
      const getTransferNoPk = this.inputService.getGenerateTransferNo();
      const getOgpNoFk = this.inputService.getOutwardGatePassNo();
      const getOrgOfficeList = this.inputService.getOfficeDetailsList();

      forkJoin([getAllAreas, getCropGroups, getTransferNoPk, getOgpNoFk, getOrgOfficeList]).subscribe((results) => {
        this.allAreas = results[0];
        this.cropGroup = results[1];
        this.getTransferNumber(results[2]); // TransferNumber
        this.getGatePassOgpNo(results[3]); // gatePassDetails.ogpNo
        this.getOfficeList(results[4]); // office list
      },
        (error) => {
          this.alertService.error('Error while processing your request. Try Again!');
        });
    } catch (error) {
      console.error('Error in fetching Agreement Code!', error);
    }

  }

  getTransferNumber(res) {
    if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
      this.feedTransfer.TransferNumber = res.Data;
    }
  }

  getGatePassOgpNo(res) {
    if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
      this.feedTransfer.gatePassDetails.ogpNo = res.Data;
    }
  }

  getOfficeList(res) {
    if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
      this.locationDetails = res.Data;
    }
  }

  getFormattedDate(inputDate: any) {
    return this.datePipe.transform(inputDate, 'yyyy-MM-dd');
  }

  onRowSelected(event: any) {
    this.showMatDDL = false;
    this.selectedGroup = [];
    this.selectedName = [];
    this.materialGroups = [];
    this.materialNames = [];
    this.modalService.open('ChangeMaterial');
    this.yesBtn.nativeElement.focus();
    // console.log(this.selectedMaterial);

  }

  onEditComplete(stockData: any) {
    // console.log(stockData);
    const amount = +(stockData.data.issueQty * stockData.data.rate).toFixed(2);
    this.selectedMaterial.transferQty = stockData.data.issueQty;
    this.selectedMaterial.transferAmount = amount;
    this.selectedMaterial.rmTransferDate = new Date(this.feedTransfer.TransferDate);
    this.selectedMaterial.stockno = stockData.data.stockNo;
    this.selectedMaterial.rmStockLotGrnNo = stockData.data.rmStockLOTGRNNo;
    this.selectedMaterial.rmStockLotGrnRate = stockData.data.rmStockLotGrnRate;
    this.selectedMaterial.rmMaterialTransferAmount = amount;
    this.selectedMaterial.rmMaterialTransferQty = stockData.data.issueQty;

    const index = this.feedTransfer.stockAndBatchData.indexOf(stockData.data);
    this.feedTransfer.stockAndBatchData[index].amount = amount;
    this.saveDisabled = false;
  }

  onSelectionChange(event) {
    console.log(this.selectedStocks);
  }

  saveDetails() {
    this.saveDisabled = true;
    const feedTransferData = new FeedTransferDetails();

    feedTransferData.rmInputTransferDetails = this.feedTransfer;
    feedTransferData.outwardGatePassDetails = this.feedTransfer.gatePassDetails;
    feedTransferData.rmInputMaterialTransferDetails = this.selectedMaterial;
    feedTransferData.rmInputTransferDetails.InutTransferRemarks = this.feedTransfer.InutTransferRemarks;

    const cropSchema = this.cropNameList.filter(a => a.cropNameCode ===
      // tslint:disable-next-line: no-string-literal
      this.feedTransfer.CropNameCode)[0].cropSchemeCode;
    feedTransferData.rmInputTransferDetails.cropSchemeCode = cropSchema;

    const orgOfficeN = this.locationDetails.filter(a => a.OrgCode ===
      // tslint:disable-next-line: no-string-literal
      this.feedTransfer.OrgOfficeNo)[0].OrgOfficeNo;

    feedTransferData.rmInputTransferDetails.OrgOfficeNo = orgOfficeN;

    if (this.dataFlag === 'A') {
      // feedTransferData.rmInputMaterialTransferDetails.stockno = "";
      // feedTransferData.rmInputMaterialTransferDetails.rmStockLotGrnNo = "";
      // feedTransferData.rmInputMaterialTransferDetails.RM_Stock_Lot_Grn_Rate = "";


      feedTransferData.rmInputMaterialTransferDetails.rmGrnNo = null;
      feedTransferData.rmInputMaterialTransferDetails.rmBatchNo = null;
      feedTransferData.rmInputMaterialTransferDetails.rmGrnMaterialwiseTotalRate = null;
    } else { // DATA COMING FROM B
      // feedTransferData.rmInputMaterialTransferDetails.rmGrnNo = "";
      // feedTransferData.rmInputMaterialTransferDetails.rmBatchNo = "";
      // feedTransferData.rmInputMaterialTransferDetails.rmGrnMaterialwiseTotalRate = "";

      feedTransferData.rmInputMaterialTransferDetails.stockno = null;
      feedTransferData.rmInputMaterialTransferDetails.rmStockLotGrnNo = null;
      feedTransferData.rmInputMaterialTransferDetails.rmStockLotGrnRate = null;
    }

    //console.log(JSON.stringify(feedTransferData));

    this.inputService.saveFeedInputData(feedTransferData).subscribe(res => {
      //  console.log(res);
      this.alertService.success('Material Transfer Details Saved Successfully');
      this.resetForm();
    }, error => {
      console.error(error);
      this.alertService.error('Error in Saving Stock details!');
    });

  }

  showTables() {
    this.materialCols = [
      // take field name from table
      { field: 'hbOMDivisonFor', header: 'POP Division' },
      { field: 'rawMaterialGroup', header: 'Material Group' },
      { field: 'RawMaterialDetailsName', header: 'Material Name', type: ngColumnType.contentEditable },
      { field: 'popStdperUOM', header: 'POP Std per (' + this.popPerAcre + ') / UOM' },
      { field: 'qtyRequired', header: 'Qty Req ' + this.agreementAcres + ' (Acres)' },
      { field: 'transferredTillDate', header: 'Transferred Till Date' },
      { field: 'tobeIssueQty', header: 'To Be Issue Qty' },
      { field: 'transferQty', header: 'Transfer Qty' },
      { field: 'transferAmount', header: 'Amount' }

    ];

    this.stockCols = [
      // take field name from table
      { field: 'batchNoAndDate', header: 'Batch Date / Batch No' },
      { field: 'avaialableStockQty', header: 'Avialable Stock Qty' },
      { field: 'issueQty', header: 'Issue Qty', type: ngColumnType.contentEditable },
      { field: 'rate', header: 'Rate' },
      { field: 'amount', header: 'Amount' }
    ];

  }

  onNoClick() {
    this.modalService.close('ChangeMaterial');
    console.log(this.selectedMaterial);
    this.selectedMaterialName = this.selectedMaterial.RawMaterialDetailsName;
    const groupCode = this.selectedMaterial.rawMaterialGroupCode;
    const detailCode = this.selectedMaterial.rawMaterialDetailsCode;
    const transferDate = this.getFormattedDate(this.feedTransfer.TransferDate);

    this.getTransferDetailsGridData(groupCode, detailCode, transferDate);
  }

  openChangeMaterial() {
    this.showMatDDL = true;
    this.modalService.close('ChangeMaterial');
    const getMatGroups = this.inputService.GetRawMaterialGroups();
    const getMatDetails = this.inputService.GetRawMaterialDetails();

    forkJoin([getMatGroups, getMatDetails]).subscribe((results) => {
      this.materialGroups = results[0].Data;
      this.allMaterialNames = results[1].Data;

    },
      (error) => {
        this.alertService.error('Error while processing your request. Try Again!');
      });

    this.MaterialGroup.nativeElement.focus();
  }

  getStockBatchForSelectedMat() {
    console.log('selectedMat');
    console.log(this.selectedMat);
    this.showMatDDL = true;

  }

  onChangeMaterialGroup(event: MatSelectChange) {
    this.selectedGroup = event.value;
    this.materialNames = this.allMaterialNames.filter(x => x.Raw_Material_Group_Code == this.selectedGroup);
    this.MaterialName.nativeElement.focus();

  }

  onChangeMaterialName(event: MatSelectChange) {
    this.selectedName = event.value;
    const materialName = this.materialNames.filter(x => x.Raw_Material_Details_Code == this.selectedName)[0].Raw_Material_Details_Name;
    this.selectedMaterialName = materialName;
    const transferDate = this.getFormattedDate(this.feedTransfer.TransferDate);
    this.getTransferDetailsGridData(this.selectedGroup, this.selectedName, transferDate);
  }


  getTransferDetailsGridData(groupCode, detailCode, transferDate) {
    this.feedTransfer.stockAndBatchData = [];

    this.inputService.getStockDetails(groupCode, detailCode, transferDate).subscribe(res => {
      if (res !== undefined) {
        this.dataFlag = res.flag;
        if (res.flag === 'A' && res.firstFields) {
          res.firstFields.map(item => {
            const stockData = new StockAndBatchData();
            stockData.batchNoAndDate = this.datePipe.transform(item.rmStockLOTGRNDate, 'dd-MM-yyyy') + ' / ' + item.rmStockLOTGRNNo;
            stockData.avaialableStockQty = item.rmStockLotGrnQty - item.sumRMMaterialTransferQty;
            stockData.rate = item.rmStockLotGrnRate;
            stockData.amount = stockData.issueQty * stockData.rate;
            stockData.stockNo = item.stockNo;
            stockData.rmStockLOTGRNNo = item.rmStockLOTGRNNo;
            stockData.rmStockLotGrnRate = item.rmStockLotGrnRate;

            this.feedTransfer.stockAndBatchData.push(stockData);
          });
        } else if (res.flag === 'B' && res.secondFields) {
          res.secondFields.map(item => {
            const stockData = new StockAndBatchData();
            stockData.batchNoAndDate = this.datePipe.transform(item.rmGrnDate, 'dd-MM-yyyy') + ' / ' + item.rmBatchNo;
            stockData.avaialableStockQty = item.rmGRNReceivedQty - item.sumRMMaterialTransferQty;
            stockData.rate = item.rmGRNMaterialWiseTotalRate;
            stockData.amount = stockData.issueQty * stockData.rate;

            stockData.rmGrnNo = item.rmGrnNo;
            stockData.rmBatchNo = item.rmBatchNo;
            stockData.rmGRNMaterialWiseTotalRate = item.rmGRNMaterialWiseTotalRate;

            this.feedTransfer.stockAndBatchData.push(stockData);
          });
        }
      }
    }, error => {
      console.error(error);
      this.alertService.error('Error in fetching Stock details!');
    });
  }


}
