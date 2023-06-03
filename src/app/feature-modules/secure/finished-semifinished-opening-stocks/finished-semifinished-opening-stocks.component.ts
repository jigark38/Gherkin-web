import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { FinishedSemifinishedOpeningStocksService } from './finished-semifinished-opening-stocks.service';
import {
  ConsigneeBuyersList,
  CountryOverSeas,
  FinishedProductGroups,
  FinishedSFStokQntyModel, FinishSFOpeningStokModel, HarvestAreas, OrganisationOfficeUnits, ProformaInvoices
} from './finished-semifinished-opening.model';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-finished-semifinished-opening-stocks',
  templateUrl: './finished-semifinished-opening-stocks.component.html',
  styleUrls: ['./finished-semifinished-opening-stocks.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class FinishedSemifinishedOpeningStocksComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    public finishedSFOpeningStksService: FinishedSemifinishedOpeningStocksService,
    public dialog: MatDialog,
    private alertService: AlertService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  @ViewChild('OrgOfficeNo', { read: ElementRef, static: false }) OrgOfficeNo: ElementRef;
  @ViewChild('ProcessDate', { read: ElementRef, static: false }) ProcessDate: ElementRef;
  @ViewChild('saveBtn', { read: ElementRef, static: false }) saveBtn: ElementRef;

  finishedSFStockProductForm: FormGroup;
  finishedSFStockQuantityForm: FormGroup;
  employeeId: string;
  employeeName: string;
  organisationOfficeUnits: OrganisationOfficeUnits[];
  harvestAreas: HarvestAreas[];
  countryOverSeas: CountryOverSeas[];
  consigneeBuyersList: ConsigneeBuyersList[];
  proformaInvoices: ProformaInvoices[];
  finishedProductGroups: FinishedProductGroups[];
  finishedProductDetails: any = [];
  mediaProcessDetails: any = [];
  productionProcessDetails: any = [];
  FPGradesDetails: any = [];
  containerPackingDetails: any = [];
  UOMDetails: any = [];
  isProductStockUpdateClicked = false;
  isFindClicked = false;
  isModifyClicked = false;
  isClearClicked = true;
  finishSFOeningStokModel: FinishSFOpeningStokModel;
  finishedSFStokQntyModel: FinishedSFStokQntyModel[];
  countryId: string;
  filteredOptions: Observable<any>;
  filteredUOMOptions: Observable<any>;
  minDate: Date;
  maxDate: Date;
  prodStokUpdBtnDisable = false;
  saveBtnDisable = true;
  findBtnDisable = false;
  modifyBtnDisable = false;
  unitAreaName = null;
  saveBtnClicked = false;
  findBtnClicked = false;
  selectedfinishedSFStokQnty: FinishedSFStokQntyModel;


  ngOnInit() {

    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.finishedSFStockProductForm = new FormGroup({
      fSFOSStockEntryDate: new FormControl({ value: null }, [Validators.required]),
      employeeID: new FormControl({ value: this.employeeId }, [Validators.required]),
      employeeName: new FormControl({ value: this.employeeName }, [Validators.required]),
      countryId: new FormControl({ value: null }, [Validators.required]),
      orgOfficeNo: new FormControl({ value: null }, [Validators.required]),
      areaID: new FormControl({ value: null }, [Validators.required]),
      fSFStockType: new FormControl({ value: null }, [Validators.required]),
      fSFPackingMode: new FormControl({ value: null }, [Validators.required]),
      cBCode: new FormControl({ value: null }, [Validators.required]),
      profInvNo: new FormControl({ value: null }),
      fPGroupCode: new FormControl({ value: null }, [Validators.required]),
      fPVarietyCode: new FormControl({ value: null }, [Validators.required]),
      productionProcessCode: new FormControl({ value: null }, [Validators.required]),
      mediaProcessCode: new FormControl({ value: null }, [Validators.required]),
      fPGradeCode: new FormControl({ value: null }, [Validators.required]),
    });

    this.finishedSFStockQuantityForm = new FormGroup({
      fSFStockProcessedDate: new FormControl({ value: null }, [Validators.required]),
      fSFOSStockNo: new FormControl({ value: 0 }),
      containerCode: new FormControl({ value: null }),
      containerName: new FormControl({ value: null }, [Validators.required]),
      quantityContainer: new FormControl({ value: '' }, [Validators.required]),
      gSCUOMCode: new FormControl({ value: '' }),
      gSCUOMName: new FormControl({ value: '' }, [Validators.required]),
      containerWeight: new FormControl({ value: '' }, [Validators.required]),
      fSFNOofContainers: new FormControl({ value: '' }, [Validators.required]),
      containerSlNoFrom: new FormControl({ value: '' }, [Validators.required]),
      containerSlNoTo: new FormControl({ value: null }, [Validators.required]),
      stockLocationDetails: new FormControl({ value: null }),
      barcodeOption: new FormControl({ value: null }, [Validators.required]),
    });
    this.finishedSFStockQuantityForm.reset();
    this.finishedSFStockProductForm.disable();
    this.finishedSFStockQuantityForm.disable();
    this.finishedSFStockProductForm.markAsUntouched();
    this.getOrganisationOfficeUnits();
    this.finishSFOeningStokModel = new FinishSFOpeningStokModel();
    this.finishedSFStokQntyModel = new Array<FinishedSFStokQntyModel>();
    this.finishedSFStockProductForm.controls.employeeName.setValue('');
  }

  unitAreaSelection(office, area) {
    this.finishedSFStockProductForm.controls.orgOfficeNo.setValue(office.orgOfficeNo);
    this.finishedSFStockProductForm.controls.areaID.setValue(area.areaId);
  }

  getOrganisationOfficeUnits() {
    this.finishedSFOpeningStksService.getOrganisationOfficeUnits().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.organisationOfficeUnits = res.Data;
        this.getHarvestAreas();
      } else {
        this.alertService.error('Error while Fetching office units!');
      }
    });
  }

  getHarvestAreas() {
    this.finishedSFOpeningStksService.getHarvestAreas().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.harvestAreas = res.Data;
        this.getCountryOverSeas();
      } else {
        this.alertService.error('Error while Fetching office harvest area!');
      }
    });
  }

  getCountryOverSeas() {
    this.finishedSFOpeningStksService.getCountryOverSeas().subscribe((res: any) => {

      if (res.IsSucceed) {
        this.countryOverSeas = new Array<CountryOverSeas>();
        this.countryOverSeas = res.Data;
        this.getFinishedProductGroups();
      } else {
        this.alertService.error('Error while Fetching office overseas country!');
      }
    });
  }

  getConsigneeBuyersList() {
    const overseasCountryId = this.finishedSFStockProductForm.get('countryId').value;
    this.finishedSFOpeningStksService.getConsigneeBuyersList(overseasCountryId).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.consigneeBuyersList = res.Data;
      } else {
        this.alertService.error('Error while Fetching Consignee Buyers!');
      }
    });
  }

  getProformaInvoices() {
    const cBCode = this.finishedSFStockProductForm.get('cBCode').value;
    this.finishedSFOpeningStksService.getProformaInvoices(cBCode).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.proformaInvoices = res.Data;
      }
    });
  }

  getFinishedProductGroups() {
    this.finishedSFOpeningStksService.getFinishedProductGroups().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.finishedProductGroups = res.Data;
      }
      this.getContainerPackingDetails();
    });
  }

  getFinishedProductDetails() {
    const GrpCode = this.finishedSFStockProductForm.get('fPGroupCode').value;
    this.finishedSFOpeningStksService.getFinishedProductDetails(GrpCode).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.finishedProductDetails = res.Data;
      }
    });
  }

  getMediaProcessDetails() {
    const productionProcessCode = this.finishedSFStockProductForm.get('productionProcessCode').value;
    this.finishedSFOpeningStksService.getMediaProcessDetails(productionProcessCode).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.mediaProcessDetails = res.Data;
      }
    });
  }

  getProductionProcessDetails() {
    const fPVarietyCode = this.finishedSFStockProductForm.get('fPVarietyCode').value;
    this.finishedSFOpeningStksService.getProductionProcessDetails(fPVarietyCode).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.productionProcessDetails = res.Data;
      }
      this.getFPGradesDetails();
    });
  }

  getFPGradesDetails() {
    const fPVarietyCode = this.finishedSFStockProductForm.get('fPVarietyCode').value;
    this.finishedSFOpeningStksService.getFPGradesDetails(fPVarietyCode).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.FPGradesDetails = res.Data;
      }
    });
  }

  getContainerPackingDetails() {
    this.finishedSFOpeningStksService.getContainerPackingDetails().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.containerPackingDetails = res.Data;
        if (this.containerPackingDetails.length > 0) {
          this.filteredOptions = this.finishedSFStockQuantityForm.controls.containerName.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.containerName),
              map(name => name ? this._filter(name) : this.containerPackingDetails.slice())
            );
        }
      }
      this.getUOMDetails();
    });
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();

    return this.containerPackingDetails.filter(option => option.containerName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(searchItem): string {
    if (searchItem != null) {
      const data = this.containerPackingDetails.find(_ => _.containerName.toLowerCase() === searchItem.toLowerCase());
      return data ? this.containerPackingDetails.find(_ => _.containerName.toLowerCase() === searchItem.toLowerCase()).containerName : '';
    }
  }

  getUOMDetails() {
    this.finishedSFOpeningStksService.getUOMDetails().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.UOMDetails = res.Data;
        if (this.UOMDetails.length > 0) {
          this.filteredUOMOptions = this.finishedSFStockQuantityForm.controls.gSCUOMName.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.gscUomName),
              map(name => name ? this._filterUom(name) : this.UOMDetails.slice())
            );
        }
      }

    });
  }

  private _filterUom(name: string): any {
    const filterValue = name.toLowerCase();

    return this.UOMDetails.filter(option => option.gscUomName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayUomFn(searchItem): string {
    if (searchItem != null) {
      const data = this.UOMDetails.find(_ => _.gscUomName.toLowerCase() === searchItem.toLowerCase());
      return data ? this.UOMDetails.find(_ => _.gscUomName.toLowerCase() === searchItem.toLowerCase()).gscUomName : '';
    }
  }

  OnClear() {
    this.saveBtnClicked = false;
    this.findBtnClicked = false;
    this.isClearClicked = true;
    this.isProductStockUpdateClicked = false;
    this.isFindClicked = false;
    this.isModifyClicked = false;
    this.finishedSFStockProductForm.controls.employeeName.setValue('');
    this.finishedSFStockProductForm.controls.employeeID.setValue('');
    this.finishedSFStockProductForm.controls.fSFOSStockEntryDate.setValue('');
    this.finishedSFStockProductForm.reset();
    this.finishedSFStockQuantityForm.reset();
    this.finishSFOeningStokModel = new FinishSFOpeningStokModel();
    this.finishedSFStokQntyModel = new Array<FinishedSFStokQntyModel>();
    this.finishedSFStockProductForm.disable();
    this.finishedSFStockQuantityForm.disable();
    this.prodStokUpdBtnDisable = false;
    this.saveBtnDisable = true;
    this.findBtnDisable = false;
    this.modifyBtnDisable = false;
    this.unitAreaName = null;
    this.getOrganisationOfficeUnits();
  }

  OnProuctStocUpdateClick() {
    this.saveBtnClicked = false;
    this.findBtnClicked = false;
    this.prodStokUpdBtnDisable = true;
    this.saveBtnDisable = false;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.isClearClicked = false;
    this.isProductStockUpdateClicked = true;
    this.isFindClicked = false;
    this.isModifyClicked = false;
    this.finishedSFStockProductForm.enable();
    this.finishedSFStockQuantityForm.enable();
    this.finishedSFStockProductForm.reset();
    this.finishedSFStockQuantityForm.reset();
    this.finishedSFStockProductForm.controls.employeeName.setValue(this.employeeName);
    this.finishedSFStockProductForm.controls.employeeID.setValue(this.employeeId);
    this.finishedSFStockProductForm.controls.employeeName.disable();
    this.finishedSFStockProductForm.controls.fSFOSStockEntryDate.setValue(new Date());
    this.OrgOfficeNo.nativeElement.focus();
  }

  OnSaveClick() {
    if (this.isProductStockUpdateClicked) {
      this.saveBtnClicked = true;
      if (this.finishedSFStockProductForm.invalid) {
        return;
      }
      this.addNew();
    } else {
      if (this.finishedSFStockQuantityForm.invalid) {
        return;
      }
      this.updateExisting();
    }
  }

  addNew() {
    this.finishSFOeningStokModel = new FinishSFOpeningStokModel();
    this.finishSFOeningStokModel = this.finishedSFStockProductForm.value;
    this.finishSFOeningStokModel.finishedSFStockQuantityDetailsList = [];
    this.finishSFOeningStokModel.finishedSFStockQuantityDetailsList = this.finishedSFStokQntyModel;
    this.finishSFOeningStokModel.finishedSFStockQuantityDetailsList.map(x => x.fSFOSStockNo = 0);
    this.finishSFOeningStokModel.finishedSFStockQuantityDetailsList.map(x => x.containerCode = 0);
    this.finishSFOeningStokModel.finishedSFStockQuantityDetailsList.map(x => x.gSCUOMCode = 0);
    this.finishedSFOpeningStksService.addFinishSFOpening(this.finishSFOeningStokModel).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.alertService.success('Finished / Semi Finished Stocks Inserted Successfully');
      } else {
        this.alertService.error('Failed to Insert Finished / Semi Finished Stocks');
      }
      this.OnClear();
    });
  }

  updateExisting() {
    const data = this.finishedSFStockQuantityForm.value;
    data.fSFStockQuantityNo = this.selectedfinishedSFStokQnty.fSFStockQuantityNo;
    this.finishedSFOpeningStksService.updateFinishSFOpeningQty(data).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.alertService.success('Finished / Semi Finished Stocks Updated Successfully');
        this.OnClear();
      } else {
        this.alertService.error('Error while updating stock details!');
      }
    });
  }

  addModePopup() {
    if (this.finishedSFStockQuantityForm.valid) {
      if (this.isProductStockUpdateClicked) {
        this.finishedSFStokQntyModel.push(this.finishedSFStockQuantityForm.value);
        this.openDilog();
      }
    }
  }

  openDilog() {
    if (this.isProductStockUpdateClicked) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do You Want to add more items?'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.finishedSFStockQuantityForm.reset();
        if (result) {
          this.ProcessDate.nativeElement.focus();
        } else {
          this.saveBtn.nativeElement.focus();
        }
      });
    }
  }

  OnFindClick() {
    this.findBtnClicked = true;
    this.isModifyClicked = false;
    this.prodStokUpdBtnDisable = true;
    this.saveBtnDisable = true;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.finishedSFStockProductForm.enable();
    this.OrgOfficeNo.nativeElement.focus();
  }

  OnModifyClick() {
    this.isModifyClicked = true;
    this.findBtnClicked = false;
    this.prodStokUpdBtnDisable = true;
    this.saveBtnDisable = true;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.finishedSFStockProductForm.enable();
    this.OrgOfficeNo.nativeElement.focus();
  }

  findStockDetails() {
    if (this.findBtnClicked || this.isModifyClicked) {
      if (this.isFindValid()) {
        this.finishSFOeningStokModel = this.finishedSFStockProductForm.value;
        this.finishSFOeningStokModel.fSFOSStockEntryDate = new Date();
        this.finishSFOeningStokModel.finishedSFStockQuantityDetailsList = [];
        this.finishedSFOpeningStksService.getStockDetails(this.finishSFOeningStokModel).subscribe((data: any) => {
          if (data.IsSucceed) {
            this.finishedSFStokQntyModel = [];
            this.finishedSFStokQntyModel = data.Data;
            if (this.finishedSFStokQntyModel.length > 0) {
              this.finishedSFStockProductForm.disable();
              this.finishedSFStockProductForm.markAsUntouched();
            }
          }
        });
      }
    }
  }

  onGridItemSelect(qty) {
    this.selectedfinishedSFStokQnty = new FinishedSFStokQntyModel();
    if (this.isProductStockUpdateClicked === false) {
      if (this.isModifyClicked) {
        this.saveBtnDisable = false;
        this.finishedSFStockQuantityForm.enable();
        this.selectedfinishedSFStokQnty = this.finishedSFStokQntyModel.find(a => a.fSFStockQuantityNo === qty.fSFStockQuantityNo);
      }
      this.finishedSFStockQuantityForm.reset();
      this.finishedSFStockQuantityForm.patchValue(qty);
    }
  }

  isFindValid() {
    if (this.finishedSFStockProductForm.controls.orgOfficeNo.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.areaID.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.fSFStockType.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.fSFPackingMode.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.cBCode.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.profInvNo.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.fPVarietyCode.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.productionProcessCode.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.mediaProcessCode.value === null) {
      return false;
    }
    if (this.finishedSFStockProductForm.controls.fPGradeCode.value === null) {
      return false;
    }
    return true;
  }

  deleteConfirm(fSFStockQuantityNo) {
    this.finishedSFOpeningStksService.deleteStockDetals(fSFStockQuantityNo).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.finishedSFStokQntyModel = this.finishedSFStokQntyModel.filter(obj => obj.fSFStockQuantityNo !== fSFStockQuantityNo);
        this.alertService.success('Stock detail deleted Successfully');
      } else {
        this.alertService.error('Failed delete stock detail');
      }
    });
  }

}
