export class InwardDetail {
    InwardType: string;
    InwardDateTime: Date;
    InwardGatePassNo: string;
    SupplierTransporterName: string;
    SupplierTransporterPlace: string;
    InvDCNo: string;
    InvDCDate: Date;
    ReceivedMaterialName: string;
    ReceivedQuantity: number;
    QCTest: string;

    // extra column
    IsSelected: boolean;
}

export class PendingPurchaseOrder {
    RMPODate: Date;
    RMPONo: string;
    RawMaterialGroupCode: string;
    RawMaterialDetailsCode: string;
    RawMaterialDetaisName: string;
    SupplierOrgId: string;
    GSTType: string;
    SupplierOrganisationName: string;
    PlaceName: string;
    DomesticImport: string;
    RMOrderQty: number;
    TillNowRecordQuantity: number;
    PendingQuatity: number;
    RMPORate: number;
    RMPOMaterialWiseCost: number;
    RMPOMaterialIGSTRate: number;
    RMPOMaterialCGSTRate: number;
    RMPOMaterialSGSRate: number;

    // extra column
    IsSelected: boolean;
}

export class ReceivedMaterial {
    Id?: number;
    InwardDateTime: Date;
    InwardGatePassNo: string;
    PODate: Date;
    PONo: string;
    RawMaterialGroupCode: string;
    RawMaterialDetailsCode: string;
    // SupplierOrgId: string;
    SupplierNamePlace: string;
    MaterialName: string;
    POQuantity: number;
    TillNowRecordQuantity: number;
    PendingQuatity: number;
    BillQuantity?: number;
    RMPORate: number;
    BillRate?: number;
    InvoiceAmount: number;
    TaxRateIGST: number;
    TaxAmountIGST: number;
    TaxRateCGST: number;
    TaxAmountCGST: number;
    TaxRateSGST: number;
    TaxAmountSGST: number;
    TotalAmount: number;
    BatchNo?: number;
    ReceivedQuantity?: number;

    // extra columns
    IsBillQuantityValid?: boolean;
    IsBillRateValid?: boolean;
    IsBatchNoValid?: boolean;
    IsReceivedQuantity?: boolean;
}


export class GoodsReceiptNote {
    RMGRNDate: Date;
    RMGRNNo: string;
    InwardGatePassNo: string;
    DomesticImport: string;
    SupplierOrgID: string;
    Currency: string;
    TotalMaterialCost: number;
    GSTType: string;
    TotalTaxAmount: number;
    TotalMaterialCostAndTaxAmount: number;
    CustomsAmount: number;
    PackingAmount: number;
    PackingTaxRatePercentage: number;
    PackingTaxAmount: number;
    FreightAmount: number;
    FreightTaxRatePercentage: number;
    FreightTaxAmount: number;
    InsuranceAmount: number;
    InsuranceTaxRatePercentage: number;
    InsuranceTaxAmount: number;
    TotalBillAmount: number;
    AdvancePayment: number;
    BalanceAmount: number;
    CreditDays: number;
    InvoiceDCType: string;
    BillDCDate: Date;
    BillDCNo: string;
    PackingHSNCode: string;
    FreightHSNCode: string;
    InsuranceHSNCode: string;
    OrderMaterialDetails: OrderMaterialDetail[];
    OrderMaterialTotalCostDetails: OrderMaterialTotalCostDetail[];
    DiscountAmount: number;
    DiscountPercentage: number;

}

export class OrderMaterialDetail {
    Id?: number;
    RMGRNNO: string;
    RMPONO: string;
    RawMaterialGroupCode: string;
    RawMaterialDetailsCode: string;
    RMGRNBillQty: number;
    RMPORate: number;
    RMGRNBillRate: number;
    RMGRNMaterialWiseCost: number;
    RMGRNIGSTRate: number;
    RMGRNIGSTAmount: number;
    RMGRNCGSTRate: number;
    RMGRNCGSTAmount: number;
    RMGRNSGSTRate: number;
    RMGRNSGSTAmount: number;
    RMGRNMaterialWiseTotalCost: number;
    SupplierOrganisationName: string;
    RawMaterialDetaisName: string;
    RMOrderQty: number;
    TillNowRecordQuantity: number;
    RMPOMaterialIGSTRate: number;
    RMPOMaterialCGSTRate: number;
    RMPOMaterialSGSRate: number;
    RMGRNDate: Date;
    PODate: Date;
    RMGRNBatchNo: number;
}

export class OrderMaterialTotalCostDetail {
    Id?: number;
    RMGRNNO: string;
    RawMaterialGroupCode: string;
    RawMaterialDetailsCode: string;
    RMGRNMaterialWiseTotalCost: number;
    RMBatchNo: number;
    RMGRNReceivedQty: number;
    RMCustomsShareAmount: number;
    RMPackingShareAmount: number;
    RMFreightShareAmount: number;
    RMInsuranceShareAmount: number;
    RMGRNMaterialwiseTotalCost: number;
    RMGRNMaterialwiseTotalRate: number;
}
