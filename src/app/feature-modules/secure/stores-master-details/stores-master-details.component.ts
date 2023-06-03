import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GSGroupDetail, GSSubGroupDetail, GSCUOMDetail, GSMaterialDetail } from './stores-master-details.model';
import { StoresMasterDetailsService } from './stores-master-details.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ApiResponse } from 'src/app/shared/models/apiResponse.model';

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
  selector: 'app-stores-master-details',
  templateUrl: './stores-master-details.component.html',
  styleUrls: ['./stores-master-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class StoresMasterDetailsComponent implements OnInit {

  isLoading: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  disableButton: boolean;

  enableNewMaterial: boolean;
  enableNewGroupName: boolean;
  enableNewSubGroupName: boolean;
  enableNewUOMDetail: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  createMaterialMode: boolean;
  createGroupNameMode: boolean;
  createSubGroupNameMode: boolean;

  existingGroupNameError: boolean;
  existingSubGroupNameError: boolean;
  existingUOMDetailError: boolean;
  existingMaterialNameError: boolean;
  selectedGroupNameCode: number;
  modifyMaterialDetail: GSMaterialDetail;

  loggedInUserName: string;
  loggedInUserID: string;

  groupDetailList: GSGroupDetail[];
  subGroupDetailList: GSSubGroupDetail[];
  uomDetailList: GSCUOMDetail[];
  materialDetailList: GSMaterialDetail[];

  selectedGroup: GSGroupDetail;
  selectedSubGroup: GSSubGroupDetail;
  selectedUOMDetail: GSCUOMDetail;

  materialDetailForm = new FormGroup({
    GSEntryDate: new FormControl('', [Validators.required]),
    EnteredBy: new FormControl('', [Validators.required]),
    GroupName: new FormControl('', [Validators.required]),
    SubGroupName: new FormControl('', [Validators.required]),
    UOMDetail: new FormControl('', [Validators.required]),
    GSMaterialName: new FormControl('', [Validators.required]),
    GSMaterialDesc: new FormControl('', [Validators.required]),
    PackingSizeUnit: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    QtyPerPackUnit: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    Location: new FormControl(''),
    ROLQuantity: new FormControl('', [Validators.pattern(/^(?:\d{0,7}\.\d{1,3})$|^\d{0,3}$/)]),
    HSNCode: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
    IGSTRate: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    CGSTRate: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    SGSTRate: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    OpeningStock: new FormControl(''),
    NoOfPackageUnits: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    OpeningStockQuantity: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,3})$|^\d{0,3}$/)]),
    RateRate: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    OpeningStockValue: new FormControl('', [Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
  });

  @ViewChild('gsMaterialName', { static: false }) gsMaterialName: ElementRef;
  @ViewChild('gsEntryDate', { static: false }) gsEntryDate: ElementRef;
  @ViewChild('groupName', { static: false }) groupName: ElementRef;
  @ViewChild('subGroupName', { static: false }) subGroupName: ElementRef;
  @ViewChild('uomDetail', { static: false }) uomDetail: ElementRef;

  constructor(public authService: AuthenticationService, private alertService: AlertService,
              private storesMasterDetailService: StoresMasterDetailsService) { }

  ngOnInit() {

    this.clearForm();

    this.materialDetailForm.controls.GroupName.valueChanges.pipe(
      map(a => {
        if (a && !this.createGroupNameMode) {
          return a.toString().trim();
        } else {
          return '';
        }
      }),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.storesMasterDetailService.GetStoresMasterGroupByName(value)
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      if (m.IsSucceed) {
        this.groupDetailList = m.Data;
      } else {
        this.groupDetailList = [];
      }
    });

    this.materialDetailForm.controls.SubGroupName.valueChanges.pipe(
      map(a => {
        if (this.selectedGroup) {
          this.selectedGroupNameCode = this.selectedGroup.gsGroupCode;
        } else {
          this.selectedGroupNameCode = 0;
        }

        if (a && !this.createSubGroupNameMode) {
          return a.toString().trim();
        } else {
          return '';
        }
      }),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.storesMasterDetailService.GetStoresMasterSubGroupByName(value, this.selectedGroupNameCode)
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      if (m.IsSucceed) {
        this.subGroupDetailList = m.Data;
      } else {
        this.subGroupDetailList = [];
      }
    });

    this.materialDetailForm.controls.UOMDetail.valueChanges.pipe(
      map(a => {
        if (a) {
          return a.toString().trim();
        } else {
          return '';
        }
      }),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.storesMasterDetailService.GetStoresMasterUOMByName(value)
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      if (m.IsSucceed) {
        this.uomDetailList = m.Data;
      } else {
        this.uomDetailList = [];
      }
    });

    this.materialDetailForm.controls.GSMaterialName.valueChanges.pipe(
      map(a => {
        if (a && (this.isFindOn || this.isModifyOn)) {
          return a.toString().trim();
        } else {
          return '';
        }
      }),
      debounceTime(300),
      tap(() => {
        if (this.isFindOn || this.isModifyOn) {
          this.isLoading = true;
        }
      }),
      switchMap(value => this.storesMasterDetailService.GetStoresMasterMaterialByName(value,
        this.getgroupCode(), this.getSubGroupCode())
        .pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(m => {
      if (this.isFindOn || this.isModifyOn) {
        if (m.IsSucceed) {
          this.materialDetailList = m.Data;
        } else {
          this.materialDetailList = [];
        }
      }
    });

  }

  optionSelectedGroup(event) {
    const groupDetail = this.groupDetailList.find(x => x.gsGroupCode === event.option.value);
    this.selectedGroup = groupDetail;
    this.materialDetailForm.controls.GroupName.setValue(groupDetail.gsGroupName);
  }

  optionSelectedSubGroup(event) {
    const subGroupDetail = this.subGroupDetailList.find(x => x.gsSubGroupCode === event.option.value);
    this.selectedSubGroup = subGroupDetail;
    this.materialDetailForm.controls.SubGroupName.setValue(subGroupDetail.gsSubGroupName);
  }

  optionSelectedUOMDetail(event) {
    const uomDetail = this.uomDetailList.find(x => x.gscUomCode === event.option.value);
    this.selectedUOMDetail = uomDetail;
    this.materialDetailForm.controls.UOMDetail.setValue(uomDetail.gscUomName);
  }

  optionSelectedMaterial(event) {
    const material = this.materialDetailList.find(x => x.gsMaterialCode === event.option.value);
    this.setMaterialDetails(material);
    if (this.isFindOn) {
      this.materialDetailForm.disable();
    } else if (this.isModifyOn) {
      this.materialDetailForm.enable();
      this.materialDetailForm.controls.EnteredBy.disable();
      this.focusGSEntryDate();
    }
  }

  getgroupCode() {
    if (this.selectedGroup) {
      return this.selectedGroup.gsGroupCode;
    } else {
      return 0;
    }
  }

  getSubGroupCode() {
    if (this.selectedSubGroup) {
      return this.selectedSubGroup.gsSubGroupCode;
    } else {
      return 0;
    }
  }

  groupNameBlur() {
    if (this.createGroupNameMode) {
      this.existingGroupNameError = false;
      this.disableButton = true;
      const groupName = this.materialDetailForm.controls.GroupName.value;
      this.storesMasterDetailService.IsStoresMasterGroupExists(groupName).subscribe((data: ApiResponse<boolean>) => {
        if (data.IsSucceed) {
          this.existingGroupNameError = data.Data;
        } else {
          this.existingGroupNameError = false;
        }
        this.disableButton = false;
      });
    }
  }

  subGroupNameBlur() {
    if (this.createSubGroupNameMode) {
      this.existingSubGroupNameError = false;
      this.disableButton = true;

      if (!this.selectedGroup) {
        this.selectedGroup = new GSGroupDetail();
        this.selectedGroup.gsGroupCode = 0;
      }

      const subGroup = this.materialDetailForm.controls.SubGroupName.value;
      const groupCode = 0;
      this.storesMasterDetailService.IsStoresMasterSubGroupExists(subGroup, groupCode).subscribe((data: ApiResponse<boolean>) => {
        if (data.IsSucceed) {
          this.existingSubGroupNameError = data.Data;
        } else {
          this.existingSubGroupNameError = false;
        }
        this.disableButton = false;
      });
    }
  }

  materialNameBlur() {
    if (this.createMaterialMode) {
      this.existingMaterialNameError = false;
      this.disableButton = true;
      const materialName = this.materialDetailForm.controls.GSMaterialName.value;
      this.storesMasterDetailService.IsStoresMasterMaterialExists(materialName).subscribe((data: ApiResponse<boolean>) => {
        if (data.IsSucceed && (this.modifyMaterialDetail && materialName !== this.modifyMaterialDetail.gsMaterialName)) {
          this.existingMaterialNameError = data.Data;
        } else {
          this.existingMaterialNameError = false;
        }
        this.disableButton = false;
      });
    }
  }

  getMaterialDetails() {
    const materialDetails = new GSMaterialDetail();
    if (this.isModifyOn && this.modifyMaterialDetail) {
      materialDetails.gsMaterialCode = this.modifyMaterialDetail.gsMaterialCode;
    } else if (this.createMaterialMode) {
      materialDetails.gsMaterialCode = 0;
    }
    materialDetails.gsEntryDate = this.materialDetailForm.controls.GSEntryDate.value;
    materialDetails.employeeID = this.loggedInUserID;
    materialDetails.gsGroupCode = this.selectedGroup.gsGroupCode;
    materialDetails.gsSubGroupCode = this.selectedSubGroup.gsSubGroupCode;
    if (this.selectedUOMDetail) {
      materialDetails.gscUOMCode = this.selectedUOMDetail.gscUomCode;
    } else {
      materialDetails.gscUOMName = this.materialDetailForm.controls.UOMDetail.value;
    }
    materialDetails.gsMaterialName = this.materialDetailForm.controls.GSMaterialName.value;
    materialDetails.gsMaterialDesc = this.materialDetailForm.controls.GSMaterialDesc.value;
    materialDetails.packingSizeUnit = this.materialDetailForm.controls.PackingSizeUnit.value;
    materialDetails.qtyPerPackUnit = this.materialDetailForm.controls.QtyPerPackUnit.value;
    materialDetails.location = this.materialDetailForm.controls.Location.value;
    materialDetails.rolQuantity = this.materialDetailForm.controls.ROLQuantity.value;
    materialDetails.hsnCode = this.materialDetailForm.controls.HSNCode.value;
    materialDetails.igstRate = this.materialDetailForm.controls.IGSTRate.value;
    materialDetails.cgstRate = this.materialDetailForm.controls.CGSTRate.value;
    materialDetails.sgstRate = this.materialDetailForm.controls.SGSTRate.value;
    materialDetails.openingStock = this.materialDetailForm.controls.OpeningStock.value;
    materialDetails.noOfPackageUnits = this.materialDetailForm.controls.NoOfPackageUnits.value;
    materialDetails.openingStockQuantity = this.materialDetailForm.controls.OpeningStockQuantity.value;
    materialDetails.rateRate = this.materialDetailForm.controls.RateRate.value;
    materialDetails.openingStockValue = this.materialDetailForm.controls.OpeningStockValue.value;
    return materialDetails;
  }

  setMaterialDetails(materialDetails: GSMaterialDetail) {
    this.modifyMaterialDetail = materialDetails;
    this.materialDetailForm.controls.GroupName.setValue(materialDetails.gsGroupName);
    this.selectedGroup = new GSGroupDetail();
    this.selectedGroup.gsGroupCode = materialDetails.gsGroupCode;
    this.selectedGroup.gsGroupName = materialDetails.gsGroupName;

    this.materialDetailForm.controls.SubGroupName.setValue(materialDetails.gsSubGroupName);
    this.selectedSubGroup = new GSSubGroupDetail();
    this.selectedSubGroup.gsSubGroupCode = materialDetails.gsSubGroupCode;
    this.selectedSubGroup.gsSubGroupName = materialDetails.gsSubGroupName;
    this.selectedSubGroup.gsGroupCode = this.selectedGroup.gsGroupCode;
    this.selectedSubGroup.gsGroupName = this.selectedGroup.gsGroupName;

    this.materialDetailForm.controls.UOMDetail.setValue(materialDetails.gscUOMName);
    this.selectedUOMDetail = new GSCUOMDetail();
    this.selectedUOMDetail.gscUomCode = materialDetails.gscUOMCode;
    this.selectedUOMDetail.gscUomName = materialDetails.gscUOMName;

    this.materialDetailForm.controls.GSMaterialName.setValue(materialDetails.gsMaterialName);
    this.materialDetailForm.controls.GSMaterialDesc.setValue(materialDetails.gsMaterialDesc);
    this.materialDetailForm.controls.PackingSizeUnit.setValue(materialDetails.packingSizeUnit);
    this.materialDetailForm.controls.QtyPerPackUnit.setValue(materialDetails.qtyPerPackUnit);
    this.materialDetailForm.controls.Location.setValue(materialDetails.location);
    this.materialDetailForm.controls.ROLQuantity.setValue(materialDetails.rolQuantity);
    this.materialDetailForm.controls.HSNCode.setValue(materialDetails.hsnCode);
    this.materialDetailForm.controls.IGSTRate.setValue(materialDetails.igstRate);
    this.materialDetailForm.controls.CGSTRate.setValue(materialDetails.cgstRate);
    this.materialDetailForm.controls.SGSTRate.setValue(materialDetails.sgstRate);
    this.materialDetailForm.controls.OpeningStock.setValue(materialDetails.openingStock);
    this.materialDetailForm.controls.NoOfPackageUnits.setValue(materialDetails.noOfPackageUnits);
    this.materialDetailForm.controls.OpeningStockQuantity.setValue(materialDetails.openingStockQuantity);
    this.materialDetailForm.controls.RateRate.setValue(materialDetails.rateRate);
    this.materialDetailForm.controls.OpeningStockValue.setValue(materialDetails.openingStockValue);
  }

  createGroup() {
    this.clearForm();
    this.materialDetailForm.disable();
    this.materialDetailForm.controls.GroupName.enable();

    this.enableNewMaterial = false;
    this.enableNewGroupName = false;
    this.enableNewSubGroupName = false;
    this.enableNewUOMDetail = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.isModifyOn = false;
    this.isFindOn = false;

    this.createMaterialMode = false;
    this.createGroupNameMode = true;
    this.createSubGroupNameMode = false;

    this.focusGroupName();
  }

  createSubGroup() {
    this.clearForm();
    this.materialDetailForm.disable();
    this.materialDetailForm.controls.GroupName.enable();
    this.materialDetailForm.controls.SubGroupName.enable();

    this.enableNewMaterial = false;
    this.enableNewGroupName = false;
    this.enableNewSubGroupName = false;
    this.enableNewUOMDetail = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.isModifyOn = false;
    this.isFindOn = false;

    this.createMaterialMode = false;
    this.createGroupNameMode = false;
    this.createSubGroupNameMode = true;

    this.focusGroupName();
  }

  createUOMDetail() {
    this.clearForm();
    this.materialDetailForm.disable();
    this.materialDetailForm.controls.UOMDetail.enable();

    this.enableNewMaterial = false;
    this.enableNewGroupName = false;
    this.enableNewSubGroupName = false;
    this.enableNewUOMDetail = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.isModifyOn = false;
    this.isFindOn = false;

    this.createMaterialMode = false;
    this.createGroupNameMode = false;
    this.createSubGroupNameMode = false;

    this.focusUOMDetail();
  }

  createMaterial() {
    this.clearForm();
    this.materialDetailForm.enable();
    this.materialDetailForm.controls.EnteredBy.disable();

    this.enableNewMaterial = false;
    this.enableNewGroupName = false;
    this.enableNewSubGroupName = false;
    this.enableNewUOMDetail = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.isModifyOn = false;
    this.isFindOn = false;

    this.createMaterialMode = true;
    this.createGroupNameMode = false;
    this.createSubGroupNameMode = false;

    this.focusGSEntryDate();
  }

  saveForm() {
    if (this.createMaterialMode) {
      this.disableButton = true;
      const materialDetail = this.getMaterialDetails();

      if (!this.selectedUOMDetail) {
        const uomDetail = new GSCUOMDetail();
        uomDetail.gscUomCode = 0;
        uomDetail.gscUomName = this.materialDetailForm.controls.UOMDetail.value;
        this.storesMasterDetailService.SaveStoresMasterUOM(uomDetail).subscribe((data: ApiResponse<GSCUOMDetail>) => {
          if (data.IsSucceed) {
            this.selectedUOMDetail = data.Data;
            this.saveForm();
          }
        });
      } else {
        this.storesMasterDetailService.SaveStoresMasterMaterial(materialDetail).subscribe((data: ApiResponse<GSMaterialDetail>) => {
          if (data.IsSucceed) {
            this.alertService.success('Material Details Saved Successfully');
            this.clearForm();
          }
          this.disableButton = false;
        });
      }
      return;
    } else if (this.createGroupNameMode) {
      this.disableButton = true;
      const groupDetails = new GSGroupDetail();
      groupDetails.gsGroupCode = 0;
      groupDetails.gsGroupName = this.materialDetailForm.controls.GroupName.value;
      this.storesMasterDetailService.SaveStoresMasterGroup(groupDetails).subscribe((data: ApiResponse<GSGroupDetail>) => {
        if (data.IsSucceed) {
          this.alertService.success('Group Details Saved Successfully');
          this.clearForm();
        }
        this.disableButton = false;
      });
    } else if (this.createSubGroupNameMode && this.selectedGroup) {
      this.disableButton = true;
      const subGroupDetails = new GSSubGroupDetail();
      subGroupDetails.gsSubGroupCode = 0;
      subGroupDetails.gsSubGroupName = this.materialDetailForm.controls.SubGroupName.value;
      subGroupDetails.gsGroupCode = this.selectedGroup.gsGroupCode;
      this.storesMasterDetailService.SaveStoresMasterSubGroup(subGroupDetails).subscribe((data: ApiResponse<GSGroupDetail>) => {
        if (data.IsSucceed) {
          this.alertService.success('Sub Group Details Saved Successfully');
          this.clearForm();
        }
        this.disableButton = false;
      });
    }
  }

  findMaterial() {
    this.isModifyOn = false;
    this.isFindOn = true;

    this.enableNewMaterial = false;
    this.enableNewGroupName = false;
    this.enableNewSubGroupName = false;
    this.enableNewUOMDetail = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;

    this.createMaterialMode = false;
    this.createGroupNameMode = false;
    this.createSubGroupNameMode = false;

    this.materialDetailForm.controls.GroupName.enable();
    this.materialDetailForm.controls.SubGroupName.enable();
    this.materialDetailForm.controls.GSMaterialName.enable();
    this.focusGroupName();
  }

  modifyMaterial() {
    this.isModifyOn = true;
    this.isFindOn = false;

    this.enableNewMaterial = false;
    this.enableNewGroupName = false;
    this.enableNewSubGroupName = false;
    this.enableNewUOMDetail = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;

    this.createMaterialMode = true;
    this.createGroupNameMode = false;
    this.createSubGroupNameMode = false;

    this.materialDetailForm.controls.GroupName.enable();
    this.materialDetailForm.controls.SubGroupName.enable();
    this.materialDetailForm.controls.GSMaterialName.enable();
    this.focusGroupName();
  }

  clearForm() {
    this.materialDetailForm.reset();
    this.enableNewMaterial = true;
    this.enableNewGroupName = true;
    this.enableNewSubGroupName = true;
    this.enableNewUOMDetail = true;
    this.enableSave = false;
    this.enableFind = true;
    this.enableModify = true;

    this.isFindOn = false;
    this.isModifyOn = false;
    this.disableButton = false;

    this.createMaterialMode = false;
    this.createGroupNameMode = false;
    this.createSubGroupNameMode = false;

    this.existingGroupNameError = false;
    this.existingSubGroupNameError = false;
    this.existingUOMDetailError = false;
    this.existingMaterialNameError = false;

    this.modifyMaterialDetail = null;

    this.groupDetailList = [];
    this.subGroupDetailList = [];
    this.uomDetailList = [];
    this.materialDetailList = [];

    this.selectedGroup = null;
    this.selectedSubGroup = null;
    this.selectedUOMDetail = null;

    const loggedInUser = this.authService.getUserdetails();
    this.loggedInUserID = loggedInUser.employeeId;
    this.loggedInUserName = loggedInUser.userName;
    this.materialDetailForm.controls.EnteredBy.setValue(this.loggedInUserName);
    this.materialDetailForm.controls.GSEntryDate.setValue(new Date());

    this.materialDetailForm.disable();
  }

  focusGSMaterialName() {
    setTimeout(() => {
      this.gsMaterialName.nativeElement.focus();
    }, 50);
  }

  focusGSEntryDate() {
    setTimeout(() => {
      this.gsEntryDate.nativeElement.focus();
    }, 50);
  }

  focusGroupName() {
    setTimeout(() => {
      this.groupName.nativeElement.focus();
    }, 50);
  }

  focusSubGroupName() {
    setTimeout(() => {
      this.subGroupName.nativeElement.focus();
    }, 50);
  }

  focusUOMDetail() {
    setTimeout(() => {
      this.uomDetail.nativeElement.focus();
    }, 50);
  }

}

