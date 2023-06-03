import { AlertService } from '../../../../corecomponents/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MaterialInputIssueToFarmerService } from './material-input-issue-to-farmer.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { paginationData } from './pagination';
import { formatDate } from '@angular/common';
import { CropGrp, CropName, PlantationSchedul } from './../plantation-scheduling/plantation-scheduling.model';
import { forkJoin } from 'rxjs';
import {
  Area, HarvestVillage, ModifyHarvestVillage, CountryModel, StateModel,
  DistrictModel, VillageModel, MandalModel, SearchVillageModel
} from './../../master/centre-areasand-villages/centre-areasand-villages.model';

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
  selector: 'app-material-input-issue-to-farmer',
  templateUrl: './material-input-issue-to-farmer.component.html',
  styleUrls: ['./material-input-issue-to-farmer.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaterialInputIssueToFarmerComponent implements OnInit {
  @ViewChild('datePicker', { static: true }) datePicker: ElementRef;
  @ViewChild('nextButton', { static: true }) nextButton: ElementRef;

  employeeInfoList = [];
  cropGroupList = [];
  areaList = [];
  areaWiseSeasonToFromList: PlantationSchedul[] = [];
  cropNameList = [];
  areaWiseCountryList = [];
  allPlaceInfomationList: CountryModel[] = [];
  areaWiseStateList = [];
  areaWiseMandalList = [];
  areaWiseVillageList = [];
  areaWiseDistrictList = [];
  farmerAnalysisData = [];
  inputIssurFarmerForm: FormGroup;
  materialInputConsumed;
  disableInputIssue = false;
  disableNext = true;
  disableSave = true;
  showWhenDataPresent = false;
  inputFeedingForm: FormGroup;
  inputIssuesGrid = [];
  farmersInputConsumptionDetail;
  paginationData = paginationData;
  selectedTasks;
  selectedAreaId = '';
  agreementAcres = '';
  popPerAcre = '';
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly materialInputIssueToFarmerService: MaterialInputIssueToFarmerService,
    private authServie: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.paginationData = paginationData;
    this.formCreation();
    this.getAllArea();
  }

  getAllArea() {
    this.materialInputIssueToFarmerService.getAllAreas().subscribe((res: []) => {
      console.log('res', res);
      this.areaList = res;
    },
      error => {
        console.log('errror', error);
      });
  }

  formCreation() {
    try {
      this.inputIssurFarmerForm = this.formBuilder.group({
        dateOfIssue: [
          '',
          [Validators.required]
        ],
        areaName: ['', [Validators.required]],
        nameOfFieldStaff: ['', [Validators.required]],
        cropGroup: ['', [Validators.required]],
        cropName: ['', [Validators.required]],
        seasonFromTo: ['', [Validators.required]],
        country: [, [Validators.required]],
        state: [, [Validators.required]],
        district: [, [Validators.required]],
        mandal: [, [Validators.required]],
        village: [, [Validators.required]],
        search: [, [Validators.required]]
      });

      this.inputIssurFarmerForm.disable();
    } catch (error) {
      console.log('form creation error', error);
    }
  }


  updateTheDetail() {
    try {
      this.inputIssurFarmerForm.enable();
      this.inputIssurFarmerForm.controls.dateOfIssue.setValue(new Date());
      this.datePicker.nativeElement.focus();
      this.disableInputIssue = true;
    } catch (error) {
      console.log('update the detail', error);
    }
  }

  getSelectedArea(event) {
    console.log('selected area', event.value);
    const areaId = event.value;
    this.selectedAreaId = areaId;
    this.materialInputIssueToFarmerService.getEmployeeDetails(areaId).subscribe((res: []) => {
      console.log('get employee Detail', res);
      this.employeeInfoList = res;
    },
      error => {
        console.log('error in employee Detail', error);
      });
    this.materialInputIssueToFarmerService.getCropGroup(areaId).subscribe((res: []) => {
      console.log('get crop group', res);
      this.cropGroupList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
    // this.materialInputIssueToFarmerService.getAreaWiseSeasonToFrom(areaId).subscribe((res: []) => {
    //   console.log('get crop group', res);
    //   this.areaWiseSeasonToFromList = res;
    // },
    //   error => {
    //     console.log('error in crop group', error);
    //   });

    this.getCountryList(event);
    this.getStateList(event);
  }

  getSeasonDetailsByCropAndArea(event: any) {
    //this.areaWiseSeasonToFromList
    const cropGroupCode = this.inputIssurFarmerForm.controls.cropGroup.value;
    const cropNameCode = this.inputIssurFarmerForm.controls.cropName.value;
    this.materialInputIssueToFarmerService.getPlantationSchedule(cropGroupCode, cropNameCode).subscribe(res => {
      this.areaWiseSeasonToFromList = res;
    },
      error => {
        this.alertService.error('Error while fetching plantation schedule!');
      });

  }

  getMandalList(event) {
    this.materialInputIssueToFarmerService.getDistrictWiseMandal(event.value).subscribe((res: []) => {
      console.log('get crop group', res);
      this.areaWiseMandalList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
  }

  getCropGroupName(event) {
    this.materialInputIssueToFarmerService.getCropName(event.value).subscribe((res: []) => {
      console.log('get crop group', res);
      this.cropNameList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
  }

  getVillageList(event) {
    this.materialInputIssueToFarmerService.getMandalWiseVillage(event.value).subscribe((res: []) => {
      console.log('get crop group', res);
      this.areaWiseVillageList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
  }

  getDistrictList(event) {
    this.materialInputIssueToFarmerService.getStateWiseDistrict(event.value).subscribe((res: []) => {
      console.log('get crop group', res);
      this.areaWiseDistrictList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
  }

  getCountryList(event) {
    this.materialInputIssueToFarmerService.getAreaWiseCountry(event.value).subscribe((res: []) => {
      console.log('get crop group', res);
      this.areaWiseCountryList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
  }

  getStateList(event) {
    this.materialInputIssueToFarmerService.getAreaWiseState(event.value).subscribe((res: []) => {
      console.log('get crop group', res);
      this.areaWiseStateList = res;
    },
      error => {
        console.log('error in crop group', error);
      });
  }
  getSelectedAreaWiseSeasonFrom(event, inputData) {
    console.log('event', event);
    console.log('inputData', inputData);
    this.materialInputConsumed = {
      DateOfIssue: new Date(inputData.dateOfIssue),
      AreaId: inputData.areaName,
      EmployeeId: inputData.nameOfFieldStaff,
      CropGroup: inputData.cropGroup,
      CropName: inputData.cropName,
      PSnumber: inputData.seasonFromTo,
      CountryId: Number(inputData.country),
      StateId: Number(inputData.state),
      DistrictId: Number(inputData.district),
      MandalId: Number(inputData.mandal),
      VillageId: Number(inputData.village),
    };
    const data = {
      areaId: inputData.areaName,
      psNumber: inputData.seasonFromTo
    };
    this.materialInputIssueToFarmerService.getAreaWiseFarmerAgreementDetails(data).subscribe((resdata: any) => {
      console.log('data', resdata);
      // resdata.forEach((element, index) => {
      //   element.slno = index + 1;
      // });
      // this.farmerAnalysisData = resdata;
      this.farmerAnalysisData = [];
      // console.log('this.farmerAnalysisData', this.farmerAnalysisData);
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.paginationData.length; index++) {
        let indexData = 0;
        this.paginationData[index].displayList = [];
        resdata.forEach((element) => {
          if (element.farmersName.charAt(0) === this.paginationData[index].name) {
            indexData = indexData + 1;
            element.slno = indexData;
            this.paginationData[index].enabled = true;
            this.paginationData[index].displayList.push(element);
          }
        });
      }
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.paginationData.length; index++) {
        if (this.paginationData[index].enabled === true) {
          this.selectedTasks = this.paginationData[index];
          this.farmerAnalysisData = this.paginationData[index].displayList;
          return;
        }
      }
      // this.paginationData.forEach(element => {
      //   if (element.enabled === true) {
      //     this.selectedTasks = element;
      //     this.farmerAnalysisData = element.displayList;
      //     return;
      //   }
      // });
      // console.log('this.paginationData', this.paginationData);
    },
      error => {
        console.log('error data', error);
      });
  }

  radioBtnClick(data) {
    console.log('data value', data);
    this.disableNext = false;
    this.materialInputConsumed.FarmerAgreementDetail = data;
    console.log('this.materialInputConsumed', this.materialInputConsumed);
    const villageName = data.villageName;

    const getVillageWithCountryListInfo = this.materialInputIssueToFarmerService.getAllPlacesInfoByVillageName(villageName);
    const getVillageDetailsByName = this.materialInputIssueToFarmerService.getVillageDetailsByName(villageName);

    forkJoin([getVillageWithCountryListInfo, getVillageDetailsByName]).subscribe((results) => {

      this.allPlaceInfomationList = results[0].Data;
      const countryObj = new CountryModel();
      countryObj.countryCode = this.allPlaceInfomationList['countryCode'];
      countryObj.countryName = this.allPlaceInfomationList['countryName'];

      const villageDetailsByName = results[1].Data;

      const stateDetails = this.allPlaceInfomationList['states'].filter(x => x.stateCode == villageDetailsByName.stateCode)[0];
      const districtDetails = stateDetails['districts'].filter(x => x.districtCode == villageDetailsByName.districtCode)[0];
      const mandalDetails = districtDetails['mandals'].filter(x => x.mandalCode == villageDetailsByName.mandalCode)[0];
      const villageDetails = mandalDetails['villages'].filter(x => x.villageCode == villageDetailsByName.villageCode)[0];

      this.inputIssurFarmerForm.controls.country.patchValue(countryObj.countryCode);
      this.inputIssurFarmerForm.controls.state.patchValue(stateDetails.stateCode);
      this.inputIssurFarmerForm.patchValue({ ['district']: districtDetails });
      this.inputIssurFarmerForm.controls.mandal.setValue(mandalDetails.mandalCode);
      this.inputIssurFarmerForm.controls.village.setValue(villageDetails.villageCode);

    },
      (error) => {
        this.alertService.error('Error while processing your request. Try Again!');
      });


    // const countryDtCode: string = this.getAllCountry.filter(a => a.countryCode ===
    //   vendObj.countryCode)[0].countryName;
    // this.vendorInformationForm.get('Country_Code').setValue(countryDtCode);




    this.nextButton.nativeElement.focus();
  }

  getInputFeedingDetail() {
    const getHbomDetails = this.materialInputIssueToFarmerService.getGetHBOMPracticePerAcreages(this.materialInputConsumed.CropName, this.materialInputConsumed.PSnumber);
    const aggrementDetails = this.materialInputIssueToFarmerService.getFarmerAgreementAcres(this.materialInputConsumed.CropName, this.materialInputConsumed.PSnumber);

    forkJoin([aggrementDetails, getHbomDetails]).subscribe((results) => {
      this.FarmerAgreementAcres(results[0]);
      this.HBOMPracticePerAcreages(results[1]);

    },
      (error) => {
        this.alertService.error('Error while processing your request. Try Again!');
      });


    this.materialInputIssueToFarmerService.getMaterialInputConsumed(this.materialInputConsumed).subscribe((res: any) => {
      // console.log('getMaterialInputConsumed', res);
      this.formInputFeedingCreation();
      this.updateInputFeedingFormDetail(res.areaCode, res.mifConsumptionNumber);
      this.disableNext = true;
      res.inputIssuesGrid.forEach((element, index) => {
        element.slno = index + 1;
        element.mifConsumptionNo = res.mifConsumptionNumber;
      });
      this.showWhenDataPresent = true;
      this.inputIssuesGrid = res.inputIssuesGrid;
    },
      error => {
        console.log('errorr data', error);
      });
  }

  formInputFeedingCreation() {
    try {
      this.inputFeedingForm = this.formBuilder.group({
        dateOfIssue: [
          '',
          [Validators.required]
        ],
        issuedBy: ['', [Validators.required]],
        nameOfFieldStaff: ['', [Validators.required]],
        cropName: ['', [Validators.required]],
        seasonFromTo: ['', [Validators.required]],
        farmerName: [, [Validators.required]],
        accountNo: [, [Validators.required]],
        village: [, [Validators.required]],
        harvestingAcer: [, [Validators.required]],
        consumptionVoucherNo: [, [Validators.required]]
      });
    } catch (error) {
      console.log('form creation error', error);
    }
  }

  updateInputFeedingFormDetail(areaCode, mifConsumptionNumber) {
    const userInfo = this.authServie.getUserdetails();
    this.farmersInputConsumptionDetail = {
      mifConsumptionNo: mifConsumptionNumber,
      mifDateofIssue: this.materialInputConsumed.DateOfIssue,
      areaID: this.selectedAreaId,
      mifEnteredEmpID: userInfo.userId,
      employeeID: this.materialInputConsumed.EmployeeId,
      psNumber: this.materialInputConsumed.PSnumber,
      mifConsumptionVoucherNo: areaCode + ' / MIF / ' + mifConsumptionNumber + ' / ' + this.getCurrentDate(),
      farmerCode: this.materialInputConsumed.FarmerAgreementDetail.farmerCode,
      cropNameCode: this.materialInputConsumed.CropName
    };
    this.inputFeedingForm.controls.dateOfIssue.setValue(this.materialInputConsumed.DateOfIssue);
    this.employeeInfoList.forEach(element => {
      if (element.employeeId === this.materialInputConsumed.EmployeeId) {
        this.inputFeedingForm.controls.nameOfFieldStaff.setValue(element.employeeName);
      }
    });
    this.areaWiseSeasonToFromList.forEach(element => {
      if (element.PsNumber === this.materialInputConsumed.PSnumber) {
        this.inputFeedingForm.controls.seasonFromTo.setValue(
          formatDate(element.FromDate, 'dd-MMM-yyyy', 'en_US') + ' / ' + formatDate(element.ToDate, 'dd-MMM-yyyy', 'en_US'));
      }
    });
    this.cropNameList.forEach(element => {
      if (element.cropNameCode === this.materialInputConsumed.CropName) {
        this.inputFeedingForm.controls.cropName.setValue(element.name);
      }
    });
    this.areaWiseVillageList.forEach(element => {
      if (Number(element.villageCode) === this.materialInputConsumed.VillageId) {
        this.inputFeedingForm.controls.village.setValue(element.villageName);
      }
    });
    this.inputFeedingForm.controls.farmerName.setValue(this.materialInputConsumed.FarmerAgreementDetail.farmersName);
    this.inputFeedingForm.controls.accountNo.setValue(this.materialInputConsumed.FarmerAgreementDetail.accountNumber);
    this.inputFeedingForm.controls.harvestingAcer.setValue(this.materialInputConsumed.FarmerAgreementDetail.farmersNoofAcresArea);
    this.inputFeedingForm.controls.consumptionVoucherNo.setValue
      (areaCode + ' / MIF / ' + mifConsumptionNumber + ' / ' + this.getCurrentDate());
    this.inputFeedingForm.controls.issuedBy.setValue(userInfo.userName);

  }

  getCurrentDate() {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  saveFarmerInput(farmerInput) {
    // console.log('farmerInput', farmerInput);
    // console.log('updated user data', this.inputIssuesGrid);
    const listFarmersMaterialIssueDetail = [];
    this.inputIssuesGrid.forEach(element => {
      const farmerDetail = {
        mifConsumptionNo: element.mifConsumptionNo,
        rawMaterialGroupCode: element.rawMaterialGroupCode,
        rawMaterialDetailsCode: element.rawMaterialDetailCode,
        farmersMaterialIssuedQty: element.transferQty
      };
      listFarmersMaterialIssueDetail.push(farmerDetail);
    });
    const farmerDetailRequest = {
      farmersInputConsumptionDetail: this.farmersInputConsumptionDetail,
      listFarmersMaterialIssueDetail
    };
    console.log('farmerDetailRequest', farmerDetailRequest);
    this.materialInputIssueToFarmerService.saveFarmerInputDatails(farmerDetailRequest).subscribe(res => {
      console.log('savefarmer detail', res);
      this.inputIssuesGrid = [];
      this.materialInputConsumed = {};
      this.farmerAnalysisData = [];
      this.inputFeedingForm.reset();
      this.inputIssurFarmerForm.reset();
      this.disableSave = true;
      this.disableNext = true;
      this.disableInputIssue = false;
      this.showWhenDataPresent = false;
      this.alertService.success('Farmer Input Detail Saved Successfully');
    },
      error => {
        console.log('error save detail', error);

      });
  }

  calculateInputDetailOnChange(event, data) {
    // data.transferQty = +event.target.innerText;
    if (this.inputIssuesGrid[this.inputIssuesGrid.length - 1].rawMaterialGroupCode === data.rawMaterialGroupCode) {
      this.disableSave = false;
    }
  }

  transferQtyBlur(item) {

    if (item.toBeIssueQuantity <= item.transferQty) {
      item.transferQty = Number(item.toBeIssueQuantity);

    } else {
      item.transferQty = Number(item.transferQty);
    }

  }
  updateSearchData(event, inputData) {
    const data = {
      areaId: inputData.areaName,
      psNumber: inputData.seasonFromTo
    };
    this.materialInputIssueToFarmerService.getSearchFarmers(event.target.value, data).subscribe((resdata: any) => {
      console.log('resdata', resdata);

      this.materialInputConsumed = {
        DateOfIssue: new Date(inputData.dateOfIssue),
        AreaId: inputData.areaName,
        EmployeeId: inputData.nameOfFieldStaff,
        CropGroup: inputData.cropGroup,
        CropName: inputData.cropName,
        PSnumber: inputData.seasonFromTo,
        CountryId: Number(inputData.country),
        StateId: Number(inputData.state),
        DistrictId: Number(inputData.district),
        MandalId: Number(inputData.mandal),
        VillageId: Number(inputData.village),
      };
      resdata.forEach((element, index) => {
        element.slno = index + 1;
      });
      this.farmerAnalysisData = resdata;
      console.log('this.farmerAnalysisData', this.farmerAnalysisData);
    },
      error => {
        this.farmerAnalysisData = [];
        console.log('error data', error);
      });
  }

  getSlectedFileList(selectedData) {
    this.selectedTasks = selectedData;
    console.log('selectedData', selectedData);
    this.farmerAnalysisData = selectedData.displayList;
  }

  FarmerAgreementAcres(res) {
    this.agreementAcres = res.toString();
  }

  HBOMPracticePerAcreages(res) {
    if (res[0] === 'HALF ACRE') {
      this.popPerAcre = 'HALF ACRE';
    } else {
      this.popPerAcre = 'ONE ACRE';
    }
  }

  clear(): void {
    this.inputIssuesGrid = [];
    this.materialInputConsumed = {};
    this.farmerAnalysisData = [];
    this.disableSave = true;
    this.disableNext = true;
    this.disableInputIssue = false;
    this.showWhenDataPresent = false;
    this.employeeInfoList = [];
    this.cropGroupList = [];
    this.areaList = [];
    this.areaWiseSeasonToFromList = [];
    this.cropNameList = [];
    this.areaWiseCountryList = [];
    this.areaWiseStateList = [];
    this.areaWiseMandalList = [];
    this.areaWiseVillageList = [];
    this.areaWiseDistrictList = [];
    this.selectedAreaId = '';
    this.ngOnInit();
  }
}
