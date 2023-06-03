import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLS } from 'src/app/configuration';
import { map } from 'rxjs/operators';
import { StateOverseas, CityOverseas, CountryOverseas, CurrencyOverseas, Consignee } from './consignee-buyers.model';
import { state } from '@angular/animations';
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
export class ConsigneeBuyersService {

  constructor(private http: HttpClient) { }
  private getAllOverseasCountry = AppConstants.apiUrlGetAllOverseasCountry;
  private saveOverseasCountry = AppConstants.apiUrlSaveOverseasCountry;
  private getAllStatesByCountry = AppConstants.apiUrlGetAllStatesByCountry;
  private saveOverseasState = AppConstants.apiUrlSaveOverseasState;
  private getAllCityByStateID = AppConstants.apiUrlGetAllCityByStateID;
  private saveOverseasCity = AppConstants.apiUrlSaveOverseasCity;
  private apigetCurrency = AppConstants.apiUrlGetCurrency;
  private apisaveCurrency = AppConstants.apiUrlSaveCurrency;
  private apisaveConsignee = AppConstants.apiUrlSaveConsignee;
  private apiUpdateConsignee = AppConstants.apiUrlUpdateConsignee;
  private apiGetConsigneeByType = AppConstants.apiUrlGetConsigneesByType;
  private apiGetConsigneeByCode = AppConstants.apiUrlGetConsigneesByCode;

  getUserByType(userType: string) {
    return this.http.get<Consignee[]>(this.apiGetConsigneeByType.replace('{0}', encodeURIComponent(userType)), httpOptions);
  }

  getUserByCode(userType: string, userCode: string) {
    return this.http.get<Consignee>(this.apiGetConsigneeByCode.replace
      ('{0}', encodeURIComponent(userType)).replace('{1}', encodeURIComponent(userCode)), httpOptions);
  }


  getAllCounrtries() {
    return this.http.get<CountryOverseas[]>(this.getAllOverseasCountry, httpOptions);
  }

  saveCounrtry(country: CountryOverseas) {
    return this.http.post<CountryOverseas>(this.saveOverseasCountry, country, httpOptions);
  }
  getStatesByCounrtry(countryID: string) {
    return this.http.get<StateOverseas[]>(this.getAllStatesByCountry + encodeURIComponent(countryID), httpOptions);
  }

  saveState(stateObj: StateOverseas) {
    return this.http.post<StateOverseas>(this.saveOverseasState, stateObj, httpOptions);
  }
  getCityByStateId(stateID: string) {
    return this.http.get<CityOverseas[]>(this.getAllCityByStateID + encodeURIComponent(stateID), httpOptions);
  }

  saveCity(cityObj: CityOverseas) {
    return this.http.post<CityOverseas>(this.saveOverseasCity, cityObj, httpOptions);
  }

  getCurrency() {
    return this.http.get<CurrencyOverseas[]>(this.apigetCurrency, httpOptions);
  }

  saveCurrency(currencyObj: CurrencyOverseas) {
    return this.http.post<CurrencyOverseas>(this.apisaveCurrency, currencyObj, httpOptions);
  }

  findConsignee() { }

  saveConsignee(consignee: Consignee) {
    const abc = JSON.stringify(consignee);
    return this.http.post(this.apisaveConsignee, consignee, httpOptions);
  }
  updateConsignee(consignee: Consignee) {
    const abc = JSON.stringify(consignee);
    const id = consignee.cbCode + '';
    return this.http.put(this.apiUpdateConsignee.replace('{0}', encodeURIComponent(id)), consignee, httpOptions);
  }
}
