import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ProductionScheduleDetailsService } from './production-schedule-details.service';
import { ProdScheduleForm, ProductionScheduleDetails, PSOScheduleDetails } from './production-schedule-details.model';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

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
  selector: 'app-production-schedule-details',
  templateUrl: './production-schedule-details.component.html',
  styleUrls: ['./production-schedule-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ProductionScheduleDetailsComponent implements OnInit {
  @ViewChild('gradeSize', { static: false }) gradeSize: any;
  @ViewChild('save', { static: false }) save: any;
  // @ViewChild('Employee', { static: false }) Employee: any;
  officeLocations: any[] = [];
  employeeDetails: any[] = [];
  productGroupDetails: any[] = [];
  productNameDetails: any[] = [];
  gradeSizeDetails: any[] = [];
  pSOScheduleDetailsCols: any[];
  pSOScheduleDetailsList: PSOScheduleDetails[] = [];
  productionScheduleForm: FormGroup;
  // orderScheduleSelected = 'Through Sales Order';
  // unitSelected = '';
  productionScheduleDetailsCols: any[];
  productionScheduleDetailsList: ProductionScheduleDetails[] = [];
  activeIndex = 0;
  disabledPSDTab = true;
  prodScheduleForm = new ProdScheduleForm();
  mediaProcessNameList: any[] = [];
  isStartedForm = true;
  loggedInUser: any;
  constructor(
    private productionScheduleDetailsService: ProductionScheduleDetailsService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private datepipe: DatePipe) { }

  ngOnInit() {
    this.pSOScheduleDetailsCols = [
      { field: '', header: 'Sl. No.', style: { width: '82px' } },
      { field: '', header: 'Order Date', style: { width: '120px' } },
      { field: '', header: 'Order No', style: { width: '120px' } },
      { field: '', header: 'Buyer Name', style: { width: '120px' } },
      { field: '', header: 'Country', style: { width: '120px' } },
      { field: '', header: 'Product Name', style: { width: '120px' } },
      { field: '', header: 'Grade', style: { width: '90px' } },
      { field: '', header: 'Preserve In', style: { width: '120px' } },
      { field: '', header: 'Packing / UOM', style: { width: '120px' } },
      { field: '', header: 'Quantity (Nos)', style: { width: '120px' } },
      { field: '', header: 'Schd. Qty (Nos)', style: { width: '120px' } },
      { field: '', header: 'Total Qty (KGS)', style: { width: '120px' } },
      { field: '', header: 'Deliver By', style: { width: '120px' } },
      { field: '', header: 'Select', style: { width: '60px' } },

    ];
    this.productionScheduleDetailsCols = [
      { field: '', header: 'Sl. No.', style: { width: '82px' } },
      { field: '', header: 'Select', style: { width: '60px', 'min-height': '36.5px' } },
      { field: '', header: 'Order Details', style: { width: '220px' } },
      { field: '', header: 'Product Name', style: { width: '120px' } },
      { field: '', header: 'Grade / Size', style: { width: '90px' } },
      { field: '', header: 'Qty / Pack UOM', style: { width: '120px' } },
      { field: '', header: 'Order Quantity (Nos)', style: { width: '140px' } },
      { field: '', header: 'Schd. Qty (Nos)', style: { width: '120px' } },
      { field: '', header: 'Preserved in (Media)', style: { width: '140px', 'min-height': '36.5px' } },
      { field: '', header: 'Media Description', style: { width: '300px', 'min-height': '36.5px', 'white-space': 'break-spaces' } },
    ];
    this.loggedInUser = this.authService.getUserdetails();
    this.createForm();
    this.getUnitDropdown();
    // this.getEmployeeDropdown();
    this.getProductGroupDropdown();
    this.getProductionScheduleNo();
    this.getMediaProcessNameList();
    this.productionScheduleForm.disable();
  }

  createForm = () => {
    try {

      this.productionScheduleForm = this.formBuilder.group({
        ...this.prodScheduleForm
      });
      this.setFormValidations();
      this.productionScheduleForm.controls.ProductionScheduleDate.setValue(new Date());
      this.productionScheduleForm.controls.PSRequireDateBy.setValue(new Date());
      this.productionScheduleForm.controls.EmployeeID.setValue(this.loggedInUser.employeeId);
      this.productionScheduleForm.controls.EmployeeName.setValue(this.loggedInUser.userName);
      // console.log(this.productionScheduleForm, this.productionScheduleForm.controls.PSThroughDetails);
    } catch (error) {
      this.alertService.error('Error while creating productionScheduleForm! - ' + error);
    }
  }

  setFormValidations() {
    this.productionScheduleForm.controls.PSThroughDetails.setValidators([Validators.required]);
    this.productionScheduleForm.controls.OrgofficeNo.setValidators([Validators.required]);
    this.productionScheduleForm.controls.ProductionScheduleDate.setValidators([Validators.required]);
    this.productionScheduleForm.controls.ProductionScheduleNo.setValidators([Validators.required]);

    this.productionScheduleForm.controls.EmployeeID.setValidators([Validators.required]);
    this.productionScheduleForm.controls.PSRequireDateBy.setValidators([Validators.required]);
    // this.productionScheduleForm.controls.PSDirectOrderScheduleNo.setValidators([Validators.required]);
    this.productionScheduleForm.controls.FPGroupCode.setValidators([Validators.required]);
    this.productionScheduleForm.controls.FPVarietyCode.setValidators([Validators.required]);
    this.productionScheduleForm.controls.FPGradeCode.setValidators([Validators.required]);
    this.productionScheduleForm.controls.PackUOM.setValidators([Validators.required]);
    this.productionScheduleForm.controls.QtyDrum.setValidators([Validators.required, Validators.pattern(/^[0-9]{1,6}(\.[0-9]{1,3})?$/)]);
    this.productionScheduleForm.controls.DrumWeight.setValidators([Validators.required, Validators.pattern(/^[0-9]{1,5}(\.[0-9]{1,3})?$/)]);
    this.productionScheduleForm.controls.PSQuantity.setValidators([Validators.required, Validators.pattern(/^[0-9]{1,6}$/)]);
    this.productionScheduleForm.controls.PSQtyUOM.setValidators([Validators.required, Validators.pattern(/^[0-9]{1,12}$/)]);
    this.productionScheduleForm.controls.MediaProcessCode.setValidators([Validators.required]);
    this.productionScheduleForm.controls.MediaProcessDescRemarks.setValidators([Validators.required, Validators.maxLength(500)]);
  }

  getUnitDropdown() {
    this.productionScheduleDetailsService.getOfficeLocations().subscribe((res: any) => {
      this.officeLocations = res;
    },
      error => {
        this.alertService.error('Error while getting Unit details! - ' + error);
      });
  }

  getEmployeeDropdown() {
    this.productionScheduleDetailsService.getScheduledByDetails().subscribe((res: any) => {
      this.employeeDetails = res;
    },
      error => {
        this.alertService.error('Error while getting Employee details! - ' + error);
      });
  }

  getProductGroupDropdown() {
    this.productionScheduleDetailsService.getProductGroupDetails().subscribe((res: any) => {
      this.productGroupDetails = res;
    },
      error => {
        this.alertService.error('Error while getting product group details! - ' + error);
      });
  }

  getProductNameDropdown(groupCode) {
    this.productionScheduleDetailsService.getProductNameDetailsByGroupCode(groupCode).subscribe((res: any) => {
      this.productNameDetails = res;
    },
      error => {
        this.alertService.error('Error while getting product Name details! - ' + error);
      });
  }

  getGradeSizeDropdown(varietyCode) {
    this.productionScheduleDetailsService.getAllGradeDetailsByVariety(varietyCode).subscribe((res: any) => {
      this.gradeSizeDetails = res;
    },
      error => {
        this.alertService.error('Error while getting grade size details! - ' + error);
      });
  }

  productGroupChange(event) {
    // console.log(event.value);
    if (event.value && event.value !== '') {
      this.getProductNameDropdown(event.value);
    }
  }

  productNameChange(event) {
    if (event.value && event.value !== '') {
      this.getGradeSizeDropdown(event.value);
    }
  }

  orderScheduleChange() {
    // console.log(this.productionScheduleForm.controls.PSThroughDetails.value, this.productionScheduleForm.controls.OrgofficeNo.value);
    this.productionScheduleForm.controls.ProductionSchedulefor.setValue(this.productionScheduleForm.controls.PSThroughDetails.value);
    this.productionScheduleForm.enable();
    this.productionScheduleForm.controls.ProductionScheduleNo.disable();
    this.productionScheduleForm.controls.ProductionScheduleDate.setValue(new Date());
    this.productionScheduleForm.controls.PSRequireDateBy.setValue(new Date());
    if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Through Sales Order') {
      this.getProductionDetails();
      this.productionScheduleForm.disable();
      this.productionScheduleForm.controls.PSThroughDetails.enable();
      this.productionScheduleForm.controls.OrgofficeNo.enable();
    } else {
      this.pSOScheduleDetailsList = [];
      this.productionScheduleDetailsList = [];

    }
  }

  getProductionDetails() {
    this.productionScheduleDetailsService.getProductionDetails().subscribe((res: any) => {
      this.pSOScheduleDetailsList = res;
      this.pSOScheduleDetailsList.forEach(item => {
        item.SchdQty = item.qtyDrum;
        item.TotalQty = item.SchdQty * item.qtyDrum;
      });
    },
      error => {
        this.alertService.error('Error while getting production details! - ' + error);
      });


  }

  validateSchdQty(item) {
    // console.log(item);
    item.IsSchdQtyValid = false;
    // this.alertService.clear();
    if (!/^[0-9]{1,6}$/.test(item.SchdQty)) {
      this.alertService.error('Schedule quantity should be numberic value with max lenght 6');
      item.IsSchdQtyValid = true;
    } else {
      item.TotalQty = item.SchdQty * item.qtyDrum;
    }
  }

  getProductionScheduleNo() {
    this.productionScheduleDetailsService.getProductionScheduleId().subscribe((res: any) => {
      this.productionScheduleForm.controls.ProductionScheduleNo.setValue(res);
    },
      error => {
        this.alertService.error('Error while getting Production Schedule No! - ' + error);
      });
  }

  OrgOfficeChange(event) {
    this.productionScheduleForm.controls.OrgofficeName.setValue(event.source.selected.viewValue);
  }

  calculateProductQuantity() {
    const QtyDrum = this.productionScheduleForm.controls.QtyDrum.value ?
      Number(this.productionScheduleForm.controls.QtyDrum.value) : 0;
    const psQuantity = this.productionScheduleForm.controls.PSQuantity.value ?
      Number(this.productionScheduleForm.controls.PSQuantity.value) : 0;
    this.productionScheduleForm.controls.PSQtyUOM.setValue(Math.round(QtyDrum * psQuantity));
  }

  nextBtnEnable() {
    // this.productionScheduleForm.controls.PSThroughDetails.markAllAsTouched();
    // this.productionScheduleForm.controls.OrgofficeNo.markAllAsTouched();
    const selectAtleastOneOption = this.pSOScheduleDetailsList.filter(f => f.IsSelected).length > 0;
    const shouldNotEmptySchdQty = this.pSOScheduleDetailsList.filter(f => f.IsSelected && f.IsSchdQtyValid).length === 0;
    let isValid = this.productionScheduleForm.controls.PSThroughDetails.valid
      && this.productionScheduleForm.controls.OrgofficeNo.valid;
    if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Through Sales Order') {
      isValid = isValid && selectAtleastOneOption && shouldNotEmptySchdQty;
    }
    return !isValid;
  }

  private markFormGroupTouched() {
    Object.keys(this.productionScheduleForm.controls).forEach(key => {
      this.productionScheduleForm.controls[key].markAsTouched();
    });
  }

  openPopup() {

    this.markFormGroupTouched();
    if (!this.productionScheduleForm.valid) {
      return false;
    }
    if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Direct Production') {
      const selectedGrate = this.gradeSizeDetails.filter(n =>
        n.gradeCode === this.productionScheduleForm.controls.FPGradeCode.value)[0];
      this.productionScheduleDetailsList.push({
        profInvDate: this.productionScheduleForm.controls.ProductionScheduleDate.value,
        profInvNo: this.productionScheduleForm.controls.ProductionScheduleNo.value,
        consigneeCbCode: null,
        consigneeCbName: 'Direct Schedule',
        fPGroupCode: this.productionScheduleForm.controls.FPGroupCode.value,
        fPVarietyCode: this.productionScheduleForm.controls.FPVarietyCode.value,
        fPVarietyName: this.productNameDetails.filter(n =>
          n.varietyCode === this.productionScheduleForm.controls.FPVarietyCode.value)[0].varietyName,
        fPGradeCode: this.productionScheduleForm.controls.FPGradeCode.value,
        fPGrade: selectedGrate ? selectedGrate.gradeFrom + ' - ' + selectedGrate.gradeTo : '',
        packUOM: this.productionScheduleForm.controls.PackUOM.value,
        qtyDrum: this.productionScheduleForm.controls.QtyDrum.value,
        PSQuantity: this.productionScheduleForm.controls.PSQuantity.value,
        SchdQty: this.productionScheduleForm.controls.PSQuantity.value,
        DrumWeight: this.productionScheduleForm.controls.DrumWeight.value,
        MediaProcessCode: this.productionScheduleForm.controls.MediaProcessCode.value,
        MediaProcessDescRemarks: this.productionScheduleForm.controls.MediaProcessDescRemarks.value,
        deliverBy: "",
        PSQtyUOM: this.productionScheduleForm.controls.PSQtyUOM.value
      });
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you want to add more order details?'
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log(this.productionScheduleForm, this.gradeSizeDetails);
        if (result) {
          this.gradeSize._elementRef.nativeElement.focus();
        } else {
          this.save.nativeElement.focus();
        }
      });
    } else {
      this.productionScheduleDetailsList.filter(f => f.IsSelected)[0].MediaProcessCode =
        this.productionScheduleForm.controls.MediaProcessCode.value;
      this.productionScheduleDetailsList.filter(f => f.IsSelected)[0].MediaProcessDescRemarks =
        this.productionScheduleForm.controls.MediaProcessDescRemarks.value;
      this.productionScheduleForm.controls.MediaProcessCode.setValue('');
      this.productionScheduleForm.controls.MediaProcessDescRemarks.setValue('');
      this.productionScheduleForm.controls.MediaProcessCode.disable();
      this.productionScheduleForm.controls.MediaProcessDescRemarks.disable();
    }
  }

  nextBtnClick() {
    this.activeIndex = 1;
    this.disabledPSDTab = false;
    // console.log(this.productionScheduleForm.controls.PSThroughDetails.value);
    if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Through Sales Order') {
      this.productionScheduleDetailsList = [];
      this.pSOScheduleDetailsList.filter(f => f.IsSelected).forEach(item => {
        this.productionScheduleDetailsList.push({
          profInvDate: item.profInvDate,
          profInvNo: item.profInvNo,
          consigneeCbCode: item.consigneeCbCode,
          consigneeCbName: item.consigneeCbName,
          fPGroupCode: item.fPGroupCode,
          fPVarietyCode: item.fPVarietyCode,
          fPVarietyName: item.fPVarietyName,
          fPGradeCode: item.fPGradeCode,
          fPGrade: item.fPGrade,
          packUOM: item.packUOM,
          qtyDrum: item.qtyDrum,
          SchdQty: item.SchdQty,
          MediaProcessCode: '',
          MediaProcessDescRemarks: '',
          deliverBy: this.datepipe.transform(item.deliverBy, 'yyyy-MM-dd'),
          PSQtyUOM: 0
        });
      });
    } else {
      // console.log(this.Employee._elementRef);
      // this.Employee._elementRef.nativeElement.focus();
    }
  }

  productionScheduleSelect(event, item: ProductionScheduleDetails) {
    this.productionScheduleDetailsList.map(m => m.IsSelected = false);
    item.IsSelected = true;
    this.productionScheduleForm.controls.FPGradeCode.setValue(item.fPGradeCode);
    this.productionScheduleForm.controls.PackUOM.setValue(item.packUOM);
    this.productionScheduleForm.controls.QtyDrum.setValue(item.qtyDrum);
    // this.productionScheduleForm.controls.SchdQty.setValue(item.SchdQty);
    this.productionScheduleForm.controls.MediaProcessCode.setValue(item.MediaProcessCode);
    this.productionScheduleForm.controls.MediaProcessDescRemarks.setValue(item.MediaProcessDescRemarks);
    if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Direct Production') {
      this.productionScheduleForm.controls.PSQuantity.setValue(item.qtyDrum);
    } else {
      this.productionScheduleForm.controls.ProductionScheduleDate.enable();
      this.productionScheduleForm.controls.PSRequireDateBy.enable();
      this.productionScheduleForm.controls.EmployeeID.enable();
      this.productionScheduleForm.controls.MediaProcessCode.enable();
      this.productionScheduleForm.controls.MediaProcessDescRemarks.enable();

    }
  }

  handleTabViewChange(event) {
    // console.log(event);
    this.activeIndex = event.index;
    this.disabledPSDTab = true;
  }

  saveBtnEnable() {
    return this.productionScheduleDetailsList.length === 0
      || this.productionScheduleDetailsList.filter(f => !f.MediaProcessCode || !f.MediaProcessDescRemarks
        || f.MediaProcessCode === '' || f.MediaProcessDescRemarks === '').length > 0;
  }

  clearAllContent() {
    Object.keys(this.productionScheduleForm.controls).forEach(key => {
      this.productionScheduleForm.controls[key].setValue('');
    });

    this.productionScheduleForm.controls.ProductionScheduleDate.setValue(new Date());
    this.productionScheduleForm.controls.PSRequireDateBy.setValue(new Date());
    this.productionScheduleForm.reset();
    this.productionScheduleDetailsList = [];
    this.pSOScheduleDetailsList = [];
    // this.alertService.clear();
    this.activeIndex = 0;
    this.disabledPSDTab = true;
    this.getProductionScheduleNo();
    this.productionScheduleForm.controls.EmployeeID.setValue(this.loggedInUser.employeeId);
    this.productionScheduleForm.controls.EmployeeName.setValue(this.loggedInUser.userName);
  }

  saveProductionScheduleDetails() {
    if (this.saveBtnEnable()) {
      this.alertService.warning('Please fill all the values in Production Schedule Details grid!');
      return;
    }
    const payload = {
      productionScheduleNo: this.productionScheduleForm.controls.ProductionScheduleNo.value,
      productionScheduleDate: this.productionScheduleForm.controls.ProductionScheduleDate.value,
      employeeID: this.productionScheduleForm.controls.EmployeeID.value,
      psThroughDetails: this.productionScheduleForm.controls.PSThroughDetails.value,
      psRequireDateBy: this.productionScheduleForm.controls.PSRequireDateBy.value,
      orgOfficeNo: this.productionScheduleForm.controls.OrgofficeNo.value,
      SalesProductionSchedule: [],
      DirectProductionSchedule: []
    };
    if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Through Sales Order') {
      const throughSalesOrder = [];
      this.productionScheduleDetailsList.forEach(item => {
        throughSalesOrder.push({
          productionScheduleNo: this.productionScheduleForm.controls.ProductionScheduleNo.value,
          profInvNo: item.profInvNo,
          fPGroupCode: item.fPGroupCode,
          fPVarietyCode: item.fPVarietyCode,
          fPGradeCode: item.fPGradeCode,
          packUOM: item.packUOM,
          qtyDrum: item.qtyDrum,
          orderQuantity: item.SchdQty,
          psQuantity: item.SchdQty,
          psProductQuantity: Math.round(item.SchdQty * item.qtyDrum),
          MediaProcessCode: item.MediaProcessCode,
          MediaProcessDescRemarks: item.MediaProcessDescRemarks,
          deliverBy: item.deliverBy
        });
      });
      payload.SalesProductionSchedule = throughSalesOrder;
    } else if (this.productionScheduleForm.controls.PSThroughDetails.value === 'Direct Production') {
      const directproduction = [];
      this.productionScheduleDetailsList.forEach(item => {
        directproduction.push({
          productionScheduleNo: this.productionScheduleForm.controls.ProductionScheduleNo.value,
          fPGroupCode: item.fPGroupCode,
          fPVarietyCode: item.fPVarietyCode,
          fPGradeCode: item.fPGradeCode,
          packUOM: item.packUOM,
          qtyDrum: item.qtyDrum,
          drumWeight: item.DrumWeight,
          psQuantity: item.PSQuantity,
          psQtyUOM: Math.round(item.qtyDrum * item.PSQuantity),
          MediaProcessCode: item.MediaProcessCode,
          MediaProcessDescRemarks: item.MediaProcessDescRemarks
        });
      });
      payload.DirectProductionSchedule = directproduction;
    }
    this.productionScheduleDetailsService.addProductionScheduleDetails(payload).subscribe(res => {

      this.alertService.success('Order Scheduled Successfully');
      this.clearAllContent();
    },
      error => {
        this.alertService.error('Error while saving production schedule details! - ' + error);
      });
  }

  getMediaProcessNameList() {
    this.productionScheduleDetailsService.getMediaProcessNameList().subscribe((res: any) => {
      this.mediaProcessNameList = res;
    },
      error => {
        this.alertService.error('Error while getting media process name list! - ' + error);
      });
  }
  startProdSchedule() {
    this.productionScheduleForm.controls.PSThroughDetails.enable();
    this.productionScheduleForm.controls.OrgofficeNo.enable();
    this.isStartedForm = false;
    this.productionScheduleForm.controls.PSThroughDetails.setValue('Through Sales Order');
    this.orderScheduleChange();
  }
}
