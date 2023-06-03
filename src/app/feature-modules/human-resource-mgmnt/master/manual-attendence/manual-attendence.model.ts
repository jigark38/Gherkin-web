export class ManualAttendenceDto {
    manualAttendanceID: number;
    manualAttendanceProcessID: number;
    manualAttendanceDate: string;
    loginUserName: string;
    employeeID: string;
    employeeName: string;
    designationCode: string;
    designation: string;
    areaId: string;
    areaName: string;
    manualAttendanceStatus: string;
    passingManualAttendanceDate: string;
}

export class ApiResonse<T> {
    IsSucceed: boolean;
    ErrorMessages: string[];
    Exception: any;
    Data: T;
}

export class ManualAttendenceBind extends ManualAttendenceDto {
    statusDatePair: StatusDate[];
    show: boolean;
}

export class StatusDate {
    status: string;
    attendenceDate: Date;
    manualAttendanceID: number;
}