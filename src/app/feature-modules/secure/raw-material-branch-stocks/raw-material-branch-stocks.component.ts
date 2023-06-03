import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialog, MatSelect } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { RMBranchStockRequest, RMBranchUpdateRequest, RMStockBranch } from './raw-material-branch-stocks.mode';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { unwrapResolvedMetadata } from '@angular/compiler';
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
  selector: 'app-raw-material-branch-stocks',
  templateUrl: './raw-material-branch-stocks.component.html',
  styleUrls: ['./raw-material-branch-stocks.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class RawMaterialBranchStocksComponent implements OnInit {

  @ViewChild('dateOfStock', { static: false }) dateOfStock: ElementRef;
  @ViewChild('materialGroup', { static: false }) materialGroup: MatSelect;
  @ViewChild('areaNameField', { static: false }) areaNameField: MatSelect;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;
  @ViewChild('totalQuantityField', { static: false }) totalQuantityField: ElementRef;

  submitted = false;
  selectedRowId = 0;
  isRowSelected = false;
  isStockDataExist = false;
  isAreaIdRequired = false;
  isFindClicked = false;
  isStockAddClicked = false;
  hasDataLoadedByFind = false;
  hasFindDataUpdated = false;

  orgCols: any[];
  enableNewBranchStock: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  rmBranchStockGrid: any[];
  stockToBeModified: any;
  getRMBranchStocksData: any;
  materialNameList: any[] = [];
  rMBranchStockRequest: RMBranchStockRequest;
  updateRequest: RMBranchUpdateRequest[];
  isFindMode: boolean;
  isModifyMode: boolean;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog
    // tslint:disable-next-line: align
    , private service: WebservicewrapperService, private alertService: AlertService) {
    this.rmBranchStockGrid = [];
  }


  rmBranchStockForm: FormGroup;
  ngOnInit() {
    this.initData();
    this.createForm();
    this.onChanges();
    this.getRMBranchStockDetails();
  }
  onChanges() {
    try {
      this.rmBranchStockForm.get('areaName').valueChanges.subscribe(val => {
        if (this.rmBranchStockForm.controls.areaName.value) {
          const code = this.getRMBranchStocksData.Area.filter(a => a.areaName === this.rmBranchStockForm.controls.areaName.value).pop();
          this.rmBranchStockForm.controls.areaCode.setValue(code.areaCode);
          if (this.isFindMode || this.isModifyMode) {
            this.findStocksByAreaId();
          }
        } else {
        }
      });

      this.rmBranchStockForm.get('materialGroup').valueChanges.subscribe(val => {
        if (this.rmBranchStockForm.controls.materialGroup.value) {
          const materialCode = this.getRMBranchStocksData.RawMaterialMasters.filter(a => a.Raw_Material_Group ===
            this.rmBranchStockForm.controls.materialGroup.value)[0].Raw_Material_Group_Code;
          this.rmBranchStockForm.controls.materialName.setValue('');
          if (materialCode) {

            this.materialNameList = this.getRMBranchStocksData.RawMaterialDetails.filter(a => a.Raw_Material_Group_Code === materialCode);

          } else {
            this.materialNameList = [];
          }
        }
      });
      this.rmBranchStockForm.get('materialName').valueChanges.subscribe(val => {
        if (this.rmBranchStockForm.controls.materialName.value) {

          const materialCode = this.getRMBranchStocksData.RawMaterialMasters.filter(a => a.Raw_Material_Group ===
            this.rmBranchStockForm.controls.materialGroup.value)[0].Raw_Material_Group_Code;

          if (materialCode) {

            this.materialNameList = this.getRMBranchStocksData.RawMaterialDetails.filter(a => a.Raw_Material_Group_Code === materialCode);

          }

          const selectedMaterial = this.materialNameList.filter(a => a.Raw_Material_Details_Name
            === this.rmBranchStockForm.controls.materialName.value)[0];
          if (selectedMaterial) {
            this.rmBranchStockForm.controls.uom.setValue(selectedMaterial.Raw_Material_UOM);
          }
        }
      });

    } catch (error) {
      // console.log('Method: onChanges', error);
    }
  }

  clear() {
    this.rmBranchStockForm.reset();
    this.rmBranchStockForm.disable();
    this.isRowSelected = false;
    this.isStockDataExist = false;
    this.isAreaIdRequired = false;
    this.isFindClicked = false;
    this.isStockAddClicked = false;
    this.hasDataLoadedByFind = false;
    this.hasFindDataUpdated = false;
    this.rmBranchStockGrid = [];
    this.enableNewBranchStock = true;
    this.enableSave = false;
    this.enableModify = true;
    this.enableFind = true;
    this.isFindMode = false;
    this.isModifyMode = false;

  }
  get f() { return this.rmBranchStockForm.controls; }

  initData() {

    this.orgCols = [
      // take field name from table
      { field: ' ', header: 'Sl. No.' },
      { field: ' ', header: 'Stock Date' },
      { field: ' ', header: 'Material Group' },
      { field: ' ', header: 'Material Name' },
      { field: ' ', header: 'UOM' },
      { field: ' ', header: 'Qty' },
    ];

  }

  createForm() {
    try {
      this.rmBranchStockForm = this.formBuilder.group({
        stockDate: ['', Validators.required],
        stockNo: [''],
        areaName: ['', Validators.required],
        areaCode: ['', Validators.required],
        materialGroup: ['', Validators.required],
        materialName: ['', Validators.required],
        uom: ['', Validators.required],
        totalQuantity: ['', [Validators.required, Validators.pattern(/^(?:\d{0,10}\.\d{1,3})$|^\d{0,10}$/)]]
      });

      this.rmBranchStockForm.disable();
      this.enableNewBranchStock = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;

    } catch (error) {
      // console.log('Method : createForm', error);
    }

  }

  getRMBranchStockDetails() {
    this.service.GetRMBranchStocksData().subscribe(
      (data) => {
        this.getRMBranchStocksData = data;
      },
      (error) => {

      }
    );
  }

  RowSelected(model: any) {
    this.selectedRowId = model.id;
    this.isRowSelected = true;
    this.stockToBeModified = model;

    if (this.isModifyMode) {
      this.enableSave = true;
      this.rmBranchStockForm.controls.totalQuantity.enable();
      this.totalQuantityField.nativeElement.focus();
    }

    this.populateModifyFields();
  }
  populateModifyFields() {
    try {
      setTimeout(() => {
        this.rmBranchStockForm.controls.materialGroup.setValue(this.stockToBeModified.rawMaterialGroupCodeName);
        this.rmBranchStockForm.controls.materialName.setValue(this.stockToBeModified.rawMaterialDetailsCodeName);
        this.rmBranchStockForm.controls.uom.setValue(this.stockToBeModified.rawMaterialUom);
        this.rmBranchStockForm.controls.totalQuantity.setValue(this.stockToBeModified.rmStockQuantity);
      }, 100);

    } catch (error) {
      // console.log('Method : populateModifyFields', error);
    }

  }

  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  addBranchStock() {
    try {
      this.dateOfStock.nativeElement.focus();
      this.rmBranchStockForm.enable();
      this.rmBranchStockForm.controls.stockNo.disable();
      this.rmBranchStockForm.controls.areaCode.disable();
      this.rmBranchStockForm.controls.uom.disable();
      this.enableNewBranchStock = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;

      this.rmBranchStockForm.controls.stockDate.setValue(new Date());
    } catch (error) {

    }
  }

  pushBranchStock() {
    try {
      this.submitted = true;
      this.isStockAddClicked = true;
      this.isAreaIdRequired = true;
      this.markFieldAsTouched(this.rmBranchStockForm);
      if (this.rmBranchStockForm.invalid) {
        return;
      }

      this.isStockAddClicked = false;
      this.isAreaIdRequired = false;
      this.submitted = false;
      this.isStockDataExist = true;
      if (this.isModifyMode && this.stockToBeModified) {
        this.saveFocus.nativeElement.focus();
        this.stockToBeModified.rmStockQuantity = this.rmBranchStockForm.controls.totalQuantity.value;
        return;
      }
      const arrLength = this.rmBranchStockGrid.length;
      this.rmBranchStockGrid.push({
        id: arrLength + 1,
        stockDate: new Date(this.rmBranchStockForm.controls.stockDate.value).toLocaleDateString(),
        rawMaterialGroupCodeName: this.rmBranchStockForm.controls.materialGroup.value,
        rawMaterialDetailsCodeName: this.rmBranchStockForm.controls.materialName.value,
        rawMaterialUom: this.rmBranchStockForm.controls.uom.value,
        rmStockQuantity: this.rmBranchStockForm.controls.totalQuantity.value,
      });

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do You Want to add more items?'
      });


      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.materialGroup.focus();
          this.rmBranchStockForm.controls.areaName.disable();
          this.rmBranchStockForm.controls.materialGroup.reset();
          this.rmBranchStockForm.controls.materialName.reset();
          this.rmBranchStockForm.controls.uom.reset();
          this.rmBranchStockForm.controls.totalQuantity.reset();

        } else {
          this.saveFocus.nativeElement.focus();
        }
      });
    } catch (error) {
      // console.log('Method : addBranchStock', error);
    }


  }
  submitBranchStocks() {
    if (this.isModifyMode) {
      this.submitUpdatedStocks();
      return;
    }

    this.prepareData();

    this.service.PostRMBranchStocks(this.rMBranchStockRequest).subscribe(
      (data) => {
        // if (data && data.responseMessage && data.responseMessage === 'Duplicate Raw Material Details Received') {
        //   this.submitted = false;
        //   // this.stocksCount = 0;
        //   this.isStockDataExist = false;
        //   this.clear();
        //   this.alertService.warning('Duplicate Raw Material Details Received.');
        //   return;
        // }
        // this.IsLoading = false;
        this.submitted = false;
        // this.stocksCount = 0;
        this.isStockDataExist = false;
        this.clear();
        this.alertService.success('Your material branch stock added successfully.');
      },
      (error) => {
        // this.IsLoading = false;
        this.submitted = false;
        this.clear();
        this.alertService.warning('Duplicate Raw Material Details Received.');
      }
    );

  }
  prepareData() {
    try {

      this.rMBranchStockRequest = new RMBranchStockRequest();
      this.rMBranchStockRequest.rmStockBranchQuantityModel = [];
      this.rMBranchStockRequest.rmStockBranchDetailsModel = new RMStockBranch();

      this.rMBranchStockRequest.rmStockBranchDetailsModel.stockDate =
        new Date(this.rmBranchStockForm.controls.stockDate.value).toLocaleDateString();

      // this.rMBranchStockRequest.stockNo = this.rmBranchStockForm.controls.stockNo.value;
      const code = this.getRMBranchStocksData.Area.filter(a => a.areaName === this.rmBranchStockForm.controls.areaName.value).pop();
      this.rMBranchStockRequest.rmStockBranchDetailsModel.areaId = code.areaId;
      this.rMBranchStockRequest.rmStockBranchDetailsModel.areaCode = this.rmBranchStockForm.controls.areaCode.value;

      for (const item of this.rmBranchStockGrid) {

        const materialGroup = this.getRMBranchStocksData.RawMaterialMasters
          .filter(a => a.Raw_Material_Group === item.rawMaterialGroupCodeName).pop();
        const materialGroupCode = materialGroup.Raw_Material_Group_Code;

        const materialDetails = this.getRMBranchStocksData.RawMaterialDetails
          .filter(a => a.Raw_Material_Details_Name === item.rawMaterialDetailsCodeName).pop();
        const materialDetailsCode = materialDetails.Raw_Material_Details_Code;

        this.rMBranchStockRequest.rmStockBranchQuantityModel.push({
          rawMaterialGroupCode: materialGroupCode,
          rawMaterialDetailsCode: materialDetailsCode,
          rawMaterialUom: item.rawMaterialUom,
          rmStockQuantity: item.rmStockQuantity
        });
      }
    } catch (error) {
      console.log('Method : PrepareData', error);
    }

  }

  modify() {
    try {
      this.enableNewBranchStock = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.areaNameField.focus();
      this.rmBranchStockForm.controls.areaName.enable();
      this.isModifyMode = true;
    } catch (error) {

    }
  }

  modifyStockData() {

    if (this.hasDataLoadedByFind) {
      this.hasFindDataUpdated = true;
    }

    this.rmBranchStockGrid.find(a => a.id === this.selectedRowId).rawMaterialGroupCodeName
      = this.rmBranchStockForm.controls.materialGroup.value;
    this.rmBranchStockGrid.find(a => a.id === this.selectedRowId).rawMaterialDetailsCodeName
      = this.rmBranchStockForm.controls.materialName.value;
    this.rmBranchStockGrid.find(a => a.id === this.selectedRowId).rawMaterialUom = this.rmBranchStockForm.controls.uom.value;
    this.rmBranchStockGrid.find(a => a.id === this.selectedRowId).rmStockQuantity = this.rmBranchStockForm.controls.totalQuantity.value;

    this.rmBranchStockForm.controls.materialGroup.reset();
    this.rmBranchStockForm.controls.materialName.reset();
    this.rmBranchStockForm.controls.uom.reset();
    this.rmBranchStockForm.controls.totalQuantity.reset();
  }

  find() {
    try {
      this.enableNewBranchStock = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.rmBranchStockForm.controls.areaName.enable();
      this.areaNameField.focus();
      this.isFindMode = true;

    } catch (error) {

    }
  }

  findStocksByAreaId() {
    this.submitted = true;
    this.isAreaIdRequired = true;
    this.isStockAddClicked = false;

    const code = this.getRMBranchStocksData.Area.filter(a => a.areaName === this.rmBranchStockForm.controls.areaName.value).pop();
    const areaId = code.areaId;
    this.service.GetBranchStocksByAreaId(areaId).subscribe(
      (data) => {
        this.rmBranchStockGrid = data;
        this.hasDataLoadedByFind = true;
        this.submitted = false;
        this.isAreaIdRequired = false;
      },
      (error) => {

        this.submitted = false;
        this.isAreaIdRequired = false;
      }

    );

  }

  submitUpdatedStocks() {
    this.prepareUpdateRequest();

    this.service.PostUpdatedRMBranchStocks(this.updateRequest).subscribe(
      (data) => {
        // this.IsLoading = false;
        this.submitted = false;
        // this.stocksCount = 0;
        this.isStockDataExist = false;
        this.clear();
        this.alertService.success('Your material branch stock Updated successfully.');
      },
      (error) => {
        // this.IsLoading = false;
        this.submitted = false;
        this.alertService.error('There is some error while prococessing your request.Please try again.');
      }
    );

  }

  prepareUpdateRequest() {

    this.updateRequest = [];
    // this.updateRequest.rMBranchUpdateDetailsModel = [];

    try {
      for (const item of [this.stockToBeModified]) {

        this.updateRequest.push({
          id: item.id,
          stockDate: new Date(item.stockDate).toLocaleDateString(),
          stockNo: item.stockNo,
          rawMaterialGroupCode: item.rawMaterialGroupCode,
          rawMaterialDetailsCode: item.rawMaterialDetailsCode,
          rawMaterialGroupCodeName: item.rawMaterialGroupCodeName,
          rawMaterialDetailsCodeName: item.rawMaterialDetailsCodeName,
          rawMaterialUom: item.rawMaterialUom,
          rmStockQuantity: item.rmStockQuantity
        });
      }
    } catch (error) {

    }
  }

}
