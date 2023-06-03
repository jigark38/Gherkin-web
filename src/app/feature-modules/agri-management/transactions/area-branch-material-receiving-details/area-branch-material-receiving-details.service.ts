import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AreaBranchMaterialReceivingDetailsService {

  private getAreaCodeURL = AppConstants.apiUrlGetAreaCode;
  private getGridDataURL = AppConstants.apiUrlGetGridData;
  private getSeasonDatesURL = AppConstants.apiUrlGetSeasonDates;
  private getAreaMRNoURL = AppConstants.apiUrlGetAreaMRNo;
  private getGetAreaBranchInchargeURL = AppConstants.apiUrlGetAreaBranInchar;
  private saveAreaMRDetailsURL = AppConstants.apiUrlSaveAreaMRDetails;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  constructor(private http: HttpClient) { }

  getAreaCode() {
    return this.http.get(this.getAreaCodeURL, this.httpOptions);
  }
  getGridData(areaId) {
    return this.http.get(this.getGridDataURL + areaId, this.httpOptions);
  }
  getSeasonDates(areaId, RMTransferNo) {
    return this.http.get(this.getSeasonDatesURL.replace('{0}', encodeURIComponent(areaId)).replace('{1}',
      encodeURIComponent(RMTransferNo)), this.httpOptions);
  }
  getAreaBranchIncharge(areaId, RMTransferNo) {
    return this.http.get(this.getGetAreaBranchInchargeURL.replace('{0}',
      encodeURIComponent(areaId)).replace('{1}', encodeURIComponent(RMTransferNo)), this.httpOptions);
  }
  getAreaMRNo() {
    return this.http.get(this.getAreaMRNoURL, this.httpOptions);
  }
  saveAreaMRDetails(payload) {
    return this.http.post(this.saveAreaMRDetailsURL, payload, this.httpOptions);
  }
}
