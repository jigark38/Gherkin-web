export class DaywiseAttendaceModel {

    id: string;
    orgOfficeNo: string;

    driverName: string;
    employeeNo: string;

    receivedMaterialName: string;
    receivedQuantity: string;
    isOngoing: boolean;
    employeeName: string;
    inTime: any;
    outTime: any;
    duration: any;
    department: any;
    departmentCode: any;
    subDepartmentCode: any;
    subDepartment: string;
    slNo: number;
    employeeId: any;
    dateTimeRecord: Date;
    indRegId: number;
    gender: string;
    isEdited: boolean = false;
    overtime: string;
    shiftDuration: string;
    isChecked : boolean = false;
}

export class OfficeLocationModel {
    orgCode: string;
    orgOfficeName: string;
    orgOfficeNo: string;
    natureOfficeDetails: string;
}


export class AttendanceDetailSearchModel {
    date: Date
    orgOfficeNo: number
    category: string
    deptCode: string
    subDeptCode: string
    gender: string
    division: string
    biometricNo: number
    filter: string
}

export class AttendanceRequestmodel{
    orgOfficeNo: number
    attendanceDate: Date
    entryUpdatedByEmployeeID: number
    attndUpdatedDate:Date
    attendances: DaywiseAttendaceModel[]

}