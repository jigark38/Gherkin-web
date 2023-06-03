export class OrgManagemet {

    // tslint:disable-next-line: variable-name
    orgMngCode = 0;
    orgCode = 0;
    managementName: string;
    managementDesignation: string;
    orgMngContactNo: string;
    orgMngAltContactNo: string;
    orgMngEmailId: string;
    orgMngResidenceDetails: string;
    orgMngPanDetails: string;
    orgMngDinDetails: string;

    constructor() {
        this.managementDesignation = this.managementName
            = this.orgMngAltContactNo = this.orgMngEmailId = this.orgMngPanDetails
            = this.orgMngResidenceDetails = this.orgMngDinDetails = '';
        this.orgMngContactNo = '';
    }
}
