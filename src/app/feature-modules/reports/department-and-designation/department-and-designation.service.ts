import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DepartmentDesignation, Department } from './department-and-designation.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentAndDesignationService {
  private baseUrl;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseServiceURL;
  }

  getDepartmentDesignationReportData(departmentCodeId = '') {
    if (departmentCodeId) {
      return this.http.get<DepartmentDesignation[]>(`${this.baseUrl}/DepartmentAndDesignation/Get?departmentCode=${encodeURIComponent(departmentCodeId)}`);
    } else {
      return this.http.get<DepartmentDesignation[]>(`${this.baseUrl}/DepartmentAndDesignation/Get`);
    }
  }

  getDropDownForDepartmentList() {
    return this.http.get<Department[]>(`${this.baseUrl}/GetDepartment`);
  }
}
