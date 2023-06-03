export class FieldStaffModel {
  public fieldStaffID: number;
  public dateOfEntry: Date;
  public areaID: string;
  public employeeID: string;
  public effectiveDate: Date;
  public staffType: string;
  public loginUserName: string;
  public departmentCode: string;
  public subDepartmentCode: string;
  public designationCode: string;
  public areaCode: number;
}

export class Field {
  public dateOfEntry: Date;
  public loginUserName: string;
  public areaID: string;
  public areaCode: number;
  public fieldStaffs: Staff[];
}

export class Staff {
  public effectiveDate: Date;
  public staffType: string;
  public employeeID: string;
  public departmentCode: string;
  public subDepartmentCode: string;
  public designationCode: string;
}

export class Department {
  public Id: number;
  public departmentCode: string;
  public departMentName: string;
}
export class SubDepartment {
  public Id: number;
  public subDepartmentCode: string;
  public subDepartmentName: string;
  public departmentCode: string;
}

export class Designation {
  public Id: number;
  public designationCode: string;
  public designattionName: string;
  public departmentCode: string;
  public subDepartmentCode: string;
  public employees: Employee[];
}

export class Employee {
  public employeeId: string;
  public employeeName: string;
  public departmentCode: string;
  public subDepartmentCode: string;
  public designationCode: string;
}

export class EmployeeDetl {
  employeeId: string;
  employeeName: string;
  employeeCreationDate: string;
  empCreatedID: string;
  empUnder: string;
  contractorCode: string;
  empBiometricID: string;
  employeePicture: string;
  employeeGender: string;
  employeeDivision: string;
  employeeDOB: string;
  employeeFatherSpouseName: string;
  employeeRelationship: string;
  employeeContactNo: number;
  employeeAltContatctNo: number;
  employeeMailID: string;
  employeeMaritalStatus: string;
  employeeNoofDependents: number;
  employeePresentAddress: string;
  employeePermanentAddress: string;
  employeeBloodGroup: string;
  departmentCode: string;
  subDepartmentCode: string;
  designationCode: string;
  skillsCode: string;
  employeeDOJ: string;
  employeeIHExp: number;
  employeeTOTExp: number;
  employeePFNo: string;
  employeeESINo: string;
  employeeAadharNo: string;
  employeePassportNo: string;
  employeePAN: string;
  employmentStatusAsOn: string;
}
