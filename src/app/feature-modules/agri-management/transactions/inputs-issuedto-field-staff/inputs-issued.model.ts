export class EmpInfoByHarvestArea {
    areaID: string;
    employeeID: string;
    employeeStatus: string;
    employeeName: string;
}

export class CropGroupDetailsByAreaId {
    areaID: string;
    cropGroupCode: string;
    cropGroupName: string;
}

export class CropDetailsByGroupCode {
    cropGroupCode: string;
    cropGroupName: string;
    cropNameCode: string;
    cropName: string;
}

export class PlantationSchDetailsByAreaID {
    areaID: string;
    fromDate: string;
    toDate: string;
    seasonFromToDate: string;
}

export class AreaDetails {
    id: number;
    areaID: string;
    areaCode: number;
    areaName: string;
    areaEntryDate: string;
}

export class OrgLocation {
    orgOfficeNo: number;
    orgCode: number;
    orgOfficeName: string;
    natureOfficeDetails: string;
    locationOfficeAddress: string;
    countryName: string;
    stateCode: string;
    districtCode: string;
    PlaceCode: string;
    locationPhoneDetails: string;
    locationFaxDetails: string;
    locationCellPhone: string;
    locationEmailId: string;
    laborLicenseNo: string;
    otherLicenseDetails: string;
}

export class InputIssuedToFieldStaffMaterials {
    materialFSIssueID: number;
    materialIssuedFSNo: string;
    inputsIssuedFSDate: string;
    hbomPracticeNo: string;
    rawMaterialGroupCode: string;
    rawMaterialDetailsCode: string;
    stockNo: string;
    rmStockLOTGRNNo: string;
    rmStockLotGrnRate: number;
    rmGRNNO: string;
    rmBatchNo: number;
    rmGRNMaterialwiseTotalRate: number;
    FSMaterialIssuedQty: number;
    rmMaterialTransferAmount: number;
    ogpNO: string;
    orgofficeNo: number;
    areaID: string;
    employeeID: string;
    cropGroupCode: string;
    cropNameCode: string;
    pSNumber: string;
    issuedByEmpId: string;
    ogpDate: string;

}


