import { Injectable } from '@angular/core';
import { CropGroup, CropsModel, Crops } from './crops-and-schemes.model';
import { AppConstants } from '../../../../constants/app.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CropesAndSchemesService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };


  public groupList: CropGroup[];

  private getCropGrpUrl = AppConstants.apiUrlGetCropGroup;
  private addCropGroupUrl = AppConstants.apiUrlAddCropGroup;
  private addCropsNSchemesUrl = AppConstants.apiUrlAddCrop;
  private getCropsUrl = AppConstants.apiUrlGetCrops;
  private getCropesbyNameAndGroupUrl = AppConstants.apiUrlSearchCrops;
  private updateCropsUrl = AppConstants.apiUrlUpdateCrops;


  saveGroupName(cropGroup: CropGroup) {
    return this.http.post(this.addCropGroupUrl, cropGroup);
  }

  getCrops() {
    return this.http.get<Array<Crops>>(this.getCropsUrl);
  }

  getCropGroupList() {
    return this.http.get<CropGroup[]>(this.getCropGrpUrl);
  }

  addCropsGroup(groupName) {
    return this.http.post(this.addCropGroupUrl, groupName);
  }

  saveCropsAndSchemes(cropsandschemes: CropsModel) {
    return this.http.post(this.addCropsNSchemesUrl, cropsandschemes);
  }

  search(crop: Crops) {
    return this.http.post<CropsModel>(this.getCropesbyNameAndGroupUrl, crop);
  }

  update(cropGroup) {
    return this.http.post(this.updateCropsUrl, cropGroup);
  }

  GetCropListByCropGroupCode(cropGroupCode: string) {
    try {
      return this.http.get<Crops[]>(environment.baseServiceURL + `GetCropListByCropGroupCode/`
        + encodeURIComponent(cropGroupCode), this.httpOptions)
        .pipe(
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
