import { environment } from '../../environments/environment';

export class AppConstants {

  public static apiUrlGetCropGroup = environment.baseServiceURL + 'GetCropGroup';
  public static apiUrlAddCropGroup = environment.baseServiceURL + 'AddCropGroup';
  public static apiUrlAddCrop = environment.baseServiceURL + 'AddCrop';
  public static apiUrlAddCropScheme = environment.baseServiceURL + 'AddCropScheme';
  public static apiUrlGetFarmerWiseSummaryDetails = environment.baseServiceURL + 'FarmerWiseSummary/GetFarmersByAreaIdAndpsNo?areaId={areaId}&psNo={psNo}';
  public static apiUrlGetCrops = environment.baseServiceURL + 'GetAllCrops';
  public static apiUrlGetPlantationSchemes = environment.baseServiceURL + 'GetSeasonFromTo/{CNameCode}';
  public static apiUrlSearchCrops = environment.baseServiceURL + 'Search';
  public static apiUrlUpdateCrops = environment.baseServiceURL + 'EditCrop';
  // Country
  public static apiUrlCountry = environment.baseServiceURL + 'v1/Country/GetAllCountries';
  public static apiUrlAddCountry = environment.baseServiceURL + 'v1/Country/AddCountry?countryName={countryName}';
  // State
  public static apiUrlState = environment.baseServiceURL + 'v1/state/GetAllStatesByCountyCode?countryCode={countryCode}';
  public static apiUrlSaveState = environment.baseServiceURL + 'v1/state/AddState';
  // District
  public static apiUrlDistrict = environment.baseServiceURL + 'v1/district/GetAllDistrictsByStateCode?stateCode={stateCode}';
  public static apiUrlSaveDistrict = environment.baseServiceURL + 'v1/district/AddDistrict';
  public static apiUrlDistrictByCode = environment.baseServiceURL + 'v1/district/GetDistrictByCode?districtCode={districtCode}';
  // Place
  public static apiUrlGetPlaceByDistCode = environment.baseServiceURL + 'GetPlacesByDistrictCode?distCode={distCode}';
  public static apiUrlSavePlace = environment.baseServiceURL + 'CreatePlace';
  public static apiUrlCityOverseas = environment.baseServiceURL + 'v1/cityoverseas/all/{stateCode}';
  // Mandal
  public static apiUrlAllMandal = environment.baseServiceURL + 'GetAllMandals';
  public static apiUrlMandalByDistrict = environment.baseServiceURL + 'GetMandalByCode?districtCode={districtCode}';
  public static apiUrlMandalByCode = environment.baseServiceURL + 'GetMandalByCode?districtCode={mandalCode}';
  // Village
  public static apiUrlVillageByMandal = environment.baseServiceURL + 'GetVillagesByMandalCode/{mandalCode}';
  public static apiUrlVillage = environment.baseServiceURL + 'GetAllVillages';
  public static apiUrlVillageByCode = environment.baseServiceURL + 'GetAllVillageByCode/{villageCode}';
  public static apiUrlGetAllfarmers = environment.baseServiceURL + 'GetAllFarmers';
  public static apiUrlGetFarmersByState = environment.baseServiceURL + 'farmerbystatecode?stateCode={stateCode}';
  public static apiUrlGetFarmersByVillage = environment.baseServiceURL + 'GetFarmersByVillageCode?villageCode={villageCode}';
  public static apiUrlGetFarmerById = environment.baseServiceURL + 'GetFarmerByCode?code={Id}';
  public static apiUrlUpdateFarmer = environment.baseServiceURL + 'UpdateFarmer';
  public static apiUrlSaveFarmerDetail = environment.baseServiceURL + 'AddFarmer';
  public static apiUrlUploadFile = environment.baseServiceURL + 'UploadDocuments';
  public static apiUrlSaveFile = environment.baseServiceURL + 'SaveFarmerDocument?farmerCode={farmerCode}&fileName={fileName}';
  public static apiUrlAddBankAccount = environment.baseServiceURL + 'AddFarmerBankAccountDetails';
  public static apiUrlGetFarmerDocByFarmercode = environment.baseServiceURL + 'GetFarmerDocumentsbyFarmerCode?code={Farmer_cod}';
  public static apiUrlGetFieldStaff = environment.baseServiceURL + 'GetAllFieldStaff';
  public static apiUrlGetFieldStaffByArea = environment.baseServiceURL + 'GetFieldStaffbyArea?area=';
  public static apiUrlUpdateFieldStaff = environment.baseServiceURL + 'UpdateFieldStaff';
  public static apiUrlAddFieldStaff = environment.baseServiceURL + 'CreateFieldStaffs';
  public static apiUrlGetArea = environment.baseServiceURL + 'Area/GetAllArea';
  public static apiUrlGetDepartment = environment.baseServiceURL + 'GetDepartment';
  public static apiUrlGetSubDepartment = environment.baseServiceURL + 'GetSubdepartment/{DeptId}';
  public static apiUrlGetDesignationBySubDepart = environment.baseServiceURL + 'GetDesignations/{subDepartment}';
  public static apiUrlGetAllDesignation = environment.baseServiceURL + 'GetAllDesignations';
  public static apiUrlGetEmpByDesg = environment.baseServiceURL + 'GetEmployee?designation=';
  public static apiUrlGetEmpByEmpId = environment.baseServiceURL + 'GetEmployee/{empId}';
  public static apiUrlGetAllEmployee = environment.baseServiceURL + 'GetAllEmployee';
  public static apiUrlAddSchedulePlantation = environment.baseServiceURL + 'SchedulePlantation';
  public static apiUrlGetPlantationSchedules = environment.baseServiceURL + 'SearchPlantationSchedule?cropGroup={crpGrp}&cropName={crpName}';
  public static apiUrlGetAllSchedules = environment.baseServiceURL + 'GetPlantationSchedules';
  public static apiUrlUpdateSchedule = environment.baseServiceURL + 'UpdatePlantationSchedule';
  public static apiUrlGetProductGroups = environment.baseServiceURL + 'GetallProductGroup/';
  public static apiUrlAddProductGroup = environment.baseServiceURL + 'AddProductGroup/';
  public static apiUrlGetProductVariety = environment.baseServiceURL + 'GetVareityByprodgrpcode?prodgroupcode=';
  public static apiUrlAddProductVariety = environment.baseServiceURL + 'AddVeraiety/';
  public static apiUrlAddProductGrade = environment.baseServiceURL + 'Addgrade/';
  public static apiUrlGetProductGrade = environment.baseServiceURL + 'GetGrade/';
  public static apiUrlGetProductDetails = environment.baseServiceURL + 'GetallProductGroupDetailsGrid/';
  public static apiUrlGetAllOverseasCountry = environment.baseServiceURL + 'GetAllCountriesOverseas';
  public static apiUrlSaveOverseasCountry = environment.baseServiceURL + 'AddCountryByName/';
  public static apiUrlGetAllStatesByCountry = environment.baseServiceURL + 'GetAllStatesOverseasByCountry?countryCode=';
  public static apiUrlSaveOverseasState = environment.baseServiceURL + 'AddStateByName/';
  public static apiUrlGetAllCityByStateID = environment.baseServiceURL + 'GetAllCityOverseasByState?stateCode=';
  public static apiUrlSaveOverseasCity = environment.baseServiceURL + 'GetCityOverseasByname/';
  public static apiUrlGetCurrency = environment.baseServiceURL + 'GetAllCurrency/';
  public static apiUrlSaveCurrency = environment.baseServiceURL + 'AddCurrencyByName/';
  // Consignee & Buyer
  public static apiUrlSaveConsignee = environment.baseServiceURL + 'AddConsgineeDeatils';
  public static apiUrlUpdateConsignee = environment.baseServiceURL + 'UpdateConsgineeDeatils?id={0}';
  public static apiUrlGetConsigneesByType = environment.baseServiceURL + 'GetConsigneeBuyerNameByConsgType?consgType={0}';
  public static apiUrlGetConsigneesByCode = environment.baseServiceURL + 'GetConsigneeBuyersById?consgType={0}&CBCode={1}';
  public static apiUrlDeleteFarmerDocumentsByID = environment.baseServiceURL + 'DeleteFarmerDocumentsByID?Id={DocId}';
  public static apiUrlGetAllCropGroups = environment.baseServiceURL + 'GetCropGroup/';
  public static apiUrlGetCropNames = environment.baseServiceURL + 'GetCropNameCode/{groupCode}';
  public static apiUrlGetAllCropByGroupCode = environment.baseServiceURL + 'GetCropNameByCropGroup?CropGroupCode=';
  public static apiUrlGetAllPSNoByCropNameCode = environment.baseServiceURL + 'GetPSNOByCropNameCode?CropNameCode=';
  public static apiUrlGetAllPhaseEffectiveDateByCropNameCode = environment.baseServiceURL + 'GetTransCodeByCropNameCode?CropNameCode=';
  public static apiUrlGetAllCropPhaseNameByTransCode = environment.baseServiceURL + 'GetCropPhaseCodeByTransCode?Transcode=';
  public static apiUrlGetAllHarvestDetailsByPhaseCode = environment.baseServiceURL + 'GetHarvestByCropPhaseCode?HcropPhasecode=';
  public static apiUrlGetHarvestArea = environment.baseServiceURL + 'v1/harvestArea/areaNameAndCode';
  public static apiUrlGetAllProductGroups = environment.baseServiceURL + 'GetAllProdGroup';
  public static apiUrlGetVariety = environment.baseServiceURL + 'GetVariety/';
  public static apiUrlSaveProductionProcess = environment.baseServiceURL + 'SaveProductionProcess';
  public static apiUrlAllSavedProductGroup = environment.baseServiceURL + 'GetAllSavedProductGroup';
  public static apiUrlSavedVariety = environment.baseServiceURL + 'GetSavedVariety/';
  public static apiUrlFetchProdProcess = environment.baseServiceURL + 'FetchProdProcess';
  public static apiUrlSaveProductionProcessBOM = environment.baseServiceURL + 'SaveProductionProcessBOM';
  public static apiUrlGetRawMaterialGroup = environment.baseServiceURL + 'GetRawMaterialGroup';
  public static apiUrlGetRawMaterialDetailsGroup = environment.baseServiceURL + 'GetRawMaterialDetails/';
  public static apiUrlGetProductionUOM = environment.baseServiceURL + 'GetProductionUOM/';
  public static apiUrlGetMaterialUOM = environment.baseServiceURL + 'GetMaterialUOM/';

  // rawMaterial
  public static apiUrlGetAllMaterialGroups = environment.baseServiceURL + 'rawmaterial/master/';
  public static apiUrlGetAllMaterialNameByMaterialGroupCode = environment.baseServiceURL + 'rawmaterial/GetRMDeatilsCodeNameByGroupCode?rawMaterialGroupCode=';
  public static apiUrlSavePracticeDetails = environment.baseServiceURL + 'AddPracticeDeatils';
  public static apiUrlInwardDetail = environment.baseServiceURL + 'MaterialInward/getAll';
  public static apiUrlPendingPurchaseOrder = environment.baseServiceURL + 'GetAllPendingPurchaseOrder';
  // Supplier Details

  public static apiUrlSupplierDetailsByID = environment.baseServiceURL + 'getSupplierDetailsByID?SupplierOrgID={0}';
  public static apiUrlAddSupplierDetail = environment.baseServiceURL + 'addSupplierDetails';
  public static apiUrlUpdateSupplierDetail = environment.baseServiceURL + 'updateSupplierDetails';
  public static apiUrlGetAllSupplierOrgs = environment.baseServiceURL + 'getAllSupplierOrgs';

  public static apiUrlGetGRNCode = environment.baseServiceURL + 'GetGRNCode';
  public static apiUrlGetCountryByCode = environment.baseServiceURL + 'v1/Country/GetCountryByCode?countryCode=';
  public static apiUrlAddGoodsReceiptNoteDetails = environment.baseServiceURL + 'CreateGoodsReceiptNote';
  public static apiUrlGetGRNCodeBySupOrgId = environment.baseServiceURL + 'GetGRNCodeBySupOrgId?SupOrgId={SupOrgId}';
  public static apiUrlGetGoodsReceiptNoteByGRNCode = environment.baseServiceURL + 'GetGoodsReceiptNoteByGRNCode?GRNCode={GRNCode}';
  public static apiUrlUpdateGoodsReceiptNoteDetails = environment.baseServiceURL + 'UpdateGoodsReceiptNote';
  public static apiUrlupdateBatchMaterialDetails = environment.baseServiceURL + 'UpdateBatchMaterialDetails';
  public static apiUrlGetAllMaterialOutwardDetails = environment.baseServiceURL + 'GetAllMaterialOutwardDetails';
  public static apiUrlPostMaterialOutwardDetails = environment.baseServiceURL + 'UpdateBatchMaterialDetails';

  public static apiUrlGetAreaCode = environment.baseServiceURL + 'api/V1/AreaMaterialReceived/GetHarvestAreaDetails';
  public static apiUrlGetGridData = environment.baseServiceURL + 'api/V1/AreaMRInward/GridData/';
  public static apiUrlGetSeasonDates = environment.baseServiceURL + 'api/V1/AreaMRInward/Note1?areaid={0}&RMTransferNo={1}';
  public static apiUrlGetAreaBranInchar = environment.baseServiceURL + 'api/V1/AreaMRInward/Note2?areaid={0}&RMTransferNo={1}';
  public static apiUrlGetAreaMRNo = environment.baseServiceURL + 'api/V1/AreaMRInward/GetAreaMRNo';
  public static apiUrlSaveAreaMRDetails = environment.baseServiceURL + 'api/V1/AreaMRInward/SaveAreaMRDetails';

  public static apiUrlSowingAndFarmingDetails = environment.baseServiceURL + 'GetSowingFarmingDataForFormByAreaId?areaId={areaCode}';
  public static apiUrlSowingGridDetails = environment.baseServiceURL + 'GetSowingFarmingDataForFormRequiredForGrid?sowingDate={SowingDate}&cropNameCode={CropCode}&psNumber={PSNo}';
  public static apiUrlSearchAreaByCode = environment.baseServiceURL + 'v1/harvestArea/SearchArea?areaId=';
  public static apiUrlAddSowingDetails = environment.baseServiceURL + 'sowingFarming/insert';

  public static apiUrlGetOfficeLocations = environment.baseServiceURL + 'Organisation/GetOfficeLocations';
  public static apiUrlGetAllGradeByVariety = environment.baseServiceURL + 'GetAllGradeByVariety?Varietycode=';
  public static apiUrlGetProductionDetails = environment.baseServiceURL + 'GetProductionDetails';
  // public static apiUrlGetProformaInvoiceId = environment.baseServiceURL + 'GetProformaInvoiceId';


  public static apiUrlGetProductionScheduleId = environment.baseServiceURL + 'GetProductionScheduleId';
  public static apiUrlAddProductionScheduleDetails = environment.baseServiceURL + 'AddProductionScheduleDetails';
  public static apiUrlGetMediaProcessNameList = environment.baseServiceURL + 'GetMediaProcessNameList';


  public static apiUrlGetAllWeekDays = environment.baseServiceURL + 'GetAllWeekDays';
  public static apiUrlGetYearlyCalendarDetails = environment.baseServiceURL + 'GetYearlyCalendarDetailsByEmpId?employeeId=';
  public static apiUrlAddYearlyCalendarDetails = environment.baseServiceURL + 'AddYearlyCalendarDetails';
  public static apiUrlAddWeeklyHolidays = environment.baseServiceURL + 'AddWeeklyHolidays';
  public static apiUrlAddStatutoryHolidays = environment.baseServiceURL + 'AddStatutoryHolidays';

  // Input issued to Field Staff
  public static apiUrlGetOutwaredGatePassAPI = environment.baseServiceURL + 'GetOutwardGatePassNo';
  public static apiUrlGetAllOrgOfficeLocDetails = environment.baseServiceURL + 'GetAllOrgOfficeLocDetails';
  public static apiUrlGetHarvestAreaDetailsAPI = environment.baseServiceURL + 'GetAllArea';
  public static apiUrlGetEmpInfoByAreaId = environment.baseServiceURL + 'GetEmpInfoByAreaId?areaId={areaId}';
  public static apiUrlGetCropGroupDetailsByAreaId = environment.baseServiceURL + 'GetCropGroupDetailsByAreaId?areaId={areaId}';
  public static apiUrlgetCropNameByGroupCodeAPI = environment.baseServiceURL + 'GetCropDetailsByCode?cropGroupCode={cropGroupCode}';
  public static apiUrlGetPlantationSchByAreaIdAPI = environment.baseServiceURL + 'GetPlantationSchByCropNameCode?cropNameCode={cropNameCode}';
  public static apiUrlGetHBOMMatDetailsByCropNameCodeAndPSNumAPI = environment.baseServiceURL + 'GetHBOMMatDetailsByCropNameCode?cropNameCode={cropNameCode}&psNum={psNum}';
  public static apiUrlGetRMStockDetailsA = environment.baseServiceURL + 'GetRMStockDetails_A?transferDate={transferDate}&matGroupCode={matGroupCode}&matDetailCode={matDetailCode}';
  public static apiUrlAddToFieldStaffMats = environment.baseServiceURL + 'AddToFieldStaffMaterials';
  public static apiUrMatIssueFSno = environment.baseServiceURL + 'GenerateMatIssueFSNo';

  // Finished / Semifinished Opening Stock Details
  public static apiUrlGetOrganisationOfficeUnits = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetOrganisationOfficeUnits';
  public static apiUrlGetHarvestAreas = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetHarvestAreas';
  public static apiUrlGetCountryOverSeas = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetCountryOverSeas';
  public static apiUrlGetConsigneeBuyersList = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetConsigneeBuyersList?overseasCountryId={overseasCountryId}';
  public static apiUrlGetProformaInvoices = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetProformaInvoices?cBCode={cBCode}';
  public static apiUrlGetFinishedProductGroups = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetFinishedProductGroups';
  public static apiUrlGetFinishedProductDetails = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetFinishedProductDetails?GrpCode={GrpCode}';
  public static apiUrlGetProductionProcessDetails = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetProductionProcessDetails?VarietyCode={VarietyCode}';
  public static apiUrlGetMediaProcessDetails = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetMediaProcessDetails?ProductionProcessCode={ProductionProcessCode}';
  public static apiUrlGetFPGradesDetails = environment.baseServiceURL +
    'api/V1/FinishedSFOpeningStock/GetFPGradesDetails?VarietyCode={VarietyCode}';
  public static apiUrlGetContainerPackingDetails = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetContainerPackingDetails';
  public static apiUrlGetUOMDetails = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetUOMDetails';
  public static apiUrlSaveFinishedSFOpeningStock = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/SaveFinishedSFOpeningStock';
  public static apiUrlGetStockDetails = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/GetStockDetails';
  public static apiUrlupdateStockDetals = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/UpdateStockDetals';
  public static apiUrlDeleteStockDetals = environment.baseServiceURL + 'api/V1/FinishedSFOpeningStock/DeleteStockDetals?FSFStockQuantityNo={FSFStockQuantityNo}';

  public static apiUrlAddBuyingStaffDetails = environment.baseServiceURL + 'api/V1/BuyingStaffDetails/Add';
  public static apiUrlUpdateBuyingStaffDetails = environment.baseServiceURL + 'api/V1/BuyingStaffDetails/Update';
  public static apiUrlGetBuyingStaffDetailsByEmployee = environment.baseServiceURL + 'api/V1/BuyingStaffDetails/Get?employeId={employeId}';
  public static apiUrlDeleteBuyingStaffDetails = environment.baseServiceURL + 'api/V1/BuyingStaffDetails/Delete?employeId={employeId}&areaId={areaId}';

  public static apiUrlGetFieldSupervisorList = environment.baseServiceURL + 'api/V1/AdvanceCashIssuedToFarmers/GetFieldSupervisorList?areaId={areaId}&aggrementDate={aggrementDate}';
  public static apiUrlGetFieldStaffList = environment.baseServiceURL + 'api/V1/AdvanceCashIssuedToFarmers/GetFieldStaffList?areaId={areaId}&aggrementDate={aggrementDate}';
  public static apiUrlGetAmntAdvToFarmerList = environment.baseServiceURL + 'api/V1/AdvanceCashIssuedToFarmers/GetFarmerDetails';
  public static apiUrlSaveAdvanceCashDetails = environment.baseServiceURL + 'api/V1/AdvanceCashIssuedToFarmers/AddAdvanceCashToFarmer';

  public static apiUrlSaveGreensAgntSuppDetail = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/SaveGreensAgentSupplierDetails';
  public static apiUrlGetAgentOrganisationDetail = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/GetAgentOrganisationDetails';
  public static apiUrlGetSupplierInformationDetail = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/GetSupplierInformationDetail?agentOrgID={agentOrgID}';
  public static apiUrlSaveBankAccountDetails = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/SaveBankAccountDetails'
  public static apiUrlGetDocumentByDocId = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/GetDocumentByDocId?docId ={docId}';
  public static apiUrlDeleteDocumentByDocId = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/DeleteDocumentByDocId?docId ={docId}';
  public static apiUrlModifyGreensAgentSupplier = environment.baseServiceURL + 'api/V1/GreensAgentSupplier/ModifyGreensAgentSupplierDetails';

  public static apiUrlGetInwardDetails = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/GetInwardDetails?officeOrgNumber={officeOrgNumber}';
  public static apiUrlGetSupplierInformationDetails = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/GetSupplierInformationDetail';
  public static apiUrlGetCropSchemeDetails = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/GetCropSchemeDetails?cropNameCode=';
  public static apiUrlPartialSaveGreensRecvDetails = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/PartialSaveGreensRecvDetails';
  public static apiUrlGetLocations = environment.baseServiceURL + 'api/V1/GradingWeight/GetLocation';
  public static apiUrlGetGreensRecvDetailsByGatePass = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/GetGreensRecvDetails?inwardGatepassNo=';
  public static apiUrlChangeInGoingStatus = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/ChangeInGoingStatus?GRNNo=';
  public static apiUrlSaveGreensRecvDetails = environment.baseServiceURL + 'api/V1/AgentsGreensReceivingWeighment/SaveRecvWeighmentDetails';


}

