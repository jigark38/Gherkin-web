import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../constants/app.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CropGrp, CropName, PlantationSchedul } from './plantation-scheduling.model';

@Injectable({
  providedIn: 'root'
})
export class PlantationSchedulingService {

  constructor(private http: HttpClient) { }

  private getCropGroupURL = AppConstants.apiUrlGetCropGroup;
  private getCropNameUrl = AppConstants.apiUrlGetCrops;
  private addSchedulePlantationUrl = AppConstants.apiUrlAddSchedulePlantation;
  private getPlantationScheduleUrl = AppConstants.apiUrlGetPlantationSchedules;
  private updateScheduleUrl = AppConstants.apiUrlUpdateSchedule;
  private getEmpDetailUrl = AppConstants.apiUrlGetEmpByEmpId;

  getCroupGroup() {
    return this.http.get<CropGrp[]>(this.getCropGroupURL);
  }
  getCropName() {
    return this.http.get<CropName[]>(this.getCropNameUrl);
  }

  addSchedulePlantation(plantSchl) {
    return this.http.post(this.addSchedulePlantationUrl, plantSchl);
  }

  getPlantationSchedule(crpGrp, crpName) {
    return this.http.get<PlantationSchedul[]>
      (this.getPlantationScheduleUrl.replace('{crpGrp}', encodeURIComponent(crpGrp)).replace('{crpName}', encodeURIComponent(crpName)));
  }

  updateSchedule(schedule) {
    return this.http.post(this.updateScheduleUrl, schedule);
  }

  getEmployeeDetail(empId) {
    return this.http.get<any>(this.getEmpDetailUrl.replace('{empId}', empId));
  }

}
