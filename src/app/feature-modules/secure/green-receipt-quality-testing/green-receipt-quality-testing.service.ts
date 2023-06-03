import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IGreenInwardsDetail, IGreenReceptionDetail } from './green-receipt-quality-testing';

@Injectable({
  providedIn: 'root'
})
export class GreenReceiptQualityTestingService {

  constructor(private http: HttpClient) { }

  getAllUnit() {
    return this.http.get(environment.baseServiceURL + `GetAllUnit`);
  }

  getInwardDetails(orgOfficeNo: number): Observable<IGreenInwardsDetail[]> {
    return this.http.get<IGreenInwardsDetail[]>(environment.baseServiceURL + `GetInwardDetailsByOrgOfficeNo?orgOfficeNo=${encodeURIComponent(orgOfficeNo)}`);
  }

  getGreenRecpetionDetails(orgOfficeNo: number): Observable<IGreenReceptionDetail[]> {
    return this.http.get<IGreenReceptionDetail[]>(environment.baseServiceURL + `GetGreenReceptionByOrgOfficeNo?orgOfficeNo=${encodeURIComponent(orgOfficeNo)}`);
  }

  createQualityCheckAndInspection(createQCAndInspection) {
    return this.http.post(environment.baseServiceURL + `CreateQualityCheckAndInspection`, createQCAndInspection);
  }

  getQualityCheckAndInspection(harvestGRNNo: number): Observable<any> {
    return this.http.get<any>(environment.baseServiceURL + `GetQualityCheckAndInspection?harvestGRNNo=${encodeURIComponent(harvestGRNNo)}`);
  }

  getAllAreas() {
    return this.http.get<any>(environment.baseServiceURL + 'Area/GetAllArea');
  }

  getAllCrops() {
    return this.http.get(environment.baseServiceURL + `GetAllCrops`);
  }

  getAllEmployees() {
    return this.http.get(environment.baseServiceURL + `GetAllEmployee`);
  }
}
