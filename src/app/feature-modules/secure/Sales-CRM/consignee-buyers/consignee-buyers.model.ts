export class CountryOverseas {
    countryId: string;
    countryName: string;
}

export class StateOverseas {
    stateId: string;
    stateName: string;
    countryId: string;
}

export class CityOverseas {
    cityId: string;
    cityName: string;
    stateId: string;
    countryId: string;
}

export class CurrencyOverseas {
    currencyName: string;
    currencyCode: string;
}

export class Consignee {
    id: number;
    cbCode: string;
    ConsgbuyerType: string;
    cbName: string;
    cbAddress: string;
    countryId: string;
    countryName: string;
    stateName: string;
    stateId: string;
    cityId: string;
    cityName: string;
    pinCode: string;
    countryareaCode: string;
    managmentName: string;
    mobileNo: string;
    officeNo: string;
    alternateNo: string;
    mailId: string;
    altmailId: string;
    licenseNo: string;
    creditLimited: string;
    currencyCode: string;
    currencyName: string;
    createdDate: string;
    modifiedDate: string;
    documentName: string;
    documentUploadeds: ConsigneeDocument[];
}
export class ConsigneeDocument {
    cbCode: string;
    documentNo: string;
    documentName: string;
    documentDetails: any;
}
