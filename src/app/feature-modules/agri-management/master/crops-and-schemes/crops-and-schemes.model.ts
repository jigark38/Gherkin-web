
export class CropsModel {
    public EntryDate: Date;
    public UserName: string;
    public GroupCode: string;
    public CropName: string;
    public CropCode: string;
    public Schemes: Schemes[];
}

export class Schemes {
    public CropSchemeId: number;
    public Code: string;
    public CropCode: string;
    public From: number;
    public Sign: string;
    public Count: number;
}

export class CropGroup {
    public CropGroupId: number;
    public EntryDate: Date;
    public UserId: number;
    public CropGroupCode: string;
    public Name: string;
}

export class Crops {
    public CropId: number;
    public Name: string;
    public CropCode: string;
    public CropGroupCode: string;
}
