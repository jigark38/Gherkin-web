import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProformaInvoiceService {

  baseUrl = environment.baseServiceURL;

  constructor(private http: HttpClient) { }

  getInvoiceNumber() {
    return this.http.get<any>(this.baseUrl + 'GetProformaInvoiceId');
    // return this.http.get<any>('http://1c652661.ngrok.io/' + 'GetProformaInvoiceId');
  }

  getBankAccDetails() {
    return this.http.get<any>(this.baseUrl + 'GetBankAccountDetails');
  }


  getConsigneeBuyer() {
    return this.http.get<any>(this.baseUrl + 'GetConsigneeBuyers');
  }

  getCountryOverSeas() {
    return this.http.get<any>(this.baseUrl + 'GetAllCountriesOverseas');
  }

  getProductGroup() {
    return this.http.get<any>(this.baseUrl + 'GetallProductGroup');
  }

  getProductVariety(groupCode) {
    return this.http.get<any>(this.baseUrl + `GetVareityByprodgrpcode?prodgroupcode=${encodeURIComponent(groupCode)}`);

  }

  getProductGrade(productVariety) {
    return this.http.get<any>(this.baseUrl + `GetAllGradeByVariety?Varietycode=${encodeURIComponent(productVariety)}`);

  }

  saveProformaInvoice(profInvoice) {
    return this.http.post<any>(this.baseUrl + `AddProfromaInvoiceDetails`, profInvoice);
    // return this.http.post<any>('http://1c652661.ngrok.io/' + 'AddProfromaInvoiceDetail', profInvoice);
  }

  modifyProformaInvoice(profInvoice) {
    // return this.http.post<any>(this.baseUrl + `AddProfromaInvoiceDetails`, profInvoice);
    return this.http.post<any>('http://1c652661.ngrok.io/' + `AddProfromaInvoiceDetails`, profInvoice);
  }


}
