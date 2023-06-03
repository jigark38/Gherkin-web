export class StoreInternalIndentMaster {
  id: number;
  storeInternalIndentNo: string;
  storeInternalIndentDate: Date;
  empId: string;
  deptId: string;
}

export class StoreInternalIndentDetail {
  id: number;
  storeInternalIndentNo: string;
  storeMaterialGroupCode: number;
  storeMaterialSubGroupCode: number;
  storeMaterialItemCode: number;
  storeDeptIndentQty: number;
  storeDeptIndentReqDate: Date;
  gsGroupName: string;
  gsSubGroupName: string;
  gscUOMName: string;
  gsMaterialName: string;
  isEditing: boolean;
  indentQtyEmpty: boolean;
  indentQtyNotInFormat: boolean;
  indentQtyString: string;
}
