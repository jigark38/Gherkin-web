import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { URLS } from 'src/app/configuration';
import { SupplierDetails, Country, State, Place, District, SupplierRequestModel, Organisation, SupplierResponseModel } from './suppliers-details.model';
import { AppConstants } from 'src/app/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SuppliersDetailsService {

  constructor(private router: Router, private http: HttpClient) { }

  private getAllCountries = AppConstants.apiUrlCountry;
  private postCountrybyCountryName = AppConstants.apiUrlAddCountry;
  private postSupplierDetails = AppConstants.apiUrlAddSupplierDetail;
  private postUpdateSupplierDetails = AppConstants.apiUrlUpdateSupplierDetail;
  private getStatesByCountryCode = AppConstants.apiUrlState;
  private postSaveState = AppConstants.apiUrlSaveState;
  private getDiestrictByStateCode = AppConstants.apiUrlDistrict;
  private postSaveDistrict = AppConstants.apiUrlSaveDistrict;
  private getPlaceByDistCode = AppConstants.apiUrlGetPlaceByDistCode;
  private postSavePlace = AppConstants.apiUrlSavePlace;
  private getSupplierByOrgId = AppConstants.apiUrlSupplierDetailsByID;
  private apiGetAllSuppliers = AppConstants.apiUrlGetAllSupplierOrgs;

  protected supplier: Organisation[] = [{ organisationName: 'Org1', supplierOrgID: '1' }, { organisationName: 'Org2', supplierOrgID: '2' }];
  protected searchData = ['red', 'green', 'blue', 'cyan', 'magenta'];

  searchedSupplier: SupplierDetails;

  addSupplier(data: SupplierRequestModel): Observable<any> {
    const abc = JSON.stringify(data);
    return this.http.post<any>(this.postSupplierDetails, data)
      .pipe(tap(res => {

      }));
  }
  updateSupplier(data: SupplierRequestModel): Observable<any> {
    const abc = JSON.stringify(data);
    return this.http.post<any>(this.postUpdateSupplierDetails, data)
      .pipe(tap(res => {

      }));
  }

  getCountry(headers?: HttpHeaders) {
    // return of(this.countryData);
    return this.http
      .get<Country[]>(this.getAllCountries)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  saveCounrtry(country: Country) {
    // return of(this.countryData);
    return this.http
      .post<Country>(this.postCountrybyCountryName.replace('{countryName}', encodeURIComponent(country.countryName)), null)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getState(countryCode: string) {
    return this.http
      .get<State[]>(this.getStatesByCountryCode.replace('{countryCode}', encodeURIComponent(countryCode)))
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  saveState(stateObj: State) {
    return this.http
      .post<State>(this.postSaveState, stateObj)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getDistrict(stateCode: string) {
    return this.http
      .get<District[]>(this.getDiestrictByStateCode.replace('{stateCode}', encodeURIComponent(stateCode)))
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  saveDistrict(districtObj: District) {
    return this.http
      .post<District>(this.postSaveDistrict, districtObj)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getPlace(distCode: string) {
    return this.http
      .get<Place[]>(this.getPlaceByDistCode.replace('{distCode}', encodeURIComponent(distCode)))
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  savePlace(state: Place) {
    return this.http
      .post<Place>(this.postSavePlace, state)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  findSupplierByOrgId(organisationId: string) {
    return this.http.get<SupplierResponseModel>(this.getSupplierByOrgId.replace('{0}', encodeURIComponent(organisationId)))
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getAllSuppliers() {
    // return of(this.supplier);
    return this.http.get<SupplierDetails[]>(this.apiGetAllSuppliers);
  }
  // getState(country: string) {
  //   return of(this.searchData);
  //   // return this.http.get<any>(`${this.baseURL}/getEmployeeDetails`).subscribe(res=>{
  //   // });
  // }
  // getPlace(state: string) {
  //   return of(this.searchData);
  //   // return this.http.get<any>(`${this.baseURL}/getEmployeeDetails`).subscribe(res=>{
  //   // });
  // }

}
