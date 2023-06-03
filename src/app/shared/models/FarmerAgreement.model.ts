

export class FarmersAgreement {

    FarmersAgreementDate: any;
    FarmersAgreementCode: string;
    AreaID: string;
    AreaCode: number;
    EmployeeID: string;
    // CityCode: string;
    VillageCode: string;
    FarmerCode: string;
    Address: string;
    DistrictCode: string;
    DistrictName?: string;
    StateCode: string;
    MandalCode: string;
    MandalName?: string;
    StateName?: string;
    CountryCode: string;
    CountryName?: string;
    FarmersAccountNo: string;
    CropGroupCode: string;
    CropNameCode: string;
    // CropSchemeCode: string;
    FarmersNoOfAcersArea: number;
    AgricultureDripNonDrip: string;
    PSNumber: string;
    BoarderCrop: string;
    PreviousCrop: string;
    MulchingSheet: string;
    FYM: string;
    FarmersAgreementSizes: FarmersAgreementSize[] = [];
}

export class FarmersAgreementSize {
    ID: number;
    CropCount: string;
    CropSchemeFromSign: string;
    CropRateAsPerAssociation: number;
    CropRatePerUOM: string;
    CropRateAsPerOurAgreement: number;
    CropRatesRemarks: string;
    CropSchemeCode: string;

}
