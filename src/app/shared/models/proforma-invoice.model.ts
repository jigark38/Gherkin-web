

export class ProformaInvoiceDetails {

    profInvNo: string;
    profInvDate: Date;
    exportDomesticsales: string;
    exportersRefNo: string;
    iGSTSGST: string;
    consigneeCbCode: string;
    consigneeAddress?: string;
    consigneeCountry?: string;
    wCountryId: string;
    buyerCBCode: string;
    buyerAddress?: string;
    buyerCountry?: string;
    buyerOrderNo: string;
    buyerOrderDate: Date;
    preCarriageBy: string;
    placeOfReceiptPC: string;
    vesselFlightNo: string;
    portOfLoading: string;
    portOfDischarge: string;
    finalDestination: string;
    shipmentDate: Date;
    currency: string;
    paymentTerms: string;
    termsConditions: string;
    bankCode: string;
    profInvoiceAmount: number;
    totalNos: number;
    oceanFreight: number;
    totalProfInvoiceAmount: number;
    totalNetWtKgs: number;
    totalGrossWtKgs: number;
    employeeID: string;
    approvedEmployeeId = 12;
    productionDetails: ProductionDetails[] = [];


}

export class ProductionDetails {
    profInvProdNo: string;
    fPGroupCode: string;
    fPGroupName?: string;
    fPVarietyCode: string;
    fPVarietyName?: string;
    fPGradeCode: string;
    fPGradeFromTo?: string;
    preservedIn: string;
    palletisedNonpalletised: string;
    processDetails: string;
    packUOM = 'KGS';
    qtyDrum: number;
    drumWeight: number;
    orderQuantity: number;
    qtyUOM: number;
    orderRate: number;
    rateUOM = 'KGS';
    productOrderAmount: number;

}



// [JsonProperty("naCondition")]
// public string NA_Condition { get; set; }

