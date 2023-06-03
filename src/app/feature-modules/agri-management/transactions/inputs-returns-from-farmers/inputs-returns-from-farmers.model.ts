import { Employee } from '../../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { CropGroup } from '../../master/crops-and-schemes/crops-and-schemes.model';

export class FarmersInputsMaterialMaster {
  fIMReturnNo: number;
  fMIRDate: Date;
  areaID: string;
  employeeID: string;
  cropGroupCode: string;
  cropNameCode: string;
  psNumber: string;
  farmerCode: string;
  fIMReturnVoucherNo: string;
  stockReturnStatus: string;
  orgOfficeNo: number;

  fieldStaffAreaName: string;
  fieldStaffEmployeeName: string;
  cropGroupName: string;
  cropName: string;
  seasonFromTo: string;
  villageCode: number;
  villageName: string;
  farmerName: string;
  farmerAltContactPerson: string;
  orgOfficeName: string;
}

export class FarmersInputsMaterialDetail {
  fIMReturnTRNo: number;
  fIMReturnNo: number;
  rawMaterialGroupCode: string;
  rawMaterialGroup: string;
  rawMaterialDetailsCode: string;
  rawMaterialDetailsName: string;
  rawMaterialDetailsUOM: string;
  farmersMaterialIssuedQty: number;
  farmersMaterialReturnQty: number;
  mifConsumptionVoucherNo: string;
}

export class SeasonFromTo {
  psNumber: string;
  seasonFromToDate: string;
}

export class FieldStaffCropGroupSeason {
  fieldStaffList: Employee[];
  cropGroupList: CropGroup[];
  seasonFromTo: SeasonFromTo[];

  constructor() {
    this.fieldStaffList = [];
    this.cropGroupList = [];
    this.seasonFromTo = [];
  }
}

export class FarmerAndVillage {
  farmerCode: string;
  farmerName: string;
  farmerAltContactPerson: string;
  villageCode: number;
  villageName: string;
}

export class OrgOffice {
  orgOfficeNo: number;
  orgOfficeName: string;
}
