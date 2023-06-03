export class RMBranchStockRequest {
    rmStockBranchDetailsModel: RMStockBranch;
    rmStockBranchQuantityModel: RMStockDetails[];
}
export class RMStockBranch {
    stockDate: string;
    // stockNo: string;
    areaId: string;
    areaCode: string;
}
export interface RMStockDetails {
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rawMaterialUom: string;
    rmStockQuantity: string;
}

export interface RMBranchUpdateRequest {
    // rMBranchUpdateDetailsModel: RMBranchUpdateDetailsModel[];
    id: string;
    stockDate: string;
    stockNo: string;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    rawMaterialGroupCodeName: string;
    rawMaterialDetailsCodeName: string;
    rawMaterialUom: string;
    rmStockQuantity: string;
}
