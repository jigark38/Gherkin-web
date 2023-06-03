export class SupplierInformationDetails {
    agentOrgID: number;
    agentCreationDate: Date;
    EmpCreatedID: string;
    agentOrganisationName: string;
    agentOrganisationLegalStatus: string;
    agentOrganisationAddress: string;
    countryCode: number;
    stateCode: number;
    districtCode: number;
    placeCode: number;
    placeName: string;
    agentPINCode: number;
    agentManagementName: string;
    agentManagementDesignation: string;
    agentManagementCN: number;
    agentManagementMID: string;
    agentOrganisationOfficeNumber: number;
    agentOrganisationActivity: string;
    agentOrganisationGSTN: string;
    agentOrganisationWebsite: string;
    agentBankDetailsList: AgentBankDetails[] = [];
    agentOrgDocumentsList: AgentOrgDocuments[] = [];
}

export class AgentOrgDocuments {
    agentOrgDocNo: number;
    agentOrgID: number;
    agentDocumentName: string;
    agentDocumentDetails: any;
}

export class AgentBankDetails {
    agentBankCode: number;
    agentOrgID: number;
    agentOrganisationBankName: string;
    agentOrganisationBankBranch: string;
    agentOrganisationBankAccountNo: number;
    agentOrganisationBankIFSC: string;
    preferredBank: string;
}

export class AgentOrgDetails {
    agentOrgID: number;
    agentOrganisationName: string;
}