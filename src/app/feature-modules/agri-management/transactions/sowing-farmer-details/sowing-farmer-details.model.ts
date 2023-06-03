import { CropGroup, Crops } from '../../master/crops-and-schemes/crops-and-schemes.model';
import { FarmerDetails } from '../../master/farmer-details/farmer-details.model';

export class FarmerForm {
    public cropGroups: Array<CropGroup>;
    public cropNames: Array<Crops>;
    public sowingSessions: Array<SowingSessions>;
}

export class SowingSessions {
    public psNumber: string;
    public sessionFrom: Date;
    public sessionTo: Date;
    public cropNameCode: number;
    public farmerNoOfAcresArea: number;
    public AgricultureDripNonDrip: string;
    public farmersAggrementCode: string;
    public farmersCode: string;
    public farmerName: string;
}

export class HarvestArea {
    public areaCode: number;
    public areaEnteredEmpId: number;
    public areaEntryDate: Date;
    public areaId: string;
    public areaName: string;
    public id: number;
}

export class ExportModel {
    public harvestArea: HarvestArea;
    public farmerDetails: Array<FarmerDetails>;
    public crop: Array<Crops>;
    public sowingSessions: Array<SowingSessions>;
}

export class HarvestDataForSowingFarrmingDto {
    public hsTransactionCode: string;
    public hsEffectiveDate: Date;
    public hsCropPhaseName: string;
    public hsCropPhaseCode: string;
    public hsDayAfterSowingFrom: number;
    public hsDayAfterSowingTo: number;
}

export class HBOMPracticeForSowingFarmings {
    public id: number;
    public hbomPracticeNo: string;
    public hbomDivisionFor: string;
    public hsCropPhaseCode: string;
    public hbomPracticePerAcerage: string;
    public hbomDaysApplicable: number;
    public rawMaterialDetailsCode: string;
    public hbomTradeName: string;
    public rawMaterialDetailsName: string;
}

export class HarvestData {
    public harvestDataForSowingFarrmingDto: Array<HarvestDataForSowingFarrmingDto>;
    public hbomPracticeForSowingFarmings: Array<HBOMPracticeForSowingFarmings>;
}

export class FarmerAgrimentSentModel {
    public areaId: string;
    public psNumber: string;
}

export class State {
    public stateCode: number;
    public stateName: string;
}

export class District {
    public districtCode: number;
    public districtName: string;
}

export class Mandal {
    public mandalCode: number;
    public mandalName: string;
}

export class Village {
    public villageCode: number;
    public villageName: string;
}

export class SowingFarmingDetails {
    public sowingNo: number;
    public areaId: string;
    public farmerCode: string;
    public farmersAgreementCode: string;
    public farmersAccountNo: string;
    public cropNameCode: string;
    // public cropSchemeCode: string;
    public farmerLocation: string;
    public farmPicture: string;
    public psNumber: string;
    public sowingBeginingDate: Date;
    public hsEnteredEmpId: string;
}

export class FarmingStageDetails {
    public harvestFarmingNo: number;
    public sowingNo: number;
    public farmimngReportDate: Date;
    public employeeId: string;
    public hbomDivisionFor: string;
    public farmingReportDetails: string;
    public farmingRemarks: string;
    public id: number;
    public hsCropPhaseCode: string;
}

export class FarmingGridModel {
    public harvestData: HarvestDataForSowingFarrmingDto;
    public hbomPractice: HBOMPracticeForSowingFarmings;
}

export class SowingSaveModal {
    public sowingFarmingDetails: SowingFarmingDetails;
    public farmingStageDetails: FarmingStageDetails;
}
