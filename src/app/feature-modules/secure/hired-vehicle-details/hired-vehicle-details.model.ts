export class HiredTransporterDetail {
  hiredTransID: number;
  empCreatedID: string;
  dateOfEntry: string;
  transporterName: string;
  transporterManagementName: string;
  transAddress: string;
  transContactNo: number;
  transAltContactNo: number;
  transMailId: string;
}

export class HiredVehicleDetail {
  hiredVehicleID: number;
  hiredTransID: number;
  vehicleType: string;
  vehicleMake: string;
  vehicleDOP: string;
  vehicleRegNumber: string;
  vehicleChassisNo: string;
  vehicleNosTyres: number;
  vehicleAvgMileage: number;
  vehicleRenewalDuration: number;
  vehicleMaxCapacity: number;
}

export class HiredVehicleDocument {
  docUploadNo: string;
  documentName: string;
  hiredVehicleID: number;
  documentDetails: any;
}
