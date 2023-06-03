import { environment } from './../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvidentFunRatesServiceService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  saveProvidentFundRateDetail(pfRateDetail: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(environment.baseServiceURL + `AddProvidentFundRateDetails`, pfRateDetail, this.httpOptions);
  }

  updateProvidentFundRateDetail(pfRateDetail: any) {
    return this.http.
      post(environment.baseServiceURL + `UpdateProvidentFundRateDetails`, pfRateDetail, this.httpOptions);
  }

  getProvidentFundRateDetails() {
    return this.http.get(environment.baseServiceURL + `GetProvidentFundRateDetails`, this.httpOptions);
  }
}
