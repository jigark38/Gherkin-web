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
    UOM: string;
    currentQuantity: string;
    indentQuantity: string;
    requiredDate: string;
    remarks: string;
    materialList: MaterialList[];
}

export class MaterialList {
    materialGroupName: string;
    materialGroupId: string;
    materialName: string;
    materialNameId: string;
    requiredQuantity: string;
    requiredDate: string;
    remarks: string;
}

export class Area {
    areaId: string;
    areaName: string;
}

export class OrganisationArea {
    orgOfficeNo: number;
    orgCode: number;
    orgOfficeName: string;
}


export class MaterialGroup {
    // tslint:disable-next-line: variable-name
    Raw_Material_Group: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Group_Code: string;
}

export class MaterialName {
    // tslint:disable-next-line: variable-name
    Raw_Material_Group_Code: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Details_Name: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Details_Code: string;
    // tslint:disable-next-line: variable-name
    RM_UOM: string;
}

export class BranchIndentDetails {
    ID: number;
    // tslint:disable-next-line: variable-name
    RM_Indent_No: string;
    // tslint:disable-next-line: variable-name
    RM_Indent_Entry_Date: string;
    // tslint:disable-next-line: variable-name
    RM_Indent_Emp_ID: string;
    // tslint:disable-next-line: variable-name
    Area_ID: string;
    // tslint:disable-next-line: variable-name
    Request_To: string;
    //  BranchIndentMaterialDetails: BranchIndentMaterialDetails[]
    // tslint:disable-next-line: variable-name
    Org_Office_No: string;
}

export class BranchIndentMaterialDetails {
    ID: number;
    // tslint:disable-next-line: variable-name
    Raw_Material_Group_Code: string;
    GroupName: string;
    // tslint:disable-next-line: variable-name
    Raw_Material_Details_Code: string;
    DetailsName: string;
    // tslint:disable-next-line: variable-name
    RM_Stock_On_Date: number;
    // tslint:disable-next-line: variable-name
    RM_Indent_Req_Qty: number;
    // tslint:disable-next-line: variable-name
    RM_Require_Date: string;
    // tslint:disable-next-line: variable-name
    RM_Remarks: string;
    // tslint:disable-next-line: variable-name
    RM_UOM: string;
    Raw_Material_Details_Name: string;
}

export class ModelForSaving {
    BranchIndentDetails: BranchIndentDetails;
    BranchIndentMaterialDetails: BranchIndentMaterialDetails[];
}
