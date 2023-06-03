import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BatchProdPrepDetService {
  private baseUrl;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseServiceURL;
  }

  GetOrgofficelocationDetails() {
    return this.http.get(`${this.baseUrl}/GetOrgofficelocationDetails`, httpOptions);
  }
  GetGreenReceivedByOrgOfficeNo(OrgOfficeNo) {
    return this.http.get(`${this.baseUrl}/GetGreenReceivedByOrgOfficeNo?OrgOfficeNo=${encodeURIComponent(OrgOfficeNo)}`, httpOptions);
  }
  GetMediaProcess() {
    return this.http.get(`${this.baseUrl}/GetMediaProcess`, httpOptions);
  }
  GetScheduledBy() {
    return this.http.get(`${this.baseUrl}/GetScheduledBy`, httpOptions);
  }
  GetProductGroup() {
    return this.http.get(`${this.baseUrl}/GetProductGroup`, httpOptions);
  }
  GetProductName(GroupCode) {
    return this.http.get(`${this.baseUrl}/GetProductName?GroupCode=${encodeURIComponent(GroupCode)}`, httpOptions);
  }
  GetGrade(VarietyCode) {
    return this.http.get(`${this.baseUrl}/GetGrade?VarietyCode=${encodeURIComponent(VarietyCode)}`, httpOptions);
  }

  GetLatestbatchNo() {
    return this.http.get(`${this.baseUrl}/GetLatestBatchNo`, httpOptions);
    
  }

  SaveProductionBatchDetails(BatchProdDetails) {
    return this.http.post<any>(environment.baseServiceURL + `SaveProductionBatchDetails`, BatchProdDetails, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }
}
