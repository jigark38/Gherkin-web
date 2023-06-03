import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect } from '@angular/material';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import {
  Area, HarvestVillage, ModifyHarvestVillage, CountryModel, StateModel,
  DistrictModel, VillageModel, MandalModel, SearchVillageModel
} from './centre-areasand-villages.model';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { delay } from 'rxjs/operators';
import { loadavg } from 'os';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { stat } from 'fs';
import { ModelForSaving } from '../../../secure/indent-material-details/indent-material-details.model';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { Observable } from 'rxjs';
import { OrgLocationService } from '../../../organisation-details/org-off-loc-details/org-ofc-loc.service';
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

@Component({
  selector: 'app-centre-areasand-villages',
  templateUrl: './centre-areasand-villages.component.html',
  styleUrls: ['./centre-areasand-villages.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CentreAreasandVillagesComponent implements OnInit {

  @ViewChild('areaVillageName', { static: false }) areaVillageName: MatSelect;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;

  @ViewChild('saveAreaFocus', { static: false }) saveAreaFocus: ElementRef;
  @ViewChild('dateOfEntryEl', { static: false }) dateOfEntryEl: ElementRef;
  @ViewChild('villageField', { static: false }) villageField: ElementRef;

  // orgCols: any[];
  // actions: any = { enabled: true, showEdit: true };
  areaDetailsForm = new FormGroup({
    dateOfEntry: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    areaName: new FormControl('', Validators.required),
    areaCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,2}$/)]),
  });
  villageDetailsForm = new FormGroup({
    areaName: new FormControl('', Validators.required),
    areaCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    mandal: new FormControl('', Validators.required),
    village: new FormControl('', Validators.required)
  });
  villageGridsObject: SearchVillageModel[];

  selectedRowId = 0;
  isRowSelected = false;
  enableNewArea: boolean;

  selectedAreaVillage: SearchVillageModel;
  areaDetails: Area;
  villageDetails: HarvestVillage[];
  modifyHarvestVillages: ModifyHarvestVillage[];

  getAllArea: Area[];

  getAllCountry: CountryModel[];
  countryOptionsList: string[];
  getCountryData: CountryModel;
  statesData: StateModel[];
  stateOptionsList: string[];
  districtData: DistrictModel[];
  districtOptionsList: string[];
  villageData: VillageModel[];
  villageOptionsList: string[];
  mandalData: MandalModel[];
  mandalOptionsList: string[];
  isAreaCodeError: boolean;
  isAreaNameError: boolean;
  isPopupOpened = false;
  // button enables
  enableNewVillage: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  isFindMode: boolean;
  isModifyMode: boolean;
  isVillageCodeError: boolean;
  isVillagesFound: boolean;
  min = 0;
  max = 10;
  actions: any = { enabled: true, showEdit: true, showCheckbox: true };
  orgCols = [
    // take field name from table
    { field: 'inwardDateTime', header: 'S.No' },
    { field: 'areaName', header: 'Area Name' },
    { field: 'stateName', header: 'State Name' },
    { field: 'districtName', header: 'District Name' },
    { field: 'mandalName', header: 'Mandal Name' },
    { field: 'villageName', header: 'Village Name' },
    { field: 'inwardRemarks', header: 'Remarks' },
  ];
  constructor(public authService: AuthenticationService,
    // tslint:disable-next-line: align
    private formBuilder: FormBuilder, public dialog: MatDialog
    // tslint:disable-next-line: align
    , private service: WebservicewrapperService, private alertService: AlertService, private orgLocationService: OrgLocationService) {
    this.villageGridsObject = [];
    this.villageDetails = [];
  }

  employeeId: string;
  employeeName: string;
  ngOnInit() {
    this.enableNewVillage = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.enableNewArea = true;
    const emp = this.authService.getUserdetails();
    this.employeeId = emp.employeeId;
    this.employeeName = emp.userName;
    this.areaDetailsForm.disable();
    this.areaDetailsForm.controls.userName.setValue(this.employeeName);
    this.villageDetailsForm.disable();
    this.getAllHarvestArea();


    this.service.GetAllCountry().subscribe(
      (data) => {
        this.getAllCountry = data;
        this.countryOptionsList = this.getAllCountry.map(a => a.countryName);
      },
      (error) => {
        this.getAllCountry = [];
        this.countryOptionsList = [];
      }
    );

    this.villageDetailsForm.get('areaName').valueChanges.subscribe(val => {
      if (this.villageDetailsForm.controls.areaName.value) {
        const code = this.getAllArea.filter(a => a.areaName === this.villageDetailsForm.controls.areaName.value).pop();
        this.villageDetailsForm.controls.areaCode.setValue(code.areaCode);
        if ((this.isFindMode || this.isModifyMode) && !this.selectedAreaVillage) {
          this.findVillagesByArea();
        }
      } else {
      }
    });
  }

  getAllHarvestArea() {
    try {
      this.service.GetHarvestAllArea().subscribe(
        (data) => {
          this.getAllArea = data;
        },
        (error) => console.log(error)
      );
    } catch (error) {

    }
  }

  isAreaCodeAllowed() {
    try {
      const areaCode = this.areaDetailsForm.controls.areaCode.value;
      if (areaCode) {

        this.service.isAreaCodeAllowed(areaCode).subscribe((data: boolean) => {
          this.isAreaCodeError = data;
        });
      }
    } catch (error) {

    }
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }
  isAreaNameAllowed() {
    try {
      const areaName = this.areaDetailsForm.controls.areaName.value;
      if (areaName) {

        this.service.isAreaNameAllowed(areaName).subscribe((data: boolean) => {
          this.isAreaNameError = data;
        });
      }
    } catch (error) {

    }
  }

  isVillageCodeAllowed() {
    try {
      return new Observable<any>((sub) => {
        const villageName = this.villageDetailsForm.controls.village.value;
        const villageCode = this.villageData.filter(a => a.villageName === villageName.trim().toUpperCase())[0];
        if (this.selectedAreaVillage && this.selectedAreaVillage.villageCode.toUpperCase() === villageCode.villageCode.toUpperCase()) {
          this.isVillageCodeError = false;
          sub.next(false);
          sub.complete();
          return;
        }
        if (villageCode) {
          this.service.isVillageCodeAllowed(villageCode.villageCode).subscribe((data: boolean) => {
            this.isVillageCodeError = data;
            sub.next(data);
            sub.complete();
          }, err => {
            sub.error(err);
          });
        } else {
          sub.next(false);
          sub.complete();
        }
      });


    } catch (error) {

    }
  }

  changeCountryValue(e) {
    try {
      if (e) {
        const countryObj = this.getAllCountry.filter(a => a.countryName === e.trim())[0];
        if (countryObj) {
          this.orgLocationService.getSates(countryObj.countryCode).subscribe(
            (data: StateModel[]) => {
              // this.getCountryData = data;
              this.statesData = [];
              this.stateOptionsList = [];
              this.villageDetailsForm.controls.state.setValue('');
              this.districtData = [];
              this.districtOptionsList = [];
              this.villageDetailsForm.controls.district.setValue('');
              this.mandalData = [];
              this.mandalOptionsList = [];
              this.villageDetailsForm.controls.mandal.setValue('');
              this.villageData = [];
              this.villageOptionsList = [];
              this.villageDetailsForm.controls.village.setValue('');

              this.statesData = data;
              this.stateOptionsList = this.statesData.map(a => a.stateName);
            },
            (error) => console.log(error)
          );
        } else {
          this.statesData = [];
          this.stateOptionsList = [];
          this.villageDetailsForm.controls.state.setValue('');
          this.districtData = [];
          this.districtOptionsList = [];
          this.villageDetailsForm.controls.district.setValue('');
          this.mandalData = [];
          this.mandalOptionsList = [];
          this.villageDetailsForm.controls.mandal.setValue('');
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        }
      } else {
        this.statesData = [];
        this.stateOptionsList = [];
        this.villageDetailsForm.controls.state.setValue('');
        this.districtData = [];
        this.districtOptionsList = [];
        this.villageDetailsForm.controls.district.setValue('');
        this.mandalData = [];
        this.mandalOptionsList = [];
        this.villageDetailsForm.controls.mandal.setValue('');
        this.villageData = [];
        this.villageOptionsList = [];
        this.villageDetailsForm.controls.village.setValue('');
      }
    } catch (error) {

    }
  }

  saveCountry(e) {
    try {
      if (e && !this.getAllCountry.filter(a => a.countryName.toUpperCase() === e.trim().toUpperCase())[0]) {
        this.service.AddCountry(e.trim().toUpperCase()).subscribe((data: CountryModel) => {
          if (data) {
            this.getAllCountry.push(data);
            this.countryOptionsList.push(data.countryName);
            this.countryOptionsList = this.countryOptionsList.slice();
            this.alertService.success('Country ' + data.countryName + ' created successfully.');
            this.districtData = [];
            this.districtOptionsList = [];
            this.villageDetailsForm.controls.district.setValue('');
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');

          }
        }, err => {
          this.alertService.error('Error while creating new country.');
          this.districtData = [];
          this.districtOptionsList = [];
          this.villageDetailsForm.controls.district.setValue('');
          this.mandalData = [];
          this.mandalOptionsList = [];
          this.villageDetailsForm.controls.mandal.setValue('');
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        });
      }
    } catch (error) {

    }
  }


  changeStateValue(e) {
    try {
      if (e) {
        const selectedState = this.statesData.filter(a => a.stateName === e.trim())[0];
        if (selectedState) {
          this.orgLocationService.getDistricts(selectedState.stateCode).subscribe((data: DistrictModel[]) => {
            this.districtData = [];
            this.districtOptionsList = [];
            this.villageDetailsForm.controls.district.setValue('');
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');

            this.districtData = data;
            this.districtOptionsList = this.districtData.map(a => a.districtName.toUpperCase());
          }, err => {
            this.districtData = [];
            this.districtOptionsList = [];
            this.villageDetailsForm.controls.district.setValue('');
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
          });
        } else {
          this.districtData = [];
          this.districtOptionsList = [];
          this.villageDetailsForm.controls.district.setValue('');
          this.mandalData = [];
          this.mandalOptionsList = [];
          this.villageDetailsForm.controls.mandal.setValue('');
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        }
      } else {
        this.districtData = [];
        this.districtOptionsList = [];
        this.villageDetailsForm.controls.district.setValue('');
        this.mandalData = [];
        this.mandalOptionsList = [];
        this.villageDetailsForm.controls.mandal.setValue('');
        this.villageData = [];
        this.villageOptionsList = [];
        this.villageDetailsForm.controls.village.setValue('');
      }
    } catch (error) {

    }
  }

  saveState(e) {
    try {
      if (e && this.villageDetailsForm.controls.country.value &&
        !this.statesData.filter(a => a.stateName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
        const countryCode: string = this.getAllCountry.filter(a => a.countryName.toUpperCase() ===
          this.villageDetailsForm.controls.country.value.toUpperCase())[0].countryCode;
        const state: StateModel = new StateModel();
        state.stateName = e.trim().toUpperCase();
        state.countryCode = countryCode;
        this.service.AddState(state).subscribe((data: StateModel) => {
          if (data) {
            this.statesData.push(data);
            this.stateOptionsList.push(data.stateName);
            this.stateOptionsList = this.stateOptionsList.slice();
            this.alertService.success('State ' + data.stateName + ' created successfully.');
            this.districtData = [];
            this.districtOptionsList = [];
            this.villageDetailsForm.controls.district.setValue('');
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
          }
        }, err => {
          this.alertService.error('Error has occured while creating the state.');
          this.districtData = [];
          this.districtOptionsList = [];
          this.villageDetailsForm.controls.district.setValue('');
          this.mandalData = [];
          this.mandalOptionsList = [];
          this.villageDetailsForm.controls.mandal.setValue('');
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        });
      }
    } catch (error) {

    }
  }

  changeDistrictValue(e) {
    try {
      if (e) {
        const selectedDistrict = this.districtData.filter(a => a.districtName === e.trim())[0];
        if (selectedDistrict) {
          this.orgLocationService.getMandalsByDistrictCode(selectedDistrict.districtCode).subscribe((data: MandalModel[]) => {
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
            this.mandalData = data;
            this.mandalOptionsList = this.mandalData.map(a => a.mandalName);
          }, err => {
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
          });

        } else {
          this.mandalData = [];
          this.mandalOptionsList = [];
          this.villageDetailsForm.controls.mandal.setValue('');
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        }
      } else {
        this.mandalData = [];
        this.mandalOptionsList = [];
        this.villageDetailsForm.controls.mandal.setValue('');
        this.villageData = [];
        this.villageOptionsList = [];
        this.villageDetailsForm.controls.village.setValue('');
      }
    } catch (error) {

    }
  }

  saveDistrict(e) {
    try {
      if (e && this.villageDetailsForm.controls.country.value && this.villageDetailsForm.controls.state.value &&
        !this.districtData.filter(a => a.districtName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
        const countryCode: string = this.getAllCountry.filter(a => a.countryName.toUpperCase() ===
          this.villageDetailsForm.controls.country.value.toUpperCase())[0].countryCode;
        const stateCode: string = this.statesData.filter(a => a.stateName.toUpperCase() ===
          this.villageDetailsForm.controls.state.value.toUpperCase())[0].stateCode;
        const district: DistrictModel = new DistrictModel();
        district.countryCode = countryCode;
        district.stateCode = stateCode;
        district.districtName = e.trim().toUpperCase();
        this.service.AddDistrict(district).subscribe((data: DistrictModel) => {
          if (data) {
            this.districtData.push(data);
            this.districtOptionsList.push(data.districtName);
            this.districtOptionsList = this.districtOptionsList.slice();
            this.alertService.success('District ' + data.districtName + ' created successfully.');
            this.mandalData = [];
            this.mandalOptionsList = [];
            this.villageDetailsForm.controls.mandal.setValue('');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
          }
        }, err => {
          this.alertService.error('Error has occured while creating district.');
          this.mandalData = [];
          this.mandalOptionsList = [];
          this.villageDetailsForm.controls.mandal.setValue('');
          this.villageData = [];
          this.villageOptionsList = [];
        });
      }
    } catch (error) {

    }
  }

  changeMandalValue(e) {
    try {
      if (e) {
        const selectedMandal = this.mandalData.filter(a => a.mandalName === e.trim())[0];
        if (selectedMandal) {
          this.orgLocationService.getVillagesByMandalCode(selectedMandal.mandalCode).subscribe((data: VillageModel[]) => {
            if (!this.isFindMode && !this.isModifyMode) {

              this.getAvailableVillages();
            }
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
            this.villageData = data;
            this.villageOptionsList = this.villageData.map(a => a.villageName);
          }, err => {
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
          });

        } else {
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        }
      } else {
        this.villageData = [];
        this.villageOptionsList = [];
        this.villageDetailsForm.controls.village.setValue('');
      }
    } catch (error) {

    }
  }

  saveMandal(e) {
    try {
      if (e && this.villageDetailsForm.controls.country.value && this.villageDetailsForm.controls.state.value &&
        this.villageDetailsForm.controls.district.value &&
        !this.mandalData.filter(a => a.mandalName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
        const countryCode: string = this.getAllCountry.filter(a => a.countryName.toUpperCase() ===
          this.villageDetailsForm.controls.country.value.toUpperCase())[0].countryCode;
        const stateCode: string = this.statesData.filter(a => a.stateName.toUpperCase() ===
          this.villageDetailsForm.controls.state.value.toUpperCase())[0].stateCode;
        const districtCode: string = this.districtData.filter(a => a.districtName.toUpperCase() ===
          this.villageDetailsForm.controls.district.value.toUpperCase())[0].districtCode;

        const mandal: MandalModel = new MandalModel();
        mandal.countryCode = countryCode;
        mandal.stateCode = stateCode;
        mandal.districtCode = districtCode;
        mandal.mandalName = e.trim().toUpperCase();
        this.service.AddMandal(mandal).subscribe((data: MandalModel) => {
          if (data) {
            this.mandalData.push(data);
            this.mandalOptionsList.push(data.mandalName);
            this.mandalOptionsList = this.mandalOptionsList.slice();
            this.alertService.success('Mandal ' + data.mandalName + ' created successfully.');
            this.villageData = [];
            this.villageOptionsList = [];
            this.villageDetailsForm.controls.village.setValue('');
          }
        }, err => {
          this.alertService.error('Error has occured while creating mandal.');
          this.villageData = [];
          this.villageOptionsList = [];
          this.villageDetailsForm.controls.village.setValue('');
        });
      }
    } catch (error) {

    }
  }

  blurVillageValue() {
    try {
      if (this.villageDetailsForm.valid && this.villageDetailsForm.controls.village.value) {
        const village = this.villageData.filter(a => a.villageName.toUpperCase()
          === this.villageDetailsForm.controls.village.value.trim().toUpperCase())[0];
        const gridVillage = this.villageGridsObject.filter(a => a.villageName.toUpperCase()
          === this.villageDetailsForm.controls.village.value.trim().toUpperCase())[0];
        if (village || gridVillage) {
          if ((this.isModifyMode || this.isFindMode) && this.villageGridsObject.find(a => a.villageName === gridVillage.villageName
            && a.villageName === this.selectedAreaVillage.villageName)) {
            this.isVillageCodeError = false;
            this.saveFocus.nativeElement.focus();
          } else {

            this.isVillageCodeError = true;
          }
        } else {
          this.isVillageCodeError = false;
          // if (!this.isVillageCodeError) {
          if (!this.isModifyMode && !this.isFindMode) {
            this.pushVillage();
          } else if (this.isModifyMode && !this.isFindMode) {
            this.saveFocus.nativeElement.focus();
          }
          // }
        }


      }
    } catch (error) {

    }
  }

  saveVillage(e) {
    try {
      if (e && this.villageDetailsForm.controls.country.value && this.villageDetailsForm.controls.state.value &&
        this.villageDetailsForm.controls.district.value && this.villageDetailsForm.controls.mandal.value &&
        !this.mandalData.filter(a => a.mandalName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
        const countryCode: string = this.getAllCountry.filter(a => a.countryName.toUpperCase() ===
          this.villageDetailsForm.controls.country.value.toUpperCase())[0].countryCode;
        const stateCode: string = this.statesData.filter(a => a.stateName.toUpperCase() ===
          this.villageDetailsForm.controls.state.value.toUpperCase())[0].stateCode;
        const districtCode: string = this.districtData.filter(a => a.districtName.toUpperCase() ===
          this.villageDetailsForm.controls.district.value.toUpperCase())[0].districtCode;
        const mandalCode: string = this.mandalData.filter(a => a.mandalName.toUpperCase() ===
          this.villageDetailsForm.controls.mandal.value.toUpperCase())[0].mandalCode;

        const village: VillageModel = new VillageModel();
        village.countryCode = countryCode;
        village.stateCode = stateCode;
        village.districtCode = districtCode;
        village.mandalCode = mandalCode;
        village.villageName = e.trim().toUpperCase();
        this.service.AddVillage(village).subscribe((data: VillageModel) => {
          if (data) {
            this.villageData.push(data);
            this.villageOptionsList.push(data.villageName);
            this.villageOptionsList = this.villageOptionsList.slice();

            this.alertService.success('Village ' + data.villageName + ' created successfully.');
          }
        }, err => {
          this.alertService.error('Error has occured while creating a village.');
        });
      }
    } catch (error) {

    }
  }


  pushVillage() {
    try {

      const arrLength = this.villageGridsObject.length;
      const villageObj = this.villageData.filter(a => a.villageName
        === this.villageDetailsForm.controls.village.value.trim().toUpperCase())[0];
      const villageCodeSelected = villageObj ? villageObj.villageCode : null;
      if (villageCodeSelected) {
        this.saveFocus.nativeElement.focus();
        return;
      }
      const gridObject: SearchVillageModel = new SearchVillageModel();
      gridObject.id = arrLength + 1;
      gridObject.areaName = this.villageDetailsForm.controls.areaName.value;
      gridObject.countryName = this.villageDetailsForm.controls.country.value;
      gridObject.stateName = this.villageDetailsForm.controls.state.value;
      gridObject.districtName = this.villageDetailsForm.controls.district.value;
      gridObject.mandalName = this.villageDetailsForm.controls.mandal.value;
      gridObject.villageName = this.villageDetailsForm.controls.village.value;
      gridObject.villageCode = '0';
      gridObject.isSelected = true;
      this.villageGridsObject.unshift(gridObject);

      this.prepareVillageData(gridObject);
      if (!this.isPopupOpened) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more items?'
        });

        this.isPopupOpened = true;
        dialogRef.afterClosed().subscribe(result => {
          this.isPopupOpened = false;
          if (result) {
            this.villageDetailsForm.controls.village.reset();
            this.villageField.nativeElement.focus();
          } else {
            this.saveFocus.nativeElement.focus();
          }
        });
      }
    } catch (error) {

    }
  }

  pushVillageEdit() {

    const villageObj = this.villageData.filter(a => a.villageName
      === this.villageDetailsForm.controls.village.value.trim().toUpperCase())[0];
    const villageCodeSelected = this.selectedAreaVillage.villageCode;

    const gridObject: SearchVillageModel = this.villageGridsObject.find(a => a.id === this.selectedAreaVillage.id);
    gridObject.id = this.selectedAreaVillage.id;
    gridObject.areaName = this.villageDetailsForm.controls.areaName.value;
    gridObject.countryName = this.villageDetailsForm.controls.country.value;
    gridObject.stateName = this.villageDetailsForm.controls.state.value;
    gridObject.districtName = this.villageDetailsForm.controls.district.value;
    gridObject.mandalName = this.villageDetailsForm.controls.mandal.value;
    gridObject.villageName = this.villageDetailsForm.controls.village.value;
    gridObject.villageCode = villageCodeSelected;
    this.prepareVillageData(gridObject);
  }

  areaNameBlur() {
    try {
      this.isAreaNameAllowed();
    } catch (error) {

    }
  }
  areaCodeBlur() {
    try {
      this.isAreaCodeAllowed();
      this.saveAreaFocus.nativeElement.focus();
    } catch (error) {

    }
  }

  rowSelected(model: SearchVillageModel) {
    try {
      if (this.isVillagesFound) {
        return;
      }
      this.selectedRowId = model.id;

      if (!this.isFindMode && !this.isModifyMode) {
        return;
      }

      if (this.isFindMode) {
        this.villageDetailsForm.disable();
      }

      if (this.isModifyMode) {
        this.villageDetailsForm.enable();
        this.villageDetailsForm.controls.areaName.disable();

        this.villageDetailsForm.controls.areaCode.disable();
        this.enableSave = true;

      }


      this.isRowSelected = true;
      this.selectedAreaVillage = model;

      this.populateModifyFields();
    } catch (error) {

    }
  }
  async populateModifyFields() {
    this.villageDetailsForm.controls.areaName.setValue(this.selectedAreaVillage.areaName);
    this.villageDetailsForm.controls.country.setValue(this.selectedAreaVillage.countryName);
    await this.loadStateData();

  }
  async loadStateData() {
    try {
      const countryObj = this.getAllCountry.filter(a => a.countryName === this.selectedAreaVillage.countryName).pop();
      const countryCode = countryObj.countryCode;

      this.service.GetCountryData(countryCode).subscribe(
        (data) => {
          this.getCountryData = data;
          // select state
          this.statesData = this.getCountryData.states;
          this.stateOptionsList = this.statesData.map(a => a.stateName);
          this.stateOptionsList = this.stateOptionsList.slice();
          this.villageDetailsForm.controls.state.setValue(this.selectedAreaVillage.stateName);
          // select district
          const districts = this.statesData.filter(a => a.stateName === this.selectedAreaVillage.stateName)[0];
          this.districtData = districts.districts;
          this.districtOptionsList = this.districtData.map(a => a.districtName);
          this.districtOptionsList = this.districtOptionsList.slice();
          this.villageDetailsForm.controls.district.setValue(this.selectedAreaVillage.districtName);
          // select mandal
          const mandals = this.districtData.filter(a => a.districtName === this.selectedAreaVillage.districtName)[0];
          this.mandalData = mandals.mandals;
          this.mandalOptionsList = this.mandalData.map(a => a.mandalName);
          this.mandalOptionsList = this.mandalOptionsList.slice();
          this.villageDetailsForm.controls.mandal.setValue(this.selectedAreaVillage.mandalName);
          // select Village
          const selectedMandal = this.mandalData.filter(a => a.mandalName === this.selectedAreaVillage.mandalName)[0];
          this.villageData = selectedMandal.villages;
          // this.villageOptionsList = this.villageData.map(a => a.villageName);
          // this.villageOptionsList = this.villageOptionsList.slice();
          this.villageDetailsForm.controls.village.setValue(this.selectedAreaVillage.villageName);
        },
        (error) => {

        }
      );
    } catch (ex) {

    }
  }

  get f() { return this.areaDetailsForm.controls; }
  get g() { return this.villageDetailsForm.controls; }
  clearArea() {
    this.areaDetailsForm.reset();
    this.isAreaCodeError = false;
    this.isAreaNameError = false;
    this.enableNewArea = true;
    this.areaDetailsForm.controls.userName.setValue(this.employeeName);
    this.areaDetailsForm.controls.userName.disable();

  }
  clearVillage() {
    this.villageDetailsForm.reset();
    this.villageDetailsForm.disable();
    this.enableNewVillage = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.villageGridsObject = [];
    this.isRowSelected = false;
    this.villageDetails = [];
    this.statesData = [];
    this.stateOptionsList = [];
    this.districtData = [];
    this.districtOptionsList = [];
    this.mandalData = [];
    this.mandalOptionsList = [];
    this.villageData = [];
    this.villageOptionsList = [];
    this.isFindMode = false;
    this.isModifyMode = false;
    this.selectedAreaVillage = null;
    this.isVillageCodeError = false;
    this.selectedRowId = 0;
    this.isVillagesFound = false;
    this.min = 0;
    this.max = 10;
  }


  markFieldAsTouched(form: FormGroup) {
    try {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } catch (error) {

    }
  }


  newArea() {
    try {
      this.areaDetailsForm.enable();
      this.areaDetailsForm.controls.userName.setValue(this.employeeName);
      this.areaDetailsForm.controls.userName.disable();
      this.enableNewArea = false;
      this.dateOfEntryEl.nativeElement.focus();
      this.areaDetailsForm.controls.dateOfEntry.setValue(new Date());
    } catch (error) {

    }
  }

  addVillage() {
    try {
      this.areaVillageName.focus();
      this.villageDetailsForm.enable();
      this.villageDetailsForm.controls.areaCode.disable();
      this.enableNewVillage = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
    } catch (error) {

    }
  }


  submitArea() {
    try {

      if (this.areaDetailsForm.invalid || this.isAreaCodeError || this.isAreaNameError) {
        this.markFieldAsTouched(this.areaDetailsForm);
        return;
      }

      this.areaDetails = new Area();

      this.areaDetails.areaEntryDate = this.areaDetailsForm.controls.dateOfEntry.value;
      this.areaDetails.areaEnteredEmpId = this.employeeId;
      this.areaDetails.areaName = this.areaDetailsForm.controls.areaName.value;
      this.areaDetails.areaCode = this.areaDetailsForm.controls.areaCode.value;

      this.service.PostAreaData(this.areaDetails).subscribe(
        (data) => {
          this.clearArea();
          this.getAllHarvestArea();
          this.alertService.success('Centre Area created successfully.');
        },
        (error) => {
          this.alertService.error('There is some error while prococessing your request.Please try again.');
        }
      );
    } catch (error) {
      console.log('Method: submitArea', error);
    }
  }

  changeParentCheckBox(e) {

    if (e.checked) {
      this.villageGridsObject.map(a => a.isSelected = true);
    } else {
      this.villageGridsObject.map(a => a.isSelected = false);

    }
  }
  getAvailableVillages() {
    try {

      const areaObj = this.getAllArea.filter(a => a.areaName.trim().toUpperCase() ===
        this.villageDetailsForm.controls.areaName.value.trim().toUpperCase())[0];
      const areaCode = areaObj.areaId;

      const countryObj = this.getAllCountry.filter(a => a.countryName.toUpperCase() ===
        this.villageDetailsForm.controls.country.value.trim().toUpperCase())[0];
      const countryCode = countryObj.countryCode;

      const stateObj = this.statesData.filter(a => a.stateName.toUpperCase() ===
        this.villageDetailsForm.controls.state.value.trim().toUpperCase())[0];
      const stateCode = stateObj.stateCode;

      const districtObj = this.districtData.filter(a => a.districtName.toUpperCase() ===
        this.villageDetailsForm.controls.district.value.trim().toUpperCase())[0];
      const districtCode = districtObj.districtCode;

      const mandalObj = this.mandalData.filter(a => a.mandalName.toUpperCase() ===
        this.villageDetailsForm.controls.mandal.value.trim().toUpperCase())[0];
      const mandalCode = mandalObj.mandalCode;

      // const villageObj = this.villageData.filter(a => a.villageName.toUpperCase() === item.villageName.trim().toUpperCase())[0];
      // const villageCode = villageObj ? villageObj.villageCode : null;

      this.service.getAvailableVillages(areaCode,
        this.villageDetailsForm.controls.areaName.value,
        countryCode,
        stateCode,
        districtCode,
        mandalCode
      ).subscribe((data: SearchVillageModel[]) => {
        data.forEach((e, i) => {
          e.id = i;
        });
        this.villageGridsObject = data;
        if (data.length > 0) {
          this.selectedRowId = -1;
          this.isVillagesFound = true;
          this.villageDetailsForm.controls.village.setValidators([]);
          this.villageDetailsForm.controls.village.updateValueAndValidity({ onlySelf: true, emitEvent: true });

        } else {
          this.selectedRowId = 0;
          this.isVillagesFound = false;
          this.villageDetailsForm.controls.village.setValidators([Validators.required]);
          this.villageDetailsForm.controls.village.updateValueAndValidity({ onlySelf: true, emitEvent: true });

        }
      }, err => {
        this.villageGridsObject = [];
        this.isVillagesFound = false;
        this.selectedRowId = 0;
        this.villageDetailsForm.controls.village.setValidators([Validators.required]);
        this.villageDetailsForm.controls.village.updateValueAndValidity({ onlySelf: true, emitEvent: true });


      });
    } catch (error) {

    }
  }

  submitVillage() {
    try {
      this.villageDetailsForm.updateValueAndValidity();
      if (this.villageDetailsForm.invalid) {
        this.markFieldAsTouched(this.villageDetailsForm);
        return;
      }
      if (this.isVillagesFound) {
        if (this.villageGridsObject.filter(a => a.isSelected)[0]) {
          this.villageGridsObject.forEach(a => {
            if (a.isSelected && a.villageCode && a.villageCode !== '0') {
              this.prepareVillageData(a);
            }
          });

        } else {
          return;
        }

      }

      if (this.selectedAreaVillage && this.isModifyMode && this.isRowSelected) {
        // update village
        this.pushVillageEdit();

        this.saveUpdatedVillageData();
      } else {

        // create village
        this.villageDetails.map(a => {
          a.id = 0;
          if (!a.villageCode) {
            a.villageCode = '0';
          }
        });
        this.service.PostVillageData(this.villageDetails).subscribe(
          (data) => {
            this.clearVillage();
            this.alertService.success('Area Village details added successfully.');
          },
          (error) => {

            this.alertService.error('There is some error while prococessing your request.Please try again.');
          }
        );
      }

    } catch (error) {
    }
  }
  prepareVillageData(item: SearchVillageModel) {
    try {

      const areaObj = this.getAllArea.filter(a => a.areaName.toUpperCase() === item.areaName.trim().toUpperCase())[0];
      const areaCode = areaObj.areaId;
      const countryObj = this.getAllCountry.filter(a => a.countryName.toUpperCase() === item.countryName.trim().toUpperCase())[0];
      const countryCode = countryObj.countryCode;

      const stateObj = this.statesData.filter(a => a.stateName.toUpperCase() === item.stateName.trim().toUpperCase())[0];
      const stateCode = stateObj.stateCode;

      const districtObj = this.districtData.filter(a => a.districtName.toUpperCase() === item.districtName.trim().toUpperCase())[0];
      const districtCode = districtObj.districtCode;

      const mandalObj = this.mandalData.filter(a => a.mandalName.toUpperCase() === item.mandalName.trim().toUpperCase())[0];
      const mandalCode = mandalObj.mandalCode;

      const villageObj = this.villageData.filter(a => a.villageName.toUpperCase() === item.villageName.trim().toUpperCase())[0];
      const villageCode = villageObj ? villageObj.villageCode : null;
      this.villageDetails.unshift({
        areaId: areaCode,
        // tslint:disable-next-line: object-literal-shorthand
        countryCode: countryCode,
        // tslint:disable-next-line: object-literal-shorthand
        stateCode: stateCode,
        // tslint:disable-next-line: object-literal-shorthand
        districtCode: districtCode,
        // tslint:disable-next-line: object-literal-shorthand
        villageCode: villageCode,
        // tslint:disable-next-line: object-literal-shorthand
        mandalCode: mandalCode,
        villageName: item.villageName.trim().toUpperCase(),
        id: item.id
      });
      // }

    } catch (e) {

    }
  }


  find() {
    try {
      this.villageDetailsForm.controls.areaName.enable();
      this.isFindMode = true;
      this.enableNewVillage = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.areaVillageName.focus();
    } catch (error) {

    }
  }

  findVillagesByArea() {
    if (!this.villageDetailsForm.controls.areaName.value) {
      return;
    }
    const code = this.getAllArea.filter(a => a.areaCode === this.villageDetailsForm.controls.areaCode.value).pop();
    const areaId = code.areaId;
    this.service.GetHarvestVillagesByAreaId(areaId).subscribe(
      (data) => {
        this.villageGridsObject = [];
        this.villageGridsObject = data;
      },
      (error) => {
        this.villageGridsObject = [];
      }
    );
  }
  UpdateVillageData() {
    try {
      const countryObj = this.getAllCountry.filter(a => a.countryName === this.villageDetailsForm.controls.country.value).pop();
      const stateObj = this.statesData.filter(a => a.stateName === this.villageDetailsForm.controls.state.value).pop();
      const districtObj = this.districtData.filter(a => a.districtName === this.villageDetailsForm.controls.district.value).pop();
      const villageObj = this.villageData.filter(a => a.villageName === this.villageDetailsForm.controls.village.value).pop();
      if (this.isFindMode) { // TODO
        this.villageGridsObject.find(a => a.id === this.selectedRowId).countryName = countryObj.countryName;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).stateName = stateObj.stateName;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).districtName = districtObj.districtName;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).villageName = villageObj.villageName;

        this.villageGridsObject.find(a => a.id === this.selectedRowId).countryCode = countryObj.countryCode;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).stateCode = stateObj.stateCode;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).districtCode = districtObj.districtCode;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).villageCode = villageObj.villageCode;

        this.villageDetailsForm.reset();

      } else {

        this.villageGridsObject.find(a => a.id === this.selectedRowId).countryName = countryObj.countryName;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).stateName = stateObj.stateName;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).districtName = districtObj.districtName;
        this.villageGridsObject.find(a => a.id === this.selectedRowId).villageName = villageObj.villageName;

        this.villageDetailsForm.reset();

      }
    } catch (error) {

    }
  }
  modify() {
    try {
      this.villageDetailsForm.controls.areaName.enable();
      this.isModifyMode = true;
      this.enableNewVillage = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.areaVillageName.focus();
    } catch (error) {

    }
  }
  saveUpdatedVillageData() {
    try {
      const saveObj = this.villageDetails.find(a => a.id === this.selectedAreaVillage.id);
      saveObj.villageCode = this.selectedAreaVillage.villageCode;
      this.service.UpdateVillageData(saveObj).subscribe(
        (data) => {
          this.villageDetails = [];
          this.clearVillage();
          this.alertService.success('Area Village details updated successfully.');
        },
        (error) => {
          this.alertService.error('There is some error while prococessing your request.Please try again.');

        }
      );
    } catch (error) {

    }
  }

}
