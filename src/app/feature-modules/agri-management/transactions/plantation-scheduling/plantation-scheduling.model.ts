export class CropGrp {
    public CropGroupId: number;
    public EntryDate: Date;
    public UserId: number;
    public CropGroupCode: string;
    public Name: string;
}

export class CropName {
    public CropId: number;
    public Name: string;
    public CropCode: string;
    public CropGroupCode: string;
}

export class PlantationSchedul {
    public PsNumber: string;
    public PsDate: Date;
    public CropNameCode: string;
    public CropGroupCode: string;
    public FromDate: Date;
    public ToDate: Date;
    public PreparedBy: string;
    public ApprovedBy: string;
}
