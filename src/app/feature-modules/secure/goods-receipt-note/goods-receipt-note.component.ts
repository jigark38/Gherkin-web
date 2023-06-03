import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSelect, MatDialog } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoodsReceiptNote, InwardDetail, OrderMaterialTotalCostDetail, PendingPurchaseOrder, ReceivedMaterial } from './goods-receipt-note.model';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AlertService } from '../../../../app/corecomponents/alert/alert.service';
import { DatePipe } from '@angular/common';
import { GoodsReceiptNoteService } from './goods-receipt-note.service';
import { SupplierDetails } from '../suppliers-details/suppliers-details.model';
import { isArray, isNullOrUndefined } from 'util';
import { MomentUtcDateAdapter } from 'src/app/shared/directives/moment-utc-date-adapter';
import { ReceivedMaterialPopupComponent } from './received-material-popup/received-material-popup.component';
import { BatchMaterialDetails } from './received-material-popup/batch-material-details.models';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-goods-receipt-note',
  templateUrl: './goods-receipt-note.component.html',
  styleUrls: ['./goods-receipt-note.component.css'],
  // providers:[DatePipe]
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class GoodsReceiptNoteComponent implements OnInit {
  @ViewChild('InsuranceAmount', { static: false }) InsuranceAmount: any;
  @ViewChild('FreightAmount', { static: false }) FreightAmount: any;
  @ViewChild('AdvancePayment', { static: false }) AdvancePayment: any;
  isDisabledNext = true;
  activeIndex = 0;
  disabledGRN = true;
  disableFind = false;
  disableModify = false;

  inwardDetailsCols: any[];
  pendingPurchaseOrderCols: any[];
  receivedMaterialCols: any[];

  inwardDetailsList: InwardDetail[] = [];
  pendingPurchaseOrderList: PendingPurchaseOrder[] = [];
  receivedMaterialList: ReceivedMaterial[] = [];
  supplierOrgs: SupplierDetails[] = [];
  orderDetailsForm: FormGroup;
  findMode: boolean;
  modifyMode: boolean;
  GRNCodes: any[] = [];
  goodsReceiptNote: GoodsReceiptNote;
  modifyOrderMaterialTotalCostDetail: OrderMaterialTotalCostDetail[] = [];

  constructor(
    private goodsReceiptNoteService: GoodsReceiptNoteService,
    private alertService: AlertService,
    private formBuilder: FormBuilder, private datePipe: DatePipe,
    private readonly dialog: MatDialog
  ) { }


  ngOnInit() {
    this.createForm();
    this.initData();
  }

  initData() {

    this.inwardDetailsCols = [
      { field: '', header: 'Sl. No.' },
      { field: 'IsSelected', header: 'Select' },
      { field: 'InwardDateIGPNo', header: 'Inward Date/IGP No' },
      { field: 'SupplierName', header: 'Supplier Name' },
      { field: 'Place', header: 'Place' },
      { field: 'InvDCDetail', header: 'Inv/DC Details' },
      { field: 'Material', header: 'Material' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'QCTest', header: 'QC Test' },
    ];
    this.pendingPurchaseOrderCols = [
      // take field name from table
      { field: '', header: 'Sl. No.' },
      { field: 'IsSelected', header: 'Select' },
      { field: 'PODate', header: 'PO Date' },
      { field: 'PONo', header: 'PO No' },
      { field: 'SupplierNamePlace', header: 'Supplier Name/Place' },
      { field: 'MaterialName', header: 'Material Name' },
      { field: 'OrderQuantity', header: 'Order Qty' },
      { field: 'TillNowRecordQuantity', header: 'Till now Recd. Qty' },
      { field: 'PendingQuatity', header: 'Pending Qty' },
    ];
    this.receivedMaterialCols = [
      // take field name from table
      { field: '', header: 'Edit', style: { width: '50px' } },
      { field: '', header: 'Sl. No.', style: { width: '52px' } },
      { field: 'InwardDateIGPNo', header: 'Inward Date / IGP No', style: { width: '130px' } },
      { field: 'PODatePONo', header: 'PO Date / PO No', style: { width: '160px' } },
      { field: 'SupplierName', header: 'Supplier Name', style: { width: '140px' } },
      { field: 'MaterialName', header: 'Material Name', style: { width: '140px' } },
      { field: 'POQuantity', header: 'PO Qty', style: { width: '60px' } },
      { field: 'TillNowRecordQuantity', header: 'Till Recd. Qty', style: { width: '90px' } },
      { field: 'PendingQuatity', header: 'Pending Qty', style: { width: '85px' } },
      { field: 'BillQuantity', header: 'GRN Qty', style: { width: '120px' } },
      { field: 'PORate', header: 'PO Rate', style: { width: '60px' } },
      { field: 'BillRate', header: 'Net Rate', style: { width: '120px' } },
      { field: 'InvoiceAmount', header: 'Net Amt', style: { width: '80px' } },
      { field: 'TaxRateIGST', header: 'Tax Rate IGST', style: { width: '100px' } },
      { field: 'TaxAmountIGST', header: 'Tax Amt IGST', style: { width: '100px' } },
      { field: 'TaxRateCGST', header: 'Tax Rate CGST', style: { width: '100px' } },
      { field: 'TaxAmountCGST', header: 'Tax Amt CGST', style: { width: '100px' } },
      { field: 'TaxRateSGST', header: 'Tax Rate SGST', style: { width: '100px' } },
      { field: 'TaxAmountSGST', header: 'Tax Amt SGST', style: { width: '100px' } },
      { field: 'TotalAmount', header: 'Total Amount', style: { width: '100px' } },
      // { field: 'BatchNo', header: 'Batch No', style: { width: '120px' } },
      { field: 'ReceivedQuantity', header: 'Recd. Qty', style: { width: '120px' } },
    ];

    this.getInwardDetail();
    this.getPendingPurchaseOrder();
    this.getGRNCode();
  }

  createForm = () => {
    try {

      this.orderDetailsForm = this.formBuilder.group({
        RMGRNDate: [{ value: this.datePipe.transform(new Date(), 'dd-MMM-yyyy h:mm:ss') }],
        InwardGatePassNo: ['', [Validators.maxLength(20)]],
        RMGRNNo: [{ value: '', disabled: true }, [Validators.maxLength(10)]],
        DomesticImport: ['', [Validators.required, Validators.maxLength(20)]],
        SupplierOrgID: [{ value: '', disabled: true }, [Validators.maxLength(20)]],
        SupplierOrganisationName: [{ value: '', disabled: true }],
        PlaceName: [{ value: '', disabled: true }],
        StateName: [{ value: '', disabled: true }],
        CountryName: [{ value: '', disabled: true }],
        InvoiceDCType: ['', [Validators.required, Validators.maxLength(20)]],
        BillDCDate: ['', [Validators.required]],
        BillDCNo: ['', [Validators.required, Validators.maxLength(30)]],
        Currency: ['INR', [Validators.required, Validators.maxLength(20)]],
        TotalMaterialCost: [{ value: '', disabled: true },
        [Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,10}$/)]],
        GSTType: [{ value: '', disabled: true }, [Validators.maxLength(10)]],
        TotalTaxAmount: [{ value: '', disabled: true },
        [Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,10}$/)]],
        TotalMaterialCostAndTaxAmount: [{ value: '', disabled: true },
        [Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,10}$/)]],
        CustomsAmount: ['', [Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,10}$/)]],
        PackingAmount: ['', [Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,10}$/)]],
        PackingHSNCode: ['', [Validators.maxLength(20)]],
        PackingTaxRatePercentage: ['', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,10}$/)]],
        PackingTaxAmount: ['', [Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]],
        FreightAmount: ['', [Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,10}$/)]],
        FreightHSNCode: ['', [Validators.maxLength(20)]],
        FreightTaxRatePercentage: ['', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,10}$/)]],
        FreightTaxAmount: ['', [Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]],
        InsuranceAmount: ['', [Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,10}$/)]],
        InsuranceHSNCode: ['', [Validators.maxLength(20)]],
        InsuranceTaxRatePercentage: ['', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,10}$/)]],
        InsuranceTaxAmount: ['', [Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]],
        TotalBillAmount: [{ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,10}$/)]],
        AdvancePayment: ['', [Validators.required, Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,10}$/)]],
        // DiscountPercentage: ['', [Validators.pattern(/^(?:\d{0,4}\.\d{1,2})$|^\d{0,4}$/)]],
        //DiscountAmount: ['', [Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,15}$/)]],
        BalanceAmount: [{ value: '', disabled: true }, [Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,10}$/)]],
        CreditDays: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]{0,3}$')]],
      });

    } catch (error) {
      this.alertService.error('Error while creating orderDetailsForm! - ' + error);
    }
  }

  getInwardDetail() {
    this.goodsReceiptNoteService.getInwardDetail().subscribe(res => {
      // console.log(res);
      this.inwardDetailsList = res;
    },
      error => {
        // this.alertService.error('Error while getting InwardDetail! - ' + error);
        console.log(error);
      });
  }

  getPendingPurchaseOrder() {
    this.goodsReceiptNoteService.getPendingPurchaseOrder().subscribe(res => {
      // console.log(res);
      this.pendingPurchaseOrderList = res;
    },
      error => {
        this.alertService.error('Error while getting PendingPurchaseOrder! - ' + error);
      });
  }

  getGRNCode() {
    this.goodsReceiptNoteService.getGRNCode().subscribe(res => {
      // console.log(res);
      const RMGRNNo = 'RMGRNNo';
      this.GRNCodes = [];
      this.GRNCodes.push(res);
      this.orderDetailsForm.controls.RMGRNNo.setValue(res);
    }, error => {
      this.alertService.error('Error while getting GRNCode! - ' + error);
    });
  }

  clearPackOfPracDetails() { }

  inwardDetailsChange(event, inward) {
    this.inwardDetailsList.map(i => i.IsSelected = false);
    this.inwardDetailsList[this.inwardDetailsList.indexOf(inward)].IsSelected = event.target.checked;
    this.isDisabledNext = this.inwardDetailsList.filter(i => i.IsSelected).length <= 0 ||
      this.pendingPurchaseOrderList.filter(i => i.IsSelected).length <= 0;
  }

  pendingPurchaseOrderChange(event) {
    this.isDisabledNext = this.pendingPurchaseOrderList.filter(i => i.IsSelected).length <= 0 ||
      this.inwardDetailsList.filter(i => i.IsSelected).length <= 0;
  }

  refreshContent() {
    this.inwardDetailsList.map(i => i.IsSelected = false);
    this.pendingPurchaseOrderList.map(p => p.IsSelected = false);
    this.activeIndex = 0;
    this.disabledGRN = true;
    this.isDisabledNext = true;
    this.receivedMaterialList = [];
    this.orderDetailsForm.reset();
    const Currency = 'Currency';
    this.modifyMode = false;
    this.orderDetailsForm.controls[Currency].setValue('INR');
  }

  clearContent() {
    this.pendingPurchaseOrderList = [];
    this.inwardDetailsList = [];
    this.orderDetailsForm.reset();
    this.getInwardDetail();
    this.getPendingPurchaseOrder();
    this.activeIndex = 0;
    this.disabledGRN = true;
    this.isDisabledNext = true;
    this.receivedMaterialList = [];
    this.orderDetailsForm.reset();
    const Currency = 'Currency';
    this.orderDetailsForm.controls[Currency].setValue('INR');
    this.disableFind = false;
    this.disableModify = false;
    this.modifyMode = false;
  }

  getSupplierOrganisationInfo(SupplierOrgId) {
    this.goodsReceiptNoteService.getSupplierDetailsByID(SupplierOrgId).subscribe((res: any) => {
      // console.log(res);
      this.getCountryByCode(res.SupplierDetailsDto.countryID, res.SupplierDetailsDto.stateID);
    },
      error => {
        this.alertService.error('Error while getting SupplierOrganisationInfo! - ' + error);
      });
  }

  getCountryByCode(countryCode, stateCode) {
    this.goodsReceiptNoteService.getCountryByCode(countryCode).subscribe((res: any) => {
      // console.log(res);
      const states = res.states.filter(s => s.stateCode === stateCode);
      const StateName = 'StateName';
      const CountryName = 'CountryName';
      this.orderDetailsForm.controls[StateName].setValue(states[0].stateName);
      this.orderDetailsForm.controls[CountryName].setValue(res.countryName);
    },
      error => {
        this.alertService.error('Error while getting CountryByCode! - ' + error);
      });
  }

  onNextBtnClick(event) {
    this.orderDetailsForm.reset();
    this.orderDetailsForm.enable();
    this.disableControls();
    this.receivedMaterialList = [];
    this.disabledGRN = false;
    this.isDisabledNext = true;
    this.activeIndex = 1;
    const selectedPendingPurchaseOrder = this.pendingPurchaseOrderList.filter(p => p.IsSelected);
    const selectedInwardDetails = this.inwardDetailsList.filter(i => i.IsSelected);
    // console.log(selectedInwardDetails, selectedPendingPurchaseOrder);
    selectedPendingPurchaseOrder.forEach(ppOrder => {
      this.receivedMaterialList.push({
        InwardDateTime: selectedInwardDetails[0].InwardDateTime,
        InwardGatePassNo: selectedInwardDetails[0].InwardGatePassNo,
        PODate: ppOrder.RMPODate,
        PONo: ppOrder.RMPONo,
        RawMaterialGroupCode: ppOrder.RawMaterialGroupCode,
        RawMaterialDetailsCode: ppOrder.RawMaterialDetailsCode,
        SupplierNamePlace: ppOrder.SupplierOrganisationName,
        MaterialName: ppOrder.RawMaterialDetaisName,
        POQuantity: ppOrder.RMOrderQty,
        TillNowRecordQuantity: ppOrder.TillNowRecordQuantity,
        PendingQuatity: ppOrder.RMOrderQty - ppOrder.TillNowRecordQuantity,
        BillQuantity: null,
        RMPORate: ppOrder.RMPORate,
        BillRate: null,
        InvoiceAmount: 0,
        TaxRateIGST: ppOrder.RMPOMaterialIGSTRate,
        TaxAmountIGST: 0,
        TaxRateCGST: ppOrder.RMPOMaterialCGSTRate,
        TaxAmountCGST: 0,
        TaxRateSGST: ppOrder.RMPOMaterialSGSRate,
        TaxAmountSGST: 0,
        TotalAmount: 0,
        BatchNo: null,
        ReceivedQuantity: null,
        IsBatchNoValid: true,
        IsBillQuantityValid: true,
        IsBillRateValid: true,
        IsReceivedQuantity: true
      });
    });

    const InwardGatePassNo = 'InwardGatePassNo';
    const RMGRNDate = 'RMGRNDate';
    this.orderDetailsForm.controls.Currency.setValue('INR');
    this.orderDetailsForm.controls[InwardGatePassNo].setValue(selectedInwardDetails[0].InwardGatePassNo);
    this.orderDetailsForm.controls[RMGRNDate].setValue(this.datePipe.transform(new Date(), 'dd-MMM-yyyy h:mm:ss'));
    this.getGRNCode();
    const GSTType = 'GSTType';
    const SupplierOrgID = 'SupplierOrgID';
    const SupplierOrganisationName = 'SupplierOrganisationName';
    const PlaceName = 'PlaceName';
    const DomesticImport = 'DomesticImport';
    this.supplierOrgs = [];
    const supplierDetails = new SupplierDetails();
    supplierDetails.supplierOrgID = selectedPendingPurchaseOrder[0].SupplierOrgId;
    supplierDetails.organisationName = selectedPendingPurchaseOrder[0].SupplierOrganisationName;
    this.supplierOrgs.push(supplierDetails);
    this.orderDetailsForm.controls[GSTType].setValue(selectedPendingPurchaseOrder[0].GSTType);
    this.orderDetailsForm.controls[SupplierOrgID].setValue(selectedPendingPurchaseOrder[0].SupplierOrgId);
    this.orderDetailsForm.controls[SupplierOrganisationName].setValue(selectedPendingPurchaseOrder[0].SupplierOrgId);
    this.orderDetailsForm.controls[PlaceName].setValue(selectedPendingPurchaseOrder[0].PlaceName);
    this.orderDetailsForm.controls[DomesticImport].setValue(selectedPendingPurchaseOrder[0].DomesticImport);
    this.getSupplierOrganisationInfo(selectedPendingPurchaseOrder[0].SupplierOrgId);
  }

  disableControls() {
    this.orderDetailsForm.controls.RMGRNDate.enable();
    this.orderDetailsForm.controls.PlaceName.disable();
    this.orderDetailsForm.controls.StateName.disable();
    this.orderDetailsForm.controls.CountryName.disable();
    this.orderDetailsForm.controls.TotalMaterialCost.disable();
    this.orderDetailsForm.controls.GSTType.disable();
    this.orderDetailsForm.controls.TotalTaxAmount.disable();
    this.orderDetailsForm.controls.TotalMaterialCostAndTaxAmount.disable();
    this.orderDetailsForm.controls.TotalBillAmount.disable();
    this.orderDetailsForm.controls.BalanceAmount.disable();
    if (!this.modifyMode) {
      this.orderDetailsForm.controls.RMGRNNo.disable();
      this.orderDetailsForm.controls.SupplierOrgID.disable();
      this.orderDetailsForm.controls.SupplierOrganisationName.disable();
    }
  }

  validateAndCalcInvAmt(item: ReceivedMaterial, colName, scale = 2) {
    const reg = new RegExp('^(?:\\d{0,10}\\.\\d{1,' + scale + '})$|^\\d{0,10}$');
    const TotalMaterialCost = 'TotalMaterialCost';
    const TotalTaxAmount = 'TotalTaxAmount';
    const TotalMaterialCostAndTaxAmount = 'TotalMaterialCostAndTaxAmount';

    if (colName === 'BillQuantity') {
      try {
        if (item && item.BillQuantity) {
          const res = reg.test(item.BillQuantity.toString());
          if (!res) {
            item.IsBillQuantityValid = false;
            this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' Bill Quantity - Format should be XXXXXXXXXX.XXX ');
            return;
          } else {
            const billRate = item.BillRate ? item.BillRate : 0;

            if (item.BillRate.toString().includes('.')) {
              const arry = item.BillRate.toString().split('.');
              if (arry.length > 0) {
                item.InvoiceAmount = Number((item.BillQuantity * billRate).toFixed(arry[1].length));
              } else {
                item.InvoiceAmount = Number((item.BillQuantity * billRate).toFixed(2));
              }
            } else {
              item.InvoiceAmount = Number((item.BillQuantity * billRate).toFixed(2));
            }


            item.TaxAmountIGST = (item.InvoiceAmount * item.TaxRateIGST) / 100;
            item.TaxAmountCGST = (item.InvoiceAmount * item.TaxRateCGST) / 100;
            item.TaxAmountSGST = (item.InvoiceAmount * item.TaxRateSGST) / 100;
            item.TotalAmount = item.InvoiceAmount + item.TaxAmountIGST + item.TaxAmountCGST + item.TaxAmountSGST;
            this.orderDetailsForm.controls[TotalMaterialCost].setValue(
              this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.InvoiceAmount;
              }, 0));
            this.orderDetailsForm.controls[TotalTaxAmount].setValue(
              this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.TaxAmountIGST;
              }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.TaxAmountCGST;
              }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.TaxAmountSGST;
              }, 0));
            this.orderDetailsForm.controls[TotalTaxAmount].setValue((+this.orderDetailsForm.controls[TotalTaxAmount].value).toFixed(2));
            let totalMatAmount: number = +(this.orderDetailsForm.get(TotalMaterialCost).value) +
              +(this.orderDetailsForm.get(TotalTaxAmount).value);
            this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue(isNaN(totalMatAmount) ? 0 : totalMatAmount.toFixed(2));
            //  this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue((+this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].value).toFixed(3));
            this.calcTotalBillAmount();
            item.IsBillQuantityValid = true;
            return;
          }
        }

        item.IsBillQuantityValid = false;
        this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' Bill Quantity - Required Field. Format should be XXXXXXXXXX.XXX');
        return;
      } catch (error) {
        item.IsBillQuantityValid = false;
        this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' Bill Quantity - Required Field. Format should be XXXXXXXXXX.XXX');
      }
    }
    if (colName === 'BillRate') {
      try {
        if (item && item.BillRate) {
          const res = reg.test(item.BillRate.toString());
          if (!res) {
            item.IsBillRateValid = false;
            this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' Bill Rate - Format should be XXXXXXXXXX.XX ');
            return;
          } else {
            const billQuantity = item.BillQuantity ? item.BillQuantity : 0;
            if (item.BillRate.toString().includes('.')) {
              const arry = item.BillRate.toString().split('.');
              if (arry.length > 0) {
                item.InvoiceAmount = Number((billQuantity * item.BillRate).toFixed(arry[1].length));
              } else {
                item.InvoiceAmount = Number((billQuantity * item.BillRate).toFixed(2));
              }
            } else {
              item.InvoiceAmount = Number((billQuantity * item.BillRate).toFixed(2));
            }
            item.TaxAmountIGST = (item.InvoiceAmount * item.TaxRateIGST) / 100;
            item.TaxAmountCGST = (item.InvoiceAmount * item.TaxRateCGST) / 100;
            item.TaxAmountSGST = (item.InvoiceAmount * item.TaxRateSGST) / 100;
            item.TotalAmount = item.InvoiceAmount + item.TaxAmountIGST + item.TaxAmountCGST + item.TaxAmountSGST;
            this.orderDetailsForm.controls[TotalMaterialCost].setValue(
              this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.InvoiceAmount;
              }, 0));
            this.orderDetailsForm.controls[TotalTaxAmount].setValue(
              this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.TaxAmountIGST;
              }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.TaxAmountCGST;
              }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
                return prev + cur.TaxAmountSGST;
              }, 0));
            this.orderDetailsForm.controls[TotalTaxAmount].setValue((+this.orderDetailsForm.controls[TotalTaxAmount].value).toFixed(2));
            let totalMatAmount: number = +(this.orderDetailsForm.get(TotalMaterialCost).value) +
              +(this.orderDetailsForm.get(TotalTaxAmount).value);
            this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue(isNaN(totalMatAmount) ? 0 : totalMatAmount.toFixed(2));

            // this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue((+this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].value).toFixed(3));

            this.calcTotalBillAmount();
            item.IsBillRateValid = true;
            return;
          }
        }

        item.IsBillRateValid = false;
        this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' Bill Rate - Required Field. Format should be XXXXXXXXXX.XX ');
        return;
      } catch (error) {
        item.IsBillRateValid = false;
        this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' Bill Rate - Required Field. Format should be XXXXXXXXXX.XX ');
      }
    }
  }

  validateBatchNo(item: ReceivedMaterial) {
    const reg = new RegExp('^\\d{0,10}$');
    try {
      if (item && item.BatchNo) {
        const res = reg.test(item.BatchNo.toString());
        if (!res) {
          item.IsBatchNoValid = false;
          this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' BatchNo - Format should be XXXXXXXXXX ');
          return;
        } else {
          item.IsBatchNoValid = true;
          return;
        }
      }

      item.IsBatchNoValid = false;
      this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' BatchNo - Required Field. Format should be XXXXXXXXXX');
      return;
    } catch (error) {
      item.IsBatchNoValid = false;
      this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' BatchNo - Required Field. Format should be XXXXXXXXXX');
    }
  }
  validateReceivedQuantity(item: ReceivedMaterial) {
    const reg = new RegExp('^(?:\\d{0,10}\\.\\d{1,3})$|^\\d{0,10}$');
    try {
      if (item && item.ReceivedQuantity) {
        const res = reg.test(item.ReceivedQuantity.toString());
        if (!res) {
          item.IsReceivedQuantity = false;
          this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' ReceivedQuantity - Format should be XXXXXXXXXX.XXX ');
          return;
        } else {
          item.IsReceivedQuantity = true;
          return;
        }
      }

      item.IsReceivedQuantity = false;
      this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' ReceivedQuantity - Required Field. Format should be XXXXXXXXXX.XXX');
      return;
    } catch (error) {
      item.IsReceivedQuantity = false;
      this.alertService.error('Received Material Grid - Row # ' + this.receivedMaterialList.indexOf(item) + ' ReceivedQuantity - Required Field. Format should be XXXXXXXXXX.XXX');
    }
  }

  handleTabViewChange(event) {
    // console.log(event);
    this.activeIndex = event.index;
    this.disabledGRN = true;
    this.isDisabledNext = this.pendingPurchaseOrderList.filter(i => i.IsSelected).length <= 0 ||
      this.inwardDetailsList.filter(i => i.IsSelected).length <= 0;
  }

  domesticImportChange(event) {
    try {
      const TotalTaxAmount = 'TotalTaxAmount';
      const CustomsAmount = 'CustomsAmount';
      if (event === 'Domestic Purchase') {
        // const CustomsAmount = 'CustomsAmount';
        const TotalMaterialCost = 'TotalMaterialCost';
        // const TotalTaxAmount = 'TotalTaxAmount';
        const TotalMaterialCostAndTaxAmount = 'TotalMaterialCostAndTaxAmount';
        this.orderDetailsForm.controls[CustomsAmount].setValue(0);
        this.orderDetailsForm.controls[TotalTaxAmount].setValue(
          this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.TaxAmountIGST;
          }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.TaxAmountCGST;
          }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.TaxAmountSGST;
          }, 0));
        this.orderDetailsForm.controls[TotalTaxAmount].setValue((+this.orderDetailsForm.controls[TotalTaxAmount].value).toFixed(2));
        let totalMatAmount: number = +(this.orderDetailsForm.get(TotalMaterialCost).value) +
          +(this.orderDetailsForm.get(TotalTaxAmount).value);
        this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue(isNaN(totalMatAmount) ? 0 : totalMatAmount.toFixed(2));
        // this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue((+this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].value).toFixed(3));
      } else if (event === 'Import Purchase') {
        this.orderDetailsForm.controls[TotalTaxAmount].setValue(0);
        this.orderDetailsForm.controls[CustomsAmount].setValue('');
      }
    } catch (error) {
      this.alertService.error('Domestic Import change error - ' + error);
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.orderDetailsForm.controls).forEach(key => {
      this.orderDetailsForm.controls[key].markAsTouched();
    });
  }

  onSaveBtnClick(event) {
    this.markFormGroupTouched();
    // console.log(this.orderDetailsForm);
    if (!this.orderDetailsForm.valid) {
      return false;
    }

    const receivedMaterialGridValidations = this.receivedMaterialList.filter(
      s => !s.IsBillQuantityValid || !s.IsBillRateValid || !s.IsBatchNoValid || !s.IsReceivedQuantity
        || !s.BillQuantity || !s.BillRate || !s.BatchNo || !s.ReceivedQuantity);
    // console.log(this.orderDetailsForm.value);
    if (receivedMaterialGridValidations.length > 0) {

      this.alertService.error('Please resolve all issues in Received Material Grid');
      return false;
    }

    const results = {};
    Object.keys(this.orderDetailsForm.controls).forEach(key => {
      results[key] = this.orderDetailsForm.controls[key].value;
    });

    const OrderMaterialDetails = 'OrderMaterialDetails';
    const OrderMaterialTotalCostDetails = 'OrderMaterialTotalCostDetails';

    if (this.modifyMode) {
      this.modifyOrderMaterialTotalCostDetail = this.goodsReceiptNote.OrderMaterialTotalCostDetails;
    }
    results[OrderMaterialDetails] = [];
    results[OrderMaterialTotalCostDetails] = [];


    this.receivedMaterialList.forEach(
      rm => {
        results[OrderMaterialDetails].push({
          Id: rm.Id,
          RMGRNNO: this.orderDetailsForm.get('RMGRNNo').value,
          RMPONO: rm.PONo,
          RawMaterialGroupCode: rm.RawMaterialGroupCode,
          RawMaterialDetailsCode: rm.RawMaterialDetailsCode,
          RMGRNBillQty: rm.BillQuantity.toFixed(3),
          RMPORate: rm.RMPORate.toFixed(2),
          RMGRNBillRate: rm.BillRate.toFixed(2),
          RMGRNMaterialWiseCost: rm.InvoiceAmount.toFixed(2),
          RMGRNIGSTRate: rm.TaxRateIGST ? rm.TaxRateIGST.toFixed(2) : 0,
          RMGRNIGSTAmount: rm.TaxAmountIGST ? rm.TaxAmountIGST.toFixed(2) : 0,
          RMGRNCGSTRate: rm.TaxRateCGST ? rm.TaxRateCGST.toFixed(2) : 0,
          RMGRNCGSTAmount: rm.TaxAmountCGST ? rm.TaxAmountCGST.toFixed(2) : 0,
          RMGRNSGSTRate: rm.TaxRateSGST ? rm.TaxRateSGST.toFixed(2) : 0,
          RMGRNSGSTAmount: rm.TaxAmountSGST ? rm.TaxAmountSGST.toFixed(2) : 0,
          RMGRNMaterialWiseTotalCost: rm.TotalAmount.toFixed(2),
          RMGRNBatchNo: rm.BatchNo
        });

        const TotalMaterialCostAndTaxAmount = this.orderDetailsForm.get('TotalMaterialCostAndTaxAmount').value;
        const CustomsAmount = this.orderDetailsForm.get('CustomsAmount').value;
        const PackingAmount = this.orderDetailsForm.get('PackingAmount').value;
        const PackingTaxAmount = this.orderDetailsForm.get('PackingTaxAmount').value;
        const FreightAmount = this.orderDetailsForm.get('FreightAmount').value;
        const FreightTaxAmount = this.orderDetailsForm.get('FreightTaxAmount').value;
        const InsuranceAmount = this.orderDetailsForm.get('InsuranceAmount').value;
        const InsuranceTaxAmount = this.orderDetailsForm.get('InsuranceTaxAmount').value;

        const calcRMCustomsShareAmount = Number(CustomsAmount ? CustomsAmount : 0) * (rm.TotalAmount /
          Number(TotalMaterialCostAndTaxAmount ? TotalMaterialCostAndTaxAmount : 0));

        const calcRMPackingShareAmount =
          (Number(PackingAmount ? PackingAmount : 0) + Number(PackingTaxAmount ? PackingTaxAmount : 0))
          * (rm.TotalAmount / Number(TotalMaterialCostAndTaxAmount ? TotalMaterialCostAndTaxAmount : 0));

        const calcRMFreightShareAmount =
          (Number(FreightAmount ? FreightAmount : 0) + Number(FreightTaxAmount ? FreightTaxAmount : 0))
          * (rm.TotalAmount / Number(TotalMaterialCostAndTaxAmount ? TotalMaterialCostAndTaxAmount : 0));

        const calcRMInsuranceShareAmount =
          (Number(InsuranceAmount ? InsuranceAmount : 0) + Number(InsuranceTaxAmount ? InsuranceTaxAmount : 0))
          * (rm.TotalAmount / Number(TotalMaterialCostAndTaxAmount ? TotalMaterialCostAndTaxAmount : 0));

        const calcRMGRNMaterialwiseTotalCost = rm.TotalAmount + calcRMCustomsShareAmount
          + calcRMPackingShareAmount
          + calcRMFreightShareAmount + calcRMInsuranceShareAmount;


        results[OrderMaterialTotalCostDetails].push({
          Id: this.modifyMode ? this.modifyOrderMaterialTotalCostDetail.filter(i => (i.RawMaterialGroupCode === rm.RawMaterialGroupCode
            && i.RawMaterialDetailsCode === rm.RawMaterialDetailsCode))[0].Id : 0,
          RMGRNNO: this.orderDetailsForm.get('RMGRNNo').value,
          RawMaterialGroupCode: rm.RawMaterialGroupCode,
          RawMaterialDetailsCode: rm.RawMaterialDetailsCode,
          RMGRNMaterialWiseTotalCost: rm.TotalAmount.toFixed(2),
          RMBatchNo: 0,
          //RMGRNBatchNo: rm.BatchNo,
          RMGRNReceivedQty: rm.ReceivedQuantity,
          RMCustomsShareAmount: calcRMCustomsShareAmount.toFixed(2),
          RMPackingShareAmount: calcRMPackingShareAmount.toFixed(2),
          RMFreightShareAmount: calcRMFreightShareAmount.toFixed(2),
          RMInsuranceShareAmount: calcRMInsuranceShareAmount.toFixed(2),
          RMGRNMaterialwiseTotalCost: calcRMGRNMaterialwiseTotalCost.toFixed(2),
          RMGRNMaterialwiseTotalRate: (calcRMGRNMaterialwiseTotalCost / rm.ReceivedQuantity === Infinity
            ? 0 : calcRMGRNMaterialwiseTotalCost / rm.ReceivedQuantity).toFixed(2),
        });
      }
    );
    // console.log(results);
    if (this.modifyMode) {
      this.goodsReceiptNoteService.updateGoodsReceiptNoteDetails(results).subscribe(res => {
        if (res.IsSucceed) {
          this.alertService.success('GRN Details Updated Successfully');
          this.clearContent();
        } else {
          this.alertService.error('Error while updating goods receipt note details! - ' + res.Exception);
        }
      },
        error => {
          this.alertService.error('Error while updating goods receipt note details! - ' + error);
        });
    } else {
      this.goodsReceiptNoteService.addGoodsReceiptNoteDetails(results).subscribe(res => {
        this.alertService.success('GRN Details Saved Successfully');
        this.clearContent();
      },
        error => {
          this.alertService.error('Error while saving goods receipt note details! - ' + error);
        });

    }
  }

  calcTotalBillAmount() {
    const TotalMaterialCostAndTaxAmount = 'TotalMaterialCostAndTaxAmount';
    const CustomsAmount = 'CustomsAmount';
    const PackingAmount = 'PackingAmount';
    const PackingTaxAmount = 'PackingTaxAmount';
    const FreightAmount = 'FreightAmount';
    const FreightTaxAmount = 'FreightTaxAmount';
    const InsuranceAmount = 'InsuranceAmount';
    const InsuranceTaxAmount = 'InsuranceTaxAmount';
    const TotalBillAmount = 'TotalBillAmount';
    const BalanceAmount = 'BalanceAmount';

    let TotalMaterialCostAndTaxAmountValue = this.orderDetailsForm.get(TotalMaterialCostAndTaxAmount).value;
    let CustomsAmountValue = this.orderDetailsForm.get(CustomsAmount).value;
    let PackingAmountValue = this.orderDetailsForm.get(PackingAmount).value;
    let PackingTaxAmountValue = this.orderDetailsForm.get(PackingTaxAmount).value;
    let FreightAmountValue = this.orderDetailsForm.get(FreightAmount).value;
    let FreightTaxAmountValue = this.orderDetailsForm.get(FreightTaxAmount).value;
    let InsuranceAmountValue = this.orderDetailsForm.get(InsuranceAmount).value;
    let InsuranceTaxAmountValue = this.orderDetailsForm.get(InsuranceTaxAmount).value;
    //let dscountAMountValue = this.orderDetailsForm.get('DiscountAmount').value;

    TotalMaterialCostAndTaxAmountValue = Number(TotalMaterialCostAndTaxAmountValue ? TotalMaterialCostAndTaxAmountValue : 0);
    CustomsAmountValue = Number(CustomsAmountValue ? CustomsAmountValue : 0);
    PackingAmountValue = Number(PackingAmountValue ? PackingAmountValue : 0);
    PackingTaxAmountValue = Number(PackingTaxAmountValue ? PackingTaxAmountValue : 0);
    FreightTaxAmountValue = Number(FreightTaxAmountValue ? FreightTaxAmountValue : 0);
    FreightAmountValue = Number(FreightAmountValue ? FreightAmountValue : 0);
    InsuranceAmountValue = Number(InsuranceAmountValue ? InsuranceAmountValue : 0);
    InsuranceTaxAmountValue = Number(InsuranceTaxAmountValue ? InsuranceTaxAmountValue : 0);
    // dscountAMountValue = Number(dscountAMountValue ? dscountAMountValue : 0);

    let tBillAmount = TotalMaterialCostAndTaxAmountValue +
      CustomsAmountValue + PackingAmountValue + PackingTaxAmountValue + FreightAmountValue
      + FreightTaxAmountValue + InsuranceAmountValue + InsuranceTaxAmountValue;
    this.orderDetailsForm.controls[TotalBillAmount].setValue(Math.round(tBillAmount));

    this.orderDetailsForm.controls[BalanceAmount].setValue(TotalMaterialCostAndTaxAmountValue +
      CustomsAmountValue + PackingAmountValue + PackingTaxAmountValue + FreightAmountValue
      + FreightTaxAmountValue + InsuranceAmountValue + InsuranceTaxAmountValue);
  }

  // calculateDiscountAmount() {
  //   const TotalBillAmount = 'TotalBillAmount';
  //   const AdvancePayment = 'AdvancePayment';
  //   const BalanceAmount = 'BalanceAmount';

  //   let TotalBillAmountValue = this.orderDetailsForm.get(TotalBillAmount).value;
  //   let AdvancePaymentValue = this.orderDetailsForm.get(AdvancePayment).value;
  //   let discountAmount = this.orderDetailsForm.get('DiscountAmount').value;

  //   TotalBillAmountValue = Number(TotalBillAmountValue ? TotalBillAmountValue : 0);
  //   AdvancePaymentValue = Number(AdvancePaymentValue ? AdvancePaymentValue : 0);
  //   let finalAmount = TotalBillAmountValue - AdvancePaymentValue;

  //   let percentange = this.orderDetailsForm.controls.DiscountPercentage.value;
  //   let discountAmountFinal = (+percentange * finalAmount) / 100;
  //   this.orderDetailsForm.controls.DiscountAmount.setValue(discountAmountFinal);
  // }

  calcBalanceAmount() {
    const TotalBillAmount = 'TotalBillAmount';
    const AdvancePayment = 'AdvancePayment';
    const BalanceAmount = 'BalanceAmount';

    let TotalBillAmountValue = this.orderDetailsForm.get(TotalBillAmount).value;
    let AdvancePaymentValue = this.orderDetailsForm.get(AdvancePayment).value;
    //let discountAmount = this.orderDetailsForm.get('DiscountAmount').value;

    TotalBillAmountValue = Number(TotalBillAmountValue ? TotalBillAmountValue : 0);
    AdvancePaymentValue = Number(AdvancePaymentValue ? AdvancePaymentValue : 0);
    //discountAmount = Number(discountAmount ? discountAmount : 0);

    let finalAmount = TotalBillAmountValue - AdvancePaymentValue;
    this.calcTotalBillAmount();
    this.orderDetailsForm.controls[BalanceAmount].setValue(finalAmount);

  }
  setParkingFamilyZero() {
    const PackingAmount = 'PackingAmount';
    const PackingHSNCode = 'PackingHSNCode';
    const PackingTaxRatePercentage = 'PackingTaxRatePercentage';
    const PackingTaxAmount = 'PackingTaxAmount';
    if (this.orderDetailsForm.get(PackingAmount).value === '0') {
      this.orderDetailsForm.controls[PackingHSNCode].setValue(0);
      this.orderDetailsForm.controls[PackingTaxRatePercentage].setValue(0);
      this.orderDetailsForm.controls[PackingTaxAmount].setValue(0);
      this.FreightAmount.nativeElement.focus();
    }
  }
  setInsuranceFamilyZero() {
    const InsuranceAmount = 'InsuranceAmount';
    const InsuranceHSNCode = 'InsuranceHSNCode';
    const InsuranceTaxRatePercentage = 'InsuranceTaxRatePercentage';
    const InsuranceTaxAmount = 'InsuranceTaxAmount';
    if (this.orderDetailsForm.get(InsuranceAmount).value === '0') {
      this.orderDetailsForm.controls[InsuranceHSNCode].setValue(0);
      this.orderDetailsForm.controls[InsuranceTaxRatePercentage].setValue(0);
      this.orderDetailsForm.controls[InsuranceTaxAmount].setValue(0);
      this.AdvancePayment.nativeElement.focus();
    }
  }
  setFreightFamilyZero() {
    const FreightAmount = 'FreightAmount';
    const FreightHSNCode = 'FreightHSNCode';
    const FreightTaxRatePercentage = 'FreightTaxRatePercentage';
    const FreightTaxAmount = 'FreightTaxAmount';
    if (this.orderDetailsForm.get(FreightAmount).value === '0') {
      this.orderDetailsForm.controls[FreightHSNCode].setValue(0);
      this.orderDetailsForm.controls[FreightTaxRatePercentage].setValue(0);
      this.orderDetailsForm.controls[FreightTaxAmount].setValue(0);
      this.InsuranceAmount.nativeElement.focus();
    }
  }

  Find() {
    this.GRNCodes = [];
    this.receivedMaterialList = [];
    this.activeIndex = 1;
    this.disableModify = false;
    this.disableFind = true;
    this.disabledGRN = false;
    this.findMode = true;
    this.getAllSuppliers();
    this.orderDetailsForm.reset();
    this.orderDetailsForm.disable();
    this.orderDetailsForm.controls.SupplierOrganisationName.enable();
    this.orderDetailsForm.controls.RMGRNNo.enable();
  }
  Modify() {
    this.GRNCodes = [];
    this.receivedMaterialList = [];
    this.activeIndex = 1;
    this.disableModify = true;
    this.disabledGRN = false;
    this.disableFind = false;
    this.findMode = false;
    this.modifyMode = true;
    this.getAllSuppliers();
    this.orderDetailsForm.reset();
    this.orderDetailsForm.disable();
    this.orderDetailsForm.controls.SupplierOrganisationName.enable();
    this.orderDetailsForm.controls.RMGRNNo.enable();
    this.orderDetailsForm.controls.RMGRNDate.enable();
  }

  getAllSuppliers() {
    this.goodsReceiptNoteService.getAllSuppliers().subscribe(res => {
      this.supplierOrgs = res;
    },
      error => {
        this.alertService.error('Error while getting Get All Suppliers! - ' + error);
      });
  }

  getGRNCodeBySupOrgId(SupOrgId) {
    this.goodsReceiptNoteService.GetGRNCodeBySupOrgId(SupOrgId).subscribe(res => {
      this.GRNCodes = [];
      if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
        if (isArray(res.Data) && res.Data.length > 0) {
          this.GRNCodes = res.Data;
        }
      } else {
        this.alertService.error('Error while getting Get GRN Code By SupOrgId! - ' + res.Exception);
      }
    },
      error => {
        this.alertService.error('Error while getting Get GRN Code By SupOrgId! - ' + error);
      });
  }

  getGoodsReceiptNoteByGRNCode(GRNCode) {

    this.goodsReceiptNoteService.GetGoodsReceiptNoteByGRNCode(GRNCode).subscribe((res) => {
      if (res.IsSucceed && !isNullOrUndefined(res.Data)) {
        this.goodsReceiptNote = res.Data;
        this.setData(res.Data);
      } else {
        this.alertService.error('Error while getting Get Goods Receipt Note By GRNCode! - ' + res.Exception);
      }
    },
      error => {
        this.alertService.error('Error while getting Get Goods Receipt Note By GRNCode! - ' + error);
      });
  }


  changeSupplier(e) {
    try {
      this.receivedMaterialList = [];
      const selectedSupp = this.orderDetailsForm.controls.SupplierOrganisationName.value;
      this.orderDetailsForm.reset();
      this.orderDetailsForm.disable();
      this.orderDetailsForm.controls.SupplierOrganisationName.enable();
      this.orderDetailsForm.controls.RMGRNNo.enable();
      this.orderDetailsForm.controls.SupplierOrganisationName.setValue(selectedSupp);
      if (selectedSupp) {
        this.getPlacesBySuppOrgId(selectedSupp);
        this.getSupplierOrganisationInfo(selectedSupp);
      }
      if (this.findMode || this.modifyMode) {
        this.getGRNCodeBySupOrgId(selectedSupp);
      }
    } catch (error) {

    }
  }

  changeGRNNo(e) {
    try {
      this.getGoodsReceiptNoteByGRNCode(e.value);
      if (this.modifyMode) {
        this.receivedMaterialList = [];
        this.orderDetailsForm.enable();
        this.disableControls();
        //this.orderDetailsForm.controls.RMGRNDate.enable();
      }
    } catch (error) {
      console.log(error);
    }
  }

  getPlacesBySuppOrgId(supplierOrgId: string) {
    try {
      this.goodsReceiptNoteService.getPlacesBySuppOrgId(supplierOrgId).subscribe((data) => {
        if (data) {
          this.orderDetailsForm.controls.PlaceName.setValue(data[0].PlaceName);
        }
      });
    } catch (error) {

    }
  }

  setData(goodsReceiptNote: GoodsReceiptNote) {
    const OrderMaterialDetails = goodsReceiptNote.OrderMaterialDetails;
    // tslint:disable-next-line: no-shadowed-variable
    const OrderMaterialTotalCostDetail = goodsReceiptNote.OrderMaterialTotalCostDetails;
    OrderMaterialDetails.forEach(ppOrder => {
      this.receivedMaterialList.push({
        Id: ppOrder.Id,
        InwardDateTime: goodsReceiptNote.BillDCDate,
        InwardGatePassNo: goodsReceiptNote.InwardGatePassNo,
        PODate: ppOrder.PODate,
        PONo: ppOrder.RMPONO,
        RawMaterialGroupCode: ppOrder.RawMaterialGroupCode,
        RawMaterialDetailsCode: ppOrder.RawMaterialDetailsCode,
        SupplierNamePlace: ppOrder.SupplierOrganisationName,
        MaterialName: ppOrder.RawMaterialDetaisName,
        POQuantity: ppOrder.RMGRNBillQty,
        TillNowRecordQuantity: ppOrder.TillNowRecordQuantity,
        PendingQuatity: ppOrder.RMOrderQty - ppOrder.TillNowRecordQuantity,
        BillQuantity: ppOrder.RMGRNBillQty,
        RMPORate: ppOrder.RMPORate,
        BillRate: ppOrder.RMGRNBillRate,
        InvoiceAmount: ppOrder.RMGRNMaterialWiseTotalCost,
        TaxRateIGST: ppOrder.RMPOMaterialIGSTRate,
        TaxAmountIGST: 0,
        TaxRateCGST: ppOrder.RMPOMaterialCGSTRate,
        TaxAmountCGST: 0,
        TaxRateSGST: ppOrder.RMPOMaterialSGSRate,
        TaxAmountSGST: 0,
        TotalAmount: ppOrder.RMGRNMaterialWiseTotalCost,
        //BatchNo: ppOrder.,
        BatchNo: ppOrder.RMGRNBatchNo,
        ReceivedQuantity: OrderMaterialTotalCostDetail.filter(i => (i.RawMaterialGroupCode === ppOrder.RawMaterialGroupCode
          && i.RawMaterialDetailsCode === ppOrder.RawMaterialDetailsCode))[0].RMGRNReceivedQty,
        IsBatchNoValid: true,
        IsBillQuantityValid: true,
        IsBillRateValid: true,
        IsReceivedQuantity: true
      });
    });

    this.orderDetailsForm.controls.RMGRNDate.patchValue(new Date(goodsReceiptNote.RMGRNDate));
    this.orderDetailsForm.controls.InwardGatePassNo.patchValue(goodsReceiptNote.InwardGatePassNo);
    this.orderDetailsForm.controls.DomesticImport.patchValue(goodsReceiptNote.DomesticImport);
    this.orderDetailsForm.controls.InvoiceDCType.patchValue(goodsReceiptNote.InvoiceDCType);
    this.orderDetailsForm.controls.BillDCDate.patchValue(goodsReceiptNote.BillDCDate);
    this.orderDetailsForm.controls.SupplierOrgID.patchValue(goodsReceiptNote.SupplierOrgID);
    this.orderDetailsForm.controls.BillDCNo.patchValue(goodsReceiptNote.BillDCNo);
    this.orderDetailsForm.controls.Currency.patchValue(goodsReceiptNote.Currency);
    this.orderDetailsForm.controls.TotalMaterialCost.patchValue(goodsReceiptNote.TotalMaterialCost);
    this.orderDetailsForm.controls.GSTType.patchValue(goodsReceiptNote.GSTType);
    this.orderDetailsForm.controls.TotalTaxAmount.patchValue(goodsReceiptNote.TotalTaxAmount);
    this.orderDetailsForm.controls.TotalMaterialCostAndTaxAmount.patchValue(goodsReceiptNote.TotalMaterialCost);
    this.orderDetailsForm.controls.CustomsAmount.patchValue(goodsReceiptNote.CustomsAmount);
    this.orderDetailsForm.controls.PackingAmount.patchValue(goodsReceiptNote.PackingAmount);
    this.orderDetailsForm.controls.PackingHSNCode.patchValue(goodsReceiptNote.PackingHSNCode);
    this.orderDetailsForm.controls.PackingTaxRatePercentage.patchValue(goodsReceiptNote.PackingTaxRatePercentage);
    this.orderDetailsForm.controls.PackingTaxAmount.patchValue(goodsReceiptNote.PackingTaxAmount);
    this.orderDetailsForm.controls.FreightAmount.patchValue(goodsReceiptNote.FreightAmount);
    this.orderDetailsForm.controls.FreightHSNCode.patchValue(goodsReceiptNote.FreightHSNCode);
    this.orderDetailsForm.controls.FreightTaxRatePercentage.patchValue(goodsReceiptNote.FreightTaxRatePercentage);
    this.orderDetailsForm.controls.FreightTaxAmount.patchValue(goodsReceiptNote.FreightTaxAmount);
    this.orderDetailsForm.controls.InsuranceAmount.patchValue(goodsReceiptNote.InsuranceAmount);
    this.orderDetailsForm.controls.InsuranceHSNCode.patchValue(goodsReceiptNote.InsuranceHSNCode);
    this.orderDetailsForm.controls.InsuranceTaxRatePercentage.patchValue(goodsReceiptNote.InsuranceTaxRatePercentage);
    this.orderDetailsForm.controls.InsuranceTaxAmount.patchValue(goodsReceiptNote.InsuranceTaxAmount);
    this.orderDetailsForm.controls.TotalBillAmount.patchValue(goodsReceiptNote.TotalBillAmount);
    this.orderDetailsForm.controls.AdvancePayment.patchValue(goodsReceiptNote.AdvancePayment);
    this.orderDetailsForm.controls.BalanceAmount.patchValue(goodsReceiptNote.BalanceAmount);
    this.orderDetailsForm.controls.CreditDays.patchValue(goodsReceiptNote.CreditDays);
    //  this.orderDetailsForm.controls.DiscountAmount.patchValue(goodsReceiptNote.DiscountAmount);
    // this.orderDetailsForm.controls.DiscountPercentage.patchValue(goodsReceiptNote.DiscountPercentage);

  }

  editClick(item: ReceivedMaterial) {
    const dialogRef = this.dialog.open(ReceivedMaterialPopupComponent, {
      width: '700px',
      data: item
    });
    dialogRef.afterClosed().subscribe((res: BatchMaterialDetails) => {
      if (res) {
        item.BatchNo = res.RM_GRN_Batch_No;
        item.BillQuantity = res.Total_Quantity;
        item.BillRate = res.Net_Material_Rate;
        item.InvoiceAmount = +res.Net_Material_Amount.toFixed(2);
        item.ReceivedQuantity = res.Received_Quantity;

        item.TaxAmountIGST = +((item.InvoiceAmount * item.TaxRateIGST) / 100).toFixed(2);
        item.TaxAmountCGST = +((item.InvoiceAmount * item.TaxRateCGST) / 100).toFixed(2);
        item.TaxAmountSGST = +((item.InvoiceAmount * item.TaxRateSGST) / 100).toFixed(2);
        item.TotalAmount = +(item.InvoiceAmount + item.TaxAmountIGST + item.TaxAmountCGST + item.TaxAmountSGST).toFixed(2);

        const TotalMaterialCost = 'TotalMaterialCost';
        const TotalTaxAmount = 'TotalTaxAmount';
        const TotalMaterialCostAndTaxAmount = 'TotalMaterialCostAndTaxAmount';
        this.orderDetailsForm.controls[TotalMaterialCost].setValue(
          this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.InvoiceAmount;
          }, 0));
        this.orderDetailsForm.controls[TotalTaxAmount].setValue(
          this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.TaxAmountIGST;
          }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.TaxAmountCGST;
          }, 0) + this.receivedMaterialList.reduce((prev, cur) => {
            return prev + cur.TaxAmountSGST;
          }, 0));
        this.orderDetailsForm.controls[TotalTaxAmount].setValue((+this.orderDetailsForm.controls[TotalTaxAmount].value).toFixed(2));
        let totalMatAmount: number = +(this.orderDetailsForm.get(TotalMaterialCost).value) +
          +(this.orderDetailsForm.get(TotalTaxAmount).value);
        this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue(isNaN(totalMatAmount) ? 0 : totalMatAmount.toFixed(2));
        // this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].setValue((+this.orderDetailsForm.controls[TotalMaterialCostAndTaxAmount].value).toFixed(3));
        this.calcTotalBillAmount();
        item.IsBillQuantityValid = true;
        item.IsBatchNoValid = true;
        item.IsReceivedQuantity = true;
      }
    });
  }
}
