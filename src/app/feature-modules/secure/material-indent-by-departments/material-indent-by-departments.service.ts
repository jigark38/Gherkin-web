import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StoreInternalIndentMaster, StoreInternalIndentDetail } from './material-indent-by-departments.model';
import { of } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/apiResponse.model';
import { GSGroupDetail, GSMaterialDetail, GSSubGroupDetail } from '../stores-master-details/stores-master-details.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialIndentByDepartmentsService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  private baseURL = environment.baseServiceURL;
  private urlPrefix = 'api/v1/MaterialIndentByDepartment/';

  GetGroupNameList() {
    try {
      return this.http.get<ApiResponse<GSGroupDetail[]>>(this.baseURL + this.urlPrefix + `GetGroupNameList/`, this.httpOptions)
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

  GetSubGroupNameListByGroupCode(groupCode: number) {
    try {
      if (!groupCode) {
        return of(new ApiResponse<null>());
      }
      return this.http.get<ApiResponse<GSSubGroupDetail[]>>(this.baseURL + this.urlPrefix +
        `GetSubGroupNameListByGroupCode/` + encodeURIComponent(groupCode), this.httpOptions)
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

  GetMaterialListByGroupSubGroupCode(groupCode: number, subGroupCode: number) {
    try {
      if (!groupCode || !subGroupCode) {
        return of(new ApiResponse<null>());
      }
      return this.http.get<ApiResponse<GSMaterialDetail[]>>(this.baseURL + this.urlPrefix +
        `GetMaterialListByGroupSubGroupCode/` + encodeURIComponent(groupCode) +
        `/` + encodeURIComponent(subGroupCode), this.httpOptions)
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

  GetMaterialIndentListByIndentDate(indentDate: Date) {
    try {
      if (!indentDate) {
        return of(new ApiResponse<null>());
      }
      return this.http.get<ApiResponse<StoreInternalIndentMaster[]>>(this.baseURL + this.urlPrefix +
        `GetMaterialIndentListByIndentDate/` + encodeURIComponent(indentDate.toDateString()), this.httpOptions)
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

  GetMaterialIndentDetailByIndentNo(indentNo: string) {
    try {
      if (!indentNo) {
        return of(new ApiResponse<null>());
      }
      return this.http.get<ApiResponse<StoreInternalIndentDetail[]>>(this.baseURL + this.urlPrefix +
        `GetMaterialIndentDetailByIndentNo/` + encodeURIComponent(indentNo), this.httpOptions)
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

  SaveMaterialIndentMaster(storeInternalIndentMaster: StoreInternalIndentMaster) {
    try {
      if (!storeInternalIndentMaster) {
        return of(new ApiResponse<null>());
      }
      return this.http.post<ApiResponse<StoreInternalIndentMaster>>(this.baseURL + this.urlPrefix + `SaveMaterialIndentMaster`,
        storeInternalIndentMaster, this.httpOptions)
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

  SaveMaterialIndentDetail(storeInternalIndentDetail: StoreInternalIndentDetail) {
    try {
      if (!storeInternalIndentDetail) {
        return of(new ApiResponse<null>());
      }
      return this.http.post<ApiResponse<StoreInternalIndentDetail>>(this.baseURL + this.urlPrefix + `SaveMaterialIndentDetail`,
        storeInternalIndentDetail, this.httpOptions)
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
