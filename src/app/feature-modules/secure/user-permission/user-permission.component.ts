import * as R from 'ramda';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPermissionModel, Module, UserPermission } from './user-permissions-model';

import { MessageService } from 'primeng/api';
import { OrgLocation } from '../../organisation-details/org-off-loc-details/org-ofc-loc-model';
import { UserPermissionService } from './user-permission.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
  userPermissionForm: FormGroup;
  userPermission: UserPermission;
  authUsers: any[] = [];
  organisations: any[] = [];
  locations: OrgLocation[] = [];
  employees: any[] = [];
  modules: any[] = [];
  subMenus: any[] = [];
  subModules: any[] = [];
  departments: any[] = [];
  subDepartments: any[] = [];
  designations: any[] = [];
  userCols: any[] = [];
  userDetails: any[] = [];
  modulelist: Module[] = [];
  showPermissions = false;
  selectedModules: Module[];
  modulelistMaster: any[];
  selectedUser: any;
  disableSave = true;
  modCols: any[];
  userPermissions: any[] = [];
  actionParams: { enabled: boolean; showEdit: boolean; showDelete: boolean; };
  constructor(private userService: UserPermissionService, private formBuilder: FormBuilder, private messageService: MessageService) { }

  ngOnInit() {
    try {
      this.initData();
      this.createForm();
      this.getDropdowns();
    } catch (error) {
      console.error('error on ngOnInit', error);
    }
  }
  initData() {
    this.userPermission = new UserPermission();
    this.userCols = [
      { field: 'dateOfPermission', header: 'Date of Permission', width: '100px' },
      { field: 'departmentName', header: 'Department', width: '100px' },
      { field: 'subdepartmentName', header: 'Sub Department' },
      { field: 'employeeName', header: 'Employee Name' },
      { field: 'userName', header: 'User Name' }
    ];
    this.modCols = [
      { field: 'moduleName', header: 'Module Name', }];
    this.actionParams = { enabled: true, showEdit: true, showDelete: false };
  }
  createForm() {
    try {
      this.userPermissionForm = this.formBuilder.group({
        ...this.userPermission
      });

      this.userPermissionForm.controls.dateofPermission.disable();
      this.userPermissionForm.get('authorisedBy').setValidators([Validators.required]);
      this.userPermissionForm.get('employeeId').setValidators([Validators.required]);
      this.userPermissionForm.get('userName').setValidators([Validators.required]);
      this.userPermissionForm.get('password').setValidators([Validators.required]);
      this.userPermissionForm.get('confirmPassword').setValidators([Validators.required, this.checkPasswords.bind(this)]);
    } catch (error) {
      console.error('Error on createForm:', error);
    }
  }

  getDropdowns() {
    try {
      this.getAllUsers();
      this.getApprovers();
      this.getOrganisations();
      this.getModules();
      this.getDepartments();
    } catch (error) {
      console.error('error on fetching dropdwons', error);
    }
  }
  getCustomers() {
    try {
      this.userService.getAllCustomers()
        .subscribe(res => {
          this.employees = res;
        }, err => {
          console.error('error on fetching getOrganisations', err);
        });
    } catch (error) {
    }
  }
  getApprovers() {
    this.userService.getApprovers()
      .subscribe(res => {
        this.authUsers = res;
      }, err => {
        console.error('error on fetching getOrganisations', err);
      });
  }
  getOrganisations() {
    this.userService.getOrganisationDetails()
      .subscribe(res => {
        this.organisations = res;
      }, err => {
        console.error('error on fetching getOrganisations', err);
      });
  }
  async getEmployees(desgCode: any) {
    this.employees = await this.userService.getEmployees(desgCode).toPromise();
  }
  changeOrg(event: any) {
    try {
      console.log('event', event);
      this.getLocations(event.value);
    } catch (error) {
      console.error('error on changeOrg', error);
    }
  }
  async getLocations(orgCode: any) {
    try {
      this.locations = await this.userService.getLocationsbyOrgid(orgCode).toPromise();
      // .subscribe(res => {
      //   this.locations = res;
      // }, err => {
      //   console.error('error on getLocationsbyOrgid');

      // });
    } catch (error) {
      console.error('error on getLocations', error);

    }
  }
  getModules() {
    try {
      this.userService.getModules()
        .subscribe(res => {
          this.modules = R.sortBy(R.prop('moduleName'), R.uniq(res));
        }, err => {
          console.error('error on getModules');

        });
    } catch (error) {
      console.error('error on getLocations', error);

    }
  }
  getDepartments() {
    try {
      this.userService.getDepartments()
        .subscribe(res => {
          this.departments = res;
        }, err => {
          console.error('error on getDepartments');

        });
    } catch (error) {
      console.error('error on getLocations', error);

    }
  }

  getAllUsers() {
    this.userService.getAllUsers()
      .subscribe(res => {
        this.userDetails = res;
      }, err => {
        console.error('error on getAllUsers', err);

      });
  }
  changeModule(event: any) {
    try {
      this.getSubMenusbyId(event.value);
      this.subModules = [];
    } catch (error) {
      console.error('error on changeModule', error);
    }
  }
  getSubMenusbyId(moduleId: any) {
    try {
      this.userService.getSubMenus(moduleId)
        .subscribe(res => {
          this.subMenus = res;
          if (this.subMenus.length === 0) {
            this.getPermissionsbyMenuid(moduleId, 0);
          } else {
            this.clearPermissions();
          }
        }, err => {
          console.error('error on getSubMenus');

        });
    } catch (error) {
      console.error('error on getSubMenusbyId', error);

    }
  }
  getSubModulesbyId(moduleId: any) {
    try {
      this.userService.getSubModulesbyModId(moduleId)
        .subscribe(res => {
          this.subModules = res;
          this.getPermissionsbyMenuid(this.userPermissionForm.controls.moduleId.value, moduleId);
        }, err => {
          console.error('error on getSubModulesbyId');

        });
    } catch (error) {
      console.error('error on getSubModulesbyId', error);

    }
  }
  async getSubdepartments(deptCode: any) {
    this.subDepartments = await this.userService.getSubDepartments(deptCode).toPromise();
    // .subscribe(res => {
    //    = res;
    // }, err => {
    //   console.error('error on getSubDepartments');

    // });
  }
  async getDesignations(deptCode: any) {
    this.designations = await this.userService.getDesignations(deptCode).toPromise();
    // .subscribe(res => {
    //   this.designations = res;
    // }, err => {
    //   console.error('error on getDesignations');

    // });
  }
  changeDept(event: any) {
    this.getSubdepartments(event.value);
    this.clearCascadeDropDowns('Dept');
  }
  changeSubDept(event: any) {
    this.getDesignations(event.value);
    this.clearCascadeDropDowns('SubDept');
  }
  changeDesignation(event: any) {
    this.getEmployees(event.value);
  }
  changeSubMenu(submenu: any) {
    this.getSubModulesbyId(submenu.value);
  }
  changeEmployee(employee: any) {
    this.getUserDetails(employee.value);
    this.clearModuleGrids();
    if (this.userPermissionForm.controls.moduleId.value) {
      this.getPermissionsbyMenuid(this.userPermissionForm.controls.moduleId);
    }
  }
  clearCascadeDropDowns(control: any) {
    if (control === 'Dept') {
      this.subDepartments = [];
      this.designations = [];
      this.employees = [];
      this.userPermissionForm.patchValue({ subDepartmentId: undefined, designation: undefined, employeeId: undefined });
    } else if (control === 'SubDept') {
      this.designations = [];
      this.employees = [];
      this.userPermissionForm.patchValue({ designation: undefined, employeeId: undefined });
    }
    this.userPermissionForm.controls.employeeId.markAsUntouched();
    this.clearUserDetails();
  }
  clearControls() {
    this.createForm();
    this.locations = this.subDepartments = this.designations = this.employees = this.subModules
      = [];
    this.disableSave = true;
    this.userPermissions = [];
    this.clearPermissions();
  }


  getPermissionsbyMenuid(modId: any, menuID: any = 0) {
    const data: IPermissionModel = this.userPermissionForm.value;
    if (!(data.userId && data.locationId && data.organisationId)) {
      return;
    }
    this.userService.getPermissionsbyMenuid(this.userPermissionForm.value)
      .subscribe(res => {
        this.modulelist = res;
        if (res && res.length > 0) {
          this.selectedModules = this.modulelist.filter(a => a.isSelected);
          this.modulelistMaster = this.modulelist;
        }
      }, err => {
        console.error('error on getPermissions', err);
      });
  }

  checkPasswords(control: FormControl) {
    try {
      const confirmPassword: string = control.value;
      if (confirmPassword) {
        if (confirmPassword !== this.userPermissionForm.get('password').value) {
          return { error: 'Password and confirm-password mismatch' };
        }
        return null;
      } else {
        return { error: 'Confirm password is required' };
      }
    } catch (error) {
      console.error('Error on checkPasswords:', error);
    }
  }
  createUser() {
    try {
      if (this.userPermissionForm.invalid) {
        this.userPermissionForm.markAllAsTouched();
        return;
      }
      const userData = this.userPermissionForm.value;
      const existingUser = this.userDetails.filter(e => e.userName === userData.userName).length;
      if (existingUser > 0) {
        this.showError('User Name already exists');
        return;
      }

      this.userService.createUser(userData)
        .subscribe(res => {
          this.getAllUsers();
          // this.clearControls();
          this.showSuccess('user Created Successfully');
          this.userPermissionForm.patchValue({
            employeeId: undefined, userName: undefined, userId: undefined,
            password: undefined, confirmPassword: undefined
          });
          this.userPermissionForm.controls.employeeId.markAsUntouched();
          this.userPermissionForm.controls.userName.markAsUntouched();
          this.userPermissionForm.controls.password.markAsUntouched();
          this.userPermissionForm.controls.confirmPassword.markAsUntouched();
          console.log('create user response', res);

        }, err => {
          this.showError('user creation failed');
          console.error('error while creating user', err);

        });
    } catch (error) {

    }
  }
  public get isNewUserEnabled() {
    if (!this.userPermissionForm.value.userId) {
      return true;
    }
    return false;
  }
  addPermissions() {
    try {
      if (!this.modulelist || this.modulelist.length === 0) {
        this.showError('No modules to save.');
        return;
      }
      const selectedIds = this.selectedModules.map(a => a.id);
      this.modulelist.forEach(a => {
        a.isSelected = selectedIds.indexOf(a.id) > -1;
      });
      if (this.modulelistMaster === this.selectedModules) {
        this.showError('There are no changes to save.');
        return;
      }
      const userData = this.userPermissionForm.value;
      const permissions = {
        userId: userData.userId,
        officeLocation: userData.locationId,
        selected: this.modulelist.filter(a => a.isSelected).map(a => a.id),
        unselected: this.modulelist.filter(a => !a.isSelected).map(a => a.id),
        dateofPermission: userData.dateofPermission
      };
      this.userService.addPermissions(permissions)
        .subscribe(res => {
          this.getPermissions();
          this.showSuccess('Successfully added permission');
        }, err => {
          this.showError('Permissions failed');

        });
    } catch (error) {

    }
  }
  getUserDetails(empId: any) {
    try {
      this.userService.getUserDetails(empId)
        .subscribe((res: any) => {
          this.selectedUser = res;
          this.userPermissionForm.patchValue({ password: undefined, confirmPassword: undefined });
          this.userPermissionForm.controls.password.markAsUntouched();
          this.userPermissionForm.controls.confirmPassword.markAsUntouched();
          if (this.selectedUser) {
            this.disableSave = false;
            this.userPermissionForm.patchValue({ userName: this.selectedUser.userName, userId: this.selectedUser.id });
            this.userPermissionForm.controls.userName.disable();
            this.getPermissions();
          } else {
            this.disableSave = true;
            this.userPermissionForm.patchValue({ userName: undefined, userId: undefined });
            this.userPermissionForm.controls.userName.markAsUntouched();
            this.userPermissionForm.controls.userId.markAsUntouched();
            this.userPermissionForm.controls.userName.enable();
          }
        }, err => {
          console.error('error while getUserDetails', err);
        });
    } catch (error) {
      console.error('error while getting user details', error);
    }
  }
  clearUserDetails() {
    this.disableSave = true;
    this.userPermissionForm.patchValue({ userName: undefined, userId: undefined, password: undefined, confirmPassword: undefined });
    this.userPermissionForm.controls.password.markAsUntouched();
    this.userPermissionForm.controls.confirmPassword.markAsUntouched();
    this.userPermissionForm.controls.userName.markAsUntouched();
    this.userPermissionForm.controls.userId.markAsUntouched();
    this.userPermissionForm.controls.userName.enable();
    this.clearModuleGrids();
  }
  clearModuleGrids() {
    this.userPermissions = this.modulelist = this.selectedModules = [];
  }
  getPermissions() {
    if (!this.userPermissionForm.controls.userId.value) {
      return;
    }
    const details = { userId: this.userPermissionForm.controls.userId.value, organisationId: 1, locationId: 11 };
    this.userService.getMenuPermissions(details)
      .subscribe(res => {
        if (res && res.length > 0) {
          this.userPermissions = this.convertPermissions(res);
        }
      }, err => {
        console.error('error on getMenuPermissions', err);
      });
  }
  convertPermissions(modules: any[]) {
    let permissions = [];
    modules.forEach(m => {
      if (m.Children && m.Children.length > 0) {
        permissions = [...permissions, ...m.Children.map(a => ({ moduleName: a.moduleName }))];
      } else {
        permissions.push({ moduleName: m.moduleName });
      }
    });
    return R.sortBy(R.prop('moduleName'), R.uniq(permissions));
  }
  resetPassword() {
    if (this.userPermissionForm.invalid) {
      this.userPermissionForm.markAllAsTouched();
      return;
    }
    const userData = this.userPermissionForm.value;
    const userDetails = {
      userId: userData.userId,
      userName: userData.userName,
      password: userData.password
    };
    this.userService.resetPassword(userDetails)
      .subscribe((res: any) => {
        this.userPermissionForm.patchValue({ password: '', confirmPassword: '' });
        this.userPermissionForm.controls.password.markAsUntouched();
        this.userPermissionForm.controls.confirmPassword.markAsUntouched();
        this.showSuccess('Changed Password Successfully');
        console.log('user details', res);
      }, err => {
        this.showError('Changing Password failed');
      });
  }
  clearPermissions() {
    this.modulelist = [];
    this.selectedModules = [];
    this.modulelistMaster = [];
  }

  showSuccess(msg: any) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }
  showError(msg: any) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }
  formatDate(date: any) {
    const parts: any[] = date.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  public async editClick(user: any) {

    this.userPermissionForm.controls.userName.disable();
    this.userPermissionForm.patchValue({ userId: user.userId });
    this.userPermissionForm.controls.dateofPermission.disable();
    await this.getLocations(user.organisationId);
    await this.getSubdepartments(user.departmentId);
    await this.getDesignations(user.subDepartmentId);
    await this.getEmployees(user.designationId);
    this.disableSave = false;
    this.userPermissionForm.patchValue({
      dateofPermission: this.formatDate(user.dateOfPermission),
      authorisedBy: 1, userName: user.userName,
      organisationId: user.organisationId,
      locationId: user.officeLocationId,
      departmentId: user.departmentId,
      subDepartmentId: user.subDepartmentId,
      designation: user.designationId,
      employeeId: user.employeeId
    });
    console.log('user details', user);
  }
}


