import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BuyersInfo } from './daily-greens-model';


@Injectable({
  providedIn: 'root'
})
export class DialyGreensService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getBuyers(date: Date, area: any) {
    try {
      return this.http.get(environment.baseServiceURL + '/DialyGreensReceivingReport/GetBuyers?date='
        + date['_i'].year + '-' + (date['_i'].month + 1) + '-' + date['_i'].date + '&areaCode=' + area.areaId, this.httpOptions).
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

  getDataForBuyersReports(info: BuyersInfo) {
    return this.http
      .post(
        environment.baseServiceURL + `/DialyGreensReceivingReport/GetDailyBuyerWiseReport`,
        info,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }
}
