export class OrderMaterialDetail {
    Id: number;
    rmPoNo: string;
    rmIndentNo: string;
    rawMaterialGroupCode: string;
    rowMaterialDetailsCode: string;
    materialName: string; // extra
    rmOrderQty: string;
    orderQuantityUOM: string; // extra
    rmQuotationDate: Date | string;
    rmQuotationNo: string;
    rmQuotationRate: string;
    rmPoRate: string;
    rmPoMaterialWiseCost: string;
    tax: string; // extra
    rmPoMaterialIGSTRate: string;
    rmPoMaterialCGSTRate: string;
    rmPoMaterialSGSTRate: string;
    taxAmount: string; // extra
    rmPoMaterialIGSTAmount: string;
    rmPoMaterialCGSTAmount: string;
    rmPoMaterialSGSTAmount: string;

    rmPoMaterialWiseTotalCost: string;

    // extra
    // tslint:disable-next-line: whitespace
    isQuotedRateValid?= true;
    // tslint:disable-next-line: whitespace
    isPORateValid?= true;
    // tslint:disable-next-line: whitespace
    isSelected?= false;

}

export class PurchaseOrderDetail {
    id: number;
    rmPoDate: string;
    rmPoNo: string;
    domesticImport: string;
    supplierOrgId: string;
    supplierName: string;
    placeCode: string;
    stateName: string;
    countryName: string;
    currency: string;
    gstType: string;
    quotationType: string;
    packingCondition: string;
    packingStyle: string;
    poPackingQty: number;
    poPackingRate: number;
    poPackingAmt: number;
    deliveryCondition: string;
    deliveryFrtAmt: number;
    insuranceCondition: string;
    insuranceAmt: number;
    poAdvanceCond: string;
    advDetails: number;
    poCreditDays: number;
    poDeliveryDate: string;
    poDeliveryDays: number;
    poTotalAmount: number;
    poValidityCondition: string;
    poValidityDays: number;
}

export class IndentDetail {
    id = 0;
    indentDate: string;
    indentNo: string;
    materialGroupCode: string;
    rawMaterialGroupName: string;
    rawMaterialDetailsCode: string;
    rawMaterialDetailsName: string;
    branchAreaId: string;
    branchArea: string;
    indentQty: string;
    indentUom: string;
    totalIndentQuantity: string;
    availableQty: string;
    orderQty: string;

    // extra
    isSelected?: boolean;
    isInputAllowed?: boolean;
    // tslint:disable-next-line: whitespace
    isOrderQuantityValid?= true;

}

export class SupplierOrgModel {
    supplierOrgID: string;
    organisationName: string;
}

export class PlaceModel {
    PlaceCode: string;
    PlaceName: string;
    StateCode: string;
    CountryCode: string;
}

export class StateModel {
    stateCode: string;
    stateName: string;
    countryCode: string;
    Country: string;
    districts: string;
}

export class CountryModel {
    countryCode: string;
    countryName: string;
    states: string;
}

export class TaxPercentageRate {
    igstRate: string;
    cgstRate: string;
    sgstRate: string;
}

export class MaterialCondition {
    Id: number;
    rmPoNo: string;
    rmMcNo: string;
    poMc: string;
    poMd: string;
    poMr: string;
}
export class CreatePOWithMaterialAndCondition {
    indentMaterialNames: IndentMaterialNames[];
    purchageOrderDetail: PurchaseOrderDetail;
    rmPoMaterialDetails: OrderMaterialDetail[];
    rmPoMaterialConditions: MaterialCondition[];
    rMPOIndentDetails: RMPOIndentDetail[];
}

export class RMPOIndentDetail {
    rmPoNo: string;
    rmIndentNo: string;
}

export class IndentMaterialNames {
    indentNo: string;
    materialGroupCode: string;
    rawMaterialDetailsCode: string;
    rawMaterialDetailsName: string;
    rawMaterialGroupName: string;
}
