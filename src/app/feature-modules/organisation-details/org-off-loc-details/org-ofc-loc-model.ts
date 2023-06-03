export class OrgLocation {

    orgOfficeNo = 0;
    orgCode = 0;
    orgOfficeName: string;
    natureOfficeDetails: string;
    locationOfficeAddress: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    stateName: string;
    districtCode: string;
    districtName: string;
    PlaceCode: string;
    PlaceName: string;
    placeName: string;
    locationPhoneDetails: string;
    locationFaxDetails: string;
    locationCellPhone: string;
    locationEmailId: string;
    laborLicenseNo: string;
    otherLicenseDetails: string;
    constructor() {
        this.locationOfficeAddress = this.countryCode
            = this.orgOfficeName = this.stateCode = this.PlaceCode = this.PlaceName
            = this.locationFaxDetails = this.natureOfficeDetails = this.districtCode = this.districtName
            = this.countryCode = this.locationCellPhone = this.locationEmailId = this.locationPhoneDetails
            = this.laborLicenseNo = this.otherLicenseDetails = '';
    }
}
