import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConstants } from 'src/app/constants/app.constants';
import { environment } from 'src/environments/environment';
import { Area, FarmersInputsIssueRatesMaster } from './farmer-input-rates-season-wise.model';

@Injectable({
  providedIn: 'root'
})
export class FarmerInputRatesSeasonWiseService {

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  private getEmpDetailUrl = AppConstants.apiUrlGetEmpByEmpId;


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  GetCropNameByGroup(groupCode: string) {
    try {

      return this.http.get(environment.baseServiceURL + `GetCropNameCode/` + groupCode, this.httpOptions).
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
  GetAllCropGroup(): Observable<any> {
    try {

      return this.http.get(environment.baseServiceURL + `GetAllGroupName`, this.httpOptions).
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

  GetSeasonFromTo(cropNameCode: string) {
    try {
      return this.http.get(environment.baseServiceURL + `GetSeasonFromTo/` + cropNameCode, this.httpOptions).
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

  geRatesUOM(cropRate: string) {
    try {
      if (!cropRate) {
        return of([]);
      }
      return this.http.get(environment.baseServiceURL + `GetCropRateUOM/` + cropRate, this.httpOptions).
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

  getAllAssociationRatesBySeason(seasonFrom: string, seasonTO: string) {
    try {
      return this.http.get(environment.baseServiceURL + `FindCropRateAccordingToSeason/` +
        this.datePipe.transform(seasonFrom, 'yyyy-MM-dd') + '/' + this.datePipe.transform(seasonTO, 'yyyy-MM-dd'), this.httpOptions).
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

  getEmployeesByDeptCode(deptCode: string) {
    try {
      return this.http.get(environment.baseServiceURL + `GetEmployeesByDeptCode?deptCode=`
        + deptCode, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }


  getEmployeeDetail(empId) {

    try {
      return this.http.get<any>(this.getEmpDetailUrl.replace('{empId}', empId), this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  getAllCountries() {
    try {
      return this.http.get(environment.baseServiceURL + `v1/country/GetAllCountries`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }
  getSates(countryCode: any) {
    try {
      return this.http.get(environment.baseServiceURL + `v1/state/GetAllStatesByCountyCode?countryCode=` + countryCode, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }
  getAreas(PSNumber: string) {
    try {
      return this.http.get(environment.baseServiceURL + `GetFarmerInputAreaDetails/${PSNumber}`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  getMaterials() {
    try {
      return this.http.get(environment.baseServiceURL + `GetMaterialDetails`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  CreateFarmersInputRatesSeasonWise(farmersInputsIssueRatesMaster: FarmersInputsIssueRatesMaster) {
    try {
      return this.http.post(environment.baseServiceURL + `CreateFarmersInputRatesSeasonWise`,
        farmersInputsIssueRatesMaster, this.httpOptions).
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

  UpdateFarmersInputRatesSeasonWise(farmersInputsIssueRatesMaster: FarmersInputsIssueRatesMaster) {
    try {
      return this.http.put(environment.baseServiceURL + `UpdateFarmersInputRatesSeasonWise`,
        farmersInputsIssueRatesMaster, this.httpOptions).
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


  GetStatesbyCropSeason(countryCode: any, cropGroupCode: any, cropNameCode: any, PSNumber: any) {
    try {
      return this.http.get(environment.baseServiceURL + `GetStatesbyCropSeason?countryCode=${encodeURIComponent(countryCode)}&cropGroupCode=${encodeURIComponent(cropGroupCode)}&cropNameCode=${encodeURIComponent(cropNameCode)}&PSNumber=${encodeURIComponent(PSNumber)}`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  FindStatesbyCropSeason(countryCode: any, cropGroupCode: any, cropNameCode: any, PSNumber: any) {
    try {
      return this.http.get(environment.baseServiceURL + `FindStatesbyCropSeason?countryCode=${encodeURIComponent(countryCode)}&cropGroupCode=${encodeURIComponent(cropGroupCode)}&cropNameCode=${encodeURIComponent(cropNameCode)}&PSNumber=${encodeURIComponent(PSNumber)}`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  GetFarmerInputRateSeason(countryCode: any, cropGroupCode: any, cropNameCode: any, PSNumber: any, stateCode: any) {
    try {
      return this.http.get(environment.baseServiceURL + `GetFarmerInputRateSeason?countryCode=${encodeURIComponent(countryCode)}&cropGroupCode=${encodeURIComponent(cropGroupCode)}&cropNameCode=${encodeURIComponent(cropNameCode)}&PSNumber=${encodeURIComponent(PSNumber)}&stateCode=${encodeURIComponent(stateCode)}`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  getAllArea() {
    try {
      return this.http.get(environment.baseServiceURL + `Area/GetAllArea`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }

  searchAreaByStateCode(stateId) {
    try {
      return this.http.get(environment.baseServiceURL + `v1/harvestArea/SearchAreaByStateCode?stateId=${stateId}`, this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (er) {

    }
  }
}
