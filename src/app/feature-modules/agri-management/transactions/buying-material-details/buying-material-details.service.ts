import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { EmployeeDetl } from 'src/app/feature-modules/agri-management/master/fieldstaffdetails/fieldstaffdetails.model';
import { GreenReceivedDetails, GreenReceivedDetailsNew } from 'src/app/shared/models/buying-material.model';



@Injectable({
    providedIn: 'root'
})


export class BuyingMaterialService {

    baseUrl = environment.baseServiceURL;

    private getAllEmployeeURL = AppConstants.apiUrlGetAllEmployee;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    constructor(private http: HttpClient) {
    }

    getAllAreas() {
        return this.http.get<any>(this.baseUrl + 'Area/GetAllArea');
    }

    getAllEmployee() {
        return this.http.get<EmployeeDetl[]>(this.getAllEmployeeURL);
    }

    getOfficeLocations() {
        return this.http.get<any>(this.baseUrl + 'Organisation/GetOfficeLocations');
    }

    getHarvestGRNNo() {
        return this.http.get<any>(this.baseUrl + 'GetHarvestGRNNo');
    }

    getAllGreensReceivedDetail(areaId) {
        return this.http.get<GreenReceivedDetails[]>(this.baseUrl + `GetAllGreensReceivedDetail/${areaId}`);
    }

    saveGRNMaterialDetails(harvetGRNMaterialData) {
        return this.http.post(environment.baseServiceURL + `CreateHarvestGRNMaterialDetail`, harvetGRNMaterialData, this.httpOptions).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

    GetGreensReceivedDetailsNew(areaId, supervisorId) {
        return this.http.get<GreenReceivedDetailsNew>(this.baseUrl + `GetAllGreensReceivedDetailNew/${areaId}/${supervisorId}`);
    }

    AddBuyerQuantityCratewiseDetail(harvetGRNMaterialData) {
        return this.http.post(environment.baseServiceURL + `AddBuyerQuantityCratewiseDetail`, harvetGRNMaterialData, this.httpOptions).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

    completeGRNMaterialDetails(harvetGRNMaterialData) {
        return this.http.post(environment.baseServiceURL + `CompleteHarvestGrn`, harvetGRNMaterialData, this.httpOptions).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }
    GetVehicles() {
        return this.http.get<any>(this.baseUrl + 'GetVehicles');
    }
}
