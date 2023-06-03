import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../../../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class GreensAgentSupplierService {

  constructor(private http: HttpClient) { }

  private getCountryUrl = AppConstants.apiUrlCountry;
  private getStateUrl = AppConstants.apiUrlState;
  private getDistrictUrl = AppConstants.apiUrlDistrict;
  private getVillagebyMandalUrl = AppConstants.apiUrlVillageByMandal;
  private getMandalByDistrictUrl = AppConstants.apiUrlMandalByDistrict;
  private getPlaceByDistrictUrl = AppConstants.apiUrlGetPlaceByDistCode;
  private saveGreensAgntSuppDetailUrl = AppConstants.apiUrlSaveGreensAgntSuppDetail;
  private getAgentOrganisationDetailUrl = AppConstants.apiUrlGetAgentOrganisationDetail;
  private getSupplierInformationDetailUrl = AppConstants.apiUrlGetSupplierInformationDetail;
  private saveBankAccountDetailsUrl = AppConstants.apiUrlSaveBankAccountDetails;
  private getDocumentByDocIdUrl = AppConstants.apiUrlGetDocumentByDocId;
  private deleteDocumentByDocIdUrl = AppConstants.apiUrlDeleteDocumentByDocId;
  private modifyGreensAgentSupplierUrl = AppConstants.apiUrlModifyGreensAgentSupplier;

  getCountryList() {
    return this.http.get(this.getCountryUrl);
  }
  getStateList(countrycode) {
    return this.http.get(this.getStateUrl.replace('{countryCode}', encodeURIComponent(countrycode)));
  }

  getDistrictList(statecode) {
    return this.http.get(this.getDistrictUrl.replace('{stateCode}', encodeURIComponent(statecode)));
  }

  getMandalByDistrict(districtCode) {
    return this.http.get(this.getMandalByDistrictUrl.replace('{districtCode}', encodeURIComponent(districtCode)));
  }

  getPlaceByDistrict(districtCode) {
    return this.http.get(this.getPlaceByDistrictUrl.replace('{distCode}', encodeURIComponent(districtCode)));
  }

  getVillageListByMandal(mandalCode) {
    return this.http.get(this.getVillagebyMandalUrl.replace('{mandalCode}', encodeURIComponent(mandalCode)));
  }
  saveSupplierdetails(supplirDetail) {
    return this.http.post(this.saveGreensAgntSuppDetailUrl, supplirDetail);
  }

  GetAgentOrganisationDetails() {
    return this.http.get(this.getAgentOrganisationDetailUrl);
  }

  GetSupplierInformationDetail(agentOrgID) {
    return this.http.get(this.getSupplierInformationDetailUrl.replace('{agentOrgID}', encodeURIComponent(agentOrgID)));
  }

  saveBankAccountDetails(BankDetailList) {
    return this.http.post(this.saveBankAccountDetailsUrl, BankDetailList);
  }
  getDocumentByDocId(docId) {
    return this.http.get(this.getDocumentByDocIdUrl.replace('{docId}', encodeURIComponent(docId)));
  }
  deleteDocumentByDocId(docId) {
    return this.http.delete(this.deleteDocumentByDocIdUrl.replace('{docId}', encodeURIComponent(docId)));
  }

  modifyGreensAgentSupplier(supplirDetail) {
    return this.http.post(this.modifyGreensAgentSupplierUrl, supplirDetail);
  }
}
