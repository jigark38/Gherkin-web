export class HarvestGRNMaterialDetail {
    AreaName: string;
    AreaId: string;
    supervisors: any[];
    areaIncharge: string;
    areaCode: number;
    EmployeeId: number;
    EmpName: string;
    harvestDate: Date;
    HarvestGRNRemarks: string;
    HarvestGRNDate: Date;
    HarvestGRNNo: number;
    VechicalNo: string;
    DriverName: string;
    DriverContactNo: number;
    VechicalStartingReading: number;
    VehicalStartTime: Date;
    VehicalFreight: number;
    HarvestGRNTotalQuantity: number;
    HarvestGRNTotalDespCrates: number;
    OrgOfficeNo: number;
    harvestFarmerEntryNo: number;
    cropSchemeCode: string;
    cropNameCode: string;
    noOfCrates: number;
    farmerWiseTotalQuantity: number;
    NumOfCrates: number;
    harvestGRNCratesDespatchNos: number;
    harvestGRNTotalApproxQty: number;
    HarvestGRNFarmersDetails: HarvestGRNFarmersDetail[];
    HarvestGRNCratesDetails: HarvestGRNCratesDetail[];

    constructor() {
        this.supervisors = [];
        this.farmerWiseTotalQuantity = 0;
        this.HarvestGRNTotalDespCrates = 0;
        this.HarvestGRNTotalQuantity = 0;
        this.HarvestGRNFarmersDetails = [];
        this.HarvestGRNCratesDetails = [];
    }
}

export class HarvestGRNFarmersDetail {
    HarvestFarmerEntryNo: number;
    CropSchemeCode: string;
    CropNameCode: string;
    NoOfCrates: number;
    FarmerWiseTotalQuantity: number;
}

export class HarvestGRNCratesDetail {
    CropSchemeCode: string;
    CropNameCode: string;
    HarvestGRNCratesDespatchNos: number;
    HarvestGRNTotalApproxQty: number;
}

export class GreenReceivedDetails {
    AreaId: string;
    HarvestDate: string;
    HarvestProcurementNo: number;
    CropNameCode: string;
    PSNumber: string;
    HarvestFarmersEntryNo: number;
    FarmerCode: string;
    CropSchemeCode: string;
    FarmerwiseTotalCrates: number;
    FarmerwiseTotalQuantity: number;
    FarmerName: string;
    VillageCode: number;
    FarmersAgreementCode: string;
    FarmersAccountNo: string;
    VillageName: string;
    CropSchemeFrom: number;
    CropSchemeSign: string;
    ConcatenatedItem1: string;
    ConcatenatedItem2: string;
    ConcatenatedItem3: string;
    ConcatenatedItem4: string;
    ConcatenatedItem5: string;
    ConcatenatedItem6: string;
    ConcatenatedItem7: string;
    TotalQuantity: number;
    TotalCrates: number;
    BuyerEmployeeID: string;
    BuyerEmployeeName: string;
    CropGroupCode: string;
    constructor() {
        this.TotalQuantity = 0;
        this.TotalCrates = 0;
    }
}

export class CWHarvestGRNCountWeightDetails {
    cropSchemeCode: string;
    cropSchemeFrom: number;
    cropSchemeSign: string;
    cropCountInfo: string;
    noOfCrates: number;
    eachCrateWt: number;
    crateNoFrom: number;
    crateNoTo: number;
    grossWeight: number;
    tareweight: number;
    crateswiseNetWeight: number;
    cropGroupCode: string;
    cropNameCode: string;
    greensProcurementNo: number;
    BuyerEmployeeID: string;
    BuyerEmployeeName: string;
    CWGreensCratewiseEntryNo: number;
    HarvestGRNNo: number;
}

export class GreenReceivedDetailsNew {
    HarvestGRNNo: number;
    greensReceivedDetails: GreenReceivedDetails[];
    weightDetails: CWHarvestGRNCountWeightDetails[];
}
