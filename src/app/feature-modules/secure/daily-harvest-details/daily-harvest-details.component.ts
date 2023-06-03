import { Component, OnInit, ViewChild } from '@angular/core';
import { DailyHarvestService } from 'src/app/shared/services/daily-harvest.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { HarvestDailyDetails, CrateWiseDetails, HarvestFarmersDetails } from 'src/app/shared/models/daily-harvest.model';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { CropesAndSchemesService } from '../../agri-management/master/crops-and-schemes/cropes-and-schemes.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

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



declare var $: any;
@Component({
  selector: 'app-daily-harvest-details',
  templateUrl: './daily-harvest-details.component.html',
  styleUrls: ['./daily-harvest-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DailyHarvestDetailsComponent implements OnInit {


  allAreas: any[] = [];
  allFarmers: any[] = [];
  cropGroupList: any[] = [];
  cropNameList: any[] = [];
  cropSchemeList: any[] = [];
  seasonList: any[] = [];
  villageList: any[] = [];
  countryList: any[] = [];
  districtList: any[] = [];
  stateList: any[] = [];
  mandalList: any[] = [];
  employeeList: any[] = [];
  dailyHarvest: HarvestDailyDetails;
  selectedFarmerCrateDetails: CrateWiseDetails[] = [];
  procurementSummaryList: any[] = [];
  selectedFarmerIndexGrid2 = -1;
  selectedCrateIndexGrid3 = 0;
  timeDuration: string;
  isDurationCorrect = true;
  isKmsCorrect = true;
  isCrateGridValid = false;
  isSaved = false;
  searchText = '';
  stateCode: string;
  districtCode: string;
  mandalCode: string;
  loginDetails: any;

  @ViewChild('form', { static: false }) ngForm: NgForm;


  constructor(
    private harvestService: DailyHarvestService,
    private authenticatioService: AuthenticationService, private alertService: AlertService
  ) {
    this.dailyHarvest = new HarvestDailyDetails();



  }

  ngOnInit() {

    this.loginDetails = this.authenticatioService.getUserdetails();
    // this.authenticatioService.getUserdetails().subscribe(res => {
    //   console.log('User', res);
    // })

    this.harvestService.getAllAreas().subscribe(res => {
      this.allAreas = res;
      console.log('Areas', this.allAreas);
    });

    this.harvestService.getBuyerList().subscribe(res => {
      this.employeeList = res;
      console.log('Employee List ', this.employeeList);
    });

  }

  getAllDetails() {

    this.harvestService.getCropGroup(this.dailyHarvest.AreaId).subscribe(res => {
      this.cropGroupList = res;
      console.log('CropGroup', res);
    });

    this.harvestService.getCropName(this.dailyHarvest.AreaId).subscribe(res => {
      this.cropNameList = res;
      console.log('CropName', res);
    });

    this.harvestService.getSeasonFromTo(this.dailyHarvest.AreaId).subscribe(res => {
      this.seasonList = res;
      console.log('SeasonList', res);
    });

    this.harvestService.getAreaWiseCountry(this.dailyHarvest.AreaId).subscribe(res => {
      this.countryList = res;
      console.log('Country', res);
    });


    this.harvestService.getAreaWiseState(this.dailyHarvest.AreaId).subscribe(res => {
      this.stateList = res;
      console.log('State', res);

    });



  }

  getDistrict() {

    this.emptyStateDistrict(3);
    this.harvestService.getStateWiseDistrict(this.stateCode).subscribe(res => {
      this.districtList = res;
      console.log('District', res);
    });


  }


  getMandal() {

    this.emptyStateDistrict(2);
    this.harvestService.getDistrictWiseMandal(this.districtCode).subscribe(res => {
      this.mandalList = res;
      console.log('Mandal', res);
    });

  }

  getVillage() {


    this.emptyStateDistrict(1);
    this.harvestService.getMandalWiseVillage(this.mandalCode).subscribe(res => {
      this.villageList = res;
      console.log('Village', res);
    });

  }

  getFarmers() {


    this.allFarmers = [];

    this.harvestService.getAllFarmers(this.dailyHarvest.AreaId, this.dailyHarvest.PsNumber).subscribe(res => {

      this.allFarmers = res.map(v => ({ ...v, isChecked: false }));
      const far = {
        agricultureDripNonDrip: 'Drip',
        farmerCode: 'FC_2',
        farmersAgreementCode: 'FA_3',
        farmersName: 'Mohit',
        farmersNoofAcresArea: 100,
        accountNumber: '1000002',
        isChecked: false
      };

      this.allFarmers.push(far);
      console.log('All farmers', res);
    });

  }

  getCropSchemeCode() {

    this.cropSchemeList = [];
    this.harvestService.getAllCropSchemes(this.dailyHarvest.CropNameCode).subscribe(res => {
      this.cropSchemeList = res;
      console.log('Crop Schemes', this.cropSchemeList);
    });

  }


  addFarmerToHarvest(event, farmer, index) {

    if (event.target.checked) {

      console.log('Event is checked', farmer);
      const farmerDetails = new HarvestFarmersDetails();
      farmerDetails.FarmerName = farmer.farmersName;
      farmerDetails.FarmerCode = farmer.farmerCode;
      farmerDetails.AccountNumber = farmer.accountNumber;
      this.dailyHarvest.HarvestFarmersDetails.push(farmerDetails);
      this.allFarmers[index].isChecked = true;


    } else {
      this.allFarmers[index].isChecked = false;
      this.dailyHarvest.HarvestFarmersDetails = this.dailyHarvest.HarvestFarmersDetails.filter(x => x.FarmerCode !== farmer.farmerCode);
    }

    console.log('Checked Farmers', this.dailyHarvest.HarvestFarmersDetails);


  }

  allotLastHarvest() {
    for (const val of this.dailyHarvest.HarvestFarmersDetails) {

      if (val.FarmerCode === this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].FarmerCode) {
        val.LastHarvestStatus = this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].LastHarvestStatus;

      }

    }
  }


  selectFarmersForGrade(farmer, index) {
    this.selectedFarmerIndexGrid2 = index;
    console.log('Selected Farmer', farmer);
    this.selectedFarmerCrateDetails = [];
    this.selectedFarmerCrateDetails = [...farmer.HarvestQuantityCratewiseDetails];
    this.createCrateRow();
    this.selectedCrateIndexGrid3 = this.selectedFarmerCrateDetails.length - 1;

  }

  allotCropSign() {
    // tslint:disable-next-line: max-line-length
    const ind = this.cropSchemeList.findIndex(x => x.Code === this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CropSchemeCode);
    if (ind > -1) {
      this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].Count =
        this.cropSchemeList[ind].From + ' ' + this.cropSchemeList[ind].Sign;
    }

    this.isCrateGridValid = false;

  }

  openPopup() {

    $('#continueModal').modal('show');
  }

  createCrateRow() {

    const newCrate = new CrateWiseDetails();
    console.log('Selected Farmer Crate', this.selectedFarmerCrateDetails);
    this.selectedFarmerCrateDetails.push(newCrate);
  }

  addCrateToHarvest(num) {

    this.calQuantityandCrates();

    const index = this.dailyHarvest.HarvestFarmersDetails.findIndex
      (x => x.FarmerCode === this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].FarmerCode &&
        x.CropSchemeCode === this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CropSchemeCode);

    if (index === -1) {

      //  Add to new row only when atleast one cropschemeCode is there for the farmer.

      if (this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].CropSchemeCode) {
        // need to add a new row;

        const newFarmerDetails = new HarvestFarmersDetails();
        newFarmerDetails.FarmerCode = this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].FarmerCode;
        newFarmerDetails.FarmerName = this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].FarmerName;
        newFarmerDetails.AccountNumber = this.dailyHarvest.HarvestFarmersDetails[this.selectedFarmerIndexGrid2].AccountNumber;
        newFarmerDetails.CropSchemeCode = this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CropSchemeCode;
        newFarmerDetails.Count = this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].Count;
        newFarmerDetails.FarmerwiseTotalCrates =
          newFarmerDetails.FarmerwiseTotalCrates + this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].NoOfCrates;
        newFarmerDetails.FarmerwiseTotalQuantity =
          newFarmerDetails.FarmerwiseTotalQuantity + this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CrateswiseNetWeight;

        newFarmerDetails.HarvestQuantityCratewiseDetails.push({ ...this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3] });
        this.dailyHarvest.HarvestFarmersDetails.splice(this.selectedFarmerIndexGrid2 + 1, 0, newFarmerDetails);

      } else {
        // no need to add a new row. this case will come hen user is entering the details for the first time
        this.fillFarmerQuantityCrateDetails(this.selectedFarmerIndexGrid2);
      }

    } else {
      // Add to same row
      this.fillFarmerQuantityCrateDetails(index);

    }

    if (num === 1) {
      this.createCrateRow();
      this.selectedCrateIndexGrid3 = this.selectedFarmerCrateDetails.length - 1;

    } else {
      this.selectedCrateIndexGrid3 = -1;
    }

    this.isCrateGridValid = true;

  }


  fillFarmerQuantityCrateDetails(farmerIndex) {

    this.dailyHarvest.HarvestFarmersDetails[farmerIndex].CropSchemeCode
      = this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CropSchemeCode;
    this.dailyHarvest.HarvestFarmersDetails[farmerIndex].Count =
      this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].Count;

    this.dailyHarvest.HarvestFarmersDetails[farmerIndex].FarmerwiseTotalCrates
      = this.dailyHarvest.HarvestFarmersDetails[farmerIndex].FarmerwiseTotalCrates +
      this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].NoOfCrates;


    this.dailyHarvest.HarvestFarmersDetails[farmerIndex].FarmerwiseTotalQuantity
      = this.dailyHarvest.HarvestFarmersDetails[farmerIndex].FarmerwiseTotalQuantity
      + this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CrateswiseNetWeight;

    this.dailyHarvest.HarvestFarmersDetails[farmerIndex].HarvestQuantityCratewiseDetails.push
      ({ ...this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3] });

  }

  calDistance() {

    if (this.dailyHarvest.HarvestStartingKms && this.dailyHarvest.HarvestEndingKMS) {

      if (this.dailyHarvest.HarvestStartingKms < this.dailyHarvest.HarvestEndingKMS) {
        this.isKmsCorrect = true;
        this.dailyHarvest.HarvestKmsTotalReading = this.dailyHarvest.HarvestEndingKMS - this.dailyHarvest.HarvestStartingKms;
      } else {
        this.isKmsCorrect = false;
      }

    }

  }

  calDuration() {

    console.log('Daily harvest', this.dailyHarvest.HarvestStartingTime, this.dailyHarvest.HarvestEndingTime);

    if (this.dailyHarvest.HarvestEndingTime && this.dailyHarvest.HarvestStartingTime) {
      const diffInMilliSeconds = this.dailyHarvest.HarvestEndingTime.getTime() - this.dailyHarvest.HarvestStartingTime.getTime();
      const diffInMinutes = Math.round(diffInMilliSeconds / 60000);
      if (diffInMinutes > 0) {

        const diffHr = Math.floor(diffInMinutes / 60);
        this.timeDuration = this.addZero(diffHr.toFixed()) + diffHr.toFixed() + ':' +
          this.addZero((diffInMinutes - (diffHr * 60)).toFixed()) + (diffInMinutes - (diffHr * 60)).toFixed();

        console.log(this.timeDuration);

        this.dailyHarvest.HarvestTimeDuration = parseFloat((diffInMinutes / 60).toFixed(2));
        this.isDurationCorrect = true;
        console.log(typeof (parseFloat((diffInMinutes / 60).toFixed(2))), this.dailyHarvest.HarvestTimeDuration);



      } else {
        this.dailyHarvest.HarvestTimeDuration = undefined;
        this.timeDuration = undefined;
        this.isDurationCorrect = false;
      }




    }


  }

  calQuantityandCrates() {

    this.dailyHarvest.TripTotalCrates =
      this.dailyHarvest.TripTotalCrates + this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].NoOfCrates;
    this.dailyHarvest.TripTotalQuantity =
      this.dailyHarvest.TripTotalQuantity + this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CrateswiseNetWeight;

  }

  addZero(str) {
    if (str.length === 1) {
      return '0';
    } else {
      return '';
    }

  }


  calNetWeight() {

    if (this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].Tareweight &&
      this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].GrossWeight) {

      this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CrateswiseNetWeight = parseFloat(
        (this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].Tareweight -
          this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].GrossWeight).toFixed(3));


      if (this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CropSchemeCode &&
        this.selectedFarmerCrateDetails[this.selectedCrateIndexGrid3].CrateswiseNetWeight > 0) {
        this.openPopup();
      }

    }

    console.log(this.dailyHarvest);
  }

  newHarvest() {

    this.ngForm.resetForm();
    this.clearForm();

  }


  emptyStateDistrict(num) {

    if (num >= 1) {
      this.villageList = [];

      if (num >= 2) {
        this.mandalList = [];
        if (num === 3) {
          this.districtList = [];
        }
      }
    }



  }


  clearForm() {
    this.selectedFarmerCrateDetails = [];
    this.selectedFarmerIndexGrid2 = -1;
    this.selectedCrateIndexGrid3 = 0;
    this.isDurationCorrect = true;
    this.isCrateGridValid = false;
    this.isSaved = false;
    this.isKmsCorrect = true;
    this.dailyHarvest = new HarvestDailyDetails();
  }



  resetForm() {

    this.ngForm.resetForm();

  }


  checkHarvestCrateFamweWise() {

    if (this.dailyHarvest.HarvestFarmersDetails.length === 0) {
      return false;
    }
    for (const farmer of this.dailyHarvest.HarvestFarmersDetails) {
      if (farmer.HarvestQuantityCratewiseDetails.length === 0) {
        return false;
      }
    }

    return true;
  }

  saveDailyHarvest() {

    console.log('Saving daily harvest', this.dailyHarvest);
    const jsonObject = JSON.stringify(this.dailyHarvest);
    console.log(jsonObject);

    if (this.checkHarvestCrateFamweWise()) {

      this.dailyHarvest.EmployeeId = this.loginDetails.userId;
      this.harvestService.saveHarvest(this.dailyHarvest).subscribe(res => {
        console.log(res);
        this.isSaved = true;
        this.alertService.success('Harvest details saved successfully');

      });

    } else {

      this.alertService.error('Please fill the details for all the selected farmers.(Atleast one farmer should be selected');
    }

  }


  onTabChange(event) {

    if (event.index === 0) {

      this.procurementSummaryList = [];

    } else if (event.index === 1) {

      this.procurementSummaryList = [];

    } else {
      this.generateprocurementSummary();

    }
  }


  generateprocurementSummary() {

    const farmerWiseClass = {

      farmerCode: '',
      farmerName: '',
      accountNumber: '',
      totalCrates: 0,

    };

    for (const crop of this.cropSchemeList) {
      const key = crop.From + ' ' + crop.Sign;
      farmerWiseClass[key] = 0;

    }

    if (this.checkHarvestCrateFamweWise()) {

      for (const farmer of this.dailyHarvest.HarvestFarmersDetails) {

        const farmerWiseProcurement = { ...farmerWiseClass };

        if (this.procurementSummaryList.length > 0) {

          const index = this.procurementSummaryList.findIndex(x => x.farmerCode === farmer.FarmerCode);

          if (index === -1) {

            // add new row

            farmerWiseProcurement.farmerCode = farmer.FarmerCode;
            farmerWiseProcurement.farmerName = farmer.FarmerName;
            farmerWiseProcurement.accountNumber = farmer.AccountNumber;
            farmerWiseProcurement.totalCrates = farmer.FarmerwiseTotalCrates;
            farmerWiseProcurement[farmer.Count] = farmer.FarmerwiseTotalQuantity;

            this.procurementSummaryList.push({ ...farmerWiseProcurement });


          } else {

            this.procurementSummaryList[index].totalCrates = this.procurementSummaryList[index].totalCrates + farmer.FarmerwiseTotalCrates;
            this.procurementSummaryList[index][farmer.Count] = farmer.FarmerwiseTotalQuantity;

          }

        } else {
          // add new row

          farmerWiseProcurement.farmerCode = farmer.FarmerCode;
          farmerWiseProcurement.farmerName = farmer.FarmerName;
          farmerWiseProcurement.accountNumber = farmer.AccountNumber;
          farmerWiseProcurement.totalCrates = farmer.FarmerwiseTotalCrates;
          farmerWiseProcurement[farmer.Count] = farmer.FarmerwiseTotalQuantity;

          this.procurementSummaryList.push({ ...farmerWiseProcurement });

        }
      }
    } else {
      this.procurementSummaryList = [];
    }

    console.log('Generated Procurement List', this.procurementSummaryList);
  }


  convertIdToNo(num) {

    if (num === 1) {

      this.dailyHarvest.BuyingSupervisorEmployeeId = Number(this.dailyHarvest.BuyingSupervisorEmployeeId);

    } else if (num === 2) {

      this.dailyHarvest.BuyingAsstEmployeeId = Number(this.dailyHarvest.BuyingAsstEmployeeId);

    } else {

      // this.dailyHarvest.EmployeeId = Number(this.dailyHarvest.EmployeeId);

    }

    console.log(this.dailyHarvest);

  }

  generateGradeQuantity(farmer, crop) {

    const key = crop.From + ' ' + crop.Sign;
    return farmer[key];

  }

}
