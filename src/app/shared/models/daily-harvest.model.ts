export class HarvestDailyDetails {

    Id = 0;
    HarvestProcurementNo = 0;
    HarvestDate: Date;
    AreaId: string;
    AreaName?: string;
    CropNameCode: string;
    CropName?: string;
    PsNumber: string;
    BuyingSupervisorEmployeeId: number;
    BuyingAsstEmployeeId: number;
    VehicleNumber: string;
    VehicleDriverName: string;
    HarvestStartingTime: Date;
    HarvestStartingKms: number;
    HarvestEndingTime: Date;
    HarvestEndingKMS: number;
    HarvestTimeDuration: number;
    HarvestKmsTotalReading: number;
    VehicleCharges: number;
    HarvestOtherCharges: number;
    TripTotalQuantity = 0;
    TripTotalCrates = 0;
    HaverstRemarks: string;
    EmployeeId: string;
    HarvestFarmersDetails: HarvestFarmersDetails[] = [];


}


export class HarvestFarmersDetails {


    Id = 0;
    HarvestFarmersEntryNo = 0;
    HarvestProcurementNo = 0;
    FarmerCode: string;
    FarmerName?: string;
    Count?: string;
    AccountNumber?: string;
    CropSchemeCode: string;
    FarmerwiseTotalCrates = 0;
    FarmerwiseTotalQuantity = 0;
    LastHarvestStatus = 'No';
    HarvestQuantityCratewiseDetails: CrateWiseDetails[] = [];

}


export class CrateWiseDetails {
    Id = 0;
    HarvestCratewiseEntryNo = 0;
    HarvestProcurementNo = 0;
    HarvestFarmersEntryNo = 0;
    CropSchemeCode: string;
    Count?: string;
    NoOfCrates: number;
    GrossWeight: number;
    Tareweight: number;
    CrateswiseNetWeight: number;
}
