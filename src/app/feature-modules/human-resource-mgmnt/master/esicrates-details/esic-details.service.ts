import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { ESICRates } from './esic-details.model';

@Injectable({
  providedIn: 'root'
})
export class EsicDetailsService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  private baseURL = environment.baseServiceURL;


  addESICRates(esicRate: ESICRates) {
    try {
      return this.http.post(environment.baseServiceURL + `CreateESICRates`, esicRate, this.httpOptions).
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

  updateESICRates(esicRate: ESICRates) {
    try {
      return this.http.put(environment.baseServiceURL + `UpdateESICRates`, esicRate, this.httpOptions).
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

  getESICRates() {
    try {
      return this.http.get(environment.baseServiceURL + `GetESICRates`, this.httpOptions).
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
