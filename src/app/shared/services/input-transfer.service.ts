import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FarmersAgreement } from '../models/FarmerAgreement.model';
import { AppConstants } from 'src/app/constants/app.constants';
import { EmployeeDetl } from 'src/app/feature-modules/agri-management/master/fieldstaffdetails/fieldstaffdetails.model';
import { StockAndBatchDetailsList, FeedTransferDetails } from '../models/input-transfer.model';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})


export class InputTransferService {

    baseUrl = environment.baseServiceURL;

    private getEmpByEmpIdURL = AppConstants.apiUrlGetEmpByEmpId;

    constructor(private http: HttpClient) {
    }

    getAllAreas() {
        return this.http.get<any>(this.baseUrl + 'Area/GetAllArea');
    }

    getCropGroup() {
        return this.http.get<any>(this.baseUrl + 'GetCropGroup');
    }

    getEmployeeByEmpId(empid) {
        return this.http.get<EmployeeDetl>(this.baseUrl + `GetEmployee/${empid}`);
    }

    getCropCode(cropGroupCode) {
        return this.http.get<any>(this.baseUrl + `GetCropDetailsByCropGroupCode?cropGroupCode=${cropGroupCode}`);
    }

    getSeasonFromTo(cropNameCode) {
        return this.http.get<any>(this.baseUrl + `GetSeasonFromTo/${cropNameCode}`);
    }

    getEmployeeCode(areaId) {
        return this.http.get<any>(this.baseUrl + `GetFieldStaffbyArea?area=${areaId}`);
    }

    getCropCount(psNumber) {
        return this.http.get<any>(this.baseUrl + `GetCropCountMM/${psNumber}`);
    }

    getHBOMPracticeNumber(cropNameCode, psNumber) {
        return this.http.get<any>(this.baseUrl + `GetHBOMPracticeNo?cropNameCode=${encodeURIComponent(cropNameCode)}&psNumber=${encodeURIComponent(psNumber)}`);
    }

    getFarmerAgreementAcres(cropNameCode, psNumber) {
        return this.http.get<any>(this.baseUrl + `GetFarmersNoOfAcres?cropNameCode=${encodeURIComponent(cropNameCode)}&psNumber=${encodeURIComponent(psNumber)}`);
    }

    getGetHBOMPracticePerAcreages(cropNameCode, psNumber) {
        return this.http.get<any>(this.baseUrl + `GetHBOMPracticePerAcreage?cropNameCode=${encodeURIComponent(cropNameCode)}&psNumber=${encodeURIComponent(psNumber)}`);
    }

    getMaterialDetails(cropNameCode, cropSchemeCode, psNumber, areaId) {
        return this.http.get<any>(this.baseUrl + `GetInputTranferDetails?cropNameCode=${encodeURIComponent(cropNameCode)}&cropSchemeCode=${encodeURIComponent(cropSchemeCode)}
        &psNumber=${encodeURIComponent(psNumber)}&areaId=${encodeURIComponent(areaId)}`);
    }

    getStockDetails(groupCode, detailsCode, transferDate) {
        return this.http.get<StockAndBatchDetailsList>(this.baseUrl + `GetAllStockAndBatchDetails?groupCode=${encodeURIComponent(groupCode)}&detailsCode=${encodeURIComponent(detailsCode)}&transferDate=${encodeURIComponent(transferDate)}`);
    }

    saveFeedInputData(data: FeedTransferDetails) {
        return this.http.post<any>(this.baseUrl + `SaveStockAndBatchDetails`, data);
    }

    getGenerateTransferNo() {
        return this.http.get<any>(this.baseUrl + `GenerateTransferNo`);
    }

    getOutwardGatePassNo() {
        return this.http.get<any>(this.baseUrl + `GenerateOutwardGatePassNo`);
    }

    getMatDetailsByCropPsNumber(cropNameCode, psNumber) {
        return this.http.get<any>(this.baseUrl + `GetDetailsByCropPsNumber?cropNameCode=${encodeURIComponent(cropNameCode)}&psNumber=${encodeURIComponent(psNumber)}`);
    }

    getOfficeDetailsList() {
        return this.http.get<any>(this.baseUrl + `GetOrgOfficeDetailsList`);
    }

    GetRawMaterialGroups(): Observable<any> {
        const url = this.baseUrl + `GetAllRawMaterialGroups`;
        return this.http.get(url).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

    GetRawMaterialDetails(): Observable<any> {
        const url = this.baseUrl + `GetAllRawMaterialDetails`;
        return this.http.get(url).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

}
