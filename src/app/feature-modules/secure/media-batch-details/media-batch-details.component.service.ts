import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class MediaBatchDetailsService {
  private baseUrl;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseServiceURL;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  getOfficeLocationsOrderByName() {
    return this.http.get<any>(`${this.baseUrl}Organisation/GetOfficeLocationsOrderByName`);
  }
  getMediaProcessDetailsOrderByName() {
    return this.http.get<any>(`${this.baseUrl}Organisation/GetMediaProcessDetailsOrderByName`);
  }
  getPendingOrderScheduleDetails() {
    return this.http.get<any>(`${this.baseUrl}ScheduleDetail/GetPendingOrderScheduleDetails`);
  }

  getEmployeeIdAndName() {
    return this.http.get<any>(`${this.baseUrl}/GetAllEmployeeIdAndName`);
  }

  //getMediaMaterialDetails(param) {
  //  return this.http.post<any>(`${this.baseUrl}/GetMediaMaterialDetails`,param);
  //}

  getMediaMaterialDetails(param) {
    return this.http.post<any>(environment.baseServiceURL + `GetMediaMaterialDetails`, param, this.httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }

  getStockAndBatchDetailsFirst(date: any) {
    //console.log("Date s ", date);
    return this.http.get<any>(environment.baseServiceURL + `GetStockAndBatchDetailsFirst?date=${encodeURIComponent(date)}`, this.httpOptions);
  }

  saveMediaBatchMaterialDetails(param) {
    return this.http.post<any>(environment.baseServiceURL + `SaveMediaBatchMaterialDetails`, param, this.httpOptions).
      pipe(
        ((data) => {
          return data;
        }), (error => {
          return (error);
        })
      );
  }
}
