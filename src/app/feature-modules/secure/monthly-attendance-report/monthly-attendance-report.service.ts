import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConstants } from 'src/app/constants/app.constants';
import { Observable } from 'rxjs/internal/Observable';
import { Department, SubDepartment } from '../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { ShiftDetails } from 'src/app/feature-modules/human-resource-mgmnt/master/shift-details/shift-details.model';
import { URLS } from 'src/app/configuration';
@Injectable({
  providedIn: 'root'
})
export class MonthlyAttendanceReportService {

  constructor(private http: HttpClient) { }
  private getDepartmentsUrl = AppConstants.apiUrlGetDepartment;
  private getSubDepartmentURL = AppConstants.apiUrlGetSubDepartment;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  getMonthlyAttendanceDetails(formvalue) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      debugger
      this.http.get(environment.baseServiceURL + '/MonthlyAttendance/GetMonthlyAttendanceDetails?orgOfficeNo=' + encodeURIComponent(formvalue.unitName) +
        '&status=' + encodeURIComponent(formvalue.statusName) +
        '&division=' + encodeURIComponent(formvalue.divisionName) +
        '&deptCode=' + encodeURIComponent(formvalue.departmentName) +
        '&subDeptCode=' + encodeURIComponent(formvalue.subDepartmentName) +
        '&month=' + encodeURIComponent(formvalue.month) +
        '&year=' + encodeURIComponent(formvalue.year) +
        '&filter=' + encodeURIComponent(formvalue.filter), this.httpOptions).subscribe(
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
}
