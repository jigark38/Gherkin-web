import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReportSummaryOption } from './green-received-summary-report.model';

@Injectable({
  providedIn: 'root'
})
export class GreenReceivedSummaryService {

  constructor(private http: HttpClient) { }

  public getSeasonFromTo(): Observable<any> {
    return this.http.get<any>(environment.baseServiceURL + 'GreensReceiptsSummaryReport/GetSeasonFromTo');
  }

  public getMaterialGroup(): Observable<any> {
    return this.http.get<any>(environment.baseServiceURL + 'GreensReceiptsSummaryReport/GetMaterialGroup');
  }

  public getMaterialName(groupName: string): Observable<any> {
    return this.http.get<any>(environment.baseServiceURL + 'GreensReceiptsSummaryReport/GetMaterialName?cropGroupName=' + groupName);
  }

  public getReportDataOfSummary(reportSummaryOption: ReportSummaryOption): Observable<any> {
    return this.http.post<any>(environment.baseServiceURL + 'GreensReceiptsSummaryReport/GetReport', reportSummaryOption);

  }
}
