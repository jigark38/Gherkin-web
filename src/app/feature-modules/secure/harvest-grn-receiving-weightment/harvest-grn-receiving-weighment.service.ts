import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})

export class HarvestGrnService {
    private baseUrl;
    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseServiceURL;
    }
    getOfficeLocations() {
        return this.http.get<any>(`${this.baseUrl}Organisation/GetOfficeLocations`);
    }
    getInwardDetails(orgId: any) {
        return this.http.get<any>(`${this.baseUrl}GetInwardDetailsByOrgId?orgId=${encodeURIComponent(orgId)}`);
    }
    getReceptionDetails(orgId: any) {
        return this.http.get<any>(`${this.baseUrl}GreensReceptionDetailsByOrgID?orgId=${encodeURIComponent(orgId)}`);
    }
    getEmployeeDetails() {
        return this.http.get<any>(`${this.baseUrl}GetAllEmployee`);
    }
    saveHarvestGrnDetails(harvestGrn: any) {
        console.log(harvestGrn);
        console.log(JSON.stringify(harvestGrn));
        return this.http.post<any>(`${this.baseUrl}AddHarvestGRNDetails`, harvestGrn);
    }
}
