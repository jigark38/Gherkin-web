
export class UnitNameLocations {
  OrgOfficeNo: number;
  OrgCode: number;
  OrgOfficeName: string;
}

export class GreenReceptionGridModel {
  harvestGRNNo: number;
  greensProcurementNo: number;
  GRNDisplayNo: number;
  areaID: string;
  totalReceivedCrates: number;
  totalReceivedQty: number;
  harvestGRNDate: Date;
  harvestGRNDisplayDate: string;
  cropNameCode: string;
  cropSchemeCode: string;
  areaName: string;
  cropName: string;
  receivingUnitName: string;
  unitHMInwardNo: number;
  isOnGoing: boolean;
  greensGradeNo: number;
  isSelected: boolean;
}

export class GreensGradingInwardDetails {
  greensGradeNo: number;
  orgOfficeNo: number;
  orgOfficeName: string;
  areaID: string;
  harvestGRNNo: number;
  gradedTotalQuantity: number;
  weighmentMode: string;
  greensProcurementNo: number;
  cropNameCode: string;
  cropGroupCode: string;
  gradedTotalCrates: number;
  greensGradedHarvestGRNDetailsList: GreensGradedHarvestGRNDetails[];
  greensGradingQuantityDetailsList: GreensGradingQuantityDetails[];
  greensGradingWeighmentDetailsList: GreensGradingWeighmentDetails[];
}

export class GreensGradedHarvestGRNDetails {
  gradedHarvestGRNNo: number;
  greensGradeNo: number;
  harvestGRNNo: number;
  greensProcurementNo?: number;
  cropName: number;
  AreaId: string;
  areaName: string;
  status: boolean;
}

export class GreensGradingQuantityDetails {
  greensGradingQtyNo: number;
  greensGradeNo: number;
  cropNameCode: string;
  cropName: string;
  cropSchemeCode: string;
  from: number;
  sign: string;
  count: number;
  gradingNoofCrates: number;
  quantityAfterGradingTotal: number;

}

export class GreensGradingWeighmentDetails {

  gmWeightNo: number;
  greensGradeNo: number;
  cropNameCode: string;
  cropName: string;
  cropSchemeCode: string;
  from: number;
  sign: string;
  count: number;
  gmWeightNoofCrates: number;
  gmWeightGrossWeight: number;
  gmWeightTareWeight: number;
  hmWeightNetWeight: number;
  gmCratesTareWeight: number;
  isDisabled: boolean;
}

