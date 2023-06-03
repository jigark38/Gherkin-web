import { Time } from '@angular/common';

export class InwardDetails {
    InWardType: string;
    igpDate: Date;
    igpNo: string;
    supplierTransporter: string;
    veichleNo: string;
    selected: boolean;
}

export class ReceptionDetails {
    orgID: string;
    harvestGRNDate: Date;
    harvestGRNNo: string;
    greenProcurementNo: string;
    areaName: string;
    areaId: string;
    veichleNo: string;
    cropGroupCode: string;
    cropName: string;
    cropCode: string;
    noOfCrates: string;
    farmerWiseTotalQuantity: number;
    harvestGRNTotalQuantity: number;
    startingKMs: string;
    startiTime: string;
    startigreenProcurementTime: string;
    despNoOfCrates: number;
    grades: Grade[];
}

export class Grade {
    cropGradeHeader: string;
    cropGradeValue: string;
    cropSchemeCode: string;
}

export class SummaryReceivingDetail {
    grade: string;
    despCrates: number;
    despKgs: number;
    recdCrates: number;
    recdKgs: number;
    diffCrates: number;
    diffKgs: number;
    cropSchemeCode: string;
}

export class EmployeeDetail {
    employeeId: string;
    employeeName: string;
}

export class SummaryWeighmentDetails {
    weightNo: number;
    grade: string;
    noOfCrates: number;
    crateTareWt: number;
    grossWt: number;
    tareWt: number;
    netWt: number;
    cropSchemeCode: string;
}

export class HarvestGrnForm {
    unitHMInwardNo: string;
    igpNo: string;
    orgID: string;
    areaId: string;
    harvestGRNNo: string;
    greenProcurementNo: string;
    cropNameCode: string;
    cropGroupCode: string;
    supervisorId: string;
    harvestGRNTotalDespCrates: number;
    harvestGRNTotalQuantity: number;
    unitHarvestMaterialInwardDate: Date;
    vehicleReachReading: string;
    vehicleReachTime: string;
    vehicleTransitDuration: number;
    vehicleTransitKms: string;
    totalReceivedCrates: string;
    totalReceivedQantity: string;
    SummaryReceivingDetails: ReceivingDetailList[];
    SummaryWeighmentDetails: WeighmentDetails[];
}

export class ReceivingDetailList {
    cropSchemeCode: string;
    noOfCrates: number;
    gradeWiseTotalQuantity: number;
}

export class WeighmentDetails {
    cropSchemeCode: string;
    weightNoOfCrates: number;
    grossWeight: number;
    tareWeight: number;
    netWeight: number;
    cratesTareWeight: number;
}
