import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { inherits } from 'util';
import moment from 'moment';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MatSelect, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';
import { FarmerInputRatesSeasonWiseService } from './farmer-input-rates-season-wise.service';
import { FarmersInputsAreaDetail, FarmersInputsIssueRatesMaster, FarmersInputsMaterialRate } from './farmer-input-rates-season-wise.model';


@Component({
  selector: 'app-farmers-input-rates-season-wise',
  templateUrl: './farmers-input-rates-season-wise.component.html',
  styleUrls: ['./farmers-input-rates-season-wise.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: GHERKIN_DATE_FORMATS },
  ],
})

export class FarmersInputRatesSeasonWiseComponent implements OnInit {
  loggedInUser: any;
  @ViewChild('dateOfEntry', { static: false }) dateOfEntry: ElementRef;
  @ViewChild('effectiveDate', { static: false }) effectiveDate: ElementRef;


  ddlApprovedBy: any = [];
  ddlCroupGroup: any = [];
  ddlCroupName: any = [];
  ddlSeasonFromTo: any = [];
  ddlCountry: any = [];
  ddlState: any = [];
  Areas: any = [];
  Materials: any = [];
  // ddlCountry: any = [];
  FarmersInputsIssueRatesMaster = new FarmersInputsIssueRatesMaster();


  FarmerInputRatesSeasonWiseForm = new FormGroup({
    LoginUserName: new FormControl('', [Validators.required]),
    DateOfEntry: new FormControl('', [Validators.required]),
    ApprovedBy: new FormControl('', [Validators.required]),
    CroupGroup: new FormControl('', [Validators.required]),
    CroupName: new FormControl('', [Validators.required]),
    SeasonFromTo: new FormControl('', [Validators.required]),
    EffectiveDate: new FormControl('', [Validators.required]),
    Country: new FormControl('', [Validators.required]),
    State: new FormControl('', [Validators.required]),
    // MaterialGroup: new FormControl('', [Validators.required]),
    // MaxLimit: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    // EmployerContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{0,2})$|^\d{0,2}$/)]),
    // EmployeeContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{0,2})$|^\d{0,2}$/)]),
    // TotalContribution: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{0,2})$|^\d{0,2}$/)]),
  });
  selectedCountry: any;
  selectedState: any;
  AreaMin = 0;
  AreaMax = 10;
  MaterialMin = 0;
  MaterialMax = 10;

  disableSave = true;
  disableNew = false;
  disableFind = false;
  disableModify = false;
  areaList: FarmersInputsAreaDetail[];
  materialList: FarmersInputsMaterialRate[];
  findMode: boolean;
  modifyMode: boolean;
  submitted: boolean;

  constructor(private authService: AuthenticationService, private FIRSWService: FarmerInputRatesSeasonWiseService,
    // tslint:disable-next-line: align
    private alertService: AlertService, private el: ElementRef) {
    this.loggedInUser = this.authService.getUserdetails();
  }

  ngOnInit() {
    this.FarmerInputRatesSeasonWiseForm.disable();

  }

  OnInIt(): void {
    this.FarmerInputRatesSeasonWiseForm.enable();
    this.FarmerInputRatesSeasonWiseForm.controls.LoginUserName.setValue(this.loggedInUser.userName);
    this.FarmersInputsIssueRatesMaster.fiRateEnteredByEmployeeID = this.loggedInUser.employeeId;
    this.FIRSWService.getEmployeeDetail(this.loggedInUser.employeeId).subscribe(x => {
      if (x) {
        this.FIRSWService.getEmployeesByDeptCode(x.departmentCode).subscribe((a: any) => {
          if (a.IsSucceed && a.Data && a.Data.length > 0) {
            this.ddlApprovedBy = a.Data;
          }
        }, err => {
          this.alertService.error('Error has occured while fetching Employee by Department code.');
        });
      }
    }, err => {
      this.alertService.error('Error has occured while fetching Employee Details.');
    });

    this.FIRSWService.GetAllCropGroup().subscribe(x => {
      if (x) {
        this.ddlCroupGroup = x;
      }
    }, err => {
      this.alertService.error('Error has occured while fetching Crop Group.');
    });

    this.FIRSWService.getAllCountries().subscribe(x => {
      if (x) {
        this.ddlCountry = x;
      }
    }, err => {
      this.alertService.error('Error has occured while fetching Country.');
    });

    this.FIRSWService.getMaterials().subscribe(x => {
      if (x) {
        this.Materials = x;
      }
    }, err => {
      this.alertService.error('Error has occured while fetching Country.');
    });
  }

  changeApprovedBy($event) {
    this.FarmersInputsIssueRatesMaster.cropRateApprovedByEmployeeID = $event.value;
  }
  changeCroupGroup($event) {
    this.FarmersInputsIssueRatesMaster.cropGroupCode = $event.value;
    this.FIRSWService.GetCropNameByGroup($event.value).subscribe(x => {
      if (x) {
        this.ddlCroupName = x;
        this.ddlSeasonFromTo = [];
        this.selectedState = null;
        this.Areas = [];
      }
    }, err => {
      this.alertService.error('Error has occured while fetching Crop Name.');
    });
  }
  changeCroupName($event) {
    this.FarmersInputsIssueRatesMaster.cropNameCode = $event.value;
    this.FIRSWService.GetSeasonFromTo($event.value).subscribe(x => {
      if (x) {
        this.ddlSeasonFromTo = x;
        this.selectedState = null;
        this.Areas = [];
      }
    }, err => {
      this.alertService.error('Error has occured while fetching Season From/To.');
    });

  }
  changeSeasonFromTo($event) {
    this.FarmersInputsIssueRatesMaster.psNumber = $event.value;
    if (!(this.findMode || this.modifyMode)) {
      this.FIRSWService.getAreas($event.value).subscribe(x => {
        if (x) {
          this.Areas = x;
          this.selectedState = null;
        }
      }, err => {
        this.alertService.error('Error has occured while fetching Areas by Season.');
      });
    } else {
      this.FIRSWService.getAllArea().subscribe(x => {
        if (x) {
          this.Areas = x;
          this.selectedState = null;
        }
      }, err => {
        this.alertService.error('Error has occured while fetching All Areas.');
      });
    }
  }
  changeCountry($event) {
    if ($event) {
      this.FarmersInputsIssueRatesMaster.countryCode = $event.value.countryCode;
      this.selectedCountry = $event.value.countryName;
      this.selectedState = null;
      this.FIRSWService.getSates($event.value.countryCode).subscribe(x => {
        if (x) {
          this.ddlState = x;
        }
      }, err => {
        this.alertService.error('Error has occured while fetching State.');
      });
      // if (this.findMode || this.modifyMode) {
      //   this.FIRSWService.FindStatesbyCropSeason(this.FarmersInputsIssueRatesMaster.countryCode,
      //     this.FarmersInputsIssueRatesMaster.cropGroupCode, this.FarmersInputsIssueRatesMaster.cropNameCode,
      //     this.FarmersInputsIssueRatesMaster.psNumber).subscribe(x => {
      //       if (x) {
      //         this.ddlState = x;
      //         this.selectedState = null;
      //       }
      //     }, err => {
      //       this.alertService.error('Error has occured while fetching States.');
      //     });
      // } else {
      //   this.FIRSWService.GetStatesbyCropSeason(this.FarmersInputsIssueRatesMaster.countryCode,
      //     this.FarmersInputsIssueRatesMaster.cropGroupCode, this.FarmersInputsIssueRatesMaster.cropNameCode,
      //     this.FarmersInputsIssueRatesMaster.psNumber).subscribe(x => {
      //       if (x) {
      //         this.ddlState = x;
      //         this.selectedState = null;
      //       }
      //     }, err => {
      //       this.alertService.error('Error has occured while fetching States.');
      //     });
      // }
    }
  }
  changeState($event) {
    if ($event) {
      this.selectedState = $event.value.stateName;
      this.Areas.map(x => x.isSelected = false);
      this.Materials.map(x => x.applicableRate = null);
      this.FarmersInputsIssueRatesMaster.stateCode = $event.value.stateCode;
      if (this.findMode || this.modifyMode) {
        if (this.modifyMode) {
          this.disableSave = false;
        }
        this.FIRSWService.GetFarmerInputRateSeason(this.FarmersInputsIssueRatesMaster.countryCode,
          this.FarmersInputsIssueRatesMaster.cropGroupCode, this.FarmersInputsIssueRatesMaster.cropNameCode,
          this.FarmersInputsIssueRatesMaster.psNumber, this.FarmersInputsIssueRatesMaster.stateCode).subscribe((x: any) => {
            if (x) {
              console.log(x);
              this.FarmersInputsIssueRatesMaster.fiRatePassingNo = x.fiRatePassingNo;
              this.FarmersInputsIssueRatesMaster.countryCode = x.countryCode;
              this.FarmersInputsIssueRatesMaster.cropGroupCode = x.cropGroupCode;
              this.FarmersInputsIssueRatesMaster.cropNameCode = x.cropNameCode;
              this.FarmersInputsIssueRatesMaster.cropRateApprovedByEmployeeID = x.cropRateApprovedByEmployeeID;
              this.FarmersInputsIssueRatesMaster.cropRateEffectiveDate = x.cropRateEffectiveDate;
              this.FarmersInputsIssueRatesMaster.fiRateEnteredByEmployeeID = x.fiRateEnteredByEmployeeID;
              this.FarmersInputsIssueRatesMaster.fiRatesEntryDate = x.fiRatesEntryDate;
              this.FarmersInputsIssueRatesMaster.psNumber = x.psNumber;
              this.FarmersInputsIssueRatesMaster.stateCode = x.stateCode;
              this.FarmersInputsIssueRatesMaster.FarmersInputsAreaDetails = x.FarmersInputsAreaDetails;
              this.FarmersInputsIssueRatesMaster.FarmersInputsMaterialRates = x.FarmersInputsMaterialRates;

              this.FarmerInputRatesSeasonWiseForm.controls.ApprovedBy.setValue
                (this.FarmersInputsIssueRatesMaster.cropRateApprovedByEmployeeID);
              this.FarmerInputRatesSeasonWiseForm.controls.EffectiveDate.setValue(this.FarmersInputsIssueRatesMaster.cropRateEffectiveDate);
              this.FarmerInputRatesSeasonWiseForm.controls.DateOfEntry.setValue(this.FarmersInputsIssueRatesMaster.fiRatesEntryDate);

              if (this.FarmersInputsIssueRatesMaster.FarmersInputsAreaDetails) {
                for (const i in this.FarmersInputsIssueRatesMaster.FarmersInputsAreaDetails) {
                  if (Array.isArray(this.Areas)) {
                    const areaIndex = this.Areas.findIndex(b => b.areaId ===
                      this.FarmersInputsIssueRatesMaster.FarmersInputsAreaDetails[i].areaID);
                    if (areaIndex !== -1) {
                      this.Areas[areaIndex].isSelected = true;
                    }
                  }
                }
              }
              if (this.FarmersInputsIssueRatesMaster.FarmersInputsMaterialRates) {
                for (const i in this.FarmersInputsIssueRatesMaster.FarmersInputsMaterialRates) {
                  if (Array.isArray(this.Materials)) {
                    const materialIndex = this.Materials.findIndex(a => a.rawMaterialDetailsCode ===
                      this.FarmersInputsIssueRatesMaster.FarmersInputsMaterialRates[i].rawMaterialDetailsCode);
                    if (materialIndex !== -1) {
                      this.Materials[materialIndex].applicableRate =
                        this.FarmersInputsIssueRatesMaster.FarmersInputsMaterialRates[i].farmerMaterialRate;
                    }
                  }
                }
              }
            }
          }, err => {
            this.alertService.error('Error has occured while fetching Farmers Inputs Issue Rates Master.');
          });
      } else {
        this.FIRSWService.searchAreaByStateCode($event.value.stateCode).subscribe(x => {
          if (x) {
            console.log('searchAreaByStateCode');
            console.log(x);
            this.Areas = x;
          }
        }, err => {
          this.alertService.error('Error has occured while fetching State.');
        });
      }
    }
  }
  changeMaterialGroup($event) {

  }

  AreaPaginate(e) {
    this.AreaMin = (+e.first);
    this.AreaMax = (+e.first + +e.rows);
  }
  MaterialPaginate(e) {
    this.MaterialMin = (+e.first);
    this.MaterialMax = (+e.first + +e.rows);
  }


  newFarmerMaterialRates() {
    this.clear();
    this.FarmerInputRatesSeasonWiseForm.enable();
    this.FarmerInputRatesSeasonWiseForm.controls.DateOfEntry.setValue(new Date());
    this.OnInIt();
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="DateOfEntry"]').focus();
    }, 100);
    this.disableSave = false;
    this.disableNew = true;
    this.disableFind = true;
    this.disableModify = true;
  }

  save() {
    try {
      this.submitted = true;
      this.FarmersInputsIssueRatesMaster.fiRatesEntryDate = this.FarmerInputRatesSeasonWiseForm.controls.DateOfEntry.value;
      this.FarmersInputsIssueRatesMaster.cropRateEffectiveDate = this.FarmerInputRatesSeasonWiseForm.controls.EffectiveDate.value;
      this.areaList = new Array<FarmersInputsAreaDetail>();
      this.materialList = new Array<FarmersInputsMaterialRate>();

      for (const item of this.Areas) {
        if (item.isSelected) {
          const area = new FarmersInputsAreaDetail();
          area.areaID = item.areaId;
          area.psNumber = this.FarmersInputsIssueRatesMaster.psNumber;
          this.areaList.push(area);
        }
      }

      for (const item of this.Materials) {
        if (item.applicableRate) {
          const materialDetails = new FarmersInputsMaterialRate();
          materialDetails.farmerMaterialRate = item.applicableRate;
          materialDetails.rawMaterialDetailsCode = item.rawMaterialDetailsCode;
          materialDetails.rawMaterialGroupCode = item.rawMaterialGroupCode;
          materialDetails.rawMaterialUOM = item.rawMaterialUOM;
          this.materialList.push(materialDetails);
        }
      }
      this.FarmersInputsIssueRatesMaster.FarmersInputsAreaDetails = this.areaList;
      this.FarmersInputsIssueRatesMaster.FarmersInputsMaterialRates = this.materialList;
      console.log(this.FarmersInputsIssueRatesMaster);

      if (this.modifyMode) {
        this.FIRSWService.UpdateFarmersInputRatesSeasonWise(this.FarmersInputsIssueRatesMaster).subscribe(x => {
          if (x) {
            this.alertService.success('Material Rates Saved Successfully');
            this.clear();
          }
        }, err => {
          this.alertService.error('Error has occured while update Adding Farmer Input Rates SeasonWise.');
        });
      } else {
        this.FIRSWService.CreateFarmersInputRatesSeasonWise(this.FarmersInputsIssueRatesMaster).subscribe(x => {
          if (x) {
            this.alertService.success('"Material Rates Updated Successfully');
            this.clear();
          }
        }, err => {
          this.alertService.error('Error has occured while adding Adding Farmer Input Rates SeasonWise.');
        });
      }

    } catch (error) {

    }
  }

  find() {
    this.clear();
    this.submitted = false;
    this.OnInIt();
    this.FarmerInputRatesSeasonWiseForm.controls.DateOfEntry.disable();
    this.FarmerInputRatesSeasonWiseForm.controls.ApprovedBy.disable();
    this.FarmerInputRatesSeasonWiseForm.controls.EffectiveDate.disable();
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="CroupGroup"]').focus();
    }, 100);
    this.findMode = true;
    this.disableSave = true;
    this.disableNew = true;
    this.disableFind = true;
    this.disableModify = true;
  }

  modify() {
    this.clear();
    this.submitted = false;
    this.findMode = false;
    this.OnInIt();
    this.modifyMode = true;
    this.disableNew = true;
    this.disableFind = true;
    this.disableModify = true;
    this.FarmerInputRatesSeasonWiseForm.controls.DateOfEntry.disable();
    this.FarmerInputRatesSeasonWiseForm.controls.ApprovedBy.disable();
    this.FarmerInputRatesSeasonWiseForm.controls.EffectiveDate.disable();
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="CroupGroup"]').focus();
    }, 100);

  }
  clear() {
    this.submitted = false;
    this.FarmerInputRatesSeasonWiseForm.reset();
    this.FarmerInputRatesSeasonWiseForm.disable();
    this.ddlApprovedBy = [];
    this.ddlCroupGroup = [];
    this.ddlCroupName = [];
    this.ddlSeasonFromTo = [];
    this.ddlCountry = [];
    this.ddlState = [];
    this.Areas = [];
    this.Materials = [];
    this.selectedCountry = '';
    this.selectedState = '';
    this.AreaMin = 0;
    this.AreaMax = 10;
    this.MaterialMin = 0;
    this.MaterialMax = 10;
    this.disableSave = true;
    this.disableNew = false;
    this.disableFind = false;
    this.modifyMode = false;
    this.findMode = false;
    this.disableModify = false;

  }
}
