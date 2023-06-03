export class OrganisationModel {
    orgCode: number;
    organisationName: string;
    orgStatus: string;
    regCertificateDetails: string;
    certificatationNo: string;
    orgMngEmailId: string;
    otherCertificateNo: string;
    websiteDetails: string;
    constructor() {
        this.organisationName = this.orgStatus = this.regCertificateDetails = this.otherCertificateNo =
            this.certificatationNo = this.orgMngEmailId = this.websiteDetails = '';
        this.orgCode = 0;
    }
}
