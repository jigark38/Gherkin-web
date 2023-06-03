export class PurchageReturnDetail {
    purchageReturnNo: string;
    supplierOrgId: string;
    rmGrnNo: string;
    gstType: string;
    prMaterialCost: number;
    prPackingAmount: number;
    packingHsnCode: string;
    packingTaxRateAmount: number;
    prPackingTaxAmount: number;
    prFreightAmount: number;
    freightHsnCode: string;
    freightTaxRatePercentage: number;
    prFreightTaxAmount: number;
    prInsuranceAmount: number;
    insuranceHsnCode: string;
    insuranceTaxRatePercentage: number;
    prInsuranceTaxAmount: number;
    prTotalTaxAmount: number;
    prTotalAmount: number;
    purchaseReturnDate: Date;
    prRemarks: string;
    employeeID: number;
    id: number;

}

export class OutwardGatePassDetail {
    ogpNo: string;
    ogpDate: Date;
    transactionNo: string;
    Id: number;
}

export class PurchageReturnMaterialDetail {
    purchageReturnNo: string;
    rmTransferDate: Date;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rmGrnNo: string;
    rmBatchNo: number;
    rmMaterialwiseReturnRate: number;
    rmMaterialReturnQty: number;
    rmMaterialReturnAmount: number;
    rmGrnIGSTRate: number;
    rmGrnIGSTReverseAmount: number;
    rmGrnCGSTRate: number;
    rmGrnCGSTReverseAmount: number;
    rmGrnSGSTRate: number;
    rmGrnSGSTReverseAmount: number;
    Id: number;
}

export class CreatePurchageReturnModel {
    purchageReturnDetail: PurchageReturnDetail;
    outwardGatePassDetail: OutwardGatePassDetail[];
    purchageReturnMaterialDetail: PurchageReturnMaterialDetail[];
}


export class PurchaseMaterialDetail {
    Id: number;
    rmGrnNo: string;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rmGrnReceivedQty: number;
    rmGrnMaterialwiseTotalCost: number;
    rmCustomsShareAmount: number;
    rmPackingShareAmount: number;
    rmFreightShareAmount: number;
    rmInsuranceShareAmount: number;
    rawMaterialGroup: string;
    rawMaterialDetailsName: string;
    rmGrnBillQty: number;
    rmGrnBillRate: number;
    rmGrnIGSTRate: number;
    rmGrnIGSTAmount: number;
    rmGrnCGSTRate: number;
    rmGrnCGSTAmount: number;
    rmGrnSGSTRate: number;
    rmGrnSGSTAmount: number;
    rmGrnMaterialTransferQty: number;
    rmGrnMaterialBalanceQty: number;
    rmGrnMaterialReturnQty: number;
    rmGrnRateApply: number;
    rmGrnReturnMaterialCost: number;
    rmBatchNo: number;
    isSelected?: boolean;
}
