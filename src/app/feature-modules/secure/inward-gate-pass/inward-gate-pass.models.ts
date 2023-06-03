export class InwardGatePassModel {

    id: string;
    orgOfficeNo: string;
    inwardType: string;
    inwardDateTime: string;
    inwardGatePassNo: string;
    supplierTransporterName: string;
    supplierTransportPlace: string;
    invDcNo: string;
    invDcDate: string;
    invVehicleNo: string;
    driverName: string;
    employeeNo: string;
    inwardRemarks: string;
    receivedMaterialName: string;
    receivedQuantity: string;
    isOngoing: boolean;
}

export class OfficeLocationModel {
    orgCode: string;
    orgOfficeName: string;
    orgOfficeNo: string;
    natureOfficeDetails: string;
}
