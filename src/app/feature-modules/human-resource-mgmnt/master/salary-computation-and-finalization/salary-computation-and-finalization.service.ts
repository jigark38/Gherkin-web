import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class SalaryComputationAndFinalizationService {
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
  getDepartment() {
    return this.http.get<any>(`${this.baseUrl}/GetDepartment`, this.httpOptions);
  }

  getSubDepartments(departmentCode: string) {
    try {
      return this.http.get<any>(environment.baseServiceURL + `GetSubdepartment/` + departmentCode, this.httpOptions);
        
    } catch (error) {

    }
  }

  getOfficeLocationsOrderByName() {
    return this.http.get<any>(`${this.baseUrl}Organisation/GetOfficeLocationsOrderByName`);
  }

  getEmployeeAttendanceDetails(input) {
    return this.http.post<any>(this.baseUrl + `api/v1/Attendance/GetAttendanceDetailsForSalaryCalculation`, input, this.httpOptions);
  }

  saveSalaryCalulation(input) {
    try {
      return this.http.post<any>(this.baseUrl + `api/v1/Attendance/SaveAttendanceDetailsForSalary`, input);

    } catch (error) {
      console.log("Error from service", error);
    }
    
  }

  
}
