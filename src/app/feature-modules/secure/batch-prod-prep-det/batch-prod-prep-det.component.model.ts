

export class BatchScheduleDetailsForProd {
  orgofficeNo: number;
  employeeID: number;
  mediaProcessCode: string;
  batchProductionProcessIdentity: string;
  batchProductionDate: Date;
  batchProductionNo: number;
  batchProductionProcesswise: string;
  batchSizeApprox: number;
  pSThroughDetails: string;
  mediaProcessDescRemarks: string;

}


export class BatchScheduleDummyProductionForProd {
  batchProductionNo: number;
  bSDummyProductionNo: number;
  fPVarietyCode: string;
  fPGradeCode: string;
  packUOM: string;
  qtyDrum: number;
  pSQuantity: number;
  pSQtyUOM: number;
  fPGroupCode: string;
  mediaProcessDescRemarks: string;
}

export class BatchScheduleGreensGRNDetailsForProd {
  batchProductionNo: number;
  bSGreensConsumptionNo: number;
  harvestGRNNo: number;
  greensGradeQtyNo: number;
  cropNameCode: string;
  cropSchemeCode: string;
  bSGradingQuantity: number;
}

//export class BatchScheduleDrumsBarcodeDetailsForProd	{
//  batchProductionNo: number;
//  bSOrderProductionNo: number;
//  mediaProcessCode: string;
//  prodBarrelNo: string;
//  prodBarrelQRNo: string;
//}





