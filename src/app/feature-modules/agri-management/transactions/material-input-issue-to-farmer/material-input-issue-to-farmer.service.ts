import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CropGrp, CropName, PlantationSchedul } from './../plantation-scheduling/plantation-scheduling.model';
import { AppConstants } from 'src/app/constants/app.constants';


@Injectable({
  providedIn: 'root'
})
export class MaterialInputIssueToFarmerService {
  baseUrl = environment.baseServiceURL;
  private getPlantationScheduleUrl = AppConstants.apiUrlGetPlantationSchedules;

  constructor(private http: HttpClient) { }

  getAllAreas() {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetAllAreas', httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getEmployeeDetails(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetAreaWiseEmployeeDetails/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getCropGroup(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetAreaWiseCropGroup/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getAreaWiseSeasonToFrom(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetAreaWiseSeasonToFrom/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getCropName(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetCropName/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getAreaWiseCountry(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetAreaWiseCountry/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getAreaWiseState(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetAreaWiseState/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getStateWiseDistrict(stateId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetStateWiseDistrict/' + stateId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getDistrictWiseMandal(districtId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetDistrictWiseMandal/' + districtId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getMandalWiseVillage(areaId) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(this.baseUrl + 'GetMandalWiseVillage/' + areaId, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getSearchFarmers(keyword, body) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.post(this.baseUrl + 'SearchFarmers?keyword=' + encodeURIComponent(keyword), body, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getAreaWiseFarmerAgreementDetails(data) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.post(this.baseUrl + 'GetAreaWiseFarmerAgreementDetails', data, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getMaterialInputConsumed(data) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.post(this.baseUrl + 'GetMaterialInputConsumed', data, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  saveFarmerInputDatails(data) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.post(this.baseUrl + 'SaveFarmerInputDatails', data, httpOptions).subscribe(
        (res: any) => {
          observer.next(res);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getGetHBOMPracticePerAcreages(cropNameCode, psNumber) {
    return this.http.get<any>(this.baseUrl + `GetHBOMPracticePerAcreage?cropNameCode=${encodeURIComponent(cropNameCode)}&psNumber=${encodeURIComponent(psNumber)}`);
  }

  getFarmerAgreementAcres(cropNameCode, psNumber) {
    return this.http.get<any>(this.baseUrl + `GetFarmersNoOfAcres?cropNameCode=${encodeURIComponent(cropNameCode)}&psNumber=${encodeURIComponent(psNumber)}`);
  }

  getPlantationSchedule(crpGrp, crpName) {
    return this.http.get<PlantationSchedul[]>
      (this.getPlantationScheduleUrl.replace('{crpGrp}', encodeURIComponent(crpGrp)).replace('{crpName}', encodeURIComponent(crpName)));
  }


  getAllPlacesInfoByVillageName(villageName) {
    return this.http.get<any>(this.baseUrl + `GetCountryInfoByVillageName?villageName=` + villageName);
  }

  getVillageDetailsByName(villageName) {
    return this.http.get<any>(this.baseUrl + `GetVillageDetailsByName?villageName=` + villageName);
  }

}


