import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GSGroupDetail, GSSubGroupDetail, GSCUOMDetail, GSMaterialDetail } from './stores-master-details.model';
import { of } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class StoresMasterDetailsService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  private baseURL = environment.baseServiceURL;
  private urlPrefix = 'api/v1/StoresMasterDetails/';

  GetStoresMasterGroupByName(groupName: string) {
    try {
      if (!groupName) {
        return of(new ApiResponse<GSGroupDetail[]>());
      }
      return this.http.get<ApiResponse<GSGroupDetail[]>>(this.baseURL + this.urlPrefix + `GetStoresMasterGroupByName/`
        + encodeURIComponent(groupName), this.httpOptions)
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

  SaveStoresMasterGroup(groupDetail: GSGroupDetail) {
    try {
      if (!groupDetail) {
        return of(new ApiResponse<null>());
      }
      return this.http.post<ApiResponse<GSGroupDetail>>(this.baseURL + this.urlPrefix + `SaveStoresMasterGroup`,
        groupDetail, this.httpOptions)
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

  IsStoresMasterGroupExists(groupName: string) {
    try {
      if (!groupName) {
        return of(new ApiResponse<boolean>());
      }
      return this.http.get<ApiResponse<boolean>>(this.baseURL + this.urlPrefix + `IsStoresMasterGroupExists/`
        + encodeURIComponent(groupName), this.httpOptions)
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


  GetStoresMasterSubGroupByName(subGroupName: string, groupCode: number) {
    try {
      if (!subGroupName || !groupCode) {
        return of(new ApiResponse<GSSubGroupDetail[]>());
      }
      return this.http.get<ApiResponse<GSSubGroupDetail[]>>(this.baseURL + this.urlPrefix + `GetStoresMasterSubGroupByName/`
        + encodeURIComponent(subGroupName) + '/'
        + encodeURIComponent(groupCode), this.httpOptions)
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

  SaveStoresMasterSubGroup(subGroupDetail: GSSubGroupDetail) {
    try {
      if (!subGroupDetail) {
        return of(new ApiResponse<null>());
      }
      return this.http.post<ApiResponse<GSSubGroupDetail>>(this.baseURL + this.urlPrefix + `SaveStoresMasterSubGroup`,
        subGroupDetail, this.httpOptions)
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

  IsStoresMasterSubGroupExists(subGroupName: string, groupCode: number) {
    try {
      if (!subGroupName || !groupCode) {
        return of(new ApiResponse<boolean>());
      }
      return this.http.get<ApiResponse<boolean>>(this.baseURL + this.urlPrefix + `IsStoresMasterSubGroupExists/`
        + encodeURIComponent(subGroupName) + '/'
        + encodeURIComponent(groupCode), this.httpOptions)
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


  GetStoresMasterUOMByName(uomName: string) {
    try {
      if (!uomName) {
        return of(new ApiResponse<GSCUOMDetail[]>());
      }
      return this.http.get<ApiResponse<GSCUOMDetail[]>>(this.baseURL + this.urlPrefix + `GetStoresMasterUOMByName/`
        + encodeURIComponent(uomName), this.httpOptions)
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

  SaveStoresMasterUOM(uomDetail: GSCUOMDetail) {
    try {
      if (!uomDetail) {
        return of(new ApiResponse<null>());
      }
      return this.http.post<ApiResponse<GSCUOMDetail>>(this.baseURL + this.urlPrefix + `SaveStoresMasterUOM`,
        uomDetail, this.httpOptions)
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

  IsStoresMasterUOMExists(uomName: string) {
    try {
      if (!uomName) {
        return of(new ApiResponse<boolean>());
      }
      return this.http.get<ApiResponse<boolean>>(this.baseURL + this.urlPrefix + `IsStoresMasterUOMExists/`
        + encodeURIComponent(uomName), this.httpOptions)
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


  GetStoresMasterMaterialByName(materialName: string, groupCode: number, subGroupCode: number) {
    try {
      if (!materialName || !groupCode || !subGroupCode) {
        return of(new ApiResponse<GSMaterialDetail[]>());
      }
      return this.http.get<ApiResponse<GSMaterialDetail[]>>(this.baseURL + this.urlPrefix + `GetStoresMasterMaterialByName/`
        + encodeURIComponent(materialName) + '/'
        + encodeURIComponent(groupCode) + '/'
        + encodeURIComponent(subGroupCode), this.httpOptions)
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

  SaveStoresMasterMaterial(materialDetail: GSMaterialDetail) {
    try {
      if (!materialDetail) {
        return of(new ApiResponse<null>());
      }
      return this.http.post<ApiResponse<GSMaterialDetail>>(this.baseURL + this.urlPrefix + `SaveStoresMasterMaterial`,
        materialDetail, this.httpOptions)
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

  IsStoresMasterMaterialExists(materialName: string) {
    try {
      if (!materialName) {
        return of(new ApiResponse<boolean>());
      }
      return this.http.get<ApiResponse<boolean>>(this.baseURL + this.urlPrefix + `IsStoresMasterMaterialExists/`
        + encodeURIComponent(materialName), this.httpOptions)
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
