import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConstants } from '../../../constants/app.constants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrgLocation } from './org-ofc-loc-model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrgLocationService {
    private baseUrl;
    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseServiceURL;
    }
    saveLocation(locDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/CreateOfficeLocation`, locDetails);
    }
    updateLocation(locDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/UpdateOfficeLocation`, locDetails);
    }
    getLocationDetails(orgCode: any) {
        return this.http.get<OrgLocation[]>(`${this.baseUrl}Organisation/GetOfficeLocationById?orgCode=${encodeURIComponent(orgCode)}`);
        // ById?orgCode=${orgCode}
    }
    getAllCountries(): Observable<any> {
        return this.http.get(`${this.baseUrl}v1/country/GetAllCountries`);
    }
    getSates(countryCode: any) {
        return this.http.get(`${this.baseUrl}v1/state/GetAllStatesByCountyCode?countryCode=${encodeURIComponent(countryCode)}`);
    }
    getDistricts(stateCode: any) {
        return this.http.get(`${this.baseUrl}v1/district/GetAllDistrictsByStateCode?stateCode=${encodeURIComponent(stateCode)}`);
    }
    getMandalsByDistrictCode(districtCode: any) {
        return this.http.get(`${this.baseUrl}GetMandalByCode?districtCode=${encodeURIComponent(districtCode)}`);
    }
    getVillagesByMandalCode(mandalCode: any) {
        return this.http.get(`${this.baseUrl}GetVillagesByMandalCode/${encodeURIComponent(mandalCode)}`);
    }
    getPlaces(distCode: any) {
        return this.http.get(`${this.baseUrl}GetPlacesByDistrictCode?distCode=${encodeURIComponent(distCode)}`);
    }
    deleteLocation(orgLocation: any) {
        return this.http.delete(`${this.baseUrl}Organisation/DeleteOfficeLocation?officeNo=${encodeURIComponent(orgLocation)}`);
    }

}
