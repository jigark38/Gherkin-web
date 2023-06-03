import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { Observable } from 'rxjs';
import { CropName, CropGroupDto, CropFromTo, Area, FarmerDetails } from './farmer-wise-summary.model';

@Injectable({
  providedIn: 'root',
})
export class FarmerWiseSummaryService {
  constructor(private http: HttpClient) { }

  private getCropUrl = AppConstants.apiUrlGetAllCropGroups;
  private getCropNamesUrl = AppConstants.apiUrlGetCropNames;
  private getPlantationSchemesUrl = AppConstants.apiUrlGetPlantationSchemes;
  private getAllAreaUrl = AppConstants.apiUrlGetArea;
  private getFarmerWiseSummaryUrl = AppConstants.apiUrlGetFarmerWiseSummaryDetails;

  public getCropGroups(): Observable<any> {
    return this.http.get<any>(this.getCropUrl);
  }


  public getCropNamesByGroupCode(groupCode: string): Observable<CropName[]> {
    return this.http.get<CropName[]>(this.getCropNamesUrl.replace('{groupCode}', groupCode));
  }

  public getPlantationSchemeDetails(cNameCode: string): Observable<CropFromTo[]> {
    return this.http.get<CropFromTo[]>(this.getPlantationSchemesUrl.replace('{CNameCode}', cNameCode));
  }

  public getAllArea(): Observable<Area[]> {
    return this.http.get<Area[]>(this.getAllAreaUrl);
  }

  public getFarmerWiseSummaryDetails(areaId: string, psNo: string): Observable<FarmerDetails[]> {
    return this.http.get<FarmerDetails[]>(this.getFarmerWiseSummaryUrl.replace('{areaId}',
      encodeURIComponent(areaId)).replace('{psNo}', encodeURIComponent(psNo)));
  }

}
