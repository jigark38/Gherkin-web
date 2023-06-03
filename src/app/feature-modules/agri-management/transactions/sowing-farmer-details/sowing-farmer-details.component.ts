import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SowingFarmerDetailsService } from './sowing-farmer-details.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AlertService } from '../../../../corecomponents/alert/alert.service';
import { FarmerDetails } from '../../master/farmer-details/farmer-details.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  FarmerForm,
  ExportModel,
  SowingSessions,
  HarvestData,
  HBOMPracticeForSowingFarmings, State,
  District,
  Mandal,
  Village,
  SowingFarmingDetails,
  FarmingStageDetails,
  FarmingGridModel,
  SowingSaveModal
} from './sowing-farmer-details.model';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-sowing-farmer-details',
  templateUrl: './sowing-farmer-details.component.html',
  styleUrls: ['./sowing-farmer-details.component.css']
})

export class SowingFarmerDetailsComponent implements OnInit {

  @ViewChild('AreaBranchDDL', { static: false }) areaBranchDDL: MatSelect;
  @ViewChild('NextBtn', { static: false }) nextBtn: ElementRef;
  @ViewChild('SaveBtn', { static: false }) saveBtn: ElementRef;
  @ViewChild('sowingDate', { static: false }) sowingDate: ElementRef;

  FarmerCode = new FormControl({ value: null });
  filteredFarmers: Observable<FarmerDetails[]>;

  LogedinUserDetail = null;
  FarmerDetailForm: FormGroup;
  FarmingDetailForm: FormGroup;
  stateList = null;
  districtList = null;
  mandalList = null;
  villageList = null;
  harvestAreaList = null;
  farmingDetailTabShow = true;
  farmerDetailTabshow = false;
  farmerDetailArray = new Array<FarmerDetails>();
  farmerDetailFiltredByState = new Array<FarmerDetails>();
  farmerForm = new FarmerForm();
  filteredCropDetails = null;
  filteredSeasionDetails = null;
  selectedFarmerDetail = new FarmerDetails();
  dsblFrmrDetailBtn = false;
  dsblNextBtn = true;
  dsblSaveBtn = true;
  dsblModifyBtn = false;
  exportDataModel = new ExportModel();
  fieldStaffList = null;
  vilageName = null;
  filteredSession = null;
  addFarmerDetailBtnClicked = false;
  harvestData = new HarvestData();
  distinctHbomDivision = Array<HBOMPracticeForSowingFarmings>();
  distinctAcrege = Array<HBOMPracticeForSowingFarmings>();
  sowingSessionDetail = null;
  areaDetailList = null;
  areaDistinctCountry = null;
  allFarmersArray = null;
  farmrAgreementDetails = null;
  farmingStgDetail = null;
  farmingGridData: any = null;
  nextButtonClicked = false;
  selectedFarmingDetail = null;
  harvestDetailSelected = false;
  selectedRowIndex = null;
  farmingDetails = null;
  employeeId: string;
  employeeName: string;

  constructor(
    private sowingService: SowingFarmerDetailsService,
    private alertService: AlertService,
    public authService: AuthenticationService) { }

  ngOnInit() {

    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.FarmerDetailForm = new FormGroup({
      AreaName: new FormControl(null, Validators.required),
      CropGroup: new FormControl(null, Validators.required),
      CropName: new FormControl(null, Validators.required),
      Season: new FormControl(null, Validators.required),
      Country: new FormControl(null, Validators.required),
      StateCode: new FormControl(null, Validators.required),
      DistrictCode: new FormControl(null),
      MandalCode: new FormControl(null),
      VillageCode: new FormControl(null)
    });

    this.FarmingDetailForm = new FormGroup({
      AreaCode: new FormControl(null, Validators.required),
      FarmerCode: new FormControl(null, Validators.required),
      VillageCode: new FormControl(null, Validators.required),
      AccountNumber: new FormControl(null, Validators.required),
      HarvestArea: new FormControl(null, Validators.required),
      CropNameCode: new FormControl(null, Validators.required),
      GoogleLocation: new FormControl(null),
      SesionFrom: new FormControl(null, Validators.required),
      DateOfSowing: new FormControl(null, Validators.required),
      LoginUserName: new FormControl(null, Validators.required),
      FarmngReportDate: new FormControl(null, Validators.required),
      FieldStaff: new FormControl(null, Validators.required),
      PckageOfPractice: new FormControl(null, Validators.required),
      PracticeAcrege: new FormControl(null, Validators.required),
      FarmingDetail: new FormControl(null, Validators.required),
      Remark: new FormControl(null, Validators.required),
    });
    this.reset();
  }

  displayFn(farmer: FarmerDetails): string {
    return farmer && farmer.farmerName ? farmer.farmerName : '';
  }

  private _filterFarmer(name: string): FarmerDetails[] {
    const filterValue = name.toLowerCase();
    return this.farmerDetailArray.filter(option => option.farmerName.toLowerCase().indexOf(filterValue) === 0);
  }

  reset() {
    this.FarmerDetailForm.disable();
    this.FarmerDetailForm.reset();
    this.FarmerCode.reset();
    this.filteredFarmers = null;
    this.farmingDetailTabShow = true;
    this.farmerDetailTabshow = false;
    this.filteredCropDetails = null;
    this.filteredSession = null;
    this.fieldStaffList = null;
    this.dsblFrmrDetailBtn = false;
    this.dsblNextBtn = true;
    this.dsblSaveBtn = true;
    this.dsblModifyBtn = false;
    this.farmerForm = new FarmerForm();
    this.farmerDetailArray = new Array<FarmerDetails>();
    this.selectedFarmerDetail = new FarmerDetails();
    this.exportDataModel = new ExportModel();
    this.addFarmerDetailBtnClicked = false;
    this.sowingSessionDetail = Array<SowingSessions>();
    this.areaDetailList = null;
    this.areaDistinctCountry = null;
    this.allFarmersArray = new Array<FarmerDetails>();
    this.farmrAgreementDetails = Array<SowingSessions>();
    this.farmingGridData = null;
    this.nextButtonClicked = false;
    this.selectedFarmingDetail = null;
    this.harvestDetailSelected = false;
    this.selectedRowIndex = null;
    this.farmingDetails = null;
  }

  addFarmerDetails() {
    this.reset();
    this.addFarmerDetailBtnClicked = true;
    this.FarmerDetailForm.enable();
    this.getHarvestareaList();
    this.areaBranchDDL.focus();
  }

  getHarvestareaList() {
    this.sowingService.getHarvestAreaList().subscribe(res => {
      this.harvestAreaList = res;
      this.harvestAreaList.sort((a, b) => a.areaName.toLowerCase() > b.areaName.toLowerCase() ? 1 : -1);
    });
  }

  getFormData(areaCode) {
    if (areaCode != null) {
      this.sowingService.getFormData(areaCode).subscribe(formData => {
        this.farmerForm = formData;
        this.exportDataModel.harvestArea = this.harvestAreaList.filter(
          area => area.areaId === areaCode
        );
        this.farmerForm.cropGroups.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
      });
      this.sowingService.GetAreaDetailsByCode(areaCode).subscribe(areaDetail => {
        this.areaDetailList = areaDetail;
        this.areaDistinctCountry = areaDetail.filter(
          (thing, i, arr) => arr.findIndex(t => t.countryCode === thing.countryCode) === i
        );
        this.areaDistinctCountry.sort((a, b) => a.countryName.toLowerCase() > b.countryName.toLowerCase() ? 1 : -1);
      });
    }
  }

  filterCropList(GroupCode) {
    if (GroupCode != null) {
      this.filteredCropDetails = this.farmerForm.cropNames.filter(
        cr => cr.CropGroupCode === GroupCode
      );
      this.filteredCropDetails.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
    }
  }

  getSeletedCrop(crop) {
    this.exportDataModel.crop = this.filteredCropDetails.filter(
      cr => cr.CropCode === crop.CropCode
    );
    this.filteredSession = this.farmerForm.sowingSessions.filter(
      session => session.cropNameCode === crop.CropCode
    ).filter(
      (thing, i, arr) => arr.findIndex(t => t.psNumber === thing.psNumber) === i
    );
  }

  getSeletedSession(session) {
    this.sowingSessionDetail = this.farmerForm.sowingSessions.filter(
      seson => seson.psNumber === session.psNumber
    );
    this.getAllFarmers();
  }


  nextClicked() {
    this.FarmingDetailForm.reset();
    this.nextButtonClicked = true;
    this.farmingDetailTabShow = false;
    this.farmerDetailTabshow = true;
    this.vilageName = null;
    this.farmingStgDetail = null;
    this.farmingGridData = null;
    this.selectedFarmingDetail = null;
    this.getVillageNameByVillageCod(this.exportDataModel.farmerDetails[0].villageCode);
    this.FarmingDetailForm.get('AreaCode').setValue(this.exportDataModel.harvestArea[0].areaId);
    this.FarmingDetailForm.get('FarmerCode').setValue(this.exportDataModel.farmerDetails[0].farmerCode);
    this.FarmingDetailForm.get('VillageCode').setValue(this.exportDataModel.farmerDetails[0].villageCode);
    this.FarmingDetailForm.get('AccountNumber').setValue(this.exportDataModel.farmerDetails[0].bankAccountNo);
    this.FarmingDetailForm.get('HarvestArea').setValue(this.exportDataModel.sowingSessions[0].farmerNoOfAcresArea);
    this.FarmingDetailForm.get('CropNameCode').setValue(this.exportDataModel.crop[0].CropCode);
    this.FarmingDetailForm.get('LoginUserName').setValue(this.employeeName);
    this.FarmingDetailForm.get('SesionFrom').setValue(this.exportDataModel.sowingSessions[0].psNumber);
    this.sowingService.GetFieldStaffByArea(this.exportDataModel.harvestArea[0].areaId).subscribe(res => {
      this.fieldStaffList = res;
      this.fieldStaffList.forEach(element => {
        this.sowingService.GetEmployeeByEmpId(element.employeeID).subscribe(epmloy => {
          element.employeeName = epmloy.employeeName;
        });
      });
    });
    this.dsblNextBtn = true;
    this.sowingDate.nativeElement.focus();
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
      const farmerDetailFiltredByState = this.allFarmersArray.filter(
        farmr => farmr.stateCode === stateCode
      );
      this.filterFarmer(farmerDetailFiltredByState);
      this.districtList.sort((a, b) => a.districtName.toLowerCase() > b.districtName.toLowerCase() ? 1 : -1);
    }
  }

  filterFarmer(farmerDetailFiltred) {
    this.farmrAgreementDetails = Array<SowingSessions>();
    this.farmerDetailArray = new Array<FarmerDetails>();
    this.sowingSessionDetail.forEach(element => {
      const farmerdtl = farmerDetailFiltred.filter(
        farmerDetl => farmerDetl.farmerCode === element.farmersCode
      );
      if (farmerdtl.length > 0) {
        element.farmerName = farmerdtl[0].farmerName;
        this.farmerDetailArray.push(farmerdtl[0]);
        this.farmrAgreementDetails.push(element);
      }
    });
    this.farmerDetailArray = this.farmerDetailArray.filter(
      (thing, i, arr) => arr.findIndex(t => t.farmerCode === thing.farmerCode) === i
    );
    this.filteredFarmers = this.FarmerCode.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.farmerName),
        map(name => name ? this._filterFarmer(name) : this.farmerDetailArray.slice())
      );
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
      const farmerDetailFiltredByDistrict = this.allFarmersArray.filter(
        farmr => farmr.districtCode === districtCode
      );
      this.filterFarmer(farmerDetailFiltredByDistrict);
      this.mandalList.sort((a, b) => a.mandalName.toLowerCase() > b.mandalName.toLowerCase() ? 1 : -1);
    }
  }

  getVillage(mandalCode) {
    if (mandalCode != null) {
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
      const farmerDetailFiltredByMandal = this.allFarmersArray.filter(
        farmr => farmr.mandalCode === mandalCode
      );
      this.filterFarmer(farmerDetailFiltredByMandal);
      this.villageList.sort((a, b) => a.villageName.toLowerCase() > b.villageName.toLowerCase() ? 1 : -1);
    }
  }

  getAllFarmers() {
    this.sowingService.getAllFarmers().subscribe(res => {
      this.farmerForm.sowingSessions.forEach(element => {
        const farmer = res.filter(
          farmerDetail => farmerDetail.farmerCode === element.farmersCode
        );
        this.allFarmersArray.push(farmer[0]);
      });
    },
      error => {
        this.alertService.error('Error while getting farmer details!');
      });
  }

  getFarmerListByVillage(event, VillageCode) {
    if (event.source.selected) {
      const farmerDetailFiltredByVillage = this.allFarmersArray.filter(
        farmr => farmr.villageCode === VillageCode
      );
      this.filterFarmer(farmerDetailFiltredByVillage);
    }
  }

  farmerSelected(farmerdetail) {
    this.selectedFarmerDetail = new FarmerDetails();
    this.farmerDetailArray = this.farmerDetailArray.filter(
      farmer => farmer.farmerCode === farmerdetail.farmersCode
    );
    this.exportDataModel.farmerDetails = this.farmerDetailArray;
    this.exportDataModel.sowingSessions = new Array<SowingSessions>();
    this.exportDataModel.sowingSessions.push(farmerdetail);
    this.onBlurMethod();
  }

  onBlurMethod() {
    if (this.FarmerDetailForm.valid) {
      if (this.exportDataModel.sowingSessions != null) {
        this.dsblNextBtn = false;
        this.nextBtn.nativeElement.focus();
      }
    }
  }

  onBlurFarmingformField() {
    if (this.FarmingDetailForm.valid) {
      if (this.harvestDetailSelected) {
        this.dsblSaveBtn = false;
        this.saveBtn.nativeElement.focus();
      }
    }
  }

  getSeletedFarmer(event, farmerdetail) {
    if (event.source.selected) {
      this.farmrAgreementDetails = this.sowingSessionDetail.filter(farmerAgreemnt =>
        farmerAgreemnt.farmersCode === farmerdetail.farmerCode
      );
    }
  }

  getVillageNameByVillageCod(villageCode) {
    this.sowingService.VillageByCode(villageCode).subscribe(village => {
      this.vilageName = village.villageName;
    });
  }

  onSowingDateSelect() {
    this.harvestData = new HarvestData();
    const sowingDate = this.formatDate(this.FarmingDetailForm.get('DateOfSowing').value);
    const psNumber = this.exportDataModel.sowingSessions[0].psNumber;
    const cropCode = this.exportDataModel.crop[0].CropCode;
    this.sowingService.GetFarmingGridDetail(psNumber, sowingDate, cropCode).subscribe(data => {
      this.harvestData = data;
      this.getDistinctDivisionFor();
    });
    this.onBlurFarmingformField();
  }

  harvestDetailsSelected(i, data) {
    this.selectedRowIndex = null;
    this.selectedRowIndex = i;
    this.harvestDetailSelected = true;
    this.selectedFarmingDetail = data;
    this.onBlurFarmingformField();
  }

  getDistinctDivisionFor() {
    this.distinctHbomDivision = Array<HBOMPracticeForSowingFarmings>();
    this.distinctHbomDivision = this.harvestData.hbomPracticeForSowingFarmings.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.hbomDivisionFor === thing.hbomDivisionFor)) === i;
    });
  }

  filterAcrege(event, DivisionFor) {
    if (event.source.selected) {
      this.distinctAcrege = Array<HBOMPracticeForSowingFarmings>();
      this.distinctAcrege = this.harvestData.hbomPracticeForSowingFarmings.filter(
        harvestData => harvestData.hbomDivisionFor === DivisionFor.hbomDivisionFor
      );
      this.distinctAcrege = this.distinctAcrege.filter((thing, i, arr) => {
        return arr.indexOf(arr.find(t => t.hbomPracticePerAcerage === thing.hbomPracticePerAcerage)) === i;
      });
      this.farmingStgDetail = this.harvestData.hbomPracticeForSowingFarmings.filter(
        hbomPractice => hbomPractice.hbomDivisionFor === DivisionFor.hbomDivisionFor
      );
      this.onBlurFarmingformField();
    }
  }
  onSelectAcrege(event, acrege) {
    if (event.source.selected) {
      this.farmingStgDetail = this.farmingStgDetail.filter(
        hbomPractice => hbomPractice.hbomPracticePerAcerage === acrege.hbomPracticePerAcerage
      );

      this.farmingGridData = new Array<FarmingGridModel>();
      this.harvestData.harvestDataForSowingFarrmingDto.forEach(element => {
        const farmingdetail = this.farmingStgDetail.filter(
          detail => detail.hsCropPhaseCode === element.hsCropPhaseCode
        );
        if (farmingdetail.length > 0) {
          farmingdetail.forEach(item => {
            const data = new FarmingGridModel();
            data.harvestData = element;
            data.hbomPractice = item;
            this.farmingGridData.push(data);
          });
        }
      });
      this.onBlurFarmingformField();
    }
  }

  selectedFieldStaff(event, staff) {
    this.onBlurFarmingformField();
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  saveClicked() {
    if (!this.FarmingDetailForm.valid) {
      return;
    }
    const sowingFarmingDetails = new SowingFarmingDetails();
    sowingFarmingDetails.sowingNo = 0;
    sowingFarmingDetails.areaId = this.FarmingDetailForm.get('AreaCode').value;
    sowingFarmingDetails.farmerCode = this.FarmingDetailForm.get('FarmerCode').value;
    sowingFarmingDetails.farmersAgreementCode = this.exportDataModel.sowingSessions[0].farmersAggrementCode;
    sowingFarmingDetails.farmersAccountNo = this.FarmingDetailForm.get('AccountNumber').value;
    sowingFarmingDetails.cropNameCode = this.FarmingDetailForm.get('CropNameCode').value;
    // sowingFarmingDetails.cropSchemeCode = 'CSC_1';
    sowingFarmingDetails.farmerLocation = null;
    sowingFarmingDetails.farmPicture = null;
    sowingFarmingDetails.psNumber = this.FarmingDetailForm.get('SesionFrom').value;
    sowingFarmingDetails.sowingBeginingDate = this.FarmingDetailForm.get('DateOfSowing').value;
    sowingFarmingDetails.hsEnteredEmpId = this.employeeName;

    const farmingStageDetails = new FarmingStageDetails();
    farmingStageDetails.harvestFarmingNo = 0;
    farmingStageDetails.sowingNo = 0;
    farmingStageDetails.farmimngReportDate = this.FarmingDetailForm.get('FarmngReportDate').value;
    farmingStageDetails.employeeId = this.FarmingDetailForm.get('FieldStaff').value;
    farmingStageDetails.hbomDivisionFor = this.FarmingDetailForm.get('PckageOfPractice').value;
    farmingStageDetails.farmingReportDetails = this.FarmingDetailForm.get('FarmingDetail').value;
    farmingStageDetails.farmingRemarks = this.FarmingDetailForm.get('Remark').value;
    farmingStageDetails.id = this.selectedFarmingDetail.hbomPractice.id;
    farmingStageDetails.hsCropPhaseCode = this.selectedFarmingDetail.harvestData.hsCropPhaseCode;

    const insertModel = new SowingSaveModal();
    insertModel.sowingFarmingDetails = sowingFarmingDetails;
    insertModel.farmingStageDetails = farmingStageDetails;

    this.sowingService.AddSowingDetails(insertModel).subscribe(res => {
      this.reset();
      this.alertService.success('Sowing farmer details added successfuly!');
    },
      error => {
        this.alertService.error('Error has occured while saving!');
      });

  }
}
