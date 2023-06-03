import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FarmersAgreement } from '../models/FarmerAgreement.model';



@Injectable({
  providedIn: 'root'
})


export class FarmerAgreementService {

  baseUrl = environment.baseServiceURL;
  // baseUrl = 'https://241c8ba0.ngrok.io/';

  constructor(private http: HttpClient) {
  }
  getAgreementCode() {
    return this.http.get<any>(this.baseUrl + 'GetAgreementCode');
  }
  getAllAreas() {

    return this.http.get<any>(this.baseUrl + 'Area/GetAllArea');
  }

  getCropGroup() {

    return this.http.get<any>(this.baseUrl + 'GetCropGroup');
  }

  getVillageCode(areaId) {
    return this.http.get<any>(this.baseUrl + `GetVillageCode/${areaId}`);
  }

  getEmployeeCode(areaId) {
    return this.http.get<any>(this.baseUrl + `GetFieldStaffbyArea?area=${encodeURIComponent(areaId)}`);
  }

  getFieldStaffWithEmployeeDetails(areaId, fieldtype) {
    return this.http.get<any>(this.baseUrl + `GetFieldStaffWithEmployeeDetails/${areaId}/${fieldtype}`);
  }


  getFarmersByVillage(villageCode) {
    return this.http.get<any>(this.baseUrl + `GetFarmersByVillageCode?villageCode=${encodeURIComponent(villageCode)}`);
  }

  getDistrictDetails(districtCode) {
    return this.http.get<any>(this.baseUrl + `v1/district/GetDistrictByCode?districtCode=${encodeURIComponent(districtCode)}`);
  }

  getCountryDetails(countryCode) {

    return this.http.get<any>(this.baseUrl + `v1/Country/GetCountryByCode?countryCode=${encodeURIComponent(countryCode)}`);
  }


  getCropCode(cropGroupCode) {
    return this.http.get<any>(this.baseUrl + `GetCropNameCode/${encodeURIComponent(cropGroupCode)}`);
  }

  getSeasonFromTo(cropNameCode) {
    return this.http.get<any>(this.baseUrl + `GetSeasonFromTo/${encodeURIComponent(cropNameCode)}`);
  }


  getFruitSize(psNumber) {
    return this.http.get<any>(this.baseUrl + `GetCropCountMM/${encodeURIComponent(psNumber)}`);
  }

  getFruitCount(fruitmm) {
    return this.http.get<any>(this.baseUrl + `GetFruitSizeCount/${encodeURIComponent(fruitmm)}`);
  }

  getCropRates(cropScheme, cropCountmm) {
    return this.http.get<any>(this.baseUrl + `GetCropRateByCode?cropSchemeCode=${encodeURIComponent(cropScheme)}&cropCountMM=${encodeURIComponent(cropCountmm)}`);
  }

  isValidateFarmerAccount(farmersAccountNo, farmerCode, PSNumber) {
    return this.http.get<any>
      (this.baseUrl + `IsValidateFarmerAccount?FarmersAccountNo=${encodeURIComponent(farmersAccountNo)}&FarmerCode=${encodeURIComponent(farmerCode)}&PSNumber=${encodeURIComponent(PSNumber)}`);
  }

  getFarmerAccountList(CropGroupCode, CropNameCode, PSNumber) {
    return this.http.get<any>(this.baseUrl + `FarmerAccountList?CropGroupCode=${encodeURIComponent(CropGroupCode)}&CropNameCode=${encodeURIComponent(CropNameCode)}&PSNumber=${encodeURIComponent(PSNumber)}`);
  }

  getFarmerDetailsByAccount(farmersAccountNo, PSNumber) {
    return this.http.get<any>(this.baseUrl + `FarmerDetailsByAccount?farmersAccountNo=${encodeURIComponent(farmersAccountNo)}&PSNumber=${encodeURIComponent(PSNumber)}`);
  }

  //  -------------------------------------------  Find Farmers Agreement  ----------------------------------------------------



  findFarmerAgreement(agreement) {
    return this.http.get<FarmersAgreement>(this.baseUrl + `SearchAgreement?areaId=${encodeURIComponent(agreement.AreaID)}
    &cityCode=${encodeURIComponent(agreement.VillageCode)}&farmersCode=${encodeURIComponent(agreement.FarmerCode)}
    &cropGroupCode=${encodeURIComponent(agreement.CropGroupCode)}&cropNameCode=${encodeURIComponent(agreement.CropNameCode)}
    &psNumber=${encodeURIComponent(agreement.PSNumber)}`);
  }


  saveFarmerAgreement(agreement) {
    const farmersAgreement = { ...agreement };
    farmersAgreement.FarmersAgreementCode = 'FA_' + farmersAgreement.FarmersAgreementCode;
    return this.http.post<any>(this.baseUrl + `CreateAgreement`, farmersAgreement);
  }

  updateFramerAgreement(agreement) {

    // console.log("In the service agmt", agreement);
    const farmersAgreement = { ...agreement };
    // farmersAgreement.FarmersAgreementCode = 'FA_' + farmersAgreement.FarmersAgreementCode;
    console.log('Agreement before updating', farmersAgreement);
    // return this.http.post<any>(this.baseUrl + `UpdateAgreement/${agreement.FarmersAgreementCode}`, agreement);
    return this.http.post<any>(this.baseUrl + `UpdateAgreement/${farmersAgreement.FarmersAgreementCode}`, farmersAgreement);
  }

  deleteFarmersAgreement(agreementCode, CropSchemeCode) {
    // agreementCode = 'FA_' + agreementCode;
    return this.http.delete<any>
      (this.baseUrl + `DeleteAgreement?farmersAgreementCode=${encodeURIComponent(agreementCode)}&cropSchemeCode=${encodeURIComponent(CropSchemeCode)}`);
  }



}
