export class FarmerAcccountDetails {
  noOfAcres: number;
  farmerName: string;
  farmerAccountNo: string;
  farmerAgreementCode: string;
  farmerCode: string;
  greensReceived: number;
  InputsIssued: number;
  advanceAmount: number;
  inputReturn: number;
  payable: number;
  isChecked: boolean;
}

export class GreensListDetails {
  greensProcurementNo: number;
  cropSchemeCode: string;
  harvestDate: Date;
  count: any;
  rate: number;
  amount: number;
}

export interface InputIssue {
  MIF_Date_of_Issue: Date;
  Raw_Material_Details_Name: string;
  Farmers_Material_Issued_Qty: number;
  Farmer_Material_Rate: number;
  Raw_Material_UOM: string;
  Farmer_Material_Rate_Raw_Material_UOM: string;
  Calculation: number;
  Cumulative: number;
}

export interface InputReturn {
  MIF_Date_of_Issue: Date;
  Raw_Material_Details_Name: string;
  Farmers_Material_Return_Qty: number;
  Farmer_Material_Rate: number;
  Raw_Material_UOM: string;
  Farmer_Material_Rate_Raw_Material_UOM: string;
  Calculation: number;
  Cumulative: number;
}
