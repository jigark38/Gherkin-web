import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../../../../constants/app.constants';
import { Department, SubDepartment, Designation, Employee, FieldStaffModel, EmployeeDetl } from './fieldstaffdetails.model';

@Injectable({
  providedIn: 'root'
})

export class FielldStaffDetailsService {

  constructor(private http: HttpClient) { }
  private getFieldStaffURL = AppConstants.apiUrlGetFieldStaff;
  private UpdateFieldStaffURL = AppConstants.apiUrlUpdateFieldStaff;
  private getFieldStaffByAreaURL = AppConstants.apiUrlGetFieldStaffByArea;
  private addFieldStaffURL = AppConstants.apiUrlAddFieldStaff;
  private getAreaURL = AppConstants.apiUrlGetArea;
  private getDepartmentURL = AppConstants.apiUrlGetDepartment;
  private getSubDepartmentURL = AppConstants.apiUrlGetSubDepartment;
  private getDesgBySubDeptURL = AppConstants.apiUrlGetDesignationBySubDepart;
  private getEmpByDesgURL = AppConstants.apiUrlGetEmpByDesg;
  private getEmpByEmpIdURL = AppConstants.apiUrlGetEmpByEmpId;
  private getAllEmployeeURL = AppConstants.apiUrlGetAllEmployee;
  private getAllDesiginationURL = AppConstants.apiUrlGetAllDesignation;

  getArea() {
    return this.http.get(this.getAreaURL);
  }

  getDepartment() {
    return this.http.get<Department[]>(this.getDepartmentURL);
  }

  getSubDepartment(departmentId) {
    return this.http.get<SubDepartment[]>(this.getSubDepartmentURL.replace('{DeptId}', departmentId));
  }

  getDesgBySubDeprt(subDeprt) {
    return this.http.get<Designation[]>(this.getDesgBySubDeptURL.replace('{subDepartment}', subDeprt));
  }

  getEmployeByDesg(desigination) {
    return this.http.get<any>(this.getEmpByDesgURL + encodeURIComponent(desigination));
  }

  addFieldStaff(staffDetail) {
    return this.http.post(this.addFieldStaffURL, staffDetail);
  }

  getFieldStaffByArea(areaCode) {
    return this.http.get<FieldStaffModel[]>(this.getFieldStaffByAreaURL + encodeURIComponent(areaCode));
  }

  updateFieldStaff(updatedata) {
    return this.http.put(this.UpdateFieldStaffURL, updatedata);
  }

  getEployeeByEmpId(empid) {
    return this.http.get<EmployeeDetl>(this.getEmpByEmpIdURL.replace('{empId}', empid));
  }

  getAllEmployee() {
    return this.http.get<EmployeeDetl[]>(this.getAllEmployeeURL);
  }

  getAllDesignation() {
    return this.http.get<Designation[]>(this.getAllDesiginationURL);
  }
}
