import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { PSOScheduleDetails } from './production-schedule-details.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionScheduleDetailsService {

  private getOfficeLocationsURL = AppConstants.apiUrlGetOfficeLocations;
  private getAllEmployeeURL = AppConstants.apiUrlGetAllEmployee;
  private getProductGroupsURL = AppConstants.apiUrlGetProductGroups;
  private getProductVarietyURL = AppConstants.apiUrlGetProductVariety;
  private getAllGradeByVarietyURL = AppConstants.apiUrlGetAllGradeByVariety;
  private getProductionDetailsURL = AppConstants.apiUrlGetProductionDetails;
  private getProductionScheduleIdURL = AppConstants.apiUrlGetProductionScheduleId;
  private addProductionScheduleDetailsURL = AppConstants.apiUrlAddProductionScheduleDetails;
  private getMediaProcessNameListURL = AppConstants.apiUrlGetMediaProcessNameList;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  constructor(private http: HttpClient) { }

  getOfficeLocations() {
    return this.http.get(this.getOfficeLocationsURL, this.httpOptions);
  }

  getScheduledByDetails() {
    return this.http.get(this.getAllEmployeeURL, this.httpOptions);
  }

  getProductGroupDetails() {
    return this.http.get(this.getProductGroupsURL, this.httpOptions);
  }

  getProductNameDetailsByGroupCode(pgCode) {
    return this.http.get(this.getProductVarietyURL + encodeURIComponent(pgCode), this.httpOptions);
  }

  getAllGradeDetailsByVariety(varietyCode) {
    return this.http.get(this.getAllGradeByVarietyURL + encodeURIComponent(varietyCode), this.httpOptions);
  }

  getProductionDetails() {
    return this.http.get<PSOScheduleDetails[]>(this.getProductionDetailsURL, this.httpOptions);
  }
  getProductionScheduleId() {
    return this.http.get(this.getProductionScheduleIdURL, this.httpOptions);
  }
  addProductionScheduleDetails(payload) {
    return this.http.post(this.addProductionScheduleDetailsURL, payload, this.httpOptions);
  }
  getMediaProcessNameList() {
    return this.http.get(this.getMediaProcessNameListURL, this.httpOptions);
  }
}
