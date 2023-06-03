import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/constants/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { HarvestAreas } from '../../../secure/finished-semifinished-opening-stocks/finished-semifinished-opening.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmountAdvancesToFarmersService {

  constructor(private http: HttpClient) { }
  private getHarvestAreasUrl = AppConstants.apiUrlGetHarvestAreas;
  private getAreaDetailsByCodeUrl = AppConstants.apiUrlSearchAreaByCode;
  private getAllFarmersUrl = AppConstants.apiUrlGetAllfarmers;
  private getFieldSupervisorListUrl = AppConstants.apiUrlGetFieldSupervisorList;
  private getFieldStaffListUrl = AppConstants.apiUrlGetFieldStaffList;
  private getAmntAdvToFarmerListUrl = AppConstants.apiUrlGetAmntAdvToFarmerList;
  private saveAdvanceCashDetailsUrl = AppConstants.apiUrlSaveAdvanceCashDetails;
  baseUrl = environment.baseServiceURL;

  getHarvestAreas() {
    return this.http.get<HarvestAreas[]>(this.getHarvestAreasUrl);
  }

  getCropGroup() {
    return this.http.get<any>(this.baseUrl + 'GetCropGroup');
  }

  getCropCode(cropGroupCode) {
    return this.http.get<any>(this.baseUrl + `GetCropNameCode/${encodeURIComponent(cropGroupCode)}`);
  }

  getSeasonFromTo(cropNameCode) {
    return this.http.get<any>(this.baseUrl + `GetSeasonFromTo/${encodeURIComponent(cropNameCode)}`);
  }

  GetAreaDetailsByCode(areaCode) {
    return this.http.get<any>(this.getAreaDetailsByCodeUrl + encodeURIComponent(areaCode));
  }

  getAllFarmers() {
    return this.http.get<any>(this.getAllFarmersUrl);
  }
  GetFieldSupervisorList(areaId, aggrementDate) {
    return this.http.get<any>(this.getFieldSupervisorListUrl.replace('{areaId}', encodeURIComponent(areaId)).replace('{aggrementDate}', encodeURIComponent(aggrementDate.toISOString())));
  }
  GetFieldStaffList(areaId, aggrementDate) {
    return this.http.get<any>(this.getFieldStaffListUrl.replace('{areaId}', encodeURIComponent(areaId)).replace('{aggrementDate}', encodeURIComponent(aggrementDate.toISOString())));
  }
  GetAdvAmountToFarmerDetails(farmerSearchReq) {
    return this.http.post<any>(this.getAmntAdvToFarmerListUrl, farmerSearchReq);
  }

  SaveAdvanceCashDetails(advanceCashDetail) {
    return this.http.post<any>(this.saveAdvanceCashDetailsUrl, advanceCashDetail)
  }
}
