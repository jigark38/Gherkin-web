export class FarmerDetails {
  public alternativeContactPerson: string;
  public farmerName: string;
  public farmerAddress: string;
  public stateName: string;
  public districtName: string;
  public mandalName: string;
  public villageName: string;
}

export class CropGroupDto {
  public cropGroupCode: string;
  public name: string;
}

export class CropName {
  public cropNameCode: string;
  public name: string;
}

export class CropFromTo {
  public psNumber: string;
  public seasonFrom: string;
  public seasonTo: string;
}

export class PlantationSchemeDetail {
  public psNumber: string;
  public seasonFromTo: string;
}

export class Area {
  public areaId: string;
  public areaName: string;
}
