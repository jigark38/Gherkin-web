export class OrganisationOfficeUnits {
    public orgOfficeNo: number;
    public orgCode: number;
    public orgOfficeName: string;
}
export class HarvestAreas {
    public areaId: string;
    public areaCode: number;
    public areaName: string;
}
export class CountryOverSeas {
    public countryId: string;
    public countryName: string;
}
export class ConsigneeBuyersList {
    public cbCode: string;
    public cbName: string;
}
export class ProformaInvoices {
    public profInvNo: string;
    public profInvoiceAmount: number;
    public consigneeCbCode: string;
}
export class FinishedProductGroups {
    public groupCode: string;
    public grpName: string;
}
export class FinishedProductDetails {
    public groupCode: string;
    public varietyCode: string;
    public varietyName: string;
    public scientificName: string;
}
export class MediaProcessDetails {
    public mediaProcessCode: string;
    public productionProcessCode: string;
    public mediaProcessName: string;
}
export class ProductionProcessDetails {
    public productionProcessCode: string;
    public fpGroupCode: string;
    public fpVarietyCode: string;
    public productionProcessName: string;
}
export class FPGradesDetails {
    public varietyCode: string;
    public gradeCode: string;
    public gradeFrom: number;
    public gradeTo: number;
}
export class ContainerPackingDetails {
    public containerCode: number;
    public containerName: string;
}

export class UOMDetails {
    public gscUomCode: number;
    public gscUomName: string;
}

export class FinishSFOpeningStokModel {
    public areaID: string;
    public cBCode: string;
    public countryId: string;
    public employeeID: string;
    public employeeName: string;
    public fPGradeCode: string;
    public fPGroupCode: string;
    public fPVarietyCode: string;
    public fSFOSStockEntryDate: Date;
    public fSFPackingMode: string;
    public fSFOSStockNo: number;
    public fSFStockType: string;
    public mediaProcessCode: string;
    public orgOfficeNo: number;
    public productionProcessCode: string;
    public profInvNo: string;
    public finishedSFStockQuantityDetailsList: FinishedSFStokQntyModel[] = [];
}

export class FinishedSFStokQntyModel {
    public fSFStockQuantityNo: number;
    public fSFStockProcessedDate: Date;
    public fSFOSStockNo: number;
    public containerCode: number;
    public containerName: string;
    public quantityContainer: number;
    public gSCUOMCode: number;
    public gSCUOMName: string;
    public containerWeight: number;
    public fSFNOofContainers: number;
    public containerSlNoFrom: string;
    public containerSlNoTo: string;
    public stockLocationDetails: string;
    public barcodeOption: string;
}
