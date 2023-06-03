import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable, throwError } from 'rxjs';
import { AppConstants } from '../../../../constants/app.constants';
import { debounceTime, finalize, map, startWith, switchMap, tap, catchError } from 'rxjs/operators';
import {
    CropDetailsByGroupCode, CropGroupDetailsByAreaId, AreaDetails,
    EmpInfoByHarvestArea, PlantationSchDetailsByAreaID, OrgLocation
} from './inputs-issued.model';

@Injectable({
    providedIn: 'root'
})
export class InputIssuedToFieldStaffService {
    constructor(private http: HttpClient) { }

    public getOrgOfficeLocDetailsAPI = AppConstants.apiUrlGetAllOrgOfficeLocDetails;
    public getHarvestAreaDetailsAPI = AppConstants.apiUrlGetHarvestAreaDetailsAPI;
    public getEmpInfoByAreaId = AppConstants.apiUrlGetEmpInfoByAreaId;
    public GetCropGroupDetailsByAreaIdAPI = AppConstants.apiUrlGetCropGroupDetailsByAreaId;
    public getCropNameByGroupCodeAPI = AppConstants.apiUrlgetCropNameByGroupCodeAPI;
    public getPlantationSchBycropNameCode = AppConstants.apiUrlGetPlantationSchByAreaIdAPI;
    public getHBOMDetailsByCropNameAndPsNum = AppConstants.apiUrlGetHBOMMatDetailsByCropNameCodeAndPSNumAPI;
    public getRMSStockGridAPIuRL = AppConstants.apiUrlGetRMStockDetailsA;
    public generateOutwaredPass = AppConstants.apiUrlGetOutwaredGatePassAPI;
    public addToFieldStaffMats = AppConstants.apiUrlAddToFieldStaffMats;
    public apiUrMatIssueFSno = AppConstants.apiUrMatIssueFSno;


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    addToFieldStaffMaterials(dataOb) {
        try {
            return this.http.post(this.addToFieldStaffMats, dataOb, this.httpOptions);
        } catch (error) {
            console.log(error);
        }
    }

    getOutwaredGatePassNo() {
        return this.http.get(this.generateOutwaredPass);
    }

    getMatIssueFSNoNo() {
        return this.http.get(this.apiUrMatIssueFSno);
    }

    getAllOrgOfficeLocDetails() {
        try {
            return this.http.get(this.getOrgOfficeLocDetailsAPI).
                pipe(
                    map((data: OrgLocation[]) => {
                        return data;
                    }), catchError(error => {
                        return throwError('Something went wrong!');
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }

    getAreaDetails() {
        try {
            return this.http.get(this.getHarvestAreaDetailsAPI).
                pipe(
                    map((data: AreaDetails[]) => {
                        return data;
                    }), catchError(error => {
                        return throwError('Something went wrong!');
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }

    getEmpInfoDetailsByAreaId(areaid) {
        try {
            return this.http.get(this.getEmpInfoByAreaId.replace('{areaId}', areaid)).
                pipe(
                    map((data: EmpInfoByHarvestArea[]) => {
                        return data;
                    }), catchError(error => {
                        return throwError('Something went wrong!');
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }

    getCropDetailsByAreaId(areaId) {
        try {
            return this.http.get(this.GetCropGroupDetailsByAreaIdAPI.replace('{areaId}', areaId)).
                pipe(
                    map((data: CropGroupDetailsByAreaId[]) => {
                        return data;
                    }), catchError(error => {
                        return throwError('Something went wrong!');
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }

    getCropNameByGroupCode(cropGroupCode) {
        try {
            return this.http.get(this.getCropNameByGroupCodeAPI.replace('{cropGroupCode}', cropGroupCode)).
                pipe(
                    map((data: CropDetailsByGroupCode[]) => {
                        return data;
                    }), catchError(error => {
                        return throwError('Something went wrong!');
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }

    getSchDetailsByCropNameCode(cropNameCode) {
        try {
            return this.http.get(this.getPlantationSchBycropNameCode.replace('{cropNameCode}', cropNameCode)).
                pipe(
                    map((data: PlantationSchDetailsByAreaID[]) => {
                        return data;
                    }), catchError(error => {
                        return throwError('Something went wrong!');
                    })
                );
        } catch (error) {
            console.log(error);
        }
    }

    getHbomDetailsByCropNameCodeAndPsNum(cropNameCode, psNum) {
        const urlApi = this.getHBOMDetailsByCropNameAndPsNum.replace('{cropNameCode}', cropNameCode);
        return this.http.get(urlApi.replace('{psNum}', psNum));
    }

    getRMSStockGridA(transferDate, matGrpCode, matNameCode) {
        const urlApi = this.getRMSStockGridAPIuRL.replace('{transferDate}', transferDate).replace('{matGroupCode}', matGrpCode);
        return this.http.get(urlApi.replace('{matDetailCode}', matNameCode));
    }
}