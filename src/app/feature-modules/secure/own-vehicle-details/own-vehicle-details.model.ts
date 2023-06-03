export class OwnVehiclesDetails {
    empCreatedId: string;
    vehicleEntryDate: string;
    vehicleType: string;
    vehicleMake: string;
    vehicleDOP: string;
    ownVehicleId: number;
    vehicleRegNumber: string;
    vehicleChassisNo: string;
    vehicleNosTyres: number;
    vehicleAvgMileage: number;
    vehicleRenewalDuration: number;
    vehicleMaxCapacity: number;
}

export class OwnVehicleDocuments {
    docUploadNo: string;
    documentName: string;
    ownVehicleID: number | null;
    documentDetails: any;
}

export class GPSTrackingDevices {
    gpsTrackingDeviceId: number;
    ownVehicleID: number | null;
    hiredVehicleID: number | null;
    gpsDeviceNo: string;
}
