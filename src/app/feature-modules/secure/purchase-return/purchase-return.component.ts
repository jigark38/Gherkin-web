import { map } from 'rxjs/operators';
import { OutwardGatePassDetails } from './../../../shared/models/input-transfer.model';
import { DatePipe } from '@angular/common';
import { ngColumnType, ActionParams } from './../../../shared/components/ng-grid/grid.models';
import { forkJoin, merge } from 'rxjs';
import { PurchaseReturnService } from './purchase-return.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import { FormControl, Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PurchaseMaterialDetail, CreatePurchageReturnModel, OutwardGatePassDetail, PurchageReturnMaterialDetail, PurchageReturnDetail } from './purchase-return.model';

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
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    MessageService
  ],
})

export class PurchaseReturnComponent implements OnInit {
  purchaseReturnDetailsForm: FormGroup;

  suppliers: any;
  employeeList: any;
  modifyPurchaseReceviedDetailsGridData: any = [];
  purchaseReceviedDetailsGridData: any;
  purchaseMaterialDetailsGridData: PurchaseMaterialDetail[] = [];
  maxPackingAmount = 0;
  maxFreightAmount = 0;
  maxInsAmt = 0;
  purchaseReturnModel: CreatePurchageReturnModel;
  selectedRowPurchaseRevdDetail: any;
  selectedRowPurchaseMatrlDetail: PurchaseMaterialDetail;
  actionParams: ActionParams;
  actionParams1: ActionParams;
  min = 0;
  max = 10;
  modifyMode = false;
  purchaseReturns: any;
  disableNew: boolean;
  disableModify: boolean;
  modifyPurchaseReturn: CreatePurchageReturnModel;

  constructor(private purchaseReturnService: PurchaseReturnService, private formBuilder: FormBuilder, private datePipe: DatePipe,
    // tslint:disable-next-line:align
    private renderer: Renderer2, private messageService: MessageService) { }
  orgCols1: any[];
  orgCols2: any[];
  @ViewChild('prPackingAmount', null) prPackingAmount: ElementRef;
  @ViewChild('purchaseReturnBtn', null) purchaseReturnBtn: ElementRef;
  @ViewChild('supplierCtrl', null) supplierCtrl;
  @ViewChild('PRCtrl', null) PRCtrl;

  ngOnInit() {
    this.createForm();
    this.initData();
    this.onChanges();
  }

  onChanges() {
    try {
      this.purchaseReturnDetailsForm.get('supplierOrgId').valueChanges.subscribe(val => {
        if (val) {
          forkJoin(this.purchaseReturnService.getPlaceNameBySuppOrgId(val),
            this.purchaseReturnService.getPurchaseRecievedDetails(val)).
            subscribe((res: any[]) => {
              if (res) {
                this.purchaseReturnDetailsForm.controls.placeName.patchValue(res[0].PlaceName);
                this.purchaseReceviedDetailsGridData = res[1].map(data => ({
                  grn_Date_No: `${this.datePipe.transform(data.grnDate, 'dd-MMM-yyyy h:mm:ss').concat(' / ').concat(data.rmGrnNo)}`,
                  invoice_Date_No: `${this.datePipe.transform(data.invoiceDate, 'dd-MMM-yyyy h:mm:ss').concat(' / ').concat(data.invoiceNo)}`,
                  invoice_Amount: `${data.rmGrnMaterialWiseTotalCost}`,
                  rmGrnNo: data.rmGrnNo,
                  rawMaterialGroupCode: data.rawMaterialGroupCode,
                  rawMaterialDetailsCode: data.rawMaterialDetailsCode,
                  rmGrnMaterialTransferQty: data.rmGrnMaterialTransferQty
                }));
                if (!this.modifyMode) {
                  this.resetControls();
                  this.disableNew = true;
                } else {
                  this.resetControls();
                  this.modifyPurchaseReceviedDetailsGridData = this.purchaseReceviedDetailsGridData;
                  this.purchaseReceviedDetailsGridData = [];
                  this.PRCtrl.focus();
                  this.purchaseReturnDetailsForm.controls.purchageReturnNo.enable();
                }
                this.purchaseMaterialDetailsGridData = [];
              }
            });

          this.purchaseReturnService.GetPurchaseReturnIdsBySuppOrgId(val).subscribe((data) => {
            if (data.IsSucceed && data.Data && data.Data.length > 0) {
              this.purchaseReturns = data.Data;
            }
          });
        }
      });
    } catch (error) {
      console.log('Method: onChanges', error);
    }
  }

  initData() {
    this.orgCols1 = [
      // { field: '', header: '' },
      { field: 'grn_Date_No', header: 'GRN Date / No' },
      { field: 'invoice_Date_No', header: 'Invoice Date / No' },
      { field: 'invoice_Amount', header: 'Invoice Amount' },
    ];
    this.orgCols2 = [
      // take field name from table
      // { field: '', header: '' },
      { field: 'rawMaterialDetailsName', header: 'Material Name' },
      { field: 'rmGrnBillQty', header: 'Invoice Quantity' },
      { field: 'rmGrnReceivedQty', header: 'Received Quantity' },
      { field: 'rmGrnMaterialTransferQty', header: 'Used Quantity' },
      { field: 'rmGrnMaterialBalanceQty', header: 'Balance Qty' },
      { field: 'rmGrnMaterialReturnQty', header: 'Return Qty', type: ngColumnType.contentEditable },
      { field: 'rmGrnBillRate', header: 'Invoice Rate' },
      { field: 'rmGrnRateApply', header: 'Rate Apply', type: ngColumnType.contentEditable },
      { field: 'rmGrnReturnMaterialCost', header: 'Material Cost' },
    ];

    this.actionParams = { enabled: true, showRadiobutton: true };
    this.actionParams1 = { enabled: true, showCheckbox: true };
  }


  createForm() {
    try {
      this.purchaseReturnDetailsForm = this.formBuilder.group({
        id: new FormControl(''),
        purchageReturnNo: new FormControl({ value: null, disabled: true }),
        supplierOrgId: new FormControl('', [Validators.required]),
        rmGrnNo: new FormControl('', [Validators.required]),
        gstType: new FormControl('', [Validators.required]),
        prMaterialCost: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prPackingAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'),
        (control: AbstractControl) => Validators.max(this.maxPackingAmount)(control)]),
        packingHsnCode: new FormControl('', [Validators.required]),
        packingTaxRateAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prPackingTaxAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prFreightAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'),
        (control: AbstractControl) => Validators.max(this.maxFreightAmount)(control)]),
        freightHsnCode: new FormControl('', [Validators.required]),
        freightTaxRatePercentage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prFreightTaxAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prInsuranceAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$'),
        (control: AbstractControl) => Validators.max(this.maxInsAmt)(control)]),
        insuranceTaxRatePercentage: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        insuranceHsnCode: new FormControl('', [Validators.required]),
        prInsuranceTaxAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prTotalTaxAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        prTotalAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        purchaseReturnDate: new FormControl('', [Validators.required]),
        prRemarks: new FormControl('', [Validators.required]),
        employeeID: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        placeName: new FormControl('', [Validators.required]),
        rmGrnDate: new FormControl('', [Validators.required]),
        invoiceDc: new FormControl('', [Validators.required]),
        invoiceDcNo: new FormControl('', [Validators.required]),
        invoiceDcDate: new FormControl('', [Validators.required]),
        invoiceAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]*$')]),
        ogpNo: new FormControl({ value: null, disabled: true }),
        ogpDate: new FormControl('', [Validators.required])
      });
    } catch (error) {
      console.log(error);
    }
  }

  purchaseReturn() {
    this.purchaseReturnDetailsForm.reset();
    // this.purchaseReturnDetailsForm.disable();
    this.purchaseReturnDetailsForm.controls.supplierOrgId.enable();
    this.purchaseReturnDetailsForm.controls.purchaseReturnDate.enable();
    this.purchaseReturnDetailsForm.controls.prRemarks.enable();
    this.purchaseReturnDetailsForm.controls.employeeID.enable();
    this.supplierCtrl.focus();
    this.purchaseReturnService.getCommonDetails().subscribe(data => {
      if (data) {
        this.employeeList = data[1];
        this.suppliers = data[0];
      }
    });
  }


  purchaseRecievedOrderDetailsSelectedRowEvent(event: any) {
    this.selectedRowPurchaseRevdDetail = event;
    this.purchaseReturnService.getMaterialRecievedDetails(event.data.rmGrnNo).subscribe((data: PurchaseMaterialDetail[]) => {
      if (data) {
        data.forEach((element) => {
          element.rmGrnMaterialTransferQty = event.data.rmGrnMaterialTransferQty;
          element.rmGrnMaterialBalanceQty = element.rmGrnReceivedQty - element.rmGrnMaterialTransferQty;
        });
        this.purchaseMaterialDetailsGridData = data;
      }
    });
    this.resetControls();
  }

  changePurchaseMaterial(event: any) {
    console.log(event);
    console.log(this.purchaseMaterialDetailsGridData);
    const index = this.purchaseMaterialDetailsGridData.indexOf(event);
    this.selectedRowPurchaseMatrlDetail = event;
    if (!event.rmGrnMaterialReturnQty) {
      this.showError('Return Qty is required');
      this.purchaseMaterialDetailsGridData[index].isSelected = false;
    }
    if (!event.rmGrnRateApply) {
      this.showError('Rate Apply is required');
      this.purchaseMaterialDetailsGridData[index].isSelected = false;
    }
    const selectedItems = this.purchaseMaterialDetailsGridData.filter(f => f.isSelected);
    if (event.rmGrnReturnMaterialCost && selectedItems.length > 0) {
      this.bindFormControlValues(event);
      this.prPackingAmount.nativeElement.focus();
    } else {
      this.resetControls();
    }

  }
  paginate(e) {
    console.log(e);
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  // purchaseMaterialDetailsSelectedRowEvent(event: any) {
  //   this.selectedRowPurchaseMatrlDetail = event.data;
  //   if (!event.data.rmGrnMaterialReturnQty) {
  //     this.showError('Return Qty is required');
  //   }
  //   if (!event.data.rmGrnRateApply) {
  //     this.showError('Rate Apply is required');
  //   }
  //   if (event.data.rmGrnReturnMaterialCost) {
  //     this.bindFormControlValues(event);
  //     this.prPackingAmount.nativeElement.focus();
  //   }
  // }

  bindFormControlValues(event: any) {
    this.purchaseReturnService.getRMGrnDetailsByRMGrnNo(event.rmGrnNo).subscribe((data: any) => {
      this.purchaseReturnDetailsForm.controls.rmGrnDate.patchValue(data.RMGRNDate);
      this.purchaseReturnDetailsForm.controls.rmGrnNo.patchValue(data.RMGRNNo);
      this.purchaseReturnDetailsForm.controls.invoiceDc.patchValue(data.InvoiceDCType);
      this.purchaseReturnDetailsForm.controls.invoiceDcDate.patchValue(data.BillDCDate);
      this.purchaseReturnDetailsForm.controls.invoiceDcNo.patchValue(data.BillDCNo);
      this.purchaseReturnDetailsForm.controls.invoiceAmount.patchValue(data.TotalBillAmount);
      this.purchaseReturnDetailsForm.controls.gstType.patchValue(data.GSTType);
      this.purchaseReturnDetailsForm.controls.prMaterialCost.patchValue(event.rmGrnReturnMaterialCost);
      // Packing
      this.purchaseReturnDetailsForm.controls.packingHsnCode.patchValue(data.PackingHSNCode);
      let prPackingAmountD = (Number(event.rmPackingShareAmount ? event.rmPackingShareAmount : 0)
        * Number(event.rmGrnReturnMaterialCost ? event.rmGrnReturnMaterialCost : 0) *
        Number(event.rmGrnMaterialReturnQty ? event.rmGrnMaterialReturnQty : 0))
        / Number(event.rmGrnReceivedQty ? event.rmGrnReceivedQty : 0);
      this.maxPackingAmount = Number(data.PackingAmount ? data.PackingAmount : 0);
      if (prPackingAmountD) {
        prPackingAmountD = prPackingAmountD > this.maxPackingAmount ? this.maxPackingAmount : prPackingAmountD;
        this.purchaseReturnDetailsForm.controls.prPackingAmount.
          patchValue(prPackingAmountD);
      }
      this.purchaseReturnDetailsForm.controls.packingTaxRateAmount.
        patchValue(Number(data.PackingTaxRatePercentage ? data.PackingTaxRatePercentage : 0));
      const prPckAmt = +((+prPackingAmountD * Number(data.PackingTaxRatePercentage ? data.PackingTaxRatePercentage : 0)) / 100).toFixed();
      if (prPckAmt) {
        this.purchaseReturnDetailsForm.controls.prPackingTaxAmount.
          patchValue(prPckAmt);
      }
      // Freight
      let prFreightAmountD = (Number(event.rmFreightShareAmount ? event.rmFreightShareAmount : 0) *
        Number(event.rmGrnReturnMaterialCost ? event.rmGrnReturnMaterialCost : 0)
        * Number(event.rmGrnMaterialReturnQty ? event.rmGrnMaterialReturnQty : 0))
        / Number(event.rmGrnReceivedQty ? event.rmGrnReceivedQty : 0);
      this.maxFreightAmount = Number(data.FreightAmount ? data.FreightAmount : 0);
      if (prFreightAmountD) {
        prFreightAmountD = prFreightAmountD > this.maxFreightAmount ? this.maxFreightAmount : prFreightAmountD;
        this.purchaseReturnDetailsForm.controls.prFreightAmount.
          patchValue(prFreightAmountD);
      }
      const prFrAmt = +((+prFreightAmountD * Number(data.FreightTaxRatePercentage ? data.FreightTaxRatePercentage : 0)) / 100).toFixed();
      if (prFrAmt) {
        this.purchaseReturnDetailsForm.controls.prFreightTaxAmount.
          patchValue(prFrAmt);
      }
      this.purchaseReturnDetailsForm.controls.freightHsnCode.patchValue(data.FreightHSNCode);
      this.purchaseReturnDetailsForm.controls.freightTaxRatePercentage.
        patchValue(Number(data.FreightTaxRatePercentage ? data.FreightTaxRatePercentage : 0));
      // Insurance
      let prInsuranceAmountD = (Number(event.rmInsuranceShareAmount ? event.rmInsuranceShareAmount : 0) *
        Number(event.rmGrnReturnMaterialCost ? event.rmGrnReturnMaterialCost : 0) *
        Number(event.rmGrnMaterialReturnQty ? event.rmGrnMaterialReturnQty : 0))
        / Number(event.rmGrnReceivedQty ? event.rmGrnReceivedQty : 0);
      this.maxInsAmt = Number(data.InsuranceAmount ? data.InsuranceAmount : 0);
      if (prInsuranceAmountD) {
        prInsuranceAmountD = prInsuranceAmountD > this.maxInsAmt ? this.maxInsAmt : prInsuranceAmountD;
        this.purchaseReturnDetailsForm.controls.prInsuranceAmount.patchValue(prInsuranceAmountD);
      }
      this.purchaseReturnDetailsForm.controls.insuranceTaxRatePercentage.
        patchValue(Number(data.InsuranceTaxRatePercentage ? data.InsuranceTaxRatePercentage : 0));
      const prInsAmt = +((+prInsuranceAmountD *
        Number(data.InsuranceTaxRatePercentage ? data.InsuranceTaxRatePercentage : 0)) / 100).toFixed();
      if (prInsAmt) {
        this.purchaseReturnDetailsForm.controls.prInsuranceTaxAmount.
          patchValue(prInsAmt);
      }
      this.purchaseReturnDetailsForm.controls.insuranceHsnCode.patchValue(data.InsuranceHSNCode);
      // Total Tax Amount
      const txAmt = prPckAmt + prFrAmt + prInsAmt;
      if (txAmt) {
        this.purchaseReturnDetailsForm.controls.prTotalTaxAmount.
          patchValue(txAmt);
      }
      const prTotalAmt = event.rmGrnReturnMaterialCost + prPackingAmountD + prPckAmt + prFreightAmountD
        + prFrAmt + prInsuranceAmountD + prInsAmt;
      if (prTotalAmt) {
        this.purchaseReturnDetailsForm.controls.prTotalAmount.
          patchValue(prTotalAmt);
      }
      this.purchaseReturnDetailsForm.controls.purchaseReturnDate.
        patchValue(new Date());
      this.purchaseReturnDetailsForm.controls.ogpDate.
        patchValue(new Date());
    });
  }


  purchaseMaterialColumnEditEvent(event, i, type) {
    console.log(this.purchaseMaterialDetailsGridData);
    if (type === 'qty') {
      this.purchaseMaterialDetailsGridData[i].rmGrnMaterialReturnQty = Number(event.target.value);
    }
    if (type === 'rate') {
      this.purchaseMaterialDetailsGridData[i].rmGrnRateApply = event.target.value;
    }
    this.purchaseMaterialDetailsGridData.forEach((element: PurchaseMaterialDetail) => {
      element.rmGrnReturnMaterialCost = element.rmGrnMaterialReturnQty * element.rmGrnRateApply;
    });
  }

  showSuccess(msg: any) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }
  showError(msg: any) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  saveForm() {
    if (this.purchaseReturnDetailsForm.invalid) {
      this.markFieldAsTouched(this.purchaseReturnDetailsForm);
    } else {
      const selectedItems = this.purchaseMaterialDetailsGridData.filter(f => f.isSelected);
      if (selectedItems.length > 0) {
        if (this.modifyMode) {
          this.updatePurchaseReturnModel();
        } else {
          this.buildPurchaseReturnModel();
        }
      } else {
        this.showError('Atleast one material need to be selected.');
      }
    }
  }

  buildPurchaseReturnModel() {
    const purchageReturnDetail = new PurchageReturnDetail();
    purchageReturnDetail.supplierOrgId = this.purchaseReturnDetailsForm.get('supplierOrgId').value;
    purchageReturnDetail.rmGrnNo = this.purchaseReturnDetailsForm.get('rmGrnNo').value;
    purchageReturnDetail.purchaseReturnDate = this.purchaseReturnDetailsForm.get('purchaseReturnDate').value;
    purchageReturnDetail.purchageReturnNo = '-1';
    purchageReturnDetail.prTotalTaxAmount = this.purchaseReturnDetailsForm.get('prTotalTaxAmount').value;
    purchageReturnDetail.prTotalAmount = this.purchaseReturnDetailsForm.get('prTotalAmount').value;
    purchageReturnDetail.prRemarks = this.purchaseReturnDetailsForm.get('prRemarks').value;
    purchageReturnDetail.prPackingTaxAmount = this.purchaseReturnDetailsForm.get('prPackingTaxAmount').value;
    purchageReturnDetail.prPackingAmount = this.purchaseReturnDetailsForm.get('prPackingAmount').value;
    purchageReturnDetail.prMaterialCost = this.purchaseReturnDetailsForm.get('prMaterialCost').value;
    purchageReturnDetail.prInsuranceTaxAmount = this.purchaseReturnDetailsForm.get('prInsuranceTaxAmount').value;
    purchageReturnDetail.prInsuranceAmount = this.purchaseReturnDetailsForm.get('prInsuranceAmount').value;
    purchageReturnDetail.prFreightTaxAmount = this.purchaseReturnDetailsForm.get('prFreightTaxAmount').value;
    purchageReturnDetail.prFreightAmount = this.purchaseReturnDetailsForm.get('prFreightAmount').value;
    purchageReturnDetail.packingTaxRateAmount = this.purchaseReturnDetailsForm.get('packingTaxRateAmount').value;
    purchageReturnDetail.packingHsnCode = this.purchaseReturnDetailsForm.get('packingHsnCode').value;
    purchageReturnDetail.insuranceTaxRatePercentage = this.purchaseReturnDetailsForm.get('insuranceTaxRatePercentage').value;
    purchageReturnDetail.insuranceHsnCode = this.purchaseReturnDetailsForm.get('insuranceHsnCode').value;
    purchageReturnDetail.gstType = this.purchaseReturnDetailsForm.get('gstType').value;
    purchageReturnDetail.freightTaxRatePercentage =
      this.purchaseReturnDetailsForm.get('freightTaxRatePercentage').value;
    purchageReturnDetail.freightHsnCode = this.purchaseReturnDetailsForm.get('freightHsnCode').value;
    purchageReturnDetail.employeeID = this.purchaseReturnDetailsForm.get('employeeID').value;
    purchageReturnDetail.id = -1;
    // outward gate pass detail
    const outwardGatePassDetail = [{
      Id: -1,
      ogpDate: this.purchaseReturnDetailsForm.get('ogpDate').value,
      ogpNo: this.purchaseReturnDetailsForm.get('ogpNo').value,
      transactionNo: null
    }];
    const purchageReturnMaterialDetail: PurchageReturnMaterialDetail[] = [];
    const selectedItems = this.purchaseMaterialDetailsGridData.filter(f => f.isSelected);

    selectedItems.forEach(selectedItem => {
      const purchaseReturnMaterial: PurchageReturnMaterialDetail = {
        Id: -1,
        purchageReturnNo: '-1',
        rawMaterialDetailsCode: selectedItem.rawMaterialDetailsCode,
        rawMaterialGroupCode: selectedItem.rawMaterialGroupCode,
        rmBatchNo: selectedItem.rmBatchNo,
        rmGrnCGSTRate: selectedItem.rmGrnCGSTRate == null ? 0 : selectedItem.rmGrnCGSTRate,
        rmGrnCGSTReverseAmount: selectedItem.rmGrnCGSTAmount,
        rmGrnIGSTRate: selectedItem.rmGrnIGSTRate == null ? 0 : selectedItem.rmGrnIGSTRate,
        rmGrnIGSTReverseAmount: selectedItem.rmGrnIGSTAmount,
        rmGrnSGSTRate: selectedItem.rmGrnSGSTRate == null ? 0 : selectedItem.rmGrnSGSTRate,
        rmGrnSGSTReverseAmount: selectedItem.rmGrnSGSTAmount,
        rmMaterialReturnAmount: +this.purchaseReturnDetailsForm.get('prTotalAmount').value,
        rmGrnNo: selectedItem.rmGrnNo,
        rmMaterialReturnQty: +selectedItem.rmGrnMaterialReturnQty,
        rmMaterialwiseReturnRate: +selectedItem.rmGrnRateApply,
        rmTransferDate: this.purchaseReturnDetailsForm.get('purchaseReturnDate').value
      };
      purchageReturnMaterialDetail.push(purchaseReturnMaterial);

    });

    this.purchaseReturnModel = {
      purchageReturnDetail,
      outwardGatePassDetail,
      purchageReturnMaterialDetail,
    };
    this.purchaseReturnService.createPurchaseReturnDetail(this.purchaseReturnModel).subscribe(data => {
      if (data) {
        this.showSuccess('Purchase return created successfully');
        this.clearForm();
      }
    });

  }

  updatePurchaseReturnModel() {
    let purchageReturnDetail = new PurchageReturnDetail();
    this.modifyPurchaseReturn.purchageReturnDetail.supplierOrgId = this.purchaseReturnDetailsForm.get('supplierOrgId').value;
    this.modifyPurchaseReturn.purchageReturnDetail.rmGrnNo = this.purchaseReturnDetailsForm.get('rmGrnNo').value;
    this.modifyPurchaseReturn.purchageReturnDetail.purchaseReturnDate = this.purchaseReturnDetailsForm.get('purchaseReturnDate').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prTotalTaxAmount = this.purchaseReturnDetailsForm.get('prTotalTaxAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prTotalAmount = this.purchaseReturnDetailsForm.get('prTotalAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prRemarks = this.purchaseReturnDetailsForm.get('prRemarks').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prPackingTaxAmount = this.purchaseReturnDetailsForm.get('prPackingTaxAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prPackingAmount = this.purchaseReturnDetailsForm.get('prPackingAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prMaterialCost = this.purchaseReturnDetailsForm.get('prMaterialCost').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prInsuranceTaxAmount = this.purchaseReturnDetailsForm.get('prInsuranceTaxAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prInsuranceAmount = this.purchaseReturnDetailsForm.get('prInsuranceAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prFreightTaxAmount = this.purchaseReturnDetailsForm.get('prFreightTaxAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.prFreightAmount = this.purchaseReturnDetailsForm.get('prFreightAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.packingTaxRateAmount = this.purchaseReturnDetailsForm.get('packingTaxRateAmount').value;
    this.modifyPurchaseReturn.purchageReturnDetail.packingHsnCode = this.purchaseReturnDetailsForm.get('packingHsnCode').value;
    this.modifyPurchaseReturn.purchageReturnDetail.insuranceTaxRatePercentage = this.purchaseReturnDetailsForm.get('insuranceTaxRatePercentage').value;
    this.modifyPurchaseReturn.purchageReturnDetail.insuranceHsnCode = this.purchaseReturnDetailsForm.get('insuranceHsnCode').value;
    this.modifyPurchaseReturn.purchageReturnDetail.gstType = this.purchaseReturnDetailsForm.get('gstType').value;
    this.modifyPurchaseReturn.purchageReturnDetail.freightTaxRatePercentage =
      this.purchaseReturnDetailsForm.get('freightTaxRatePercentage').value;
    this.modifyPurchaseReturn.purchageReturnDetail.freightHsnCode = this.purchaseReturnDetailsForm.get('freightHsnCode').value;
    this.modifyPurchaseReturn.purchageReturnDetail.employeeID = this.purchaseReturnDetailsForm.get('employeeID').value;

    purchageReturnDetail = this.modifyPurchaseReturn.purchageReturnDetail;
    // outward gate pass detail
    const outwardGatePassDetail = [{
      Id: this.modifyPurchaseReturn.outwardGatePassDetail[0].Id,
      ogpDate: this.purchaseReturnDetailsForm.get('ogpDate').value,
      ogpNo: this.modifyPurchaseReturn.outwardGatePassDetail[0].ogpNo,
      transactionNo: this.modifyPurchaseReturn.outwardGatePassDetail[0].transactionNo
    }];

    const purchageReturnMaterialDetail: PurchageReturnMaterialDetail[] = [];
    const selectedItems = this.purchaseMaterialDetailsGridData.filter(f => f.isSelected);

    selectedItems.forEach(selectedItem => {
      const purchaseReturnMaterial: PurchageReturnMaterialDetail = {
        Id: selectedItem.Id,
        purchageReturnNo: this.modifyPurchaseReturn.purchageReturnDetail.purchageReturnNo,
        rawMaterialDetailsCode: selectedItem.rawMaterialDetailsCode,
        rawMaterialGroupCode: selectedItem.rawMaterialGroupCode,
        rmBatchNo: selectedItem.rmBatchNo,
        rmGrnCGSTRate: selectedItem.rmGrnCGSTRate == null ? 0 : selectedItem.rmGrnCGSTRate,
        rmGrnCGSTReverseAmount: selectedItem.rmGrnCGSTAmount,
        rmGrnIGSTRate: selectedItem.rmGrnIGSTRate == null ? 0 : selectedItem.rmGrnIGSTRate,
        rmGrnIGSTReverseAmount: selectedItem.rmGrnIGSTAmount,
        rmGrnSGSTRate: selectedItem.rmGrnSGSTRate == null ? 0 : selectedItem.rmGrnSGSTRate,
        rmGrnSGSTReverseAmount: selectedItem.rmGrnSGSTAmount,
        rmMaterialReturnAmount: +this.purchaseReturnDetailsForm.get('prTotalAmount').value,
        rmGrnNo: selectedItem.rmGrnNo,
        rmMaterialReturnQty: +selectedItem.rmGrnMaterialReturnQty,
        rmMaterialwiseReturnRate: +selectedItem.rmGrnRateApply,
        rmTransferDate: this.purchaseReturnDetailsForm.get('purchaseReturnDate').value
      };
      purchageReturnMaterialDetail.push(purchaseReturnMaterial);

    });

    this.purchaseReturnModel = {
      purchageReturnDetail,
      outwardGatePassDetail,
      purchageReturnMaterialDetail,
    };
    this.purchaseReturnService.modifyPurchaseReturn(this.purchaseReturnModel).subscribe(data => {
      if (data) {
        this.showSuccess('Purchase return updated successfully');
        this.clearForm();
      }
    });

  }


  clearForm() {
    this.purchaseReturnDetailsForm.reset();
    this.suppliers = this.employeeList = [];
    this.purchaseMaterialDetailsGridData = [];
    this.purchaseReceviedDetailsGridData = [];
    this.modifyMode = false;
    this.disableNew = false;
    this.disableModify = false;
  }
  resetControls() {
    this.purchaseReturnDetailsForm.controls.rmGrnNo.reset();
    this.purchaseReturnDetailsForm.controls.gstType.reset();
    this.purchaseReturnDetailsForm.controls.prMaterialCost.reset();
    this.purchaseReturnDetailsForm.controls.prPackingAmount.reset();
    this.purchaseReturnDetailsForm.controls.packingHsnCode.reset();
    this.purchaseReturnDetailsForm.controls.packingTaxRateAmount.reset();
    this.purchaseReturnDetailsForm.controls.prPackingTaxAmount.reset();
    this.purchaseReturnDetailsForm.controls.prFreightAmount.reset();
    this.purchaseReturnDetailsForm.controls.freightHsnCode.reset();
    this.purchaseReturnDetailsForm.controls.freightTaxRatePercentage.reset();
    this.purchaseReturnDetailsForm.controls.prFreightTaxAmount.reset();
    this.purchaseReturnDetailsForm.controls.prInsuranceAmount.reset();
    this.purchaseReturnDetailsForm.controls.insuranceTaxRatePercentage.reset();
    this.purchaseReturnDetailsForm.controls.insuranceHsnCode.reset();
    this.purchaseReturnDetailsForm.controls.prInsuranceTaxAmount.reset();
    this.purchaseReturnDetailsForm.controls.prTotalTaxAmount.reset();
    this.purchaseReturnDetailsForm.controls.prTotalAmount.reset();
    this.purchaseReturnDetailsForm.controls.purchaseReturnDate.reset();
    this.purchaseReturnDetailsForm.controls.prRemarks.reset();
    this.purchaseReturnDetailsForm.controls.employeeID.reset();
    this.purchaseReturnDetailsForm.controls.rmGrnDate.reset();
    this.purchaseReturnDetailsForm.controls.invoiceDc.reset();
    this.purchaseReturnDetailsForm.controls.invoiceDcNo.reset();
    this.purchaseReturnDetailsForm.controls.invoiceDcDate.reset();
    this.purchaseReturnDetailsForm.controls.invoiceAmount.reset();
    this.purchaseReturnDetailsForm.controls.ogpNo.reset();
    this.purchaseReturnDetailsForm.controls.ogpDate.reset();
  }

  modify() {
    this.modifyMode = true;
    this.purchaseReturn();
    this.disableModify = true;
    this.purchaseReturnDetailsForm.controls.purchageReturnNo.enable();
  }
  onPRChanges(event) {
    console.log(event.value);
    this.purchaseReturnService.FindPurchaseReturnById(event.value).subscribe((data) => {
      console.log(data);
      console.log(this.modifyPurchaseReceviedDetailsGridData);
      if (data.IsSucceed && data.Data) {
        this.modifyPurchaseReturn = data.Data;
        this.modifyPurchaseReceviedDetailsGridData.forEach(element => {
          this.purchaseReceviedDetailsGridData = [];
          if (element.rmGrnNo === data.Data.purchageReturnDetail.rmGrnNo) {
            element.isSelected = true;
            this.purchaseReceviedDetailsGridData.push(element);
            this.selectedRowPurchaseRevdDetail = this.purchaseReceviedDetailsGridData[0];
          }
        });

        this.purchaseReturnService.getMaterialRecievedDetails(this.modifyPurchaseReturn.purchageReturnDetail.rmGrnNo).subscribe
          ((val: PurchaseMaterialDetail[]) => {
            if (val) {
              this.purchaseMaterialDetailsGridData = [];
              this.modifyPurchaseReturn.purchageReturnMaterialDetail.forEach(element => {
                const purchaseMaterialArr = val.filter(e => e.rawMaterialDetailsCode === element.rawMaterialDetailsCode
                  && e.rawMaterialGroupCode === element.rawMaterialGroupCode);
                if (purchaseMaterialArr.length > 0) {
                  const purchaseMaterial = purchaseMaterialArr[0];
                  purchaseMaterial.rmGrnMaterialTransferQty = this.selectedRowPurchaseRevdDetail.rmGrnMaterialTransferQty;
                  purchaseMaterial.rmGrnMaterialBalanceQty = purchaseMaterial.rmGrnReceivedQty - purchaseMaterial.rmGrnMaterialTransferQty;
                  purchaseMaterial.isSelected = true;
                  purchaseMaterial.rmGrnRateApply = element.rmMaterialwiseReturnRate;
                  purchaseMaterial.rmGrnMaterialReturnQty = element.rmMaterialReturnQty;
                  purchaseMaterial.rmGrnReturnMaterialCost = purchaseMaterial.rmGrnMaterialReturnQty * purchaseMaterial.rmGrnRateApply;
                  purchaseMaterial.Id = element.Id;
                  this.purchaseMaterialDetailsGridData.push(purchaseMaterial);
                }
              });

              // data.forEach((element) => {
              //   element.rmGrnMaterialTransferQty = event.data.rmGrnMaterialTransferQty;
              //   element.rmGrnMaterialBalanceQty = element.rmGrnReceivedQty - element.rmGrnMaterialTransferQty;
              // });
              // this.purchaseMaterialDetailsGridData = data;
              console.log(val);
              this.bindModifyFormControlValues(this.modifyPurchaseReturn);
            }
          });
      }
    });
  }
  bindModifyFormControlValues(event: any) {
    this.purchaseReturnService.getRMGrnDetailsByRMGrnNo(event.purchageReturnDetail.rmGrnNo).subscribe((data: any) => {
      this.purchaseReturnDetailsForm.controls.rmGrnDate.patchValue(data.RMGRNDate);
      this.purchaseReturnDetailsForm.controls.rmGrnNo.patchValue(data.RMGRNNo);
      this.purchaseReturnDetailsForm.controls.invoiceDc.patchValue(data.InvoiceDCType);
      this.purchaseReturnDetailsForm.controls.invoiceDcDate.patchValue(data.BillDCDate);
      this.purchaseReturnDetailsForm.controls.invoiceDcNo.patchValue(data.BillDCNo);
      this.purchaseReturnDetailsForm.controls.invoiceAmount.patchValue(data.TotalBillAmount);
      this.purchaseReturnDetailsForm.controls.gstType.patchValue(data.GSTType);
      this.purchaseReturnDetailsForm.controls.prMaterialCost.patchValue(event.purchageReturnDetail.prMaterialCost);
      // Packing
      this.purchaseReturnDetailsForm.controls.packingHsnCode.patchValue(data.PackingHSNCode);
      this.purchaseReturnDetailsForm.controls.prPackingAmount.
        patchValue(event.purchageReturnDetail.prPackingAmount);
      this.purchaseReturnDetailsForm.controls.packingTaxRateAmount.
        patchValue(event.purchageReturnDetail.packingTaxRateAmount);
      this.purchaseReturnDetailsForm.controls.prPackingTaxAmount.
        patchValue(event.purchageReturnDetail.prPackingTaxAmount);
      this.purchaseReturnDetailsForm.controls.prFreightAmount.
        patchValue(event.purchageReturnDetail.prFreightAmount);
      this.purchaseReturnDetailsForm.controls.prFreightTaxAmount.
        patchValue(event.purchageReturnDetail.prFreightTaxAmount);
      this.purchaseReturnDetailsForm.controls.freightHsnCode.patchValue(data.FreightHSNCode);
      this.purchaseReturnDetailsForm.controls.freightTaxRatePercentage.
        patchValue(event.purchageReturnDetail.freightTaxRatePercentage);
      this.purchaseReturnDetailsForm.controls.prInsuranceAmount.
        patchValue(event.purchageReturnDetail.prInsuranceAmount);
      this.purchaseReturnDetailsForm.controls.insuranceTaxRatePercentage.
        patchValue(event.purchageReturnDetail.insuranceTaxRatePercentage);
      this.purchaseReturnDetailsForm.controls.prInsuranceTaxAmount.
        patchValue(event.purchageReturnDetail.prInsuranceTaxAmount);
      this.purchaseReturnDetailsForm.controls.insuranceHsnCode.patchValue(event.purchageReturnDetail.insuranceHsnCode);
      this.purchaseReturnDetailsForm.controls.prTotalTaxAmount.
        patchValue(event.purchageReturnDetail.prTotalTaxAmount);
      this.purchaseReturnDetailsForm.controls.prTotalAmount.
        patchValue(event.purchageReturnDetail.prTotalAmount);
      this.purchaseReturnDetailsForm.controls.purchaseReturnDate.
        patchValue(event.purchageReturnDetail.purchaseReturnDate);
      this.purchaseReturnDetailsForm.controls.ogpDate.
        patchValue(event.purchageReturnDetail.purchaseReturnDate);
      this.purchaseReturnDetailsForm.controls.prRemarks.
        patchValue(event.purchageReturnDetail.prRemarks);
      this.purchaseReturnDetailsForm.controls.employeeID.
        patchValue((event.purchageReturnDetail.employeeID).toString());
      this.purchaseReturnDetailsForm.controls.ogpNo.
        patchValue(event.outwardGatePassDetail[0].ogpNo);
      this.maxPackingAmount = event.purchageReturnDetail.prPackingAmount;
      this.maxFreightAmount = event.purchageReturnDetail.prFreightAmount;
      this.maxInsAmt = event.purchageReturnDetail.prInsuranceAmount;
    });
  }
}
