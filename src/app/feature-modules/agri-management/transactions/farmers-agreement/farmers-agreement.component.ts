import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter, MatDialog, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { FarmersAgreement, FarmersAgreementSize } from 'src/app/shared/models/FarmerAgreement.model';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { FarmerAgreementService } from 'src/app/shared/services/farmer-agreement.service';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';

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
  selector: 'app-farmers-agreement',
  templateUrl: './farmers-agreement.component.html',
  styleUrls: ['./farmers-agreement.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})


export class FarmersAgreementComponent implements OnInit {
  farmerAccControl = new FormControl({ value: null });
  farmerNameControl = new FormControl({ value: null });
  allAreas: any[] = [];
  allFarmers: any[] = [];
  cropGroup: any[] = [];
  cropNameList: any[] = [];
  seasonList: any[] = [];
  villageList: any[] = [];
  fruitSizeList: any[] = [];
  employeeList: any[] = [];
  filteredEmployeeList: any[] = [];
  // backUpAgreementCode: string;
  disableFarmerFields = false;
  addMoreFruits = false;
  addNewClicked = false;
  isAccountNumberValid = true;
  filteredOptions: Observable<string[]>;
  farmerAccList: string[];
  isFindClicked = false;
  isModifyClicked = false;
  agriFarmer: any;
  enableSearch = false;
  isUpdate = false;
  isSaved = false;

  enableNew = false;
  isFindEnabled = false;
  isSearchResults = false;
  isEditEnabled = false;
  enableSave = false;
  disableButton: boolean;

  selectedFruitSizeIndex = null;
  fruitSizetoDelete;
  isVillage = true;
  isFarmer = true;
  accountNumberFound = true;
  selectedSchemeCode = '';

  @ViewChild('form', { static: false }) ngForm: NgForm;
  @ViewChild('agreementDate', { static: false }) agreementDate: any;
  @ViewChild('FarmersAgreementDate', { read: ElementRef, static: false }) FarmersAgreementDate: ElementRef;
  @ViewChild('AreaID', { read: ElementRef, static: false }) AreaID: ElementRef;
  @ViewChild('farmerAccount', { static: false }) farmerAccountEle: ElementRef;
  @ViewChild('CropGroupCode', { read: MatSelect, static: false }) cropGroupCode: MatSelect;
  @ViewChild('CropCount', { read: MatSelect, static: false }) CropCount: MatSelect;



  farmerAgmt: FarmersAgreement;
  farmerAgmtSize: FarmersAgreementSize;
  formChangesSubscription: any;
  oldCropName: string;





  constructor(private farmerService: FarmerAgreementService, private alertService: AlertService,
    private dialog: MatDialog) {

    this.farmerAgmt = new FarmersAgreement();
    this.farmerAgmtSize = new FarmersAgreementSize();


  }

  ngOnInit() {

    try {
      this.enableNew = true;
      this.enableSave = false;
      this.isFindEnabled = true;
      this.isEditEnabled = true;
      // this.isSearchResults = false;
      this.getFarmersAgreementCode();
      this.farmerAgmt.FarmersAgreementDate = new Date();
      this.farmerService.getAllAreas().subscribe(res => {
        this.allAreas = res;
      });


      this.farmerService.getCropGroup().subscribe(res => {
        this.cropGroup = res;
      });

      this.disableFarmerFields = true;


    } catch (error) {
    }


  }

  getFarmersAgreementCode() {

    try {
      this.farmerService.getAgreementCode().subscribe(res => {
        const splitAgreement = res.split('FA_')[1];
        // this.backUpAgreementCode = splitAgreement;
        this.farmerAgmt.FarmersAgreementCode = splitAgreement;
      }, error => {
        this.alertService.error('Error in fetching Agreement Code!');
      });

    } catch (error) {
    }

  }
  getFarmerAccountList() {
    try {
      this.farmerService.getFarmerAccountList(this.farmerAgmt.CropGroupCode, this.farmerAgmt.CropNameCode, this.farmerAgmt.PSNumber)
        .subscribe(data => {
          this.farmerAccList = data;
          this.filteredOptions = this.farmerAccControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value),
              map(name => name ? this._filter(name) : this.farmerAccList.slice())
            );
        });
    } catch (error) {

    }
  }

  getAccList() {
    if (this.isFindClicked || this.isModifyClicked) {
      this.getFarmerAccountList();
    }
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.farmerAccList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  allotAreaCode() {
    const objectProp = '_d';
    this.filteredEmployeeList = [];
    try {
      this.isVillage = true;
      const ind = this.allAreas.findIndex(x => x.areaId === this.farmerAgmt.AreaID);
      this.farmerAgmt.AreaCode = this.allAreas[ind].areaCode;
      this.emptyAreaFields();

      this.farmerService.getVillageCode(this.farmerAgmt.AreaID).subscribe(res => {
        this.villageList = res;

        if (this.villageList.length > 0) {
          this.isVillage = true;
        } else {
          this.isVillage = false;
        }
      }, error => {
        this.alertService.error('Error in fetching Village Names');
      });

      this.farmerService.getFieldStaffWithEmployeeDetails(this.farmerAgmt.AreaID, 'field staff').subscribe(res => {
        this.employeeList = res;
        if (this.employeeList.length === 0) {
          this.farmerAgmt.EmployeeID = 'Not Available';
          this.filteredEmployeeList = [];
        } else {
          if (this.farmerAgmt.FarmersAgreementDate) {
            if (!this.farmerAgmt.FarmersAgreementDate[objectProp]) {
              const filteredEmpList = this.employeeList.filter(x =>
                new Date(x.effectiveDate) <= new Date(this.farmerAgmt.FarmersAgreementDate)
              );
              this.filteredEmployeeList = filteredEmpList;
              if (filteredEmpList.length === 0) {
                this.farmerAgmt.EmployeeID = 'Not Available';
                this.filteredEmployeeList = [];
              } else {
                this.farmerAgmt.EmployeeID = filteredEmpList[0].Employee_ID;
              }
            } else {
              const filteredEmpList = this.employeeList.filter(x =>
                new Date(x.effectiveDate) <= new Date(this.farmerAgmt.FarmersAgreementDate[objectProp])
              );
              this.filteredEmployeeList = filteredEmpList;
              if (filteredEmpList.length === 0) {
                this.farmerAgmt.EmployeeID = 'Not Available';
              } else {
                this.farmerAgmt.EmployeeID = filteredEmpList[0].Employee_ID;
              }
            }
          }
        }

      }, error => {
        this.alertService.error('Error in fetching field staff Details');
      });
    } catch (error) {
    }
  }

  getFarmerDetails() {
    try {
      this.isFarmer = true;
      this.emptyFarmerFields();
      this.farmerService.getFarmersByVillage(this.farmerAgmt.VillageCode).subscribe(res => {
        this.allFarmers = res;

        if (this.allFarmers.length > 0) {
          this.isFarmer = true;
        } else {
          this.isFarmer = false;
        }

      }, error => {
        this.alertService.error('Error in fetching Farmer details');
      });

    } catch (error) {
    }
  }

  allotDistrictState() {
    try {
      const ind = this.allFarmers.findIndex(x => x.farmerCode === this.farmerAgmt.FarmerCode);
      if (ind > -1) {
        this.farmerAgmt.Address = this.allFarmers[ind].farmerAddress;
        this.farmerAgmt.DistrictCode = this.allFarmers[ind].districtCode;
        this.farmerAgmt.StateCode = this.allFarmers[ind].stateCode;
        this.farmerAgmt.CountryCode = this.allFarmers[ind].countryCode;
        this.farmerAgmt.FarmersAccountNo = this.allFarmers[ind].alternativeContactPerson;
        this.farmerAgmt.MandalCode = this.allFarmers[ind].mandalCode;
        this.farmerAgmt.MandalName = this.allFarmers[ind].mandalName;
        this.farmerAgmt.VillageCode = this.allFarmers[ind].villageCode;
        this.farmerService.getDistrictDetails(this.farmerAgmt.DistrictCode).subscribe(res => {
          this.farmerAgmt.DistrictName = res.districtName;
        }, error => {
          this.alertService.error('Error in fetching district details!');
        });

        this.farmerService.getCountryDetails(this.farmerAgmt.CountryCode).subscribe(res => {
          this.farmerAgmt.CountryName = res.countryName;
          this.farmerAgmt.StateName = res.states.filter(x => x.stateCode === this.farmerAgmt.StateCode)[0].stateName;
        }, error => {
          this.alertService.error('Error in fetching Country Details!');
        });
      }
    } catch (error) {
    }

  }

  filterFarmersByAccountNo() {
    try {
      const ind = this.allFarmers.findIndex(x => x.alternativeContactPerson.replace(/^0+/, '') === this.farmerAgmt.FarmersAccountNo);

      if (ind > -1) {
        this.accountNumberFound = true;
        this.farmerAgmt.Address = this.allFarmers[ind].farmerAddress;
        this.farmerAgmt.DistrictCode = this.allFarmers[ind].districtCode;
        this.farmerAgmt.StateCode = this.allFarmers[ind].stateCode;
        this.farmerAgmt.CountryCode = this.allFarmers[ind].countryCode;
        this.farmerAgmt.FarmersAccountNo = this.allFarmers[ind].alternativeContactPerson;
        this.farmerAgmt.MandalCode = this.allFarmers[ind].mandalCode;
        this.farmerAgmt.MandalName = this.allFarmers[ind].mandalName;
        this.farmerAgmt.VillageCode = this.allFarmers[ind].villageCode;
        this.farmerService.getDistrictDetails(this.farmerAgmt.DistrictCode).subscribe(res => {
          this.farmerAgmt.DistrictName = res.districtName;
        }, error => {
          this.alertService.error('Error in fetching district details!');
        });

        this.farmerService.getCountryDetails(this.farmerAgmt.CountryCode).subscribe(res => {
          this.farmerAgmt.CountryName = res.countryName;
          this.farmerAgmt.StateName = res.states.filter(x => x.stateCode === this.farmerAgmt.StateCode)[0].stateName;
        }, error => {
          this.alertService.error('Error in fetching Country Details!');
        });
        return;
      } else {
        //  this.alertService.error('Account No. is not valid');
        this.accountNumberFound = false;
        return;
      }
    } catch (error) {
      this.accountNumberFound = false;
      return;
    }
  }


  getCropNameCodeList() {
    try {
      this.emptyCropGroupFields();
      this.farmerService.getCropCode(this.farmerAgmt.CropGroupCode).subscribe(res => {
        this.cropNameList = res;
      }, error => {
        this.alertService.error('Error in fetching Crop details!');
      });
    } catch (error) {
    }

  }
  openCropName() {
    // if (this.farmerAgmt.CropNameCode != this.oldCropName) {
    //   this.oldCropName = this.farmerAgmt.CropNameCode;
    // }
  }
  getCropSeason() {
    try {
      if (this.isModifyClicked && this.selectedFruitSizeIndex != null) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to change a crop name?'
        });
        dialogRef.afterClosed().subscribe((res) => {

          if (res) {
            this.farmerAgmt.FarmersAgreementSizes = [];
            this.farmerAgmtSize.CropRatesRemarks = null;
            this.farmerAgmtSize.CropRateAsPerOurAgreement = 0;
            this.farmerAgmtSize.CropRatePerUOM = null;
            this.farmerAgmtSize.CropRateAsPerAssociation = 0;
            this.farmerAgmtSize.CropCount = null;
            this.selectedFruitSizeIndex = null;
            this.farmerAgmtSize = new FarmersAgreementSize();
            this.getSeasonData();
          } else {
            this.farmerAgmt.CropNameCode = this.oldCropName;
          }
        });
      } else {
        this.getSeasonData();
      }

    } catch (error) {
    }
  }

  private getSeasonData() {
    this.emptySeasonFields();
    this.farmerService.getSeasonFromTo(this.farmerAgmt.CropNameCode).subscribe(res => {
      this.seasonList = res;

    }, error => {
      this.alertService.error('Error in fetching Crop details!');
    });
  }



  getFruitSizemm() {
    try {
      this.farmerService.getFruitSize(this.farmerAgmt.PSNumber).subscribe(res => {
        res.forEach(element => {
          element.fruit_size_count = element.cropSchemeFrom + ' ' + element.cropSchemeSign;
        });
        this.fruitSizeList = res;
        if (this.isModifyClicked) {
          this.farmerAgmt.FarmersAgreementSizes.forEach(ele => {
            const ind = this.fruitSizeList.findIndex(x => x.cropSchemeCode === ele.CropSchemeCode);
            if (ind !== this.selectedFruitSizeIndex) {
              this.fruitSizeList.splice(ind, 1);
            }
          });
        }
        // const fruit1 = { cropSchemeCode: 'CSC_45', cropCountMM: 340, cropSchemeFrom: 14, cropSchemeSign: '-' };
        // const fruit2 = { cropSchemeCode: 'CSC_40', cropCountMM: 390, cropSchemeFrom: 18, cropSchemeSign: '+' };
        // this.fruitSizeList.push(fruit1, fruit2);
      }, error => {
        this.alertService.error('Error in fetching Fruit Size');
      });

      if (this.isFindEnabled) {
        this.fetchSearchResults();
      }

    } catch (error) {
    }
  }

  getFruitCount() {
    try {
      const ind = this.fruitSizeList.findIndex(x => x.cropSchemeCode === this.farmerAgmtSize.CropSchemeCode);
      if (ind > -1) {
        this.farmerAgmtSize.CropCount = this.fruitSizeList[ind].cropCountMM;
        this.farmerAgmtSize.CropSchemeFromSign = this.fruitSizeList[ind].fruit_size_count;
        this.farmerAgmtSize.CropSchemeCode = this.fruitSizeList[ind].cropSchemeCode;
        this.farmerService.getCropRates(this.fruitSizeList[ind].cropSchemeCode, this.fruitSizeList[ind].cropCountMM).subscribe(res => {

          if (res) {

            this.farmerAgmtSize.CropRateAsPerAssociation = res.cropRateAsPerAssociation;
            this.farmerAgmtSize.CropRatePerUOM = res.cropRatePerUOM;

          } else {

            this.farmerAgmtSize.CropRateAsPerAssociation = null;
            this.farmerAgmtSize.CropRatePerUOM = 'NA';

          }


        }, error => {
          this.farmerAgmtSize.CropRateAsPerAssociation = null;
          this.farmerAgmtSize.CropRatePerUOM = 'NA';
          this.alertService.error('Error in fetching crop rates !!');
        });
      }
    } catch (error) {
    }

  }


  newAgmt() {
    try {
      this.isUpdate = false;
      this.addNewClicked = true;
      this.isSaved = false;
      this.isSearchResults = false;
      this.isFindEnabled = false;
      this.isFarmer = true;
      this.isVillage = true;
      this.enableSave = true;
      this.enableNew = false;
      this.isEditEnabled = false;
      this.disableFarmerFields = false;
      this.scrollTop();
      this.farmerAgmt = new FarmersAgreement();
      this.farmerAgmtSize = new FarmersAgreementSize();
      this.ngForm.resetForm();
      this.getFarmersAgreementCode();
      this.farmerAgmt.FarmersAgreementDate = new Date();
      this.AreaID.nativeElement.focus();
    } catch (error) {
    }
  }



  saveAgmt() {
    try {

      if (this.addNewClicked) {
        const index = this.farmerAgmt.FarmersAgreementSizes.findIndex(x => x.CropCount === this.farmerAgmtSize.CropCount);

        if (index === -1) {
          const fruitObj = { ...this.farmerAgmtSize };
          this.farmerAgmt.FarmersAgreementSizes.push(fruitObj);
        }

        this.farmerService.saveFarmerAgreement(this.farmerAgmt).subscribe(res => {
          this.isSaved = true;
          this.alertService.success('Farmer Agreement saved successfully. Keep your Agreement Code '
            + this.farmerAgmt.FarmersAgreementCode + ' for reference');
          this.scrollTop();
        }, error => {
          this.alertService.error('Error has occured while saving!');
        });
      } else if (this.isModifyClicked) {

        // const index = this.farmerAgmt.FarmersAgreementSizes.findIndex(x => x.CropCount === this.farmerAgmtSize.CropCount);

        // if (index === -1) {
        //   const fruitObj = { ...this.farmerAgmtSize };
        //   this.farmerAgmt.FarmersAgreementSizes.push(fruitObj);

        // }

        this.farmerService.updateFramerAgreement(this.farmerAgmt).subscribe(res => {
          this.isSaved = true;
          this.alertService.success('Farmer Agreement saved successfully. Keep your Agreement Code '
            + this.farmerAgmt.FarmersAgreementCode + ' for reference');
          this.scrollTop();
        }, error => {
          this.alertService.error('Error has occured while saving!');
        });
      }

      // this.disableButton = true;
      this.enableSave = false;
      this.disableFarmerFields = true;
      this.clrAgmt();

    } catch (error) {
    }

  }

  openPopup(templateForm) {
    try {

      if (templateForm) {
        if (templateForm.valid) {
          $('#continueModal').modal('show');
        }
      }
    } catch (error) {
    }

  }

  addPriceToGrid(num) {
    try {

      if (this.isUpdate && this.selectedFruitSizeIndex != null) {
        //  this.CropCount.focus();
        const agmt = { ...this.farmerAgmtSize };
        this.farmerAgmt.FarmersAgreementSizes[this.selectedFruitSizeIndex].CropRateAsPerOurAgreement = agmt.CropRateAsPerOurAgreement;
        this.farmerAgmtSize = new FarmersAgreementSize();
        this.selectedFruitSizeIndex = null;
        setTimeout(() => {
          this.CropCount.focus();
        });
      } else {
        const farmerSize = { ...this.farmerAgmtSize };

        this.farmerAgmt.FarmersAgreementSizes.push(farmerSize);
        if (num === 1 && this.fruitSizeList.length > 1) {
          this.addMoreFruits = true;
          this.farmerAgmtSize = new FarmersAgreementSize();
          const ind = this.fruitSizeList.findIndex(x => x.cropSchemeCode === farmerSize.CropSchemeCode);
          this.fruitSizeList.splice(ind, 1);
          setTimeout(() => {
            this.CropCount.focus();
          });
        } else {
          this.addMoreFruits = false;
          this.farmerAgmtSize = new FarmersAgreementSize();
        }
      }
      if (num === 0) {
        Object.keys(this.ngForm.controls).forEach(key => {
          this.ngForm.controls[key].markAsPristine();
        });
      }
    } catch (error) {
    }

  }


  findAgmtClicked() {
    try {
      this.isUpdate = false;
      this.enableSearch = true;
      this.farmerAccControl.setValue('');
      this.farmerNameControl.setValue('');
      this.disableFarmerFields = true;
      this.addNewClicked = false;
      this.farmerAgmt.FarmersAgreementDate = new Date();
      this.isFindClicked = true;
      // this.getFarmerAccountList();
      this.selectedFruitSizeIndex = null;
      this.fruitSizetoDelete = null;

      // if (this.ngForm) {
      //   this.disableFarmerFields = false;
      //   // this.ngForm.reset();
      // }
      this.isSaved = false;
      // this.isSearchResults = true;
      this.scrollTop();
      this.farmerAgmt = new FarmersAgreement();
      this.farmerAgmtSize = new FarmersAgreementSize();
      this.cropGroupCode.focus();
      this.enableNew = false;
      this.enableSave = false;
      this.isFindEnabled = false;
      this.isEditEnabled = false;
    } catch (error) {
    }

  }

  fetchSearchResults() {
    try {
      if (this.farmerAgmt.AreaID && this.farmerAgmt.VillageCode && this.farmerAgmt.FarmerCode && this.farmerAgmt.PSNumber) {
        this.farmerService.findFarmerAgreement(this.farmerAgmt).subscribe(res => {
          if (res) {
            this.isSearchResults = true;
            this.disableFarmerFields = true;
            const dName = this.farmerAgmt.DistrictName;
            const stateName = this.farmerAgmt.StateName;
            const countryName = this.farmerAgmt.CountryName;
            // this.farmerAgmt = new FarmersAgreement();
            this.farmerAgmt = res;
            this.farmerAgmt.FarmersAgreementCode = res.FarmersAgreementCode.split('FA_')[1];
            this.farmerAgmtSize = this.farmerAgmt.FarmersAgreementSizes[0];
            this.farmerAgmt.DistrictName = dName;
            this.farmerAgmt.StateName = stateName;
            this.farmerAgmt.CountryName = countryName;


            this.getFruitCount();


          } else {
            this.alertService.error('No results found for the searched parameters');
          }
        }, error => {
          this.alertService.error('Error in fetching Farmer Agreement Details !!');

        });


      } else {

      }
    } catch (error) {
    }
  }

  selectedFruitSize(fruitSize, index) {
    try {
      this.farmerAgmtSize = new FarmersAgreementSize();
      this.farmerAgmtSize = fruitSize;
      this.selectedFruitSizeIndex = index;
    } catch (error) {
    }

  }

  deleteConfirm(fruitSize, index) {

    try {
      if (this.farmerAgmt.FarmersAgreementSizes.length > 1) {

        $('#deleteModal').modal('show');
        this.fruitSizetoDelete = index;

      } else {
        this.alertService.error('There must be atleast one Fruit Size details. !!');
      }
    } catch (error) {
    }
  }

  deleteFarmerAgmtSize() {

    try {
      this.farmerService.deleteFarmersAgreement
        (this.farmerAgmt.FarmersAgreementCode, this.farmerAgmt.FarmersAgreementSizes[this.fruitSizetoDelete].CropSchemeCode).
        subscribe(res => {
          this.farmerAgmt.FarmersAgreementSizes.splice(this.fruitSizetoDelete, 1);
          this.alertService.success('Successfully deleted');
          this.selectedFruitSizeIndex = 0;
          this.farmerAgmtSize = { ...this.farmerAgmt.FarmersAgreementSizes[0] };
          this.fruitSizetoDelete = 0;

        }, error => {
          this.alertService.error('Error in deleting the Fruit Size');
        });

    } catch (error) {
    }

  }


  updateRates() {
    try {
      if (this.isSearchResults) {

        const agmt = { ...this.farmerAgmtSize };
        this.farmerAgmt.FarmersAgreementSizes[this.selectedFruitSizeIndex].CropRateAsPerOurAgreement = agmt.CropRateAsPerOurAgreement;
      }
    } catch (error) {
    }
  }


  modifyAgmt() {
    try {
      this.selectedFruitSizeIndex = null;
      this.selectedSchemeCode = '';
      this.enableSearch = true;
      this.disableFarmerFields = true;
      this.isModifyClicked = true;
      this.addNewClicked = false;
      this.farmerAccControl.setValue('');
      this.farmerAgmt.FarmersAgreementDate = new Date();
      // this.getFarmerAccountList();
      this.enableSave = true;
      this.enableNew = false;
      this.isFindEnabled = false;
      this.isEditEnabled = false;
      this.disableFarmerFields = false;
      this.scrollTop();
      this.cropGroupCode.focus();
      // this.getFarmersAgreementCode();

      // this.farmerService.getAllAreas().subscribe(res => {
      //   this.allAreas = res;
      // });

      // this.farmerService.getCropGroup().subscribe(res => {
      //   this.cropGroup = res;
      // });

    } catch (error) {
    }

  }

  clrAgmt() {
    try {
      this.isUpdate = false;
      this.selectedSchemeCode = '';
      this.enableSearch = false;
      this.farmerAccControl.setValue('');
      this.farmerNameControl.setValue('');
      this.isFindClicked = false;
      this.isModifyClicked = false;
      this.addNewClicked = false;
      this.isSaved = false;
      this.isSearchResults = false;
      this.isFarmer = true;
      this.isVillage = true;
      this.isFindClicked = false;
      this.isModifyClicked = false;
      //  this.enableSave = true;
      //  this.enableNew = false;
      this.isEditEnabled = false;

      this.enableNew = true;
      this.enableSave = false;
      this.isFindEnabled = true;
      this.isEditEnabled = true;



      this.disableFarmerFields = true;
      this.scrollTop();
      this.farmerAgmt = new FarmersAgreement();
      this.farmerAgmtSize = new FarmersAgreementSize();
      this.ngForm.resetForm();
      this.getFarmersAgreementCode();
    } catch (error) {
    }
    this.enableNew = true;
  }


  scrollTop() {
    try {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } catch (error) {
    }
  }




  // ------------ Clearing field details ---------------------------------------------------------------------


  emptyAreaFields() {
    try {
      this.villageList = [];
      if (!this.isFindEnabled) {
        this.farmerAgmt.VillageCode = undefined;
      }
      this.emptyFarmerFields();
    } catch (error) {
    }

  }

  emptyFarmerFields() {

    try {
      this.allFarmers = [];

      if (!this.isFindEnabled) {

        this.farmerAgmt.FarmerCode = undefined;
        this.farmerAgmt.Address = '';
        this.farmerAgmt.DistrictCode = '';
        this.farmerAgmt.DistrictName = '';
        this.farmerAgmt.StateCode = '';
        this.farmerAgmt.StateName = '';
        this.farmerAgmt.CountryCode = '';
        this.farmerAgmt.CountryName = '';
        this.farmerAgmt.FarmersAccountNo = undefined;

      }
    } catch (error) {
    }

  }

  emptyCropGroupFields() {

    try {

      this.cropNameList = [];

      if (!this.isFindEnabled) {
        this.farmerAgmt.CropNameCode = undefined;
      }

      this.emptySeasonFields();
    } catch (error) {
    }

  }

  emptySeasonFields() {
    try {
      this.seasonList = [];
      this.fruitSizeList = [];
      if (!this.isFindEnabled) {
        this.farmerAgmt.PSNumber = undefined;
        this.farmerAgmtSize.CropCount = undefined;
      }

    } catch (error) {
    }

  }

  validateFarmerAccount() {
    try {
      if (this.farmerAgmt.FarmerCode != null && this.farmerAgmt.FarmersAccountNo != null && this.farmerAgmt.PSNumber) {
        this.farmerService.isValidateFarmerAccount(this.farmerAgmt.FarmersAccountNo,
          this.farmerAgmt.FarmerCode, this.farmerAgmt.PSNumber).subscribe(res => {
            this.isAccountNumberValid = res;
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  getFarmerDetailsByAccount(event) {
    try {

      const accNumber = this.farmerAccControl.value;
      this.farmerService.getFarmerDetailsByAccount(accNumber, this.farmerAgmt.PSNumber).subscribe(resp => {
        // this.agriFarmer = resp;
        this.farmerAgmt.FarmersAgreementDate = new Date();
        const data = resp;
        this.farmerService.getFarmersByVillage(data.VillageCode).subscribe(farmerlist => {
          this.allFarmers = farmerlist;
          this.farmerService.getVillageCode(data.AreaID).subscribe(res => {
            this.villageList = res;
            this.farmerService.getFieldStaffWithEmployeeDetails(data.AreaID, 'field staff').subscribe(res1 => {
              this.employeeList = res1;
              const filteredEmpList = this.employeeList.filter(x => x.areaID === data.AreaID
              );
              this.filteredEmployeeList = filteredEmpList;
              this.emptyCropGroupFields();
              this.farmerService.getCropCode(data.CropGroupCode).subscribe(res2 => {
                this.cropNameList = res2;
                this.farmerService.getSeasonFromTo(data.CropNameCode).subscribe(res3 => {
                  this.seasonList = res3;
                  this.farmerAgmt = data;
                  this.farmerAgmt.FarmersAgreementSizes = data.FarmersAgreementSizes;
                  if (this.isFindClicked) {
                    this.disableFarmerFields = true;
                  } else if (this.isModifyClicked) {
                    this.disableFarmerFields = false;
                  }
                  this.isUpdate = true;
                  this.getFruitSizemm();
                });

              });

            });
          });

        });


      });
    } catch (error) {

    }
  }

  onfarmerAggrSelect() {
    this.farmerAgmt.FarmersAgreementDate = new Date();
    const data = this.agriFarmer.filter(a => a.FarmersAgreementCode === this.farmerNameControl.value);
    this.farmerService.getVillageCode(data[0].AreaID).subscribe(res => {
      this.villageList = res;
      this.farmerService.getFieldStaffWithEmployeeDetails(data[0].AreaID, 'field staff').subscribe(res1 => {
        this.employeeList = res1;
        const filteredEmpList = this.employeeList.filter(x => x.areaID === data[0].AreaID
        );
        this.filteredEmployeeList = filteredEmpList;
        this.emptyCropGroupFields();
        this.farmerService.getCropCode(data[0].CropGroupCode).subscribe(res2 => {
          this.cropNameList = res2;
          this.farmerService.getSeasonFromTo(data[0].CropNameCode).subscribe(res3 => {
            this.seasonList = res3;
            this.farmerAgmt = data[0];
            this.farmerAgmt.FarmersAgreementSizes = data[0].FarmersAgreementSizes;
            if (this.isFindClicked) {
              this.disableFarmerFields = true;
            } else if (this.isModifyClicked) {
              this.disableFarmerFields = false;
            }
          });

        });

      });

    });
  }

  ontableItemSelect(item, index) {
    //Object.assign(this.oldCropName, this.farmerAgmt.CropNameCode);
    this.oldCropName = JSON.parse(JSON.stringify(this.farmerAgmt.CropNameCode));
    this.farmerAgmtSize = new FarmersAgreementSize();
    this.farmerAgmtSize = item;
    this.selectedSchemeCode = item.CropSchemeCode;
    this.selectedFruitSizeIndex = index;
    this.farmerService.getFruitSize(this.farmerAgmt.PSNumber).subscribe(res => {
      this.fruitSizeList = res;

      this.farmerAgmt.FarmersAgreementSizes.forEach(ele => {
        if (ele.CropSchemeCode !== this.selectedSchemeCode) {
          this.fruitSizeList = this.fruitSizeList.filter(a => a.cropSchemeCode !== ele.CropSchemeCode);
        }
      });

      res.forEach(element => {
        element.fruit_size_count = element.cropSchemeFrom + ' ' + element.cropSchemeSign;

      });
      this.farmerAgmtSize.CropSchemeCode = item.CropSchemeCode;
      this.farmerAgmtSize.CropSchemeFromSign = item.fruit_size_count;
      this.farmerAgmtSize.CropCount = item.CropCount;
      this.farmerAgmtSize.CropRateAsPerAssociation = item.CropRateAsPerAssociation;
      this.farmerAgmtSize.CropRatePerUOM = item.CropRatePerUOM;
      this.farmerAgmtSize.CropRateAsPerOurAgreement = item.CropRateAsPerOurAgreement;
      this.farmerAgmtSize.CropRatesRemarks = item.CropRatesRemarks;
      this.getFruitCount();
    });
  }

  public convertToUpperCase(input: HTMLInputElement, val: string) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    setTimeout(() => {
      input.setSelectionRange(start, end);
    });
    return val.toUpperCase();
  }
}

