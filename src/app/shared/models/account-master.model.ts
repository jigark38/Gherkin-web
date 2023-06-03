

export class AccountMaster {

    OrgCode: number;
    LegalStatus?: string;
    AccHeadCode: string;
    HeadName: string;
    MainGroupCode: string;
    AccGroupCode: string;
    GroupName: string;
    AccSubGroupCode: string;
    SubGroupName: string;
    AccountCode: string;
    AccountName: string;
    OpBalanceDate: Date;
    OpBalanceAmount: number;
    DebitCreditDetails: string;
}

export class AccountsGroup {
    HeadCode: string;
    OrgCode: number;
    AccountOrGroupCode: string;
    AccountOrGroupName: string;
    ParentGroupCode: string;
    MainGroupCode: string;
    IsAccount = false;
    children?: AccountsGroup[];
}
