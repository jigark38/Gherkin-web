export class GSGroupDetail {
  gsGroupCode: number;
  gsGroupName: string;
}

export class GSSubGroupDetail {
  gsSubGroupCode: number;
  gsGroupCode: number;
  gsGroupName: string;
  gsSubGroupName: string;
}

export class GSCUOMDetail {
  gscUomCode: number;
  gscUomName: string;
}

export class GSMaterialDetail {
  gsMaterialCode: number;
  gsEntryDate: Date;
  employeeID: string;
  gsGroupCode: number;
  gsSubGroupCode: number;
  gsMaterialName: string;
  gsMaterialDesc: string;
  gscUOMCode: number;
  packingSizeUnit: number;
  qtyPerPackUnit: number;
  location: string;
  rolQuantity: number;
  hsnCode: number;
  igstRate: number;
  cgstRate: number;
  sgstRate: number;
  openingStock: Date;
  noOfPackageUnits: number;
  openingStockQuantity: number;
  rateRate: number;
  openingStockValue: number;
  gsGroupName: string;
  gsSubGroupName: string;
  gscUOMName: string;
}
