import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyHarvestService {

  baseUrl = environment.baseServiceURL;

  constructor(private http: HttpClient) { }

  getAllAreas(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'GetAllAreas');
  }

  getAllFarmers(areaid, psnumber): Observable<any> {
    const obj = {
      areaId: areaid,
      psNumber: psnumber
    };
    return this.http.post<any>(this.baseUrl + 'GetAreaWiseFarmerAgreementDetails', obj);
  }


  getCropGroup(areaId) {
    return this.http.get<any>(this.baseUrl + `GetAreaWiseCropGroup/${areaId}`);
  }

  getCropName(areaId) {
    return this.http.get<any>(this.baseUrl + `GetCropName/${areaId}`);
  }

  getSeasonFromTo(areaId) {
    return this.http.get<any>(this.baseUrl + `GetAreaWiseSeasonToFrom/${areaId}`);
  }

  getAreaWiseCountry(areaId) {
    return this.http.get<any>(this.baseUrl + `GetAreaWiseCountry/${areaId}`);
  }

  getStateWiseDistrict(stateCode) {
    return this.http.get<any>(this.baseUrl + `GetStateWiseDistrict/${stateCode}`);
  }

  getAreaWiseState(areaId) {
    return this.http.get<any>(this.baseUrl + `GetAreaWiseState/${areaId}`);
  }

  getMandalWiseVillage(mandalCode) {
    return this.http.get<any>(this.baseUrl + `GetMandalWiseVillage/${mandalCode}`);
  }

  getDistrictWiseMandal(districtCode) {
    return this.http.get<any>(this.baseUrl + `GetDistrictWiseMandal/${districtCode}`);
  }

  getAllCropSchemes(cropNameCode) {
    return this.http.get<any>(this.baseUrl + `GetCropSchemes?cropCode=${encodeURIComponent(cropNameCode)}`);
  }

  getBuyerList() {
    return this.http.get<any>(this.baseUrl + `GetAllEmployee`);

  }

  saveHarvest(dailyHarvset) {
    return this.http.post<any>(this.baseUrl + `GetAreaWiseFarmerAgreementDetails`, dailyHarvset);
  }

}
