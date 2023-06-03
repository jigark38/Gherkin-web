export class FarmerDetails {
    public id: number;
    public farmerCode: string;
    public dateOfEntry: Date;
    public userName: string;
    public farmerName: string;
    public farmerAddress: string;
    public countryCode: number;
    public stateCode: number;
    public districtCode: number;
    public mandalCode: number;
    public villageCode: number;
    public pinCode: number;
    public alternativeContactPerson: string;
    public contactNumber: number;
    public aadharCardNo: string;
    public noOfAcres: number;
    public bankName: string;
    public bankBranch: string;
    public bankAccountNo: string;
    public bankIFSC: string;
    public approvedBy: string;
    public farmerBankDetails: Array<FarmerBankDetails>;
}
export class FarmerBankDetails {
    public farmerCode: string;
    public farmerBankCode: number;
    public farmerAccountHolderName: string;
    public farmerBankName: string;
    public farmerBankBranch: string;
    public farmerBankAccountNo: number;
    public farmerBankIFSC: string;
    public preferredBank: string;
}

export class FarmerDocuments {
    public id: number;
    public farmerCode: string;
    public documentName: string;
    public document: any;
}

export class Farmer {
    public id: number;
    public farmerCode: string;
    public farmerName: string;
}

export class DocMod {
    public formdata: FormData;
    public farmerCode: string;
    public documentName: string;

}

export class FileModel {
    public id: number;
    public farmerCode: string;
    public documentName: string;
    public document: string;
}

