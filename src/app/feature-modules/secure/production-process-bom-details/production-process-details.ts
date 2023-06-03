export class ProdProcessDetails {
  productionProcessCode: string;
  dateofCreation: Date;
  employeeID: string;
  fpGroupCode: string;
  fpVarietyCode: string;
  productionProcessName: string;
  productionProcessDescription: string;
}

export class ProductGroup {
  groupCode: string;
  grpName: string;
}

export class VarietyGroup {
  varietyCode: string;
  varietyName: string;
}
export class MediaProcessDetails {
  mediaProcessCode: string;
  productionProcessCode: string;
  mediaProcessName: string;
  mediaProcessDescription: string;
}

export class ProdStandardBOM {
  bomCode: string;
  productionProcessCode: string;
  mediaProcessCode: string;
  effectiveDate: Date;
  standardProductionQty: number;
  standardUOM: string;
}

export class ProdProcessMaterialDetail {
  id: number;
  bomCode: string;
  rawMaterialGroupCode: string;
  rawMaterialDetailsCode: string;
  standardQunatity: 0;
  standardUOM: string;
}

export class ProdProcessCombine {
  MediaProcessDetails = new MediaProcessDetails();
  ProdStandardBOM = new ProdStandardBOM();
  ProdProcessMaterialDetails: ProdProcessMaterialDetail[] = [];
  status: string;
}
export class BomCols {
  id: number;
  standardProductionUOM: string;
  standardQunatity: 0;
  standardBOMUOM: string;
  productionProcessName: string;
  standardProductionQty: number;
  mediaProcessName: string;
  rawMaterialName: string;
}
export class RawMaterialGroup {
  rawMaterialGroupCode: string;
  rawMaterialGroup: string;
}
export class RawMaterialDetailsGroup {
  rawMaterialDetailsCode: string;
  rawMaterialDetailsName: string;
}
