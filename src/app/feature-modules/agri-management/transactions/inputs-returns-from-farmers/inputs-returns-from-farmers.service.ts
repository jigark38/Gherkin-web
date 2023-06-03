import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FarmersInputsMaterialDetail, FarmersInputsMaterialMaster, FieldStaffCropGroupSeason } from './inputs-returns-from-farmers.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputsReturnsFromFarmersService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  private baseURL = environment.baseServiceURL;

  GetFieldStaffCropGroupSeasonByAreaId(areaId: string) {
    try {
      if (!areaId) {
        return of(new FieldStaffCropGroupSeason());
      }
      return this.http.get<FieldStaffCropGroupSeason>(environment.baseServiceURL + `api/v1/FarmersInputReturns/GetFieldStaffCropGroupSeasonByAreaId/`
        + encodeURIComponent(areaId), this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  GetFarmersInputsMaterialDetail(psNumber: string, farmerCode: string, cropNameCode: string, areaId: string, fIMReturnNo: number) {
    try {
      if (!psNumber || !farmerCode || !cropNameCode || !areaId) {
        return of([]);
      }
      return this.http.get<FarmersInputsMaterialDetail[]>(environment.baseServiceURL + `api/v1/FarmersInputReturns/GetFarmersInputsMaterialDetail/`
        + encodeURIComponent(psNumber) + `/`
        + encodeURIComponent(farmerCode) + `/`
        + encodeURIComponent(cropNameCode) + `/`
        + encodeURIComponent(areaId) + `/`
        + encodeURIComponent(fIMReturnNo), this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  GetFarmersInputsMaterialMaster(psNumber: string, farmerCode: string, cropNameCode: string, areaId: string) {
    try {
      if (!psNumber || !farmerCode || !cropNameCode || !areaId) {
        return of(null);
      }
      return this.http.get<FarmersInputsMaterialMaster>(environment.baseServiceURL + `api/v1/FarmersInputReturns/GetFarmersInputsMaterialMaster/`
        + encodeURIComponent(psNumber) + `/`
        + encodeURIComponent(farmerCode) + `/`
        + encodeURIComponent(cropNameCode) + `/`
        + encodeURIComponent(areaId) + `/`, this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  CreateInputReturnsFromFarmersMaster(farmersInputsMaterialMaster: FarmersInputsMaterialMaster) {
    try {
      if (!farmersInputsMaterialMaster) {
        return of(new FarmersInputsMaterialMaster());
      }
      return this.http.post<FarmersInputsMaterialMaster>(environment.baseServiceURL + `api/v1/FarmersInputReturns/CreateInputReturnsFromFarmersMaster`,
        farmersInputsMaterialMaster, this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  UpdateInputReturnsFromFarmersMaster(farmersInputsMaterialMaster: FarmersInputsMaterialMaster) {
    try {
      if (!farmersInputsMaterialMaster) {
        return of(new FarmersInputsMaterialMaster());
      }
      return this.http.put<FarmersInputsMaterialMaster>(environment.baseServiceURL + `api/v1/FarmersInputReturns/UpdateInputReturnsFromFarmersMaster`,
        farmersInputsMaterialMaster, this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  CreateInputReturnsFromFarmersDetail(farmersInputsMaterialDetailList: FarmersInputsMaterialDetail[]) {
    try {
      if (!farmersInputsMaterialDetailList || farmersInputsMaterialDetailList.length === 0) {
        return of([]);
      }
      return this.http.post<FarmersInputsMaterialDetail[]>(environment.baseServiceURL + `api/v1/FarmersInputReturns/CreateInputReturnsFromFarmersDetail`,
        farmersInputsMaterialDetailList, this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  UpdateInputReturnsFromFarmersDetail(farmersInputsMaterialDetailList: FarmersInputsMaterialDetail[]) {
    try {
      if (!farmersInputsMaterialDetailList || farmersInputsMaterialDetailList.length === 0) {
        return of([]);
      }
      return this.http.put<FarmersInputsMaterialDetail[]>(environment.baseServiceURL + `api/v1/FarmersInputReturns/UpdateInputReturnsFromFarmersDetail`,
        farmersInputsMaterialDetailList, this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

}
