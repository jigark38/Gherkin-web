import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductionProcessBomDetailsService } from './production-process-bom-details.service';
import {
  ProductGroup, VarietyGroup, ProdProcessDetails,
  ProdProcessCombine, ProdProcessMaterialDetail,
  RawMaterialGroup, RawMaterialDetailsGroup, BomCols
} from './production-process-details';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-production-process-bom-details',
  templateUrl: './production-process-bom-details.component.html',
  styleUrls: ['./production-process-bom-details.component.css']
})
export class ProductionProcessBomDetailsComponent implements OnInit {
  processForm: FormGroup;
  bomForm: FormGroup;
  @ViewChild('dateOfCreation', { static: false }) dateOfCreation: ElementRef;
  @ViewChild('mySelect', { static: false }) productGroup: ElementRef;
  @ViewChild('processDescription', { static: false }) processDescription: ElementRef;
  @ViewChild('myMaterialSelect', { static: false }) materialGroup: ElementRef;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;
  disableNewButton: boolean;
  disableBOMButton: boolean;
  disableSaveButton: boolean;
  disableClearButton: boolean;
  bomCols: BomCols[];
  productGroups: ProductGroup[];
  varietyGroups: VarietyGroup[];
  isBOMPressed: boolean;
  selectedProductGroupCode: string;
  prodProcessDetails: ProdProcessDetails[];
  prodProcessMaterialDetails: ProdProcessMaterialDetail[];
  selectedProcessDescription: string;
  prodProcessCombine: ProdProcessCombine;
  selectProductionProcessCode: string;
  prodProcessMaterialDetail: ProdProcessMaterialDetail[];
  rawMaterialGroups: RawMaterialGroup[];
  rawMaterialDetailsGroups: RawMaterialDetailsGroup[];
  productionUOMLists: any[];
  bomUOMLists: any[];
  bomUOMOptionsList: string[];
  productionUOMOptionsList: string[];
  constructor(public dialog: MatDialog,
              private productionProcessBomDetailsService: ProductionProcessBomDetailsService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();
    this.disableControls();
    this.disableNewButton = false;
    this.disableSaveButton = true;
    this.disableBOMButton = false;
    this.disableClearButton = false;
    this.bomCols = [];
  }
  onNewProcess() {
    this.enableProcessControls();
    this.processForm.controls.dateofCreation.setValue(new Date());
    this.dateOfCreation.nativeElement.focus();
  }
  createForm() {
    try {
      this.processForm = new FormGroup({
        dateofCreation: new FormControl('', [Validators.required]),
        employeeID: new FormControl('', [Validators.required]),
        fpGroupCode: new FormControl('', [Validators.required]),
        fpVarietyCode: new FormControl('', [Validators.required]),
        productionProcessName: new FormControl('', [Validators.required]),
        productionProcessDescription: new FormControl('', [Validators.required])
      });
      this.bomForm = new FormGroup({
        processForm: this.processForm,
        mediaProcessName: new FormControl('', [Validators.required]),
        mediaProcessDescription: new FormControl('', [Validators.required]),
        effectiveDate: new FormControl('', [Validators.required]),
        standardProductionQty: new FormControl('', [Validators.required]),
        standardProductionUOM: new FormControl('', [Validators.required]),
        rawMaterialGroupCode: new FormControl('', [Validators.required]),
        rawMaterialDetailsCode: new FormControl('', [Validators.required]),
        standardQuantity: new FormControl('', [Validators.required]),
        standardBOMUOM: new FormControl('', [Validators.required])
      });
    } catch (error) {
      console.error('error while createForm', error);
    }
  }

  enableProcessControls() {
    try {
      this.processForm.enable();
    } catch (error) {
    }
  }
  enableBOMControls() {
    try {
      this.bomForm.enable();
    } catch (error) {
    }
  }
  disableControls() {
    try {
      this.processForm.get('employeeID').disable();
      this.processForm.get('fpGroupCode').disable();
      this.processForm.get('fpVarietyCode').disable();
      this.processForm.get('productionProcessName').disable();
      this.processForm.get('productionProcessDescription').disable();
      this.bomForm.get('mediaProcessDescription').disable();
      this.bomForm.get('mediaProcessName').disable();
      this.bomForm.get('effectiveDate').disable();
      this.bomForm.get('standardProductionQty').disable();
      this.bomForm.get('standardProductionUOM').disable();
      this.bomForm.get('rawMaterialGroupCode').disable();
      this.bomForm.get('rawMaterialDetailsCode').disable();
      this.bomForm.get('standardQuantity').disable();
      this.bomForm.get('standardBOMUOM').disable();
    } catch (error) {
    }
  }
  onKey($event) {
    if ($event && this.processForm.valid) {
      this.disableNewButton = true;
      this.disableSaveButton = false;
      this.disableClearButton = false;
      this.disableBOMButton = true;
      this.saveFocus.nativeElement.focus();
    }
  }
  onKeyTab($event) {
    this.getAllProductGroups();
  }
  getAllProductGroups() {
    try {
      this.productionProcessBomDetailsService.getAllProdGroups().subscribe((res: ProductGroup[]) => {
        if (res && res.length > 0) {
          this.productGroups = res;
        }
      });
    } catch (ex) { }
  }
  onProductGroupOptionsSelected(value: string) {
    this.processForm.controls.fpVarietyCode.reset();
    this.processForm.controls.productionProcessName.reset();
    this.processForm.controls.productionProcessDescription.reset();
    this.varietyGroups = null;
    if (this.isBOMPressed) {
      this.getSavedProductNames(value);
    } else {
      this.getProductNames(value);
    }
  }
  getProductNames(value: string) {
    this.varietyGroups = [];
    this.productionProcessBomDetailsService.getVariety(value).subscribe((res: VarietyGroup[]) => {
      if (res && res.length) {
        this.varietyGroups = res;
      }
    });
  }
  saveProdProcessDetails() {
    try {
      if (this.processForm.invalid) {
        this.markFieldAsTouched(this.processForm);
        return;
      }
      const formData = this.processForm.value;
      console.log('Process Form Details:', this.processForm.value);
      formData.productionProcessCode = 'string';
      formData.employeeID = null;
      this.productionProcessBomDetailsService.SaveProductionProcess(formData)
        .subscribe((res: any) => {
          if (res && res.status === 'Successfully Inserted') {
            this.alertService.success('Process Details Saved Successfully');
            this.onClear();
          } else {
            this.alertService.error('Please Change Production Process and Process Description');
          }
        }, error => {
          this.alertService.error('Process Details Saved failed');
          console.error('Process details save error', error);
        });
    } catch (ex) {
      console.log('Error on saving Process Details:', ex);
    }
  }
  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  onBOM() {
    this.set();
    this.enableControls();
    this.productGroup.nativeElement.focus();
    this.getAllSavedProductGroup();
    this.getRawMaterialGroup();
    this.isBOMPressed = true;
  }
  getAllSavedProductGroup() {
    try {
      const formData = this.bomForm.value;
      this.productionProcessBomDetailsService.getAllSavedProductGroup().subscribe((res: ProductGroup[]) => {
        if (res && res.length) {
          this.productGroups = res;
        }
      });
    } catch (ex) { }
  }

  getSavedProductNames(productCode: string) {
    try {
      this.varietyGroups = [];
      this.selectedProductGroupCode = productCode;
      this.productionProcessBomDetailsService.getSavedVariety(productCode).subscribe((res: VarietyGroup[]) => {
        if (res && res.length > 0) {
          this.varietyGroups = res;
        }
      });
    } catch (ex) { }
  }

  fetchProdProcess(grpVarCode: { fpGroupCode: string, fpVarietyCode: string }) {
    try {
      this.prodProcessDetails = [];
      this.productionProcessBomDetailsService.fetchProdProcess(grpVarCode).subscribe((res: ProdProcessDetails[]) => {
        if (res && res.length) {
          this.prodProcessDetails = res;
        }
      });
    } catch (ex) { }
  }
  onProductNameOptionsSelected(productNameSelect: string) {
    try {
      this.prodProcessDetails = null;
      this.processForm.controls.productionProcessName.reset();
      this.processForm.controls.productionProcessDescription.reset();
      if (this.isBOMPressed) {
        const grpVarCode = { fpGroupCode: this.selectedProductGroupCode, fpVarietyCode: productNameSelect };
        this.fetchProdProcess(grpVarCode);
      }
    } catch (ex) { }
  }
  onProcessOptionsSelected(processSelectValue: string) {
    try {
      this.processForm.controls.productionProcessDescription.setValue(
        this.prodProcessDetails.filter(e => e.productionProcessName === processSelectValue)[0].productionProcessDescription);
      this.selectProductionProcessCode = this.prodProcessDetails.filter
        (e => e.productionProcessName === processSelectValue)[0].productionProcessCode;
      this.processDescription.nativeElement.focus();
    } catch (ex) { }
  }

  openDialog() {
    try {
      if (this.bomForm.valid) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more materials?'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.setBOMCols();
            this.bomForm.controls.rawMaterialGroupCode.reset();
            this.materialGroup.nativeElement.focus();
            this.bomForm.controls.rawMaterialDetailsCode.reset();
            this.bomForm.controls.standardQuantity.reset();
            this.bomForm.controls.standardBOMUOM.reset();
          } else {
            this.setBOMCols();
            this.prodProcessMaterialDetails = [];
            this.saveProductionProcessBOM();
          }
        });
      }
    } catch (ex) { }
  }
  getRawMaterialGroup() {
    try {
      const formData = this.bomForm.value;
      this.productionProcessBomDetailsService.getRawMaterialGroup().subscribe((res: RawMaterialGroup[]) => {
        if (res && res.length) {
          this.rawMaterialGroups = res;
        }
      });
    } catch (ex) { }
  }
  getRawMaterialDetailsGroup(rawMaterialGrpCode: string) {
    try {
      this.rawMaterialDetailsGroups = [];
      this.productionProcessBomDetailsService.getRawMaterialDetailsGroup(rawMaterialGrpCode).subscribe((res: RawMaterialDetailsGroup[]) => {
        if (res && res.length) {
          this.rawMaterialDetailsGroups = res;
        }
      });
    } catch (ex) { }
  }
  onRawMaterialSelected(value: string) {
    this.rawMaterialDetailsGroups = null;
    this.bomForm.controls.rawMaterialDetailsCode.reset();
    if (value !== '') {
      this.getRawMaterialDetailsGroup(value);
    }
  }
  saveProductionProcessBOM() {
    try {
      this.processForm.controls.dateofCreation.setValue(new Date());
      this.processForm.controls.employeeID.setValue('test');
      if (this.bomForm.invalid) {
        this.markFieldAsTouched(this.bomForm);
        return;
      }
      const formData = this.bomForm.value;
      console.log('BOM Form Details:', this.bomForm.value);
      this.prodProcessCombine = new ProdProcessCombine();
      this.prodProcessCombine.status = '';
      this.prodProcessCombine.MediaProcessDetails.mediaProcessCode = 'string';
      this.prodProcessCombine.MediaProcessDetails.productionProcessCode = this.selectProductionProcessCode;
      this.prodProcessCombine.MediaProcessDetails.mediaProcessName = formData.mediaProcessName;
      this.prodProcessCombine.MediaProcessDetails.mediaProcessDescription = formData.mediaProcessDescription;
      this.prodProcessCombine.ProdStandardBOM.bomCode = 'string';
      this.prodProcessCombine.ProdStandardBOM.effectiveDate = formData.effectiveDate;
      this.prodProcessCombine.ProdStandardBOM.mediaProcessCode = 'string';
      this.prodProcessCombine.ProdStandardBOM.productionProcessCode = this.selectProductionProcessCode;
      this.prodProcessCombine.ProdStandardBOM.standardProductionQty = formData.standardProductionQty;
      this.prodProcessCombine.ProdStandardBOM.standardUOM = formData.standardProductionUOM;
      this.bomCols.forEach(bomCol => {
        const prodProcessMaterialDetail = new ProdProcessMaterialDetail();
        prodProcessMaterialDetail.id = 0;
        prodProcessMaterialDetail.bomCode = 'string';
        prodProcessMaterialDetail.rawMaterialGroupCode = formData.rawMaterialGroupCode;
        prodProcessMaterialDetail.rawMaterialDetailsCode = formData.rawMaterialDetailsCode;
        prodProcessMaterialDetail.standardQunatity = bomCol.standardQunatity;
        prodProcessMaterialDetail.standardUOM = bomCol.standardBOMUOM;
        this.prodProcessMaterialDetails.push(prodProcessMaterialDetail);
      });
      this.prodProcessCombine.ProdProcessMaterialDetails = this.prodProcessMaterialDetails;
      this.prodProcessCombine.status = 'string';
      this.productionProcessBomDetailsService.saveProductionProcessBOM(this.prodProcessCombine).subscribe((res: ProdProcessCombine) => {
        if (res && res.status === 'Successfully Inserted') {
          this.alertService.success('BOM Details Created Successfully');
          this.onClear();
          this.bomUOMLists = null;
        } else {
          this.alertService.error('Please Change Media Process and Media Description');
        }
      }, error => {
        this.alertService.error('BOM Details Created failed');
        console.error('BOM details Created error', error);
      });
    } catch (ex) { }
  }

  onSave() {
    this.saveProdProcessDetails();
    this.processForm.reset();
  }
  productionUOMValueChange(event) {
  }
  bomUOMValueChange(event) {
  }
  setBOMCols() {
    const formData = this.bomForm.value;
    const bomCol = new BomCols();
    bomCol.id = this.bomCols.length + 1;
    bomCol.mediaProcessName = formData.mediaProcessName;
    bomCol.productionProcessName = formData.processForm.productionProcessName;
    bomCol.standardProductionQty = formData.standardProductionQty;
    bomCol.standardQunatity = formData.standardQuantity;
    bomCol.standardProductionUOM = formData.standardProductionUOM;
    bomCol.standardBOMUOM = formData.standardBOMUOM;
    bomCol.rawMaterialName = this.rawMaterialDetailsGroups.filter
      (e => e.rawMaterialDetailsCode === formData.rawMaterialDetailsCode)[0].rawMaterialDetailsName;
    this.bomCols.push(bomCol);
  }
  getProductionUOM(uomKey: string) {
    this.productionUOMLists = [];
    this.productionProcessBomDetailsService.getProductionUOM(uomKey)
      .subscribe(res => {
        if (res && res.length > 0) {
          this.productionUOMLists.push(res);
        }
      });
  }
  getBOMUOM(uomKey: string) {
    this.bomUOMLists = [];
    this.productionProcessBomDetailsService.getBOMUOM(uomKey)
      .subscribe(res => {
        if (res && res.length > 0) {
          this.bomUOMLists.push(res);
        }
      });
  }
  onTabKey() {
    this.bomForm.controls.effectiveDate.setValue(new Date());
  }
  enableControls() {
    this.bomForm.disable();
    this.bomForm.controls.processForm.get('fpGroupCode').enable();
    this.bomForm.controls.processForm.get('fpVarietyCode').enable();
    this.bomForm.controls.processForm.get('productionProcessName').enable();
    this.bomForm.controls.processForm.get('productionProcessDescription').enable();
    this.bomForm.get('mediaProcessDescription').enable();
    this.bomForm.get('mediaProcessName').enable();
    this.bomForm.get('effectiveDate').enable();
    this.bomForm.get('standardProductionQty').enable();
    this.bomForm.get('standardProductionUOM').enable();
    this.bomForm.get('rawMaterialGroupCode').enable();
    this.bomForm.get('rawMaterialDetailsCode').enable();
    this.bomForm.get('standardQuantity').enable();
    this.bomForm.get('standardBOMUOM').enable();
  }
  clearForm() {
    this.onClear();
    this.bomCols = [];
  }
  onClear() {
    this.bomForm.reset();
    this.disableControls();
    this.isBOMPressed = false;
    this.productGroups = [];
    this.disableNewButton = false;
    this.disableSaveButton = true;
    this.disableBOMButton = false;
    this.disableClearButton = false;
    this.varietyGroups = [];
    this.selectedProductGroupCode = null;
    this.prodProcessDetails = [];
    this.prodProcessMaterialDetails = [];
    this.selectedProcessDescription = null;
    this.prodProcessCombine = new ProdProcessCombine();
    this.selectProductionProcessCode = null;
    this.prodProcessMaterialDetail = [];
    this.rawMaterialGroups = [];
    this.rawMaterialDetailsGroups = [];
    this.productionUOMLists = [];
    this.bomUOMLists = [];
  }

  set() {
    for (let i = 65; i <= 90; i++) {
      this.getBOMUOM(String.fromCharCode(i));
      this.getProductionUOM(String.fromCharCode(i));
    }
  }

  onKeyPress($event) {
    const formData = this.bomForm.value;
    if ($event.keyCode === 69 || $event.keyCode === 107 || $event.keyCode === 109) {
      if (!formData.standardProductionQty) {
        this.bomForm.controls.standardProductionQty.setValue('');
        this.alertService.error('Please Press 0 to 9 digits Only');
      }
    }
  }
  onKeyBOMPress($event) {
    const formData = this.bomForm.value;
    if ($event.keyCode === 69 || $event.keyCode === 107 || $event.keyCode === 109) {
      if (!formData.standardQuantity) {
        this.bomForm.controls.standardQuantity.setValue('');
        this.alertService.error('Please Press 0 to 9 digits Only');
      }
    }
  }
  setProductionUOMList() {
    this.productionUOMOptionsList = [].concat.apply([], this.productionUOMLists);
    this.productionUOMOptionsList = this.productionUOMOptionsList.filter((n, i) => this.productionUOMOptionsList.indexOf(n) === i);
  }

  setBOMUOMList() {
    this.bomUOMOptionsList = [].concat.apply([], this.bomUOMLists);
    this.bomUOMOptionsList = this.bomUOMOptionsList.filter((n, i) => this.bomUOMOptionsList.indexOf(n) === i);
  }

  setkey() {
    const formData = this.bomForm.value;
    if (!formData.rawMaterialGroupCode) {
      this.bomForm.controls.rawMaterialGroupCode.setValue(this.rawMaterialGroups[0].rawMaterialGroup);
      this.onRawMaterialSelected(this.rawMaterialGroups[0].rawMaterialGroupCode);
    }
  }
}
