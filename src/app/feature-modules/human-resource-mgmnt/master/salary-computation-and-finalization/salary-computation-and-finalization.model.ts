export class Department {
  Id: number;
  departmentCode: string;
  departMentName: string;
  SubDepartments: string;
}
export class SubDepartment {
  Id: number;
  subDepartmentCode: string;
  subDepartmentName: string;
  departmentCode: string;
  Designations: string;
}

export class Organisation {
  OrgOfficeNo: string;
  OrgCode: number;
  OrgOfficeName: string;

}

export class employeeAttendanceDetails {
  department: string;
  division: string;
  employeeNameDesignation: string;
  employeeID: number;
  leavesBF: number;
  daysAttnd: number;
  daysConsider: number;
  leavesCF: number;
  grossSalary: number;
  pFDed: number;
  eSIDed: number;
  pTDed: number;
  loans: number;
  canteen: number;
  others: number;
  tDS: number;
  netPayable: number;
  contactorCode: string;
  othours: number;
  noOfDaysWorked: number;
  noOfDaysAddedAfterCalulation: number;
  duration: number;
  sundayAdded: number;
  employeePaymentCategory: string;
  employeeBasicSalary: number;
  employeeDA: number;
  employeeCA: number;
  perDaySalary: number;
  attendanceDaysCount: number;
  noOfDaysCarryForward: number;
  employmentStatusAsOn: string;
  employeeIDString: string;
  employeeName: string;
  perHourSalary: number;
  monthlySalary: number;
  oTPay: number;
  selected: boolean;

}

export class employeeEPFMaster {
  entrydate: Date;
  enteredEmpId: string;
  pfEffectiveDate: Date;
  pfPassingNo: number;
  pfEffectiveFromDate: Date;
  pfEffectiveToDate: Date;
  pfStartingAmount: number;
  pfEmployeeContribution: number;
  pfEmployerEPFContribution: number;
  pfEmployerEPSContribution: number;
  pfEPFMaxLimit: number;
  pfEPFAdminCharges: number;
  pfEDLISCharges: number;
  pfEDLISAdminCharges: number;
  pfTotalEmployerContribution: number;
}

export class employeeESIMaster {

  esiPassingNo: number;
  entryDate: Date;
  enteredEmpId: string;
  esiEffectiveDate: Date;
  esiEffectiveFromDate: Date;
  esiEffectiveToDate: Date;
  esiMaxLimit: number;
  esiEmployeeCount: number;
  esiEmployerCount: number;
  esiTotalCount: number;
}

export class employeePTMaster {
  PTEffectiveDate: Date;
  PTPassingNo: number;
  PTExemptedTillSalary: number;
  PTSalarySlabID: number;
  PTSalaryFrom: number;
  PTSalaryTo: number;
  PTEmployeesAmountPayable: number;
}

export class employeeLoanDetails {
  LoanAmount: number;
  EmployeeID: string;
  OfficeNo: number;
}

export class employeeAttendanceSummaryDetails {
  attendConfirmationNo: number;
  employeeID: string;
  monthYear: string;
  totalAttendedNoofDays: string;
  noofDaysConsiderThisMonth: number;
  noofDaysCarryForward: number;

}

