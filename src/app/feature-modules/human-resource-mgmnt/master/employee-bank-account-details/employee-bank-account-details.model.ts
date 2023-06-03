export class Organisation {
  public OrgCode: number;
  public OrgOfficeName: string;
  public OrgOfficeNo: number;
}

export class Department {
  public departmentCode: string;
  public departMentName: string;
}
export class SubDepartment {
  public subDepartmentCode: string;
  public subDepartmentName: string;
  public departmentCode: string;
}

export class Designation {
  public designationCode: string;
  public designattionName: string;
}

export class Employee {
  public employeeId: string;
  public employeeName: string;
}

export class Bank {
  public bankName: string;
  public bankIFSC: string;
  public bankBranch: string;
  public bankCode: string;
  public bankAccountNumber: string;
}

export class BankDetail {
  public bankCode: string;
  public bankNameAccountNumber: string;
}

export class EmployeeBankAccountDetail {
  public bankAccountId: number;
  public empAccountId: number;
  public empId: string;
  public bankName: string;
  public bankBranch: string;
  public bankIfsc: string;
  public bankAccountNumber: string;
  public accountEffectiveDateFrom: Date;
  public nomineeName: string;
  public nomineeRelationship: string;
  public preferredAccount: string;
  public enteredEmployeeId: string;
  public orgOfficeNo: Int16Array;
  public modeOfAccount: string;
  public entryDate: Date;
}

export class BankDetailGrid {
  public bankName: string;
  public bankBranchIfsc: string;
  public bankAccountNumber: string;
  public accountEffectiveDateFrom: string;
  public preferredAccount: string;

}

// export class EmployeeBankAccountDetailMaster {
//   public empAccountId: number;


//   public empId: string;
// }
