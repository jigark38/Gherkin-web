import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CropArea, CropGroup, CropName, CropRateSaveModel, FruitSizeCount, FruiteSizeMM, SeasonFromTo, VillageName } from './crop-rate.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSelect } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { CropRateService } from './crop-rate.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { ThrowStmt } from '@angular/compiler';

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
  selector: 'app-crop-rate',
  templateUrl: './crop-rate.component.html',
  styleUrls: ['./crop-rate.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class CropRateComponent implements OnInit, AfterViewInit {
  isLoading: boolean;
  seasonFromToError: boolean;
  FruitSizeMMError: boolean;
  fruitSizeCountError: boolean;
  VillageNameError: boolean;
  isFindClicked: boolean;
  isModifyClicked: boolean;
  fruiteSizeMMListMaster: FruiteSizeMM[];



  constructor(public authService: AuthenticationService,
    // tslint:disable-next-line: align
    public dialog: MatDialog, private cropRateService: CropRateService, protected alertService: AlertService) { }

  @ViewChild('seasonDDL', { static: false }) seasonDDL: MatSelect;
  @ViewChild('fruiteSizeMMDDL', { static: false }) fruiteSizeMMDDL: MatSelect;
  @ViewChild('saveCommand', { static: false }) saveCommand: ElementRef;
  @ViewChild('dateOfEntry', { static: false }) dateOfEntry: ElementRef;
  @ViewChild('associationRate', { static: false }) associationRate: ElementRef;
  options: string[] = ['One', 'Two', 'Three'];
  result: boolean;
  disableButton = false;
  preparedBy: string;
  cropAreaList: CropArea[];
  cropNameList: CropName[];
  cropGroupList: CropGroup[];
  villageList: VillageName[];
  seasonFromToList: SeasonFromTo[];
  fruiteSizeMMList: FruiteSizeMM[];
  cropRatesToBeSaved: CropRateSaveModel[] = [];

  fruitSizeCountList: FruitSizeCount[];
  // fruitSizeCountOptionsList: string[];

  ratesUOMList: string[];
  isPopupOpened: boolean;

  cropGroupError: boolean;

  isFindOn: boolean;
  isModifyOn: boolean;
  isNewOn: boolean;
  isSaveOn: boolean;
  allAssociationRateList: CropRateSaveModel[];
  selectedCurrentCropRate: CropRateSaveModel;
  cropRateForm: FormGroup = new FormGroup({
    dateOfEntry: new FormControl('', [Validators.required]),
    preparedBy: new FormControl(this.preparedBy, [Validators.required]),
    cropGroup: new FormControl('', [Validators.required]),
    cropName: new FormControl('', [Validators.required]),
    areaName: new FormControl('', [Validators.required]),
    villageName: new FormControl('', [Validators.required]),
    sessionFromTo: new FormControl('', [Validators.required]),
    effectiveDate: new FormControl('', [Validators.required]),
    fruitSizeMM: new FormControl('', [Validators.required]),
    fruitSizeCount: new FormControl('', [Validators.required]),
    associationRate: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,3}\.\d{1,2})$|^\d{0,3}$/)]),
    rateUOM: new FormControl('', [Validators.required, Validators.pattern(/^([^0-9]*)$/)])
  });
  employeeId: string;
  employeeName: string;
  ngOnInit() {
    try {
      this.isFindOn = true;
      this.isModifyOn = true;
      this.isNewOn = true;
      this.isSaveOn = false;

      const emp = this.authService.getUserdetails();
      this.employeeId = emp.employeeId;
      this.employeeName = emp.userName;
      this.getAllAreas();
      this.getCropGroup();
      this.cropRateForm.controls.fruitSizeCount.disable();
      this.cropRateForm.controls.preparedBy.disable();
      this.cropRateForm.controls.preparedBy.setValue(this.employeeName);
      this.cropRateForm.controls.rateUOM.valueChanges.pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.cropRateService.geRatesUOM(value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      ).subscribe((m: string[]) => {

        this.ratesUOMList = m;
      });
    } catch (error) {

    }
    this.disableAllControls();
  }
  ngAfterViewInit(): void {

  }
  getRatesUOMKeyPress() {
    try {
      this.getRatesUOM().subscribe(() => { });

    } catch (error) {

    }
  }
  getRatesUOM() {
    try {

      return new Observable((obs) => {
        const cropRate: string = this.cropRateForm.controls.rateUOM.value;
        if (cropRate) {
          this.cropRateService.geRatesUOM(cropRate).subscribe((data: string[]) => {
            if (data) {
              this.ratesUOMList = data;
            }
            obs.next();
            obs.complete();
          }, err => {
            this.ratesUOMList = [];
            obs.error(err);
          });
        }
        obs.next();
        obs.complete();
      });

    } catch (error) {

    }
  }

  associationRateBlur() {
    try {

      const rate: string = this.cropRateForm.controls.associationRate.value;
      // tslint:disable-next-line: triple-equals
      if (rate && rate.toString().indexOf('.') == -1 && rate.toString().length <= 3) {
        this.cropRateForm.controls.associationRate.setValue(rate + '.00');
      }

    } catch (error) {

    }
  }

  savesratesUOMItemToList(event) {

  }

  getFruitSizeCount() {
    try {

      return new Observable((obs) => {
        const fruitCountMM = this.cropRateForm.controls.fruitSizeMM.value;
        if (fruitCountMM) {
          this.cropRateService.getFruitSizeCount(fruitCountMM).subscribe((data: FruitSizeCount[]) => {
            if (data) {
              this.fruitSizeCountList = data;
              // tslint:disable-next-line: triple-equals
              this.fruitSizeCountError = data && data.length == 0;
            }
            obs.next();
            obs.complete();
          }, err => {
            this.fruitSizeCountList = [];
            // this.fruitSizeCountOptionsList = [];
            obs.error(err);
            this.fruitSizeCountError = true;
          });
        }
      });
    } catch (error) {

    }
  }

  fruitSizeValueChange(event) {
    try {
      if (event && event.value) {
        // tslint:disable-next-line: triple-equals
        const selectedFruitSizeMM = this.fruiteSizeMMListMaster.filter(a => a.cropSchemeCode == event.value)[0];
        if (selectedFruitSizeMM) {
          this.fruiteSizeMMList = this.fruiteSizeMMListMaster.filter(a => a.cropSchemeFrom === selectedFruitSizeMM.cropSchemeFrom);
          this.cropRateForm.controls.fruitSizeCount.setValue(selectedFruitSizeMM.cropCountMM);
          setTimeout(() => {
            this.associationRate.nativeElement.focus();
          }, 100);
        }
      }
    } catch (error) {

    }
  }

  savesFruitSizeItemToList(event) {
    try {
      if (event) {
        if (this.cropRateForm.controls.fruitSizeCount.valid) {

        }
      }
    } catch (error) {

    }
  }

  fruiteSizeMMChange(event) {

  }

  getCropGroup() {
    try {

      this.cropRateService.GetAllCropGroup().subscribe((data: CropGroup[]) => {
        this.cropGroupList = data;
      }, err => {
        this.alertService.error('Error has occured while fetching crop group!!');
      });
    } catch (error) {

    }
  }
  getAllCropNames(cropGroupCode: string) {
    try {

      return new Observable((obs) => {
        if (cropGroupCode) {
          this.cropRateService.GetCropNameByGroup(cropGroupCode).subscribe((data: CropName[]) => {
            this.cropNameList = data;
            // tslint:disable-next-line: triple-equals
            this.cropGroupError = data && data.length == 0;
            obs.next();
            obs.complete();
            // this.alertService.success('Success!!', { autoClose: false, keepAfterRouteChange: false });
          }, err => {
            // this.alertService.error('Error has occured  while fetching crop name!!', { autoClose: false, keepAfterRouteChange: false });
            obs.error(err);
            this.cropGroupError = true;
          });
        }
      });

    } catch (error) {

    }
  }

  getAllAreas() {
    try {
      this.cropRateService.GetAllAreas().subscribe((data: CropArea[]) => {
        this.cropAreaList = data;
        if (this.cropAreaList.length > 0) {
          this.cropAreaList.unshift({ areaId: '1', name: 'All Area' });
        }

      }, err => {
        this.alertService.error('Error has occured while fetching crop areas!!');
        // this.VillageNameError = true;
      });
    } catch (error) {

    }
  }

  getVillageByArea(areaId: string) {
    try {

      return new Observable((obs) => {
        this.cropRateService.GetVillageByArea(areaId).subscribe((data: VillageName[]) => {
          this.villageList = data;
          // tslint:disable-next-line: triple-equals
          if (this.villageList.length == 0 && this.cropRateForm.controls.areaName.value == '1') {
            this.villageList.push({ villageCode: '1', name: 'All Village' });
            this.cropRateForm.controls.villageName.setValue('1');

          }
          // tslint:disable-next-line: triple-equals
          this.VillageNameError = data && data.length == 0;
          obs.next();
          obs.complete();
        }, err => {
          obs.error(err);
          this.VillageNameError = true;
        });
      });

    } catch (error) {

    }
  }

  getSeasonFromTo(cropNameCode: string) {
    try {
      return new Observable((obs) => {
        if (cropNameCode) {
          this.cropRateService.GetSeasonFromTo(cropNameCode).subscribe((data: SeasonFromTo[]) => {
            this.seasonFromToList = data;
            // tslint:disable-next-line: triple-equals
            this.seasonFromToError = data && data.length == 0;
            obs.next();
            obs.complete();
          },
            err => {
              obs.error(err);
              this.seasonFromToError = true;
            });
        }
      });
    } catch (error) {

    }
  }

  seasonChange(event) {
    try {

      if (event && event.value) {
        this.getFruitSizeMM(event.value).subscribe(() => { });
        if (this.isFindClicked || this.isModifyClicked) {
          const PSNumber = this.cropRateForm.controls.sessionFromTo.value;
          // tslint:disable-next-line: triple-equals
          const season = this.seasonFromToList.filter(a => a.psNumber == PSNumber)[0];
          this.getAllAssociationRatesBySeason(PSNumber);
        } else {
          const PSNumber = this.cropRateForm.controls.sessionFromTo.value;
          // tslint:disable-next-line: triple-equals
          const season = this.seasonFromToList.filter(a => a.psNumber == PSNumber)[0];
          this.checkIfSeasonExist(PSNumber);
        }
      }
    } catch (error) {

    }
  }
  getAllAssociationRatesBySeason(PSNumber: string) {
    try {

      this.disableButton = true;
      this.cropRateService.getAllAssociationRatesBySeason(PSNumber).subscribe((data: CropRateSaveModel[]) => {
        this.disableButton = false;
        this.allAssociationRateList = data;
        this.cropRatesToBeSaved = data;
      }, err => {
        this.alertService.error('Error occured while searching the crop rates.');
        this.disableButton = false;
      });

    } catch (error) {

    }
  }

  checkIfSeasonExist(PSNumber: string) {
    this.cropRateService.getAllAssociationRatesBySeason(PSNumber).subscribe((data: CropRateSaveModel[]) => {
      if (data && data.length > 0) {
        if (data.filter(a => a.psNumber === this.cropRateForm.controls.sessionFromTo.value)) {
          this.disableButton = true;
          this.alertService.info('Data has already been entered for selected Season.');
        } else {
          this.disableButton = false;
        }
      } else {
        this.disableButton = false;
      }
    });
  }

  getFruitSizeMM(PSNumber: string) {
    try {

      return new Observable((obs) => {
        if (PSNumber) {
          this.cropRateService.GetFruitSizeMM(PSNumber).subscribe((data: FruiteSizeMM[]) => {
            this.fruiteSizeMMList = data;
            this.fruiteSizeMMListMaster = data;
            this.fruitSizeCountList = data;
            // tslint:disable-next-line: triple-equals
            this.FruitSizeMMError = data && data.length == 0;
            obs.next();
            obs.complete();
          },
            err => {
              obs.error(err);
              this.FruitSizeMMError = true;
            });
        } else {
          obs.next();
          obs.complete();
        }
      });

    } catch (error) {

    }
  }

  savePreparedByIndividually(event: string) {
    setTimeout(() => {
      this.options.push(event);
      this.options = this.options.slice();
    }, 1000);
  }

  cropGroupChange(event) {
    try {
      if (event && event.value) {
        this.cropNameList = [];
        this.seasonFromToList = [];
        this.cropRateForm.controls.cropName.setValue('');
        this.cropRateForm.controls.sessionFromTo.setValue('');
        this.getAllCropNames(event.value).subscribe(() => { });
      }
    } catch (error) {

    }
  }

  cropNameChange(event) {
    try {
      if (event && event.value) {
        this.seasonFromToList = [];
        this.cropRateForm.controls.sessionFromTo.setValue('');
        this.getSeasonFromTo(event.value).subscribe(() => { });

      } else {

      }

    } catch (error) {

    }
  }
  areaChange(event) {
    try {

      if (event && event.value) {
        this.villageList = [];
        this.cropRateForm.controls.villageName.setValue('');
        this.getVillageByArea(event.value).subscribe(() => { });
      }

    } catch (error) {

    }
  }

  optionSelectedRateUOM(event) {

  }

  rateUOMblur() {
    try {
      setTimeout(() => {
        if (!this.cropRateForm.valid || !this.cropRateForm.get('rateUOM').value) {
          this.markFieldAsTouched(this.cropRateForm);
        } else {
          // valid
          if (!this.isPopupOpened && !this.isFindClicked && !this.isModifyClicked) {

            this.isPopupOpened = true;
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              width: '350px',
              data: 'Do You Want to add more size rates?'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.fruiteSizeMMDDL.focus();
                this.fruiteSizeMMDDL.open();
                this.cropRatesToBeSaved.push(this.addCropRate());

              } else {
                this.saveCommand.nativeElement.focus();
                this.cropRatesToBeSaved.push(this.addCropRate());
              }

              this.result = result;
              setTimeout(() => {
                this.isPopupOpened = false;

              }, 500);
            });
          }
        }
      }, 100);
    } catch (error) {

    }
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

  addCropRate(): CropRateSaveModel {
    try {


      if (this.cropRateForm.valid) {
        const cropRateSaveModel = new CropRateSaveModel();
        if (this.selectedCurrentCropRate && this.selectedCurrentCropRate.cropRateNumber) {
          cropRateSaveModel.cropRateNumber = this.selectedCurrentCropRate.cropRateNumber;
        }
        cropRateSaveModel.cropRateEntryDate = new Date(this.cropRateForm.get('dateOfEntry').value).toLocaleString();
        cropRateSaveModel.cropRateEnteredByEmpId = this.employeeId;
        cropRateSaveModel.cropGroupCode = this.cropRateForm.get('cropGroup').value;
        cropRateSaveModel.cropGroupName = this.cropRateForm.get('cropName').value;
        cropRateSaveModel.cropRateEffectiveDate = new Date(this.cropRateForm.get('effectiveDate').value).toLocaleString();
        // tslint:disable-next-line: triple-equals
        if (this.cropRateForm.get('areaName').value == '1') {
          cropRateSaveModel.allAreas = '1';
        } else {
          cropRateSaveModel.areaId = this.cropRateForm.get('areaName').value;
        }

        // tslint:disable-next-line: triple-equals
        if (this.cropRateForm.get('villageName').value == '1') {
          cropRateSaveModel.allVillages = '1';
        } else {
          cropRateSaveModel.villageCode = this.cropRateForm.get('villageName').value;
        }
        cropRateSaveModel.psNumber = this.cropRateForm.get('sessionFromTo').value.trim();

        const selectedFruitSizeCount = this.fruiteSizeMMList.filter
          (a => a.cropSchemeCode === this.cropRateForm.get('fruitSizeMM').value)[0];
        if (selectedFruitSizeCount) {
          cropRateSaveModel.cropSchemeFrom = selectedFruitSizeCount.cropSchemeFrom;
          cropRateSaveModel.cropSchemeSign = selectedFruitSizeCount.cropSchemeSign;
          cropRateSaveModel.cropCount = this.cropRateForm.get('fruitSizeCount').value;
          cropRateSaveModel.cropSchemeCode = this.cropRateForm.get('fruitSizeMM').value;

          this.fruitSizeCountList.splice(this.fruitSizeCountList.findIndex
            (a => a.cropSchemeFrom === cropRateSaveModel.cropSchemeFrom &&
              a.cropSchemeSign === cropRateSaveModel.cropSchemeSign), 1);
        }



        cropRateSaveModel.cropRateAsperAssociation = this.cropRateForm.get('associationRate').value;
        cropRateSaveModel.cropRatePerUOM = this.cropRateForm.get('rateUOM').value;
        return cropRateSaveModel;
      }

    } catch (error) {

    }
  }

  selectCropRateToEdit(cropRate: CropRateSaveModel) {
    try {


      if (cropRate) {
        this.selectedCurrentCropRate = cropRate;
        this.cropRateForm.get('dateOfEntry').setValue(cropRate.cropRateEntryDate);
        this.cropRateForm.controls.preparedBy.disable();
        this.cropRateForm.controls.preparedBy.setValue(this.employeeName);
        this.cropRateForm.get('cropGroup').setValue(cropRate.cropGroupCode);
        this.selectCropNameAfterSelection(cropRate);
        this.cropRateForm.get('areaName').setValue(cropRate.areaId);
        // tslint:disable-next-line: triple-equals
        if (cropRate.allAreas == '1') {
          this.cropRateForm.get('areaName').setValue('1');
        }

        this.selectVillageAfterSelection(cropRate);
        this.cropRateForm.get('effectiveDate').setValue(cropRate.cropRateEffectiveDate);
        this.cropRateForm.get('associationRate').setValue(cropRate.cropRateAsperAssociation);
        this.selectRateUOMAfterSelection(cropRate);
        if (this.isFindClicked) {
          this.disableAllControls();
        }
        if (this.isModifyClicked) {
          this.enableAllControls();
          this.disableControls();
        }


      }

    } catch (error) {

    }
  }

  disableControls() {
    try {
      this.cropRateForm.get('dateOfEntry').disable();
      this.cropRateForm.get('preparedBy').disable();
      this.cropRateForm.get('cropGroup').disable();
      this.cropRateForm.get('cropName').disable();
      this.cropRateForm.get('areaName').disable();
      this.cropRateForm.get('villageName').disable();
      this.cropRateForm.get('sessionFromTo').disable();
      this.cropRateForm.get('fruitSizeMM').disable();
      this.cropRateForm.get('fruitSizeCount').disable();
    } catch (error) {

    }
  }

  disableAllControls() {
    try {
      this.cropRateForm.get('dateOfEntry').disable();
      this.cropRateForm.get('preparedBy').disable();
      this.cropRateForm.get('cropGroup').disable();
      this.cropRateForm.get('cropName').disable();
      this.cropRateForm.get('areaName').disable();
      this.cropRateForm.get('villageName').disable();
      this.cropRateForm.get('sessionFromTo').disable();
      this.cropRateForm.get('fruitSizeMM').disable();
      this.cropRateForm.get('fruitSizeCount').disable();
      this.cropRateForm.get('associationRate').disable();
      this.cropRateForm.get('effectiveDate').disable();
      this.cropRateForm.get('rateUOM').disable();

    } catch (error) {

    }
  }


  enableControls() {
    try {
      this.cropRateForm.get('dateOfEntry').enable();
      this.cropRateForm.get('preparedBy').disable();
      this.cropRateForm.get('cropGroup').enable();
      this.cropRateForm.get('cropName').enable();
      this.cropRateForm.get('areaName').enable();
      this.cropRateForm.get('villageName').enable();
      this.cropRateForm.get('sessionFromTo').enable();
      this.cropRateForm.get('fruitSizeMM').enable();
      this.cropRateForm.get('fruitSizeCount').disable();


    } catch (error) {

    }
  }

  enableAllControls() {
    try {
      this.cropRateForm.get('dateOfEntry').enable();
      this.cropRateForm.get('preparedBy').disable();
      this.cropRateForm.get('cropGroup').enable();
      this.cropRateForm.get('cropName').enable();
      this.cropRateForm.get('areaName').enable();
      this.cropRateForm.get('villageName').enable();
      this.cropRateForm.get('sessionFromTo').enable();
      this.cropRateForm.get('fruitSizeMM').enable();
      this.cropRateForm.get('fruitSizeCount').disable();
      this.cropRateForm.get('associationRate').enable();
      this.cropRateForm.get('effectiveDate').enable();
      this.cropRateForm.get('rateUOM').enable();
    } catch (error) {

    }
  }


  selectCropNameAfterSelection(cropRate: CropRateSaveModel) {
    try {
      const cropGroup = this.cropRateForm.get('cropGroup').value;
      if (cropGroup) {
        this.getAllCropNames(cropGroup).subscribe(() => {
          this.cropRateForm.get('cropName').setValue(cropRate.cropGroupName);
          this.getSeasonFromTo(cropRate.cropGroupName).subscribe(() => {
            this.cropRateForm.get('sessionFromTo').setValue(cropRate.psNumber);
            this.getFruitSizeMM(cropRate.psNumber).subscribe(() => {
              this.cropRateForm.get('fruitSizeMM').setValue(cropRate.cropSchemeCode);

              // tslint:disable-next-line: triple-equals
              const selectedFruitSizeMM = this.fruiteSizeMMList.filter(a => a.cropSchemeCode == cropRate.cropSchemeCode)[0];
              if (selectedFruitSizeMM) {
                this.cropRateForm.get('fruitSizeCount').setValue(selectedFruitSizeMM.cropCountMM);
                setTimeout(() => {
                  this.associationRate.nativeElement.focus();
                }, 100);
              }
              // this.getFruitSizeCount().subscribe(() => {
              //   // tslint:disable-next-line: triple-equals
              //   const matchedCount = this.fruitSizeCountList.filter(a => a.cropSchemeFrom == cropRate.cropSchemeFrom
              //     // tslint:disable-next-line: triple-equals
              //     && a.cropSchemeSign == cropRate.cropSchemeSign)[0];
              //   if (matchedCount) {
              //     this.cropRateForm.get('fruitSizeCount').setValue(matchedCount.cropSchemeFrom + ' ' + matchedCount.cropSchemeSign);
              //   }
              // });
            });
          });

        });
      }
    } catch (error) {

    }
  }
  selectVillageAfterSelection(cropRate: CropRateSaveModel) {
    try {
      const areaId = this.cropRateForm.controls.areaName.value;
      if (areaId) {
        this.getVillageByArea(areaId).subscribe(() => {
          this.cropRateForm.get('villageName').setValue(cropRate.villageCode);
          // tslint:disable-next-line: triple-equals
          if (cropRate.allVillages == '1') {
            this.cropRateForm.get('villageName').setValue('1');
          }
        });
      }
    } catch (error) {

    }
  }

  selectRateUOMAfterSelection(cropRate: CropRateSaveModel) {
    try {

      const associatedRate = this.cropRateForm.controls.associationRate.value;
      if (associatedRate) {
        this.getRatesUOM().subscribe(() => {
          this.cropRateForm.get('rateUOM').setValue(cropRate.cropRatePerUOM);
        });
      }

    } catch (error) {

    }
  }

  saveCropRates() {
    try {

      if (this.isModifyClicked) {
        this.modify();
        return;
      }

      this.isFindOn = false;
      this.isModifyOn = false;
      if (this.cropRateForm.valid) {
        if (this.cropRatesToBeSaved && this.cropRatesToBeSaved.length > 0) {
          this.disableButton = true;
          this.cropRateService.addCropRates(this.cropRatesToBeSaved).subscribe((data: CropRateSaveModel[]) => {
            if (data && data.filter(a => !!a.message)[0]) {
              this.alertService.info('Rate is already exist for selected fruit size.');
            } else if (data && data.length > 0) {
              this.alertService.success('Crop rate created successfully.');
            }

            this.clearForm();
            this.disableButton = false;
          },
            error => {
              console.error(error);
              this.disableButton = false;
              this.alertService.error('Error has occured while saving crop rates.');
            });
        }
      } else {
        this.markFieldAsTouched(this.cropRateForm);
      }

    } catch (error) {

    }
  }

  //#region validation
  cropGroupNameRequireValidator(control: FormControl) {
    try {


      const cropGroupName = control.value;
      if (!this.cropRateForm.get('cropGroup').value) {
        return { error: 'Crop Group is required.' };
      }
      return null;
    } catch (error) {

    }
  }

  cropSignValidation(control: FormControl) {
    try {
      const cropSignText: string = control.value;
      if (cropSignText) {


        // tslint:disable-next-line: triple-equals
        if (cropSignText && (cropSignText.indexOf(' +') == -1 && cropSignText.indexOf(' -') == -1)) {
          return { error: 'This field should be in the format of XXX +/-' };
        }
        const firstItem: string = cropSignText.split(' +')[0];
        if (firstItem && cropSignText.indexOf(' +') > -1) {
          if (isNaN(+firstItem.trim())) {
            return { error: 'This field should be in the format of XXX +/-' };
          } else {
            return null;
          }
        }

        const mfirstItem: string = cropSignText.split(' -')[0];
        if (mfirstItem && cropSignText.indexOf(' -') > -1) {
          if (isNaN(+mfirstItem.trim())) {
            return { error: 'This field should be in the format of XXX +/-' };
          } else {
            return null;
          }
        }

        // let mfirstItem: string = cropSignText.split("-")[0];
        // if (mfirstItem && isNaN(+mfirstItem.trim())) {

        // }
        return null;
      }
    } catch (error) {

    }
  }
  //#endregion

  clearForm() {
    try {


      this.cropRateForm.reset();
      // this.cropAreaList = [];
      this.cropNameList = [];
      // this.cropGroupList = [];
      this.villageList = [];
      this.seasonFromToList = [];
      this.fruiteSizeMMList = [];
      this.cropRatesToBeSaved = [];
      this.fruitSizeCountList = [];
      // this.fruitSizeCountOptionsList = [];
      this.ratesUOMList = [];
      this.isFindOn = false;
      this.isFindClicked = false;
      this.isModifyClicked = false;
      this.isModifyOn = false;
      this.disableButton = false;
      this.disableAllControls();

      this.cropRateForm.controls.preparedBy.disable();
      this.cropRateForm.controls.preparedBy.setValue(this.employeeName);
      this.isFindOn = true;
      this.isModifyOn = true;
      this.isSaveOn = false;
      this.isNewOn = true;
    } catch (error) {

    }
  }

  newCropRate() {
    try {
      this.clearForm();
      this.isFindOn = false;
      this.isModifyOn = false;
      this.isSaveOn = true;
      this.isNewOn = false;
      this.dateOfEntry.nativeElement.focus();
      this.enableAllControls();
      this.cropRateForm.controls.dateOfEntry.setValue(new Date());
      this.cropRateForm.controls.preparedBy.disable();
      this.cropRateForm.controls.preparedBy.setValue(this.employeeName);

    } catch (error) {

    }
  }
  findClick() {
    this.isFindOn = false;
    this.isNewOn = false;
    this.isModifyOn = false;
    this.isSaveOn = false;
    this.isFindClicked = true;
    this.isModifyClicked = false;
    this.cropRateForm.get('preparedBy').disable();
    this.cropRateForm.get('cropGroup').enable();
    this.cropRateForm.get('cropName').enable();
    this.cropRateForm.get('areaName').enable();
    this.cropRateForm.get('villageName').enable();
    this.cropRateForm.get('sessionFromTo').enable();
    this.seasonDDL.open();
    this.seasonDDL.focus();

  }

  modifyClick() {
    this.isFindOn = false;
    this.isNewOn = false;
    this.isModifyOn = false;
    this.isSaveOn = true;
    this.isFindClicked = false;
    this.isModifyClicked = true;
    this.cropRateForm.get('preparedBy').disable();
    this.cropRateForm.get('cropGroup').enable();
    this.cropRateForm.get('cropName').enable();
    this.cropRateForm.get('areaName').enable();
    this.cropRateForm.get('villageName').enable();
    this.cropRateForm.get('sessionFromTo').enable();
    this.seasonDDL.open();
    this.seasonDDL.focus();
  }

  modify() {
    try {
      if (!this.cropRateForm.valid || !this.selectedCurrentCropRate) {
        return;
      }

      // this.isFindOn = false;
      // this.isNewOn = false;
      // this.isModifyOn = false;
      // this.isSaveOn = true;
      if (this.selectedCurrentCropRate && this.selectedCurrentCropRate.cropRateNumber) {
        this.selectedCurrentCropRate = this.addCropRate();
        this.disableButton = true;
        this.cropRateService.modifySelectedCropRate(this.selectedCurrentCropRate).subscribe((data: CropRateSaveModel[]) => {
          if (data) {
            this.clearForm();
            this.allAssociationRateList = data;
            this.cropRatesToBeSaved = data;
            this.alertService.success('Crop rate modified successfully.');
            this.disableButton = false;
          }
        }, err => {
          this.disableButton = false;
        });
      }
    } catch (error) {

    }
  }

  deleteCropRate(cropRate: CropRateSaveModel) {
    try {

      if (cropRate.cropRateNumber) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Are you sure you want to delete this crop rate?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.disableButton = true;
            this.cropRateService.deleteCropRate(cropRate.cropRateNumber).subscribe((data: CropRateSaveModel[]) => {
              this.disableButton = false;
              if (data) {
                this.clearForm();
                this.allAssociationRateList = data;
                this.cropRatesToBeSaved = data;
                this.isFindOn = true;
                this.isModifyOn = true;
                this.alertService.success('Crop rate deleted successfully.');
              }
            }, err => {
              this.disableButton = false;
            });
          } else {

          }
        });
      }

    } catch (error) {

    }
  }

}

