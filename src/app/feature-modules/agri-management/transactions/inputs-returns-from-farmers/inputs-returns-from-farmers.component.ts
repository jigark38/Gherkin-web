import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { EmployeeService } from '../../../human-resource-mgmnt/master/employee-details/employee-details.service';
import { CropesAndSchemesService } from '../../master/crops-and-schemes/cropes-and-schemes.service';
import { Crops } from '../../master/crops-and-schemes/crops-and-schemes.model';
import { HarvestArea, Village } from '../sowing-farmer-details/sowing-farmer-details.model';
import { SowingFarmerDetailsService } from '../sowing-farmer-details/sowing-farmer-details.service';
import {
  FarmerAndVillage, FarmersInputsMaterialDetail, FarmersInputsMaterialMaster,
  FieldStaffCropGroupSeason, OrgOffice, SeasonFromTo
} from './inputs-returns-from-farmers.model';
import { InputsReturnsFromFarmersService } from './inputs-returns-from-farmers.service';
import { Employee } from '../../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { CropGroup } from '../../master/crops-and-schemes/crops-and-schemes.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MaterialInputIssueToFarmerService } from './../material-input-issue-to-farmer/material-input-issue-to-farmer.service';
import { CropGrp, CropName, PlantationSchedul } from './../plantation-scheduling/plantation-scheduling.model';

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

@Component({
  selector: 'app-inputs-returns-from-farmers',
  templateUrl: './inputs-returns-from-farmers.component.html',
  styleUrls: ['./inputs-returns-from-farmers.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InputsReturnsFromFarmersComponent implements OnInit {

  @ViewChild('dateOfReturn', { static: false }) dateOfReturn: ElementRef;
  @ViewChild('fieldStaffArea', { static: false }) fieldStaffArea: MatSelect;
  @ViewChild('fieldStaffName', { static: false }) fieldStaffName: MatSelect;
  @ViewChild('cropGroup', { static: false }) cropGroup: MatSelect;
  @ViewChild('cropName', { static: false }) cropName: MatSelect;
  @ViewChild('seasonFromTo', { static: false }) seasonFromTo: MatSelect;
  @ViewChild('stockReturnedTo', { static: false }) stockReturnedTo: MatSelect;

  isLoading: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  disableButton: boolean;

  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  loggedInUserName: string;
  loggedInUserID: string;

  farmersInputsMaterialMaster: FarmersInputsMaterialMaster;
  farmersInputsMaterialDetail: FarmersInputsMaterialDetail[];
  fieldStaffCropGroupSeason: FieldStaffCropGroupSeason;
  harvestAreaList: HarvestArea[];
  cropList: Crops[];
  villageList: Village[];
  farmerList: FarmerAndVillage[];
  officeLocationList: OrgOffice[];

  farmersInputsMaterialMasterId: number;
  selectedArea: HarvestArea;
  selectedFieldStaffEmployee: Employee;
  selectedCropGroup: CropGroup;
  selectedCrop: Crops;
  selectedSeasonFromTo: SeasonFromTo;
  selectedVillage: Village;
  selectedFarmer: FarmerAndVillage;
  selectedOrgOffice: OrgOffice;
  fetchingDetails: boolean;
  isMasterRecordAlreadyExist: boolean;
  areaWiseSeasonToFromList: PlantationSchedul[] = [];

  farmersInputsMaterialMasterForm = new FormGroup({
    DateOfReturn: new FormControl('', [Validators.required]),
    FieldStaffArea: new FormControl('', [Validators.required]),
    FieldStaffEmployee: new FormControl('', [Validators.required]),
    CropGroup: new FormControl('', [Validators.required]),
    CropName: new FormControl('', [Validators.required]),
    SeasonFromTo: new FormControl('', [Validators.required]),
    Village: new FormControl('', [Validators.required]),
    FarmerAltContactPerson: new FormControl('', [Validators.required]),
    FarmerName: new FormControl('', [Validators.required]),
    ReturnVoucherNo: new FormControl('', []),
    StockReturnedTo: new FormControl('', [Validators.required]),
  });

  farmersInputsMaterialDetailForm = new FormGroup({
    ReturnQty: new FormControl('', [Validators.required])
  });

  constructor(public authService: AuthenticationService, private famerDetailsService: SowingFarmerDetailsService,
    private inputsReturnsFromFarmersService: InputsReturnsFromFarmersService,
    private cropesAndSchemesService: CropesAndSchemesService, private empService: EmployeeService,
    private webservicewrapperService: WebservicewrapperService, private alertService: AlertService,
    private readonly materialInputIssueToFarmerService: MaterialInputIssueToFarmerService,
  ) { }

  ngOnInit() {

    this.enableNew = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;

    this.farmersInputsMaterialMasterId = 0;

    this.farmersInputsMaterialMaster = new FarmersInputsMaterialMaster();
    this.farmersInputsMaterialDetail = [];
    this.fieldStaffCropGroupSeason = new FieldStaffCropGroupSeason();
    this.harvestAreaList = [];
    this.cropList = [];
    this.villageList = [];
    this.farmerList = [];
    this.officeLocationList = [];

    this.selectedArea = null;
    this.selectedFieldStaffEmployee = null;
    this.selectedCropGroup = null;
    this.selectedCrop = null;
    this.selectedSeasonFromTo = null;
    this.selectedVillage = null;
    this.selectedFarmer = null;
    this.selectedOrgOffice = null;
    this.fetchingDetails = false;
    this.isMasterRecordAlreadyExist = false;

    this.getFieldStaffAreaList();
    this.getOfficeLocations();

    this.farmersInputsMaterialMasterForm.reset();
    this.farmersInputsMaterialMasterForm.disable();
    this.farmersInputsMaterialMasterForm.controls.DateOfReturn.setValue(new Date());

    this.farmersInputsMaterialMasterForm.controls.Village.valueChanges.pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.webservicewrapperService.GetVillageListByAreaAndEmployee(this.getAreaId(), this.getEmployeeId(), value)
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      this.villageList = m;
    });

    this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.valueChanges.pipe(
      map(a => {
        if (a) {
          return a.trim();
        } else {
          return '';
        }
      }),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.famerDetailsService.GetFarmerListByAreaEmployeePSNumberAndFarmerAltContactPerson(value,
        this.getAreaId(), this.getEmployeeId(), this.getPsNumber())
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      this.farmerList = m;
    });

    this.farmersInputsMaterialMasterForm.controls.FarmerName.valueChanges.pipe(
      map(a => {
        if (a) {
          return a.trim();
        } else {
          return '';
        }
      }),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.famerDetailsService.GetFarmerListByAreaEmployeePSNUmberAndFarmerName(value,
        this.getAreaId(), this.getEmployeeId(), this.getPsNumber())
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      this.farmerList = m;
    });
  }

  clearFormDetails() {
    try {
      this.isFindOn = false;
      this.isModifyOn = false;

      this.farmersInputsMaterialMasterForm.reset();
      this.farmersInputsMaterialMasterForm.disable();
      this.farmersInputsMaterialMasterForm.controls.DateOfReturn.setValue(new Date());

      this.cropList = [];
      this.villageList = [];
      this.farmerList = [];
      // this.officeLocationList = [];

      this.farmersInputsMaterialMasterId = 0;
      this.selectedArea = null;
      this.selectedFieldStaffEmployee = null;
      this.selectedCropGroup = null;
      this.selectedCrop = null;
      this.selectedSeasonFromTo = null;
      this.selectedVillage = null;
      this.selectedFarmer = null;
      this.selectedOrgOffice = null;
      this.fetchingDetails = false;
      this.isMasterRecordAlreadyExist = false;

      this.farmersInputsMaterialDetail = [];

      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;

      // Uncomment this code to autofill the logged in employee details
      // const loggedInUser = this.authService.getUserdetails();
      // this.loggedInUserID = loggedInUser.employeeId;
      // this.loggedInUserName = loggedInUser.userName;
      // this.farmersInputsMaterialMasterForm.controls.FieldStaffEmployee.setValue(this.loggedInUserName);

    } catch (error) {

    }
  }

  saveFarmersInputReturns() {
    this.disableButton = true;
    const returnMaster = this.getReturnsMaster();
    this.isMasterRecordAlreadyExist = false;
    if (this.farmersInputsMaterialMasterId === 0) {
      this.inputsReturnsFromFarmersService.CreateInputReturnsFromFarmersMaster(returnMaster)
        .subscribe((data: FarmersInputsMaterialMaster) => {

          if (data) {
            this.farmersInputsMaterialDetail.forEach((value, index) => {
              value.fIMReturnNo = data.fIMReturnNo;
            });

            this.inputsReturnsFromFarmersService.CreateInputReturnsFromFarmersDetail(this.farmersInputsMaterialDetail)
              .subscribe(() => {
                this.disableButton = false;
                this.alertService.success('Inputs Returned from Farmers Saved Successfully');
                this.clearFormDetails();
              });
          } else {
            this.isMasterRecordAlreadyExist = true;
            this.disableButton = false;
          }
        });
    } else {

      this.farmersInputsMaterialDetail.forEach((value, index) => {
        value.fIMReturnNo = this.farmersInputsMaterialMasterId;
      });

      this.inputsReturnsFromFarmersService.UpdateInputReturnsFromFarmersDetail(this.farmersInputsMaterialDetail)
        .subscribe(() => {
          this.disableButton = false;
          this.alertService.success('Inputs Returned from Farmers Saved Successfully');
          this.clearFormDetails();
        });

      // this.inputsReturnsFromFarmersService.UpdateInputReturnsFromFarmersMaster(returnMaster)
      //   .subscribe((data: FarmersInputsMaterialMaster) => {

      //     this.farmersInputsMaterialDetail.forEach((value, index) => {
      //       value.fIMReturnNo = data.fIMReturnNo;
      //     });

      //     this.inputsReturnsFromFarmersService.UpdateInputReturnsFromFarmersDetail(this.farmersInputsMaterialDetail)
      //       .subscribe(() => {
      //         this.disableButton = false;
      //         this.alertService.success('Inputs Returned from Farmers Saved Successfully');
      //         this.clearFormDetails();
      //       });
      //   });
    }

  }

  inputReturns() {
    try {
      this.clearFormDetails();
      this.farmersInputsMaterialMasterForm.enable();
      this.farmersInputsMaterialMasterForm.controls.Village.disable();
      this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.disable();
      this.farmersInputsMaterialMasterForm.controls.FarmerName.disable();
      this.focusDateOfEntry();
      this.enableNew = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;

      this.farmersInputsMaterialMasterId = 0;
    } catch (error) {

    }
  }

  findReturns() {
    this.isModifyOn = false;
    this.isFindOn = true;

    this.enableNew = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;

    this.farmersInputsMaterialMasterForm.controls.FieldStaffArea.enable();
    this.farmersInputsMaterialMasterForm.controls.FieldStaffEmployee.enable();
    this.farmersInputsMaterialMasterForm.controls.CropGroup.enable();
    this.farmersInputsMaterialMasterForm.controls.CropName.enable();
    this.farmersInputsMaterialMasterForm.controls.SeasonFromTo.enable();
    this.farmersInputsMaterialMasterForm.controls.Village.enable();
    this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.enable();
    this.farmersInputsMaterialMasterForm.controls.FarmerName.enable();
    this.focusFieldStaffArea();
  }

  modifyReturns() {
    this.isModifyOn = true;
    this.isFindOn = false;

    this.enableNew = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.farmersInputsMaterialMasterForm.controls.FieldStaffArea.enable();
    this.farmersInputsMaterialMasterForm.controls.FieldStaffEmployee.enable();
    this.farmersInputsMaterialMasterForm.controls.CropGroup.enable();
    this.farmersInputsMaterialMasterForm.controls.CropName.enable();
    this.farmersInputsMaterialMasterForm.controls.SeasonFromTo.enable();
    this.farmersInputsMaterialMasterForm.controls.Village.enable();
    this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.enable();
    this.farmersInputsMaterialMasterForm.controls.FarmerName.enable();
    this.focusFieldStaffArea();
  }

  getAreaId(): string {
    if (this.selectedArea) {
      return this.selectedArea.areaId;
    } else {
      return '';
    }
  }

  getEmployeeId(): string {
    if (this.selectedFieldStaffEmployee) {
      return this.selectedFieldStaffEmployee.employeeId;
    } else {
      return '';
    }
  }

  getPsNumber(): string {
    if (this.selectedSeasonFromTo) {
      return this.selectedSeasonFromTo.psNumber;
    } else {
      return '';
    }
  }

  getCropNameCode(): string {
    if (this.selectedCrop) {
      return this.selectedCrop.CropCode;
    } else {
      return '';
    }
  }

  getFarmerCode(): string {
    if (this.selectedFarmer) {
      return this.selectedFarmer.farmerCode;
    } else {
      return '';
    }
  }

  getFieldStaffAreaList() {
    this.famerDetailsService.getHarvestAreaList().subscribe((areaList: HarvestArea[]) => {
      this.harvestAreaList = areaList;
    });
  }

  getOfficeLocations() {
    this.empService.getOfficeLocations().subscribe((data: OrgOffice[]) => {
      this.officeLocationList = data;
    });
  }

  getFieldStaffCropGroupSeasonList() {
    this.inputsReturnsFromFarmersService.GetFieldStaffCropGroupSeasonByAreaId(this.getAreaId())
      .subscribe((data: FieldStaffCropGroupSeason) => {
        this.fieldStaffCropGroupSeason = data;
      });
  }

  getSeasonDetailsByCropAndArea() {
    //this.areaWiseSeasonToFromList
    const cropGroupCode = this.farmersInputsMaterialMasterForm.controls.CropGroup.value;
    const cropNameCode = this.farmersInputsMaterialMasterForm.controls.CropName.value;
    this.materialInputIssueToFarmerService.getPlantationSchedule(cropGroupCode, cropNameCode).subscribe(res => {
      this.areaWiseSeasonToFromList = res;
    },
      error => {
        this.alertService.error('Error while fetching plantation schedule!');
      });

  }

  getFarmersInputsMaterialDetail() {
    setTimeout(() => {
      if (!this.fetchingDetails) {
        this.fetchingDetails = true;
        this.inputsReturnsFromFarmersService.GetFarmersInputsMaterialDetail(this.getPsNumber(),
          this.getFarmerCode(), this.getCropNameCode(), this.getAreaId(), this.farmersInputsMaterialMasterId)
          .subscribe((data: FarmersInputsMaterialDetail[]) => {
            this.farmersInputsMaterialDetail = data;
            this.fetchingDetails = false;
          });
      }
    }, 500);
  }

  optionSelectedVillage(event) {
    const selectedVillage = this.villageList.find(x => x.villageCode === event.option.value);
    this.selectedVillage = selectedVillage;
    this.farmersInputsMaterialMasterForm.controls.Village.setValue(this.selectedVillage.villageName);
    // this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.setValue(null);
    // this.farmersInputsMaterialMasterForm.controls.FarmerName.setValue(null);
  }

  onFieldStaffAreaSelectionChanged() {
    const areaId = this.farmersInputsMaterialMasterForm.controls.FieldStaffArea.value;
    this.selectedArea = this.harvestAreaList.find(x => x.areaId === areaId);

    this.selectedFieldStaffEmployee = null;
    this.selectedCropGroup = null;
    this.selectedCrop = null;
    this.selectedSeasonFromTo = null;
    this.selectedVillage = null;
    this.selectedFarmer = null;

    this.farmersInputsMaterialMasterForm.controls.FieldStaffEmployee.setValue(null);
    this.farmersInputsMaterialMasterForm.controls.CropGroup.setValue(null);
    this.farmersInputsMaterialMasterForm.controls.CropName.setValue(null);
    this.farmersInputsMaterialMasterForm.controls.SeasonFromTo.setValue(null);
    this.farmersInputsMaterialMasterForm.controls.Village.setValue(null);
    this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.setValue(null);
    this.farmersInputsMaterialMasterForm.controls.FarmerName.setValue(null);
    this.farmersInputsMaterialDetail = [];

    this.getFieldStaffCropGroupSeasonList();
  }

  onFieldStaffEmployeeSelectionChanged() {
    const employeeId = this.farmersInputsMaterialMasterForm.controls.FieldStaffEmployee.value;
    this.selectedFieldStaffEmployee = this.fieldStaffCropGroupSeason.fieldStaffList.find(x => x.employeeId === employeeId);
  }

  onCropGroupSelectionChanged() {
    const cropGroupCode = this.farmersInputsMaterialMasterForm.controls.CropGroup.value;
    this.selectedCropGroup = this.fieldStaffCropGroupSeason.cropGroupList.find(x => x.CropGroupCode === cropGroupCode);
    this.cropesAndSchemesService.GetCropListByCropGroupCode(cropGroupCode)
      .subscribe((data: Crops[]) => {
        this.cropList = data;
      });
  }

  onCropSelectinChanged() {
    const cropCode = this.farmersInputsMaterialMasterForm.controls.CropName.value;
    this.selectedCrop = this.cropList.find(x => x.CropCode === cropCode);
    this.getSeasonDetailsByCropAndArea();
  }

  onSeasonFromToSelectionChanged() {
    const psNumber = this.farmersInputsMaterialMasterForm.controls.SeasonFromTo.value;
    this.selectedSeasonFromTo = this.fieldStaffCropGroupSeason.seasonFromTo.find(x => x.psNumber === psNumber);

    this.selectedVillage = null;
    this.selectedFarmer = null;

    if (!this.isFindOn && !this.isModifyOn) {
      this.farmersInputsMaterialMasterForm.controls.Village.setValue(null);
      this.farmersInputsMaterialMasterForm.controls.Village.enable();

      this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.setValue(null);
      this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.enable();

      this.farmersInputsMaterialMasterForm.controls.FarmerName.setValue(null);
      this.farmersInputsMaterialMasterForm.controls.FarmerName.enable();
    }
  }

  optionSelectedFarmer(event) {
    const selectedFarmer = this.farmerList.find(x => x.farmerCode === event.option.value);
    this.selectedFarmer = selectedFarmer;

    if (!this.isFindOn && !this.isModifyOn) {
      this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.setValue(selectedFarmer.farmerAltContactPerson);
      this.farmersInputsMaterialMasterForm.controls.FarmerName.setValue(selectedFarmer.farmerName);

      if (!this.selectedVillage) {
        this.selectedVillage = new Village();
        this.selectedVillage.villageCode = selectedFarmer.villageCode;
        this.selectedVillage.villageName = selectedFarmer.villageName;
        this.farmersInputsMaterialMasterForm.controls.Village.setValue(selectedFarmer.villageName);
      }

      this.getFarmersInputsMaterialDetail();
    } else {
      this.inputsReturnsFromFarmersService.GetFarmersInputsMaterialMaster(this.getPsNumber(),
        this.selectedFarmer.farmerCode, this.getCropNameCode(), this.getAreaId())
        .subscribe((data: FarmersInputsMaterialMaster) => {
          this.setReturnsMaster(data);
        });
    }
  }

  onStockReturnedToSelectionChanged() {
    const orgOfficeNo = this.farmersInputsMaterialMasterForm.controls.StockReturnedTo.value;
    this.selectedOrgOffice = new OrgOffice();

    if (orgOfficeNo === 'Area Branch') {
      this.selectedOrgOffice.orgOfficeNo = 0;
      this.selectedOrgOffice.orgOfficeName = 'Area Branch';
    } else if (orgOfficeNo === 'With Field Staff') {
      this.selectedOrgOffice.orgOfficeNo = 0;
      this.selectedOrgOffice.orgOfficeName = 'With Field Staff';
    } else {
      this.selectedOrgOffice.orgOfficeNo = orgOfficeNo;
      this.selectedOrgOffice.orgOfficeName = this.officeLocationList.find(x => x.orgOfficeNo === orgOfficeNo).orgOfficeName;
    }
  }

  setReturnsMaster(data: FarmersInputsMaterialMaster) {
    this.farmersInputsMaterialMaster = data;
    this.farmersInputsMaterialMasterId = data.fIMReturnNo;

    this.selectedArea = new HarvestArea();
    this.selectedArea.areaId = data.areaID;
    this.selectedArea.areaName = data.fieldStaffAreaName;

    this.selectedFieldStaffEmployee = new Employee();
    this.selectedFieldStaffEmployee.employeeId = data.employeeID;
    this.selectedFieldStaffEmployee.employeeName = data.fieldStaffEmployeeName;

    this.selectedCropGroup = new CropGroup();
    this.selectedCropGroup.CropGroupCode = data.cropGroupCode;
    this.selectedCropGroup.Name = data.cropGroupName;

    this.selectedCrop = new Crops();
    this.selectedCrop.CropCode = data.cropNameCode;
    this.selectedCrop.Name = data.cropName;

    this.selectedSeasonFromTo = new SeasonFromTo();
    this.selectedSeasonFromTo.psNumber = data.psNumber;
    this.selectedSeasonFromTo.seasonFromToDate = data.seasonFromTo;

    this.selectedVillage = new Village();
    this.selectedVillage.villageCode = data.villageCode;
    this.selectedVillage.villageName = data.villageName;

    this.selectedFarmer = new FarmerAndVillage();
    this.selectedFarmer.farmerCode = data.farmerCode;
    this.selectedFarmer.farmerName = data.farmerName;
    this.selectedFarmer.farmerAltContactPerson = data.farmerAltContactPerson;


    this.farmersInputsMaterialMasterForm.controls.FieldStaffArea.setValue(data.areaID);
    this.farmersInputsMaterialMasterForm.controls.FieldStaffEmployee.setValue(data.employeeID);
    this.farmersInputsMaterialMasterForm.controls.CropGroup.setValue(data.cropGroupCode);
    this.farmersInputsMaterialMasterForm.controls.CropName.setValue(data.cropNameCode);
    this.farmersInputsMaterialMasterForm.controls.SeasonFromTo.setValue(data.psNumber);
    this.farmersInputsMaterialMasterForm.controls.Village.setValue(data.villageName);
    this.farmersInputsMaterialMasterForm.controls.FarmerAltContactPerson.setValue(data.farmerAltContactPerson);
    this.farmersInputsMaterialMasterForm.controls.FarmerName.setValue(data.farmerName);
    this.farmersInputsMaterialMasterForm.controls.DateOfReturn.setValue(data.fMIRDate);
    this.farmersInputsMaterialMasterForm.controls.ReturnVoucherNo.setValue(data.fIMReturnVoucherNo);

    this.selectedOrgOffice = new OrgOffice();

    if (data.orgOfficeName === 'Area Branch') {
      this.selectedOrgOffice.orgOfficeNo = 0;
      this.selectedOrgOffice.orgOfficeName = 'Area Branch';
      this.farmersInputsMaterialMasterForm.controls.StockReturnedTo.setValue('Area Branch');
    } else if (data.orgOfficeName === 'With Field Staff') {
      this.selectedOrgOffice.orgOfficeNo = 0;
      this.selectedOrgOffice.orgOfficeName = 'With Field Staff';
      this.farmersInputsMaterialMasterForm.controls.StockReturnedTo.setValue('With Field Staff');
    } else {
      this.selectedOrgOffice.orgOfficeNo = data.orgOfficeNo;
      this.selectedOrgOffice.orgOfficeName = this.officeLocationList.find(x => x.orgOfficeNo === data.orgOfficeNo).orgOfficeName;
      this.farmersInputsMaterialMasterForm.controls.StockReturnedTo.setValue(data.orgOfficeNo);
    }

    this.onCropGroupSelectionChanged();
    this.getFarmersInputsMaterialDetail();
    this.farmersInputsMaterialMasterForm.disable();
  }

  getReturnsMaster() {
    const returnsMaster = new FarmersInputsMaterialMaster();
    returnsMaster.fIMReturnNo = this.farmersInputsMaterialMasterId;
    returnsMaster.fMIRDate = this.farmersInputsMaterialMasterForm.controls.DateOfReturn.value;
    returnsMaster.areaID = this.selectedArea.areaId;
    returnsMaster.employeeID = this.selectedFieldStaffEmployee.employeeId;
    returnsMaster.cropGroupCode = this.selectedCropGroup.CropGroupCode;
    returnsMaster.cropNameCode = this.selectedCrop.CropCode;
    returnsMaster.psNumber = this.selectedSeasonFromTo.psNumber;
    returnsMaster.farmerCode = this.selectedFarmer.farmerCode;
    returnsMaster.fIMReturnVoucherNo = this.farmersInputsMaterialMasterForm.controls.ReturnVoucherNo.value;

    if (this.selectedOrgOffice.orgOfficeName === 'Area Branch') {
      returnsMaster.orgOfficeNo = null;
      // returnsMaster.stockReturnStatus = null;
      returnsMaster.stockReturnStatus = 'Area Branch';
    } else if (this.selectedOrgOffice.orgOfficeName === 'With Field Staff') {
      returnsMaster.orgOfficeNo = null;
      returnsMaster.stockReturnStatus = 'With Field Staff';
    } else {
      returnsMaster.orgOfficeNo = this.selectedOrgOffice.orgOfficeNo as number;
      returnsMaster.stockReturnStatus = null;
      // returnsMaster.stockReturnStatus = this.selectedOrgOffice.orgOfficeName;
    }

    return returnsMaster;
  }

  focusDateOfEntry() {
    setTimeout(() => {
      this.dateOfReturn.nativeElement.focus();
    }, 50);
  }

  focusFieldStaffArea() {
    setTimeout(() => {
      this.fieldStaffArea.focus();
    }, 50);
  }

}
