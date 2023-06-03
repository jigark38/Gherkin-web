import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialogRef, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ReceivedMaterial } from '../goods-receipt-note.model';
import { GoodsReceiptNoteService } from '../goods-receipt-note.service';
import { BatchMaterialDetails } from './batch-material-details.models';
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
  selector: 'app-received-material-popup',
  templateUrl: './received-material-popup.component.html',
  styleUrls: ['./received-material-popup.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ReceivedMaterialPopupComponent implements OnInit {
  disableButton: boolean;

  constructor(public dialogRef: MatDialogRef<ReceivedMaterialPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReceivedMaterial, private goodsReceiptNoteService: GoodsReceiptNoteService,
    private alertService: AlertService, private datePipe: DatePipe) { }

  batchMaterialDetailForm = new FormGroup({
    inwardDate: new FormControl({ value: '', disabled: true }),
    igpNo: new FormControl({ value: '', disabled: true }),
    poDate: new FormControl({ value: '', disabled: true }),
    poNo: new FormControl({ value: '', disabled: true }),
    supplierName: new FormControl({ value: '', disabled: true }),
    materialName: new FormControl({ value: '', disabled: true }),
    poQty: new FormControl({ value: '', disabled: true }),
    tillReceivedQty: new FormControl({ value: '', disabled: true }),
    pendingQty: new FormControl({ value: '', disabled: true }),
    batchNo: new FormControl('', [Validators.required]),
    mafgDate: new FormControl(),
    expDate: new FormControl(),
    bagPackSize: new FormControl('', [Validators.pattern(/^(?:\d{0,5}\.\d{1,3})$|^\d{0,5}$/)]),
    uom: new FormControl('KGS'),
    noBagPacks: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    totalQty: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,7}\.\d{1,3})$|^\d{0,7}$/)]),
    unit: new FormControl('MT'),
    billRate: new FormControl('', [Validators.pattern(/^(?:\d{0,10}\.\d{1,3})$|^\d{0,10}$/)]),
    totalAmount: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,17}\.\d{1,3})$|^\d{0,17}$/)]),
    freeBatchNo: new FormControl(),
    freeMafgDate: new FormControl(),
    freeExpDate: new FormControl(),
    freeBagPackSize: new FormControl('', [Validators.pattern(/^(?:\d{0,5}\.\d{1,3})$|^\d{0,5}$/)]),
    freeUom: new FormControl('KGS'),
    freeNoBagPacks: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    freeTotalQty: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,7}\.\d{1,3})$|^\d{0,7}$/)]),
    grossQty: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,12}\.\d{1,3})$|^\d{0,12}$/)]),
    grossAmount: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,17}\.\d{1,3})$|^\d{0,17}$/)]),
    discountAmount: new FormControl('', [Validators.pattern(/^(?:\d{0,9}\.\d{1,3})$|^\d{0,9}$/)]),
    netMaterialAmount: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,17}\.\d{1,3})$|^\d{0,17}$/)]),
    netMaterialRate: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,17}\.\d{1,3})$|^\d{0,17}$/)]),
    receivedQty: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,12}\.\d{1,3})$|^\d{0,12}$/)])

  });
  ngOnInit() {
    if (this.data) {

      this.batchMaterialDetailForm.controls.inwardDate.setValue(this.datePipe.transform(new Date(this.data.InwardDateTime), 'dd-MMM-yyyy') + ' / ' + this.data.InwardGatePassNo);
      this.batchMaterialDetailForm.controls.poDate.setValue(this.datePipe.transform(new Date(this.data.PODate), 'dd-MMM-yyyy') + ' / ' + this.data.PONo);
      this.batchMaterialDetailForm.controls.supplierName.setValue(this.data.SupplierNamePlace);
      this.batchMaterialDetailForm.controls.materialName.setValue(this.data.MaterialName);
      this.batchMaterialDetailForm.controls.poQty.setValue(this.data.POQuantity);
      this.batchMaterialDetailForm.controls.tillReceivedQty.setValue(this.data.TillNowRecordQuantity);
      this.batchMaterialDetailForm.controls.pendingQty.setValue(this.data.PendingQuatity);
      if (this.data.BatchNo) {
        this.getBatchMaterialDetailsByBatchNo(this.data.BatchNo.toString());
      }
    }
  }

  getBatchMaterialDetailsByBatchNo(batchNo: string) {
    this.goodsReceiptNoteService.getBatchMaterialDetailsByBatchNo(batchNo).subscribe((res) => {
      if (res && res.Data) {
        let batchMaterialDetails = res.Data;
        this.setBatchMaterialData(batchMaterialDetails);
      }
    });
  }

  setBatchMaterialData(batchMaterialDetails: BatchMaterialDetails) {
    //batchMaterialDetails.RM_GRN_NO = this.data.BatchNo.toString(); // TODO
    this.batchMaterialDetailForm.controls.batchNo.setValue(batchMaterialDetails.Batch_No_Lot_No);
    this.batchMaterialDetailForm.controls.mafgDate.setValue(batchMaterialDetails.Mfg_Date);
    this.batchMaterialDetailForm.controls.expDate.setValue(batchMaterialDetails.Expiry_Date);
    this.batchMaterialDetailForm.controls.bagPackSize.setValue(batchMaterialDetails.Bag_Pack_Size);
    this.batchMaterialDetailForm.controls.uom.setValue(batchMaterialDetails.Bag_Pack_UOM);
    this.batchMaterialDetailForm.controls.noBagPacks.setValue(batchMaterialDetails.No_Bags_Packs);
    this.batchMaterialDetailForm.controls.totalQty.setValue(batchMaterialDetails.Total_Quantity);
    this.batchMaterialDetailForm.controls.unit.setValue(batchMaterialDetails.Total_Qty_UOM);
    this.batchMaterialDetailForm.controls.billRate.setValue(batchMaterialDetails.Bill_Rate);
    this.batchMaterialDetailForm.controls.totalAmount.setValue(batchMaterialDetails.Total_Amount);
    this.batchMaterialDetailForm.controls.freeBatchNo.setValue(batchMaterialDetails.Free_Batch_No);
    this.batchMaterialDetailForm.controls.freeMafgDate.setValue(batchMaterialDetails.Free_Mfg_Date);
    this.batchMaterialDetailForm.controls.freeExpDate.setValue(batchMaterialDetails.Free_Expiry_Date);
    this.batchMaterialDetailForm.controls.freeBagPackSize.setValue(batchMaterialDetails.Free_Bag_Pack_Size);
    this.batchMaterialDetailForm.controls.freeUom.setValue(batchMaterialDetails.Free_Bag_Pack_UOM);
    this.batchMaterialDetailForm.controls.freeNoBagPacks.setValue(batchMaterialDetails.Free_No_Bags_Packs);
    this.batchMaterialDetailForm.controls.freeTotalQty.setValue(batchMaterialDetails.Free_Total_Quantity);
    this.batchMaterialDetailForm.controls.grossQty.setValue(batchMaterialDetails.Gross_Total_Quantity);
    this.batchMaterialDetailForm.controls.grossAmount.setValue(batchMaterialDetails.Gross_Total_Material_Amount);
    this.batchMaterialDetailForm.controls.discountAmount.setValue(batchMaterialDetails.Discount_Amount);
    this.batchMaterialDetailForm.controls.netMaterialAmount.setValue(batchMaterialDetails.Net_Material_Amount);
    this.batchMaterialDetailForm.controls.netMaterialRate.setValue(batchMaterialDetails.Net_Material_Rate);
    this.batchMaterialDetailForm.controls.receivedQty.setValue(batchMaterialDetails.Received_Quantity);
  }

  prepareBatchMaterialDetails(): BatchMaterialDetails {
    let batchMaterialDetails: BatchMaterialDetails = new BatchMaterialDetails();
    batchMaterialDetails.RM_GRN_NO = this.data.BatchNo ? this.data.BatchNo.toString() : null; // TODO
    batchMaterialDetails.Batch_No_Lot_No = this.batchMaterialDetailForm.controls.batchNo.value;
    batchMaterialDetails.Mfg_Date = new Date(this.batchMaterialDetailForm.controls.mafgDate.value).toLocaleDateString();
    batchMaterialDetails.Expiry_Date = new Date(this.batchMaterialDetailForm.controls.expDate.value).toLocaleDateString();
    batchMaterialDetails.Bag_Pack_Size = +this.batchMaterialDetailForm.controls.bagPackSize.value;
    batchMaterialDetails.Bag_Pack_UOM = this.batchMaterialDetailForm.controls.uom.value;
    batchMaterialDetails.No_Bags_Packs = +this.batchMaterialDetailForm.controls.noBagPacks.value;
    batchMaterialDetails.Total_Quantity = +this.batchMaterialDetailForm.controls.totalQty.value;
    batchMaterialDetails.Total_Qty_UOM = this.batchMaterialDetailForm.controls.unit.value;
    batchMaterialDetails.Bill_Rate = +this.batchMaterialDetailForm.controls.billRate.value;
    batchMaterialDetails.Total_Amount = +this.batchMaterialDetailForm.controls.totalAmount.value;
    batchMaterialDetails.Free_Batch_No = this.batchMaterialDetailForm.controls.freeBatchNo.value;
    batchMaterialDetails.Free_Mfg_Date = new Date(this.batchMaterialDetailForm.controls.freeMafgDate.value).toLocaleDateString();
    batchMaterialDetails.Free_Expiry_Date = new Date(this.batchMaterialDetailForm.controls.freeExpDate.value).toLocaleDateString();
    batchMaterialDetails.Free_Bag_Pack_Size = +this.batchMaterialDetailForm.controls.freeBagPackSize.value;
    batchMaterialDetails.Free_Bag_Pack_UOM = this.batchMaterialDetailForm.controls.freeUom.value;
    batchMaterialDetails.Free_No_Bags_Packs = +this.batchMaterialDetailForm.controls.freeNoBagPacks.value;
    batchMaterialDetails.Free_Total_Quantity = +this.batchMaterialDetailForm.controls.freeTotalQty.value;
    batchMaterialDetails.Gross_Total_Quantity = +this.batchMaterialDetailForm.controls.grossQty.value;
    batchMaterialDetails.Gross_Total_Material_Amount = +this.batchMaterialDetailForm.controls.grossAmount.value;
    batchMaterialDetails.Discount_Amount = +this.batchMaterialDetailForm.controls.discountAmount.value;
    batchMaterialDetails.Net_Material_Amount = +this.batchMaterialDetailForm.controls.netMaterialAmount.value;
    batchMaterialDetails.Net_Material_Rate = +this.batchMaterialDetailForm.controls.netMaterialRate.value;
    batchMaterialDetails.Received_Quantity = +this.batchMaterialDetailForm.controls.receivedQty.value;
    return batchMaterialDetails;
  }



  changebagPackSize() {

    let bagPackSize = +this.batchMaterialDetailForm.controls.bagPackSize.value;
    let noBagPacks = +this.batchMaterialDetailForm.controls.noBagPacks.value;
    let unit = this.batchMaterialDetailForm.controls.unit.value;
    let uom = this.batchMaterialDetailForm.controls.uom.value;

    if (!isNaN(bagPackSize) && !isNaN(noBagPacks)) {
      let totalAmount = bagPackSize * noBagPacks;
      if (uom == 'KGS' && unit == 'MT') {
        totalAmount = totalAmount / 1000;
      } else if (uom == 'GRAMS' && unit == 'KGS') {
        totalAmount = totalAmount / 1000;
      }
      else if (uom == 'ML' && unit == 'LTS') {
        totalAmount = totalAmount / 1000;
      }
      this.batchMaterialDetailForm.controls.totalQty.setValue(totalAmount.toFixed(3));
    } else {
      this.batchMaterialDetailForm.controls.totalQty.setValue(0);
    }
    this.calculateGrossQty();

  }

  changeBillRate() {
    let totalQty = +this.batchMaterialDetailForm.controls.totalQty.value;
    let billRate = +this.batchMaterialDetailForm.controls.billRate.value;

    if (totalQty > 0 && !isNaN(billRate)) {
      let totalAmount = billRate * totalQty;

      this.batchMaterialDetailForm.controls.totalAmount.setValue(totalAmount.toFixed(3));
    } else {
      this.batchMaterialDetailForm.controls.totalAmount.setValue(0);
    }
    this.calculateTotalAmount();
  }

  changeFreebagPackSize() {
    let bagPackSize = +this.batchMaterialDetailForm.controls.freeBagPackSize.value;
    let noBagPacks = +this.batchMaterialDetailForm.controls.freeNoBagPacks.value;
    if (!isNaN(bagPackSize) && !isNaN(noBagPacks)) {
      this.batchMaterialDetailForm.controls.freeTotalQty.setValue((bagPackSize * noBagPacks).toFixed(3));
    } else {
      this.batchMaterialDetailForm.controls.freeTotalQty.setValue(0);
    }

    this.calculateGrossQty();
  }

  calculateGrossQty() {
    let totalQty = +this.batchMaterialDetailForm.controls.totalQty.value;
    let freeTotalQty = +this.batchMaterialDetailForm.controls.freeTotalQty.value;
    if (!isNaN(totalQty) && !isNaN(freeTotalQty)) {
      this.batchMaterialDetailForm.controls.grossQty.setValue(totalQty + freeTotalQty);
    } else {
      this.batchMaterialDetailForm.controls.grossQty.setValue(0);
    }

    this.calculateTotalAmount();

  }
  calculateTotalAmount() {
    let totalAmount = +this.batchMaterialDetailForm.controls.totalAmount.value;
    this.batchMaterialDetailForm.controls.grossAmount.setValue(totalAmount);
    this.calculateNetAmount();

  }

  calculateNetAmount() {
    let discountAmount = +this.batchMaterialDetailForm.controls.discountAmount.value;
    let grossAmount = +this.batchMaterialDetailForm.controls.grossAmount.value;
    let totalQty = +this.batchMaterialDetailForm.controls.totalQty.value;
    let grossQty = +this.batchMaterialDetailForm.controls.grossQty.value;
    if (!isNaN(discountAmount) && !isNaN(grossAmount) && !isNaN(totalQty) && grossAmount > discountAmount) {
      this.batchMaterialDetailForm.controls.netMaterialAmount.setValue(grossAmount - discountAmount);
      this.batchMaterialDetailForm.controls.netMaterialRate.setValue((grossAmount / grossQty).toFixed(3));
    } else {
      this.batchMaterialDetailForm.controls.netMaterialAmount.setValue(0);
      this.batchMaterialDetailForm.controls.netMaterialRate.setValue(0);
    }
  }
  changeUOM() {

  }
  changeUnit() {
    this.changebagPackSize();
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

  updateBatchMaterialDetails() {
    let batchMaterialDetails: BatchMaterialDetails = this.prepareBatchMaterialDetails();


  }
  save() {
    if (this.batchMaterialDetailForm.valid) {
      this.disableButton = true;
      let batchMaterialDetails: BatchMaterialDetails = this.prepareBatchMaterialDetails();
      this.goodsReceiptNoteService.updateBatchMaterialDetails(batchMaterialDetails).subscribe((res) => {
        this.disableButton = false;
        if (res && res.Data) {
          this.alertService.success('Data updated sucessfully.')
          this.dialogRef.close(res.Data);
        } else {
          this.alertService.error('Error has occured while saving.');
          this.onNoClick();
        }

      }, err => {
        this.alertService.error('Error has occured while saving.');
      });

    } else {
      this.markFieldAsTouched(this.batchMaterialDetailForm);
    }
  }
  cancel() {
    this.batchMaterialDetailForm.reset();
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
