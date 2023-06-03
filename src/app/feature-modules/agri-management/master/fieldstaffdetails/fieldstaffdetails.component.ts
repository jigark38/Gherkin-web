import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FielldStaffDetailsService } from './fielld-staff-details.service';
import { AlertService } from '../../../../corecomponents/alert/alert.service';
import { Field, Staff, FieldStaffModel, EmployeeDetl } from './fieldstaffdetails.model';
import { ModalService } from '../../../../corecomponents/modal/modal.service';
import { MatSelect } from '@angular/material';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'DD-MM-YYYY',
//   },
//   display: {
//     dateInput: 'DD-MM-YYYY',
//     monthYearLabel: 'MM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MM YYYY',
//   },
// };

@Component({
  selector: 'app-fieldstaffdetails',
  templateUrl: './fieldstaffdetails.component.html',
  styleUrls: ['./fieldstaffdetails.component.css'],
  providers: [],
})


export class FieldstaffdetailsComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
    private fielldStaffDetailsService: FielldStaffDetailsService,
    private alertService: AlertService,
    private modalService: ModalService) { }

  @ViewChild('DepartmentDDL', { static: false }) departmentDDL: MatSelect;
  @ViewChild('AreaDDL', { static: false }) areaDDL: MatSelect;
  @ViewChild('YesBtn', { static: false }) yesBtnEle: ElementRef;
  @ViewChild('SaveBtn', { static: false }) saveBtnEle: ElementRef;

  fieldStaffForm: FormGroup;
  staffArray: Array<Staff> = [];
  allEmployeList: Array<EmployeeDetl> = [];
  allDesgList: any;
  employeList: Array<EmployeeDetl> = [];
  staffTypeArray = ['incharge', 'Field Staff'];
  currentDate = new Date();
  populatedFieldstaffData: any;
  addNewStaffClcked = false;
  findStaffClicked = false;
  modifyStaffClicked = false;
  addingNewStaff = false;
  submitted = false;
  isPopulate = false;
  areaList: any;
  deprtList: any;
  subDeptList: any;
  desginationList: any;
  disblFIeldstaffBtn = false;
  disblFindBtn = false;
  disblModifyBtn = false;
  NoClicked = false;
  datePattern = '/^(?:(?:31(-)(?:0?[13578]|1[02]))\/1|(?:(?:29|30)(-)(?:0?[13-9]|1[0-2])\/2))(?:(?:1[6-9]|[2-9]\/d)?\/d{2})$|^(?:29(-)0?2\/3(?:(?:(?:1[6-9]|[2-9]\/d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\/d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\/4(?:(?:1[6-9]|[2-9]\/d)?\/d{2})$/';
  employeeId: string;
  employeeName: string;

  ngOnInit() {
    this.fieldStaffForm = new FormGroup({
      dateOfEntry: new FormControl({ value: null }, Validators.required),
      loginUserName: new FormControl({ value: null }, Validators.required),
      areaID: new FormControl({ value: null }, Validators.required),
      fieldStaffs: new FormGroup({
        departmentCode: new FormControl({ value: null }, Validators.required),
        subDepartmentCode: new FormControl({ value: null }, Validators.required),
        designationCode: new FormControl({ value: null }, Validators.required),
        staffType: new FormControl({ value: null }, Validators.required),
        employeeID: new FormControl({ value: null }, Validators.required),
        effectiveDate: new FormControl({ value: null }, [Validators.required]),
      })
    });
    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;
    this.fieldStaffForm.reset();
    this.fieldStaffForm.disable();
  }


  resetForm() {
    this.fieldStaffForm.reset();
    this.staffArray = new Array<FieldStaffModel>();
    this.fieldStaffForm.disable();
    this.GetArea();
    this.GetDepartment();
    this.GetAllEmployee();
    this.GetAllDesignation();
    this.addNewStaffClcked = false;
    this.submitted = false;
    this.addingNewStaff = false;
    this.findStaffClicked = false;
    this.modifyStaffClicked = false;
    this.isPopulate = false;
    this.disblFIeldstaffBtn = false;
    this.disblFindBtn = false;
    this.disblModifyBtn = false;
    this.NoClicked = false;
  }

  onClickNewFieldStaff() {
    this.resetForm();
    this.addNewStaffClcked = true;
    this.fieldStaffForm.enable();
    this.fieldStaffForm.controls.dateOfEntry.setValue(this.currentDate);
    this.fieldStaffForm.controls.loginUserName.setValue(this.employeeName.toUpperCase());
    this.fieldStaffForm.get('dateOfEntry').disable();
    this.fieldStaffForm.get('loginUserName').disable();
    this.areaDDL.focus();
    this.isPopulate = false;
    this.disblFIeldstaffBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
  }

  GetArea() {
    this.areaList = null;
    this.fielldStaffDetailsService.getArea().subscribe(res => {
      this.areaList = res;
    },
      error => {
        this.alertService.error('Error while getting area!');
      });
  }

  GetDepartment() {
    this.deprtList = [];
    this.fielldStaffDetailsService.getDepartment().subscribe(res => {
      this.deprtList = res;
    },
      error => {
        this.alertService.error('Error while getting department!');
      });
  }

  GetSubDept(deptCode) {
    this.subDeptList = [];
    if (deptCode) {
      this.fielldStaffDetailsService.getSubDepartment(deptCode).subscribe(res => {
        this.subDeptList = res;
      },
        error => {
          this.alertService.error('Error while getting Sub departments!');
        });
    }
  }

  GetDesigination(subDept) {
    this.desginationList = [];
    if (subDept) {
      this.fielldStaffDetailsService.getDesgBySubDeprt(subDept).subscribe(res => {
        this.desginationList = res;
      },
        error => {
          this.alertService.error('Error while getting desigination!');
        });
    }
  }

  GetAllEmployee() {
    this.fielldStaffDetailsService.getAllEmployee().subscribe(res => {
      this.allEmployeList = res;
    },
      error => {
        this.alertService.error('Error while getting all employee!');
      });
  }
  GetAllDesignation() {
    this.fielldStaffDetailsService.getAllDesignation().subscribe(res => {
      this.allDesgList = res;
    },
      error => {
        this.alertService.error('Error while getting all designation!');
      });
  }

  GetEmpByDesg(desg) {
    try {
      if (desg) {
        this.employeList = new Array<EmployeeDetl>();
        this.fielldStaffDetailsService.getEmployeByDesg(desg).subscribe(res => {
          for (const item of res) {
            const emp = new EmployeeDetl();
            emp.employeeId = item.employeeId;
            emp.employeeName = item.employeeName;
            emp.departmentCode = item.departmentCode;
            emp.subDepartmentCode = item.subDepartmentCode;
            emp.designationCode = item.designationCode;
            this.employeList.push(emp);
          }
        },
          error => {
            this.alertService.error('Error while fetching Emoployee!');
          });
      }
    } catch (error) {
      console.log('error in  get employee by desg.');
    }
  }

  OnSubmit() {
    try {
      this.submitted = true;
      if (this.modifyStaffClicked) {
        const selectedarea = this.areaList.filter(
          g => g.areaId === this.fieldStaffForm.get('areaID').value
        );
        const fieldstaff = new FieldStaffModel();
        fieldstaff.dateOfEntry = this.fieldStaffForm.get('dateOfEntry').value;
        fieldstaff.areaID = this.fieldStaffForm.get('areaID').value;
        fieldstaff.employeeID = this.fieldStaffForm.get('fieldStaffs.employeeID').value;
        fieldstaff.effectiveDate = this.fieldStaffForm.get('fieldStaffs.effectiveDate').value;
        fieldstaff.staffType = this.fieldStaffForm.get('fieldStaffs.staffType').value;
        fieldstaff.loginUserName = this.fieldStaffForm.get('loginUserName').value;
        fieldstaff.departmentCode = this.fieldStaffForm.get('fieldStaffs.departmentCode').value;
        fieldstaff.subDepartmentCode = this.fieldStaffForm.get('fieldStaffs.subDepartmentCode').value;
        fieldstaff.designationCode = this.fieldStaffForm.get('fieldStaffs.designationCode').value;
        fieldstaff.areaCode = selectedarea[0].areaCode;
        fieldstaff.fieldStaffID = this.populatedFieldstaffData.fieldStaffID;
        this.fielldStaffDetailsService.updateFieldStaff(fieldstaff).subscribe(res => {
          this.alertService.success('staff data updated Successfully!');
          this.resetForm();
        },
          error => {
            this.alertService.error('Failed Updating data!');
          });
      } else if (this.NoClicked) {
        this.modalService.close('save-fieldstaff-Modal');
        const selectedarea = this.areaList.filter(
          g => g.areaId === this.fieldStaffForm.get('areaID').value
        );
        this.fieldStaffForm.enable();
        let fieldDetails = new Field();
        fieldDetails = this.fieldStaffForm.value;
        fieldDetails.areaCode = selectedarea[0].areaCode;
        fieldDetails.fieldStaffs = this.staffArray;
        this.fielldStaffDetailsService.addFieldStaff(fieldDetails).subscribe(res => {
          this.alertService.success('Added new field staff');
          this.resetForm();
        },
          error => {
            this.alertService.error('Error while adding field staff!');
          });
      }
    } catch (error) {
      console.log('Submit method failed');
    }
  }

  changeDeptCodeToName(deptCode) {
    try {
      if (this.deprtList.length > 0) {
        const dept = this.deprtList.filter(
          g => g.departmentCode.toUpperCase() === deptCode.toUpperCase()
        );
        return dept[0].departMentName;
      }
      return '';
    } catch (error) {
      console.log(error);
    }
  }

  changeDesgCodeToName(desgCode) {
    try {
      const desg = this.allDesgList.filter(
        g => g.designationCode.toUpperCase() === desgCode.toUpperCase()
      );
      return desg[0].designattionName;
    } catch (error) {
      console.log(error);
    }
  }

  changeEmpCodeToName(empCode) {
    try {
      if (empCode) {
        const emp = this.allEmployeList.filter(
          g => g.employeeId.toUpperCase() === empCode.toUpperCase()
        );
        return emp[0].employeeName;
      }
    } catch (error) {
      console.log(error);
    }
  }

  addNewFieldStaff() {
    this.addingNewStaff = true;
    this.modalService.close('save-fieldstaff-Modal');
    this.fieldStaffForm.disable();
    this.fieldStaffForm.get(['fieldStaffs']).enable();
    this.fieldStaffForm.get(['fieldStaffs', 'departmentCode']).setValue('');
    this.fieldStaffForm.get(['fieldStaffs', 'subDepartmentCode']).setValue('');
    this.fieldStaffForm.get(['fieldStaffs', 'designationCode']).setValue('');
    this.fieldStaffForm.get(['fieldStaffs', 'employeeID']).setValue('');
    this.fieldStaffForm.get(['fieldStaffs', 'staffType']).setValue('');
    this.fieldStaffForm.get(['fieldStaffs', 'effectiveDate']).setValue('');
    this.departmentDDL.focus();
  }

  onSave() {
    try {

    } catch (error) {
      console.log('Save method fail');
    }
  }

  onNo() {
    this.NoClicked = true;
    this.addNewStaffClcked = false;
    this.fieldStaffForm.disable();
    this.modalService.close('save-fieldstaff-Modal');
    this.saveBtnEle.nativeElement.focus();
  }

  onClickFindFieldStaff() {
    this.resetForm();
    this.findStaffClicked = true;
    this.fieldStaffForm.get('areaID').enable();
    this.areaDDL.focus();
    this.disblFIeldstaffBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
  }

  getfieldStaff(areaCode) {
    try {
      if (areaCode) {
        this.staffArray = new Array<FieldStaffModel>();
        if (this.findStaffClicked || this.modifyStaffClicked) {
          this.fielldStaffDetailsService.getFieldStaffByArea(areaCode).subscribe(res => {
            this.staffArray = res;
          },
            error => {
              this.alertService.error('Error while getting fieldstaff by area!');
            });
        }
      }
    } catch (error) {
      console.log('get field staff method fail');
    }
  }

  populate(fieldStaff) {
    try {
      if (this.findStaffClicked || this.modifyStaffClicked) {
        this.isPopulate = true;
        this.populatedFieldstaffData = fieldStaff;
        this.fieldStaffForm.enable();
        this.fieldStaffForm.get('dateOfEntry').setValue(fieldStaff.dateOfEntry);
        this.fieldStaffForm.get('loginUserName').setValue(fieldStaff.loginUserName);
        this.fieldStaffForm.get('areaID').setValue(fieldStaff.areaID);
        this.fieldStaffForm.get(['fieldStaffs', 'departmentCode']).setValue(fieldStaff.departmentCode);
        this.fieldStaffForm.get(['fieldStaffs', 'subDepartmentCode']).setValue(fieldStaff.subDepartmentCode);
        this.fieldStaffForm.get(['fieldStaffs', 'designationCode']).setValue(fieldStaff.designationCode);
        this.fieldStaffForm.get(['fieldStaffs', 'employeeID']).setValue(fieldStaff.employeeID);
        this.fieldStaffForm.get(['fieldStaffs', 'staffType']).setValue(fieldStaff.staffType);
        this.fieldStaffForm.get(['fieldStaffs', 'effectiveDate']).setValue(fieldStaff.effectiveDate);
        this.isPopulate = false;
        this.fieldStaffForm.disable();
        this.fieldStaffForm.get('areaID').enable();
        if (this.modifyStaffClicked) {
          this.fieldStaffForm.enable();
          this.fieldStaffForm.get('dateOfEntry').disable();
          this.fieldStaffForm.get('loginUserName').disable();
        }
      }
    } catch (error) {
      console.log('poulate method fail');
    }
  }

  onClickModify() {
    this.resetForm();
    this.modifyStaffClicked = true;
    this.fieldStaffForm.get('areaID').enable();
    this.areaDDL.focus();
    this.disblFIeldstaffBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
  }

  onBlurMethod() {
    if (this.fieldStaffForm.valid) {
      if (this.addNewStaffClcked) {
        let staffDetails = new Staff();
        staffDetails = this.fieldStaffForm.get(['fieldStaffs']).value;
        let counter = 0;
        for (const iterator of this.staffArray) {
          if (
            iterator.employeeID === staffDetails.employeeID &&
            iterator.departmentCode === staffDetails.departmentCode &&
            iterator.subDepartmentCode === staffDetails.subDepartmentCode &&
            iterator.designationCode === staffDetails.designationCode &&
            iterator.effectiveDate === staffDetails.effectiveDate) {
            counter += 1;
          }
        }
        if (counter === 0) {
          this.staffArray.push(staffDetails);
          this.modalService.open('save-fieldstaff-Modal');
          this.fieldStaffForm.get(['fieldStaffs', 'effectiveDate']).disable();
          this.yesBtnEle.nativeElement.focus();
        } else {
          this.alertService.error('Cant add same details again');
        }
      }
    }
  }

  disableSave() {
    try {
      if (
        this.modifyStaffClicked ||
        this.NoClicked) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
