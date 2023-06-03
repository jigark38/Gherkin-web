import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InwardDetailRequest } from './daily-greens-inward-report.model';

@Injectable({
  providedIn: 'root'
})
export class InWardReportService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getReport(inwardDetailRequest: InwardDetailRequest) {
    try {
      return this.http.post(environment.baseServiceURL + "InWardDetails/ReportData", inwardDetailRequest, this.httpOptions).
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
