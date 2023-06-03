export class RMStockDetails {
    stockDate: Date;
    stockNo: number;
    areaName: string;
    areaCode: string;
    materialGroup: string;
    materialName: string;
    uom: string;
    detailedQty: string;
    totalQuantity: number;
    avgRate: number;
    totalMaterialCost: number;
    rmstockLotDetailsList: Array<RMStockLotDetails>;

}

export class RMStockLotDetails {
    grnId: number;
    stockNo: string;
    grnDate: Date;
    grnNo: number;
    quantity: number;
    rate: number;
    amount: number;
}
