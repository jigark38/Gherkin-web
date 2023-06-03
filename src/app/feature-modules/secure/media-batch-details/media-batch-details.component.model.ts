import { Time } from '@angular/common';

export class OfficeLocationDetails {
  OrgOfficeNo: string;
  OrgCode: number;
  OrgOfficeName: string;

}


export class MediaProcessDetails {
  mediaProcessCode: string;
  mediaProcessName: string;
}


export class PendingOrderdetails {
  mediaProcessName: string;
  batchProductionDate: Date;
  batchProductionNo: number;
  bSOrderProductionNo: number;
  pSSalesOrderScheduleNo: number;
  pSDirectOrderScheduleNo: number;
  fPGroupCode: string;
  fPVarietyCode: string;
  fPGradeCode: string;
  packUOM: string;
  bSProductionQtyinUOM: number;
  fPVarietyName: string;
  gradeFromTo: string;
  productionScheduleNo: number;
  pSRequireDateBy: Date;

}

export class MediaBatchDetails {
  orgOfficeNo: number;
  mediaBatchProductionDate: Date;
  mediaBatchProductionNo: number;
  mediaBatchProductionVisibleNo: string;
  employeeID: number;
  productionQuantity: number;
  mediaBatchSize: number;
  mediaBatchUOM: string;
  sNaOH: string;
  sAgNO3: string;
  sBRINE: string;
  water: string;
  mediaBatchRemarks: string;

}

export class EmployeeIDAndName {
  employeeId: string
  employeeName: string;
}

export class MaterialDetails {
  materialName: string;
  standardQty: string;
  RequiredQty: number;
  materialBatchNo: string;
  consumedQty: number;
}

export class MediaStockAndBatchDetail {
  flag: string;
  stockDate: Date;
  stockNo: string;
  orgOfficeNo: string;
  rawMaterialGroupCode_A: string;
  rawMaterialDetailsCode_A: string;
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
  rmMaterialTransferQty: number;
  rmBatchNo: number;
  rmGrnDate: Date;
  rmGrnNo: string;
  rawmaterialGroupCode_B: string;
  rawMaterialDetailsCode_B: string;
  rmGRNreceivedQty: number;
  rmGRNMaterialWiseTotalCost: number;
  rmGRNMaterialWiseTotalRate: number;
  issueQty: number;
}

export class MediaBatchProductionDetails {

  mediaBatchProductionNo        : number;
  orgofficeNo                   : number;
  mediaBatchProductionDate      : Date;
  mediaBatchProductionVisibleNo : string;
  employeeID                    : string;
  productionQuantity            : number;
  mediaBatchSize                : number;
  mediaBatchUOM                 : string;
  sNaOH                         : string;
  sAgNO3                        : string;
  sBRINE                        : string;
  water                         : string;
  mediaBatchRemarks             : string;

}


export class MediaBatchMaterialDetails {


  batchMaterialConsumptionNo: number;
  mediaBatchProductionNo: number;
  bSOrderProductionNo: number;
  rawMaterialGroupCode: string;
  rawMaterialDetailsCode: string;
  stockNo: string;
  rMGRNNO: string;
  rMStockLOTGRNNo: string;
  rMStockLotGrnRate: number;
  rMBatchNo: number;
  rMGRNMaterialwiseTotalRate: number;
  rMMaterialTransferQty: number;
  rMMaterialTransferAmount: number;

}
