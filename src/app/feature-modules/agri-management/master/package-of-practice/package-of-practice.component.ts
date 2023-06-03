import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PackageOfPracticeService } from './package-of-practice.service';

import { Observable } from 'rxjs';
import {
  CropGroup, CropName, SeasonFromTo, PhaseEffectiveDate, CropPhaseName, HarvestStageDetails,
  PracticeDetails, PracticeMaterial, MaterialGroup, MaterialName
} from './package-of-practice.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MatSelect, MatDialog, MatDialogRef, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { POPComponent } from './pop/pop.component';
import 'rxjs/add/operator/debounceTime';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';

@Component({
  selector: 'app-package-of-practice',
  templateUrl: './package-of-practice.component.html',
  styleUrls: ['./package-of-practice.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: GHERKIN_DATE_FORMATS },
  ],
})
export class PackageOfPracticeComponent implements OnInit {

  popForm: FormGroup;
  orgCols: any[];
  allCropGroups: CropGroup[];
  allCropNames: CropName[];
  allSeasonFromTo: SeasonFromTo[];
  allPhaseEffectiveDate: PhaseEffectiveDate[];
  allCropPhaseName: CropPhaseName[];

  cropGroupList: CropGroup[];
  cropGroupOptionsList: string[];

  cropNameList: CropName[];
  cropNameOptionsList: string[];
  materialGroupList: MaterialGroup[];
  materialNameList: MaterialName[];

  pMaterialList: PracticeMaterial[] = [];
  isDetailAddingCompleted: boolean;
  practiceDetail: PracticeDetails;

  UOMList: PracticeMaterial[];
  userData: any;
  min = 0;
  max = 10;

  constructor(
    private popService: PackageOfPracticeService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<POPComponent>) {
    this.userData = this.authService.getUserdetails();
  }

  @ViewChild('tNameInput', null) nameInputField: ElementRef;
  @ViewChild('daysAfterSowingInput', null) dASInputField: ElementRef;
  @ViewChild('cropPhaseMatSelect', null) cropPhaseMatSelect: MatSelect;
  @ViewChild('saveBtn', null) saveBtnRef: ElementRef;
  @ViewChild('newBtn', null) newBtnRef: ElementRef;
  // @ViewChild('entryDateInput', null) entryDateInputRef: ElementRef;
  @ViewChild('entryDateInput', { static: false }) entryDateInputRef: ElementRef;
  @ViewChild('materialGroupMatSelect', null) materialGroupMatSelectRef: MatSelect;
  @ViewChild('cropGroupMatSelect', null) cropGroupMatSelect: MatSelect;
  @ViewChild('packageofPracticeFor', { static: false }) packageofPracticeFor: MatSelect;
  disableSaveButton = true;
  disableFindButton = true;
  disableModButton = true;
  disableClearButton = true;
  disableNewButton = false;
  isNewPOP = true; // is newPOP or findPOP

  ngOnInit() {
    try {
      this.isDetailAddingCompleted = false;
      this.initData();
      this.onInit();
      this.popForm.controls.enteredBy.setValue(this.userData.userName);
      this.popForm.controls.enteredBy.disable();

      this.onChanges();
      this.popForm.controls.UOM.valueChanges.pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this.popService.getUOMList()
          .pipe(
            finalize(() => { }),
          )
        )
      ).subscribe((m: PracticeMaterial[]) => {
        this.UOMList = m;
        const typedUOM = this.popForm.controls.UOM.value;
        if (typedUOM) {
          this.UOMList = this.UOMList.filter(p => p.chemicalUom.toLowerCase().indexOf(typedUOM.toLowerCase()) !== -1);
        }
      });
    } catch (error) {
      console.log('Error on ngOnInit: ', error);
    }
  }

  onInit() {
    this.initalizeForm();
    this.getAllCropGroups();
    this.getAllMaterialGroups();
    this.onClearClick();
    this.disableSaveButton = true;
    this.newBtnRef.nativeElement.focus();
    this.practiceDetail = null;
  }

  getUomList() {
    try {
      // this.popService.getUOMList().subscribe((res: PracticeMaterial[]) => {
      //   if (res) {

      //     this.UOMList = res.map(cou => cou.chemicalUom);
      //   }
      // });
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  groupFocus() {
    // this.cropGroupMatSelectRef.c;

  }
  onChanges(): void {
    try {
      this.popForm.get('chemicalVolPLt').valueChanges.subscribe(val => {
        const chemVol = this.popForm.controls.chemicalVolPLt.value;
        const sprayVolume = this.popForm.controls.sprayVolumePerUOM.value;
        const qty = chemVol * sprayVolume;
        this.popForm.controls.quantity.setValue(qty);
      });
      this.popForm.get('sprayVolumePerUOM').valueChanges.subscribe(val => {
        const chemVol = this.popForm.controls.chemicalVolPLt.value;
        const sprayVolume = this.popForm.controls.sprayVolumePerUOM.value;
        const qty = chemVol * sprayVolume;
        this.popForm.controls.quantity.setValue(qty);
      });
    } catch (error) {
      console.log('Error on onChanges: ', error);
    }
  }
  initData() {

    this.orgCols = [
      // take field name from table
      { field: ' ', header: 'Sl.No' },
      { field: ' ', header: 'Crop Phase Name' },
      { field: ' ', header: 'Days after Sowing' },
      { field: ' ', header: 'Trade Name' },
      { field: ' ', header: 'Chemical Name' },
      { field: ' ', header: 'Chemical Value/Lt' },
      { field: ' ', header: 'Spray Volume / UOM Acre' },
      { field: ' ', header: 'Qty of Chemical' },
      { field: ' ', header: 'Target Pest' }
    ];

  }

  initalizeForm(): void {
    try {
      this.popForm = new FormGroup({

        entryDate: new FormControl(null, [Validators.required]),
        enteredBy: new FormControl(this.userData.userName),
        cropGroupCode: new FormControl('', [Validators.required]),
        cropNameCode: new FormControl('1', [Validators.required]),
        popFor: new FormControl(null, [Validators.required]),
        pPerAcrege: new FormControl(null, [Validators.required]),
        sessionFromTo: new FormControl(null, [Validators.required]),
        phaseEffectiveDate: new FormControl(null, [Validators.required]),
        cropPhaseName: new FormControl(null, [Validators.required]),
        cropPhase: new FormControl(null),
        phaseSowingDay: new FormControl(null),
        harvestDetails: new FormControl(''),
        practiceEffectiveDate: new FormControl('200', [Validators.required]),

        daysApplicable: new FormControl(null, [Validators.required, Validators.min(0.00), Validators.max(999999.99)]),
        materialGroupCode: new FormControl(null, [Validators.required]),
        materialNameCode: new FormControl(null, [Validators.required]),
        tradeName: new FormControl(null, [Validators.required]),
        chemicalName: new FormControl(null),
        chemicalVolPLt: new FormControl(0, [Validators.required, Validators.min(0.00), Validators.max(999999.99)]),
        UOM: new FormControl('KG', [Validators.required, Validators.min(0.00), Validators.max(999999.99)]),
        sprayVolumePerUOM: new FormControl(0, [Validators.required, Validators.min(0.00), Validators.max(999999.99)]),
        quantity: new FormControl(0, [Validators.required, Validators.min(0.00), Validators.max(999999.99)]),
        targetPets: new FormControl('', [Validators.required]),
        sowingFrom: new FormControl(0),
        sowingTo: new FormControl(0)
      }, { validators: this.passwordConfirming });
    } catch (error) {
      console.log('Error on initalizeForm: ', error);
    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    const entVal = c.get('daysApplicable').value;
    const from = c.get('sowingFrom').value;
    const to = c.get('sowingTo').value;
    if (entVal != null) {
      if (entVal >= from && entVal <= to) {

      } else {
        return { invalid: true };
      }
    }
  }

  // START country Section
  getAllCropGroups() {
    try {
      this.popService.getAllCropGroups().subscribe((res: CropGroup[]) => {
        if (res) {
          this.cropGroupList = res;
          this.cropGroupOptionsList = res.map(cou => cou.Name);
        }
      });
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  cropGroupValueChange(event) {
    try {
      if (event) {
        const selectedGroup = this.cropGroupList.filter(p => p.CropGroupCode === event.value)[0];
        if (selectedGroup) {
          this.cropNameList = [];
          this.cropNameOptionsList = [];
          this.popForm.controls.sessionFromTo.reset();
          this.popForm.controls.phaseEffectiveDate.reset();
          this.popForm.controls.cropNameCode.reset();
          this.pMaterialList = [];
          this.getCropName(selectedGroup.CropGroupCode).subscribe(() => { });
        }
      } else {
        this.cropNameList = [];
        this.cropNameOptionsList = [];
        this.popForm.controls.sessionFromTo.reset();
        this.popForm.controls.phaseEffectiveDate.reset();
        this.popForm.controls.cropNameCode.reset();
        this.pMaterialList = [];
      }
    } catch (error) {
      console.error('Error on navbar ngOninit', error);
    }
  }

  // END productGroup Section

  getCropName(groupCode: string) {
    try {
      return new Observable((sub) => {
        this.popService.getAllCropByGroupCode(groupCode).subscribe((res: CropName[]) => {

          this.cropNameList = res;
          this.cropNameOptionsList = res.map(cn => cn.cropName);
          sub.next();
        }, err => {
          this.cropNameList = [];
          this.cropNameOptionsList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getCropName: ', error);
    }
  }

  // cropNameChange(event) {
  //   try {
  //     if (event) {
  //       const selectedCrop = this.allCropNames.filter(p => p.cropnameCode === event.value)[0];
  //       if (selectedCrop) {
  //         this.popForm.controls.cropNameCode.setValue(selectedCrop.cropnameCode);
  //         this.getPSNoList(selectedCrop.cropnameCode).subscribe(() => { });
  //         this.getPhaseEffectiveDateList(selectedCrop.cropnameCode).subscribe(() => { });
  //       }
  //     } else {
  //       this.allCropNames = [];
  //     }
  //   } catch (error) {
  //     console.log('Error on cropNameChange: ', error);
  //   }
  // }

  // START state Section

  cropNameValueChange(event) {
    try {
      if (event) {
        const selectedCropName = this.cropNameList.filter(p => p.cropnameCode === event.value)[0];
        if (selectedCropName) {
          this.popForm.controls.sessionFromTo.reset();
          this.popForm.controls.phaseEffectiveDate.reset();
          this.getPSNoList(selectedCropName.cropnameCode).subscribe(() => { });
          // this.getPhaseEffectiveDateList(selectedCropName.cropnameCode).subscribe(() => { });
        }
      } else {
        // this.stateList = [];
        // this.stateOptionsList = [];
        // this.cityList = [];
        // this.cityOptionsList = [];
        // this.popForm.controls.state.reset();
        // this.popForm.controls.city.reset();
      }
    } catch (error) {
      console.log('Error on cropNameValueChange: ', error);
    }
  }

  packageOfPracticeValueChanged(event) {
    try {
      const selectedPackageOfPractice = this.packageofPracticeFor.value;
      const selectedCropNameCode = this.popForm.controls.cropNameCode.value;
      if (selectedPackageOfPractice) {
        this.getCropPhaseNameList(selectedPackageOfPractice).subscribe(() => { });
        if (selectedCropNameCode) {
          this.getPhaseEffectiveDateList(selectedCropNameCode, selectedPackageOfPractice).subscribe(() => { });
        }
      }

      if (!this.isNewPOP) {
        const selectedPhase = this.popForm.controls.phaseEffectiveDate.value;
        if (selectedPhase) {
          this.getCropStageList(selectedPhase.transCode).subscribe(() => { });
        }

        if (selectedCropNameCode && selectedPackageOfPractice) {
          this.getPSNoListForFind(selectedCropNameCode, selectedPackageOfPractice).subscribe(() => { });
        }
      }
    } catch (error) {
      console.log('Error on cropNameValueChange: ', error);
    }
  }

  // END productGroup Section

  getPSNoList(cropNameCode: string) {
    try {
      return new Observable((sub) => {
        this.popService.getAllPSNoByCropNameCode(cropNameCode).subscribe((res: SeasonFromTo[]) => {
          this.allSeasonFromTo = res;
          sub.next();
        }, err => {
          this.allSeasonFromTo = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getPSNoList: ', error);
    }
  }

  getPSNoListForFind(cropNameCode: string, packageOfPractice: string) {
    try {
      return new Observable((sub) => {
        this.popService.getPSNoByCropAndHBOMDivisionForFind(cropNameCode, packageOfPractice).subscribe((res: SeasonFromTo[]) => {
          this.allSeasonFromTo = res;
          if (this.allSeasonFromTo.length === 0) {
            this.alertService.error('No Package of Practice available for this Crop.');
          }
          sub.next();
        }, err => {
          this.allSeasonFromTo = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getPSNoListForFind: ', error);
    }
  }

  fromToDateChange(event) {
    try {
      if (event) {
        // const selectedPhase = this.allSeasonFromTo.filter(p => p.date === event.value)[0];
        const selectedPhase = this.allSeasonFromTo.filter(p => p.psNo === event.value)[0];
        if (selectedPhase) {
          // this.popForm.controls.sessionFromTo.setValue(selectedPhase.psNo);
          this.popForm.controls.phaseEffectiveDate.setValue(selectedPhase.psNo);
        }
      } else {
        // this.allCropNames = [];
      }
    } catch (error) {
      console.log('Error on fromToDateChange: ', error);
    }
  }

  getPhaseEffectiveDateList(cropNameCode: string, packageOfPractice: string) {
    try {
      return new Observable((sub) => {
        this.popService.getAllPhaseEffectiveDateByCropNameCode(cropNameCode, packageOfPractice).subscribe((res: PhaseEffectiveDate[]) => {
          this.allPhaseEffectiveDate = res;
          sub.next();
        }, err => {
          this.allPhaseEffectiveDate = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getPhaseEffectiveDateList: ', error);
    }
  }

  phaseEffectDateChange(event) {
    try {
      if (event) {
        const selectedPhase = this.allPhaseEffectiveDate.filter(p => p.transCode === event.value)[0];
        if (selectedPhase) {
          // if (this.isNewPOP) {
          //   this.getCropPhaseNameList(selectedPhase.transCode).subscribe(() => { });
          // } else {
          //   this.getCropStageList(selectedPhase.transCode).subscribe(() => { });
          // }
          if (!this.isNewPOP) {
            this.getCropStageList(selectedPhase.transCode).subscribe(() => { });
          }
        }
      } else {
        this.allCropNames = [];
      }
    } catch (error) {
      console.log('Error on phaseEffectDateChange: ', error);
    }
  }

  getCropPhaseNameList(packageOfPractice: string) {
    try {
      return new Observable((sub) => {
        this.popService.getAllCropPhaseNameByPackageOfPractice(packageOfPractice).subscribe((res: CropPhaseName[]) => {
          this.allCropPhaseName = res;
          this.popForm.controls.cropPhaseName.reset();
          sub.next();
        }, err => {
          this.allCropPhaseName = [];
          this.popForm.controls.cropPhaseName.reset();
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getCropPhaseNameList: ', error);
    }
  }
  cropPhaseNameChange(event) {
    try {
      if (event) {
        const selectedPhase = this.allCropPhaseName.filter(p => p.cropphaseCode === event.value)[0];
        if (selectedPhase) {
          this.popForm.controls.cropPhase.setValue(selectedPhase.cropphaseName);
          this.getHarvestDetails(selectedPhase.cropphaseCode).subscribe(() => { });
        }
      } else {
        this.allCropNames = [];
      }
    } catch (error) {
      console.log('Error on cropPhaseNameChange: ', error);
    }
  }
  getHarvestDetails(phaseCode: string) {
    try {
      return new Observable((sub) => {
        this.popService.getHarvestDetails(phaseCode).subscribe((res: HarvestStageDetails) => {
          this.popForm.controls.phaseSowingDay.setValue(res.fromDays + ' / ' + res.toDays);

          this.popForm.controls.sowingFrom.setValue(res.fromDays);
          this.popForm.controls.sowingTo.setValue(res.toDays);
          this.popForm.controls.harvestDetails.setValue(res.harvestDetails);
          sub.next();
        }, err => {
          this.popForm.controls.phaseSowingDay.reset();
          this.popForm.controls.harvestDetails.reset();
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getHarvestDetails: ', error);
    }
  }

  getCropStageList(transCode: string) {
    try {
      return new Observable((sub) => {
        const psNO = this.popForm.controls.sessionFromTo.value;
        const phaseCode = this.popForm.controls.cropPhase.value;
        this.popService.getCropStageList(psNO, transCode).subscribe((res: any) => {
          this.pMaterialList = res;
          sub.next();
        }, err => {
          this.pMaterialList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getHarvestDetails: ', error);
    }
  }
  // START country Section
  getAllMaterialGroups() {
    try {
      this.popService.getAllMatGroups().subscribe((res: MaterialGroup[]) => {
        if (res) {
          this.materialGroupList = res;
        }
      });
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  materialGroupValueChange(event) {
    try {
      if (event) {
        const selectedGroup = this.materialGroupList.filter(p => p.Raw_Material_Group_Code === event.value)[0];
        if (selectedGroup) {
          this.popForm.controls.materialNameCode.reset();
          this.popForm.controls.chemicalName.reset();
          this.getMaterialName(selectedGroup.Raw_Material_Group_Code).subscribe(() => { });
        }
      } else {
        this.materialGroupList = [];
        this.popForm.controls.materialNameCode.reset();
        this.popForm.controls.chemicalName.reset();
      }
    } catch (error) {
      console.log('Error on navbar cropGroupValueChange: ', error);
    }
  }


  getMaterialName(matGroupCode: string) {
    try {
      return new Observable((sub) => {
        this.popService.getAllMatNameByMatGroupCode(matGroupCode).subscribe((res: MaterialName[]) => {

          this.materialNameList = res;
          sub.next();
        }, err => {
          this.materialNameList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getCropName: ', error);
    }
  }
  materialNameValueChange(event) {
    try {
      if (event) {
        const selectedName = this.materialNameList.filter(p => p.Raw_Material_Details_Code === event.value)[0];
        if (selectedName) {
          this.popForm.controls.chemicalName.setValue(selectedName.Raw_Material_Details_Name);
        }
      } else {
        this.popForm.controls.chemicalName.reset();
      }
    } catch (error) {
      console.log('Error on navbar cropGroupValueChange: ', error);
    }
  }

  // END Material Name Section

  clearForSameDay() {
    try {
      this.popForm.controls.materialGroupCode.reset();
      this.popForm.controls.materialNameCode.reset();
      this.popForm.controls.chemicalName.reset();
      this.popForm.controls.tradeName.reset();
      this.popForm.controls.materialGroupCode.reset();
      this.popForm.controls.chemicalVolPLt.reset();
      this.popForm.controls.UOM.reset();
      this.popForm.controls.sprayVolumePerUOM.reset();
      this.popForm.controls.quantity.reset();
      this.popForm.controls.targetPets.reset();
    } catch (error) {
      console.log('Error on clearForSameDay: ', error);
    }
  }

  clearForChangeDay() {
    try {
      this.popForm.controls.daysApplicable.reset();
      this.clearForSameDay();
    } catch (error) {
      console.log('Error on clearForChangeDay: ', error);
    }
  }

  clearForChangePhase() {
    try {
      this.popForm.controls.cropPhaseName.reset();
      this.popForm.controls.phaseSowingDay.reset();
      this.popForm.controls.practiceEffectiveDate.reset();
      this.popForm.controls.daysApplicable.reset();
      this.clearForSameDay();
    } catch (error) {
      console.log('Error on clearForChangePhase: ', error);
    }
  }

  pushValueToMaterialList() {
    const pMaterial = new PracticeMaterial();
    pMaterial.cropPhaseCode = this.popForm.controls.cropPhaseName.value;
    pMaterial.cropPhaseName = this.popForm.controls.cropPhase.value;
    pMaterial.cropnameCode = this.popForm.controls.cropNameCode.value;
    pMaterial.daysApplicable = this.popForm.controls.daysApplicable.value;
    pMaterial.rawmaterialGroupcode = this.popForm.controls.materialGroupCode.value;
    pMaterial.rawmaterialDetailscode = this.popForm.controls.materialNameCode.value;
    pMaterial.tradeName = this.popForm.controls.tradeName.value;
    pMaterial.chemicalName = this.popForm.controls.chemicalName.value;
    pMaterial.chemicalVolume = this.popForm.controls.chemicalVolPLt.value;
    pMaterial.chemicalVolumeToDisplay = this.popForm.controls.chemicalVolPLt.value + ' - ' + this.popForm.controls.UOM.value;
    pMaterial.chemicalUom = this.popForm.controls.UOM.value;
    pMaterial.sprayVolume = this.popForm.controls.sprayVolumePerUOM.value;
    pMaterial.chemicalQty = this.popForm.controls.quantity.value;
    pMaterial.targetPest = this.popForm.controls.targetPets.value;
    pMaterial.practiceeffectiveDate = this.popForm.controls.practiceEffectiveDate.value;
    this.pMaterialList.push(pMaterial);
  }

  onBlur() {
    try {
      this.addPOPMaterial();
    } catch (error) {
      console.log('Error on onBlur: ', error);
    }
  }
  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }
  onClearClick() {
    try {

      this.popForm.reset();
      this.popForm.controls.enteredBy.setValue(this.userData.userName);
      this.pMaterialList = [];
      this.popForm.disable();
      this.disableSaveButton = true;
      this.disableFindButton = false;
      this.disableModButton = true;
      this.disableClearButton = true;
      this.disableNewButton = false;
      this.isNewPOP = true;
      this.isDetailAddingCompleted = false;
      this.practiceDetail = null;
      this.min = 0;
      this.max = 10;

      this.pMaterialList = [];
    } catch (error) {
      console.log('Error on onClearClick: ', error);
    }
  }
  newPOP() {
    this.popForm.enable();
    // this.popForm.controls.enteredBy.setValue(this.userData.userName);
    this.disableSaveButton = true;
    this.disableFindButton = true;
    this.disableModButton = true;
    this.disableClearButton = false;
    this.disableNewButton = true;
    this.isNewPOP = true;
    this.popForm.controls.phaseSowingDay.disable();
    this.popForm.controls.harvestDetails.disable();
    this.popForm.controls.entryDate.setValue(new Date());
    this.popForm.controls.enteredBy.disable();
    setTimeout(() => {
      this.entryDateInputRef.nativeElement.focus();
    }, 100);

  }

  findPOP() {
    this.popForm.controls.cropGroupCode.enable();
    this.popForm.controls.cropNameCode.enable();
    this.popForm.controls.popFor.enable();
    this.popForm.controls.sessionFromTo.enable();
    this.popForm.controls.phaseEffectiveDate.enable();
    // this.popForm.controls.enteredBy.setValue(this.userData.userName);
    this.disableSaveButton = true;
    this.disableFindButton = true;
    this.disableModButton = true;
    this.disableClearButton = false;
    this.disableNewButton = true;
    this.isNewPOP = false;
    setTimeout(() => {
      this.cropGroupMatSelect.focus();
    }, 100);

  }
  addPOPMaterial() {
    try {
      if (!this.isDetailAddingCompleted) {
        this.popForm.markAllAsTouched();
        if (this.popForm.invalid) {
          return;
        }
      }

      // to do add values to list
      this.pushValueToMaterialList();
      this.dialogRef = this.dialog.open(POPComponent);

      this.dialogRef.afterClosed().subscribe(value => {
        const returnVal = value;
        if (returnVal === 1) {
          this.clearForSameDay();
          setTimeout(() => { this.materialGroupMatSelectRef.focus(); }, 500);

        } else if (returnVal === 2) {
          this.clearForChangeDay();
          setTimeout(this.dASInputField.nativeElement.focus(), 500);
        } else if (returnVal === 3) {
          this.clearForChangePhase();
          setTimeout(() => { this.cropPhaseMatSelect.focus(); }, 500);
        } else if (returnVal === 4) {
          this.clearForSameDay();
          this.disableSaveButton = false;
          this.isDetailAddingCompleted = true;
          setTimeout(this.saveBtnRef.nativeElement.focus(), 500);
        }
      });
    } catch (error) {
      console.log('Error on addPOPMaterial: ', error);
    }
  }

  onSavePOP() {
    try {
      const pDetails: PracticeDetails = this.getPOP();
      if (!pDetails) {
        return;
      }
      pDetails.packageofMaterials = this.pMaterialList;
      this.popService.savePracticeDetails(pDetails).subscribe(() => {
        this.alertService.success('Practice created successfully.');
        this.onClearClick();
      }, err => {
        this.alertService.error('Error has occured while creating an Practice.');
      });
    } catch (error) {
      console.log('Error on onSavePOP: ', error);
    }
  }

  getPOP(): PracticeDetails {
    try {
      // && this.popForm.controls.enteredBy.valid
      if (this.popForm.controls.entryDate.valid
        && this.popForm.controls.cropGroupCode.valid && this.popForm.controls.cropNameCode.valid
        && this.popForm.controls.popFor.valid && this.popForm.controls.pPerAcrege.valid
        && this.popForm.controls.sessionFromTo.valid && this.popForm.controls.phaseEffectiveDate.valid
        && this.popForm.controls.cropPhaseName.valid && this.pMaterialList.length > 0) {
        const practiceDetails = new PracticeDetails();
        practiceDetails.entryDate = this.popForm.controls.entryDate.value;
        practiceDetails.employeeId = this.userData.userId; // this.popForm.controls.enteredBy.value;
        practiceDetails.cropgroupCode = this.popForm.controls.cropGroupCode.value;
        practiceDetails.cropnameCode = this.popForm.controls.cropNameCode.value;
        practiceDetails.divisionFor = this.popForm.controls.popFor.value;
        practiceDetails.practiceperAcre = this.popForm.controls.pPerAcrege.value;
        practiceDetails.psNo = this.popForm.controls.sessionFromTo.value;
        practiceDetails.transCode = this.popForm.controls.phaseEffectiveDate.value;
        practiceDetails.cropphaseCode = this.popForm.controls.cropPhaseName.value;
        practiceDetails.practiceeffectiveDate = this.popForm.controls.practiceEffectiveDate.value;
        return practiceDetails;
      } else {
        this.popForm.markAllAsTouched();
        return null;
      }
    } catch (error) {
      console.log('Error on getPOP: ', error);
    }
  }

}
