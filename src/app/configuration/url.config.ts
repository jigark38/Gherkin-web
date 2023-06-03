import { environment } from '../../environments/environment';
const PRODUCT_GRADE_MASTER = {
  getProductGroups: `${environment.baseServiceURL}GetallProductGroup/`,
  addProductGroup: `${environment.baseServiceURL}ProductGroup/AddProductGroup/`,
  getProductVariety: `${environment.baseServiceURL}GetVareityByprodgrpcode?prodgroupcode=`,
  addProductVariety: `${environment.baseServiceURL}ProductDetails/AddVeraiety/`,
  addProductGrade: `${environment.baseServiceURL}Addgrade/`,
  getProductGrade: `${environment.baseServiceURL}GetGrade/`,
  getProductDetails: `${environment.baseServiceURL}GetallProductGroupDetailsGrid/`,
};
const OVERSEAS = {
  getAllOverseasCountry: `${environment.baseServiceURL}v1/countryoverseas/AllCountryOverseas`,
  saveOverseasCountry: `${environment.baseServiceURL}v1/countryoverseas/SearchCountry/`,
  getAllStatesByCountry: `${environment.baseServiceURL}v1/stateoverseas/all/`,
  saveOverseasState: `${environment.baseServiceURL}v1/stateoverseas/SearchState/`,
  getAllCityByStateID: `${environment.baseServiceURL}v1/cityoverseas/all/`,
  saveOverseasCity: `${environment.baseServiceURL}v1/countryoverseas/SearchCountry/`,
  getCurrency: `${environment.baseServiceURL}v1/currency/AllCurrency/`,
  saveCurrency: `${environment.baseServiceURL}v1/currency/SearchCurrency/`,
  saveConsignee: `${environment.baseServiceURL}ConsigneeBuyers/AddConsgineeDeatils/`
  // getOverseasDistrictByStateId: `${environment.baseServiceURL}v1/country/aldistrict/all/`,
};
const MATERIAL_INDENT = {
  getAllArea: `${environment.baseServiceURL}Area/GetAllArea/`,
  getMaterialUOM: `${environment.baseServiceURL}branchIndent/GetRMUOM/`,
  getAllMaterialGroup: `${environment.baseServiceURL}rawmaterial/master/`,
  getAllMaterialNameByMaterialGroupCode: `${environment.baseServiceURL}rawmaterial/GetRMDeatilsCodeNameByGroupCode`,
  saveIndentMaterial: `${environment.baseServiceURL}branchIndent/insert/`,
  GetAllIndentRequest: `${environment.baseServiceURL}branchIndent/GetAllIndentRequest/`,
  updateIndentMaterial: `${environment.baseServiceURL}branchIndent/UpdateIndentMaterial/`,
};
const PACKAGE_OF_PRACTICE = {
  getAllCropGroups: `${environment.baseServiceURL}GetCropGroup/`,
  getAllCropByGroupCode: `${environment.baseServiceURL}GetCropNameByCropGroup`,
  getAllPSNoByCropNameCode: `${environment.baseServiceURL}GetPSNOByCropNameCode`,
  getPSNoByCropAndHBOMDivisionForFind: `${environment.baseServiceURL}GetPSNoByCropAndHBOMDivisionForFind`,
  getAllPhaseEffectiveDateByCropNameCode: `${environment.baseServiceURL}GetTransCodeByCropNameCode`,
  getAllCropPhaseNameByPackageOfPractice: `${environment.baseServiceURL}GetCropPhaseCodeByPackageOfPractice`,
  getAllHarvestDetailsByPhaseCode: `${environment.baseServiceURL}GetHarvestByCropPhaseCode`,
  getCropStageList: `${environment.baseServiceURL}GetCropStageList`,
  savePracticeDetails: `${environment.baseServiceURL}AddPracticeDeatils`,
  getUOM: `${environment.baseServiceURL}GetChemicalUOM`,

};

const SHIFT_DETAILS = {
  saveShiftDetail: `${environment.baseServiceURL}AddShiftDetails/`,
  cancelShift: `${environment.baseServiceURL}AddShiftStatus/`,
  getShiftList: `${environment.baseServiceURL}GetAllShiftDetails/`,
};


export const URLS = {
  ...PRODUCT_GRADE_MASTER,
  ...OVERSEAS,
  ...MATERIAL_INDENT,
  ...PACKAGE_OF_PRACTICE,
  ...SHIFT_DETAILS
};
