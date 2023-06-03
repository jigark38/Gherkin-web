export class DriverDocument {
    docUploadNumber?: number;
    driverId: string;
    driverDocumentName: string;
    driverDocumentDetails: any;
}

export class DriverDetail {
    driverId: number;
    empCreatedId: string;
    driverEntryDate: Date;
    employeeId: string;
    drivingYearsExp: number;
    driverLicenseType: string;
    driverLicenseNumber: string;
    driverExpiryDate: Date;
    drivingLicenseIssueAuthority: string;
}
