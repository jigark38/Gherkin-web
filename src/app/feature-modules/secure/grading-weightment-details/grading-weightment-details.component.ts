import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { UnitNameLocations, GreenReceptionGridModel, GreensGradingInwardDetails, GreensGradedHarvestGRNDetails, GreensGradingWeighmentDetails, GreensGradingQuantityDetails } from './grading-weightment-details.model';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
  MatSelect,
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import moment from 'moment';
import { GradingWeightmentDetailsService } from './grading-weightment-details.service';
import { DatePipe } from '@angular/common';
import { Crops } from '../../agri-management/master/crops-and-schemes/crops-and-schemes.model';
import { ActionParams } from 'src/app/shared/components/ng-grid/grid.models';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY HH:mm A',
  },
  display: {
    dateInput: 'MM/DD/YYYY HH:mm A',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-grading-weightment-details',
  templateUrl: './grading-weightment-details.component.html',
  styleUrls: ['./grading-weightment-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GradingWeightmentDetailsComponent implements OnInit {

  @ViewChild('weightmentModeFocus', { read: ElementRef, static: false }) weightmentModeFocus: ElementRef;
  @ViewChild('cropSchemeCodeFocus', { read: ElementRef, static: false }) cropSchemeCodeFocus: ElementRef;
  @ViewChild('cropNameDDL', { read: MatSelect, static: false }) cropNameDDL: MatSelect;
  @ViewChild('saveBtn', { read: ElementRef, static: false }) saveBtn: ElementRef;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  displayDialog = false;
  gradingMaterialDetailsForm: FormGroup;
  greensGradingInwardDetails: GreensGradingInwardDetails;
  greensGradingWeighmentDetailsList: Array<GreensGradingWeighmentDetails>;
  greensGradingQuantityDetailsList: Array<GreensGradingQuantityDetails>;
  selectedTab: string = 'ReceptionDetails';
  unitNameLocation: UnitNameLocations;
  unitNameLocations: UnitNameLocations[];
  greenReceptionDetailsgridActionParams: ActionParams;
  greenReceptionDetailsCols: any;
  greenReceptionGridDatas: Array<GreenReceptionGridModel>;
  selectedHarvestGrnDetails: Array<GreensGradedHarvestGRNDetails>;
  selectedGRNNumbers: string;
  cropGroupList: any[] = [];
  crops: any[] = [];
  grades: any[] = [];
  grid3data: Array<GreensGradingWeighmentDetails>;

  gridCatesTotal: number = 0;
  gridCratesTareWt: number = 0;
  gridTareWt: number = 0;

  GradBtnDisable: boolean = false;
  isNextClicked: boolean = false;
  min = 0;
  max = 10;
  clickedBtn = "";
  disablecropSchemeCode: boolean = false;
  disableotherscropSchemeCode: boolean = false;
  ispushRowClicked: boolean = false;
  ischangeGradeCallClicked: boolean = false;
  IsonGridDrpDownChange: boolean = false;
  IssetFocusOnSaveButton: boolean = false;
  constructor(
    private readonly formBuilder: FormBuilder,
    private alertService: AlertService,
    private gradingWeightmentDetailsService: GradingWeightmentDetailsService,
    private datePipe: DatePipe,
  ) {
    this.Reset();
    this.greenReceptionGridDatas = new Array<GreenReceptionGridModel>();
  }

  ngOnInit() {
    this.greenReceptionDetailsCols = [
      { field: 'harvestGRNDate', header: 'GRN Date' },
      { field: 'harvestGRNNo', header: 'GRN No' },
      { field: 'areaName', header: 'Area Name' },
      { field: 'cropName', header: 'Crop Name' },
      { field: 'totalReceivedQty', header: 'Quantity' },
      { field: 'isOnGoing', header: 'Is OnGoing' }
    ];

    this.gradingMaterialDetailsForm = this.formBuilder.group({
      receivingUnitF: ['', [Validators.required]],
      cropGroupNameF: ['', [Validators.required]],
      grnNumberF: ['', [Validators.required]],
      cropNameF: ['', [Validators.required]],
      noOfCratesF: [0, [Validators.required]],
      totalQuantityF: [0, [Validators.required]],
      WeightModeF: ['', [Validators.required]],
    });

  }

  Reset() {
    this.selectedTab = 'ReceptionDetails'
    this.selectedHarvestGrnDetails = [];
    this.greensGradingWeighmentDetailsList = [];
    this.greensGradingQuantityDetailsList = [];
    this.greensGradingInwardDetails = new GreensGradingInwardDetails();
    this.greenReceptionGridDatas = [];
    this.greenReceptionDetailsgridActionParams = new ActionParams();
    this.greenReceptionDetailsgridActionParams.enabled = true;
    this.greenReceptionDetailsgridActionParams.showCheckbox = true;
    this.grid3data = [];
    this.GradBtnDisable = false;
    this.isNextClicked = false;
    this.gridCatesTotal = 0;
    this.gridCratesTareWt = 0;
    this.gridTareWt = 0;
    this.disablecropSchemeCode = false;
    this.disableotherscropSchemeCode = false;
    this.ispushRowClicked = false;
    this.ischangeGradeCallClicked = false;
    this.IsonGridDrpDownChange = false;
    this.IssetFocusOnSaveButton = false;
  }

  resetForm() {

  }

  GradBtnClick() {
    this.GradBtnDisable = true;
    this.getLocationsForDropDown();
  }

  onTabChange(event) {
    if (event === 1) {
      this.selectedTab = 'ReceptionDetails';
    } else {
      this.selectedTab = 'MaterialDetails';
    }
  }

  getLocationsForDropDown() {
    this.gradingWeightmentDetailsService.getLocationsForDropDown().subscribe((data: any) => {
      if (data.IsSucceed) {
        this.unitNameLocations = data.Data;
      }
    },
      (err) => {
        this.alertService.error(
          'Error has occured while fetching UnitName.'
        );
      });
  }

  getGreenReceptionGridData(orgofficeNo: number) {
    this.gradingWeightmentDetailsService.getGreenReceptionGridData(orgofficeNo).subscribe(
      (data: any) => {
        if (data) {
          this.greenReceptionGridDatas = data.Data;
        }
      },
      (err) => {
        this.alertService.error(
          'Error has occured while Data For Grid One.'
        );
      }
    );
  }

  unitNameChange(event) {
    this.getGreenReceptionGridData(event.value.OrgOfficeNo);
    this.greensGradingInwardDetails.orgOfficeNo = event.value.OrgOfficeNo;
    this.greensGradingInwardDetails.orgOfficeName = event.value.OrgOfficeName;
  }

  onCheckboxChange(event, item) {
    this.checkboxes['_results'].forEach((element) => {
      if (item.isOnGoing == true && event.source.id != element.id) {
        element.checked = false;
      } else if (item.isOnGoing == false) {

      }
    });
    if (event.checked) {
      this.selectedHarvestGrnDetails = [];
      this.greenReceptionGridRadioClick(item);
    }
    else {
      this.removeUnselectedGRNNumber(item);
    }
  }

  greenReceptionGridRadioClick(gridData: any) {

    if (gridData.isOnGoing == true) {
      this.gradingWeightmentDetailsService.getGreensGradingByGrdNo(gridData.greensGradeNo).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.greensGradingInwardDetails = new GreensGradingInwardDetails();
          this.greensGradingInwardDetails = res.Data;

          this.selectedHarvestGrnDetails = res.Data.greensGradedHarvestGRNDetailsList;
          this.greensGradingWeighmentDetailsList = res.Data.greensGradingWeighmentDetailsList;
          this.greensGradingQuantityDetailsList = res.Data.greensGradingQuantityDetailsList;
          this.grid3data = [];
          this.selectedHarvestGrnDetails.forEach(element => {
            if (element.harvestGRNNo) {
              if (this.greenReceptionGridDatas.some(x => x.harvestGRNNo == element.harvestGRNNo)) {
                this.greenReceptionGridDatas.filter(f => f.harvestGRNNo == element.harvestGRNNo)[0].isSelected = true;
              }
            } else {
              if (this.greenReceptionGridDatas.some(x => x.greensProcurementNo == element.greensProcurementNo)) {
                this.greenReceptionGridDatas.filter(f => f.greensProcurementNo == element.greensProcurementNo)[0].isSelected = true;
              }
            }

          });
          this.cropGroupNameChange(this.greensGradingInwardDetails.cropGroupCode);
          this.cropNameChange(this.greensGradingInwardDetails.cropNameCode);
          this.addGrid3Row();
        }
        else {
          this.alertService.error(
            'Error has occured while getting saved details.'
          );
        }
      })
    }
    else {
      let data = new GreensGradedHarvestGRNDetails();
      data.AreaId = gridData.areaID;
      data.areaName = gridData.areaName;
      data.cropName = gridData.cropName;
      data.gradedHarvestGRNNo = 0;
      data.greensGradeNo = 0;
      data.harvestGRNNo = gridData.harvestGRNNo;
      data.greensProcurementNo = gridData.greensProcurementNo;
      data.status = true;
      this.selectedHarvestGrnDetails.push(data);
    }

  }

  removeUnselectedGRNNumber(event) {
    if (event.harvestGRNNo) {

      const ind = this.selectedHarvestGrnDetails.findIndex(x => x.harvestGRNNo === event.harvestGRNNo);
      if (ind > -1) {
        this.selectedHarvestGrnDetails.splice(ind, 1);
      }
    } else {
      const ind = this.selectedHarvestGrnDetails.findIndex(x => x.greensProcurementNo === event.greensProcurementNo);
      if (ind > -1) {
        this.selectedHarvestGrnDetails.splice(ind, 1);
      }
    }
  }

  next() {
    debugger
    this.selectedTab = 'MaterialDetails'
    this.isNextClicked = true;
    this.selectedGRNNumbers = this.selectedHarvestGrnDetails.map((obj) => obj.harvestGRNNo).join(", ");
    this.gradingMaterialDetailsForm.controls.receivingUnitF.disable();
    this.gradingMaterialDetailsForm.controls.grnNumberF.disable();
    this.gradingWeightmentDetailsService.getCropGroup().subscribe(
      (data) => {
        this.cropGroupList = data;
        setTimeout(() => this.cropNameDDL.focus(), 1000);
      },
      (err) => {
        this.alertService.error(
          'Error has occured while fetching Crop Group Details.'
        );
      }
    );
  }

  cropNameChange(cropNameCode: string) {
    this.gradingWeightmentDetailsService.getCropSchemes(cropNameCode).subscribe(
      (data) => {
        this.grades = data;
        if (this.greensGradingQuantityDetailsList.length > 0) {
          // this.grades = this.grades.filter(x => !this.greensGradingQuantityDetailsList.map(y => y.cropSchemeCode).includes(x.Code));
        }
        this.disableotherscropSchemeCode = true;
        setTimeout(() => this.weightmentModeFocus.nativeElement.focus(), 500);
        // if (this.grades.length > 0) {
        //   this.grid3data = [];
        //   this.addGrid3Row();
        // }
      },
      (err) => {
        console.log(err);
        this.alertService.error(
          'Error has occured while fetching Crop Schemes.'
        );
      }
    )
  }

  cropGroupNameChange(cropGroupCode: string) {
    this.gradingWeightmentDetailsService.getCropListByCropGroupCode(cropGroupCode).subscribe(
      (data: Crops[]) => {
        this.crops = data;
      },
      (err) => {
        this.alertService.error(
          'Error has occured while fetching Crop Details.'
        );
      }
    )
  }

  addGrid3Row() {
    debugger
    // var grades = this.grades.filter(x => x.Code === this.grid3data[0].cropSchemeCode);
    let gridRow = new GreensGradingWeighmentDetails();
    // gridRow.from = grades[0].From;
    // gridRow.sign = grades[0].Sign;
    // gridRow.count = grades[0].Count;
    if (this.grid3data.length > 0) {
      const length = this.grid3data.length;
      const index = length - 1;
      gridRow.cropSchemeCode = this.grid3data[index].cropSchemeCode;
      this.grid3data[index].isDisabled = true;
      this.disablecropSchemeCode = true;
      //  this.disableotherscropSchemeCode = false;
    }
    // else {
    //   this.disableotherscropSchemeCode = true;
    // }
    gridRow.gmWeightNoofCrates = 0;
    gridRow.gmCratesTareWeight = 0;
    gridRow.gmWeightTareWeight = 0;
    gridRow.gmWeightGrossWeight = 0;
    gridRow.hmWeightNetWeight = 0.000;
    gridRow.isDisabled = false;

    this.grid3data.push(gridRow);
    setTimeout(() => this.cropSchemeCodeFocus.nativeElement.focus(), 500);
  }

  pushRow() {
    debugger
    this.clickedBtn = "one";
    this.ispushRowClicked = true;
    this.displayDialog = false;
    this.greensGradingWeighmentDetailsList = this.grid3data;
    debugger
    //this.grades
    let gradingQuantity = new GreensGradingQuantityDetails();
    if (this.greensGradingQuantityDetailsList.length > 0 && this.grid3data[0].cropSchemeCode) {
      debugger
      //const existIndex1 = this.greensGradingQuantityDetailsList.findIndex(x => x.cropSchemeCode === this.grid3data[0].cropSchemeCode);
      const exist = this.greensGradingQuantityDetailsList.filter(x => x.cropSchemeCode === this.grid3data[0].cropSchemeCode);
      if (exist.length > 0) {
        const length = this.grid3data.length;
        const index = length - 1;
        const greensGradinglength = this.greensGradingQuantityDetailsList.length;
        const greensGradingindex = greensGradinglength - 1;
        if (this.grid3data[index].cropSchemeCode === this.greensGradingQuantityDetailsList[greensGradingindex].cropSchemeCode) {
          let gmWeightNoofCrates = parseInt(this.greensGradingQuantityDetailsList[greensGradingindex].gradingNoofCrates.toString());
          let gmWeightNoofCratesadd = parseInt(this.grid3data[index].gmWeightNoofCrates.toString());

          let hmWeightNetWeight = parseInt(this.grid3data[index].hmWeightNetWeight.toString());
          let hmWeightNetWeightadd = parseInt(this.greensGradingQuantityDetailsList[greensGradingindex].quantityAfterGradingTotal.toString());
          // let gmCratesTareWeight = parseInt(this.grid3data[index].gmCratesTareWeight.toString());
          // let gmCratesTareWeightadd = parseInt(this.greensGradingQuantityDetailsList[greensGradingindex].quantityAfterGradingTotal.toString());

          const gradingNoofCrates = (gmWeightNoofCrates + gmWeightNoofCratesadd);

          const quantityAfterGradingTotal = (hmWeightNetWeight + hmWeightNetWeightadd);
          // const quantityAfterGradingTotal = (gmCratesTareWeight + gmCratesTareWeightadd);

          this.greensGradingQuantityDetailsList[greensGradingindex].gradingNoofCrates = gradingNoofCrates;
          this.greensGradingQuantityDetailsList[greensGradingindex].quantityAfterGradingTotal = quantityAfterGradingTotal;
        }
        //gridRow.cropSchemeCode = this.grid3data[index].cropSchemeCode;
      }
      else {
        var grades = this.grades.filter(x => x.Code === this.grid3data[0].cropSchemeCode);
        gradingQuantity.greensGradingQtyNo = 0;
        gradingQuantity.gradingNoofCrates = this.grid3data[0].gmWeightNoofCrates;

        // gradingQuantity.quantityAfterGradingTotal = this.grid3data[0].gmCratesTareWeight;
        gradingQuantity.quantityAfterGradingTotal = this.grid3data[0].hmWeightNetWeight;

        gradingQuantity.greensGradeNo = this.grid3data[0].greensGradeNo;
        gradingQuantity.cropNameCode = this.grid3data[0].cropNameCode;
        gradingQuantity.cropSchemeCode = this.grid3data[0].cropSchemeCode;
        gradingQuantity.sign = grades[0].Sign;
        gradingQuantity.from = grades[0].From;
        gradingQuantity.count = grades[0].Count;
        this.greensGradingQuantityDetailsList.push(gradingQuantity);
      }

    }
    else if (this.greensGradingQuantityDetailsList.length == 0) {
      var grades = this.grades.filter(x => x.Code === this.grid3data[0].cropSchemeCode);
      gradingQuantity.greensGradingQtyNo = 0;
      gradingQuantity.gradingNoofCrates = this.grid3data[0].gmWeightNoofCrates;

      //gradingQuantity.quantityAfterGradingTotal = this.grid3data[0].gmCratesTareWeight;
      gradingQuantity.quantityAfterGradingTotal = this.grid3data[0].hmWeightNetWeight;

      gradingQuantity.greensGradeNo = this.grid3data[0].greensGradeNo;
      gradingQuantity.cropNameCode = this.grid3data[0].cropNameCode;
      gradingQuantity.cropSchemeCode = this.grid3data[0].cropSchemeCode;
      gradingQuantity.sign = grades[0].Sign;
      gradingQuantity.from = grades[0].From;
      gradingQuantity.count = grades[0].Count;
      this.greensGradingQuantityDetailsList.push(gradingQuantity);
    }

    let totlCrates = 0;
    let totlWeit = 0;
    this.greensGradingQuantityDetailsList.forEach(obj => {
      if (!isNaN(obj.quantityAfterGradingTotal)) {
        totlWeit = totlWeit + +obj.quantityAfterGradingTotal;
      }
      if (!isNaN(obj.gradingNoofCrates)) {
        totlCrates = totlCrates + +obj.gradingNoofCrates;
      }
    });
    this.greensGradingInwardDetails.gradedTotalCrates = totlCrates;
    this.greensGradingInwardDetails.gradedTotalQuantity = totlWeit;

    this.saveData();

    // let gridRow = new GreensGradingWeighmentDetails();
    // gridRow.cropSchemeCode = this.grid3data[0].cropSchemeCode;
    // gridRow.gmWeightTareWeight = 0
    // gridRow.hmWeightNetWeight = 0.000
    // this.grid3data.push(gridRow);
  }

  grosWetFocusOut(data) {
    debugger
    if (this.IsonGridDrpDownChange && data.gmWeightNoofCrates > 0 && data.gmCratesTareWeight > 0 && data.gmWeightGrossWeight > 0) {
      this.displayDialog = true;
    }
    else {
      data.gmWeightGrossWeight = 0;
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

  changeGradeCall() {

    // this.clickedBtn = "two";
    // this.greensGradingWeighmentDetailsList.concat(this.grid3data);
    // let qtyDetail = new GreensGradingQuantityDetails;
    // qtyDetail.cropNameCode = this.grid3data[0].cropNameCode;
    // qtyDetail.cropSchemeCode = this.grid3data[0].cropSchemeCode;

    // let noOfCrates = 0;
    // let weigh = 0;
    // this.grid3data.forEach(obj => {
    //   if (!isNaN(obj.gmWeightNoofCrates)) {
    //     noOfCrates = noOfCrates + +obj.gmWeightNoofCrates;
    //   }
    //   if (!isNaN(obj.hmWeightNetWeight)) {
    //     weigh = weigh + +obj.hmWeightNetWeight;
    //   }
    // });
    // qtyDetail.gradingNoofCrates = noOfCrates;
    // qtyDetail.quantityAfterGradingTotal = weigh;

    // this.greensGradingQuantityDetailsList.push(qtyDetail);
    // this.grades = this.grades.filter(x => !this.greensGradingQuantityDetailsList.map(y => y.cropSchemeCode).includes(x.Code));
    // let totlCrates = 0;
    // let totlWeit = 0;
    // this.greensGradingQuantityDetailsList.forEach(obj => {
    //   if (!isNaN(obj.quantityAfterGradingTotal)) {
    //     totlWeit = totlWeit + +obj.quantityAfterGradingTotal;
    //   }
    //   if (!isNaN(obj.gradingNoofCrates)) {
    //     totlCrates = totlCrates + +obj.gradingNoofCrates;
    //   }
    // });
    // this.greensGradingInwardDetails.gradedTotalCrates = totlCrates;
    // this.greensGradingInwardDetails.gradedTotalQuantity = totlWeit;

    // this.grid3data = [];
    // this.displayDialog = false;

    // this.saveData();

    if (this.grades.length > 0) {
      const length = this.grid3data.length;
      const index = length - 1;
      this.grid3data[index].isDisabled = true;
    }
    this.ischangeGradeCallClicked = true;
    this.pushRow();
  }

  WeightedModeChange() {
    if (this.grades.length > 0) {
      this.grid3data = [];
      this.gridCatesTotal = 0;
      this.gridCratesTareWt = 0;
      this.gridTareWt = 0;
      this.addGrid3Row();
    }
  }

  saveData() {

    this.greensGradingInwardDetails.weighmentMode = this.gradingMaterialDetailsForm.controls.WeightModeF.value;
    this.greensGradingInwardDetails.greensGradingWeighmentDetailsList = this.greensGradingWeighmentDetailsList;
    this.greensGradingInwardDetails.greensGradedHarvestGRNDetailsList = this.selectedHarvestGrnDetails;
    this.greensGradingInwardDetails.greensGradingQuantityDetailsList = this.greensGradingQuantityDetailsList;
    if (this.ispushRowClicked != false && this.ischangeGradeCallClicked != false) {
      console.log(this.ispushRowClicked + "and" + this.ischangeGradeCallClicked)
      this.gradingWeightmentDetailsService.saveGradingweighmentDetails(this.greensGradingInwardDetails).subscribe((data: any) => {
        if (data.IsSucceed) {
          this.greensGradingInwardDetails = data.Data;
          this.greensGradingWeighmentDetailsList = this.greensGradingInwardDetails.greensGradingWeighmentDetailsList;
          this.greensGradingQuantityDetailsList = this.greensGradingInwardDetails.greensGradingQuantityDetailsList;
          // if (this.clickedBtn == "one") {
          //   this.grid3data = this.greensGradingInwardDetails.greensGradingWeighmentDetailsList.filter(x => x.cropSchemeCode == this.grid3data[0].cropSchemeCode);
          //   this.addGrid3Row();
          // }
          // else if (this.clickedBtn == "two") {
          //   this.grid3data = [];
          //   this.addGrid3Row();
          // }
          // else if (this.clickedBtn == "three") {
          //   this.grid3data = [];
          // }
          this.grid3data = [];
          this.ispushRowClicked = false;
          this.ischangeGradeCallClicked = false;
          this.disablecropSchemeCode = false;
          this.IsonGridDrpDownChange = false;
          this.gridCatesTotal = 0;
          this.gridCratesTareWt = 0;
          this.gridTareWt = 0;
          if (this.IssetFocusOnSaveButton == false) {
            this.addGrid3Row();
          }
        }
        else {
          this.alertService.error(
            'Error has occured while saving greens grading.'
          );
        }
      });
      // this.grid3data = [];
      // this.ispushRowClicked = false;
      // this.ischangeGradeCallClicked = false;
      // this.disablecropSchemeCode = false;
      // this.addGrid3Row();
    }
    else if (this.ispushRowClicked != false && this.ischangeGradeCallClicked != true) {
      console.log(this.ispushRowClicked + " and " + this.ischangeGradeCallClicked)
      this.addGrid3Row();
    }
    // this.gradingWeightmentDetailsService.saveGradingweighmentDetails(this.greensGradingInwardDetails).subscribe((data: any) => {
    //   if (data.IsSucceed) {
    //     this.greensGradingInwardDetails = data.Data;
    //     this.greensGradingWeighmentDetailsList = this.greensGradingInwardDetails.greensGradingWeighmentDetailsList;
    //     this.greensGradingQuantityDetailsList = this.greensGradingInwardDetails.greensGradingQuantityDetailsList;
    //     if (this.clickedBtn == "one") {
    //       this.grid3data = this.greensGradingInwardDetails.greensGradingWeighmentDetailsList.filter(x => x.cropSchemeCode == this.grid3data[0].cropSchemeCode);
    //       this.addGrid3Row();
    //     }
    //     else if (this.clickedBtn == "two") {
    //       this.grid3data = [];
    //       this.addGrid3Row();
    //     }
    //     else if (this.clickedBtn == "three") {
    //       this.grid3data = [];
    //     }
    //   }
    //   else {
    //     this.alertService.error(
    //       'Error has occured while saving greens grading.'
    //     );
    //   }
    // });
    // this.addGrid3Row();
  }

  calculateTareWt(data) {
    data.gmWeightTareWeight = data.gmWeightNoofCrates * data.gmCratesTareWeight;
    this.calculateTotal();
  }

  calculateNetWT(data) {
    data.hmWeightNetWeight = data.gmWeightGrossWeight - data.gmWeightTareWeight;
    this.calculateTotal();
  }

  setFocusOnSaveButton() {
    // this.clickedBtn = "three";
    // this.greensGradingWeighmentDetailsList.concat(this.grid3data);
    // this.saveData();
    this.IssetFocusOnSaveButton = true;
    this.changeGradeCall();
    debugger
    this.displayDialog = false;
    setTimeout(() => this.saveBtn.nativeElement.focus(), 1000);
  }

  changeStatus() {
    this.gradingWeightmentDetailsService.changeStatus(this.greensGradingInwardDetails.greensGradeNo).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.alertService.success(
          'Greens grading details saved successfully'
        );
        this.Reset();
      }
      else {
        this.alertService.error(
          'Error has occured while saving greens grading.'
        );
      }
    });
  }

  calculateTotal() {
    this.gridCatesTotal = 0;
    this.gridCratesTareWt = 0;
    this.gridTareWt = 0;
    this.grid3data.forEach(obj => {
      if (!isNaN(obj.gmWeightNoofCrates)) {
        this.gridCatesTotal = this.gridCatesTotal + +obj.gmWeightNoofCrates;
      }
      if (!isNaN(obj.gmCratesTareWeight)) {
        this.gridCratesTareWt = this.gridCratesTareWt + +obj.gmCratesTareWeight;
      }
      if (!isNaN(obj.gmWeightTareWeight)) {
        this.gridTareWt = this.gridTareWt + +obj.gmWeightTareWeight;
      }

    });
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  addRow() {
    debugger
    let gridRow = new GreensGradingWeighmentDetails();

    gridRow.cropSchemeCode = this.grid3data[0].cropSchemeCode;
    gridRow.gmWeightTareWeight = 0;
    gridRow.hmWeightNetWeight = 0.000;
    gridRow.isDisabled = false;
    this.disablecropSchemeCode = true;
    this.grid3data.push(gridRow);
  }

  onGridDrpDownChange(schemCode) {
    this.disableotherscropSchemeCode = false;
    this.IsonGridDrpDownChange = true;
    debugger
    // if (this.greensGradingWeighmentDetailsList.length > 0) {
    //   this.grid3data = this.greensGradingWeighmentDetailsList.filter(x => x.cropSchemeCode == schemCode);
    //   this.gridCatesTotal = 0;
    //   this.grid3data.forEach(a => this.gridCatesTotal += Number(a.gmWeightNoofCrates));
    //   this.gridCratesTareWt = 0;
    //   this.grid3data.forEach(a => this.gridCratesTareWt += Number(a.gmCratesTareWeight));
    //   this.gridTareWt = 0;
    //   this.grid3data.forEach(a => this.gridTareWt += Number(a.gmWeightTareWeight));
    // }
    // else {
    //   this.WeightedModeChange();
    // }
  }
}
