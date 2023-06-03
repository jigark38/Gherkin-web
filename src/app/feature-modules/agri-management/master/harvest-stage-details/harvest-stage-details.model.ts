export class HarvestStageDetailsData {
  harvestStageMaster: HarvestStageMasterModel;
  harvestStageDetails: HarvestStageDetailsModel[];
}

export class HarvestStageMasterModel {
  id: number;
  dateOfEntry: string;
  enteredBy: string;
  cropGroupName: string;
  cropName: string;
  effectiveDate: string;
  hbomDivisionFor: string;
  hsTransactionCode: string;
}

export class HarvestStageDetailsModel {
  id: number;
  cropPhaseName: string;
  daysAfterSowingFrom: string;
  daysTo: string;
  harvestDetails: string;
  hsTransactionCode: string;
}

export interface HarvestStageModel {
  dateOfEntry: string;
  enteredBy: string;
  cropGroupCode: string;
  cropNameCode: string;
  packageFor: string;
  PracticeAcrege: string;
  SeasonFromTo: string;
  PhaseEffectiveDate: string;
  CropPhaseName: string;
  PhaseDaysPerSowingDay: string;
  HarvestDetails: string;
  PracticesEffectiveDate: number;
  DaysAfterSowing: string;
  TradeName: string;
  ChemicalName: string;
  ChemicalVolumePerLt: number;
  UOM: string;
  SprayVolumePerUOMAcre: number;
  QtyChemicalPerUOMAcreMLGm: string;
  TragetPest: string;
}

export class EffectiveDateForHarvestDetails {
  effectiveDate: string;
  hsTransactionCode: string;
}

