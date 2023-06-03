import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLS } from 'src/app/configuration';

import { of } from 'rxjs';
import {
  CropGroup, CropName, SeasonFromTo, PhaseEffectiveDate, CropPhaseName, HarvestStageDetails,
  PracticeDetails, MaterialGroup, MaterialName, PracticeMaterial
} from './package-of-practice.model';
import { AppConstants } from 'src/app/constants/app.constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PackageOfPracticeService {

  constructor(private http: HttpClient) { }
  private getAllMaterialGroups = AppConstants.apiUrlGetAllMaterialGroups;
  private getAllMaterialNamesByGroupCode = AppConstants.apiUrlGetAllMaterialNameByMaterialGroupCode;

  getAllCropGroups() {
    return this.http.get<CropGroup[]>(URLS.getAllCropGroups, httpOptions);
  }

  getAllCropByGroupCode(groupCode) {
    return this.http.get<CropName[]>(URLS.getAllCropByGroupCode + '?CropGroupCode=' + encodeURIComponent(groupCode), httpOptions);
  }

  getUOM(uomText) {
    if (!uomText) {
      return of([]);
    }
    return this.http.get<PracticeMaterial[]>(URLS.getUOM + '?UOM=' + encodeURIComponent(uomText), httpOptions);
  }
  getUOMList() {

    return this.http.get<PracticeMaterial[]>(URLS.getUOM, httpOptions);
  }

  getAllPSNoByCropNameCode(cropNameCode) {
    return this.http.get<SeasonFromTo[]>(URLS.getAllPSNoByCropNameCode + '?CropNameCode=' + encodeURIComponent(cropNameCode), httpOptions);
    // return this.http.get<SeasonFromTo[]>(URLS.getAllPSNoByCropNameCode + 'CNC_1', httpOptions);
  }

  getPSNoByCropAndHBOMDivisionForFind(cropNameCode, packageOfPractice) {
    return this.http.get<SeasonFromTo[]>(URLS.getPSNoByCropAndHBOMDivisionForFind + '/'
      + encodeURIComponent(cropNameCode) + '/'
      + encodeURIComponent(packageOfPractice), httpOptions);
  }

  getAllPhaseEffectiveDateByCropNameCode(cropNameCode, packageOfPractice) {
    return this.http.get<PhaseEffectiveDate[]>(URLS.getAllPhaseEffectiveDateByCropNameCode + '/' +
      encodeURIComponent(cropNameCode) + '/' + encodeURIComponent(packageOfPractice), httpOptions);
    // return this.http.get<PhaseEffectiveDate[]>(URLS.getAllPhaseEffectiveDateByCropNameCode + 'CNC_1', httpOptions);
  }

  getAllCropPhaseNameByPackageOfPractice(packageOfPractice: string) {
    return this.http.get<CropPhaseName[]>(URLS.getAllCropPhaseNameByPackageOfPractice + '/'
      + encodeURIComponent(packageOfPractice), httpOptions);
  }
  getHarvestDetails(phaseCode: string) {
    return this.http.get<HarvestStageDetails>(URLS.getAllHarvestDetailsByPhaseCode + '?HcropPhasecode=' +
      encodeURIComponent(phaseCode), httpOptions);
    // return this.http.get<HarvestStageDetails>(URLS.getAllHarvestDetailsByPhaseCode + 'HSTC_09', httpOptions);
  }

  getCropStageList(phaseCode: string, transCode: string) {
    return this.http.get<any>(URLS.getCropStageList + '?psNO='
      + encodeURIComponent(phaseCode) + '&transCode=' + encodeURIComponent(transCode), httpOptions);
    // return this.http.get<HarvestStageDetails>(URLS.getAllHarvestDetailsByPhaseCode + 'HSTC_09', httpOptions);
  }

  getAllMatGroups() {
    return this.http.get<MaterialGroup[]>(this.getAllMaterialGroups, httpOptions);
  }

  getAllMatNameByMatGroupCode(groupCode) {
    return this.http.get<MaterialName[]>(this.getAllMaterialNamesByGroupCode + encodeURIComponent(groupCode), httpOptions);
  }

  savePracticeDetails(pDetails: PracticeDetails) {
    const abc = JSON.stringify(pDetails);
    return this.http.post<PracticeDetails>(URLS.savePracticeDetails, pDetails, httpOptions);
  }
}
