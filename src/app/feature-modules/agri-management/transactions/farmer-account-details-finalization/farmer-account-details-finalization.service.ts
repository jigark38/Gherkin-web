import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FarmerAccountDetailsFinalizationService {
  baseUrl = environment.baseServiceURL;
  constructor(private http: HttpClient) { }

  //drills

  getAllAreas() {
    return this.http.get<any>(this.baseUrl + 'Area/GetAllArea');
  }

  getFieldStaffListByAreaId(areaId, fieldtype) {
    return this.http.get<any>(this.baseUrl + `GetFieldStaffWithEmployeeDetails/${areaId}/${fieldtype}`);
  }

  getOfficeLocationDetails() {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'Organisation/GetOfficeLocations', httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getCropGroup() {
    return this.http.get<any>(this.baseUrl + 'GetCropGroup');
  }

  getCropCode(cropGroupCode) {
    return this.http.get<any>(this.baseUrl + `GetCropNameCode/${encodeURIComponent(cropGroupCode)}`);
  }

  getSeasonFromTo(cropNameCode) {
    return this.http.get<any>(this.baseUrl + `GetSeasonFromTo/${cropNameCode}`);
  }

  searchFarmerAccountSettlement(searchObj) {
    return this.http.post<any>(this.baseUrl + `SearchSettlement`,
      searchObj);
  }
  GetSettlementDetails(searchObj) {
    return this.http.post<any>(this.baseUrl + `GetSettlementDetails`,
      searchObj);
  }

  CreateSettlementAgreement(settlementObj) {
    return this.http.post<any>(this.baseUrl + `CreateSettlementAgreement`,
      settlementObj);
  }

  getFarmerAdvanceDetails(searchObj) {
    return this.http.post<any>(this.baseUrl + `GetFarmerAdvanceDetails`,
      searchObj);
  }

  getFarmerInputsReturnDetails(searchObj) {
    return this.http.post<any>(this.baseUrl + `GetFarmerInputsReturnDetails`,
      searchObj);
  }

  getFarmerInputsIssuedDetails(searchObj) {
    return this.http.post<any>(this.baseUrl + `GetFarmerInputsIssuedDetails`,
      searchObj);
  }

  getFarmerAgreementAndSettlementInfo(searchObj) { //note i
    return this.http.post<any>(this.baseUrl + `GetFarmerAgreementAndSettlementInfo`,
      searchObj);
  }

  getFarmerGreensReveivingDetails(searchObj) { //note i
    return this.http.post<any>(this.baseUrl + `GetFarmerGreensReveivingDetails`,
      searchObj);
  }
  getFarmerInputIssue(searchObj) { //note i
    return this.http.post<any>(this.baseUrl + `GetFarmerInputIssues`,
      searchObj);
  }
  getFarmerInputReturn(searchObj) { //note i
    return this.http.post<any>(this.baseUrl + `GetFarmerInputReturns`,
      searchObj);
  }
}


