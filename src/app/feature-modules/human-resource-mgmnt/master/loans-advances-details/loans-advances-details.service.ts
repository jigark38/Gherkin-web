import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrganisationModel } from 'src/app/feature-modules/organisation-details/org-details/orgnisation-model';
import { environment } from 'src/environments/environment';
import { Employee } from '../employee-details/employee-details.model';

@Injectable({
  providedIn: 'root'
})
export class LoansAdvancesDetailsService {

  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseServiceURL;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getOrganisationDetails() {
    return this.http.get<OrganisationModel[]>(`${this.baseUrl}Organisation/GetOfficeLocations`, this.httpOptions);
  }

  getDesignation(subDepartment) {
    return this.http.get(`${this.baseUrl}GetDesignations/${encodeURIComponent(subDepartment)}`, this.httpOptions);
  }

  getDivision(department) {
    return this.http.get(`${this.baseUrl}GetSubdepartment/${encodeURIComponent(department)}`, this.httpOptions);
  }

  getDepartmentByOrganisation(orgofficeNo) {
    return this.http.get(`${this.baseUrl}GetDepartmentByOrganisation/${encodeURIComponent(orgofficeNo)}`, this.httpOptions);
  }

  createLoansAdvances(loanAdvances) {
    return this.http.post(`${this.baseUrl}api/v1/LoansAdvances/CreateLoansAdvances`, loanAdvances, this.httpOptions);
  }

  getLoansAdvancesNo() {
    return this.http.get(`${this.baseUrl}api/v1/LoansAdvances/GetLoansAdvancesNo`, this.httpOptions);
  }

  seachLoansAdvances(orgOfficeNo, employeeId) {
    return this.http.get(`${this.baseUrl}api/v1/LoansAdvances/SeachLoansAdvances?orgOfficeNo=${encodeURIComponent(orgOfficeNo)}&employeeId=${encodeURIComponent(employeeId)}`, this.httpOptions);
  }

  updateLoansAdvances(loadAdvance) {
    return this.http.put(`${this.baseUrl}api/v1/LoansAdvances/UpdateLoansAdvances`, loadAdvance, this.httpOptions);
  }

  getAllEmployeeByDesignationCode(designationcode: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.baseUrl}GetAllEmployeeByDesignationCode/${encodeURIComponent(designationcode)}`, this.httpOptions);
  }

  GetEmployeeByDesignationsManager() {
    return this.http.get<any>(`${this.baseUrl}GetEmployeeByDesignationsManager`);
  }

  getEmployeeByBiometricId(biometricId: number): Observable<Employee[]> {
    try {
      if (!biometricId) {
        return of([]);
      }
      return this.http.get<Employee[]>(environment.baseServiceURL + `GetEmployeeByBioMetricId/` + biometricId, this.httpOptions).
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
