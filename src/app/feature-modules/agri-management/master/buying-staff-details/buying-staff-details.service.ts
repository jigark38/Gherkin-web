import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/constants/app.constants';
import { Department, Designation, Employee, SubDepartment } from '../fieldstaffdetails/fieldstaffdetails.model';
import { HarvestAreas } from '../../../secure/finished-semifinished-opening-stocks/finished-semifinished-opening.model';

@Injectable({
  providedIn: 'root'
})
export class BuyingStaffDetailsService {

  constructor(private http: HttpClient) { }

  private addBuyingStaffDetailsUrl = AppConstants.apiUrlAddBuyingStaffDetails;
  private updateBuyingStaffDetailsUrl = AppConstants.apiUrlUpdateBuyingStaffDetails;
  private getDepartmentURL = AppConstants.apiUrlGetDepartment;
  private getSubDepartmentURL = AppConstants.apiUrlGetSubDepartment;
  private getDesgBySubDeptURL = AppConstants.apiUrlGetDesignationBySubDepart;
  private getEmpByDesgURL = AppConstants.apiUrlGetEmpByDesg;
  private getHarvestAreasUrl = AppConstants.apiUrlGetHarvestAreas;
  private getBuyingStaffDetailsByEmployeeUrl = AppConstants.apiUrlGetBuyingStaffDetailsByEmployee;
  private deleteBuyingStaffDetailsUrl = AppConstants.apiUrlDeleteBuyingStaffDetails;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  addBuyingStaffDetails(harvestAreaBuyingStaffDetailsList) {
    return this.http.post(this.addBuyingStaffDetailsUrl, harvestAreaBuyingStaffDetailsList);
  }

  updateBuyingStaffDetails(harvestAreaBuyingStaffDetailsList) {
    return this.http.put(this.updateBuyingStaffDetailsUrl, harvestAreaBuyingStaffDetailsList);
  }

  getDepartment() {
    return this.http.get<Department[]>(this.getDepartmentURL);
  }

  public getSubDepartment(departmentId) {
    return this.http.get<Array<SubDepartment>>(
      this.getSubDepartmentURL.replace('{DeptId}', departmentId));
  }

  public getDesgBySubDeprt(subDeprt) {
    return this.http.get<Array<Designation>>(
      this.getDesgBySubDeptURL.replace('{subDepartment}', subDeprt)
    );
  }

  public getEmployeByDesg(desigination) {
    return this.http.get<Array<Employee>>(this.getEmpByDesgURL + encodeURIComponent(desigination));
  }

  getHarvestAreas() {
    return this.http.get<HarvestAreas[]>(this.getHarvestAreasUrl);
  }

  getBuyingStaffDetailsByEmployee(empId) {
    return this.http.get(
      this.getBuyingStaffDetailsByEmployeeUrl.replace('{employeId}', encodeURIComponent(empId)));
  }

  deleteBuyingStaffDetails(empId, areaId) {
    return this.http.get(
      this.deleteBuyingStaffDetailsUrl.replace('{employeId}', encodeURIComponent(empId)).replace('{areaId}', encodeURIComponent(areaId)));
  }

}
