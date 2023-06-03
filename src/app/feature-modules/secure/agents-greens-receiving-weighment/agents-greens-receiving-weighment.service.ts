import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { CropGroup, CropName, SeasonFromTo } from '../../agri-management/master/package-of-practice/package-of-practice.model';
import { GreensAgentReceivedDetails } from './agents-greens-receiving-weighment.model';



@Injectable({
  providedIn: 'root'
})


export class AgentsGreensReceivingWeighmentService {

  baseUrl = environment.baseServiceURL;

  constructor(private http: HttpClient) {
  }

  private getInwardDetailsUrl = AppConstants.apiUrlGetInwardDetails;
  private getSupplierInformationDetailsUrl = AppConstants.apiUrlGetSupplierInformationDetails;
  private getCropGrpUrl = AppConstants.apiUrlGetCropGroup;
  private GetAllCropByGroupCodeUrl = AppConstants.apiUrlGetAllCropByGroupCode;
  private GetAllPSNoByCropNameCodeUrl = AppConstants.apiUrlGetAllPSNoByCropNameCode;
  private GetCropSchemeDetailsUrl = AppConstants.apiUrlGetCropSchemeDetails;
  private PartialSaveGreensRecvDetailsUrl = AppConstants.apiUrlPartialSaveGreensRecvDetails;
  private GetLocationsUrl = AppConstants.apiUrlGetLocations;
  private GetGreensRecvDetailsByGatePassUrl = AppConstants.apiUrlGetGreensRecvDetailsByGatePass;
  private SaveGreensRecvDetailsUrl = AppConstants.apiUrlSaveGreensRecvDetails;
  private ChangeOnGoingStatusUrl = AppConstants.apiUrlChangeInGoingStatus;

  getAllOrganizations() {
    return this.http.get<any>(this.baseUrl + 'Organisation/GetOrganisations');
  }

  getInwardDetails(officeOrgNumber) {
    return this.http.get<any>(this.getInwardDetailsUrl.replace('{officeOrgNumber}', encodeURIComponent(officeOrgNumber)))
  }

  getSupplierInformationDetails() {
    return this.http.get<any>(this.getSupplierInformationDetailsUrl);
  }

  getCropGroupList() {
    return this.http.get<CropGroup[]>(this.getCropGrpUrl);
  }

  getCropListByCropGroupCode(cropGroupCode: string) {
    return this.http.get<CropName[]>(this.GetAllCropByGroupCodeUrl + cropGroupCode)
  }

  getAllPSNoByCropNameCode(psNo: string) {
    return this.http.get<SeasonFromTo[]>(this.GetAllPSNoByCropNameCodeUrl + psNo)
  }

  getCropSchemeDetails(cropNameCode: string) {
    return this.http.get<any>(this.GetCropSchemeDetailsUrl + cropNameCode);
  }

  partialSaveGreensRecvDetails(greensAgentReceivedDetails: GreensAgentReceivedDetails) {
    return this.http.post<any>(this.PartialSaveGreensRecvDetailsUrl, greensAgentReceivedDetails)
  }

  getLocatons() {
    return this.http.get<any>(this.GetLocationsUrl);
  }

  GetGreensRecvDetailsByGatePass(gatePassNo) {
    return this.http.get<any>(this.GetGreensRecvDetailsByGatePassUrl + gatePassNo);
  }

  SaveGreensRecvDetails(agentsGrnRecivWeignment: GreensAgentReceivedDetails) {
    return this.http.post<any>(this.SaveGreensRecvDetailsUrl, agentsGrnRecivWeignment);
  }

  ChangeOnGoingStatus(grnNo: number) {
    return this.http.get<any>(this.ChangeOnGoingStatusUrl + grnNo);
  }

}
