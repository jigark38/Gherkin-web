import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FOCUS_MONITOR_PROVIDER } from '@angular/cdk/a11y';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {
  OrderMaterialDetail, IndentDetail, SupplierOrgModel, PlaceModel, StateModel, CountryModel,
  PurchaseOrderDetail, TaxPercentageRate, CreatePOWithMaterialAndCondition, MaterialCondition, RMPOIndentDetail
} from './purchage-order.models';
import { PurchageOrderService } from './purchage-order.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { MomentUtcDateAdapter } from 'src/app/shared/directives/moment-utc-date-adapter';
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
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PurchaseOrderComponent implements OnInit {

  @ViewChild('particilars', { static: false }) particilarsField: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;

  orderMaterialDetailList: OrderMaterialDetail[];
  materialConditionList: MaterialCondition[] = [];
  orderMaterialDetailNotSelectedList: RMPOIndentDetail[] = [];
  noSelectIndent = '';
  tabIndex = 0;
  indentDetailsList: IndentDetail[] = [];
  disableNextPanel = false;
  nextOrderId = 0;
  modifyCreatePOWithMaterialAndCondition: CreatePOWithMaterialAndCondition;
  selectedMaterialCondition: MaterialCondition;

  purchageOrderForm = new FormGroup({
    orderDate: new FormControl('', [Validators.required]),
    orderNumber: new FormControl('', [Validators.required]), // TODO
    domesticImport: new FormControl('', [Validators.required]),
    nameOfSupplier: new FormControl('', [Validators.required]),
    place: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    igstSgst: new FormControl('', [Validators.required]),
    throughQuotation: new FormControl('', [Validators.required]),
    packingCondition: new FormControl('', [Validators.required]),
    packingStyle: new FormControl('', [Validators.required]),
    packingQuantity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    packingRate: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/)]),
    packingAmount: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,15}$/)]),
    deliveryCondition: new FormControl('', [Validators.required]),
    frieghtAmount: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,15}$/)]),
    insuranceCondtion: new FormControl('', [Validators.required]),
    insuranceAmount: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,15}$/)]),
    paymentTerms: new FormControl('', [Validators.required]),
    advance: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,15}\.\d{1,2})$|^\d{0,15}$/)]),
    creditDays: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    deliveryDate: new FormControl(''),
    deliveryDays: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    totalPOAmount: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,20}\.\d{1,2})$|^\d{0,20}$/)]),
    poValidTill: new FormControl('', [Validators.required]),
    poValidDays: new FormControl('', [Validators.pattern(/^[0-9]*$/)])
  });


  materialConditionForm = new FormGroup({
    particulars: new FormControl(''),
    details: new FormControl(''),
    remarks: new FormControl('')
  });
  supplierOrgList: SupplierOrgModel[];
  placeList: PlaceModel[] = [];
  stateList: StateModel[];
  countryList: CountryModel[];
  disableModify: boolean;
  disableFind: boolean;
  disableSave: boolean;
  findMode: boolean;
  modifyMode: boolean;

  orderList = [];


  constructor(private purchageOrderService: PurchageOrderService,
    // tslint:disable-next-line: align
    private alertSrvice: AlertService,
    // tslint:disable-next-line: align
    public dialog: MatDialog) { }
  orgCols2: any[];
  orgCols4: any[];
  ngOnInit() {
    this.initData();


  }

  initData() {
    try {
      this.orderMaterialDetailList = [];
      this.purchageOrderForm.controls.orderNumber.disable();
      this.purchageOrderForm.controls.totalPOAmount.disable();
      this.getIndentDetails();


      this.orgCols2 = [
        // take field name from table
        { field: ' ', header: 'Sl. No.' },
        { field: ' ', header: 'Vendor Name' },
        { field: ' ', header: 'State' },
        { field: ' ', header: 'Last Transaction Qty.' },
        { field: ' ', header: 'Last Transaction Rate' },
        { field: ' ', header: 'Last Transaction Date' },
        { field: ' ', header: 'Till Date PQ' },
        { field: ' ', header: 'Till Date Qty.(%)' },
        { field: ' ', header: 'Till Date PA(Rs)' },
      ];

      this.orgCols4 = [
        // take field name from table
        { field: 'poMc', header: 'Particulars' },
        { field: 'poMd', header: 'Details' },
        { field: 'poMr', header: 'Remarks' },
      ];
    } catch (error) {

    }

  }

  clearPackOfPracDetails() { }


  //#region Validations
  validateQuotedRate(material: OrderMaterialDetail) {
    try {
      if (material && material.rmQuotationRate) {
        const pattern = new RegExp('');
        const res = /^(?:\d{0,10}\.\d{1,2})$|^\d{0,10}$/.test(material.rmQuotationRate);
        if (!res) {
          material.isQuotedRateValid = false;
          return;
        } else {
          material.rmQuotationRate = Number(material.rmQuotationRate).toFixed(2).toString();
          material.isQuotedRateValid = true;
          return;
        }
      }

      material.isQuotedRateValid = true;
      return;
    } catch (error) {
      material.isQuotedRateValid = false;
    }
  }

  validatePORate(material: OrderMaterialDetail) {
    if (typeof material.rmPoRate === 'number') {
      const tempRoRate: number = material.rmPoRate;
      material.rmPoRate = tempRoRate.toString();
    }
    try {
      if (material && material.rmPoRate) {
        const pattern = new RegExp('');
        const res = /^(?:\d{0,10}\.\d{1,5})$|^\d{0,10}$/.test(material.rmPoRate);
        if (!res) {
          material.isPORateValid = false;
          return;
        } else {
          if (material.rmPoRate.includes('.')) {
            const arr = material.rmPoRate.split('.');
            if (arr && arr.length > 0) {
              material.rmPoRate = Number(material.rmPoRate).toFixed(arr[1].length).toString();
            } else {
              material.rmPoRate = Number(material.rmPoRate).toFixed(2).toString();
            }
          } else {
            material.rmPoRate = Number(material.rmPoRate).toFixed(2).toString();
          }
          material.isPORateValid = true;
          return;
        }
      }

      material.isPORateValid = false;
      return;
    } catch (error) {
      material.isPORateValid = false;
    }
  }

  validateOrderQuantity(indent: IndentDetail) {
    try {
      if (indent && indent.orderQty) {
        const pattern = new RegExp('');
        const res = /^(?:\d{0,10}\.\d{1,3})$|^\d{0,10}$/.test(indent.orderQty);
        if (!res) {
          indent.isOrderQuantityValid = false;
          return;
        } else {
          indent.orderQty = Number(indent.orderQty).toFixed(3).toString();
          indent.isOrderQuantityValid = true;
          return;
        }
      }

      indent.isOrderQuantityValid = false;
      return;
    } catch (error) {
      indent.isOrderQuantityValid = false;
    }
  }

  //#endregion


  //#region  Indent Material Region
  getIndentDetails() {
    try {
      this.purchageOrderService.getIndentDetails().subscribe((data: IndentDetail[] | string) => {
        if (data && data !== 'Indents details are not found.') {
          this.indentDetailsList = (data as IndentDetail[]);
          this.calculateTotalIndentQty();
          let countIndent: number = this.indentDetailsList.length;
          this.indentDetailsList.map(a => {
            a.id = this.indentDetailsList.length - countIndent;
            countIndent = countIndent - 1;
            this.validateOrderQuantity(a);
          });
        } else {
          this.indentDetailsList = [];
        }
      }, err => {
        this.alertSrvice.error('Error has occured while fetching Indent details.');
      });
    } catch (error) {

    }
  }

  calculateTotalIndentQty() {
    try {
      if (this.indentDetailsList && this.indentDetailsList.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.indentDetailsList.length; i++) {
          const indent = this.indentDetailsList[i];
          const prevIndent = this.indentDetailsList[i - 1];

          if (indent && prevIndent) {
            if (indent && prevIndent && indent.rawMaterialDetailsCode === prevIndent.rawMaterialDetailsCode) {
              indent.totalIndentQuantity = (+indent.indentQty + +prevIndent.totalIndentQuantity).toFixed(2).toString();
            } else {
              indent.totalIndentQuantity = (+indent.indentQty).toFixed(2).toString();
            }
          } else {
            indent.totalIndentQuantity = (+indent.indentQty).toFixed(2).toString();
          }
        }
      }
    } catch (error) {

    }
  }

  decideOrderQuantityDisplay() {
    try {
      this.indentDetailsList.map(a => {
        a.isInputAllowed = false;
      });
      const distinctList: string[] = this.indentDetailsList.filter(a => a.isSelected).map(item => item.rawMaterialDetailsCode)
        .filter((value, index, self) => self.indexOf(value) === index);
      distinctList.forEach(rawMaterialDetailsCode => {

        const matchedList = this.indentDetailsList.filter(a => a.isSelected && a.rawMaterialDetailsCode === rawMaterialDetailsCode);
        if (matchedList) {
          const matchedIndent = matchedList[matchedList.length - 1].id;
          this.indentDetailsList[this.indentDetailsList.findIndex(a => a.id === matchedIndent)].isInputAllowed = true;

        }
      });
    } catch (error) {

    }
  }

  pushIndentDetailsToPurchageMaterial() {
    try {
      this.orderMaterialDetailList = [];
      this.indentDetailsList.forEach(indent => {
        if (indent && indent.isSelected) {
          const orderMaterial: OrderMaterialDetail = new OrderMaterialDetail();
          orderMaterial.rmIndentNo = indent.indentNo;
          orderMaterial.rawMaterialGroupCode = indent.materialGroupCode;
          orderMaterial.rowMaterialDetailsCode = indent.rawMaterialDetailsCode;
          orderMaterial.materialName = indent.rawMaterialDetailsName;
          orderMaterial.rmOrderQty = indent.orderQty;
          orderMaterial.orderQuantityUOM = indent.indentUom;
          orderMaterial.isSelected = indent.isInputAllowed;
          if (orderMaterial.isSelected) {
            this.orderMaterialDetailList.push(orderMaterial);
            const rmPOIndentDetail: RMPOIndentDetail = {
              rmPoNo: orderMaterial.rmPoNo,
              rmIndentNo: orderMaterial.rmIndentNo
            };
            this.orderMaterialDetailNotSelectedList.push(rmPOIndentDetail);

          } else {
            const rmPOIndentDetail: RMPOIndentDetail = {
              rmPoNo: orderMaterial.rmPoNo,
              rmIndentNo: orderMaterial.rmIndentNo
            };
            this.orderMaterialDetailNotSelectedList.push(rmPOIndentDetail);

          }
        }
      });
    } catch (error) {

    }
  }

  updatePurchageMaterialFromIndentDetails() {
    try {
      this.orderMaterialDetailList.forEach(orderMaterialDetail => {
        const materialName = this.modifyCreatePOWithMaterialAndCondition.indentMaterialNames.find(x => x.materialGroupCode === orderMaterialDetail.rawMaterialGroupCode && x.rawMaterialDetailsCode === orderMaterialDetail.rowMaterialDetailsCode);

        if (materialName) {
          orderMaterialDetail.materialName = materialName.rawMaterialDetailsName;
        }
      });
    } catch (error) {

    }
  }

  selectIndent(indent: IndentDetail) {
    try {
      this.decideOrderQuantityDisplay();
    } catch (error) {

    }
  }

  onTabChange(e) {

    this.tabIndex = e.index;
    if (this.tabIndex === 1) {
      this.next();
    } else {
      if (this.findMode || this.modifyMode) {
        this.clear();
      }
    }
  }

  next() {
    try {

      const selectedList = this.indentDetailsList.filter(a => a.isSelected);
      if (selectedList && selectedList.length > 0) {
        this.noSelectIndent = '';
        let isInValid: boolean;
        selectedList.map(a => this.validateOrderQuantity(a));
        isInValid = !!selectedList.filter(a => !a.isOrderQuantityValid && a.isInputAllowed)[0];
        if (!isInValid) {
          // valid
          this.pushIndentDetailsToPurchageMaterial();
          if (this.orderMaterialDetailList && this.orderMaterialDetailList.length > 0) {
            this.tabIndex = 1;
            this.getNextPurchageOrderId();
            this.getAllSuppliers();
            this.orderMaterialDetailList.map(a => this.validateQuotedRate(a));

            this.orderMaterialDetailList.map(a => this.validatePORate(a));
            this.calculateAmount();
          }

        } else {
          this.orderMaterialDetailList = [];
        }
      } else {
        this.noSelectIndent = 'Please select atleast one Indent material.';
        // this.disableNextPanel = true;
        // setTimeout(() => {
        //   this.tabIndex = 0;
        // }, 200);

      }

    } catch (error) {

    }
  }

  //#endregion

  //#region  Purchage Order


  gstTypeChange(e) {
    try {
      const gstcType = this.purchageOrderForm.controls.igstSgst.value;
      if (gstcType) {
        this.getTaxForSelectedMaterial();

      }
    } catch (error) {

    }
  }

  getTaxPercentByGSTType(materialDetailCode: OrderMaterialDetail) {
    try {
      return new Observable<number>((sub) => {
        const gstType: string = this.purchageOrderForm.controls.igstSgst.value;
        if (!gstType) {
          sub.next(0);
          sub.complete();
          return;
        }
        this.purchageOrderService.getTaxPercentByGSTType(materialDetailCode.rowMaterialDetailsCode,
          gstType).subscribe((data: TaxPercentageRate) => {
            if (data) {
              materialDetailCode.rmPoMaterialIGSTRate = data.igstRate;
              materialDetailCode.rmPoMaterialCGSTRate = data.cgstRate;
              materialDetailCode.rmPoMaterialSGSTRate = data.sgstRate;
              if (gstType.toUpperCase() === 'IGST') {
                sub.next(+data.igstRate);
              } else if (gstType.toUpperCase() === 'SGST') {
                sub.next(+data.cgstRate + +data.sgstRate);
              } else {
                sub.next(0.00);
              }
            } else {
              sub.next(0.00);
            }
            sub.complete();
          }, err => {
            sub.error();
          });
      });
    } catch (error) {

    }
  }
  getAllSuppliers() {
    try {
      this.purchageOrderService.getAllSuppliers().subscribe((data: SupplierOrgModel[]) => {
        if (data) {
          this.supplierOrgList = data;
        }
      }, err => {
        this.alertSrvice.error('Error has occured while fetching Suppliers List.');
      });
    } catch (error) {

    }
  }

  changeSupplier(e) {
    try {
      const selectedSupp = this.purchageOrderForm.controls.nameOfSupplier.value;
      if (selectedSupp) {
        this.getPlacesBySuppOrgId(selectedSupp);
        this.getStatesBySuppOrgId(selectedSupp);
        this.getCountryBySppOrgId(selectedSupp);
      }

      if (this.findMode || this.modifyMode) {
        this.purchageOrderService.GetOrderIdsBySuppOrgId(selectedSupp).subscribe((data: number[]) => {
          if (data) {
            this.orderList = data;
          }
        });
      }
    } catch (error) {

    }
  }
  changeOrder(e) {
    try {
      const OrderId = this.purchageOrderForm.controls.orderNumber.value;
      if (OrderId) {
        this.purchageOrderService.GetPurchaseOrderByID(OrderId).subscribe((data: CreatePOWithMaterialAndCondition) => {
          this.modifyCreatePOWithMaterialAndCondition = data;
          this.purchageOrderForm.controls.domesticImport.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.domesticImport);
          this.purchageOrderForm.controls.orderDate.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.rmPoDate);
          this.purchageOrderForm.controls.currency.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.currency);
          this.purchageOrderForm.controls.igstSgst.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.gstType);
          this.purchageOrderForm.controls.throughQuotation.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.quotationType);
          this.purchageOrderForm.controls.packingCondition.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.packingCondition);
          this.purchageOrderForm.controls.packingStyle.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.packingStyle);
          this.purchageOrderForm.controls.packingQuantity.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poPackingQty);
          this.purchageOrderForm.controls.packingRate.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poPackingRate);
          this.purchageOrderForm.controls.packingAmount.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poTotalAmount);
          this.purchageOrderForm.controls.deliveryCondition.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.deliveryCondition);
          this.purchageOrderForm.controls.frieghtAmount.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.deliveryFrtAmt);
          this.purchageOrderForm.controls.insuranceCondtion.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.insuranceCondition);
          this.purchageOrderForm.controls.insuranceAmount.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.insuranceAmt);
          this.purchageOrderForm.controls.paymentTerms.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poAdvanceCond);
          this.purchageOrderForm.controls.advance.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.advDetails);
          this.purchageOrderForm.controls.creditDays.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poCreditDays);
          this.purchageOrderForm.controls.deliveryDate.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poDeliveryDate);
          this.purchageOrderForm.controls.deliveryDays.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poDeliveryDays);
          this.purchageOrderForm.controls.totalPOAmount.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poTotalAmount);
          this.purchageOrderForm.controls.poValidTill.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poValidityCondition);
          this.purchageOrderForm.controls.poValidDays.patchValue
            (this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poValidityDays);

          this.materialConditionList = this.modifyCreatePOWithMaterialAndCondition.rmPoMaterialConditions;
          this.orderMaterialDetailList = this.modifyCreatePOWithMaterialAndCondition.rmPoMaterialDetails;
          this.updatePurchageMaterialFromIndentDetails();
          // this.indentDetailsList = this.modifyCreatePOWithMaterialAndCondition.rMPOIndentDetails;
          this.orderMaterialDetailList.map(a => this.validateQuotedRate(a));
          this.orderMaterialDetailList.map(a => this.validatePORate(a));
          this.getTaxForSelectedMaterial();
        });
      }

      if (this.modifyMode) {
        this.purchageOrderForm.enable();
        this.materialConditionForm.enable();
      }


    } catch (error) {

    }
  }

  getPlacesBySuppOrgId(supplierOrgId: string) {
    try {
      this.purchageOrderService.getPlacesBySuppOrgId(supplierOrgId).subscribe((data: PlaceModel[]) => {
        if (data) {
          this.placeList = data;
          if (this.placeList.length > 0) {
            this.purchageOrderForm.controls.place.setValue(this.placeList[0].PlaceCode);
          }
        }
      });
    } catch (error) {

    }
  }

  getCountryBySppOrgId(supplierOrgId: string) {
    try {
      this.purchageOrderService.getCountryBySppOrgId(supplierOrgId).subscribe((data: CountryModel[]) => {
        if (data) {
          this.countryList = data;
          if (this.countryList.length > 0) {
            this.purchageOrderForm.controls.country.setValue(this.countryList[0].countryCode);
          }
        }
      });
    } catch (error) {

    }
  }

  getStatesBySuppOrgId(supplierOrgId: string) {
    try {
      this.purchageOrderService.getStatesBySuppOrgId(supplierOrgId).subscribe((data: StateModel[]) => {
        if (data) {
          this.stateList = data;
          if (this.stateList.length > 0) {
            this.purchageOrderForm.controls.state.setValue(this.stateList[0].stateCode);
          }
        }
      });
    } catch (error) {

    }
  }


  getNextPurchageOrderId() {
    try {
      this.purchageOrderService.getNextPurchageOrderId().subscribe((data: number) => {
        if (data) {
          this.nextOrderId = data;
          this.orderList.push(this.nextOrderId);
          this.purchageOrderForm.controls.orderNumber.setValue(this.nextOrderId);
        }
      });
    } catch (error) {

    }
  }


  getTaxForSelectedMaterial() {
    this.orderMaterialDetailList.forEach(a => {
      if (a && a.rowMaterialDetailsCode) {
        this.getTaxPercentByGSTType(a).subscribe(tax => {
          a.tax = tax.toFixed(2).toString();
          this.calculateTaxAmount(a);
        });
      }
    });
  }

  calculateAmount() {
    try {
      this.orderMaterialDetailList.forEach(a => {
        if (a && a.rmOrderQty && a.isPORateValid) {
          a.rmPoMaterialWiseCost = (+a.rmOrderQty * +a.rmPoRate).toFixed(2).toString();
        } else {
          a.rmPoMaterialWiseCost = '0.00';
        }
        this.calculateTaxAmount(a);
      });
    } catch (error) {

    }
  }

  calculateTaxAmount(material: OrderMaterialDetail) {
    try {
      if (material && !isNaN(+material.tax) && !isNaN(+material.rmPoMaterialWiseCost)) {
        material.taxAmount = ((+material.tax * +material.rmPoMaterialWiseCost) / 100).toFixed(2).toString();
        if (material.rmPoMaterialIGSTRate != null) {
          material.rmPoMaterialIGSTAmount = ((+material.rmPoMaterialIGSTRate * +material.rmPoMaterialWiseCost) / 100).toFixed(2).toString();
        }
        if (material.rmPoMaterialCGSTRate != null) {
          material.rmPoMaterialCGSTAmount = ((+material.rmPoMaterialCGSTRate * +material.rmPoMaterialWiseCost) / 100).toFixed(2).toString();
        }
        if (material.rmPoMaterialSGSTRate != null) {
          material.rmPoMaterialSGSTAmount = ((+material.rmPoMaterialSGSTRate * +material.rmPoMaterialWiseCost) / 100).toFixed(2).toString();
        }
        this.calculateTotalAmount(material);
      }
    } catch (error) {

    }
  }

  calculatePackingAMount() {
    let packingAmount = 0;
    packingAmount = +this.purchageOrderForm.controls.packingQuantity.value * +this.purchageOrderForm.controls.packingRate.value;
    this.purchageOrderForm.controls.packingAmount.setValue(packingAmount.toFixed(2));
  }

  calculateTotalAmount(material: OrderMaterialDetail) {
    try {
      material.rmPoMaterialWiseTotalCost = (+material.rmPoMaterialWiseCost + +material.taxAmount).toFixed(2).toString();
    } catch (error) {

    }
  }

  calculateTotalPOAmount() {
    try {
      let totalPOAmount = 0;
      this.orderMaterialDetailList.forEach(a => {
        totalPOAmount = totalPOAmount + +a.rmPoMaterialWiseTotalCost;
      });
      totalPOAmount = totalPOAmount + +this.purchageOrderForm.controls.frieghtAmount.value;
      totalPOAmount = totalPOAmount + +this.purchageOrderForm.controls.insuranceAmount.value;

      this.purchageOrderForm.controls.totalPOAmount.setValue(totalPOAmount.toFixed(2));
    } catch (error) {

    }
  }


  save() {
    try {
      const isInValid = !!this.orderMaterialDetailList.filter(a => !a.isPORateValid || !a.isQuotedRateValid)[0];
      if (!this.purchageOrderForm.valid || isInValid || (this.orderMaterialDetailList.length === 0 && !this.modifyMode)) {
        // invalid
        this.markFieldAsTouched(this.purchageOrderForm);
      } else {
        // valid
        if (this.modifyMode) {
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.rmPoDate
            = new Date(this.purchageOrderForm.controls.orderDate.value).toLocaleString();
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.rmPoNo
            = this.purchageOrderForm.controls.orderNumber.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.domesticImport
            = this.purchageOrderForm.controls.domesticImport.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.supplierOrgId
            = this.purchageOrderForm.controls.nameOfSupplier.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.placeCode
            = this.purchageOrderForm.controls.place.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.stateName
            = this.purchageOrderForm.controls.state.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.countryName
            = this.purchageOrderForm.controls.country.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.currency
            = this.purchageOrderForm.controls.currency.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.gstType
            = this.purchageOrderForm.controls.igstSgst.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.quotationType
            = this.purchageOrderForm.controls.throughQuotation.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.packingCondition
            = this.purchageOrderForm.controls.packingCondition.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.packingStyle
            = this.purchageOrderForm.controls.packingStyle.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poPackingQty
            = this.purchageOrderForm.controls.packingQuantity.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poPackingRate
            = this.purchageOrderForm.controls.packingRate.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poPackingAmt
            = this.purchageOrderForm.controls.packingAmount.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.deliveryCondition
            = this.purchageOrderForm.controls.deliveryCondition.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.deliveryFrtAmt
            = this.purchageOrderForm.controls.frieghtAmount.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.insuranceCondition
            = this.purchageOrderForm.controls.insuranceCondtion.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.insuranceAmt
            = this.purchageOrderForm.controls.insuranceAmount.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poAdvanceCond
            = this.purchageOrderForm.controls.paymentTerms.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.advDetails
            = this.purchageOrderForm.controls.advance.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poCreditDays
            = this.purchageOrderForm.controls.creditDays.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poDeliveryDate
            = new Date(this.purchageOrderForm.controls.deliveryDate.value).toLocaleString();
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poDeliveryDays
            = this.purchageOrderForm.controls.deliveryDays.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poTotalAmount
            = this.purchageOrderForm.controls.totalPOAmount.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poValidityCondition
            = this.purchageOrderForm.controls.poValidTill.value;
          this.modifyCreatePOWithMaterialAndCondition.purchageOrderDetail.poValidityDays
            = this.purchageOrderForm.controls.poValidDays.value == null ? 0 : this.purchageOrderForm.controls.poValidDays.value;


          this.modifyCreatePOWithMaterialAndCondition.rmPoMaterialConditions = this.materialConditionList;

          this.orderMaterialDetailList.forEach(orderMaterialDetail => {
            orderMaterialDetail.rmQuotationDate = new Date(orderMaterialDetail.rmQuotationDate).toLocaleString();
          });

          this.modifyCreatePOWithMaterialAndCondition.rmPoMaterialDetails = this.orderMaterialDetailList;

          this.purchageOrderService.ModifyPurchaseOrder(this.modifyCreatePOWithMaterialAndCondition).subscribe(x => {
            if (x) {
              this.alertSrvice.success('Purchase order updated successfully.');
              this.clear();
            }
          });
        } else {
          const purchageOrder = this.setPurchageOrder();
          const createPOWithMaterialAndCondition: CreatePOWithMaterialAndCondition = {
            indentMaterialNames: [],
            purchageOrderDetail: purchageOrder,
            rmPoMaterialDetails: this.orderMaterialDetailList,
            rmPoMaterialConditions: this.materialConditionList,
            rMPOIndentDetails: this.orderMaterialDetailNotSelectedList
          };

          this.purchageOrderService.createPurchageOrder(createPOWithMaterialAndCondition)
            .subscribe((data: CreatePOWithMaterialAndCondition[]) => {
              if (data) {
                this.alertSrvice.success('Purchage order created successfully.');
                this.clear();
              } else {
                this.alertSrvice.error('Error while creating purchage order.');
              }
            }, err => {
              this.alertSrvice.error('Error while creating purchage order.');
            });

        }
      }

    } catch (error) {

    }
  }

  blurRemarks() {
    try {
      const particluar = this.materialConditionForm.controls.particulars.value;
      const details = this.materialConditionForm.controls.details.value;
      const remarks = this.materialConditionForm.controls.remarks.value;
      if (particluar || details || remarks) {
        if (this.modifyMode) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: 'Do You Want to update material conditions?'
          });
          dialogRef.afterClosed().subscribe(result => {

            if (result) {
              this.particilarsField.nativeElement.focus();
              if (this.selectedMaterialCondition) {
                const index = this.materialConditionList.findIndex(x => x.Id === this.selectedMaterialCondition.Id);
                this.materialConditionList[index].poMc = particluar;
                this.materialConditionList[index].poMd = details;
                this.materialConditionList[index].poMr = remarks;
              }
            } else {
              this.materialConditionForm.disable();
              this.saveButton.nativeElement.focus();
              // this.materialConditionList.push(this.setMaterialCondition());
            }
            this.selectedMaterialCondition = new MaterialCondition();
            this.materialConditionForm.reset();
          });
        } else {

          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: 'Do You Want to add more material conditions?'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.particilarsField.nativeElement.focus();
              this.materialConditionList.push(this.setMaterialCondition());
            } else {
              this.saveButton.nativeElement.focus();
              this.materialConditionList.push(this.setMaterialCondition());
            }
            this.selectedMaterialCondition = new MaterialCondition();
            this.materialConditionForm.reset();
          });
        }
      }
    } catch (error) {

    }
  }

  inwardGridSelectedRowEvent(e) {
    if (e.data) {
      this.selectedMaterialCondition = e.data;
      this.materialConditionForm.enable();
      this.materialConditionForm.controls.particulars.setValue(e.data.poMc);
      this.materialConditionForm.controls.details.setValue(e.data.poMd);
      this.materialConditionForm.controls.remarks.setValue(e.data.poMr);
    }
  }

  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  setPurchageOrder() {
    try {
      const purchageOrder = new PurchaseOrderDetail();
      purchageOrder.rmPoDate = new Date(this.purchageOrderForm.controls.orderDate.value).toLocaleString();
      purchageOrder.rmPoNo = this.purchageOrderForm.controls.orderNumber.value;
      purchageOrder.domesticImport = this.purchageOrderForm.controls.domesticImport.value;
      purchageOrder.supplierOrgId = this.purchageOrderForm.controls.nameOfSupplier.value;
      purchageOrder.supplierName = this.supplierOrgList.filter(a => a.supplierOrgID === purchageOrder.supplierOrgId)[0].organisationName;
      purchageOrder.placeCode = this.purchageOrderForm.controls.place.value;
      purchageOrder.stateName = this.purchageOrderForm.controls.state.value;
      purchageOrder.countryName = this.purchageOrderForm.controls.country.value;
      purchageOrder.currency = this.purchageOrderForm.controls.currency.value;
      purchageOrder.gstType = this.purchageOrderForm.controls.igstSgst.value;
      purchageOrder.quotationType = this.purchageOrderForm.controls.throughQuotation.value;
      purchageOrder.packingCondition = this.purchageOrderForm.controls.packingCondition.value;
      purchageOrder.packingStyle = this.purchageOrderForm.controls.packingStyle.value;
      purchageOrder.poPackingQty = this.purchageOrderForm.controls.packingQuantity.value;
      purchageOrder.poPackingRate = this.purchageOrderForm.controls.packingRate.value;
      purchageOrder.poPackingAmt = this.purchageOrderForm.controls.packingAmount.value;
      purchageOrder.deliveryCondition = this.purchageOrderForm.controls.deliveryCondition.value;
      purchageOrder.deliveryFrtAmt = this.purchageOrderForm.controls.frieghtAmount.value;
      purchageOrder.insuranceCondition = this.purchageOrderForm.controls.insuranceCondtion.value;
      purchageOrder.insuranceAmt = this.purchageOrderForm.controls.insuranceAmount.value;
      purchageOrder.poAdvanceCond = this.purchageOrderForm.controls.paymentTerms.value;
      purchageOrder.advDetails = this.purchageOrderForm.controls.advance.value;
      purchageOrder.poCreditDays = this.purchageOrderForm.controls.creditDays.value;
      purchageOrder.poDeliveryDate = this.purchageOrderForm.controls.deliveryDate.value;
      purchageOrder.poDeliveryDays = this.purchageOrderForm.controls.deliveryDays.value;
      purchageOrder.poTotalAmount = this.purchageOrderForm.controls.totalPOAmount.value;
      purchageOrder.poValidityCondition = this.purchageOrderForm.controls.poValidTill.value;
      purchageOrder.poValidityDays = this.purchageOrderForm.controls.poValidDays.value;
      return purchageOrder;
    } catch (error) {

    }
  }

  setMaterialCondition() {
    const materilCondition: MaterialCondition = new MaterialCondition();
    materilCondition.poMc = this.materialConditionForm.controls.particulars.value;
    materilCondition.poMd = this.materialConditionForm.controls.details.value;
    materilCondition.poMr = this.materialConditionForm.controls.remarks.value;
    return materilCondition;
  }

  //#endregion

  find() {
    this.purchageOrderForm.reset();
    this.orderMaterialDetailList = [];
    this.purchageOrderForm.disable();
    this.materialConditionForm.disable();
    this.disableModify = false;
    this.disableFind = true;
    this.disableSave = true;
    this.findMode = true;
    this.purchageOrderForm.controls.nameOfSupplier.enable();
    this.purchageOrderForm.controls.orderNumber.enable();
    this.getAllSuppliers();
  }

  modify() {
    this.purchageOrderForm.reset();
    this.orderMaterialDetailList = [];
    this.purchageOrderForm.disable();
    this.materialConditionForm.disable();
    this.disableModify = true;
    this.disableFind = false;
    this.disableSave = false;
    this.modifyMode = true;
    this.findMode = false;
    this.purchageOrderForm.controls.nameOfSupplier.enable();
    this.purchageOrderForm.controls.orderNumber.enable();
    this.getAllSuppliers();
  }

  clear() {
    this.purchageOrderForm.disable();
    this.purchageOrderForm.reset();
    this.purchageOrderForm.controls.orderNumber.disable();
    this.purchageOrderForm.controls.totalPOAmount.disable();
    this.orderMaterialDetailList = [];
    this.materialConditionList = [];
    this.tabIndex = 0;
    this.getIndentDetails();
    this.disableModify = false;
    this.disableFind = false;
    this.disableSave = false;
    this.findMode = false;
    this.modifyMode = false;
  }

}
