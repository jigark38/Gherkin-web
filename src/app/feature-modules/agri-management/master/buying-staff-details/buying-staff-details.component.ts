import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialog, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { Department, Designation, Employee, SubDepartment } from '../fieldstaffdetails/fieldstaffdetails.model';
import { HarvestAreas } from '../../../secure/finished-semifinished-opening-stocks/finished-semifinished-opening.model';
import { UserPermissionService } from '../../../secure/user-permission/user-permission.service';
import { HarvestAreaBuyingStaffDetails } from './buying-staff-details.model';
import { BuyingStaffDetailsService } from './buying-staff-details.service';

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
  selector: 'app-buying-staff-details',
  templateUrl: './buying-staff-details.component.html',
  styleUrls: ['./buying-staff-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class BuyingStaffDetailsComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    public dialog: MatDialog,
    public buyingStaffDetailsService: BuyingStaffDetailsService,
    private alertService: AlertService,
    private userPermissionService: UserPermissionService) { }

  @ViewChild('department', { read: MatSelect, static: false }) department: MatSelect;
  @ViewChild('area', { read: MatSelect, static: false }) area: MatSelect;
  @ViewChild('saveBtn', { read: ElementRef, static: false }) saveBtn: ElementRef;

  employeeId: string;
  employeeName: string;
  isNewBuyingStaffClicked = false;
  isSaveClicked = false;
  isModifyClicked = false;
  isFindClicked = false;
  deprtList: Department[];
  subDepartmentList: SubDepartment[];
  desginationList: Designation[];
  employees: Employee[];
  harvestAreas: HarvestAreas[];
  HarvestAreaBuyingStaffList: Array<HarvestAreaBuyingStaffDetails>;
  harvestAreaBuyingStaffDetail: HarvestAreaBuyingStaffDetails;

  disblNewBuyingStaffBtn = false;
  disblSaveBtn = true;
  disblFindBtn = false;
  disblModifyBtn = false;

  buyingStaffDetailsForm: FormGroup;

  ngOnInit() {
    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.buyingStaffDetailsForm = new FormGroup({
      id: new FormControl({ value: null }),
      bsEntryDate: new FormControl({ value: null }, [Validators.required]),
      bsEnteredEmpID: new FormControl({ value: this.employeeId }, [Validators.required]),
      bsEnteredEmpName: new FormControl({ value: this.employeeName }, [Validators.required]),
      department: new FormControl({ value: null }),
      subDepartment: new FormControl({ value: null }),
      designation: new FormControl({ value: null }),
      employeeStatus: new FormControl({ value: null }, [Validators.required]),
      employeeID: new FormControl({ value: null }, [Validators.required]),
      bsEffectiveDate: new FormControl({ value: null }, [Validators.required]),
      areaID: new FormControl({ value: null }, [Validators.required]),
      areaCode: new FormControl({ value: null })
    });
    this.buyingStaffDetailsForm.reset();
    this.buyingStaffDetailsForm.disable();
    this.getDepertmentList();
    this.getHarvestAreas();
  }

  getDepertmentList() {
    this.deprtList = [];
    this.buyingStaffDetailsService.getDepartment().subscribe(res => {
      this.deprtList = res;
    },
      error => {
        this.alertService.error('Error while getting department!');
      });
  }
  getSubDepertment() {
    const depertmentId = this.buyingStaffDetailsForm.controls.department.value;
    this.buyingStaffDetailsService.getSubDepartment(depertmentId).subscribe((data: SubDepartment[]) => {
      this.subDepartmentList = data;
    },
      error => {
        this.alertService.error('Error while getting department!');
      });
  }

  GetDesigination() {
    const subDept = this.buyingStaffDetailsForm.controls.subDepartment.value;
    this.desginationList = [];
    if (subDept) {
      this.buyingStaffDetailsService.getDesgBySubDeprt(subDept).subscribe(res => {
        this.desginationList = res;
      },
        error => {
          this.alertService.error('Error while getting desigination!');
        });
    }
  }

  GetEpmByDesg() {
    const desg = this.buyingStaffDetailsForm.controls.designation.value;
    this.buyingStaffDetailsService.getEmployeByDesg(desg).subscribe(
      (result) => {
        this.employees = result;
      },
      (error) => {
        this.alertService.error('Error while getting Employee details!');
      });
  }

  getHarvestAreas() {
    this.buyingStaffDetailsService.getHarvestAreas().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.harvestAreas = res.Data;
      } else {
        this.alertService.error('Error while Fetching office harvest area!');
      }
    });
  }

  setAreaCode() {
    const areaCode = this.harvestAreas.find(a => a.areaId === this.buyingStaffDetailsForm.controls.areaID.value).areaCode;
    this.buyingStaffDetailsForm.controls.areaCode.setValue(areaCode);
    this.buyingStaffDetailsForm.controls.areaCode.disable();
    this.addMore();
  }

  addMore() {
    debugger;
    if (this.isNewBuyingStaffClicked || this.isModifyClicked) {
      this.harvestAreaBuyingStaffDetail = new HarvestAreaBuyingStaffDetails();
      this.buyingStaffDetailsForm.enable();
      this.harvestAreaBuyingStaffDetail = this.buyingStaffDetailsForm.value;
      if (this.HarvestAreaBuyingStaffList.some(a => a.areaCode === this.harvestAreaBuyingStaffDetail.areaCode)) {
        this.alertService.error('This area already added once');
        return;
      }
      var localDate = new Date(this.buyingStaffDetailsForm.controls.bsEffectiveDate.value).toLocaleDateString().toString();
      this.harvestAreaBuyingStaffDetail.bsEffectiveDate = localDate;
      if (this.harvestAreaBuyingStaffDetail.id != 0 && this.harvestAreaBuyingStaffDetail.id != null) {
        const index = this.HarvestAreaBuyingStaffList.findIndex(key => key.id == this.harvestAreaBuyingStaffDetail.id);
        if (index != undefined && index != null && index >= 0) {
          this.HarvestAreaBuyingStaffList[index].bsEffectiveDate = this.harvestAreaBuyingStaffDetail.bsEffectiveDate;
          this.HarvestAreaBuyingStaffList[index].areaCode = this.harvestAreaBuyingStaffDetail.areaCode;
          this.HarvestAreaBuyingStaffList[index].areaID = this.harvestAreaBuyingStaffDetail.areaID;

        }
      }
      else {
        this.HarvestAreaBuyingStaffList.push(this.harvestAreaBuyingStaffDetail);
      }

      this.buyingStaffDetailsForm.disable();
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do You Want to add more area?'
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this.buyingStaffDetailsForm.controls.id.setValue(null);
          this.buyingStaffDetailsForm.controls.areaID.enable();
          this.buyingStaffDetailsForm.controls.bsEffectiveDate.enable();
          this.area.focus();
        } else {
          this.disblSaveBtn = false;
          this.saveBtn.nativeElement.focus();
        }
      });
    }
  }

  OnNewBuyingStaffClick() {
    this.isNewBuyingStaffClicked = true;
    this.isSaveClicked = false;
    this.isModifyClicked = false;
    this.isFindClicked = false;
    this.HarvestAreaBuyingStaffList = new Array<HarvestAreaBuyingStaffDetails>();
    this.harvestAreaBuyingStaffDetail = new HarvestAreaBuyingStaffDetails();
    this.buyingStaffDetailsForm.controls.bsEntryDate.setValue(new Date());
    this.buyingStaffDetailsForm.controls.bsEnteredEmpName.setValue(this.employeeName);
    this.buyingStaffDetailsForm.controls.bsEnteredEmpID.setValue(this.employeeId);
    this.buyingStaffDetailsForm.enable();
    this.buyingStaffDetailsForm.controls.bsEnteredEmpName.disable();
    this.disblNewBuyingStaffBtn = true;
    this.disblSaveBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
    this.department.focus();
  }

  OnSaveClick() {
    this.isSaveClicked = true;
    this.buyingStaffDetailsForm.enable();
    if (this.buyingStaffDetailsForm.valid) {
      if (this.isModifyClicked) {
        this.isFindClicked = false;
        this.isModifyClicked = false;
        this.buyingStaffDetailsService.updateBuyingStaffDetails(this.HarvestAreaBuyingStaffList).subscribe((res: any) => {
          if (res.IsSucceed) {
            if (res.ErrorMessages != null && res.ErrorMessages.length > 0) {
              this.alertService.error(res.ErrorMessages[0]);
            }
            this.alertService.success('Buying Staff Details Updated Successfully');
            this.OnClearClick();
          } else {
            this.alertService.error('Buying Staff Details Update failed');
          }
        });
      }
      else if (this.isNewBuyingStaffClicked) {
        this.isFindClicked = false;
        this.HarvestAreaBuyingStaffList.forEach(x => x.id = 0);
        this.buyingStaffDetailsService.addBuyingStaffDetails(this.HarvestAreaBuyingStaffList).subscribe((res: any) => {
          if (res.IsSucceed) {
            if (res.ErrorMessages != null && res.ErrorMessages.length > 0) {
              this.alertService.error(res.ErrorMessages[0]);
            }
            this.alertService.success('Buying Staff Details Saved Successfully');
            this.OnClearClick();
          } else {
            this.alertService.error('Buying Staff Details Save failed');
          }
        });
      }
      //this.isNewBuyingStaffClicked = false;
      //this.isModifyClicked = false;

    }
  }

  OnFindClick() {
    this.buyingStaffDetailsForm.enable();
    this.isNewBuyingStaffClicked = false;
    this.isSaveClicked = false;
    this.isModifyClicked = false;
    this.isFindClicked = true;
    this.disblNewBuyingStaffBtn = true;
    this.disblSaveBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
    this.department.focus();
  }

  OnModifyClick() {
    this.buyingStaffDetailsForm.enable();
    this.isNewBuyingStaffClicked = false;
    this.isSaveClicked = false;
    this.isModifyClicked = true;
    this.isFindClicked = false;
    this.disblNewBuyingStaffBtn = true;
    this.disblSaveBtn = false;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
    this.department.focus();
  }

  OnClearClick() {
    this.isNewBuyingStaffClicked = false;
    this.isSaveClicked = false;
    this.isModifyClicked = false;
    this.isFindClicked = false;
    this.disblNewBuyingStaffBtn = false;
    this.disblSaveBtn = true;
    this.disblFindBtn = false;
    this.disblModifyBtn = false;
    this.buyingStaffDetailsForm.reset();
    this.buyingStaffDetailsForm.disable();
    this.HarvestAreaBuyingStaffList = new Array<HarvestAreaBuyingStaffDetails>();
  }

  findByEpmloyee() {
    if (this.isFindClicked || this.isModifyClicked) {
      const empId = this.buyingStaffDetailsForm.controls.employeeID.value;
      this.buyingStaffDetailsService.getBuyingStaffDetailsByEmployee(empId).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.HarvestAreaBuyingStaffList = res.Data;
        } else {
          this.alertService.error('Some error occured');
        }
      });
    }
  }

  deleteBuyingStaffDetails(employeeId, areaId) {
    if (this.isModifyClicked) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you want to remove this area?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteHarverArea(employeeId, areaId);
          // this.buyingStaffDetailsForm.controls.areaID.enable();
          // this.area.focus();
        }
      });
    }
  }

  deleteHarverArea(employeeId, areaId) {
    this.buyingStaffDetailsService.deleteBuyingStaffDetails(employeeId, areaId).subscribe((res: any) => {
      if (res.IsSucceed) {
        if (this.HarvestAreaBuyingStaffList.length === 1) {
          this.OnClearClick();
        } else if (this.HarvestAreaBuyingStaffList.length >= 1) {
          this.HarvestAreaBuyingStaffList = this.HarvestAreaBuyingStaffList.filter(x => x.areaID !== areaId);
        }
        this.alertService.success('Harvest area deleted successfully');
      } else {
        this.alertService.error('Some error occured');
      }
    });
  }

  getAreaCodeById(areaId) {
    return this.harvestAreas.filter(a => a.areaId === areaId)[0].areaCode;
  }

  getAreaNameById(areaId) {
    return this.harvestAreas.filter(a => a.areaId === areaId)[0].areaName;
  }

  selecetedToModify(areaDetl) {
    this.userPermissionService.getUserDetails(areaDetl.bsEnteredEmpID).subscribe((res: any) => {
      this.buyingStaffDetailsForm.patchValue(areaDetl);
      this.buyingStaffDetailsForm.controls.bsEnteredEmpName.setValue(res.userName);
      this.buyingStaffDetailsForm.controls.bsEnteredEmpID.setValue(areaDetl.bsEnteredEmpID);
      this.buyingStaffDetailsForm.controls.areaCode.setValue(this.harvestAreas.filter(a => a.areaId === areaDetl.areaID)[0].areaCode);
    });
    this.buyingStaffDetailsForm.disable();
    this.buyingStaffDetailsForm.controls.bsEffectiveDate.enable();
    this.buyingStaffDetailsForm.controls.areaID.enable();
  }

}
