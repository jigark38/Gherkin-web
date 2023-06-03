import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { FarmerForm, HarvestData, HarvestArea } from './sowing-farmer-details.model';
import { Employee } from '../../../human-resource-mgmnt/master/employee-details/employee-details.model';
import { Farmer, FarmerDetails } from '../../master/farmer-details/farmer-details.model';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { FarmerAndVillage } from '../inputs-returns-from-farmers/inputs-returns-from-farmers.model';

@Injectable({
  providedIn: 'root'
})
export class SowingFarmerDetailsService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseServiceURL;

  private getCountryUrl = AppConstants.apiUrlCountry;
  private getStateUrl = AppConstants.apiUrlState;
  private getDistrictUrl = AppConstants.apiUrlDistrict;
  private getMandalUrl = AppConstants.apiUrlMandalByDistrict;
  private getVillageByMandalUrl = AppConstants.apiUrlVillageByMandal;
  private getHarvestAreaUrl = AppConstants.apiUrlGetHarvestArea;
  private getAllFarmersUrl = AppConstants.apiUrlGetAllfarmers;
  private getFormDetailUrl = AppConstants.apiUrlSowingAndFarmingDetails;
  private getFarmerByStateUrl = AppConstants.apiUrlGetFarmersByState;
  private getFarmerByVillageUrl = AppConstants.apiUrlGetFarmersByVillage;
  private getDistrictByCodeUrl = AppConstants.apiUrlDistrictByCode;
  private getMandalByCodeUrl = AppConstants.apiUrlMandalByCode;
  private getVillageByCodeUrl = AppConstants.apiUrlVillageByCode;
  private getFieldSatffByArea = AppConstants.apiUrlGetFieldStaffByArea;
  private getEmployeeByEmpIdUrl = AppConstants.apiUrlGetEmpByEmpId;
  private getFarmingGriddetailUrl = AppConstants.apiUrlSowingGridDetails;
  private getAreaDetailsByCodeUrl = AppConstants.apiUrlSearchAreaByCode;
  private AddSowingDetailsUrl = AppConstants.apiUrlAddSowingDetails;

  getHarvestAreaList() {
    return this.http.get<HarvestArea[]>(this.getHarvestAreaUrl);
  }

  getAllFarmers() {
    return this.http.get<any>(this.getAllFarmersUrl);
  }

  getFormData(areaCode) {
    return this.http.get<FarmerForm>(this.getFormDetailUrl.replace('{areaCode}', encodeURIComponent(areaCode)));
  }

  VillageByCode(villageCode) {
    return this.http.get<any>(this.getVillageByCodeUrl.replace('{villageCode}', encodeURIComponent(villageCode)));
  }

  GetFieldStaffByArea(areaCode) {
    return this.http.get(this.getFieldSatffByArea + encodeURIComponent(areaCode));
  }

  GetEmployeeByEmpId(empId) {
    return this.http.get<Employee>(this.getEmployeeByEmpIdUrl.replace('{empId}', encodeURIComponent(empId)));
  }

  GetFarmingGridDetail(psNumber, sowingDate, cropCode) {
    return this.http.get<HarvestData>(this.getFarmingGriddetailUrl.replace('{PSNo}',
      encodeURIComponent(psNumber)).replace('{SowingDate}',
        encodeURIComponent(sowingDate)).replace('{CropCode}', encodeURIComponent(cropCode)));
  }

  GetAreaDetailsByCode(areaCode) {
    return this.http.get<any>(this.getAreaDetailsByCodeUrl + encodeURIComponent(areaCode));
  }

  AddSowingDetails(sowingDetail) {
    return this.http.post<any>(this.AddSowingDetailsUrl, sowingDetail);
  }

  GetFarmerListByAreaEmployeePSNUmberAndFarmerName(farmerName: string, areaId: string, employeeId: string, psNumber: string) {
    if (!farmerName || !areaId || !employeeId || !psNumber) {
      return of([]);
    }
    return this.http.get<FarmerAndVillage[]>(this.baseUrl + `GetFarmerListByAreaEmployeePSNumberAndFarmerName/`
      + encodeURIComponent(farmerName)
      + `/` + encodeURIComponent(areaId)
      + `/` + encodeURIComponent(employeeId)
      + `/` + encodeURIComponent(psNumber));
  }

  GetFarmerListByAreaEmployeePSNumberAndFarmerAltContactPerson(
    farmerAltContactPerson: string, areaId: string, employeeId: string, psNumber: string) {
    if (!farmerAltContactPerson || !areaId || !employeeId || !psNumber) {
      return of([]);
    }
    return this.http.get<FarmerAndVillage[]>(this.baseUrl + `GetFarmerListByAreaEmployeePSNumberAndFarmerAltContactPerson/`
      + encodeURIComponent(farmerAltContactPerson)
      + `/` + encodeURIComponent(areaId)
      + `/` + encodeURIComponent(employeeId)
      + `/` + encodeURIComponent(psNumber));
  }

}
