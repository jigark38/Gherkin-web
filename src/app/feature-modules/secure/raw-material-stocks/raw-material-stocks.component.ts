import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { RawMaterialStocks } from './IRawMaterialStocks.model';
import { IStockDetails } from './IStockDetails.model';
import { isNgTemplate } from '@angular/compiler';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { RawMaterialStockDetails } from './IRawMaterialStockDetails.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog, MatSelect } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { RawMaterialStocksServiceService } from './raw-material-stocks-service.service';
import { RMStockDetails } from './raw-material-stocks.model';
import { MomentUtcDateAdapter } from '../../../shared/directives/moment-utc-date-adapter';
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
  selector: 'app-raw-material-stocks',
  templateUrl: './raw-material-stocks.component.html',
  styleUrls: ['./raw-material-stocks.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class RawMaterialStocksComponent implements OnInit {

  @ViewChild('stockDate', { static: false }) stockDateField: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('grnDate', { static: false }) grnDateField: ElementRef;
  @ViewChild('unit', { read: MatSelect, static: false }) unit: MatSelect;

  rawMaterialStockForm: FormGroup;
  stockDetailsArray: FormArray;

  stockArray: IStockDetails[];

  stocksObject: any[];

  rawMaterialStockDetails: RawMaterialStocks;
  rmStockDetails: RMStockDetails;

  getRawMaterialData: any;
  formArrayCount: number;
  stocksCount = 0;
  submitted = false;
  isStockOperation = false;
  isStockLotExist = false;

  public SelectedRowId = 0;
  IsRowSelected = false;
  IsModifyClicked = false;
  IsFindClicked = false;
  IsStockToBeModified = false;
  stockToBeModified: any;
  IsLoading = false;
  materialNameList: any[] = [];

  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  constructor(private formBuilder: FormBuilder, private service: WebservicewrapperService, private alertService: AlertService,
    // tslint:disable-next-line: align
    public dialog: MatDialog, private rawMaterialService: RawMaterialStocksServiceService) {
    this.formArrayCount = 0;
    this.stockArray = [];
    this.stocksObject = [];
  }

  ngOnInit() {
    this.createForm();
    this.onChanges();
    this.enableNew = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;

    this.service.GetRawMaterialStockData().subscribe(
      (data) => {
        this.getRawMaterialData = data;
        console.log(this.getRawMaterialData);
      },
      (error) => console.log(error)
    );
  }
  createForm() {
    try {
      this.rawMaterialStockForm = this.formBuilder.group({
        stockDate: ['', Validators.required],
        stockNo: ['0', Validators.required],
        unit: ['', Validators.required],
        natureOffice: ['', Validators.required],
        materialGroup: ['', Validators.required],
        materialName: ['', Validators.required],
        uom: ['', Validators.required],
        detailedQty: ['', Validators.required],
        totalQuantity: [0, Validators.required],
        totalMaterialCost: [0, Validators.required],
        grnDate: ['', Validators.required],
        grnNo: ['', Validators.required],
        quantity: [null, [Validators.required, Validators.pattern(/^(?:\d{0,10}\.\d{1,3})$|^\d{0,10}$/)]],
        rate: [null, [Validators.required, Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]],
        amount: [null, [Validators.required, Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,15}$/)]],
      });
      this.rawMaterialStockForm.disable();

    } catch (error) {
      console.log('Method: createForm', error);
    }
  }

  onChanges(): void {
    try {
      this.rawMaterialStockForm.get('unit').valueChanges.subscribe(val => {
        if (this.rawMaterialStockForm.controls.unit.value) {
          const unitCode = this.rawMaterialStockForm.controls.unit.value;
          const office = this.getRawMaterialData.OrganisationOfficeLocationDetails.filter(a => a.OrgOfficeNo === unitCode)[0];
          this.rawMaterialStockForm.controls.natureOffice.setValue(office.NatureOfficeDetails);
        }
      });

      this.rawMaterialStockForm.get('materialGroup').valueChanges.subscribe(val => {
        if (this.rawMaterialStockForm.controls.materialGroup.value) {
          this.rawMaterialStockForm.controls.uom.setValue('');
          const code = this.rawMaterialStockForm.controls.materialGroup.value;
          this.materialNameList = this.getRawMaterialData.RawMaterialDetails.filter(a => a.Raw_Material_Group_Code === code);

        } else {
          this.materialNameList = [];
          this.rawMaterialStockForm.controls.uom.setValue('');
        }
      });

      this.rawMaterialStockForm.get('materialName').valueChanges.subscribe(val => {
        if (this.rawMaterialStockForm.controls.materialName.value) {
          const code = this.rawMaterialStockForm.controls.materialName.value;
          const selectedMaterial = this.materialNameList.filter(a => a.Raw_Material_Details_Code === code)[0];
          this.rawMaterialStockForm.controls.uom.setValue(selectedMaterial.Raw_Material_UOM);
        }
      });

      this.rawMaterialStockForm.get('quantity').valueChanges.subscribe(val => {
        if (this.rawMaterialStockForm.controls.quantity.value !== null
          && this.rawMaterialStockForm.controls.rate.value !== null) {
          const totalQuantity = +this.rawMaterialStockForm.controls.quantity.value as number;
          const stockTotalQty = +this.rawMaterialStockForm.controls.rate.value as number;
          const resQty = totalQuantity * stockTotalQty;
          this.rawMaterialStockForm.controls.amount.setValue(resQty);
        }
      });
      this.rawMaterialStockForm.get('rate').valueChanges.subscribe(val => {
        if (this.rawMaterialStockForm.controls.quantity.value !== null
          && this.rawMaterialStockForm.controls.rate.value !== null) {
          const totalQuantity = +this.rawMaterialStockForm.controls.quantity.value as number;
          const stockTotalQty = +this.rawMaterialStockForm.controls.rate.value as number;
          const resQty = totalQuantity * stockTotalQty;
          this.rawMaterialStockForm.controls.amount.setValue(resQty);
        }
      });
    } catch (error) {

    }
  }
  get f() { return this.rawMaterialStockForm.controls; }

  find() {
    try {
      this.unit.focus();
      this.enableFind = false;
      this.enableSave = false;
      this.enableNew = false;
      this.enableModify = false;
      this.IsFindClicked = true;
      this.rawMaterialStockForm.enable();
      this.rawMaterialStockForm.controls.natureOffice.disable();
      this.rawMaterialStockForm.controls.stockNo.disable();
      this.rawMaterialStockForm.controls.uom.disable();
      this.rawMaterialStockForm.controls.totalMaterialCost.disable();
      this.rawMaterialStockForm.controls.totalQuantity.disable();
      this.rawMaterialStockForm.controls.amount.disable();
    } catch (error) {

    }
  }

  searchStockDetail() {
    if (this.IsFindClicked || this.IsModifyClicked) {
      this.rawMaterialService.getRMStockDetail(this.rawMaterialStockForm.controls.unit.value,
        this.rawMaterialStockForm.controls.materialGroup.value, this.rawMaterialStockForm.controls.materialName.value)
        .subscribe((res: any) => {
          if (res.IsSucceed) {
            if (res.Data !== null || res.Data !== undefined) {
              const data = res;
              this.rmStockDetails = new RMStockDetails();
              this.rmStockDetails = res.Data;
              this.rawMaterialStockForm.patchValue(this.rmStockDetails);
              this.rawMaterialStockForm.controls.materialGroup.disable();
              this.rawMaterialStockForm.controls.materialName.disable();
              this.stocksObject = this.rmStockDetails.rmstockLotDetailsList;
            } else {
              this.alertService.error('No data found for specefic search');
            }
          } else {
            this.alertService.error('There is some error while prococessing your request.Please try again.');
          }
        });
    }
  }

  RowSelected(RowId: any, model: any) {
    this.SelectedRowId = RowId;
    this.IsRowSelected = true;
    this.stockToBeModified = model;
    this.rawMaterialStockForm.controls.grnDate.setValue(this.stockToBeModified.grnDate);
    this.rawMaterialStockForm.controls.grnNo.setValue(this.stockToBeModified.grnNo);
    this.rawMaterialStockForm.controls.quantity.setValue(this.stockToBeModified.quantity);
    this.rawMaterialStockForm.controls.rate.setValue(this.stockToBeModified.rate);
    this.rawMaterialStockForm.controls.amount.setValue(this.stockToBeModified.amount);
    this.rawMaterialStockForm.controls.grnDate.valueChanges.subscribe(
      (selectedValue) => {
        if (this.IsRowSelected && this.IsModifyClicked) {
          const item = this.stocksObject.find(a => a.grnId === model.grnId);
          item.grnDate = this.rawMaterialStockForm.controls.grnDate.value;
        }
      }
    );
    this.rawMaterialStockForm.controls.grnNo.valueChanges.subscribe(
      (selectedValue) => {
        if (this.IsRowSelected && this.IsModifyClicked) {
          const item = this.stocksObject.find(a => a.grnId === model.grnId);
          item.grnNo = this.rawMaterialStockForm.controls.grnNo.value;
        }
      }
    );
    this.rawMaterialStockForm.controls.quantity.valueChanges.subscribe(
      (selectedValue) => {
        if (this.IsRowSelected && this.IsModifyClicked) {
          const item = this.stocksObject.find(a => a.grnId === model.grnId);
          item.quantity = this.rawMaterialStockForm.controls.quantity.value;
          item.amount = this.rawMaterialStockForm.controls.amount.value;
        }
      }
    );
    this.rawMaterialStockForm.controls.rate.valueChanges.subscribe(
      (selectedValue) => {
        if (this.IsRowSelected && this.IsModifyClicked) {
          const item = this.stocksObject.find(a => a.grnId === model.grnId);
          item.rate = this.rawMaterialStockForm.controls.rate.value;
          item.amount = this.rawMaterialStockForm.controls.amount.value;
        }
      }
    );
  }

  ModifyStock() {
    this.submitted = true;
    this.isStockOperation = true;
    if (this.rawMaterialStockForm.invalid) {
      return;
    }
    this.submitted = false;
    this.isStockOperation = false;
    let totalQuantity = 0;
    let stockTotalQty = 0;
    let resQty = 0;
    let totalMaterialCost = 0;
    let stockAmount = 0;
    let resTotalCost = 0;
    this.IsStockToBeModified = false;

    try {
      this.stocksObject.find(a => a.id === this.stockToBeModified.id).grnDate = this.rawMaterialStockForm.controls.grnDate.value;
      this.stocksObject.find(a => a.id === this.stockToBeModified.id).grnNo = this.rawMaterialStockForm.controls.grnNo.value;
      this.stocksObject.find(a => a.id === this.stockToBeModified.id).quantity = +this.rawMaterialStockForm.controls.quantity.value;
      this.stocksObject.find(a => a.id === this.stockToBeModified.id).rate = +this.rawMaterialStockForm.controls.rate.value;
      this.stocksObject.find(a => a.id === this.stockToBeModified.id).amount = +this.rawMaterialStockForm.controls.amount.value;

      if (this.stocksCount === 1) {
        totalQuantity = +this.rawMaterialStockForm.controls.totalQuantity.value as number;
        stockTotalQty = +this.rawMaterialStockForm.controls.quantity.value as number;
        resQty = totalQuantity + stockTotalQty;

        totalMaterialCost = +this.rawMaterialStockForm.controls.totalMaterialCost.value as number;
        stockAmount = +this.rawMaterialStockForm.controls.amount.value as number;
        resTotalCost = totalMaterialCost + stockAmount;
      } else {
        resQty = this.stocksObject.reduce((prev, cur) => prev + cur.quantity, 0);
        resTotalCost = this.stocksObject.reduce((prev, cur) => prev + cur.amount, 0);
      }

      const avgRate = resTotalCost / resQty;

      this.rawMaterialStockForm.controls.totalQuantity.setValue(resQty);
      this.rawMaterialStockForm.controls.totalMaterialCost.setValue(resTotalCost);
      this.rawMaterialStockForm.controls.avgRate.setValue(avgRate);

      this.rawMaterialStockForm.controls.grnDate.reset();
      this.rawMaterialStockForm.controls.grnNo.reset();
      this.rawMaterialStockForm.controls.quantity.reset();
      this.rawMaterialStockForm.controls.rate.reset();
      this.rawMaterialStockForm.controls.amount.reset();

    } catch (error) {
      // console.log('Method: onChanges', error);
    }
  }
  // Modify() {
  //   try {
  //     this.IsStockToBeModified = true;
  //     const data = this.stocksObject.filter(a => a.id === this.stockToBeModified.id).pop();
  //     this.rawMaterialStockForm.controls.grnDate.setValue(data.grnDate);
  //     this.rawMaterialStockForm.controls.grnNo.setValue(data.grnNo);
  //     this.rawMaterialStockForm.controls.quantity.setValue(data.quantity);
  //     this.rawMaterialStockForm.controls.rate.setValue(data.rate);
  //     this.rawMaterialStockForm.controls.amount.setValue(data.amount);

  //   } catch (error) {
  //     // console.log('Method: Modify', error);
  //   }
  // }

  Modify() {
    this.find();
    this.IsModifyClicked = true;
    this.enableSave = true;
    this.IsFindClicked = false;
  }


  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }


  addStock() {
    try {
      setTimeout(() => {
        this.stockDateField.nativeElement.focus();
        this.rawMaterialStockForm.controls.stockDate.setValue(new Date());
      }, 100);
      this.rawMaterialStockForm.enable();
      this.rawMaterialStockForm.controls.natureOffice.disable();
      this.rawMaterialStockForm.controls.stockNo.disable();
      this.rawMaterialStockForm.controls.uom.disable();
      this.rawMaterialStockForm.controls.totalMaterialCost.disable();
      this.rawMaterialStockForm.controls.totalQuantity.disable();
      this.rawMaterialStockForm.controls.amount.disable();
      this.enableNew = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;

    } catch (error) {

    }
  }

  pushStock(): void {
    try {
      if (this.IsRowSelected) {
        return;
      }
      this.submitted = true;
      this.isStockOperation = true;
      this.markFieldAsTouched(this.rawMaterialStockForm);
      if (this.rawMaterialStockForm.invalid) {
        return;
      }
      this.submitted = false;
      this.isStockOperation = false;
      this.stocksCount = this.stocksCount + 1;
      this.isStockLotExist = true;

      let totalQuantity = 0;
      let stockTotalQty = 0;
      let resQty = 0;
      let totalMaterialCost = 0;
      let stockAmount = 0;
      let resTotalCost = 0;

      this.stocksObject.push({
        id: this.stocksCount,
        grnDate: this.rawMaterialStockForm.controls.grnDate.value,
        grnNo: this.rawMaterialStockForm.controls.grnNo.value,
        quantity: +this.rawMaterialStockForm.controls.quantity.value,
        rate: +this.rawMaterialStockForm.controls.rate.value,
        amount: +this.rawMaterialStockForm.controls.amount.value,
      });

      if (this.stocksCount === 1) {
        totalQuantity = +this.rawMaterialStockForm.controls.totalQuantity.value as number;
        stockTotalQty = +this.rawMaterialStockForm.controls.quantity.value as number;
        resQty = totalQuantity + stockTotalQty;

        totalMaterialCost = +this.rawMaterialStockForm.controls.totalMaterialCost.value as number;
        stockAmount = +this.rawMaterialStockForm.controls.amount.value as number;
        resTotalCost = totalMaterialCost + stockAmount;
      } else {
        resQty = this.stocksObject.reduce((prev, cur) => prev + cur.quantity, 0);
        resTotalCost = this.stocksObject.reduce((prev, cur) => prev + cur.amount, 0);
      }
      this.rawMaterialStockForm.controls.totalQuantity.setValue(resQty);
      this.rawMaterialStockForm.controls.totalMaterialCost.setValue(resTotalCost);
      if (this.rawMaterialStockForm.controls.detailedQty.value !== 'No Lots') {


        this.rawMaterialStockForm.controls.stockDate.disable();
        this.rawMaterialStockForm.controls.unit.disable();
        this.rawMaterialStockForm.controls.natureOffice.disable();
        this.rawMaterialStockForm.controls.materialGroup.disable();
        this.rawMaterialStockForm.controls.materialName.disable();
        this.rawMaterialStockForm.controls.detailedQty.disable();

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more items?'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.rawMaterialStockForm.controls.grnDate.reset();
            this.rawMaterialStockForm.controls.grnNo.reset();
            this.rawMaterialStockForm.controls.quantity.reset();
            this.rawMaterialStockForm.controls.rate.reset();
            this.rawMaterialStockForm.controls.amount.reset();
            setTimeout(() => {
              this.grnDateField.nativeElement.focus();
              this.rawMaterialStockForm.controls.grnDate.setValue(new Date());
            }, 100);

          } else {
            setTimeout(() => {
              this.saveButton.nativeElement.focus();
            }, 100);
          }
        });
      } else {
        setTimeout(() => {
          this.saveButton.nativeElement.focus();
        }, 100);
      }



    } catch (error) {

    }

  }
  clearValues(): void {
    this.isStockLotExist = false;
    this.enableNew = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.IsFindClicked = false;
    this.IsRowSelected = false;
    this.IsModifyClicked = false;
    this.stocksObject = [];
    this.rawMaterialStockForm.reset();
    this.rawMaterialStockForm.controls.materialGroup.enable();
    this.rawMaterialStockForm.controls.materialName.enable();
  }

  prepareData(): void {
    try {
      this.rawMaterialStockDetails = new RawMaterialStocks();
      this.rawMaterialStockDetails.RMStockLotDetails = [];
      this.rawMaterialStockDetails.RawMaterialStocks = new RawMaterialStockDetails();
      this.rawMaterialStockDetails.RawMaterialStocks.stockDate = this.rawMaterialStockForm.controls.stockDate.value;
      this.rawMaterialStockDetails.RawMaterialStocks.stockNo = this.rawMaterialStockForm.controls.stockNo.value;
      this.rawMaterialStockDetails.RawMaterialStocks.areaName = this.rawMaterialStockForm.controls.natureOffice.value;
      this.rawMaterialStockDetails.RawMaterialStocks.areaCode = this.rawMaterialStockForm.controls.unit.value;
      this.rawMaterialStockDetails.RawMaterialStocks.materialGroup = this.rawMaterialStockForm.controls.materialGroup.value;
      this.rawMaterialStockDetails.RawMaterialStocks.materialName = this.rawMaterialStockForm.controls.materialName.value;
      this.rawMaterialStockDetails.RawMaterialStocks.uom = this.rawMaterialStockForm.controls.uom.value;
      this.rawMaterialStockDetails.RawMaterialStocks.detailedQty = this.rawMaterialStockForm.controls.detailedQty.value;
      this.rawMaterialStockDetails.RawMaterialStocks.totalQuantity = this.rawMaterialStockForm.controls.totalQuantity.value;
      this.rawMaterialStockDetails.RawMaterialStocks.totalMaterialCost = this.rawMaterialStockForm.controls.totalMaterialCost.value;
      for (const item of this.stocksObject) {
        this.rawMaterialStockDetails.RMStockLotDetails.push({
          grnDate: item.grnDate,
          grnNo: item.grnNo,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        });
      }
    } catch (error) {
      // console.log('Method: prepareDate', error);
    }

  }
  submitForm(): void {
    try {
      this.submitted = true;
      // this.IsLoading = true;
      this.isStockOperation = false;
      // if (this.rawMaterialStockForm.invalid) {
      //   // return;
      //   console.log('InValid');
      // } else {
      // console.log('Valid');
      if (this.IsModifyClicked) {
        this.rmStockDetails.stockDate = this.rawMaterialStockForm.controls.stockDate.value;
        this.rmStockDetails.stockNo = this.rawMaterialStockForm.controls.stockNo.value;
        this.rmStockDetails.areaName = this.rawMaterialStockForm.controls.natureOffice.value;
        this.rmStockDetails.areaCode = this.rawMaterialStockForm.controls.unit.value;
        this.rmStockDetails.materialGroup = this.rawMaterialStockForm.controls.materialGroup.value;
        this.rmStockDetails.materialName = this.rawMaterialStockForm.controls.materialName.value;
        this.rmStockDetails.uom = this.rawMaterialStockForm.controls.uom.value;
        this.rmStockDetails.detailedQty = this.rawMaterialStockForm.controls.detailedQty.value;
        this.rmStockDetails.totalQuantity = this.rawMaterialStockForm.controls.totalQuantity.value;
        this.rmStockDetails.totalMaterialCost = this.rawMaterialStockForm.controls.totalMaterialCost.value;
        this.rmStockDetails.rmstockLotDetailsList = this.stocksObject;
        this.rawMaterialService.updateRMStockDetail(this.rmStockDetails)
          .subscribe((res: any) => {
            if (res.IsSucceed) {
              this.clearValues();
              this.alertService.success('Your material stock updated successfully.');
            } else {
              this.alertService.error('There is some error while prococessing your request.Please try again.');
            }
          });
      } else {
        this.prepareData();
        // create raw material details
        this.service.PostRawMaterialStocks(this.rawMaterialStockDetails).subscribe(
          (data) => {
            if (data.IsSucceed) {
              this.IsLoading = false;
              this.submitted = false;
              this.stocksCount = 0;
              this.clearValues();
              this.alertService.success('Your material stock added successfully.');
            } else {
              this.alertService.error(data.ErrorMessages[0]);
            }
          },
          (error) => {
            this.IsLoading = false;
            this.submitted = false;
            this.alertService.error('There is some error while prococessing your request.Please try again.');
          }
        );
      }
    } catch (error) {
      console.log(error);
    }

  }

}
