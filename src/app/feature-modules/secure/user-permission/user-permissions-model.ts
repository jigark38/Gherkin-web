export class Customer {
    customerId: any;
    customerName: any;
    customerAddress: any;
}
export class UserPermission {
    dateofPermission: Date;
    authorisedBy: any;
    organisationId: any;
    locationId: any;
    departmentId: any;
    subDepartmentId: any;
    designation: any;
    employeeId: any;
    userName: any;
    userId: any;
    password: any;
    confirmPassword: any;
    moduleId: any;
    subMenuId: any;
    subModuleId: any;
    constructor() {
        this.authorisedBy = this.organisationId = this.locationId = this.departmentId
            = this.subDepartmentId = this.designation = this.employeeId = this.userName = this.userId
            = this.password = this.confirmPassword = this.moduleId = this.subMenuId = this.subModuleId = '';
        this.dateofPermission = new Date();
    }
}

export interface IPermissionModel {
    moduleId?: any;
    userId: any;
    employeeId: any;
    organisationId: any;
    locationId: any;
    menuId?: any;
    subMenuId?: any;
}

export class Module {
    id: any;
    moduleName: any;
    isSelected: boolean;
}
