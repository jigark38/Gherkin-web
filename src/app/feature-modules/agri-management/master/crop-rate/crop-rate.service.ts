import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CropRateSaveModel } from './crop-rate.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CropRateService {

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  GetAllAreas(): Observable<any> {
    try {
      return this.http.get(environment.baseServiceURL + `GetAllAreas`, this.httpOptions).
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

  GetVillageByArea(areaId: string): Observable<any> {
    try {

      return this.http.get(environment.baseServiceURL + `GetVillageCode/` + areaId, this.httpOptions).
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

  GetFruitSizeMM(PSNumber: string) {
    try {

      return this.http.get(environment.baseServiceURL + `GetCropCountMM/` + PSNumber, this.httpOptions).
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

  addCropRates(cropRatesModels: CropRateSaveModel[]) {
    try {

      return this.http.post(environment.baseServiceURL + `AddCropRate`, cropRatesModels, this.httpOptions).
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
  getFruitSizeCount(cropCountMM: string) {
    try {

      return this.http.get(environment.baseServiceURL + `GetFruitSizeCount/` + cropCountMM, this.httpOptions).
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

  getAllAssociationRatesBySeason(psNumber: string) {
    try {
      return this.http.get(environment.baseServiceURL + `FindCropRateAccordingToSeason/` +
        psNumber, this.httpOptions).
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

  modifySelectedCropRate(cropRateModel: CropRateSaveModel) {
    try {
      return this.http.post(environment.baseServiceURL + `ModifySelectedCropRate`, cropRateModel, this.httpOptions).
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

  deleteCropRate(cropRateNumber: string) {
    try {

      return this.http.get(environment.baseServiceURL + `DeleteSelectedCropRate/` + cropRateNumber, this.httpOptions).
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
}
