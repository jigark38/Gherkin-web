export interface IGreenInwardsDetail {
    inwardType: string;
    inwardDateTime: Date;
    inwardGatePassNo: string;
    supplierTransporterName: string;
    invVehicleNo: string;
    employeeNo: string;
    supplierTransporterPlace: string;
    invoiceDCNo: string;
    invoiceDCDate: Date;
}

export interface IGreenReceptionDetail {
    harvestGRNNo: number;
    harvestGrnDate: Date;
    areaId: string;
    harvestGRNTotalQty?: number;
    vehicalNo: string;
    cropNameCode: string;
    farmerWiseTotalQty?: Date;
}


export class GreenReceptionQualityCheck {
    greenQualityCheckNo = 0;
    orgofficeNo = 0;
    inwardGatePassNo = 0;
    areaId = '';
    harvestGRNNo = 0;
    greensRecvSampleDate = new Date();
    greensRecvSampleQty = 0;
    greensRecvTrunkCondition = '';
    greensCheckedEmployeeId = 0;
    greensVerifiedEmployeeId = 0;
    greensRecvAGNo = '';
    greensRecvRemarks = '';
    harvestGrnDate = new Date();
}

export class GreenReceptionQualityDetails {
    greensQCDetailsNo = 0;
    greensQualityCheckNo = 0;
    borrerQCUOM = '';
    borrerQCQty = 0;
    ffQCUOM = '';
    ffQCQty = 0;
    softQCUOM = '';
    softQCQty = 0;
    fungusQCUOM = '';
    fungusQCQty = 0;
    stemsQCUOM = '';
    stemsQCQty = 0;
    virusQCUOM = '';
    virusQCQty = 0;
    flowersQCUOM = '';
    flowersQCQty = 0;
    muddyQCUOM = '';
    muddyQCQty = 0;
    peanutQCUOM = '';
    peanutQCQty = 0;
    calQCUOM = '';
    calQCQty = 0;
    endcorpQCUOM = '';
    endcorpQCQty = 0;
    rottenQCUOM = '';
    rottenQCQty = 0;
}

// export interface ICreateQualityCheckAndInspection {
//     greenReceptionQualityCheck: IGreenReceptionQualityCheck;
//     greenReceptionQualityDetails: IGreenReceptionQualityDetails;

// }

