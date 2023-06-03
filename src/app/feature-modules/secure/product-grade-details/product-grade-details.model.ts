export class ProductGroup {
  id: number;
  createdDate: string;
  groupCode: string;
  grpName: string;
}

export class ProductVariety {
  id: number;
  groupCode: string;
  varietyCode: string;
  varietyName: string;
  scientificName: string;
}

export class ProductGrade {
  id: number;
  varietyCode: string;
  gradeCode: string;
  gradeFrom: number;
  gradeTo: number;
}
export class ProductDetails {
  id: number;
  createdDate: string;
  groupCode: string;
  grpName: string;
  varietyName: string;
  scintificName: string;
  gradefromTo: string;
}
