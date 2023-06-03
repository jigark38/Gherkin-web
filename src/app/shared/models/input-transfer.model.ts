export class RMInputTransferDetails {
    Id: number;
    TransferDate: Date;
    TransferNumber: string;
    AreaID: string;
    areaCode: number;
    areaIncharge: string;
    CropGroupCode: string;
    cropGroupName: string;
    CropNameCode: string;
    empID: string;
    cropSchemeCode: string;
    agreementAcres: number;
    gatePassDetails: OutwardGatePassDetails;
    PsNumber: string;
    InutTransferRemarks: string;
    transferDetailsList: RMInputMaterialTransferDetails[];
    stockAndBatchData: StockAndBatchData[];
    OrgOfficeNo: string;

    constructor() {
        this.gatePassDetails = new OutwardGatePassDetails();
        this.gatePassDetails.ogpDate = new Date();
        this.stockAndBatchData = [];
    }
}

export class OutwardGatePassDetails {
    ogpNo: string;
    transactionNo: string;
    ogpDate: Date;
    Id: number;
}

export class RMInputMaterialTransferDetails {
    Id: number;
    rmTransferNo: string;
    rmTransferDate: Date;
    hbOMDivisonFor: string;
    hbomPracticeNo: string;
    hbomPracticePerAcrage: string;
    hbomChemicalVolume: number;
    hbomChemicalUOM: string;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rawMaterialGroup: string;
    RawMaterialDetailsName: string;
    hbomPracticeEffectiveDate: Date;
    hSCropPhaseCode: string;
    hSTransactionCode: string;

    ogpNo: string;
    stockno: string;
    rmStockLotGrnNo: string;
    rmStockLotGrnRate: number;
    rmGrnNo: string;
    rmBatchNo: number;
    rmGrnMaterialwiseTotalRate: number;
    rmMaterialTransferAmount: number;
    rmMaterialTransferQty: number;

    divisionPOP: string;
    materialGroup: string;
    materialName: string;
    transferredTillDate: number;
    tobeIssueQty: number;
    transferQty: number;
    transferAmount: number;
    qtyRequired: number;
    popStdperUOM: string;

    constructor() {
        this.transferredTillDate = 0;
    }
}

export class StockAndBatchDetailsList {
    flag: string;
    firstFields: FirstField[];
    secondFields: SecondField[];
    stockAndBatchData: StockAndBatchData[];

    rmStockLOTGRNNo: string;
    rmStockLOTGRNDate: Date;
    rmGRNDate: Date;
    rmBatchNo: number;
    rmStockLotGrnQty: number;
    rmMaterialTransferQty: number;
    rmGRNReceivedQty: number;
    rmStockLOTGRNRate: number;
    rmGRNMaterialwiseTotalRate: number;
}

export class StockAndBatchData {
    batchNoAndDate: string;
    avaialableStockQty: number;
    issueQty: number;
    rate: number;
    amount: number;
    stockNo: string;
    rmStockLOTGRNNo: string;
    rmStockLotGrnRate: number;

    rmGrnNo: string;
    rmBatchNo: number;
    rmGRNMaterialWiseTotalRate: number;
}

export class FirstField {
    stockDate: Date;
    stockNo: string;
    orgOfficeNo: string;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rawMaterialUOM: string;
    rmStockTotalDetailQty: string;
    rawMaterialTotalQty: number;
    rawMaterialTotalAmount: number;
    rmStockLOTGRNDate: Date;
    rmStockLOTGRNNo: string;
    rmStockLotGrnQty: number;
    rmStockLotGrnRate: number;
    rmStockLotGrnAmount: number;
    rmTransferNo: string;
    rmTransferDate: Date;
    rmMaterilalTransferQty: number;
    sumRMMaterialTransferQty: number;
}

export class SecondField {
    rmBatchNo: number;
    rmGrnDate: Date;
    rmGrnNo: string;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rmGRNReceivedQty: number;
    rmGRNMaterialWiseTotalCost: number;
    rmGRNMaterialWiseTotalRate: number;
    rmTransferNo: string;
    rmTransferDate: Date;
    rmMaterilalTransferQty: number;
    sumRMMaterialTransferQty: number;
}

export class FeedTransferDetails {
    rmInputTransferDetails: RMInputTransferDetails;
    outwardGatePassDetails: OutwardGatePassDetails;
    rmInputMaterialTransferDetails: RMInputMaterialTransferDetails;
}
