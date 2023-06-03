export class Area {
    id: number;
    areaId: string;
    areaEntryDate: string;

    areaEnteredEmpId: string;

    areaName: string;

    areaCode: string;
}

export interface HarvestVillage {
    id: number;
    areaId: string;
    countryCode: string;
    stateCode: string;
    districtCode: string;
    villageCode: string;
    villageName: string;
    mandalCode: string;
}

export interface ModifyHarvestVillage {
    // tslint:disable-next-line: variable-name
    ID: number;
    // tslint:disable-next-line: variable-name
    Area_ID: string;
    // tslint:disable-next-line: variable-name
    Country_Code: string;
    // tslint:disable-next-line: variable-name
    State_Code: string;
    // tslint:disable-next-line: variable-name
    District_Code: string;
    // tslint:disable-next-line: variable-name
    Village_Code: string;
}

export class SearchVillageModel {
    id: number;
    areaId: string;
    areaName: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    stateName: string;
    districtCode: string;
    districtName: string;
    mandalCode: string;
    mandalName: string;
    villageCode: string;
    villageName: string;
    isSelected: boolean;
}

export class StateModel {
    stateCode: string;
    stateName: string;
    countryCode: string;
    Country: string;
    districts: DistrictModel[];
}

export class CountryModel {
    countryCode: string;
    countryName: string;
    states: StateModel[];
}

export class DistrictModel {
    countryCode: string;
    stateCode: string;
    districtCode: string;
    districtName: string;
    mandals: MandalModel[];
}

export class MandalModel {
    countryCode: string;
    stateCode: string;
    districtCode: string;
    mandalCode: string;
    mandalName: string;
    villages: VillageModel[];
}

export class VillageModel {
    countryCode: string;
    stateCode: string;
    districtCode: string;
    mandalCode: string;
    villageCode: string;
    villageName: string;
}
