import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { Router } from '@angular/router';
import { RawMaterialDetails } from './raw-material-details-model';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MatSelect, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { Observable, concat } from 'rxjs';
import { UOMModel } from './raw-material-master-model';
@Component({
  selector: 'app-raw-material-master',
  templateUrl: './raw-material-master.component.html',
  styleUrls: ['./raw-material-master.component.css']
})
export class RawMaterialMasterComponent implements OnInit, OnChanges {
  public MaterialPurchase: any[];
  public MaterialDetails: any[];
  public MaterialDetailsTobeSaved: RawMaterialDetails[] = [];
  public MaterialDetailsModel: RawMaterialDetails;
  public ModelToBeModified: any;
  public FilteredMaterialGroup: any[];
  submitted = false;
  min = 0;
  max = 10;
  enableNewMaterial: boolean;
  enableNewGroup: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  public materialPurchaseType = [
    { id: 1, text: 'Import' },
    { id: 2, text: 'Domestic' },
    { id: 3, text: 'Both' }
  ];
  uomOptionsList: string[] = [];
  uomList: UOMModel[] = [];
  // tslint:disable-next-line: variable-name
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private _service: WebservicewrapperService
    // tslint:disable-next-line: align
    , private router: Router, private alertService: AlertService) {

  }

  public SelectedRowId = 0;
  IsRowSelected = false;
  IsModifyClicked = false;
  IsLoading = false;

  @ViewChild('materialPurchageField', { static: false }) materialPurchageField: MatSelect;
  @ViewChild('materialNameField', { static: false }) materialNameField: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;

  // tslint:disable-next-line: no-inferrable-types
  public SelectedMaterialPurchase: string = '';
  public SelectedMaterialGroup: string;
  public SelectMaterialPurchaseGroupCode = '';
  public IsMaterialPurchaseSelected = false;
  // tslint:disable-next-line: no-inferrable-types
  public MaterialName: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public QualityNorms: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public UOM = '';
  // tslint:disable-next-line: no-inferrable-types
  public ReOrderStock: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public HSNCode: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public IGSTRate: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public CGSTRate: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public SGSTRate: string = '';
  // tslint:disable-next-line: no-inferrable-types
  public CessRate: string = '';

  rawMaterialForm = new FormGroup({
    SelectedMaterialPurchase: new FormControl('', [Validators.required]),
    SelectedMaterialGroup: new FormControl('', [Validators.required]),
    MaterialName: new FormControl('', [Validators.required]),
    QualityNorms: new FormControl('', [Validators.required]),
    UOM: new FormControl('', [Validators.required]),
    ReOrderStock: new FormControl('', [Validators.pattern(/^(?:\d{0,8}\.\d{1,3})$|^\d{0,8}$/)]),
    HSNCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    IGSTRate: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,4}\.\d{1,2})$|^\d{0,4}$/)]),
    CGSTRate: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,4}\.\d{1,2})$|^\d{0,4}$/)]),
    SGSTRate: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,4}\.\d{1,2})$|^\d{0,4}$/)]),
    CessRate: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,4}\.\d{1,2})$|^\d{0,4}$/)]),
  });

  ngOnInit() {

    this.enableNewMaterial = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.enableNewGroup = true;
    this.rawMaterialForm.disable();
    this.getAllUOM();
    this._service.GetRawMaterialDetails().subscribe(
      (data) => {
        if (this.enableNewMaterial) {

          this.MaterialDetails = data;
        }
      },
      (error) => console.log(error)
    );

    this._service.GetRawMaterialMaster().subscribe(
      (data) => {
        this.MaterialPurchase = data;

      },
      (error) => console.log(error)
    );
  }
  onChangePurchase() {
    try {
      this.FilteredMaterialGroup = this.MaterialPurchase.filter(a => a.Material_Purchases.toLowerCase() ===
        this.rawMaterialForm.controls.SelectedMaterialPurchase.value.toLowerCase());

    } catch (error) {

    }

  }
  getAllUOM() {
    try {
      this._service.getAllUOM().subscribe((data: UOMModel[]) => {
        if (data && data.length) {
          this.uomList = data;
          this.uomOptionsList = data.map(a => a.UOMName.toUpperCase());
          this.uomOptionsList = this.uomOptionsList.slice();
        } else {
          this.uomOptionsList = [];
        }
      });
    } catch (error) {

    }
  }


  onChangeGroup() {
    try {
      const data = this.MaterialPurchase.filter(a => a.Raw_Material_Group_Code === this.rawMaterialForm.controls.SelectedMaterialGroup.value
        && a.Material_Purchases === this.rawMaterialForm.controls.SelectedMaterialPurchase.value).pop();
      this.SelectMaterialPurchaseGroupCode = data.Raw_Material_Group_Code;
      if (this.isFindOn || this.isModifyOn) {
        this._service.GetRawMaterialDetails().subscribe(
          // tslint:disable-next-line: no-shadowed-variable
          (data) => {
            const filteredData = data.filter(a => a.Raw_Material_Group_Code === this.rawMaterialForm.controls.SelectedMaterialGroup.value);
            this.MaterialDetails = filteredData;
          },
          (error) => console.log(error)
        );
      }
    } catch (error) {
      // console.log('Method : onChangeGroup', error);
    }

  }

  changeUOMValue(e) {
    try {

    } catch (error) {

    }
  }
  saveUOM(e) {
    try {
      if (e) {
        const uom: UOMModel = {
          RawMaterialUOM: null,
          UOMName: e.trim()
        };

        this._service.createUOM(uom).subscribe((data: UOMModel) => {
          if (data) {
            this.uomList.push(data);
            this.uomOptionsList = this.uomList.map(d => d.UOMName.toUpperCase());
            this.uomOptionsList = this.uomOptionsList.slice();
            this.alertService.success('UOM created successfully.');
          } else {
            this.alertService.error('Error occured while creating UOM.');
          }
        }, () => {
          this.alertService.error('Error occured while creating UOM.');

        });
      }
    } catch (error) {

    }
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  formValidate(): boolean {
    if (this.MaterialName === '' || this.SelectedMaterialPurchase === '' || this.QualityNorms === ''
      || this.UOM === '' || this.ReOrderStock === '' || this.HSNCode === '' || this.IGSTRate === '' || this.CGSTRate === ''
      || this.SGSTRate === '' || this.CessRate === '') {
      return false;
    } else {
      return true;
    }

  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  find() {
    try {
      this.isModifyOn = false;
      this.isFindOn = true;
      this.enableNewMaterial = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.min = 0;
      this.max = 10;
      this.enableNewGroup = true;
      this.rawMaterialForm.controls.SelectedMaterialPurchase.enable();
      this.rawMaterialForm.controls.SelectedMaterialGroup.enable();
      setTimeout(() => {
        this.materialPurchageField.focus();
      }, 100);
    } catch (error) {

    }

  }
  addMaterial() {
    this.rawMaterialForm.enable();
    this.MaterialDetails = [];
    this.enableNewMaterial = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;
    this.materialPurchageField.focus();
  }

  continuePopup() {
    try {
      if (this.rawMaterialForm.valid) {
        if (this.isModifyOn) {
          return;
        }

        this.MaterialDetailsModel = new RawMaterialDetails();
        const materialPurchage = this.rawMaterialForm.controls.SelectedMaterialPurchase.value;
        this.MaterialDetailsModel.Raw_Material_Group_Code = this.rawMaterialForm.controls.SelectedMaterialGroup.value;
        this.MaterialDetailsModel.RawMaterialGroupMaster = {
          Raw_Material_Group: this.FilteredMaterialGroup.
            filter(a => a.Raw_Material_Group_Code === this.rawMaterialForm.controls.SelectedMaterialGroup.value)[0].Raw_Material_Group
        };
        this.MaterialDetailsModel.Raw_Material_Details_Name = this.rawMaterialForm.controls.MaterialName.value;
        this.MaterialDetailsModel.Raw_Material_QC_Norms = this.rawMaterialForm.controls.QualityNorms.value;
        this.MaterialDetailsModel.Raw_Material_UOM = this.rawMaterialForm.controls.UOM.value;
        this.MaterialDetailsModel.Raw_Material_Reorder_Stock = this.rawMaterialForm.controls.ReOrderStock.value;
        this.MaterialDetailsModel.Raw_Material_HSN_CODE_No = this.rawMaterialForm.controls.HSNCode.value;
        this.MaterialDetailsModel.Raw_Material_IGST_Rate = this.rawMaterialForm.controls.IGSTRate.value;
        this.MaterialDetailsModel.Raw_Material_CGST_Rate = this.rawMaterialForm.controls.CGSTRate.value;
        this.MaterialDetailsModel.Raw_Material_SGST_Rate = this.rawMaterialForm.controls.SGSTRate.value;
        this.MaterialDetailsModel.Raw_Material_Cess_Rate = this.rawMaterialForm.controls.CessRate.value;

        this.MaterialDetails.push(this.MaterialDetailsModel);


        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more Materials?'
        });

        dialogRef.afterClosed().subscribe((res: boolean) => {
          if (res) {
            this.rawMaterialForm.reset();
            this.rawMaterialForm.controls.SelectedMaterialPurchase.disable();
            this.rawMaterialForm.controls.SelectedMaterialPurchase.setValue(materialPurchage);
            this.rawMaterialForm.controls.SelectedMaterialGroup.disable();
            this.rawMaterialForm.controls.SelectedMaterialGroup.setValue(this.MaterialDetailsModel.Raw_Material_Group_Code);
            this.materialNameField.nativeElement.focus();
          } else {
            this.saveButton.nativeElement.focus();
          }
        });
      }
    } catch (error) {

    }
  }

  postData() {
    this.submitted = true;
    if (this.rawMaterialForm.invalid) {
      return;
    }
    if (this.isModifyOn) {
      this.ModifyData();
      return;
    }
    this.IsLoading = true;
    const obList: Observable<any>[] = [];
    this.MaterialDetails.forEach(a => {
      obList.push(this._service.PostRawMaterialDetails(a));
    });
    // create raw material details
    // tslint:disable-next-line: align
    concat(...obList).subscribe(
      (data) => {
        this.IsLoading = false;
        if (data) {
          this.alertService.success('Materials added successfully.');
          this.clear();
        }
        // if (confirm('Material added successfully. Do you want to add more material to the group ?')) {
        //   this.submitted = false;
        //   this.clearWithoutGroup();
        // } else {
        //   this.submitted = false;
        //   this.clear();
        // }
        // alert('Your material added successfully');
      },
      (error) => {
        this.IsLoading = false;
        this.alertService.error('There is some error while prococessing your request.Please try again.');
      }
    );
  }


  RowSelected(RowId: any, model: any) {
    this.SelectedRowId = RowId;
    this.IsRowSelected = true;
    this.ModelToBeModified = model;
    const materialPurchage = this.MaterialPurchase.filter(a => a.Raw_Material_Group_Code === model.Raw_Material_Group_Code)[0];
    if (materialPurchage) {
      this.rawMaterialForm.controls.SelectedMaterialPurchase.setValue(materialPurchage.Material_Purchases);
      this.onChangePurchase();

    }
    this.rawMaterialForm.controls.SelectedMaterialGroup.setValue(model.Raw_Material_Group_Code);
    this.rawMaterialForm.controls.MaterialName.setValue(model.Raw_Material_Details_Name);
    this.rawMaterialForm.controls.QualityNorms.setValue(model.Raw_Material_QC_Norms);
    this.rawMaterialForm.controls.UOM.setValue(model.Raw_Material_UOM);
    this.rawMaterialForm.controls.ReOrderStock.setValue(model.Raw_Material_Reorder_Stock);
    this.rawMaterialForm.controls.HSNCode.setValue(model.Raw_Material_HSN_CODE_No);
    this.rawMaterialForm.controls.IGSTRate.setValue(model.Raw_Material_IGST_Rate);
    this.rawMaterialForm.controls.CGSTRate.setValue(model.Raw_Material_CGST_Rate);
    this.rawMaterialForm.controls.SGSTRate.setValue(model.Raw_Material_SGST_Rate);
    this.rawMaterialForm.controls.CessRate.setValue(model.Raw_Material_Cess_Rate);


    if (this.isModifyOn && !this.isFindOn) {
      this.rawMaterialForm.enable();
      this.rawMaterialForm.controls.SelectedMaterialPurchase.disable();
      this.rawMaterialForm.controls.SelectedMaterialGroup.disable();

    }
  }
  modify() {
    try {
      this.isFindOn = false;
      this.isModifyOn = true;
      this.enableNewMaterial = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
      this.min = 0;
      this.max = 10;
      this.enableNewGroup = true;
      this.rawMaterialForm.controls.SelectedMaterialPurchase.enable();
      this.rawMaterialForm.controls.SelectedMaterialGroup.enable();
      setTimeout(() => {
        this.materialPurchageField.focus();
      }, 100);
    } catch (error) {

    }
  }

  Modify1() {

    try {
      // this.MaterialDetailsModel.Raw_Material_Group_Code = this.SelectMaterialPurchaseGroupCode;
      this.IsModifyClicked = true;
      const data = this.MaterialPurchase.filter(a => a.Raw_Material_Group_Code === this.ModelToBeModified.Raw_Material_Group_Code).pop();
      this.SelectedMaterialPurchase = data.Material_Purchases;
      this.FilteredMaterialGroup = this.MaterialPurchase.filter(a => a.Material_Purchases === this.SelectedMaterialPurchase);
      this.SelectedMaterialGroup = data.Raw_Material_Group;

      this.IsMaterialPurchaseSelected = true;
      this.MaterialName = this.ModelToBeModified.Raw_Material_Details_Name;
      this.QualityNorms = this.ModelToBeModified.Raw_Material_QC_Norms;
      this.UOM = this.ModelToBeModified.Raw_Material_UOM;
      this.ReOrderStock = this.ModelToBeModified.Raw_Material_Reorder_Stock;

      this.HSNCode = this.ModelToBeModified.Raw_Material_HSN_CODE_No;
      this.IGSTRate = this.ModelToBeModified.Raw_Material_IGST_Rate;
      this.CGSTRate = this.ModelToBeModified.Raw_Material_CGST_Rate;
      this.SGSTRate = this.ModelToBeModified.Raw_Material_SGST_Rate;
      this.CessRate = this.ModelToBeModified.Raw_Material_Cess_Rate;
    } catch (error) {
      console.log('Method : Modify', error);
    }

  }
  clear() {
    this.IsModifyClicked = !this.IsModifyClicked;
    this.IsRowSelected = !this.IsRowSelected;
    this.SelectMaterialPurchaseGroupCode = '';
    this.MaterialName = '';
    this.QualityNorms = '';
    this.UOM = '';
    this.ReOrderStock = '';

    this.HSNCode = '';
    this.IGSTRate = '';
    this.CGSTRate = '';
    this.SGSTRate = '';
    this.CessRate = '';

    this.SelectedMaterialPurchase = '';
    this.SelectedMaterialGroup = '';
    this.SelectMaterialPurchaseGroupCode = '';
    this.min = 0;
    this.max = 10;
    this.enableNewMaterial = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;
    this.enableNewGroup = true;
    this.rawMaterialForm.reset();
    this.rawMaterialForm.disable();
    this.MaterialDetailsTobeSaved = [];
    this.isModifyOn = false;
    this.isFindOn = false;
    this.ngOnInit();
  }
  clearWithoutGroup() {
    // this.IsModifyClicked = !this.IsModifyClicked;
    // this.IsRowSelected = !this.IsRowSelected;
    this.SelectMaterialPurchaseGroupCode = '';
    this.MaterialName = '';
    this.QualityNorms = '';
    this.UOM = '';
    this.ReOrderStock = '';

    this.HSNCode = '';
    this.IGSTRate = '';
    this.CGSTRate = '';
    this.SGSTRate = '';
    this.CessRate = '';

    // this.SelectedMaterialPurchase = '';
    // this.SelectedMaterialGroup = '';
    this.SelectMaterialPurchaseGroupCode = '';
  }
  ModifyData() {

    try {
      this.submitted = true;

      if (this.rawMaterialForm.invalid) {
        return;
      }
      this.IsLoading = true;

      // const data = this.MaterialPurchase.filter(a => a.Raw_Material_Group === this.SelectedMaterialGroup
      //   && a.Material_Purchases === this.SelectedMaterialPurchase).pop();
      // this.SelectMaterialPurchaseGroupCode = data.Raw_Material_Group_Code;


      this.MaterialDetailsModel = new RawMaterialDetails();

      this.MaterialDetailsModel.Raw_Material_Group_Code = this.rawMaterialForm.controls.SelectedMaterialGroup.value;
      this.MaterialDetailsModel.Raw_Material_Details_Name = this.rawMaterialForm.controls.MaterialName.value;
      this.MaterialDetailsModel.Raw_Material_QC_Norms = this.rawMaterialForm.controls.QualityNorms.value;
      this.MaterialDetailsModel.Raw_Material_UOM = this.rawMaterialForm.controls.UOM.value;
      this.MaterialDetailsModel.Raw_Material_Reorder_Stock = this.rawMaterialForm.controls.ReOrderStock.value;
      this.MaterialDetailsModel.Raw_Material_HSN_CODE_No = this.rawMaterialForm.controls.HSNCode.value;
      this.MaterialDetailsModel.Raw_Material_IGST_Rate = this.rawMaterialForm.controls.IGSTRate.value;
      this.MaterialDetailsModel.Raw_Material_CGST_Rate = this.rawMaterialForm.controls.CGSTRate.value;
      this.MaterialDetailsModel.Raw_Material_SGST_Rate = this.rawMaterialForm.controls.SGSTRate.value;
      this.MaterialDetailsModel.Raw_Material_Cess_Rate = this.rawMaterialForm.controls.CessRate.value;

      // tslint:disable-next-line: comment-format
      //Modify raw material details
      this._service.ModifyRawMaterialDetails(this.ModelToBeModified.Raw_Material_Details_Code, this.MaterialDetailsModel).subscribe(
        // tslint:disable-next-line: no-shadowed-variable
        (data) => {
          this.IsLoading = false;
          this.submitted = false;
          this.alertService.success('Your material  modified successfully.');
          this.clear();
        },
        (error) => {
          this.IsLoading = false;
          this.submitted = false;
          this.alertService.error('There is some error while prococessing your request.Please try again.');
        }
      );
    } catch (error) {
      // console.log('Method: ModifyData', error);
    }
  }
  AddGroup() {
    try {
      this.router.navigateByUrl('secure/raw-material-group').then(e => {
        if (e) {

        } else {

        }
      });
    } catch (error) {
      console.log('Method: AddGroup', error);
    }
  }
}
