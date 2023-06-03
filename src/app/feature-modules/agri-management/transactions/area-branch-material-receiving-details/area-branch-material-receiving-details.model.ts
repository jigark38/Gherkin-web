export class AreaMRInwardDetails {
    AreaID: string;
    RMTransferNo: string;
    OGPNO: string;
    CropSchemeCode: string;
    PSNumber: string;
    AreaMRDate: Date;
    AreaMRNo: number;
    AreaMRNNoVisible: string;
    MRExpensesPaid: number;
    MRRemarks: string;
}

export class AreaMaterialReceivedDetails {
    AreaMRNo: number;
    RawMaterialGroupCode: string;
    RawMaterialDetailsCode: string;
    RMMaterialTransferQty: number;
    RMMaterialReceivedQuantity: number;
    MRShortfallDamageQty: number;

}
export class MaterialReceivablesList {
    OGPDate: Date;
    OGPNo: string;
    OGPId?: string;
    MDDriverName: string;
    MDDriverContactNo: string;
    RMTransferNo: string;
    RawMaterialGroupCode: string;
    RawMaterialDetailsCode: string;
    RawMaterialGroup: string;
    RawMaterialDetailsName: string;
    RMMaterialTransferQty: string;
    RawMaterialUOM: string;
    RMMaterialReceivedQuantity?: number;
    MRShortfallDamageQty?: number;
    IsSelected?: boolean;
    rowIndex?: number;
    CropSchemeCode: string;
    DespDate: Date;
}
