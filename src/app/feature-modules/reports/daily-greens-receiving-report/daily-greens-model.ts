export interface BuyersInfo {
  EmployeeName: string;
  EntryDate: Date;
  AreaId: string;
  BuyerEmployeeId: string;
  GreensTransVehDesNo: number;
  GreensProcurementNo: number;
  CropsNameCode: string;
  PsNumber: string;
  BuyingAsst1EmpId: string;
  BuyingAsst2EmpId: string;
  WeightMode: string;
  SelectedDate: Date;
  TimeOdDispatch: string;
  OwnVehicleId: number;
  OrgOfficeNo: number;
  HarvestEndingTime?: Date;
  HarvestTimeDuration?: number;
  SeasonFrom: any;
  SeasonTo: any;
  FromToDate: any;
  HiredVehicleId: number;
  DriverId: number;
  DriverName: string;
}
