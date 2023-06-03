import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { RawMaterialMaster, UOMModel } from 'src/app/feature-modules/secure/raw-material-master/raw-material-master-model';
import { RawMaterialDetails } from 'src/app/feature-modules/secure/raw-material-master/raw-material-details-model';
import { RawMaterialStocks } from 'src/app/feature-modules/secure/raw-material-stocks/IRawMaterialStocks.model';
import { HarvestStageDetailsData } from 'src/app/feature-modules/agri-management/master/harvest-stage-details/harvest-stage-details.model';
import { Area, HarvestVillage, ModifyHarvestVillage, StateModel, DistrictModel, MandalModel, VillageModel } from 'src/app/feature-modules/agri-management/master/centre-areasand-villages/centre-areasand-villages.model';
import { RMBranchStockRequest, RMBranchUpdateRequest } from 'src/app/feature-modules/secure/raw-material-branch-stocks/raw-material-branch-stocks.mode';
import { Village } from 'src/app/feature-modules/agri-management/transactions/sowing-farmer-details/sowing-farmer-details.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class WebservicewrapperService {

  constructor(private http: HttpClient) { }

  // private fetchOrganizationApiURL = environment.baseServiceURL + environment.fetchOrganizationDetails;
  private baseAPIUrl = environment.baseServiceURL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  // example fetch organization
  fetchOrganization() {
    return this.http.post<any>(this.baseAPIUrl, '', httpOptions);
  }
  // Raw Material Master API's
  GetRawMaterialMaster(): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/master`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }
  PostRawMaterialMaster(model: RawMaterialMaster): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/master/create`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }
  UpdateRawMaterialMaster(model: RawMaterialMaster): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/master/update`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }
  GetRawMaterialDetails(): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/details`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  PostRawMaterialDetails(model: RawMaterialDetails): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/details/create`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }
  ModifyRawMaterialDetails(code: string, model: RawMaterialDetails): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/details/update/` + code;
    return this.http.put(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {

          return (error);
        })
      );
  }
  // Raw Material Stock API's
  GetRawMaterialStockData(): Observable<any> {
    const url = this.baseAPIUrl + `rmstock/formdetail`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  PostRawMaterialStocks(model: RawMaterialStocks): Observable<any> {
    const url = this.baseAPIUrl + `rmstock/add`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  // Plantation Harvest Stage
  GetHarvestStageDetailsData(): Observable<any> {
    const url = this.baseAPIUrl + `harveststage/formdetail`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  PostHarvestStageData(model: HarvestStageDetailsData): Observable<any> {
    const url = this.baseAPIUrl + `harveststage/add`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  GetEffectiveDateList(cropNameCode: string): Observable<any> {
    const url = this.baseAPIUrl + `harveststage/getEffectiveDateList/` + encodeURIComponent(cropNameCode);
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  GetHarvestStageDetails(hsTransactionCode: string): Observable<any> {
    const url = this.baseAPIUrl + `harveststage/getHarvestStageDetails/` + encodeURIComponent(hsTransactionCode);
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  // center areas and village details
  PostAreaData(model: Area): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestArea/addArea`;
    // console.log(model);
    // const url = 'https://localhost:44372/' + `v1/harvestArea/addArea`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  isAreaCodeAllowed(areaCode: number): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestArea/IsAreaCodeAllowed?areaCode=` + areaCode;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  isAreaNameAllowed(areaName: string): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestArea/IsAreaNameAllowed?areaName=` + encodeURIComponent(areaName);
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  GetHarvestAllArea(): Observable<any> {
    const url = this.baseAPIUrl + `Area/GetAllArea`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  GetAllCountry(): Observable<any> {
    const url = this.baseAPIUrl + `v1/Country/GetAllCountries`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  AddCountry(countryName: string): Observable<any> {
    const url = this.baseAPIUrl + `v1/Country/AddCountry?countryName=` + encodeURIComponent(countryName);
    return this.http.post(url, null, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  AddState(state: StateModel): Observable<any> {
    const url = this.baseAPIUrl + `v1/state/AddState`;
    return this.http.post(url, state, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  AddDistrict(state: DistrictModel): Observable<any> {
    const url = this.baseAPIUrl + `v1/district/addDistrict`;
    return this.http.post(url, state, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {

          return (error);
        })
      );
  }

  AddMandal(state: MandalModel): Observable<any> {
    const url = this.baseAPIUrl + `AddMandal`;
    return this.http.post(url, state, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {

          return (error);
        })
      );
  }

  AddVillage(state: VillageModel): Observable<any> {
    const url = this.baseAPIUrl + `AddVillage`;
    return this.http.post(url, state, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  PostVillageData(model: HarvestVillage[]): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestAreaVillage/addAreaVillage`;
    // console.log(model);
    // const url = 'https://localhost:44372/' + `v1/harvestArea/addArea`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  getAvailableVillages(areaId: string, areaName: string, countryCode: string, stateCode: string, districtCode: string, mandalCode: string) {
    try {
      const url = this.baseAPIUrl + `v1/harvestAreaVillage/GetAvailableVillages?areaId=` + encodeURIComponent(areaId) +
        `&areaName=` + encodeURIComponent(areaName) +
        `&countryCode=` + encodeURIComponent(countryCode)
        + `&stateCode=` + encodeURIComponent(stateCode) + `&districtCode=` +
        encodeURIComponent(districtCode) + `&mandalCode=` +
        encodeURIComponent(mandalCode);
      return this.http.get(url, httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  GetCountryData(countryId: any): Observable<any> {
    const url = this.baseAPIUrl + `v1/Country/GetCountryByCode?countryCode=` + encodeURIComponent(countryId);
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }
  // Get Villages by Area Id
  GetHarvestVillagesByAreaId(AreaId: any): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestArea/SearchArea?areaId=` + encodeURIComponent(AreaId);
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  UpdateVillageData(model: HarvestVillage): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestAreaVillage/updateHarvestAreaVillage`;
    // console.log(model);
    // const url = 'https://localhost:44372/' + `v1/harvestArea/addArea`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  isVillageCodeAllowed(villageCode: string): Observable<any> {
    const url = this.baseAPIUrl + `v1/harvestAreaVillage/IsVillageCodeAllowed?villageCode=` + encodeURIComponent(villageCode);
    // console.log(model);
    // const url = 'https://localhost:44372/' + `v1/harvestArea/addArea`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }


  // material brach stock

  GetRMBranchStocksData(): Observable<any> {
    // url needs to be chanegd
    // const url = 'https://localhost:44372/' + `rmbranch/formdetail`;
    const url = this.baseAPIUrl + `rmbranch/formdetail`;
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  PostRMBranchStocks(model: RMBranchStockRequest): Observable<any> {
    const url = this.baseAPIUrl + `rmstockbranch/add`;
    // console.log(model);
    // const url = 'https://localhost:44372/' + `rmstockbranch/add`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  GetBranchStocksByAreaId(AreaId: any): Observable<any> {
    // const url = 'https://localhost:44372/' + `rmstockbranch/find?areaId=` + AreaId;
    const url = this.baseAPIUrl + `rmstockbranch/find?areaId=` + encodeURIComponent(AreaId);
    return this.http.get(url, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  PostUpdatedRMBranchStocks(model: RMBranchUpdateRequest[]): Observable<any> {
    const url = this.baseAPIUrl + `rmstockbranch/update`;
    // console.log(model);
    // const url = 'https://localhost:44372/' + `rmstockbranch/update`;
    return this.http.post(url, model, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  getAllUOM() {
    try {
      const url = this.baseAPIUrl + `rawmaterial/GetAllRMUom`;
      return this.http.get(url, httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  createUOM(uom: UOMModel): Observable<any> {
    const url = this.baseAPIUrl + `rawmaterial/uom/create`;
    // console.log(model);
    // const url = 'https://localhost:44372/' + `rmstockbranch/update`;
    return this.http.post(url, uom, httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          console.log(error);
          return (error);
        })
      );
  }

  GetVillageListByAreaAndEmployee(areaId: string, employeeId: string, villageName: string) {
    try {
      if (!areaId || !employeeId || !villageName) {
        return of([]);
      }
      return this.http.get<Village[]>(environment.baseServiceURL + `GetVillageListByAreaAndEmployee/`
        + encodeURIComponent(areaId) + `/` + encodeURIComponent(employeeId) + `/` + encodeURIComponent(villageName), this.httpOptions)
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


