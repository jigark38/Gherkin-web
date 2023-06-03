import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { FarmerDetails } from '../../master/farmer-details/farmer-details.model';
import { HarvestAreas } from '../../../secure/finished-semifinished-opening-stocks/finished-semifinished-opening.model';
import { District, Mandal, State, Village } from '../sowing-farmer-details/sowing-farmer-details.model';
import { AmountAdvancesToFarmerFilterModel } from './amount-advances-to-farmer-filter.model';
import { AmountAdvancesToFarmerModel } from './amount-advances-to-farmer.model';
import { AmountAdvancesToFarmersService } from './amount-advances-to-farmers.service';

@Component({
  selector: 'app-amount-advances-to-farmers',
  templateUrl: './amount-advances-to-farmers.component.html',
  styleUrls: ['./amount-advances-to-farmers.component.css']
})
export class AmountAdvancesToFarmersComponent implements OnInit {
  @ViewChild('AdvanceDate', { static: false }) AdvanceDate: ElementRef;

  constructor(
    public authService: AuthenticationService,
    private amountAdvService: AmountAdvancesToFarmersService,
    private alertService: AlertService) { }


  filteredVillageList: Observable<Village[]>;
  filteredAccountList: Observable<AmountAdvancesToFarmerModel[]>;
  filteredFarmerNameList: Observable<AmountAdvancesToFarmerModel[]>;
  employeeId: string;
  employeeName: string;
  amountAdvToFarmerForm: FormGroup;
  disblAdvPaymetBtn = false;
  disblSaveBtn = true;
  currentDate: Date = new Date();
  harvestAreas: HarvestAreas[];
  seasonList: any[] = [];
  cropGroup: any[] = [];
  cropNameList: any[] = [];
  supervisor: any[] = [];
  fieldStaff: any[] = [];
  areaDetailList = null;
  areaDistinctCountry = null;
  stateList = null;
  districtList = null;
  mandalList = null;
  villageList = null;
  allFarmersArray = null;
  farmerDetailArray = new Array<FarmerDetails>();
  amountAdvancesToFarmerFilterModel = new AmountAdvancesToFarmerFilterModel();
  amountAdvancesToFarmerModelList = new Array<AmountAdvancesToFarmerModel>();
  filtredAmountAdvancesToFarmerModelList = new Array<AmountAdvancesToFarmerModel>();
  selectedAmountAdvancesToFarmerList = new Array<AmountAdvancesToFarmerModel>();
  filtredFarmerNameAdvancesToFarmerModelList = new Array<AmountAdvancesToFarmerModel>();
  saveClicked = false;
  disblAddFarmerBtn: Boolean;

  ngOnInit() {
    this.amountAdvToFarmerForm = new FormGroup({
      acEntryDate: new FormControl(null, Validators.required),
      acEnteredEmployeeName: new FormControl(null, Validators.required),
      acEnteredEmployeeID: new FormControl(null, Validators.required),
      acIssuedNo: new FormControl(null),
      acIssuedDate: new FormControl(null, Validators.required),
      areaID: new FormControl(null, Validators.required),
      fieldSupervisorEmployeeID: new FormControl(null, Validators.required),
      fieldStaffEmployeeID: new FormControl(null, Validators.required),
      farmersAccountNo: new FormControl(null),
      farmerCode: new FormControl(null),
      advanceAmount: new FormControl(null),
      materialGroup: new FormControl(null),
      materialName: new FormControl(null),
      seasonFromTo: new FormControl(null),
      country: new FormControl(null),
      areaCode: new FormControl(null),
      state: new FormControl(null),
      district: new FormControl(null),
      taluk: new FormControl(null),
      village: new FormControl(null),
    });
    this.saveClicked = false;
    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;
    this.amountAdvToFarmerForm.disable();
  }

  // private _filterFarmer(name: string): FarmerDetails[] {
  //   const filterValue = name.toLowerCase();
  //   return this.farmerDetailArray.filter(option => option.farmerName.toLowerCase().indexOf(filterValue) === 0);
  // }

  onAdvancePaymentClick() {
    this.saveClicked = false;
    this.amountAdvToFarmerForm.enable();
    this.disblAdvPaymetBtn = true;
    this.disblSaveBtn = false;
    this.amountAdvToFarmerForm.controls.acEntryDate.setValue(this.currentDate);
    this.amountAdvToFarmerForm.controls.acEnteredEmployeeName.setValue(this.employeeName);
    this.amountAdvToFarmerForm.controls.acEnteredEmployeeID.setValue(this.employeeId);
    this.amountAdvToFarmerForm.controls.acIssuedNo.setValue(1);
    this.getHarvestAreas();
    this.getCropGroup();
    this.amountAdvToFarmerForm.controls.acEnteredEmployeeName.disable();
    this.AdvanceDate.nativeElement.focus();
  }

  reset() {
    this.saveClicked = false;
    this.amountAdvToFarmerForm.disable();
    this.disblAdvPaymetBtn = false;
    this.disblSaveBtn = true;
    this.amountAdvToFarmerForm.reset();
    this.filtredAmountAdvancesToFarmerModelList = new Array<AmountAdvancesToFarmerModel>();
    this.selectedAmountAdvancesToFarmerList = new Array<AmountAdvancesToFarmerModel>();
  }

  getHarvestAreas() {
    this.amountAdvService.getHarvestAreas().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.harvestAreas = res.Data;
      } else {
        this.alertService.error('Error while Fetching office harvest area!');
      }
    });
  }

  getCropGroup() {
    this.amountAdvService.getCropGroup().subscribe(res => {
      this.cropGroup = res;
    });
  }

  getCropSeason() {
    try {
      this.amountAdvService.getSeasonFromTo(this.amountAdvToFarmerForm.controls.materialName.value).subscribe(res => {
        this.seasonList = res;

      }, error => {
        this.alertService.error('Error in fetching Crop details!');
      });
    } catch (error) {
    }
  }

  getCropNameList() {
    try {
      this.amountAdvService.getCropCode(this.amountAdvToFarmerForm.controls.materialGroup.value).subscribe(res => {
        this.cropNameList = res;
      }, error => {
        this.alertService.error('Error in fetching Crop details!');
      });
    } catch (error) {
    }

  }

  getCountry() {
    const areaCode = this.amountAdvToFarmerForm.controls.areaID.value;
    this.amountAdvService.GetAreaDetailsByCode(areaCode).subscribe(areaDetail => {
      this.areaDetailList = areaDetail;
      this.areaDistinctCountry = areaDetail.filter(
        (thing, i, arr) => arr.findIndex(t => t.countryCode === thing.countryCode) === i
      );
      this.areaDistinctCountry.sort((a, b) => a.countryName.toLowerCase() > b.countryName.toLowerCase() ? 1 : -1);
    });
  }

  getState(contryCode) {
    if (contryCode != null) {
      this.stateList = new Array<State>();
      const distinctStateAreaDetails = this.areaDetailList.filter(
        area => area.countryCode === contryCode
      ).filter(
        (thing, i, arr) => arr.findIndex(t => t.stateCode === thing.stateCode) === i
      );
      distinctStateAreaDetails.forEach(element => {
        const stateDetail = new State();
        stateDetail.stateCode = element.stateCode;
        stateDetail.stateName = element.stateName;
        this.stateList.push(stateDetail);
      });
      this.stateList.sort((a, b) => a.stateName.toLowerCase() > b.stateName.toLowerCase() ? 1 : -1);
    }
  }


  getDisrtict(stateCode) {
    if (stateCode != null) {
      this.districtList = new Array<District>();
      this.mandalList = new Array<Mandal>();
      this.villageList = new Array<Village>();
      const distinctDistrictAreaDetails = this.areaDetailList.filter(
        area => area.stateCode === stateCode
      ).filter(
        (thing, i, arr) => arr.findIndex(t => t.districtCode === thing.districtCode) === i
      );
      distinctDistrictAreaDetails.forEach(element => {
        const district = new District();
        district.districtCode = element.districtCode;
        district.districtName = element.districtName;
        this.districtList.push(district);
      });
      // const farmerDetailFiltredByState = this.allFarmersArray.filter(
      //   farmr => farmr.stateCode === stateCode
      // );
      //this.filterFarmer(farmerDetailFiltredByState);
      this.districtList.sort((a, b) => a.districtName.toLowerCase() > b.districtName.toLowerCase() ? 1 : -1);
    }
  }

  getAllMandal(districtCode) {
    if (districtCode != null) {
      this.mandalList = new Array<Mandal>();
      this.villageList = new Array<Village>();
      const distinctMandalAreaDetails = this.areaDetailList.filter(
        area => area.districtCode === districtCode
      ).filter(
        (thing, i, arr) => arr.findIndex(t => t.mandalCode === thing.mandalCode) === i
      );
      distinctMandalAreaDetails.forEach(element => {
        const mandal = new Mandal();
        mandal.mandalCode = element.mandalCode;
        mandal.mandalName = element.mandalName;
        this.mandalList.push(mandal);
      });
      // const farmerDetailFiltredByDistrict = this.allFarmersArray.filter(
      //   farmr => farmr.districtCode === districtCode
      // );
      //this.filterFarmer(farmerDetailFiltredByDistrict);
      this.mandalList.sort((a, b) => a.mandalName.toLowerCase() > b.mandalName.toLowerCase() ? 1 : -1);
    }
  }

  getVillage(mandalCode) {
    if (mandalCode != null) {
      this.filterAmountAdvToFarmerByMandal(mandalCode);
      this.villageList = new Array<Village>();
      const distinctVillageAreaDetails = this.areaDetailList.filter(
        area => area.mandalCode === mandalCode
      ).filter(
        (thing, i, arr) => arr.findIndex(t => t.villageCode === thing.villageCode) === i
      );
      distinctVillageAreaDetails.forEach(element => {
        const village = new Village();
        village.villageCode = element.villageCode;
        village.villageName = element.villageName;
        this.villageList.push(village);
      });
      this.villageList.sort((a, b) => a.villageName.toLowerCase() > b.villageName.toLowerCase() ? 1 : -1);

      this.filteredVillageList = this.amountAdvToFarmerForm.controls.village.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.villageName),
          map(name => name ? this._filterVillage(name) : this.villageList.slice())
        );
      this.amountAdvToFarmerForm.controls.farmerCode.setValue('');
      this.amountAdvToFarmerForm.controls.farmersAccountNo.setValue('');
    }
  }

  private _filterVillage(name: string): Village[] {
    const filterValue = name.toLowerCase();
    return this.villageList.filter(option => option.villageName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(village: Village): string {
    return village && village.villageName ? village.villageName : '';
  }


  GetFieldSupervisorList() {
    this.filtredAmountAdvancesToFarmerModelList = [];
    const areaId = this.amountAdvToFarmerForm.controls.areaID.value
    this.amountAdvancesToFarmerFilterModel.areaId = areaId;
    const aggrementDate = this.amountAdvToFarmerForm.controls.acIssuedDate.value
    if (areaId != undefined && aggrementDate != undefined) {
      this.amountAdvService.GetFieldSupervisorList(areaId, aggrementDate).subscribe((res: any) => {
        this.supervisor = res.Data
      });
    }

  }

  GetFieldStaffList() {
    const areaId = this.amountAdvToFarmerForm.controls.areaID.value
    const aggrementDate = this.amountAdvToFarmerForm.controls.acIssuedDate.value
    if (areaId != undefined && aggrementDate != undefined) {
      this.amountAdvService.GetFieldStaffList(areaId, aggrementDate).subscribe((res: any) => {
        this.fieldStaff = res.Data
      })
    }
  }
  setFilterModel() {
    this.amountAdvancesToFarmerFilterModel = new AmountAdvancesToFarmerFilterModel();
    this.amountAdvancesToFarmerFilterModel.areaId = this.amountAdvToFarmerForm.controls.areaID.value;
    this.amountAdvancesToFarmerFilterModel.cropGroupCode = this.amountAdvToFarmerForm.controls.materialGroup.value;
    this.amountAdvancesToFarmerFilterModel.cropNameCode = this.amountAdvToFarmerForm.controls.materialName.value;
    this.amountAdvancesToFarmerFilterModel.pSNumber = this.amountAdvToFarmerForm.controls.seasonFromTo.value;
    this.amountAdvancesToFarmerFilterModel.supervisorFarmerCode = this.amountAdvToFarmerForm.controls.fieldSupervisorEmployeeID.value;
    this.amountAdvancesToFarmerFilterModel.fieldStaffFarmerCode = this.amountAdvToFarmerForm.controls.fieldStaffEmployeeID.value;

    this.getAllFarmers(this.amountAdvancesToFarmerFilterModel);
  }

  getAllFarmers(amountAdvancesToFarmerFilterModel) {
    this.amountAdvService.GetAdvAmountToFarmerDetails(amountAdvancesToFarmerFilterModel).subscribe(res => {
      debugger;
      this.amountAdvancesToFarmerModelList = [] = res.Data;
      this.filtredAmountAdvancesToFarmerModelList = this.amountAdvancesToFarmerModelList;

      this.filteredAccountList = this.amountAdvToFarmerForm.controls.fieldStaffEmployeeID.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.FarmersAccountNo),
          map(name => name ? this._filterAccount(name) : this.filtredAmountAdvancesToFarmerModelList.slice())
        );

      this.filteredFarmerNameList = this.amountAdvToFarmerForm.controls.fieldStaffEmployeeID.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.FarmerName),
          map(name => name ? this._filterFarmerName(name) : this.filtredAmountAdvancesToFarmerModelList.slice())
        );
    },
      error => {
        this.alertService.error('Error while getting farmer details!');
      });
  }

  private _filterAccount(name: string): AmountAdvancesToFarmerModel[] {
    const filterValue = name.toLowerCase();
    return this.filtredAmountAdvancesToFarmerModelList.filter(option => option.FarmersAccountNo.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterFarmerName(name: string): AmountAdvancesToFarmerModel[] {
    const filterValue = name.toLowerCase();
    return this.filtredFarmerNameAdvancesToFarmerModelList.filter(option => option.FarmerName.toLowerCase().indexOf(filterValue) === 0);
  }


  displayAccountFn(account: AmountAdvancesToFarmerModel): string {
    return account && account.FarmersAccountNo ? account.FarmersAccountNo : '';
  }

  displayFarmerNameFn(farmerName: AmountAdvancesToFarmerModel): string {
    return farmerName && farmerName.FarmerName ? farmerName.FarmerName : '';
  }

  eventCheck(event, farmerItem) {
    var val = event.srcElement.checked
    if (event.srcElement.checked) {
      if (farmerItem.AdvanceAmount !== null && farmerItem !== undefined) {
        farmerItem.ACEnteredEmployeeID = this.amountAdvToFarmerForm.controls.acEnteredEmployeeID.value;
        farmerItem.ACEntryDate = this.amountAdvToFarmerForm.controls.acEntryDate.value;
        farmerItem.ACIssuedDate = this.amountAdvToFarmerForm.controls.acIssuedDate.value;
        farmerItem.FieldStaffEmployeeID = this.amountAdvToFarmerForm.controls.fieldStaffEmployeeID.value;
        farmerItem.FieldSupervisorEmployeeID = this.amountAdvToFarmerForm.controls.fieldSupervisorEmployeeID.value;
        this.selectedAmountAdvancesToFarmerList.push(farmerItem);
      }
    }
    else {
      const index = this.selectedAmountAdvancesToFarmerList.findIndex(x => x.FarmerCode == farmerItem.FarmerCode)
      if (index > -1) {
        this.selectedAmountAdvancesToFarmerList.splice(index, 1);
      }
    }
  }

  saveAdvanceCashDetails() {
    this.saveClicked = true;
    if (!this.amountAdvToFarmerForm.valid) {
      return;
    } else if (this.selectedAmountAdvancesToFarmerList.length == 0 || this.selectedAmountAdvancesToFarmerList == undefined) {
      this.alertService.error('Please add a value to save');
      return;
    }

    this.amountAdvService.SaveAdvanceCashDetails(this.selectedAmountAdvancesToFarmerList).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.reset();
        this.alertService.success('Amount Advances To Farmer Added/Updated sucessfully');
      } else {
        this.alertService.error('Error while saving advance cash details!');
      }
    });
  }

  filterAmountAdvToFarmer(event, village) {
    if (event.source.selected) {
      this.filtredAmountAdvancesToFarmerModelList = this.amountAdvancesToFarmerModelList.filter(x => x.VillageCode == village.villageCode);
    }
  }
  filterAmountAdvToFarmerByMandal(mandalCode) {
    this.filtredAmountAdvancesToFarmerModelList = this.amountAdvancesToFarmerModelList.filter(x => x.mandalCode == mandalCode);
  }

  filterAmountAdvToFarmerbyAccount(event, account) {
    if (event.source.selected) {
      this.filtredAmountAdvancesToFarmerModelList = this.amountAdvancesToFarmerModelList.filter(x => x.FarmersAccountNo == account.FarmersAccountNo);
      var item = this.filtredAmountAdvancesToFarmerModelList.filter(x => x.FarmersAccountNo == account.FarmersAccountNo)[0];
      this.amountAdvToFarmerForm.controls.farmerCode.setValue(item);
      this.amountAdvToFarmerForm.controls.farmersAccountNo.setValue(item);
      //this._filterFarmerName(item.FarmerName)

    }
  }

  filterAmountAdvToFarmerbyFarmerName(event, farmerName) {
    if (event.source.selected) {
      this.filtredAmountAdvancesToFarmerModelList = this.amountAdvancesToFarmerModelList.filter(x => x.FarmerName == farmerName.FarmerName);
      var item = this.filtredAmountAdvancesToFarmerModelList.filter(x => x.FarmerName == farmerName.FarmerName)[0];
      this.amountAdvToFarmerForm.controls.farmerCode.setValue(item);
      this.amountAdvToFarmerForm.controls.farmersAccountNo.setValue(item);
    }
  }


  onBlurMethod() {

  }
}
