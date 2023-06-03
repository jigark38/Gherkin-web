export class Country {
    countryCode: string;
    countryName: string;
}

export class State {
    stateCode: string;
    stateName: string;
    countryCode: string;
}
export class District {
    districtCode: string;
    districtName: string;
    stateCode: string;
    countryCode: string;
}
export class Place {
    PlaceCode: string;
    PlaceName: string;
    DistrictCode: string;
    StateCode: string;
    CountryCode: string;
}

export class Organisation {
    organisationName: string;
    supplierOrgID: string;
}
export class SupplierDetails {
    ID: number;
    supplierOrgID: string;
    creationDate: string;
    userName: string;
    organisationName: string;
    legalStatus: string;
    address: string;
    countryID: number;
    // country: string;
    stateID: number;
    // state: string;
    districtID: number;
    //  district: string;
    placeCode: number;
    //  place: string;
    pinCode: number;
    mgmName: string;
    designation: string;
    mgmContactNumber: number;
    correspondanceMailID: string;
    altCorrespondanceMailID: string;
    contactPerson: string;
    contactPersonDesignation: string;
    contactPersonNumber?: number;
    contactPersonMailID: string;
    officeNumber?: number;
    activity: string;
    gstNo: string;
    website: string;
    licenseNo: string;
    bankName: string;
    bankBranch: string;
    bankActNo: number;
    iFSCCode: string;
    approvedBy: string;
    // SupplierDocumentDetails: SupplierDocument[];
}
export class SupplierDocument {
    supplierOrgDocNo: number;
    supplierOrgID: string;
    supplierDocumentName: string;
    supplierDocumentDetails: any;
    supplierDocumentPreappendText: string;
}
export class SupplierRequestModel {
    SupplierDetailsModel: SupplierDetails;
    SupplierDocumentDetails: SupplierDocument[];
}

export class SupplierDetailsDto {
    ID: number;
    supplierOrgID: string;
    creationDate: string;
    userName: string;
    organisationName: string;
    legalStatus: string;
    address: string;
    countryID: number;
    // country: string;
    stateID: number;
    // state: string;
    districtID: number;
    //  district: string;
    placeCode: number;
    //  place: string;
    pinCode: number;
    mgmName: string;
    designation: string;
    mgmContactNumber: number;
    correspondanceMailID: string;
    altCorrespondanceMailID: string;
    contactPerson: string;
    contactPersonDesignation: string;
    contactPersonNumber: number;
    contactPersonMailID: string;
    officeNumber: number;
    activity: string;
    gstNo: string;
    website: string;
    licenseNo: string;
    bankName: string;
    bankBranch: string;
    bankActNo: number;
    iFSCCode: string;
    approvedBy: string;
    countryName: string;
    stateName: string;
    districtName: string;
    placeName: string;
    // SupplierDocumentDetails: SupplierDocument[];
}
export class SupplierDocumentDto {
    supplierOrgDocNo: number;
    supplierOrgID: string;
    supplierDocumentName: string;
    supplierDocumentDetails: any;
    supplierDocumentPreappendText: string;
}

export class SupplierResponseModel {
    SupplierDetailsDto: SupplierDetailsDto;
    SupplierDocumentsDtos: SupplierDocumentDto[];
}
