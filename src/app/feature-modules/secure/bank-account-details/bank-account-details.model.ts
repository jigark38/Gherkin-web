export class BankAccountDetails {
    id: number;
    bankCode: any;
    organisationCode: string;
    dateOfEntry: Date;
    bankAccountNumber: number;
    bankName: string;
    bankBranch: string;
    bankAddress: string;
    bankIFSC: string;
    bankSwiftCode: string;
    bankOtherDetails: string;
    authorisationEmployee: string;
    operationDate: Date;
    salaryLinkedAccount: string;

    constructor() {
        this.authorisationEmployee = this.organisationCode = this.bankSwiftCode =
            this.bankOtherDetails = this.bankName = this.bankIFSC = this.bankCode = this.bankBranch = this.bankAddress = '';
        this.bankAccountNumber = 0;
        this.operationDate = this.dateOfEntry = new Date();
        this.id = -1;

    }

}

export class BankAccountClose {
    id: number;
    bankCode: string;
    accountCloseStatus: boolean;
    accountClosingDate: Date;
    accountCloseReason: string;
    constructor() {
        this.accountClosingDate = new Date();
        this.accountCloseStatus = false;
        this.accountCloseReason = '';
        this.id = -1;
    }
}

