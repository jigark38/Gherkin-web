export class Seasons {
  Id: number;
  PsNumber: string;
  PsDate: Date;
  CropNameCode: string;
  CropGroupCode: string;
  FromDate: Date;
  ToDate: Date;
  PreparedBy: string;
  ApprovedBy: string;
}


export class MaterialGroup {
  CropGroupId: number;
  EntryDate: Date;
  UserId: string;
  CropGroupCode: string;
  Name: string;
}


export class MaterialName {
  cropNameCode: string;
  name: string;
}

export class ReportSummaryOption {
  PsNumber: string;
  CropNameCode: string;
  FromDate: any;
  ToDate: any;
}
