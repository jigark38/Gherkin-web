export class IndentMaterialDetails {
    indentDate: string;
    indentBy: string;
    indentByName: string;
    indentNo: string;
    areaId: string;
    requestTo: string;
    materialGroupName: string;
    materialGroupId: string;
    materialName: string;
    materialNameId: string;
    uOM: string;
    currentQuantity: string;
    indentQuantity: string;
    requiredDate: string;
    remarks: string;
}

export class CropGroup {
    CropGroupId: number;
    EntryDate: string;
    UserId: string;
    CropGroupCode: string;
    Name: string;
}

export class CropName {
    groupCode: string;
    cropName: string;
    cropnameCode: string;
}

export class SeasonFromTo {
    cropNameCode: string;
    psNo: string;
    date: string;
}
export class PhaseEffectiveDate {
    cropNameCode: string;
    transCode: string;
    practiceEffectiveDate: string;
    practiceEffectiveDateString: string;

}
export class CropPhaseName {
    transCode: string;
    cropphaseCode: string;
    cropphaseName: string;
    divisionFor: string;
    cropnameCode: string;
    cropName: string;
    cropgroupCode: string;
    practiceperAcre: string;
    psNo: string;
    date: string;
    practiceeffectiveDate: string;
    practiceperNo: string;
    harvestDetails: string;
    days: string;
    createdDate: string;
    modifyDate: string;
    packagepracticeMaterials: string;
}
export class HarvestStageDetails {
    id: number;
    cropNameCode: string;
    cropName: string;
    cropGroupCode: string;
    practicePerAcre: string;
    psNo: string;
    date: string;
    transCode: string;
    cropphaseCode: string;
    cropPhaseName: string;
    practiceEffectiveDate: string;
    practiceNo: string;
    harvestDetails: string;
    fromDays: number;
    toDays: number;
    createdDate: string;
    modifyDate: string;
    packagePracticeMaterials: string;
}
export class PracticeMaterial {

    id: number;
    practiceNo: string;
    cropnameCode: string;
    cropPhaseCode: string;
    cropPhaseName: string;
    cropPhase: string;
    daysApplicable: number;
    rawmaterialGroupcode: string;
    rawmaterialDetailscode: string;
    tradeName: string;
    chemicalName: string;
    chemicalVolume: string;
    chemicalUom: string;
    sprayVolume: number;
    chemicalQty: number;
    targetPest: string;
    createdDate: string;
    modifyDate: string;
    chemicalVolumeToDisplay: string;
    practiceeffectiveDate: string;
}

export class PracticeDetails {
    id: number;
    entryDate: string;
    employeeId: string;
    cropgroupCode: string;
    cropnameCode: string;
    divisionFor: string;
    practiceperAcre: string;
    psNo: string;
    transCode: string;
    createdDate: string;
    modifyDate: string;
    cropphaseCode: string;
    cropphaseName: string;
    practiceeffectiveDate: string;
    practiceperNo: string;
    harvestDetails: string;
    packageofMaterials: PracticeMaterial[];
}

export class MaterialGroup {
    rawMatGroupName: string;
    rawMatGroupCode: string;
    ID: number;
    // tslint:disable-next-line: variable-name
    Raw_Material_Group_Code: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Group: string;
}

export class MaterialName {
    ID: number;
    // tslint:disable-next-line: variable-name
    Raw_Material_Details_Code: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Group_Code: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Details_Name: string;
}
