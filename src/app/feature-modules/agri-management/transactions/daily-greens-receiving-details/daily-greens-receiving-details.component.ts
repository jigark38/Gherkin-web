import { AlertService } from '../../../../corecomponents/alert/alert.service';
import { ModalService } from '../../../../corecomponents/modal/modal.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, Pipe, PipeTransform } from '@angular/core';
import { MatSelect, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';
import { DailyGreensReceivingDetailService } from './daily-greens-receiving-details.service';
import { Observable, concat, forkJoin } from 'rxjs';
import { map, debounceTime, tap, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
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
export class WeightDetails {
  static slNo: number;
  slNo: number;
  cropCount: string;
  noOfCrate: number;
  eachTare: number;
  creatFromNo: number;
  creatToNo: number;
  grossWt: number;
  tareWt: number;
  netWt: number;
  cropCountInfo: string;
  greensProcurementNo: number;
  farmerCode: string;
  isDisabled: boolean;
  Id: number;
  cropSchemeDisabled: boolean;
  farmerName: string;
  villageCode: string;
  villageName: string;
}

export class CropCount {
  greensProcurementNo: number;
  cropSchemeCode: string;
  totalNoOfCrates = 0;
  totalFarmerHarvestQuantity = 0;
  Id = 0;
}

declare var $: any;

@Component({
  selector: 'app-daily-greens-receiving-details',
  templateUrl: './daily-greens-receiving-details.component.html',
  styleUrls: ['./daily-greens-receiving-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DailyGreensReceivingDetailsComponent implements OnInit {
  formStatus = {
    IsFind: null,
    IsModify: null,
    IsNew: true
  };
  famerCropSchemeRadio = null;
  buyerScheduleDetail = [];
  dailyGreensReceivingDetailsForm: FormGroup;
  cropGroupList = [];
  cropNameList = [];
  seasonList = [];
  farmerNameList = [];
  villageList = [];
  employeeList = [];
  cropSchemeList = [];
  cropSchemeListFromFarmerList = [];
  areadId;
  keyword = 'name';
  farmerKeyword = 'farmerName';
  weightDetailsList: WeightDetails[] = [];
  countWeightDetailsList: WeightDetails[] = [];
  totalNoOfCrate = 0;
  totalGrossWt = 0;
  totalTareWt = 0;
  totalNetWt = 0;
  weightDetails;
  farmerDetailsList = [];
  farmerWiseSummary = [];
  quantityCountWiseList = [];
  farmerAcNo;
  selectedBuyer;
  greensProcurementNo;
  dailyGreensReceivingSummaryForm: FormGroup;
  totalQuantityValue = 0;
  totalCrateValue = 0;
  selectedFramerList = [];
  locationList = [];
  selectedTab = 'discuss';
  disableField: boolean;
  @ViewChild('dateofEntry', { static: false }) dateofEntry: ElementRef;
  @ViewChild('continueBtn', { static: false }) continueBtn: ElementRef;
  @ViewChild('autoHighlight', { static: false }) autoHighlight: MatSelect;
  @ViewChild('villageData', { static: false }) villageData: ElementRef;
  @ViewChildren('autoHighlight') autoHighlights: any;
  @ViewChildren('selectedBuyerElem') selectedBuyerElems: any;
  autoHighlightElements: any;
  selectedBuyerElements: any;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dailyGreensReceivingDetailService: DailyGreensReceivingDetailService,
    private modalService: ModalService,
    private readonly alertSerice: AlertService, private dialog: MatDialog) { }

  ngOnInit() {
    // $('#AddMoreData').modal('show');
    this.formCreation();
    this.getCropGroup();
    this.getAllEmployee();
    this.buyerScheduleData();
    this.summaryformCreation();
    // this.areadId = "CAC_9";
    // this.getVillageCode(this.areadId);
    this.disableField = true;
  }

  clearCascade(a) {

  }

  buyerScheduleData() {
    this.buyerScheduleDetail = [];
    this.dailyGreensReceivingDetailService.getBuyerSchedules().subscribe((res: any) => {
      // console.log('res', res);
      res.forEach(element => {
        element.slNo = this.buyerScheduleDetail.length + 1;
        this.buyerScheduleDetail.push(element);
      });
      setTimeout(() => this.mapBuyerElements(), 0);
      // this.buyerScheduleDetail = res;
    },
      error => {
        // console.log('error', error);
      });
  }
  onTabChange(event) {
    if (event === 1) {
      // this.summaryformCreation();
      this.selectedTab = 'Summary';
      this.prepareFarmerWiseSummaryGrid();
    } else {
      this.selectedTab = 'discuss';
    }
  }
  selectedFarmer(event) {
    this.famerCropSchemeRadio = null;
    this.farmerAcNo = event.target.value;
    const weightDetailsList = this.countWeightDetailsList.filter((x) => {
      return x.farmerCode === event.target.value;
    });
    // this.weightDetailsList = weightDetailsList;
    const farmerDetail = this.farmerDetailsList.filter((x) => {
      return x.farmerCode === event.target.value;
    });
    this.dailyGreensReceivingDetailsForm.controls.cropName.setValue(farmerDetail[0].cropNameCode);
    this.dailyGreensReceivingDetailsForm.controls.seasonFrom.setValue(farmerDetail[0].pSNumber);
    this.dailyGreensReceivingDetailsForm.controls.lastHarvest.setValue(farmerDetail[0].lastHarvestStatus);
    this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.setValue(farmerDetail[0].farmerAcNo);
    this.dailyGreensReceivingDetailsForm.controls.farmerName.setValue(farmerDetail[0].farmerName);
    this.dailyGreensReceivingDetailsForm.controls.village.setValue(weightDetailsList[0].villageName);
    this.dailyGreensReceivingDetailsForm.disable();
    this.dailyGreensReceivingDetailsForm.controls.cropName.enable();
    if (this.formStatus.IsModify) {
      this.dailyGreensReceivingDetailsForm.controls.seasonFrom.enable();
    }
    this.selectedTab = 'discuss';
  }
  slectedItem(event) {
    this.buyerScheduleDetail.forEach(element => {
      // tslint:disable-next-line: radix
      if (element.despNo === parseInt(event.target.value)) {
        this.selectedBuyer = element;
        this.farmerAcNo = null;
        this.farmerDetailsList = [];
        this.weightDetailsList = [];
        this.greensProcurementNo = null;
        this.farmerWiseSummary = [];
        this.quantityCountWiseList = [];
        this.dailyGreensReceivingDetailsForm.reset();
        this.dailyGreensReceivingDetailsForm.controls.weighmentMode.setValue('Manual');
        this.dailyGreensReceivingDetailsForm.controls.lastHarvest.setValue('No');
        this.dailyGreensReceivingDetailService.GetGreensProcurementByDespNo(element.despNo).subscribe((res: any) => {
          if (res) {
            this.dailyGreensReceivingDetailsForm.disable();
            // this.dailyGreensReceivingDetailsForm.controls.area.disable();
            // this.dailyGreensReceivingDetailsForm.controls.cropGroup.disable();
            this.greensProcurementNo = res.greensProcurementNo;
            this.dailyGreensReceivingDetailsForm.controls.harvestDate.setValue(res.harvestDate);
            this.dailyGreensReceivingDetailsForm.controls.area.setValue(element.area);
            this.dailyGreensReceivingDetailsForm.controls.cropGroup.setValue(res.cropGroupCode);
            // this.dailyGreensReceivingDetailsForm.controls.cropName.setValue(res.cropNameCode);
            // this.dailyGreensReceivingDetailsForm.controls.seasonFrom.setValue(res.pSNumber);
            if (res.buyingAsst1EmployeeID) {
              this.dailyGreensReceivingDetailsForm.controls.buyingAssistant.setValue(res.buyingAsst1EmployeeID.toString());
            }
            if (res.buyingAsst2EmployeeID) {
              this.dailyGreensReceivingDetailsForm.controls.buyingAssistant2.setValue(res.buyingAsst2EmployeeID.toString());
            }
            this.dailyGreensReceivingDetailsForm.controls.weighmentMode.setValue(res.weighmentMode);
            this.dailyGreensReceivingSummaryForm.controls.endDateTime.setValue(res.harvestEndingTime);
            this.dailyGreensReceivingSummaryForm.controls.endingReading.setValue(res.harvestEndingKMS);
            this.dailyGreensReceivingSummaryForm.controls.timeDuration.setValue(res.harvestTimeDuration);
            this.dailyGreensReceivingSummaryForm.controls.noOfKms.setValue(res.haverstKMSTotalReading);
            this.dailyGreensReceivingSummaryForm.controls.otherCharges.setValue(res.harvestOtherCharges);
            this.dailyGreensReceivingSummaryForm.controls.totalCrates.setValue(res.tripTotalCrates);
            this.dailyGreensReceivingSummaryForm.controls.totalQuantity.setValue(res.tripTotalQuantity);
            this.dailyGreensReceivingSummaryForm.controls.vehicleEndPoint.setValue(res.vehicleEndPoint);
            this.dailyGreensReceivingSummaryForm.controls.location.setValue(res.locationAreaID);
            if (this.formStatus.IsNew || this.formStatus.IsModify) {
              this.dailyGreensReceivingDetailsForm.controls.cropName.enable();
              this.dailyGreensReceivingDetailsForm.controls.seasonFrom.enable();
              this.dailyGreensReceivingDetailsForm.controls.village.enable();
              this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.enable();
              this.dailyGreensReceivingDetailsForm.controls.farmerName.enable();
              this.dailyGreensReceivingDetailsForm.controls.lastHarvest.enable();
              if (this.formStatus.IsModify) {
                this.dailyGreensReceivingDetailsForm.controls.harvestDate.enable();
                this.dailyGreensReceivingDetailsForm.controls.buyingAssistant.enable();
                this.dailyGreensReceivingDetailsForm.controls.buyingAssistant2.enable();
                this.dailyGreensReceivingDetailsForm.controls.weighmentMode.enable();
              }
            }
            forkJoin(
              this.getFarmerWiseDetail(res.greensProcurementNo),
              this.getCrateWiseDetail(res.greensProcurementNo)).subscribe(() => {
                if (this.formStatus.IsModify || this.formStatus.IsFind) {
                  this.prepareFarmerWiseSummaryGrid();
                  this.selectedTab = 'Summary';
                }
              });
          } else {
            this.dailyGreensReceivingDetailsForm.enable();
            this.dailyGreensReceivingDetailsForm.controls.area.setValue(element.area);
            this.dailyGreensReceivingDetailsForm.controls.area.disable();
            this.dailyGreensReceivingDetailsForm.controls.harvestDate.setValue(new Date());
          }
          this.areadId = element.areaId;
          this.getVillageCode(this.areadId);
          setTimeout(() => this.dateofEntry.nativeElement.focus(), 0);
        },
          error => {
            // console.log('error', error);
            this.alertSerice.error('Error fetching procurement details info');
          });
      } else {
        this.dailyGreensReceivingDetailsForm.controls.harvestDate.setValue(new Date());
      }
    });
  }
  getCropCountInfo(cropSchemeCode) {
    let info = '';
    const infoDetail = this.cropSchemeList.filter(x => x.code === cropSchemeCode);
    if (infoDetail && infoDetail.length > 0) {
      info = infoDetail[0].From + ' ' + infoDetail[0].Sign + ' / ' + infoDetail[0].Count;
    }
    return info;
  }
  getFarmerWiseDetail(greensProcurementNo) {
    return new Observable((obs) => {
      this.dailyGreensReceivingDetailService.GetGreensFarmersDetails(greensProcurementNo).subscribe((res: any) => {
        this.farmerDetailsList = [];
        if (res && res.length > 0) {
          res.forEach(element => {
            const farmerDetail = {
              slNo: this.farmerDetailsList.length + 1,
              farmerAcNo: element.farmerAccountNumber,
              farmerCode: element.farmerCode,
              farmerName: element.farmerName,
              cropCountInfo: element.cropSchemeInfo,
              cropCount: element.cropSchemeCode,
              totalCrate: element.countwiseTotalCrates,
              totalQuantity: element.countwiseTotalQuantity,
              greensProcurementNo: element.greensProcurementNo,
              lastHarvestStatus: element.lastHarvestStatus,
              Id: element.greensFarmersEntryNo,
              cropGroupCode: element.cropGroupCode,
              cropNameCode: element.cropNameCode,
              pSNumber: element.pSNumber,
            };
            this.farmerDetailsList.push(farmerDetail);
          });
        } else {
          // this.dailyGreensReceivingDetailsForm.controls.area.enable();
          this.dailyGreensReceivingDetailsForm.controls.cropGroup.enable();
          this.dailyGreensReceivingDetailsForm.controls.cropName.enable();
          this.dailyGreensReceivingDetailsForm.controls.seasonFrom.enable();
        }
        obs.next();
        obs.complete();
      },
        error => {
          // console.log('error', error);
          this.alertSerice.error('Error fetching farmer data info');
          obs.error();
        });
    });
  }

  getCrateWiseDetail(greensProcurementNo) {
    return new Observable((obs) => {

      this.countWeightDetailsList = [];
      this.dailyGreensReceivingDetailService.GetDailyGreensQuantityCrateWiseDetails(greensProcurementNo).subscribe((res: any) => {
        if (res) {
          res.forEach(element => {
            const weightDetailData: WeightDetails = new WeightDetails();
            weightDetailData.slNo = this.countWeightDetailsList.length + 1;
            weightDetailData.cropCount = element.cropSchemeCode;
            weightDetailData.noOfCrate = element.noOfCrates;
            weightDetailData.cropCountInfo = this.getCropCountInfo(element.cropSchemeCode);
            weightDetailData.farmerCode = element.farmerCode;
            weightDetailData.greensProcurementNo = element.greensProcurementNo;
            weightDetailData.Id = element.greensCratewiseEntryNo;
            if (this.formStatus.IsModify) {
              weightDetailData.isDisabled = false;
            } else {
              weightDetailData.isDisabled = true;
            }
            weightDetailData.eachTare = element.eachCrateWt;
            weightDetailData.creatFromNo = element.crateNoFrom;
            weightDetailData.creatToNo = element.crateNoTo;
            weightDetailData.grossWt = element.grossWeight;
            weightDetailData.tareWt = element.tareweight;
            weightDetailData.netWt = element.crateswiseNetWeight;
            weightDetailData.cropSchemeDisabled = true;
            weightDetailData.farmerName = element.farmerName;
            weightDetailData.villageCode = element.villageCode;
            weightDetailData.villageName = element.villageName;
            this.countWeightDetailsList.push(weightDetailData);
          });
        }
        obs.next();
        obs.complete();
      },
        error => {
          // console.log('error', error);
          this.alertSerice.error('Error fetching crate wise info');
          obs.error();
        });
    });
  }

  getQuantityCountWiseDetail(greensProcurementNo) {
    this.dailyGreensReceivingDetailService.GetGreensQuantityCountWiseDetails(greensProcurementNo).subscribe((res: any) => {
      this.quantityCountWiseList = [];
      if (res) {
        let countwiseDetail: CropCount;
        countwiseDetail = new CropCount();
        countwiseDetail.Id = res.greensQuantityEntryNo;
        countwiseDetail.greensProcurementNo = res.greensProcurementNo;
        countwiseDetail.cropSchemeCode = res.cropSchemeCode;
        countwiseDetail.totalFarmerHarvestQuantity = res.totalFarmerHarvestQuantity;
        countwiseDetail.totalNoOfCrates = res.totalNoOfCrates;
        this.quantityCountWiseList.push(countwiseDetail);
      }
    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('Error fetching quantity count wise info');
      });
  }

  formCreation() {
    try {
      this.dailyGreensReceivingDetailsForm = this.formBuilder.group({
        harvestDate: [
          '',
          [Validators.required]
        ],
        area: ['', [Validators.required]],
        cropGroup: ['', [Validators.required]],
        cropName: ['', [Validators.required]],
        seasonFrom: ['', [Validators.required]],
        buyingAssistant: ['', []],
        buyingAssistant2: ['', []],
        weighmentMode: ['Manual', [Validators.required]],
        village: ['', [Validators.required]],
        farmerNameAcNo: ['', [Validators.required]],
        farmerName: ['', [Validators.required]],
        lastHarvest: ['No', [Validators.required]]
      });
      this.dailyGreensReceivingDetailsForm.disable();
      this.dailyGreensReceivingDetailsForm.controls.area.disable();
    } catch (error) {
      // console.log('form creation error', error);
    }
  }

  summaryformCreation() {
    try {
      this.dailyGreensReceivingSummaryForm = this.formBuilder.group({
        areainfo: [
          '',
          [Validators.required]
        ],
        buyingSupervisor: ['', [Validators.required]],
        totalQuantity: ['', [Validators.required]],
        endDateTime: ['', [Validators.required]],
        endingReading: ['', [Validators.required, Validators.pattern(/^[0-9]{0,7}$/)]],
        totalCrates: ['', [Validators.required]],
        timeDuration: ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
        noOfKms: ['', [Validators.required, Validators.pattern(/^[0-9]{0,5}$/)]],
        otherCharges: ['', [Validators.required, Validators.pattern(/^[0-9]{0,6}$/)]],
        vehicleEndPoint: ['', [Validators.required]],
        location: ['']
      });
      this.dailyGreensReceivingSummaryForm.get('vehicleEndPoint').valueChanges.subscribe(
        (validateBy: string) => {
          if (validateBy === 'UNIT' || validateBy === 'Area Branch') {
            this.dailyGreensReceivingSummaryForm.get('location').setValidators([Validators.required]);
            this.dailyGreensReceivingSummaryForm.get('location').updateValueAndValidity();
          } else {
            this.dailyGreensReceivingSummaryForm.get('location').clearValidators();
            this.dailyGreensReceivingSummaryForm.get('location').updateValueAndValidity();
          }
        }
      );
      this.dailyGreensReceivingSummaryForm.controls.areainfo.disable();
      this.dailyGreensReceivingSummaryForm.controls.buyingSupervisor.disable();
      this.dailyGreensReceivingSummaryForm.controls.totalCrates.disable();
      this.dailyGreensReceivingSummaryForm.controls.totalQuantity.disable();
    } catch (error) {
      // console.log('form creation error', error);
    }
  }

  getCropGroup() {
    this.dailyGreensReceivingDetailService.getCropGroup().subscribe((res: any) => {
      // console.log('res', res);
      this.cropGroupList = res;
      this.cropGroupList.sort((a, b) => a.Name.localeCompare(b.Name));
    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('error fetching crop group');
      });
  }

  getCropNameCodeList(event) {
    // console.log('getCropNameCodeList0', event);
    this.dailyGreensReceivingDetailService.getCropName(event).subscribe((res: any) => {
      this.cropNameList = res;
      this.cropNameList.sort((a, b) => a.name.localeCompare(b.name));
    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('error fetching crop name');
      });
  }

  changeSeasonFromTo(event) {
    if (this.formStatus.IsNew || this.formStatus.IsModify) {
      this.dailyGreensReceivingDetailsForm.controls.village.reset();
      this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.reset();
      this.dailyGreensReceivingDetailsForm.controls.farmerName.reset();
      this.dailyGreensReceivingDetailsForm.controls.village.enable();
      this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.enable();
      this.dailyGreensReceivingDetailsForm.controls.farmerName.enable();
      this.dailyGreensReceivingDetailsForm.controls.lastHarvest.enable();
    }
    this.weightDetailsList = [];
  }

  getSeasonFromTo(event) {
    if (this.formStatus.IsModify) {
      // this.famerCropSchemeRadio = null;
    }
    this.dailyGreensReceivingDetailsForm.controls.village.reset();
    this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.reset();
    this.dailyGreensReceivingDetailsForm.controls.farmerName.reset();
    this.dailyGreensReceivingDetailsForm.controls.village.enable();
    this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.enable();
    this.dailyGreensReceivingDetailsForm.controls.farmerName.enable();
    this.dailyGreensReceivingDetailsForm.controls.lastHarvest.enable();
    this.weightDetailsList = [];
    this.getCropSchemes(event);
    this.dailyGreensReceivingDetailService.getSeasonFromTo(event).subscribe((res: any) => {
      this.seasonList = res;
    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('error fetching season from');
      });
  }

  villageChange(event) {
    // console.log('event', event);
  }

  selectVillageEvent(event) {
    // console.log('event', event.villageCode);
    this.getFarmersByVillageCode(event.villageCode);
  }

  farmerNameChange(event) {
    // console.log('event', event);
  }

  selectFarmerEvent(event) {
    // console.log('event', event);
    const farmerAlreadyAdded = this.farmerDetailsList.filter(x => x.farmerCode === event.farmerCode);
    /*if (this.formStatus.IsNew && farmerAlreadyAdded && farmerAlreadyAdded.length > 0) {
      this.farmerAcNo = null;
      this.alertSerice.error('You have already added count & weight details against this farmer');
    } else {*/
    this.farmerAcNo = event.farmerCode;
    if (!this.selectedFramerList.some((item) => item.code === event.farmerCode)) {
      const farmerData = {
        code: event.farmerCode,
        name: event.farmerName
      };
      this.selectedFramerList.push(farmerData);
    }
    this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.setValue(event.accountNo);
    // }
  }

  getAllEmployee() {
    this.dailyGreensReceivingDetailService.getAllEmployee().subscribe((res: any) => {
      // console.log('res', res);
      this.employeeList = res;
      this.employeeList.sort((a, b) => a.employeeName.localeCompare(b.employeeName));

    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('Error fetching employee info');
      });
  }

  getVillageCode(areaId) {
    this.dailyGreensReceivingDetailService.getVillageCode(areaId).subscribe((res: any) => {
      this.villageList = res;
      this.villageList.sort((a, b) => a.name.localeCompare(b.name));
      // console.log(' village res', this.villageList);

    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('Error fetching village');
      });
  }

  getFarmersByVillageCode(villageCode) {
    const areaID = this.areadId;
    const pSNumber = this.dailyGreensReceivingDetailsForm.controls.seasonFrom.value;
    this.dailyGreensReceivingDetailService.GetFarmerListByAreaAndVillageCodeAndPSNumber
      (areaID, pSNumber, villageCode).subscribe((res: any) => {
        // console.log('res', res);
        this.farmerNameList = res;
        this.farmerNameList.sort((a, b) => a.farmerName.localeCompare(b.farmerName));
      },
        error => {
          // console.log('error', error);
          this.alertSerice.error('Error fetching framer by village code');
        });
  }

  getFarmerByCode(farmerId) {
    this.dailyGreensReceivingDetailService.getFarmerByCode(farmerId).subscribe((res: any) => {
      // console.log('res ', res);
      this.farmerAcNo = farmerId;
    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('Error fetching farmer by code');
      });
  }

  getFarmerAcNo(event, formValue) {
    // console.log('event ', event);
    if (this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.value &&
      this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.value !== '') {
      const pSNumber = this.dailyGreensReceivingDetailsForm.controls.seasonFrom.value;
      this.dailyGreensReceivingDetailService.GetFarmerByAreaAndPSNumberAndAccountNo
        (this.areadId, pSNumber, this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.value)
        .subscribe((res: any) => {
          if (res) {
            const farmerAlreadyAdded = this.farmerDetailsList.filter(x => x.farmerCode === res.farmerCode);
            /*if (this.formStatus.IsNew && farmerAlreadyAdded && farmerAlreadyAdded.length > 0) {
              this.farmerAcNo = null;
              this.alertSerice.error('You have already added count & weight details against this farmer');
            } else {*/
            if (!this.selectedFramerList.some((item) => item.code === res.farmerCode)) {
              const farmerData = {
                code: res.farmerCode,
                name: res.farmerName
              };
              this.selectedFramerList.push(farmerData);
            }
            this.farmerAcNo = res.farmerCode;
            this.dailyGreensReceivingDetailsForm.controls.village.setValue(res.villageName);
            this.dailyGreensReceivingDetailsForm.controls.farmerName.setValue(res.farmerName);
            // }
          } else {
            this.farmerAcNo = null;
            this.alertSerice.error('Farmer detail not found.');
          }
        },
          error => {
            // console.log('error', error);
            this.farmerAcNo = null;
            this.alertSerice.error('Farmer detail not found.');
          });
    }
  }

  getCropSchemes(cropNameCode) {
    this.dailyGreensReceivingDetailService.getCropSchemes(cropNameCode).subscribe((res: any) => {
      // console.log('res', res);
      this.cropSchemeList = res;
    },
      error => {
        // console.log('error', error);
        this.alertSerice.error('Error fetching crop scheme');
      });
  }

  showPopup(event, weightDetails) {
    // console.log('this.weightDetailsList', weightDetails);
    if (weightDetails.cropCount !== undefined && weightDetails.noOfCrate !== undefined
      && weightDetails.eachTare !== undefined && weightDetails.grossWt !== undefined) {
      // const netWt = parseInt(weightDetails.grossWt) - parseInt(weightDetails.tareWt);
      // weightDetails.netWt = netWt;
      this.weightDetails = weightDetails;
      $('#AddMoreData').modal('show');
      setTimeout(() => this.continueBtn.nativeElement.focus(), 100);
    }
  }

  closePopup() {
    $('#AddMoreData').modal('hide');
  }

  continueToAddCount(formValue, IsUpdate) {
    $('#AddMoreData').modal('hide');
    forkJoin(
      this.addWeightDetails(formValue),
      this.addGreensFarmerDetail(formValue)).subscribe(() => {
        if (!IsUpdate) {
          const weightDetailData: WeightDetails = new WeightDetails();
          weightDetailData.slNo = this.weightDetailsList.length + 1;
          weightDetailData.cropCount = this.weightDetails.cropCount;
          weightDetailData.eachTare = this.weightDetails.eachTare;
          weightDetailData.cropCountInfo = this.weightDetails.cropCountInfo;
          weightDetailData.farmerCode = this.farmerAcNo;
          weightDetailData.greensProcurementNo = this.greensProcurementNo;
          weightDetailData.cropSchemeDisabled = true;
          this.weightDetailsList.push(weightDetailData);
          setTimeout(() => this.mapCropSchemeElements(), 0);
          const itemToFocus = this.weightDetailsList.filter(x => {
            return x.farmerCode === this.farmerAcNo;
          });
          setTimeout(() => this.autoHighlightElements[itemToFocus.length - 1].focus(), 0);
        } else {
          setTimeout(() => this.mapCropSchemeElements(), 0);
          const weightDetail = this.weightDetailsList.filter((x) => {
            return x.Id === this.weightDetails.Id;
          });
          const weightDetailIndexToFocus = this.weightDetailsList.indexOf(weightDetail[0]) + 1;
          if (weightDetailIndexToFocus !== this.weightDetailsList.length) {
            setTimeout(() => this.autoHighlightElements[weightDetailIndexToFocus].focus(), 0);
          }
        }
      });
  }

  getTotalFarmerHarvestQuantity(cropCount) {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      if (element.cropCount === cropCount) {
        let num = Number(element.totalQuantity);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  getTotalNumberQuantity(cropCount) {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      if (element.cropCount === cropCount) {
        let num = Number(element.totalCrate);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  saveQuantityCountWiseDetail() {
    try {
      return new Observable((obs) => {
        const countDetailList = [];
        this.cropSchemeList.forEach(element => {
          const existInFarmerDetails = this.farmerDetailsList.filter(x => {
            return x.cropCount === element.Code;
          });
          if (existInFarmerDetails && existInFarmerDetails.length >= 1) {
            let countwiseDetail: CropCount;
            countwiseDetail = new CropCount();
            countwiseDetail.greensProcurementNo = this.greensProcurementNo;
            countwiseDetail.cropSchemeCode = element.Code;
            countwiseDetail.totalFarmerHarvestQuantity = this.getTotalFarmerHarvestQuantity(element.Code);
            countwiseDetail.totalNoOfCrates = this.getTotalNumberQuantity(element.Code);
            countDetailList.push(countwiseDetail);
          }
        });
        /*if (countDetailList.length > 0) {
          this.dailyGreensReceivingDetailService.addGreensQuantityCountwiseDetail(countDetailList).subscribe((data: any) => {
            obs.next();
            obs.complete();
          }, err => {
            obs.error();
          });
        } else {
          obs.next();
          obs.complete();
        }*/
        obs.next();
        obs.complete();
      });
    } catch (error) {

    }
  }

  submitProcurmentDetail(formValue) {
    try {
      return new Observable((obs) => {
        let procrumentData;
        let hrvstTimeDuration = 0;
        hrvstTimeDuration = Number(this.dailyGreensReceivingSummaryForm.controls.timeDuration.value.split(':')[0]
          + '.' + this.dailyGreensReceivingSummaryForm.controls.timeDuration.value.split(':')[1]);
        if (this.dailyGreensReceivingSummaryForm.controls.vehicleEndPoint.value === 'UNIT') {
          procrumentData = {
            harvestEndingTime: this.updateDateFormate(this.dailyGreensReceivingSummaryForm.controls.endDateTime.value),
            harvestEndingKMS: Number(this.dailyGreensReceivingSummaryForm.controls.endingReading.value),
            harvestTimeDuration: hrvstTimeDuration,
            haverstKMSTotalReading: Number(this.dailyGreensReceivingSummaryForm.controls.noOfKms.value),
            harvestOtherCharges: Number(this.dailyGreensReceivingSummaryForm.controls.otherCharges.value),
            tripTotalQuantity: this.dailyGreensReceivingSummaryForm.controls.totalQuantity.value,
            tripTotalCrates: this.dailyGreensReceivingSummaryForm.controls.totalCrates.value,
            vehicleEndPoint: this.dailyGreensReceivingSummaryForm.controls.vehicleEndPoint.value,
            orgOfficeNo: this.dailyGreensReceivingSummaryForm.controls.location.value,
            greensProcurementNo: this.greensProcurementNo,
            receivingCompleted: 1
          };
        } else if (this.dailyGreensReceivingSummaryForm.controls.vehicleEndPoint.value === 'Area Branch') {
          procrumentData = {
            harvestEndingTime: this.updateDateFormate(this.dailyGreensReceivingSummaryForm.controls.endDateTime.value),
            harvestEndingKMS: this.dailyGreensReceivingSummaryForm.controls.endingReading.value,
            harvestTimeDuration: hrvstTimeDuration,
            haverstKMSTotalReading: this.dailyGreensReceivingSummaryForm.controls.noOfKms.value,
            harvestOtherCharges: this.dailyGreensReceivingSummaryForm.controls.otherCharges.value,
            tripTotalQuantity: this.dailyGreensReceivingSummaryForm.controls.totalQuantity.value,
            tripTotalCrates: this.dailyGreensReceivingSummaryForm.controls.totalCrates.value,
            vehicleEndPoint: this.dailyGreensReceivingSummaryForm.controls.vehicleEndPoint.value,
            locationAreaID: this.dailyGreensReceivingSummaryForm.controls.location.value,
            greensProcurementNo: this.greensProcurementNo,
            receivingCompleted: 1
          };
        } else {
          procrumentData = {
            harvestEndingTime: this.updateDateFormate(this.dailyGreensReceivingSummaryForm.controls.endDateTime.value),
            harvestEndingKMS: this.dailyGreensReceivingSummaryForm.controls.endingReading.value,
            harvestTimeDuration: hrvstTimeDuration,
            haverstKMSTotalReading: this.dailyGreensReceivingSummaryForm.controls.noOfKms.value,
            harvestOtherCharges: this.dailyGreensReceivingSummaryForm.controls.otherCharges.value,
            tripTotalQuantity: this.dailyGreensReceivingSummaryForm.controls.totalQuantity.value,
            tripTotalCrates: this.dailyGreensReceivingSummaryForm.controls.totalCrates.value,
            vehicleEndPoint: this.dailyGreensReceivingSummaryForm.controls.vehicleEndPoint.value,
            greensProcurementNo: this.greensProcurementNo,
            receivingCompleted: 1
          };
        }
        this.dailyGreensReceivingDetailService.addGreensProcurement(procrumentData).subscribe(data => {
          obs.next();
          obs.complete();
        },
          error => {
            obs.error();
          });
      });
    } catch (error) {

    }

  }

  addWeightDetails(formValue) {
    try {
      if (this.formStatus.IsModify) {
        this.weightDetails.isDisabled = false;
      } else {
        this.weightDetails.isDisabled = true;
      }
      return new Observable((obs) => {
        const weightDetail = {
          greensCratewiseEntryNo: this.weightDetails.Id,
          greensProcurementNo: this.greensProcurementNo,
          farmerCode: this.farmerAcNo,
          cropSchemeCode: this.weightDetails.cropCount,
          noOfCrates: Number(this.weightDetails.noOfCrate),
          eachCrateWt: Number(this.weightDetails.eachTare),
          crateNoFrom: Number(this.weightDetails.creatFromNo),
          crateNoTo: Number(this.weightDetails.creatToNo),
          grossWeight: Number(this.weightDetails.grossWt),
          tareweight: Number(this.weightDetails.tareWt),
          crateswiseNetWeight: Number(this.weightDetails.netWt),
          lastHarvestStatus: this.dailyGreensReceivingDetailsForm.controls.lastHarvest.value,
          cropGroupCode: this.dailyGreensReceivingDetailsForm.controls.cropGroup.value,
          cropNameCode: this.dailyGreensReceivingDetailsForm.controls.cropName.value,
          pSNumber: this.dailyGreensReceivingDetailsForm.controls.seasonFrom.value,
        };
        this.dailyGreensReceivingDetailService.addGreensQuantityCratewiseDetail(weightDetail).subscribe((res: any) => {
          this.weightDetails.Id = res.greensCratewiseEntryNo;
          const countWeightDetail = this.countWeightDetailsList.filter((x) => {
            return x.Id === this.weightDetails.Id;
          });
          if (countWeightDetail.length > 0) {
            this.countWeightDetailsList.splice(this.countWeightDetailsList.indexOf(countWeightDetail[0]), 1);
          }
          this.countWeightDetailsList.push(this.weightDetails);
          let ttlCrate = 0;
          let ttlQty = 0;
          ttlCrate = Number(this.getFarmerCrateTotal(this.farmerAcNo, this.weightDetails.cropCount));
          ttlQty = Number(this.getFarmerNetWtTotal(this.farmerAcNo, this.weightDetails.cropCount));
          ttlQty = Number(ttlQty.toFixed(3));
          const updateFrmrCount = this.farmerDetailsList.filter((x) => {
            return x.farmerCode === this.farmerAcNo && x.cropCount === this.weightDetails.cropCount;
          });
          updateFrmrCount[0].totalCrate = ttlCrate;
          updateFrmrCount[0].totalQuantity = ttlQty;
          obs.next();
          obs.complete();
        },
          error => {
            this.weightDetails.isDisabled = false;
            obs.error();
            this.alertSerice.error('Error adding weight details');
          });
      });
    } catch (error) {
      this.weightDetails.isDisabled = false;
      this.alertSerice.error('Error adding weight details');
    }

  }

  changeCountdata(fromValue) {
    $('#AddMoreData').modal('hide');
    forkJoin(
      this.addWeightDetails(fromValue),
      this.addGreensFarmerDetail(fromValue)).subscribe(() => {
        this.weightDetailsList = [];
        if (this.formStatus.IsModify) {
          this.famerCropSchemeRadio = null;
        }
        if (this.formStatus.IsNew || this.formStatus.IsModify) {
          this.dailyGreensReceivingDetailsForm.controls.cropName.enable();
          this.dailyGreensReceivingDetailsForm.controls.seasonFrom.enable();
          const weightDetailData: WeightDetails = new WeightDetails();
          weightDetailData.slNo = this.weightDetailsList.length + 1;
          weightDetailData.farmerCode = this.farmerAcNo;
          weightDetailData.greensProcurementNo = this.greensProcurementNo;
          this.weightDetailsList.push(weightDetailData);
          setTimeout(() => this.mapCropSchemeElements(), 0);
          const itemToFocus = this.weightDetailsList.filter(x => {
            return x.farmerCode === this.farmerAcNo;
          });
          setTimeout(() => this.autoHighlightElements[itemToFocus.length - 1].focus(), 0);
        }
      });
  }

  getFarmerCrateTotal(farmerCode, cropSchemeCode) {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      if (element.farmerCode === farmerCode && element.cropCount === cropSchemeCode) {
        let num = Number(element.noOfCrate);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  getFarmerNetWtTotal(farmerCode, cropSchemeCode) {
    let Sum = 0;
    this.countWeightDetailsList.forEach(element => {
      if (element.farmerCode === farmerCode && element.cropCount === cropSchemeCode) {
        let num = Number(element.netWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  addGreensFarmerDetail(fromValue) {
    try {
      return new Observable((obs) => {
        const frmr = this.farmerDetailsList.filter(x => {
          return x.greensProcurementNo === this.greensProcurementNo &&
            x.farmerCode === this.farmerAcNo &&
            x.cropCount === this.weightDetails.cropCount;
        });
        let ttlCrate = 0;
        let ttlQty = 0;
        /*if (frmr && frmr.length > 0) {
          ttlCrate = Number(this.weightDetails.noOfCrate) + Number(frmr[0].totalCrate);
          ttlQty = Number(this.weightDetails.netWt) + Number(frmr[0].totalQuantity);
        } else {
          ttlCrate = Number(this.getCrateTotal(true, this.weightDetails.cropCount));
          ttlQty = Number(this.getNetWtTotal(true, this.weightDetails.cropCount));
        }*/
        ttlCrate = Number(this.getFarmerCrateTotal(this.farmerAcNo, this.weightDetails.cropCount));
        ttlQty = Number(this.getFarmerNetWtTotal(this.farmerAcNo, this.weightDetails.cropCount));
        ttlQty = Number(ttlQty.toFixed(3));
        if (frmr && frmr.length > 0) {
          // frmr[0].totalCrate = ttlCrate;
          // frmr[0].totalQuantity = ttlQty;
        } else {
          const frmrDetail = {
            slNo: this.farmerDetailsList.length + 1,
            farmerName: this.dailyGreensReceivingDetailsForm.controls.farmerName.value.farmerName ?
              this.dailyGreensReceivingDetailsForm.controls.farmerName.value.farmerName :
              this.dailyGreensReceivingDetailsForm.controls.farmerName.value,
            farmerAcNo: this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.value,
            farmerCode: this.farmerAcNo,
            cropCountInfo: this.weightDetails.cropCountInfo,
            cropCount: this.weightDetails.cropCount,
            totalCrate: 0,
            totalQuantity: 0,
            greensProcurementNo: this.greensProcurementNo,
            lastHarvestStatus: this.dailyGreensReceivingDetailsForm.controls.lastHarvest.value,
            Id: 0,
            cropGroupCode: this.dailyGreensReceivingDetailsForm.controls.cropGroup.value,
            cropNameCode: this.dailyGreensReceivingDetailsForm.controls.cropName.value,
            pSNumber: this.dailyGreensReceivingDetailsForm.controls.seasonFrom.value
          };
          this.farmerDetailsList.push(frmrDetail);
        }
        obs.next();
        obs.complete();
      });
    } catch (error) {

    }

  }

  changeFarmerData(fromValue) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to change farmer?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        $('#AddMoreData').modal('hide');
        forkJoin(
          this.addWeightDetails(fromValue),
          this.addGreensFarmerDetail(fromValue)).subscribe(() => {
            this.weightDetailsList = [];
            if (this.formStatus.IsModify) {
              this.famerCropSchemeRadio = null;
            }
            this.dailyGreensReceivingDetailsForm.controls.village.reset();
            this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.reset();
            this.dailyGreensReceivingDetailsForm.controls.farmerName.reset();
            this.dailyGreensReceivingDetailsForm.controls.lastHarvest.reset();
            this.dailyGreensReceivingDetailsForm.controls.cropName.enable();
            this.dailyGreensReceivingDetailsForm.controls.seasonFrom.enable();
            this.dailyGreensReceivingDetailsForm.controls.village.enable();
            this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.enable();
            this.dailyGreensReceivingDetailsForm.controls.farmerName.enable();
            this.dailyGreensReceivingDetailsForm.controls.lastHarvest.enable();
            this.dailyGreensReceivingDetailsForm.controls.lastHarvest.setValue('No');
            this.farmerAcNo = null;
            setTimeout(() => this.villageData.nativeElement.focus(), 0);
          });
      }
    });

  }

  goToSummary(fromValue) {
    $('#AddMoreData').modal('hide');
    forkJoin(
      this.addWeightDetails(fromValue),
      this.addGreensFarmerDetail(fromValue)).subscribe(() => {
        this.weightDetailsList = [];
        this.farmerAcNo = null;
        if (this.formStatus.IsModify) {
          this.famerCropSchemeRadio = null;
        }
        this.prepareFarmerWiseSummaryGrid();
        this.selectedTab = 'Summary';
      });
  }
  getTotalQuantity() {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      let num = Number(element.totalQuantity);
      num = isNaN(num) ? 0 : num;
      Sum += num;
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }
  getTotalCrate() {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      let num = Number(element.totalCrate);
      num = isNaN(num) ? 0 : num;
      Sum += num;
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }
  prepareFarmerWiseSummaryGrid() {
    this.dailyGreensReceivingSummaryForm.controls.areainfo.setValue(this.selectedBuyer.area);
    this.dailyGreensReceivingSummaryForm.controls.buyingSupervisor.setValue(this.selectedBuyer.buyerName);
    this.dailyGreensReceivingSummaryForm.controls.totalQuantity.setValue(this.getTotalQuantity());
    this.dailyGreensReceivingSummaryForm.controls.totalCrates.setValue(this.getTotalCrate());
    this.cropSchemeListFromFarmerList = [];
    this.farmerWiseSummary = [];
    this.farmerDetailsList.forEach(frmr => {
      const frmrExist = this.farmerWiseSummary.filter(x => {
        return x.farmerCode === frmr.farmerCode;
      });
      const cropSchemeExist = this.cropSchemeListFromFarmerList.filter(x => {
        return x.CropSchemeCode === frmr.cropCount;
      });
      if (!cropSchemeExist || cropSchemeExist.length <= 0) {
        const cropScheme = {
          CropSchemeCode: frmr.cropCount,
          CropSchemeInfo: frmr.cropCountInfo
        };
        this.cropSchemeListFromFarmerList.push(cropScheme);
      }
      if (!frmrExist || frmrExist.length <= 0) {
        const farmerWiseSummaryData = {
          farmerName: frmr.farmerName,
          farmerCode: frmr.farmerCode,
          farmerAcNo: frmr.farmerAcNo,
          farmerWiseCrateTotal: this.getFarmerWiseCrateTotal(frmr.farmerCode)
        };

        this.farmerWiseSummary.push(farmerWiseSummaryData);
      }
    });
  }
  getFarmerWiseCrateTotal(farmerCode) {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      if (element.farmerCode === farmerCode) {
        let num = element.totalCrate;
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }
  getNetWtFarmerCropWiseTotal(farmerCode, cropCode) {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      if (element.farmerCode === farmerCode &&
        element.cropCount === cropCode) {
        let num = element.totalQuantity;
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }
  getNetWtCropWiseTotal(cropCode) {
    let Sum = 0;
    this.farmerDetailsList.forEach(element => {
      if (element.cropCount === cropCode) {
        let num = element.totalQuantity;
        num = isNaN(num) ? 0 : num;
        Sum += num;
      }
    });
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  TimeOfDespatchChange() {
    try {
      if (this.dailyGreensReceivingSummaryForm.controls.timeDuration.touched
        && this.dailyGreensReceivingSummaryForm.controls.timeDuration.valid) {
        const from = this.dailyGreensReceivingSummaryForm.controls.timeDuration.value;
        const fromVal = from.split(':');
        let fromMins = +fromVal[1];
        fromMins += fromVal[0] * 60;

        const durationMin = fromMins;
        const durationHrs = Math.trunc(durationMin / 60);
        const durationMins = durationMin % 60;
        this.dailyGreensReceivingSummaryForm.controls.timeDuration.setValue(
          (durationHrs <= 9 ? '0' + durationHrs : durationHrs) + ':' +
          (durationMins <= 9 ? '0' + durationMins : durationMins));
      } else {
        // this.dailyGreensReceivingSummaryForm.controls.timeDuration.setValue(this.getCurrentTime());
      }
    } catch (error) {
      // console.log('Error on navbar getAllCropGroups: ', error);
    }
  }
  ThreeDigitDecimalNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,5}\.?\d{0,3}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  OnlyNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,4}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  getCurrentTime() {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    return time;
  }

  getTotalDValue() {
    // tslint:disable-next-line: radix
    this.totalGrossWt = this.totalGrossWt + parseInt(this.weightDetails.grossWt);
    this.totalNetWt = this.totalNetWt + this.weightDetails.netWt;
    // tslint:disable-next-line: radix
    this.totalNoOfCrate = this.totalNoOfCrate + parseInt(this.weightDetails.noOfCrate);
    this.totalTareWt = this.totalTareWt + this.weightDetails.tareWt;
  }

  getNoOfCrate(event, weightDetails) {
    weightDetails.noOfCrate = isNaN(event.target.value) ? '' : Math.round(Number(event.target.value));
  }
  getcreatFromNo(event, weightDetails) {
    weightDetails.creatFromNo = isNaN(event.target.value) ? '' : Math.round(Number(event.target.value));
  }
  getcreatToNo(event, weightDetails) {
    weightDetails.creatToNo = isNaN(event.target.value) ? '' : Math.round(Number(event.target.value));
  }
  selectedcropScheme(event, weightDetails) {
    this.cropSchemeList.forEach(element => {
      if (element.Code === event) {
        weightDetails.cropCount = event;
        weightDetails.cropCountInfo = element.From.toString() + ' ' + element.Sign + ' / ' + element.Count;
        // console.log('weightDetails', weightDetails);
      }
    });
  }

  geteachTrae(event, weightDetails) {
    // console.log('this.weightDetailsList', weightDetails);
    weightDetails.eachTare = isNaN(event.target.value) ? '' : event.target.value;
    const eachTare = isNaN(event.target.value) ? 0 : Number(event.target.value);
    // tslint:disable-next-line: radix
    const tareWt = eachTare * Number(weightDetails.noOfCrate);
    weightDetails.tareWt = tareWt.toFixed(3);

  }
  calcNetWt(event, weightDetails) {
    weightDetails.grossWt = isNaN(event.target.value) ? '' : event.target.value;
    let grsWt = Number(event.target.value);
    grsWt = isNaN(grsWt) ? 0 : grsWt;
    let trWt = Number(weightDetails.tareWt);
    trWt = isNaN(trWt) ? 0 : trWt;
    const netWt = grsWt - trWt;
    weightDetails.netWt = netWt.toFixed(3);
  }

  mapBuyerElements() {
    this.selectedBuyerElements = this.selectedBuyerElems.map(elem => {
      return elem;
    });
  }

  mapCropSchemeElements() {
    this.autoHighlightElements = this.autoHighlights.map(elem => {
      return elem;
    });
  }

  saveGreenProcurementDetail(formValue) {
    if ((this.formStatus.IsNew || this.formStatus.IsModify) &&
      this.dailyGreensReceivingDetailsForm.valid && this.farmerAcNo !== null
      && this.farmerAcNo !== undefined && this.farmerAcNo !== '') {
      this.dailyGreensReceivingDetailsForm.disable();
      this.weightDetailsList = [];
      if (this.greensProcurementNo === undefined || this.greensProcurementNo === null || this.greensProcurementNo === '') {
        const transportDetail = {
          greensTransVehicleDespNo: this.selectedBuyer.despNo,
          harvestDate: this.updateDateFormate(this.dailyGreensReceivingDetailsForm.controls.harvestDate.value),
          areaID: this.selectedBuyer.areaId,
          cropGroupCode: this.dailyGreensReceivingDetailsForm.controls.cropGroup.value,
          cropNameCode: this.dailyGreensReceivingDetailsForm.controls.cropName.value,
          pSNumber: this.dailyGreensReceivingDetailsForm.controls.seasonFrom.value,
          buyingAsst1EmployeeID: Number(this.dailyGreensReceivingDetailsForm.controls.buyingAssistant.value),
          buyingAsst2EmployeeID: Number(this.dailyGreensReceivingDetailsForm.controls.buyingAssistant2.value),
          weighmentMode: this.dailyGreensReceivingDetailsForm.controls.weighmentMode.value
        };
        // console.log('transportDetail', transportDetail);
        this.dailyGreensReceivingDetailService.addGreensProcurement(transportDetail).subscribe((res: any) => {
          // console.log('res', res);
          const weightDetails: WeightDetails = new WeightDetails();
          weightDetails.farmerCode = this.farmerAcNo;
          weightDetails.greensProcurementNo = res.greensProcurementNo;
          this.weightDetailsList.push(weightDetails);
          this.greensProcurementNo = res.greensProcurementNo;
          this.selectedBuyer.greensProcurementNo = res.greensProcurementNo;
          // this.dailyGreensReceivingDetailsForm.disable();
          setTimeout(() => this.mapCropSchemeElements(), 0);
          const itemToFocus = this.weightDetailsList.filter(x => {
            return x.farmerCode === this.farmerAcNo;
          });
          setTimeout(() => this.autoHighlightElements[itemToFocus.length - 1].focus(), 0);
        },
          error => {
            this.dailyGreensReceivingDetailsForm.disable();
            this.dailyGreensReceivingDetailsForm.controls.area.disable();
            this.alertSerice.error('Error saving green procurement detail');
          });
      } else {
        const weightDetails: WeightDetails = new WeightDetails();
        weightDetails.farmerCode = this.farmerAcNo;
        weightDetails.greensProcurementNo = this.greensProcurementNo;
        this.weightDetailsList.push(weightDetails);
        // this.dailyGreensReceivingDetailsForm.disable();
        // setTimeout(() => this.autoHighlight.focus(), 0);
        setTimeout(() => this.mapCropSchemeElements(), 0);
        const itemToFocus = this.weightDetailsList.filter(x => {
          return x.farmerCode === this.farmerAcNo;
        });
        setTimeout(() => this.autoHighlightElements[itemToFocus.length - 1].focus(), 0);
      }
    } else {
      // this.alertSerice.error('Please provide all required green procurement detail');
    }
  }

  updateDateFormate(dateUpdate) {
    try {
      const date = new Date(dateUpdate);
      // date.setDate(date.getDate() + 1);
      return date.toLocaleString();
    } catch (error) {
      // console.log('updateDateFormate', error);
    }
  }

  getLocationData(event, formValue) {
    if (event === 'Area Branch') {
      this.dailyGreensReceivingDetailService.getAllArea().subscribe((res: any) => {
        // console.log('all area', res);
        this.locationList = [];
        res.forEach(element => {
          const location = {
            locationcode: element.areaId,
            locationName: element.areaName
          };
          this.locationList.push(location);
        });
        this.locationList.sort((a, b) => a.locationName.localeCompare(b.locationName));

      },
        error => {
          // console.log('error', error);
        });
    } else if (event === 'UNIT') {
      this.dailyGreensReceivingDetailService.getOfficeLocations().subscribe((res: any) => {
        // console.log('getOfficeLocations', res);
        this.locationList = [];
        res.forEach(element => {
          const location = {
            locationcode: element.orgOfficeNo,
            locationName: element.orgOfficeName
          };
          this.locationList.push(location);
        });
        this.locationList.sort((a, b) => a.locationName.localeCompare(b.locationName));

      },
        error => {
          // console.log('error', error);
        });
    } else {
      this.locationList = [];
      this.saveCompleteTrip(event, formValue);
    }
  }


  saveCompleteTrip(event, formValue) {
    if (this.greensProcurementNo && this.dailyGreensReceivingSummaryForm.valid && this.formStatus.IsNew) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Are you sure you want to save?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          forkJoin(
            this.saveQuantityCountWiseDetail(),
            this.submitProcurmentDetail(formValue)).subscribe(() => {
              this.greensProcurementNo = null;
              this.weightDetailsList = [];
              this.farmerDetailsList = [];
              this.farmerWiseSummary = [];
              const buyerIndex: number = this.buyerScheduleDetail.indexOf(this.selectedBuyer);
              if (buyerIndex !== -1) {
                this.buyerScheduleDetail.splice(buyerIndex, 1);
              }
              this.mapBuyerElements();
              this.dailyGreensReceivingDetailsForm.reset();
              this.dailyGreensReceivingSummaryForm.reset();
              this.dailyGreensReceivingDetailsForm.enable();
              this.dailyGreensReceivingDetailsForm.controls.area.disable();
              this.selectedTab = 'discuss';
              this.alertSerice.success('Receiving summary saved successfully.');
            });
        }
      });
    }
  }
  getCrateTotal(farmerWise, cropCount) {
    let Sum = 0;
    if (farmerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo &&
          element.cropCount === cropCount) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (farmerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.cropCount === cropCount) {
          let num = Number(element.noOfCrate);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        let num = Number(element.noOfCrate);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum;
  }

  getGrossWtTotal(farmerWise, cropCount) {
    let Sum = 0;
    if (farmerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo &&
          element.cropCount === cropCount) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (farmerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.cropCount === cropCount) {
          let num = Number(element.grossWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        let num = Number(element.grossWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  getTareWtTotal(farmerWise, cropCount) {
    let Sum = 0;
    if (farmerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo &&
          element.cropCount === cropCount) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (farmerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.cropCount === cropCount) {
          let num = Number(element.tareWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        let num = Number(element.tareWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }

  getNetWtTotal(farmerWise, cropCount) {
    let Sum = 0;
    if (farmerWise && cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo &&
          element.cropCount === cropCount) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (farmerWise) {
      this.weightDetailsList.forEach(element => {
        if (element.farmerCode === this.farmerAcNo) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else if (cropCount !== '') {
      this.weightDetailsList.forEach(element => {
        if (element.cropCount === cropCount) {
          let num = Number(element.netWt);
          num = isNaN(num) ? 0 : num;
          Sum += num;
        }
      });
    } else {
      this.weightDetailsList.forEach(element => {
        let num = Number(element.netWt);
        num = isNaN(num) ? 0 : num;
        Sum += num;
      });
    }
    Sum = isNaN(Sum) ? 0 : Sum;
    return Sum.toFixed(3);
  }
  updateFormStatus(prop, val) {
    Object.entries(this.formStatus).forEach(
      ([key, value]) => {
        if (key === prop) {
          this.formStatus[key] = val;
        } else {
          this.formStatus[key] = false;
        }
      });
  }
  Find() {
    this.updateFormStatus('IsFind', true);
    this.dailyGreensReceivingDetailsForm.controls.harvestDate.enable();
    setTimeout(() => this.dateofEntry.nativeElement.focus(), 0);
    this.buyerScheduleDetail = [];
    /*this.dailyGreensReceivingDetailService.GetCompletedDailyGreensRecieving(harvestDate).subscribe((res: any) => {
      console.log(res);
    },
      error => {
        console.log('error', error);
      });*/
  }
  New() {
    this.formStatus = {
      IsFind: null,
      IsModify: null,
      IsNew: true
    };
    this.greensProcurementNo = null;
    this.weightDetailsList = [];
    this.farmerDetailsList = [];
    this.farmerWiseSummary = [];
    this.formCreation();
    this.getCropGroup();
    this.getAllEmployee();
    this.buyerScheduleData();
    this.summaryformCreation();
    this.dailyGreensReceivingDetailsForm.reset();
    this.dailyGreensReceivingSummaryForm.reset();
    this.dailyGreensReceivingDetailsForm.enable();
    this.selectedTab = 'discuss';
    this.famerCropSchemeRadio = null;
  }
  Modify() {
    this.updateFormStatus('IsModify', true);
    this.dailyGreensReceivingDetailsForm.controls.harvestDate.enable();
    setTimeout(() => this.dateofEntry.nativeElement.focus(), 0);
    this.buyerScheduleDetail = [];
  }
  Clear() {
    this.New();
  }
  GetCompletedDailyGreensRecieving() {
    if ((this.formStatus.IsFind || this.formStatus.IsModify) && this.dailyGreensReceivingDetailsForm.controls.harvestDate.value &&
      this.dailyGreensReceivingDetailsForm.controls.harvestDate.value !== ''
    ) {
      try {
        // const harvestDate = this.dailyGreensReceivingDetailsForm.controls.harvestDate.value.format('yyyy-MM-DD');
        const harvestDate = new Date(this.dailyGreensReceivingDetailsForm.controls.harvestDate.value);
        const formattedHarvestDate = harvestDate.getFullYear() + '-' + (harvestDate.getMonth() + 1) + '-' + harvestDate.getDate();
        this.dailyGreensReceivingDetailService.GetCompletedDailyGreensRecieving(formattedHarvestDate).subscribe((res: any) => {
          this.buyerScheduleDetail = [];
          res.forEach(element => {
            element.slNo = this.buyerScheduleDetail.length + 1;
            this.buyerScheduleDetail.push(element);
          });
          setTimeout(() => this.mapBuyerElements(), 0);
        },
          error => {
            this.buyerScheduleDetail = [];
          });
      } catch (error) {
        // console.log('form creation error', error);
      }
    }
  }
  Get(procurement) {
    this.dailyGreensReceivingDetailService.GetDailyGreensQuantityCrateWiseDetails(procurement).subscribe((res: any) => {
      // console.log(res);
    },
      error => {
        // console.log('error', error);
      });
  }
  selectedFarmerCropSchemeCode(event) {
    const farmerCode = this.famerCropSchemeRadio.split('|')[0];
    const cropSchemeCode = this.famerCropSchemeRadio.split('|')[1];
    const weightDetailsList = this.countWeightDetailsList.filter((x) => {
      return x.farmerCode === farmerCode && x.cropCount === cropSchemeCode;
    });
    const farmerDetail = this.farmerDetailsList.filter((x) => {
      return x.farmerCode === farmerCode && x.cropCount === cropSchemeCode;
    });
    this.dailyGreensReceivingDetailsForm.controls.cropName.setValue(farmerDetail[0].cropNameCode);
    this.dailyGreensReceivingDetailsForm.controls.seasonFrom.setValue(farmerDetail[0].pSNumber);
    this.dailyGreensReceivingDetailsForm.controls.lastHarvest.setValue(farmerDetail[0].lastHarvestStatus);
    this.dailyGreensReceivingDetailsForm.controls.farmerNameAcNo.setValue(farmerDetail[0].farmerAcNo);
    this.dailyGreensReceivingDetailsForm.controls.farmerName.setValue(farmerDetail[0].farmerName);
    this.dailyGreensReceivingDetailsForm.controls.village.setValue(weightDetailsList[0].villageName);
    this.dailyGreensReceivingDetailsForm.disable();
    if (this.formStatus.IsFind) {
      this.dailyGreensReceivingDetailsForm.controls.cropName.enable();
    }
    this.weightDetailsList = weightDetailsList;
  }
}


