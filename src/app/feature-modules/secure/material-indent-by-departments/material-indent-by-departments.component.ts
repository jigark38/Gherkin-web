import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { StoreInternalIndentMaster, StoreInternalIndentDetail } from './material-indent-by-departments.model';
import { GSCUOMDetail, GSGroupDetail, GSMaterialDetail, GSSubGroupDetail } from '../stores-master-details/stores-master-details.model';
import { MaterialIndentByDepartmentsService } from './material-indent-by-departments.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { ApiResponse } from 'src/app/shared/models/apiResponse.model';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';

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
  selector: 'app-material-indent-by-departments',
  templateUrl: './material-indent-by-departments.component.html',
  styleUrls: ['./material-indent-by-departments.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class MaterialIndentByDepartmentsComponent implements OnInit {

  @ViewChild('indentDate', { static: false }) indentDate: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('groupName', { static: false }) groupName: MatSelect;

  isLoading: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  disableButton: boolean;

  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  loggedInUserName: string;
  loggedInUserID: string;

  selectedGroup: GSGroupDetail;
  selectedSubGroup: GSSubGroupDetail;
  selectedMaterialDetail: GSMaterialDetail;
  selectedUOMDetail: GSCUOMDetail;
  storeInternalIndentMaster: StoreInternalIndentMaster;

  groupNameList: GSGroupDetail[];
  subGroupNameList: GSSubGroupDetail[];
  filteredSubGroupNameList: GSSubGroupDetail[];
  materialDetailList: GSMaterialDetail[];
  storeInternalIndentMasterList: StoreInternalIndentMaster[];
  storeInternalIndentDetailList: StoreInternalIndentDetail[];

  indentQuantityRegExp = new RegExp(/^(?:\d{0,8}\.\d{1,3})$|^\d{0,3}$/);

  storeInternalIndentMasterForm = new FormGroup({
    IndentDate: new FormControl('', [Validators.required]),
    IndentNo: new FormControl('', []),
    EnteredBy: new FormControl('', [Validators.required]),
  });

  storeInternalIndentDetailForm = new FormGroup({
    GroupName: new FormControl('', [Validators.required]),
    SubGroupName: new FormControl('', [Validators.required]),
    GSMaterialName: new FormControl('', [Validators.required]),
    GSMaterialDesc: new FormControl('', [Validators.required]),
    UOMDetail: new FormControl('', [Validators.required]),
    IndentQuantity: new FormControl('', [Validators.pattern(/^(?:\d{0,8}\.\d{1,3})$|^\d{0,3}$/)]),
    RequiredDate: new FormControl('', [Validators.required]),
  });

  constructor(public authService: AuthenticationService, private alertService: AlertService,
              private materialIndentByDepartmentsService: MaterialIndentByDepartmentsService,
              private dialog: MatDialog) { }

  ngOnInit() {

    this.clearForm();
    this.getGroupNameList();

  }

  getGroupNameList() {
    this.materialIndentByDepartmentsService.GetGroupNameList().subscribe((data: ApiResponse<GSGroupDetail[]>) => {
      if (data.IsSucceed) {
        this.groupNameList = data.Data;
      } else {
        this.groupNameList = [];
      }
      this.disableButton = false;
    });
  }

  getSubGroupNameList(groupCode: number) {
    this.materialIndentByDepartmentsService.GetSubGroupNameListByGroupCode(groupCode).subscribe((data: ApiResponse<GSSubGroupDetail[]>) => {
      if (data.IsSucceed) {
        this.filteredSubGroupNameList = data.Data;
      } else {
        this.filteredSubGroupNameList = [];
      }
      this.disableButton = false;
    });
  }

  getMaterialDetailList(groupCode: number, subGroupCode: number) {
    this.materialIndentByDepartmentsService.GetMaterialListByGroupSubGroupCode(groupCode, subGroupCode)
      .subscribe((data: ApiResponse<GSMaterialDetail[]>) => {
        if (data.IsSucceed) {
          this.materialDetailList = [];
          data.Data.forEach((item, index) => {
            const detailIndex = this.storeInternalIndentDetailList.findIndex(x => x.storeMaterialItemCode === item.gsMaterialCode);
            if (detailIndex < 0) {
              this.materialDetailList.push(item);
            }
          });
        } else {
          this.materialDetailList = [];
        }
        this.disableButton = false;
      });
  }

  onGroupNameSelectionChanged() {
    const selectedGroup = this.groupNameList.filter(a =>
      a.gsGroupCode === this.storeInternalIndentDetailForm.controls.GroupName.value)[0];
    this.selectedGroup = selectedGroup;
    this.getSubGroupNameList(selectedGroup.gsGroupCode);
  }

  onSubGroupNameSelectionChanged() {
    const selectedSubGroup = this.filteredSubGroupNameList.filter(a =>
      a.gsSubGroupCode === this.storeInternalIndentDetailForm.controls.SubGroupName.value)[0];
    this.selectedSubGroup = selectedSubGroup;
    this.getMaterialDetailList(selectedSubGroup.gsGroupCode, selectedSubGroup.gsSubGroupCode);
  }

  onMaterialDetailSelectionChanged() {
    const selectedMaterialDetail = this.materialDetailList.filter(a =>
      a.gsMaterialCode === this.storeInternalIndentDetailForm.controls.GSMaterialName.value)[0];
    this.selectedMaterialDetail = selectedMaterialDetail;
    this.storeInternalIndentDetailForm.controls.GSMaterialDesc.setValue(selectedMaterialDetail.gsMaterialDesc);
    this.selectedUOMDetail = new GSCUOMDetail();
    this.selectedUOMDetail.gscUomCode = selectedMaterialDetail.gscUOMCode;
    this.selectedUOMDetail.gscUomName = selectedMaterialDetail.gscUOMName;
    this.storeInternalIndentDetailForm.controls.UOMDetail.setValue(selectedMaterialDetail.gscUOMName);
  }

  onIndentNoSelectionChanged(event) {
    const indentMaster = this.storeInternalIndentMasterList.find(x => x.storeInternalIndentNo === event.value);
    this.storeInternalIndentMasterForm.controls.IndentDate.setValue(indentMaster.storeInternalIndentDate);
    this.storeInternalIndentMaster = indentMaster;

    this.materialIndentByDepartmentsService.GetMaterialIndentDetailByIndentNo(indentMaster.storeInternalIndentNo).subscribe((data) => {
      if (data.IsSucceed) {
        this.storeInternalIndentDetailList = data.Data;
        this.storeInternalIndentDetailList.forEach((item, index) => {
          item.indentQtyString = item.storeDeptIndentQty.toString();
        });
      } else {
        this.storeInternalIndentDetailList = [];
      }
    });
  }

  validateIndentQuantity(indentDetail: StoreInternalIndentDetail) {
    if (indentDetail.indentQtyString && indentDetail.isEditing) {
      indentDetail.indentQtyEmpty = false;
      if (this.indentQuantityRegExp.test(indentDetail.indentQtyString)) {
        indentDetail.indentQtyNotInFormat = false;
        indentDetail.storeDeptIndentQty = parseFloat(indentDetail.indentQtyString);
      } else {
        indentDetail.indentQtyNotInFormat = true;
      }
    } else {
      indentDetail.indentQtyEmpty = true;
      indentDetail.indentQtyNotInFormat = false;
    }
  }

  requiredDateBlurred() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do You Want to add more?'
    });

    dialogRef.afterClosed().subscribe(result => {
      const indentDetail = this.getIndentDetail();
      this.storeInternalIndentDetailList.push(indentDetail);
      this.storeInternalIndentDetailForm.reset();

      if (result) {
        this.focusGroupName();
      } else {
        this.storeInternalIndentDetailForm.disable();
        this.focusSaveButton();
      }
    });
  }

  indentDateBlurred() {
    if (this.isFindOn || this.isModifyOn) {
      const indentDate = new Date(new Date(this.storeInternalIndentMasterForm.controls.IndentDate.value).toLocaleDateString());
      this.materialIndentByDepartmentsService.GetMaterialIndentListByIndentDate(indentDate).subscribe((data) => {
        if (data.IsSucceed) {
          this.storeInternalIndentMasterList = data.Data;
        } else {
          this.storeInternalIndentMasterList = [];
        }
      });
    }
  }

  getIndentMaster() {
    const indentMaster = new StoreInternalIndentMaster();
    if (this.isModifyOn) {
      indentMaster.id = this.storeInternalIndentMaster ? this.storeInternalIndentMaster.id : 0;
      indentMaster.storeInternalIndentNo = this.storeInternalIndentMaster ? this.storeInternalIndentMaster.storeInternalIndentNo : '';
    } else {
      indentMaster.id = 0;
      indentMaster.storeInternalIndentNo = null;
    }
    indentMaster.empId = this.loggedInUserID;
    indentMaster.deptId = '';
    indentMaster.storeInternalIndentDate = new Date(new Date(
      this.storeInternalIndentMasterForm.controls.IndentDate.value).toLocaleDateString());
    return indentMaster;
  }

  getIndentDetail() {
    const indentDetail = new StoreInternalIndentDetail();
    indentDetail.id = this.storeInternalIndentMaster ? this.storeInternalIndentMaster.id : 0;
    indentDetail.storeInternalIndentNo = this.storeInternalIndentMaster ? this.storeInternalIndentMaster.storeInternalIndentNo : '';
    indentDetail.storeMaterialGroupCode = this.selectedGroup.gsGroupCode;
    indentDetail.gsGroupName = this.selectedGroup.gsGroupName;
    indentDetail.storeMaterialSubGroupCode = this.selectedSubGroup.gsSubGroupCode;
    indentDetail.gsSubGroupName = this.selectedSubGroup.gsSubGroupName;
    indentDetail.storeMaterialItemCode = this.selectedMaterialDetail.gsMaterialCode;
    indentDetail.gsMaterialName = this.selectedMaterialDetail.gsMaterialName;
    indentDetail.storeDeptIndentQty = this.storeInternalIndentDetailForm.controls.IndentQuantity.value;
    indentDetail.storeDeptIndentReqDate = new Date(new Date(
      this.storeInternalIndentDetailForm.controls.RequiredDate.value).toLocaleDateString());
    return indentDetail;
  }

  editIndentDetailClicked(indentDetail: StoreInternalIndentDetail) {
    if (this.isModifyOn) {
      const indentDetailToEdit = this.storeInternalIndentDetailList.find(x => x.id === indentDetail.id);
      indentDetailToEdit.isEditing = !indentDetailToEdit.isEditing;
    }
  }

  clearForm() {
    this.storeInternalIndentMasterForm.reset();
    this.storeInternalIndentDetailForm.reset();

    this.enableNew = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;

    this.isLoading = false;
    this.isFindOn = false;
    this.isModifyOn = false;
    this.disableButton = false;

    this.selectedGroup = null;
    this.selectedSubGroup = null;
    this.selectedMaterialDetail = null;
    this.selectedUOMDetail = null;
    this.storeInternalIndentMaster = null;

    this.storeInternalIndentDetailList = [];

    const loggedInUser = this.authService.getUserdetails();
    this.loggedInUserID = loggedInUser.employeeId;
    this.loggedInUserName = loggedInUser.userName;
    this.storeInternalIndentMasterForm.controls.EnteredBy.setValue(this.loggedInUserName);
    this.storeInternalIndentMasterForm.controls.IndentDate.setValue(new Date());

    this.storeInternalIndentMasterForm.disable();
    this.storeInternalIndentDetailForm.disable();
  }

  createMaterialIndent() {
    this.clearForm();
    this.storeInternalIndentMasterForm.enable();
    this.storeInternalIndentDetailForm.enable();
    this.storeInternalIndentMasterForm.controls.EnteredBy.setValue(this.loggedInUserName);
    this.storeInternalIndentMasterForm.controls.EnteredBy.disable();

    this.enableNew = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.focusIndentDate();
  }

  saveForm() {
    if (this.storeInternalIndentDetailList && this.storeInternalIndentDetailList.length > 0) {
      this.disableButton = true;
      if (this.isModifyOn) {
        this.storeInternalIndentDetailList.forEach((item, index, array) => {
          item.storeInternalIndentNo = this.storeInternalIndentMaster.storeInternalIndentNo;
          this.materialIndentByDepartmentsService.SaveMaterialIndentDetail(item).subscribe((detailResult) => {
            if (index === (array.length - 1)) {
              this.alertService.success('Material Indent saved successfully.');
              this.disableButton = false;
              this.clearForm();
            }
          });
        });
      } else {
        const indentMaster = this.getIndentMaster();
        this.materialIndentByDepartmentsService.SaveMaterialIndentMaster(indentMaster).subscribe((data) => {
          if (data.IsSucceed) {
            this.storeInternalIndentDetailList.forEach((item, index, array) => {
              item.storeInternalIndentNo = data.Data.storeInternalIndentNo;
              this.materialIndentByDepartmentsService.SaveMaterialIndentDetail(item).subscribe((detailResult) => {
                if (index === (array.length - 1)) {
                  this.alertService.success('Material Indent saved successfully.');
                  this.disableButton = false;
                  this.clearForm();
                }
              });
            });
          }
        });
      }
    }
  }

  findMaterialIndent() {
    this.isModifyOn = false;
    this.isFindOn = true;

    this.enableNew = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;

    this.storeInternalIndentMasterForm.enable();
    this.storeInternalIndentMasterForm.controls.EnteredBy.setValue(this.loggedInUserName);
    this.storeInternalIndentMasterForm.controls.EnteredBy.disable();
    this.storeInternalIndentMasterForm.controls.IndentDate.setValue(null);
    this.focusIndentDate();
  }

  modifyMaterialIndent() {
    this.isModifyOn = true;
    this.isFindOn = false;

    this.enableSave = true;
    this.enableNew = false;
    this.enableFind = false;
    this.enableModify = false;

    this.storeInternalIndentMasterForm.enable();
    this.storeInternalIndentMasterForm.controls.EnteredBy.setValue(this.loggedInUserName);
    this.storeInternalIndentMasterForm.controls.EnteredBy.disable();
    this.storeInternalIndentMasterForm.controls.IndentDate.setValue(null);
    this.focusIndentDate();
  }

  focusIndentDate() {
    setTimeout(() => {
      this.indentDate.nativeElement.focus();
    }, 50);
  }

  focusGroupName() {
    setTimeout(() => {
      this.groupName.focus();
    }, 50);
  }

  focusSaveButton() {
    setTimeout(() => {
      this.saveButton.nativeElement.focus();
    }, 50);
  }

}
