export class MaterialDetail {
    public rawMaterialGroupCode: string;
    public rawMaterialGroupName: string;
    public rawMaterialDetailsName: string;
    public rawMaterialDetailsCode: string;
    public rawMaterialUOM: string;

}

export class Area {
    public areaID: number;
    public areaName: string;
}


export class FarmersInputsIssueRatesMaster {

    public fiRatePassingNo: number;

    public fiRatesEntryDate: Date;

    public fiRateEnteredByEmployeeID: string;

    public cropRateApprovedByEmployeeID: string;

    public cropGroupCode: string;

    public cropNameCode: string;

    public psNumber: string;

    public cropRateEffectiveDate: Date;

    public countryCode: string;

    public stateCode: string;

    public FarmersInputsAreaDetails: Array<FarmersInputsAreaDetail>;

    public FarmersInputsMaterialRates: Array<FarmersInputsMaterialRate>;

}


export class FarmersInputsAreaDetail {

    public psNumber: string;

    public areaID: string;

    public farmersRatesAreaID: number;

}

export class FarmersInputsMaterialRate {

    public materialRateID: number;

    public rawMaterialGroupCode: string;

    public rawMaterialDetailsCode: string;

    public rawMaterialUOM: string;

    public farmerMaterialRate: number;
}
