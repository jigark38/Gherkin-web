export class PSOScheduleDetails {
    profInvDate: Date;
    profInvNo: string;
    consigneeCbCode: string;
    consigneeCbName: string;
    CountryId: string;
    CountryName: string;
    fPGroupCode: string;
    fPVarietyCode: string;
    fPVarietyName: string;
    fPGradeCode: string;
    fPGrade: string;
    preservedIn: string;
    packUOM: string;
    qtyDrum: number;
    SchdQty: number;
    TotalQty: number;
    IsSelected?: boolean;
    IsSchdQtyValid?: boolean;
    deliverBy: Date;
}

export class ProdScheduleForm {
    PSThroughDetails: string;
    OrgofficeNo: number;
    ProductionScheduleDate: Date;
    ProductionScheduleNo: number;
    EmployeeID: number;
    EmployeeName: string;
    PSRequireDateBy: Date;
    // PSDirectOrderScheduleNo: number;
    FPGroupCode: string;
    FPVarietyCode: string;
    FPGradeCode: string;
    PackUOM: string;
    QtyDrum: number;
    DrumWeight: number;
    PSQuantity: number;
    PSQtyUOM: number;
    MediaProcessCode: string;
    MediaProcessDescRemarks: string;
    OrgofficeName: string;
    ProductionSchedulefor: string;
    constructor() {
        this.DrumWeight = this.EmployeeID = this.FPGradeCode = this.FPGradeCode = this.FPGroupCode
            = this.FPVarietyCode = this.MediaProcessCode = this.MediaProcessDescRemarks = this.OrgofficeNo
            = this.PSQtyUOM = this.PSQuantity = this.PSRequireDateBy =
            this.PSThroughDetails = this.PackUOM = this.ProductionScheduleDate = this.ProductionScheduleNo =
            this.QtyDrum = this.OrgofficeName = this.ProductionSchedulefor = this.EmployeeName = null;
    }

}

export class ProductionScheduleDetails {
    profInvDate: Date;
    profInvNo: string;
    consigneeCbCode: string;
    consigneeCbName: string;
    fPGroupCode: string;
    fPVarietyCode: string;
    fPVarietyName: string;
    fPGradeCode: string;
    fPGrade: string;
    packUOM: string;
    qtyDrum: number;
    SchdQty: number;
    MediaProcessCode: string;
    MediaProcessDescRemarks: string;

    IsSelected?: boolean;
    DrumWeight?: number;
    PSQuantity?: number;
    deliverBy: string;
    PSQtyUOM: number;
    // PS_Product_Quantity:number
}
