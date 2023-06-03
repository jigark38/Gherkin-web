export interface SupplierDetails {
  creationDate: string;
  userName: string;
  organisationName: string;
  legalStatus: string;
  address: string;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  placeId: string;
  place: string;
  pinCode: number;
  mgmName: string;
  designation: string;
  mgmContactNumber: number;
  correspondanceMailID: string;
  altCorrespondanceMailID: string;
  cP: string;
  cPDesignation: string;
  cPNumber: number;
  cPMailID: string;
  officeNumber: number;
  activity: string;
  gSTNo: string;
  website: string;
  licenseNo: string;
  bankName: string;
  bankBranch: string;
  bankACNumber: number;
  bankIFSC: string;
  approvedBy: string;
  document: string;
  documentPath: string;
  documentList: { documentName: string, documentPath: string }[];
}

