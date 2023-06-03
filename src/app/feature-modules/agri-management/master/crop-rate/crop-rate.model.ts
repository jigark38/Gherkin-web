export class CropArea {
    areaId: string;
    name: string;
}

export class CropName {
    cropNameCode: string;
    name: string;

}

export class CropGroup {
    cropGroupCode: string;
    cropGroupName: string;
}

export class VillageName {
    villageCode: string;
    name: string;
}

export class SeasonFromTo {
    psNumber: string;
    seasonFrom: string;
    seasonTo: string;
}
export class FruiteSizeMM {
    cropCountMM: number;
    cropSchemeFrom: number;
    cropSchemeSign: string;
    cropSchemeCode: string;
}

export class CropRateSaveModel {
    cropRateNumber: string;
    cropRateEntryDate: string;
    cropRateEnteredByEmpId: string;
    cropGroupCode: string;
    cropGroupName: string;
    allAreas: string;
    areaId: string;
    allVillages: string;
    villageCode: string;
    cropSchemeCode: string;
    cropRateEffectiveDate: string;
    cropCount: number;
    cropSchemeFrom: number;
    cropSchemeSign: string;
    cropRateAsperAssociation: number;
    cropRatePerUOM: string;
    message: string;
    psNumber: string;
}

export class FruitSizeCount {
    cropSchemeFrom: number;
    cropSchemeSign: string;
}
