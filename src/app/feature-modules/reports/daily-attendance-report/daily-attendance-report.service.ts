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
export class DailyAttendanceReportService {

  constructor(private http: HttpClient) { }
  private getDepartmentsUrl = AppConstants.apiUrlGetDepartment;
  private getSubDepartmentURL = AppConstants.apiUrlGetSubDepartment;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  getOfficeLocations() {
    try {
      return this.http.get(environment.baseServiceURL + `Organisation/GetOfficeLocations`, this.httpOptions).
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
  public getAllDepartments(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(this.getDepartmentsUrl, this.httpOptions);
  }

  public getSubDepartment(departmentId): Observable<Array<SubDepartment>> {
    return this.http.get<Array<SubDepartment>>(
      this.getSubDepartmentURL.replace('{DeptId}', departmentId),
      this.httpOptions
    );
  }
  getShiftList() {
    return this.http.get<ShiftDetails[]>(URLS.getShiftList, this.httpOptions);
  }
  getAttendanceDetails(formvalue) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(environment.baseServiceURL + 'DialyAttendanceReport/GetAttendanceDetails?date=' +
        encodeURIComponent(this.updateDateFormate(formvalue.dialydate)) +
        '&orgOfficeNo=' + encodeURIComponent(formvalue.unitName) +
        '&status=' + encodeURIComponent(formvalue.statusName) +
        '&deptCode=' + encodeURIComponent(formvalue.departmentName) +
        '&subDeptCode=' + encodeURIComponent(formvalue.subDepartmentName) +
        '&shift=' + encodeURIComponent(formvalue.shiftName) +
        '&division=' + encodeURIComponent(formvalue.divisionName) +
        '&filter=' + encodeURIComponent(formvalue.filter) +
        '&category=' + encodeURIComponent(formvalue.category) +
        '&gender=' + encodeURIComponent(formvalue.gender) +
        '&biometricId=' + encodeURIComponent(formvalue.biometricId ? +formvalue.biometricId : 0), this.httpOptions).subscribe(
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
  getAttendanceDetailsForView(formvalue) {
    return new Observable(observer => {
      const httpOptions = {
        headers: new HttpHeaders(
          'application/json'
        )
      };
      this.http.get(environment.baseServiceURL + 'DialyAttendanceReport/GetAttendanceDetailsForView?date=' +
        encodeURIComponent(this.updateDateFormate(formvalue.dialydate)) +
        '&orgOfficeNo=' + encodeURIComponent(formvalue.unitName) +
        '&status=' + encodeURIComponent(formvalue.statusName) +
        '&deptCode=' + encodeURIComponent(formvalue.departmentName) +
        '&subDeptCode=' + encodeURIComponent(formvalue.subDepartmentName) +
        '&shift=' + encodeURIComponent(formvalue.shiftName) +
        '&division=' + encodeURIComponent(formvalue.divisionName) +
        '&filter=' + encodeURIComponent(formvalue.filter) +
        '&category=' + encodeURIComponent(formvalue.category) +
        '&gender=' + encodeURIComponent(formvalue.gender) +
        '&biometricId=' + encodeURIComponent(formvalue.biometricId ? +formvalue.biometricId : 0), this.httpOptions).subscribe(
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
  updateDateFormate(dateUpdate) {
    try {
      const date = new Date(dateUpdate);
      date.setDate(date.getDate() + 1);
      const data = date.toISOString();
      return data.split('T')[0];

    } catch (error) {
      console.log('updateDateFormate', error);
    }
  }
}
