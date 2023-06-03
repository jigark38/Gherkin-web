import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { GreenReceivedDetails, HarvestGRNCratesDetail, HarvestGRNFarmersDetail, HarvestGRNMaterialDetail, GreenReceivedDetailsNew } from 'src/app/shared/models/buying-material.model';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { BuyingMaterialService } from './buying-material-details.service';
import { DatePipe } from '@angular/common';
import { EmployeeDetl } from '../../master/fieldstaffdetails/fieldstaffdetails.model';
import { MessageService } from 'primeng/api';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DailyGreensReceivingDetailService } from '../daily-greens-receiving-details/daily-greens-receiving-details.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { isNullOrUndefined } from 'util';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class BuyerWeightDetails {
  static slNo: number;
  slNo: number;
  cropCount: string;
  noOfCrate: number;
  eachTare: number;
  creatFromNo: number;
  creatToNo: number;
  grossWt: number;
  tareWt: number;
  netWt: number;
  cropCountInfo: string;
  greensProcurementNo: number;
  BuyerEmployeeID: string;
  BuyerEmployeeName: string;
  isDisabled: boolean;
  Id: number;
  cropSchemeDisabled: boolean;
  cropGroupCode: string;
  cropNameCode: string;
}
declare var $: any;
@Component({
  selector: 'app-buying-material-details',
  templateUrl: './buying-material-details.component.html',
  styleUrls: ['./buying-material-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class BuyingMaterialDetailsComponent implements OnInit {
  canShowDetails = false;
  allAreas: any[] = [];
  ofcLocations: any[] = [];
  employeesList: EmployeeDetl[];
  buyingDetails: HarvestGRNMaterialDetail;
  greenReceivedDetails: GreenReceivedDetails[];
  selectedGrnData: any;
  GreenReceivedDetailsWithGrnDetail: GreenReceivedDetailsNew;
  greenReceivedDetailsGridItem: any[];
  grnReceivedCols: any[];
  summaryReceivedCols: any[];
  summaryReceivedSchemeCodeCols: any[];
  supervisors: any[];
  datePipe: DatePipe;
  dynamicColumns: any[];
  summaryDetailsList: any[];
  cropGroupList = [];
  cropNameList = [];
  cropSchemeList = [];
  vehicleDetails = [];
  cropName = null;
  cropGroup = null;
  greenProcurementSelectionDisabled = false;
  GRNEntrySelectionDisabled = false;
  cropNameGroupDisabled = false;
  weightDetailsList: BuyerWeightDetails[] = [];
  countWeightDetailsList: BuyerWeightDetails[] = [];
  buyerSchemeWiseDetail = [];
  buyerWiseDetail = [];
  cropSchemeListAddedData = [];
  weightDetails;
  SelectedWeighmentMode;
  selectedTab = 'BuyingDetails';
  HarvestGrnForm: FormGroup;
  GrnEntryForm: FormGroup;
  @ViewChild('form', { static: false }) ngForm: NgForm;
  @ViewChild('AreaID', { read: ElementRef, static: false }) AreaID: ElementRef;
  @ViewChild('saveBtn', { static: false }) saveBtn: ElementRef;
  @ViewChild('grnDate', { static: false }) grnDate: ElementRef;
  @ViewChild('continueBtn', { static: false }) continueBtn: ElementRef;
  constructor(
    private buyingService: BuyingMaterialService,
    private alertService: AlertService,
    private messageService: MessageService,
    private dailyGreensReceivingDetailService: DailyGreensReceivingDetailService,
    private dialog: MatDialog, private readonly formBuilder: FormBuilder) {
    this.buyingDetails = new HarvestGRNMaterialDetail();
  }

  ngOnInit() {
    this.grnEntryformCreation();
    this.summaryformCreation();
    this.initData();
  }
  initgrnReceivedCols() {
    this.grnReceivedCols = [
      // take field name from table
      // { field: 'HarvestProcurementNo', header: 'GreenProcurementNo' },
      { field: 'HarvestFormattedDate', header: 'Buying Date' },
      // { field: 'FarmerName', header: 'Farmer Name' },
      // { field: 'FarmersAccountNo', header: 'Account No' },
      // { field: 'VillageName', header: 'Village Name' }
      { field: 'BuyerEmployeeName', header: 'Buyer Name' },
      { field: 'TotalCrates', header: 'No of Crates' },
      { field: 'VehicleNo', header: 'Vehicle No' },
    ];
  }
  initsummaryReceivedCols() {
    this.summaryReceivedCols = [
      // take field name from table
      { field: 'FarmerName', header: 'Farmer Name' },
      { field: 'FarmersAccountNo', header: 'Account No' },
      { field: 'VillageName', header: 'Village Name' }
    ];
  }
  initData() {
    this.initgrnReceivedCols();
    this.initsummaryReceivedCols();
    this.dynamicColumns = [];
    try {
      this.buyingDetails = new HarvestGRNMaterialDetail();
      this.datePipe = new DatePipe('en-US');
      this.buyingDetails.HarvestGRNDate = new Date();
      this.getCropGroup();
      this.buyingService.getAllAreas().subscribe(res => {
        this.allAreas = res;
        // console.log('All areas', res);
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Area Details');
      });

      this.buyingService.getAllEmployee().subscribe(res => {
        this.employeesList = res;
        // console.log('All Employees', res);
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Employee Details');
      });

      this.buyingService.getOfficeLocations().subscribe(res => {
        this.ofcLocations = res;
        // console.log('All Offices', res);
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Office Locations');
      });

      this.buyingService.GetVehicles().subscribe(res => {
        if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
          this.vehicleDetails = res.Data;
        }
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching get vehicles');
      })

    } catch (error) {
      console.error('Error in fetching Details!', error);
    }

  }

  getGreenReceivedDetails(areaId: string) {
    // this.greenReceivedDetails = data.results;
    this.buyingService.getAllGreensReceivedDetail(areaId).subscribe(res => {
      if (res !== undefined) {
        this.greenReceivedDetails = res;
        // this.prepareDynamicData(this.greenReceivedDetails, 'Green');
        this.prepareGreenReceivedDetailGrid(this.greenReceivedDetails);
      }
      // console.log('All Greens', res);
    }, error => {
      console.error(error);
      this.alertService.error('Error in fetching Greens');
    });
  }

  onChangeAreaName(value) {
    this.buyingDetails.AreaName = this.allAreas.find(m => m.areaId === value).areaName;
    this.buyingDetails.AreaId = value;
    // this.getGreenReceivedDetails(this.buyingDetails.AreaId);
  }

  onChangeSupervisor(value) {
    this.buyingDetails.EmpName = this.employeesList.find(m => m.employeeId === value).employeeName;
    this.buyingDetails.EmployeeId = value;
  }

  onDateChange(date) {
    // console.log(this.getFormattedDate(date));
    this.buyingDetails.HarvestGRNDate = date;
  }

  getFormattedDate(inputDate: any) {
    return this.datePipe.transform(inputDate, 'dd-MM-yyyy');
  }

  getFormattedDateWithtime(inputDate: any) {
    return this.datePipe.transform(inputDate, 'yyyy-MM-ddTHH:mm');
  }
  onTabChange(event) {
    if (event === 0) {
      this.selectedTab = 'BuyingDetails';
    } else if (event === 1) {
      this.selectedTab = 'BuyerDetails';
    } else if (event === 2) {
      this.prepareSummaryReceivingGrid();
      this.selectedTab = 'SummaryReceivedDetails';
    }
  }

  prepareBuyerProcurementWiseDetails() {
    if (this.countWeightDetailsList.length > 0) {
      this.countWeightDetailsList.forEach(data => {
        if (data.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo) {
          const frmr = this.buyerSchemeWiseDetail.filter(x => {
            return x.HarvestGRNNo === this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo &&
              x.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
              x.cropCount === data.cropCount;
          });
          if (frmr && frmr.length > 0) {
            frmr[0].totalCrate = frmr[0].totalCrate + data.noOfCrate;
            frmr[0].totalQuantity = Number(Number(frmr[0].totalQuantity + data.netWt).toFixed(3));
          } else {
            const frmrDetail = {
              slNo: this.buyerSchemeWiseDetail.length + 1,
              buyerrName: this.selectedGrnData.BuyerEmployeeName,
              BuyerEmployeeID: this.selectedGrnData.BuyerEmployeeID,
              cropCountInfo: data.cropCountInfo,
              cropCount: data.cropCount,
              totalCrate: data.noOfCrate,
              totalQuantity: data.netWt,
              HarvestGRNNo: this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo,
              Id: 0,
              cropGroupCode: data.cropGroupCode,
              cropNameCode: data.cropNameCode
            };
            this.buyerSchemeWiseDetail.push(frmrDetail);
          }
        }
      });
    }
  }
  onNextClick() {
    /*this.canShowDetails = true;
    // console.log(this.selectedGrnData);
    // this.summaryDetailsList = { ...this.selectedGrnData } as [];
    this.summaryDetailsList = JSON.parse(JSON.stringify(this.selectedGrnData));
    // this.prepareDynamicData(this.summaryDetailsList, 'Summary');
    this.prepareSummaryReceivedDetailGrid(this.summaryDetailsList);
    setTimeout(() => {
      this.grnDate.nativeElement.focus();
    }, 1000);
    this.buyingService.getHarvestGRNNo().subscribe(res => {
      this.buyingDetails.HarvestGRNNo = res;
      // console.log('GRN Number', res);
    }, error => {
      console.error(error);
      this.alertService.error('Error in fetching Harvest GRN Number');
    });*/
    this.greenProcurementSelectionDisabled = true;
    this.GRNEntrySelectionDisabled = true;
    this.prepareBuyerProcurementWiseDetails();
    this.selectedTab = 'BuyerDetails';
  }

  prepareGreenReceivedDetailGrid(data: any) {
    this.initgrnReceivedCols();
    this.greenReceivedDetailsGridItem = [];
    const cropSchemeColumns = [];
    data.map(item => {
      const headerValue = item.CropSchemeFrom + ' ' + item.CropSchemeSign;
      // const fieldValue = 'ConcatenatedItem' + count++;
      // const fieldValue = 'ConcatenatedItem' + item.CropSchemeFrom;
      const fieldValue = item.CropSchemeCode;
      const colAdded = cropSchemeColumns.filter(x => {
        return x.field === fieldValue;
      });
      if (!colAdded || (colAdded && colAdded.length === 0)) {
        // this.grnReceivedCols.push({ header: headerValue, field: fieldValue });
        cropSchemeColumns.push({ field: item.CropSchemeCode, CropSchemeFrom: item.CropSchemeFrom, CropSchemeSign: item.CropSchemeSign });
      }
      const rowAddedAgainstProcurementNo = this.greenReceivedDetailsGridItem.filter(x => {
        return x.HarvestProcurementNo === item.HarvestProcurementNo;
      });
      if (rowAddedAgainstProcurementNo && rowAddedAgainstProcurementNo.length > 0) {
        rowAddedAgainstProcurementNo[0].CropSchemeCodeDetails.push({
          CropNameCode: item.CropNameCode,
          CropSchemeFrom: item.CropSchemeFrom,
          CropSchemeSign: item.CropSchemeSign,
          CropSchemeCode: item.CropSchemeCode,
          HarvestFarmersEntryNo: item.HarvestFarmersEntryNo,
          TotalQuantity: item.FarmerwiseTotalQuantity,
          TotalCrates: item.FarmerwiseTotalCrates
        });
        rowAddedAgainstProcurementNo[0].TotalCrates += item.FarmerwiseTotalCrates;
        rowAddedAgainstProcurementNo[0][fieldValue] = item.FarmerwiseTotalQuantity;
      } else {
        const itemToAdd = {
          HarvestProcurementNo: null,
          FarmerCode: null,
          CropSchemeCodeDetails: [],
          BuyerEmployeeID: null,
          BuyerEmployeeName: null,
          VehicleNo: null,
          TotalCrates: null
        };
        itemToAdd.BuyerEmployeeID = item.BuyerEmployeeID;
        itemToAdd.BuyerEmployeeName = item.BuyerEmployeeName;
        itemToAdd.VehicleNo = item.VehicleNo;
        itemToAdd.TotalCrates = item.FarmerwiseTotalCrates;
        itemToAdd.HarvestProcurementNo = item.HarvestProcurementNo;
        itemToAdd.FarmerCode = item.FarmerCode;
        itemToAdd.CropSchemeCodeDetails.push({
          CropNameCode: item.CropNameCode,
          CropSchemeFrom: item.CropSchemeFrom,
          CropSchemeSign: item.CropSchemeSign,
          CropSchemeCode: item.CropSchemeCode,
          HarvestFarmersEntryNo: item.HarvestFarmersEntryNo,
          TotalQuantity: item.FarmerwiseTotalQuantity,
          TotalCrates: item.FarmerwiseTotalCrates
        });
        this.grnReceivedCols.forEach(col => {
          if (col.field === 'HarvestFormattedDate') {
            itemToAdd[col.field] = this.getFormattedDate(item.HarvestDate);
          } else if (col.field === 'TotalCrates') {
            itemToAdd[col.field] = item.FarmerwiseTotalCrates;
          } else {
            itemToAdd[col.field] = item[col.field];
          }
        });
        cropSchemeColumns.forEach(col => {
          itemToAdd[col.field] = item[col.field];
        });
        itemToAdd[fieldValue] = item.FarmerwiseTotalQuantity;
        this.greenReceivedDetailsGridItem.push(itemToAdd);
      }
    });
    cropSchemeColumns.sort((a, b) => {
      if (a.CropSchemeFrom > b.CropSchemeFrom) {
        return -1;
      } else if (a.CropSchemeFrom < b.CropSchemeFrom) {
        return 1;
      }
      // Else go to the 2nd item
      if (a.CropSchemeSign < b.CropSchemeSign) {
        return -1;
      } else if (a.CropSchemeSign > b.CropSchemeSign) {
        return 1;
      } else { // nothing to split them
        return 0;
      }
    });
    cropSchemeColumns.forEach((item) => {
      const headerValue = item.CropSchemeFrom + ' ' + item.CropSchemeSign;
      const fieldValue = item.field;
      this.grnReceivedCols.push({ header: headerValue, field: fieldValue });
    });
  }

  prepareSummaryReceivedDetailGrid(data: any) {
    this.initsummaryReceivedCols();
    this.summaryReceivedSchemeCodeCols = [];
    this.buyingDetails.HarvestGRNTotalQuantity = 0;
    const cropSchemeColumns = [];
    data.map(item => {
      item.CropSchemeCodeDetails.forEach(cscdetail => {
        const headerValue = cscdetail.CropSchemeFrom + ' ' + cscdetail.CropSchemeSign;
        const fieldValue = cscdetail.CropSchemeCode;
        item[cscdetail.CropSchemeCode] = cscdetail.TotalQuantity;
        const colAdded = cropSchemeColumns.filter(x => {
          return x.field === fieldValue;
        });
        if (!colAdded || (colAdded && colAdded.length === 0)) {
          // this.summaryReceivedCols.push({ header: headerValue, field: fieldValue });
          cropSchemeColumns.push({
            field: cscdetail.CropSchemeCode,
            CropSchemeFrom: cscdetail.CropSchemeFrom,
            CropSchemeSign: cscdetail.CropSchemeSign
          });
          this.summaryReceivedSchemeCodeCols.push({
            CropNameCode: cscdetail.CropNameCode,
            CropSchemeCode: fieldValue,
            TotalQuantity: cscdetail.TotalQuantity
          });
          this.buyingDetails.HarvestGRNTotalQuantity += cscdetail.TotalQuantity;
        } else {
          const colSchemeCodeAdded = this.summaryReceivedSchemeCodeCols.filter(x => {
            return x.CropSchemeCode === fieldValue;
          });
          colSchemeCodeAdded[0].TotalQuantity = Number(Number(colSchemeCodeAdded[0].TotalQuantity + cscdetail.TotalQuantity).toFixed(3));
          this.buyingDetails.HarvestGRNTotalQuantity += cscdetail.TotalQuantity;
        }
      });
    });
    cropSchemeColumns.sort((a, b) => {
      if (a.CropSchemeFrom > b.CropSchemeFrom) {
        return -1;
      } else if (a.CropSchemeFrom < b.CropSchemeFrom) {
        return 1;
      }
      // Else go to the 2nd item
      if (a.CropSchemeSign < b.CropSchemeSign) {
        return -1;
      } else if (a.CropSchemeSign > b.CropSchemeSign) {
        return 1;
      } else { // nothing to split them
        return 0;
      }
    });
    cropSchemeColumns.forEach((item) => {
      const headerValue = item.CropSchemeFrom + ' ' + item.CropSchemeSign;
      const fieldValue = item.field;
      this.summaryReceivedCols.push({ header: headerValue, field: fieldValue });
    });
    this.buyingDetails.HarvestGRNTotalQuantity = Number(Number(this.buyingDetails.HarvestGRNTotalQuantity).toFixed(3));
  }

  prepareDynamicData(dataSource: any, gridType: string) {
    const count = 1;
    dataSource.map(item => {
      const headerValue = item.CropSchemeFrom + ' ' + item.CropSchemeSign;
      // const fieldValue = 'ConcatenatedItem' + count++;
      const fieldValue = 'ConcatenatedItem' + item.CropSchemeFrom;
      if (gridType === 'Green') {
        const colAdded = this.grnReceivedCols.filter(x => {
          return x.header === headerValue;
        });
        if (!colAdded || (colAdded && colAdded.length === 0)) {
          this.grnReceivedCols.push({ header: headerValue, field: fieldValue });
        }
      } else if (gridType === 'Summary') {
        const colAdded = this.summaryReceivedCols.filter(x => {
          return x.header === headerValue;
        });
        if (!colAdded || (colAdded && colAdded.length === 0)) {
          this.summaryReceivedCols.push({ header: headerValue, field: fieldValue });
        }
        item.TotalQuantity = 0;
        item.TotalQuantity += item.FarmerwiseTotalQuantity;
        this.buyingDetails.HarvestGRNTotalQuantity += item.TotalQuantity;
      }
      switch (headerValue) {
        case '1 -':
          item.ConcatenatedItem1 = (gridType === 'Green') ? (item.FarmerwiseTotalQuantity + '/' + item.FarmerwiseTotalCrates)
            : item.FarmerwiseTotalQuantity.toString();
          break;
        case '3 +':
          item.ConcatenatedItem2 = (gridType === 'Green') ? (item.FarmerwiseTotalQuantity + '/' + item.FarmerwiseTotalCrates)
            : item.FarmerwiseTotalQuantity.toString();
      }
      item[fieldValue] = (gridType === 'Green') ? (item.FarmerwiseTotalQuantity + '/' + item.FarmerwiseTotalCrates)
        : item.FarmerwiseTotalQuantity.toString();
    });
  }

  onDataChanged(event, ind) {
    const value = +event.target.value;
    this.buyingDetails.HarvestGRNTotalDespCrates = this.buyingDetails.HarvestGRNTotalDespCrates + value;
    if (ind === this.summaryReceivedSchemeCodeCols.length - 1) {
      this.saveBtn.nativeElement.focus();
    }
    // // console.log(this.buyingDetails.HarvestGRNTotalDespCrates);
    // const cratesData = new HarvestGRNCratesDetail();
  }

  onFocus(event, ind) {
    const value = +event.target.value;
    this.buyingDetails.HarvestGRNTotalDespCrates = this.buyingDetails.HarvestGRNTotalDespCrates - value;
  }

  Reset() {
    try {
      this.selectedTab = 'BuyingDetails';
      this.greenReceivedDetails = [];
      this.summaryDetailsList = [];
      this.selectedGrnData = null;
      this.canShowDetails = false;
      this.greenProcurementSelectionDisabled = false;
      this.GRNEntrySelectionDisabled = false;
      this.weightDetailsList = [];
      this.buyerSchemeWiseDetail = [];
      this.buyerWiseDetail = [];
      this.countWeightDetailsList = [];
      this.cropSchemeListAddedData = [];
      this.resetForm();
      this.AreaID.nativeElement.focus();
      this.initData();
      this.greenReceivedDetailsGridItem = [];
    } catch (error) {
      console.error('Error in GRN Entry Click!', error);
    }
  }

  resetForm() {
    try {
      if (this.ngForm) {
        this.ngForm.reset();
      }
    } catch (error) {
      console.error('Error in Clearing form!', error);
    }
  }

  showSuccess(msg: any) {
    // this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
    this.alertService.success(msg);
  }
  showError(msg: any) {
    // this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
    this.alertService.error(msg);
  }

  prepareSavedCountWeightData(res) {
    this.countWeightDetailsList = [];
    if (res) {
      res.forEach(element => {
        const weightDetailData: BuyerWeightDetails = new BuyerWeightDetails();
        weightDetailData.slNo = this.countWeightDetailsList.length + 1;
        weightDetailData.cropCount = element.cropSchemeCode;
        weightDetailData.noOfCrate = element.noOfCrates;
        weightDetailData.cropCountInfo = element.cropCountInfo;
        weightDetailData.BuyerEmployeeID = element.BuyerEmployeeID;
        weightDetailData.BuyerEmployeeName = element.BuyerEmployeeName;
        weightDetailData.greensProcurementNo = element.greensProcurementNo;
        weightDetailData.Id = element.CWGreensCratewiseEntryNo;
        weightDetailData.isDisabled = true;
        weightDetailData.eachTare = element.eachCrateWt;
        weightDetailData.creatFromNo = element.crateNoFrom;
        weightDetailData.creatToNo = element.crateNoTo;
        weightDetailData.grossWt = element.grossWeight;
        weightDetailData.tareWt = element.tareweight;
        weightDetailData.netWt = element.crateswiseNetWeight;
        weightDetailData.cropSchemeDisabled = true;
        weightDetailData.cropGroupCode = element.cropGroupCode;
        weightDetailData.cropNameCode = element.cropNameCode;
        this.countWeightDetailsList.push(weightDetailData);
      });
    }
  }
  getBuyerSchemeTotal(BuyerEmployeeID, CropSchemeCode) {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      if (element.BuyerEmployeeID === BuyerEmployeeID &&
        element.cropCount === CropSchemeCode) {
        let num = Number(element.netWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  getSchemeTotal(CropSchemeCode) {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      if (element.cropCount === CropSchemeCode) {
        let num = Number(element.netWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }
  getSummaryCrateTotal() {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      let num = Number(element.noOfCrate);
      num = isNaN(num) ? 0 : num;
      Sum += num;
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }
  prepareSummaryReceivingGrid() {
    this.buyerWiseDetail = [];
    let TotalCrates = 0;
    let TotalQuantity = 0;
    if (this.countWeightDetailsList.length > 0) {
      this.countWeightDetailsList.forEach(data => {
        TotalCrates += Number(data.noOfCrate);
        TotalQuantity = Number(Number(TotalQuantity + Number(data.netWt)).toFixed(3));
        const buyerExist = this.buyerWiseDetail.filter(x => {
          return data.BuyerEmployeeID === x.BuyerEmployeeID;
        });
        const cropSchemeExist = this.cropSchemeListAddedData.filter(x => {
          return x.CropSchemeCode === data.cropCount;
        });
        if (!cropSchemeExist || cropSchemeExist.length <= 0) {
          const cropScheme = {
            CropSchemeCode: data.cropCount,
            CropSchemeInfo: data.cropCountInfo
          };
          this.cropSchemeListAddedData.push(cropScheme);
        }
        if (!buyerExist || buyerExist.length <= 0) {
          const buyerWiseSummaryData = {
            BuyerEmployeeName: data.BuyerEmployeeName,
            BuyerEmployeeID: data.BuyerEmployeeID,
            CrateTotal: data.noOfCrate
          };
          this.buyerWiseDetail.push(buyerWiseSummaryData);
        } else {
          buyerExist[0].CrateTotal += data.noOfCrate;
        }
      });
    }
    this.HarvestGrnForm.controls.HarvestGRNTotalQuantity.setValue(TotalQuantity);
    this.HarvestGrnForm.controls.HarvestGRNTotalDespCrates.setValue(TotalCrates);
  }

  GRNEntryClick() {
    this.buyingService.GetGreensReceivedDetailsNew(this.buyingDetails.AreaId,
      this.buyingDetails.EmployeeId).subscribe(res => {
        if (res !== undefined) {
          this.GreenReceivedDetailsWithGrnDetail = res;
          this.greenReceivedDetails = res.greensReceivedDetails;
          this.prepareSavedCountWeightData(res.weightDetails);
          this.prepareGreenReceivedDetailGrid(this.greenReceivedDetails);
          this.HarvestGrnForm.controls.HarvestGRNNo.setValue(this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo);
          this.HarvestGrnForm.controls.AreaName.setValue(this.buyingDetails.AreaName);
          this.HarvestGrnForm.controls.EmpName.setValue(this.buyingDetails.EmpName);
        }
        // console.log('All Greens', res);
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Greens');
      });
  }

  greenProcurementClick() {

  }
  updateDateFormate(dateUpdate) {
    try {
      const date = new Date(dateUpdate);
      const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      return formattedDate;
    } catch (error) {
      // console.log('updateDateFormate', error);
    }
  }
  saveDetails() {
    try {
      const harvestGrnObj = {
        HarvestGRNNo: this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo,
        HarvestGRNDate: this.updateDateFormate(this.HarvestGrnForm.controls.HarvestGRNDate.value),
        GreensTransVehicleDespNo: this.HarvestGrnForm.controls.VechicalNo.value.greensTransVehicleDespNo,
        DriverName: this.HarvestGrnForm.controls.DriverName.value,
        // DriverContactNo: this.HarvestGrnForm.controls.DriverContactNo.value,
        VehicleStartTime: this.getFormattedDateWithtime(this.HarvestGrnForm.controls.VehicalStartTime.value),
        VehicleStartingReading: this.HarvestGrnForm.controls.VechicalStartingReading.value,
        VehicleFreight: this.HarvestGrnForm.controls.VehicalFreight.value,
        OrgOfficeNo: this.HarvestGrnForm.controls.OrgOfficeNo.value,
        HarverstGRNRemarks: this.HarvestGrnForm.controls.HarvestGRNRemarks.value
      };
      this.buyingService.completeGRNMaterialDetails(harvestGrnObj)
        .subscribe(res => {
          if (res) {
            this.showSuccess('GRN cum Material Classification Saved Successfully');
            this.selectedGrnData = null;
            this.greenProcurementSelectionDisabled = false;
            this.GRNEntrySelectionDisabled = false;
            this.GreenReceivedDetailsWithGrnDetail = null;
            this.cropNameGroupDisabled = true;
            this.greenReceivedDetails = [];
            this.weightDetailsList = [];
            this.buyerSchemeWiseDetail = [];
            this.buyerWiseDetail = [];
            this.countWeightDetailsList = [];
            this.cropSchemeListAddedData = [];
            this.greenReceivedDetailsGridItem = [];
            this.summaryReceivedSchemeCodeCols = [];
            this.weightDetails = null;
            this.initgrnReceivedCols();
            this.initsummaryReceivedCols();
            this.HarvestGrnForm.reset();
            this.selectedTab = 'BuyingDetails';
          }
        },
          error => {
            // console.log('Error while saving GRN cum Material Classification details', error);
            this.showError(error);
          });
    } catch (ex) {
      // console.log('Error on save Details:', ex);
    }
  }

  getCropGroup() {
    this.dailyGreensReceivingDetailService.getCropGroup().subscribe((res: any) => {
      this.cropGroupList = res;
      this.cropGroupList.sort((a, b) => a.Name.localeCompare(b.Name));
    },
      error => {
        this.alertService.error('error fetching crop group');
      });
  }

  getCropNameCodeList(event) {
    this.dailyGreensReceivingDetailService.getCropName(event).subscribe((res: any) => {
      this.cropNameList = res;
      this.cropNameList.sort((a, b) => a.name.localeCompare(b.name));
    },
      error => {
        this.alertService.error('error fetching crop name');
      });
  }

  getCropSchemes(event) {
    this.dailyGreensReceivingDetailService.getCropSchemes(event).subscribe((res: any) => {
      this.cropSchemeList = res;
      this.cropNameGroupDisabled = true;
      this.initializeWeightDetailInput();
    },
      error => {
        this.alertService.error('Error fetching crop scheme');
      });
  }

  initializeWeightDetailInput() {
    this.weightDetailsList = [];
    const weightDetails: BuyerWeightDetails = new BuyerWeightDetails();
    weightDetails.BuyerEmployeeID = this.selectedGrnData.BuyerEmployeeID;
    weightDetails.BuyerEmployeeName = this.selectedGrnData.BuyerEmployeeName;
    weightDetails.greensProcurementNo = this.selectedGrnData.HarvestProcurementNo;
    weightDetails.cropGroupCode = this.cropGroup;
    weightDetails.cropNameCode = this.cropName;
    this.weightDetailsList.push(weightDetails);
  }

  getNoOfCrate(event, weightDetails) {
    weightDetails.noOfCrate = isNaN(event.target.value) ? '' : Math.round(Number(event.target.value));
  }
  getcreatFromNo(event, weightDetails) {
    weightDetails.creatFromNo = isNaN(event.target.value) ? '' : Math.round(Number(event.target.value));
  }
  getcreatToNo(event, weightDetails) {
    weightDetails.creatToNo = isNaN(event.target.value) ? '' : Math.round(Number(event.target.value));
  }

  geteachTrae(event, weightDetails) {
    // // console.log('this.weightDetailsList', weightDetails);
    weightDetails.eachTare = isNaN(event.target.value) ? '' : event.target.value;
    const eachTare = isNaN(event.target.value) ? 0 : Number(event.target.value);
    // tslint:disable-next-line: radix
    const tareWt = eachTare * Number(weightDetails.noOfCrate);
    weightDetails.tareWt = tareWt.toFixed(3);

  }
  calcNetWt(event, weightDetails) {
    weightDetails.grossWt = isNaN(event.target.value) ? '' : event.target.value;
    let grsWt = Number(event.target.value);
    grsWt = isNaN(grsWt) ? 0 : grsWt;
    let trWt = Number(weightDetails.tareWt);
    trWt = isNaN(trWt) ? 0 : trWt;
    const netWt = grsWt - trWt;
    weightDetails.netWt = netWt.toFixed(3);
  }
  selectedcropScheme(event, weightDetails) {
    this.cropSchemeList.forEach(element => {
      if (element.Code === event) {
        weightDetails.cropCount = event;
        weightDetails.cropCountInfo = element.From.toString() + ' ' + element.Sign + ' / ' + element.Count;
      }
    });
  }

  showPopup(event, weightDetails) {
    if (weightDetails.cropCount !== undefined && weightDetails.noOfCrate !== undefined
      && weightDetails.eachTare !== undefined && weightDetails.grossWt !== undefined) {
      this.weightDetails = weightDetails;
      $('#AddMoreData').modal('show');
      setTimeout(() => this.continueBtn.nativeElement.focus(), 100);
    }
  }

  closePopup() {
    $('#AddMoreData').modal('hide');
  }

  ThreeDigitDecimalNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,5}\.?\d{0,3}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  OnlyNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,4}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  getBuyerCrateTotal(BuyerEmployeeID, cropSchemeCode) {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
        element.BuyerEmployeeID === BuyerEmployeeID &&
        element.cropCount === cropSchemeCode) {
        let num = Number(element.noOfCrate);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  getBuyerNetWtTotal(BuyerEmployeeID, cropSchemeCode) {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
        element.BuyerEmployeeID === BuyerEmployeeID &&
        element.cropCount === cropSchemeCode) {
        let num = Number(element.netWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  addWeightDetails(completeBuyer) {
    try {
      this.weightDetails.isDisabled = true;
      return new Observable((obs) => {
        const weightDetail = {
          HarvestGRNNo: this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo,
          BuyerEmployeeID: this.selectedGrnData.BuyerEmployeeID,
          CWGreensCratewiseEntryNo: this.weightDetails.Id,
          greensProcurementNo: this.selectedGrnData.HarvestProcurementNo,
          cropSchemeCode: this.weightDetails.cropCount,
          noOfCrates: Number(this.weightDetails.noOfCrate),
          eachCrateWt: Number(this.weightDetails.eachTare),
          crateNoFrom: Number(this.weightDetails.creatFromNo),
          crateNoTo: Number(this.weightDetails.creatToNo),
          grossWeight: Number(this.weightDetails.grossWt),
          tareweight: Number(this.weightDetails.tareWt),
          crateswiseNetWeight: Number(this.weightDetails.netWt),
          cropGroupCode: this.cropGroup,
          cropNameCode: this.cropName,
          completeBuyer: completeBuyer ? 1 : 0
        };
        this.buyingService.AddBuyerQuantityCratewiseDetail(weightDetail).subscribe((res: any) => {
          this.weightDetails.Id = res.CWGreensCratewiseEntryNo;
          const countWeightDetail = this.countWeightDetailsList.filter((x) => {
            return x.Id === this.weightDetails.Id;
          });
          if (countWeightDetail.length > 0) {
            this.countWeightDetailsList.splice(this.countWeightDetailsList.indexOf(countWeightDetail[0]), 1);
          }
          this.countWeightDetailsList.push(this.weightDetails);
          let ttlCrate = 0;
          let ttlQty = 0;
          ttlCrate = Number(this.getBuyerCrateTotal(this.selectedGrnData.BuyerEmployeeID, this.weightDetails.cropCount));
          ttlQty = Number(this.getBuyerNetWtTotal(this.selectedGrnData.BuyerEmployeeID, this.weightDetails.cropCount));
          ttlQty = Number(ttlQty.toFixed(3));
          const updateBuyerCount = this.buyerSchemeWiseDetail.filter((x) => {
            return x.HarvestGRNNo === this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo &&
              x.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
              x.cropCount === this.weightDetails.cropCount;
          });
          updateBuyerCount[0].totalCrate = ttlCrate;
          updateBuyerCount[0].totalQuantity = ttlQty;
          obs.next();
          obs.complete();
        },
          error => {
            this.weightDetails.isDisabled = false;
            obs.error();
            this.alertService.error('Error adding weight details');
          });
      });
    } catch (error) {
      this.weightDetails.isDisabled = false;
      this.alertService.error('Error adding weight details');
    }

  }
  addBuyerSchemeWiseDetail() {
    try {
      return new Observable((obs) => {
        const frmr = this.buyerSchemeWiseDetail.filter(x => {
          return x.HarvestGRNNo === this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo &&
            x.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
            x.cropCount === this.weightDetails.cropCount;
        });
        if (frmr && frmr.length > 0) {
          // Do nothing for now.
        } else {
          const frmrDetail = {
            slNo: this.buyerSchemeWiseDetail.length + 1,
            buyerrName: this.selectedGrnData.BuyerEmployeeName,
            BuyerEmployeeID: this.selectedGrnData.BuyerEmployeeID,
            cropCountInfo: this.weightDetails.cropCountInfo,
            cropCount: this.weightDetails.cropCount,
            totalCrate: 0,
            totalQuantity: 0,
            HarvestGRNNo: this.GreenReceivedDetailsWithGrnDetail.HarvestGRNNo,
            Id: 0,
            cropGroupCode: this.cropGroup,
            cropNameCode: this.cropName
          };
          this.buyerSchemeWiseDetail.push(frmrDetail);
        }
        obs.next();
        obs.complete();
      });
    } catch (error) {

    }

  }
  continueToAddCount() {
    $('#AddMoreData').modal('hide');
    forkJoin(
      this.addWeightDetails(false),
      this.addBuyerSchemeWiseDetail()).subscribe(() => {
        const weightDetailData: BuyerWeightDetails = new BuyerWeightDetails();
        weightDetailData.slNo = this.weightDetailsList.length + 1;
        weightDetailData.cropCount = this.weightDetails.cropCount;
        weightDetailData.cropGroupCode = this.weightDetails.cropGroupCode;
        weightDetailData.cropNameCode = this.weightDetails.cropNameCode;
        weightDetailData.eachTare = this.weightDetails.eachTare;
        weightDetailData.cropCountInfo = this.weightDetails.cropCountInfo;
        weightDetailData.BuyerEmployeeID = this.selectedGrnData.BuyerEmployeeID;
        weightDetailData.BuyerEmployeeName = this.selectedGrnData.BuyerEmployeeName;
        weightDetailData.greensProcurementNo = this.selectedGrnData.HarvestProcurementNo;
        weightDetailData.cropSchemeDisabled = true;
        this.weightDetailsList.push(weightDetailData);
      });
  }

  changeCountdata() {
    $('#AddMoreData').modal('hide');
    forkJoin(
      this.addWeightDetails(false),
      this.addBuyerSchemeWiseDetail()).subscribe(() => {
        this.cropNameGroupDisabled = false;
        this.initializeWeightDetailInput();
      });
  }

  completeBuyer() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to complete weighment for the selected buyer?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        $('#AddMoreData').modal('hide');
        forkJoin(
          this.addWeightDetails(true),
          this.addBuyerSchemeWiseDetail()).subscribe(() => {
            this.greenProcurementSelectionDisabled = false;
            this.cropNameGroupDisabled = false;
            this.weightDetailsList = [];
            this.buyerSchemeWiseDetail = [];
            const harvestProcItem = this.greenReceivedDetailsGridItem.filter((x) => {
              return x.HarvestProcurementNo === this.selectedGrnData.HarvestProcurementNo;
            });
            if (harvestProcItem.length > 0) {
              this.greenReceivedDetailsGridItem.splice(this.greenReceivedDetailsGridItem.indexOf(harvestProcItem[0]), 1);
              this.selectedGrnData = null;
            }
            this.selectedTab = 'BuyingDetails';
          });
      }
    });

  }

  goToSummary() {
    $('#AddMoreData').modal('hide');
    forkJoin(
      this.addWeightDetails(true),
      this.addBuyerSchemeWiseDetail()).subscribe(() => {
        this.weightDetailsList = [];
        this.buyerSchemeWiseDetail = [];
        this.prepareSummaryReceivingGrid();
        this.selectedTab = 'SummaryReceivedDetails';
      });
  }

  getCrateTotal(buyerWise, cropCount) {
    let Sum = 0;
    if (buyerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
          element.cropCount === cropCount) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (buyerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.cropCount === cropCount) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  getGrossWtTotal(buyerWise, cropCount) {
    let Sum = 0;
    if (buyerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
          element.cropCount === cropCount) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (buyerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.cropCount === cropCount) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  getTareWtTotal(buyerWise, cropCount) {
    let Sum = 0;
    if (buyerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
          element.cropCount === cropCount) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (buyerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.cropCount === cropCount) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  getNetWtTotal(buyerWise, cropCount) {
    let Sum = 0;
    if (buyerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID &&
          element.cropCount === cropCount) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (buyerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.BuyerEmployeeID === this.selectedGrnData.BuyerEmployeeID) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo &&
          element.cropCount === cropCount) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        if (element.greensProcurementNo === this.selectedGrnData.HarvestProcurementNo) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  summaryformCreation() {
    try {
      this.HarvestGrnForm = this.formBuilder.group({
        AreaName: [''],
        EmpName: [''],
        HarvestGRNDate: ['', [Validators.required]],
        HarvestGRNNo: [''],
        VechicalNo: ['', [Validators.required]],
        DriverName: ['', [Validators.required]],
        // DriverContactNo: ['', [Validators.required]],
        VechicalStartingReading: ['', [Validators.required]],
        VehicalStartTime: ['', [Validators.required]],
        VehicalFreight: ['', [Validators.required]],
        HarvestGRNTotalQuantity: [''],
        HarvestGRNTotalDespCrates: [''],
        OrgOfficeNo: ['', [Validators.required]],
        HarvestGRNRemarks: ['', [Validators.required]]
      });

      this.HarvestGrnForm.controls.AreaName.disable();
      this.HarvestGrnForm.controls.EmpName.disable();
      this.HarvestGrnForm.controls.HarvestGRNNo.disable();
      this.HarvestGrnForm.controls.HarvestGRNTotalQuantity.disable();
      this.HarvestGrnForm.controls.HarvestGRNTotalDespCrates.disable();
    } catch (error) {
    }
  }

  grnEntryformCreation() {
    try {
      this.GrnEntryForm = this.formBuilder.group({
        AreaID: ['', [Validators.required]],
        AreaIncharge: ['', [Validators.required]],
        WeighmentMode: ['', [Validators.required]]
      });

    } catch (error) {
    }
  }

  onChangeVehicleNo(event) {
    // console.log(event);
    this.HarvestGrnForm.controls.DriverName.setValue(event.value.driverName);
    if (isNaN(event.value.vehicleReading)) {
      this.HarvestGrnForm.controls.VechicalStartingReading.markAsTouched();
    } else {
      this.HarvestGrnForm.controls.VechicalStartingReading.setValue(event.value.vehicleReading);
    }



  }
}
