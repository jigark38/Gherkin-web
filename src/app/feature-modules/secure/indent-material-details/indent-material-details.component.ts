import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IndentMaterialDetailsService } from './indent-material-details.service';
import {
  Area, MaterialList, MaterialName, MaterialGroup, BranchIndentDetails,
  BranchIndentMaterialDetails, ModelForSaving, OrganisationArea
} from './indent-material-details.model';
import { DialogService } from 'src/app/services/dialog.service';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MatSelect, MatDialog, MatDialogRef, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';
import { IndentDialogComponent } from './indent-dialog/indent-dialog.component';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
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
  selector: 'app-indent-material-details',
  templateUrl: './indent-material-details.component.html',
  styleUrls: ['./indent-material-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class IndentMaterialDetailsComponent implements OnInit {

  indentMaterialForm: FormGroup;
  allAreas: Area[] = [];
  allOrganisationAreas: OrganisationArea[] = [];
  allMaterials: MaterialName[] = null;
  allMaterialGroups: MaterialGroup[] = null;
  UOMList: MaterialName[] = [];
  userData: any;
  materialList: BranchIndentMaterialDetails[] = [];
  allIndentList: ModelForSaving[] = null;
  materialId: number = 0;

  constructor(
    private service: IndentMaterialDetailsService,
    private authService: AuthenticationService,
    public dialogService: DialogService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<IndentDialogComponent>,
    private alertService: AlertService) {
    this.userData = this.authService.getUserdetails();
  }

  @ViewChild('areaMatSelect', null) areaMatSelectRef: MatSelect;
  @ViewChild('materialGroupInput', null) materialGroupField: MatSelect;
  @ViewChild('materialIndentInput', null) materialIndentField: MatSelect;
  @ViewChild('saveBtn', null) saveBtnRef: ElementRef;
  @ViewChild('indentDate', null) indentDateRef: ElementRef;
  disableSaveButton = true;
  disableFields = true;
  disableFindButton = false;
  disableModifyButton = false;
  disableNewButton = false;
  isAreaSelected = false;
  isOrganisationSelected = false;
  isEditMode = false;
  isFindMode = false;
  AreaId: number;
  OrganisationId: number;
  disableIntentNo = false;
  disableIntentDate = false;
  disableArea = false;
  disableRequestTo = false;

  ngOnInit() {
    try {
      this.onInit();
      this.onClearClick();

      this.indentMaterialForm.controls.UOM.valueChanges.pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this.service.getUOMList()
          .pipe(
            finalize(() => { }),
          )
        )
        // ).subscribe((m: PracticeMaterial[]) => {
      ).subscribe((m: MaterialName[]) => {
        this.UOMList = m;
        const typedUOM = this.indentMaterialForm.controls.UOM.value;
        if (typedUOM === '' || typedUOM === null) {

        } else {
          if (this.UOMList.length > 0) {
            this.UOMList = this.UOMList.filter(p => p.RM_UOM.toLowerCase().indexOf(typedUOM.toLowerCase()) !== -1);
          }
        }
      });
    } catch (error) {
      console.log('Error on ngOnInit: ', error);
    }
  }

  onInit() {
    this.initalizeForm();
    this.disableSaveButton = true;
    this.indentMaterialForm.disable();
  }

  initalizeForm(): void {
    try {
      this.indentMaterialForm = new FormGroup({

        indentDate: new FormControl(null, [Validators.required]),
        indentBy: new FormControl(this.userData.userId),
        indentByName: new FormControl(this.userData.userName),
        indentNo: new FormControl('1'),
        indentId: new FormControl("1"),
        areaId: new FormControl(null, [Validators.required]),
        requestTo: new FormControl(null, [Validators.required]),
        materialGroupName: new FormControl(null),
        materialGroupId: new FormControl(null, [Validators.required]),
        materialName: new FormControl(null),
        materialNameId: new FormControl(null, [Validators.required]),
        UOM: new FormControl('', [Validators.required]),
        currentQuantity: new FormControl(200, [Validators.required, Validators.min(0.00), Validators.max(999999.99)]),
        indentQuantity: new FormControl(null, [Validators.required, Validators.min(0.00), Validators.max(9999999.99)]),
        requiredDate: new FormControl(null, [Validators.required]),
        remarks: new FormControl(null, [Validators.required])
      });
    } catch (error) {
      console.log('Error on initalizeForm: ', error);
    }
  }

  getAllAreas() {
    try {
      this.service.getAllAreas().subscribe((data: Area[]) => {
        this.allAreas = data;
      },
        (error) => console.log(error)
      );
    } catch (error) {
      console.log('Error on getAllAreas: ', error);
    }
  }

  getOfficeLocations() {
    try {
      this.service.getOfficeLocations().subscribe((data: OrganisationArea[]) => {
        this.allOrganisationAreas = data;
      },
        (error) => console.log(error)
      );
    } catch (error) {
      console.log('Error on getAllAreas: ', error);
    }
  }

  areaChange(event) {
    try {
      if (event) {
        this.isAreaSelected = false;
        this.isOrganisationSelected = false;
        // const selectedGroup = this.allAreas.filter(p => p.areaId === event.value)[0];
        if (event.value) {
          if (event.value.areaId) {
            this.isAreaSelected = true;
            this.indentMaterialForm.controls.areaId.setValue(event.value);
            // this.AreaId = event.value.areaId;
          }
          if (event.value.orgOfficeNo) {
            this.isOrganisationSelected = true;
            this.indentMaterialForm.controls.areaId.setValue(event.value);
            // this.OrganisationId = event.value.orgOfficeNo;
          }
        }

        // if (selectedGroup) {
        //   this.indentMaterialForm.controls.areaId.setValue(selectedGroup.areaId);
        //   // this.getMaterialNameList(selectedGroup.Raw_Material_Group_Code).subscribe(() => { });
        // }
      } else {
        this.allMaterials = [];
        // this.indentMaterialForm.controls.place.setValue('');
      }
    } catch (error) {
      console.log('Error on areaChange: ', error);
    }
  }

  getAllMaterialGroup() {
    try {
      this.service.getAllMaterialGroup().subscribe((data: MaterialGroup[]) => {
        this.allMaterialGroups = data;
      },
        (error) => console.log(error)
      );
    } catch (error) {
      console.log('Error on getAllMaterialGroup: ', error);
    }
  }

  materialGroupChange(event) {
    try {
      if (event) {
        const selectedGroup = this.allMaterialGroups.filter(p => p.Raw_Material_Group_Code === event.value)[0];
        if (selectedGroup) {
          this.indentMaterialForm.controls.materialGroupName.setValue(selectedGroup.Raw_Material_Group);
          this.getMaterialNameList(selectedGroup.Raw_Material_Group_Code).subscribe(() => { });
          this.indentMaterialForm.controls.materialNameId.reset();
        }
      } else {
        this.allMaterials = [];
        // this.indentMaterialForm.controls.place.setValue('');
      }
    } catch (error) {
      console.log('Error on materialGroupChange: ', error);
    }
  }

  materialNameChange(event) {
    try {
      if (event) {
        const selectedName = this.allMaterials.filter(p => p.Raw_Material_Details_Code === event.value)[0];
        if (selectedName) {
          this.indentMaterialForm.controls.materialName.setValue(selectedName.Raw_Material_Details_Name);

        }
      } else {
        // this.indentMaterialForm.controls.place.setValue('');
      }
    } catch (error) {
      console.log('Error on materialNameChange: ', error);
    }
  }

  getMaterialNameList(groupCode: string, id: string = '') {
    try {
      return new Observable((sub) => {
        this.service.getAllMaterialByMaterialGroup(groupCode).subscribe((res: MaterialName[]) => {

          this.allMaterials = res;
          if (id) {
            const materialDetailsId = this.allMaterials.find(c => c.Raw_Material_Details_Code == id);
            this.indentMaterialForm.get('materialNameId').setValue(id);
            this.indentMaterialForm.controls.materialName.setValue(materialDetailsId.Raw_Material_Details_Name);
          }
          sub.next();
        }, err => {
          this.allMaterials = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getMaterialNameList: ', error);
    }
  }

  onFindClick() {
    try {
      this.indentMaterialForm.disable();
      this.disableNewButton = true;
      this.disableSaveButton = true;
      this.disableModifyButton = true;
      this.isFindMode = true;
    } catch (error) {
      console.log('Error on onFindClick: ', error);
    }
  }
  fillDummyData() {
    try {
      this.indentMaterialForm.patchValue({
        indentDate: '2020-03-15',
        indentBy: '1',
        indentByName: 'Adip Singh',
        indentNo: '1',
        areaId: 'CAC_2',
        requestTo: '1',
        // materialGroupName: ,
        materialGroupId: 'CAC_2',
        // materialName: new FormControl(null),
        materialNameId: 'CAC_2',
        UOM: 'KG',
        currentQuantity: 200,
        indentQuantity: 202,
        requiredDate: '2020-11-15',
        remarks: 'test Remarks',
      });
    } catch (error) {
      console.log('Error on fillDummyData: ', error);
    }
  }

  onClearClick() {
    try {
      // this.onInit();
      this.disableNewButton = false;
      this.disableSaveButton = true;
      this.disableModifyButton = false;
      this.disableFindButton = false;
      this.isEditMode = false;
      this.isFindMode = false;
      this.indentMaterialForm.reset();
      this.indentMaterialForm.disable();
      this.getAllAreas();
      this.getOfficeLocations();
      this.getAllMaterialGroup();
      this.getAllIndent();
      this.materialList = [];
    } catch (error) {
      console.log('Error on onClearClick: ', error);
    }
  }

  addIndent() {
    try {
      this.indentMaterialForm.markAllAsTouched();
      if (this.indentMaterialForm.invalid) {
        return;
      }
      this.dialogRef = this.dialog.open(IndentDialogComponent);

      this.dialogRef.afterClosed().subscribe(res => {
        const matGroupId = this.indentMaterialForm.controls.materialGroupId.value;
        const matGroupName = this.indentMaterialForm.controls.materialGroupName.value;
        const matName = this.indentMaterialForm.controls.materialName.value;
        const matNameId = this.indentMaterialForm.controls.materialNameId.value;
        const requiredDate = new Date(this.indentMaterialForm.controls.requiredDate.value).toLocaleString();;
        const remarks = this.indentMaterialForm.controls.remarks.value;
        const currentQuantity = this.indentMaterialForm.controls.currentQuantity.value;
        const requiredQuantity = this.indentMaterialForm.controls.indentQuantity.value;
        const uom = this.indentMaterialForm.controls.UOM.value;

        if (res) {
          this.materialGroupField.focus();
          this.materialList.push({
            Raw_Material_Group_Code: matGroupId, GroupName: matGroupName, DetailsName: matName,
            Raw_Material_Details_Code: matNameId, RM_Remarks: remarks, RM_Require_Date: requiredDate,
            RM_Stock_On_Date: currentQuantity, RM_Indent_Req_Qty: requiredQuantity, ID: 0, RM_UOM: uom, Raw_Material_Details_Name: ""
          });
          this.clearMaterialDetails();
        } else if (res === false) {
          this.disableSaveButton = false;

          this.materialList.push({
            Raw_Material_Group_Code: matGroupId, GroupName: matGroupName, DetailsName: matName,
            Raw_Material_Details_Code: matNameId, RM_Remarks: remarks, RM_Require_Date: requiredDate,
            RM_Stock_On_Date: currentQuantity, RM_Indent_Req_Qty: requiredQuantity, ID: 0, RM_UOM: uom, Raw_Material_Details_Name: ""
          });
          this.clearMaterialDetails();
          // because button was disabled and rows are added to the grid,
          // so delay was needed to focus on button after enabling it
          setTimeout(() => this.saveBtnRef.nativeElement.focus(), 1000);
        }
      });
    } catch (error) {
      console.log('Error on addIndent: ', error);
    }
  }
  clearMaterialDetails() {
    this.indentMaterialForm.controls.materialGroupId.reset();
    this.indentMaterialForm.controls.materialGroupName.reset();
    this.indentMaterialForm.controls.materialName.reset();
    this.indentMaterialForm.controls.materialNameId.reset();
    this.indentMaterialForm.controls.requiredDate.reset();
    this.indentMaterialForm.controls.remarks.reset();
    this.indentMaterialForm.controls.currentQuantity.reset();
    this.indentMaterialForm.controls.indentQuantity.reset();
    this.indentMaterialForm.controls.UOM.reset();
    this.isEditMode = false;
    this.isFindMode = false;
    //enable the controls
    this.disableIntentNo = false;
    this.disableIntentDate = false;
    this.disableArea = false;
    this.disableRequestTo = false;
  }

  onBlur() {
    try {
      if (!this.isEditMode && !this.isFindMode) {
        this.addIndent();
      }
    } catch (error) {
      console.log('Error on onBlur: ', error);
    }
  }

  onSaveClick() {
    try {
      const indent: ModelForSaving = this.getIndent();
      if (!indent) {
        return;
      }

      if (!this.isEditMode) {
        this.service.saveIndent(indent).subscribe(() => {
          this.alertService.success('Indent created successfully.');
          this.onClearClick();
        }, err => {
          this.alertService.error('Error has occured while creating an Indent.');
        });
      } else {
        var modifiedIndent = this.getModifiedIndent();
        this.service.UpdateIndent(modifiedIndent).subscribe(() => {
          this.alertService.success('Indent updated successfully.');
          this.onClearClick();
        }, err => {
          this.alertService.error('Error has occured while creating an Indent.');
        });
      }
    } catch (error) {
      console.log('Error on onSaveClick: ', error);
    }
  }
  newIndent() {
    try {
      this.indentMaterialForm.enable();
      //  this.indentMaterialForm.controls.indentDate.disable();
      //  this.indentMaterialForm.controls.indentByName.disable();
      this.indentMaterialForm.controls.indentNo.disable();
      this.disableNewButton = true;
      this.disableSaveButton = true;
      this.disableFindButton = true;
      this.disableModifyButton = true;
      // this.indentDateRef.nativeElement.focus();
      this.areaMatSelectRef.focus();
      this.indentMaterialForm.controls.indentDate.setValue(new Date());
      this.indentMaterialForm.controls.indentByName.setValue(this.userData.userName);
      this.indentMaterialForm.controls.indentNo.setValue('');

    } catch (error) {
      console.log('Error on newIndent: ', error);
    }
  }

  ModifyIndent() {
    try {
      this.isEditMode = true;
      this.indentMaterialForm.enable();
      this.disableNewButton = true;
      this.disableSaveButton = true;
      this.disableFindButton = true;


    } catch (error) {
      console.log('Error on ModifyIndent: ', error);
    }
  }

  getIndent(): ModelForSaving {
    try {
      // if (this.indentMaterialForm.valid) {
      if (this.isModelValid()) {
        const indentMaterial = new BranchIndentDetails();
        indentMaterial.RM_Indent_No = this.indentMaterialForm.controls.indentNo.value;
        indentMaterial.RM_Indent_Entry_Date = new Date(this.indentMaterialForm.controls.indentDate.value).toLocaleString();
        indentMaterial.RM_Indent_Emp_ID = this.userData.userId; // this.indentMaterialForm.controls.indentByName.value;
        if (this.isAreaSelected) {
          indentMaterial.Area_ID = this.indentMaterialForm.controls.areaId.value.areaId;
        }
        if (this.isOrganisationSelected) {
          indentMaterial.Org_Office_No = this.indentMaterialForm.controls.areaId.value.orgOfficeNo;
        }
        indentMaterial.Request_To = this.indentMaterialForm.controls.requestTo.value;
        const saveModel = new ModelForSaving();
        saveModel.BranchIndentDetails = indentMaterial;
        saveModel.BranchIndentMaterialDetails = this.materialList;
        // indentMaterial.BranchIndentMaterialDetails = this.materialList;

        return saveModel;
      } else {
        this.indentMaterialForm.markAllAsTouched();
        return null;
      }

      // }
    } catch (error) {
      console.log('Error on getIndent: ', error);
    }

  }

  isModelValid(): boolean {
    try {
      if (this.indentMaterialForm.controls.indentDate.value !== ''
        // this.indentMaterialForm.controls.indentNo.value !== '' &&
        && this.indentMaterialForm.controls.indentByName.value !== '' &&
        this.indentMaterialForm.controls.areaId.valid &&
        this.indentMaterialForm.controls.requestTo.valid && this.materialList.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error on isModelValid: ', error);
    }
  }

  getAllIndent() {
    try {
      this.service.getAllIndent().subscribe((data: ModelForSaving[]) => {
        this.allIndentList = data;
      },
        (error) => console.log(error)
      );
    } catch (error) {
      console.log('Error on getAllIndent: ', error);
    }
  }

  intentNoChange(event) {
    try {
      if (event) {
        const selectedGroup = this.allIndentList.filter(p => p.BranchIndentDetails.ID === event.value)[0];
        if (selectedGroup) {
          this.indentMaterialForm.controls.indentDate.setValue(selectedGroup.BranchIndentDetails.RM_Indent_Entry_Date);
          this.indentMaterialForm.controls.indentByName.setValue(selectedGroup.BranchIndentDetails.RM_Indent_Emp_ID);
          if (selectedGroup.BranchIndentDetails.Area_ID) {
            const toSelect = this.allAreas.find(c => c.areaId == selectedGroup.BranchIndentDetails.Area_ID);
            this.indentMaterialForm.get('areaId').setValue(toSelect);
            this.isAreaSelected = true;
          }
          this.indentMaterialForm.controls.requestTo.setValue(selectedGroup.BranchIndentDetails.Request_To);
          this.materialList = selectedGroup.BranchIndentMaterialDetails;
          const materials: BranchIndentMaterialDetails[] = [];
          const MaterialGroup: MaterialGroup[] = this.allMaterialGroups;
          selectedGroup.BranchIndentMaterialDetails.forEach(function (data) {
            const indentMaterial = data;
            const materialGroup = MaterialGroup.find(c => c.Raw_Material_Group_Code == data.Raw_Material_Group_Code);
            indentMaterial.GroupName = materialGroup.Raw_Material_Group;
            indentMaterial.DetailsName = data.Raw_Material_Details_Name;
            materials.push(indentMaterial);
          });
          this.materialList = materials;
        }
      } else {
        this.allIndentList = [];
      }
    } catch (error) {
      console.log('Error on intentNoChange: ', error);
    }
  }

  gridRowSelected(data) {
    if (data && this.isEditMode) {
      //disable the controls
      this.disableIntentNo = true;
      this.disableIntentDate = true;
      this.disableArea = true;
      this.disableRequestTo = true;

      this.materialId = data.ID;
      if (data.Raw_Material_Group_Code) {
        this.indentMaterialForm.controls.materialGroupId.setValue(data.Raw_Material_Group_Code);
        const materialGroup = this.allMaterialGroups.find(c => c.Raw_Material_Group_Code == data.Raw_Material_Group_Code);
        this.indentMaterialForm.controls.materialGroupName.setValue(materialGroup.Raw_Material_Group);
        this.getMaterialNameList(data.Raw_Material_Group_Code, data.Raw_Material_Details_Code).subscribe(() => { });
      }

      if (data.RM_UOM) {
        this.indentMaterialForm.controls.UOM.setValue(data.RM_UOM)
      }
      this.indentMaterialForm.controls.currentQuantity.setValue(data.RM_Stock_On_Date);
      this.indentMaterialForm.controls.indentQuantity.setValue(data.RM_Indent_Req_Qty);
      this.indentMaterialForm.controls.requiredDate.setValue(data.RM_Require_Date);
      this.indentMaterialForm.controls.remarks.setValue(data.RM_Remarks);
      this.disableSaveButton = false;
      this.disableModifyButton = true;
    }
  }

  getModifiedIndent(): BranchIndentMaterialDetails {
    try {
      if (this.isModelValid()) {
        const indentMaterial = new BranchIndentMaterialDetails();
        indentMaterial.ID = this.materialId;
        indentMaterial.Raw_Material_Group_Code = this.indentMaterialForm.controls.materialGroupId.value;
        indentMaterial.Raw_Material_Details_Code = this.indentMaterialForm.controls.materialNameId.value;
        indentMaterial.RM_Require_Date = new Date(this.indentMaterialForm.controls.requiredDate.value).toLocaleString();;
        indentMaterial.RM_Remarks = this.indentMaterialForm.controls.remarks.value;
        indentMaterial.RM_Stock_On_Date = this.indentMaterialForm.controls.currentQuantity.value;
        indentMaterial.RM_Indent_Req_Qty = this.indentMaterialForm.controls.indentQuantity.value;
        indentMaterial.RM_UOM = this.indentMaterialForm.controls.UOM.value;
        return indentMaterial;
      } else {
        this.indentMaterialForm.markAllAsTouched();
        return null;
      }
    } catch (error) {
      console.log('Error on getModifiedIndent: ', error);
    }
  }

}
