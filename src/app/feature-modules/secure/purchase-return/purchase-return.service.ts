import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { CreatePurchageReturnModel } from './purchase-return.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseReturnService {

  constructor(private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getPurchaseRecievedDetails(supplierOrgId) {
    return this.http.get(environment.baseServiceURL + `GetPurchageRecievedDetails?suppOrgId=${encodeURIComponent(supplierOrgId)}`);
  }

  getPlaceNameBySuppOrgId(supplierOrgId) {
    return this.http.get(environment.baseServiceURL + `GetPlaceNameBySuppOrgId?supOrgId=${encodeURIComponent(supplierOrgId)}`);
  }

  getRMGrnDetailsByRMGrnNo(rmGrnNo) {
    return this.http.get(environment.baseServiceURL + `GetRMGrnDetailsByRMGrnNo?rmGrnNo=${encodeURIComponent(rmGrnNo)}`);
  }

  getCommonDetails() {
    return forkJoin([this.http.get(environment.baseServiceURL + `GetAllSuppliers`), this.http.get(environment.baseServiceURL + `GetAllEmployee`)]);
  }

  getMaterialRecievedDetails(rmGrnNo) {
    return this.http.get(environment.baseServiceURL + `GetMaterialRecievedDetails?rmGrnNo=${encodeURIComponent(rmGrnNo)}`);
  }

  createPurchaseReturnDetail(cPurchageReturn: CreatePurchageReturnModel) {
    return this.http.post(environment.baseServiceURL + `CreatePurchaseReturn`, cPurchageReturn, this.httpOptions).pipe(
      ((data) => {
        return data;
      }), (error => {
        return (error);
      })
    );
  }
  GetPurchaseReturnIdsBySuppOrgId(supplierOrgId) {
    return this.http.get<any>(environment.baseServiceURL +
      `GetPurchaseReturnIdsBySuppOrgId?SuppOrgId=${encodeURIComponent(supplierOrgId)}`);
  }

  FindPurchaseReturnById(purchaseReturnID) {
    return this.http.get<any>(environment.baseServiceURL +
      `FindPurchaseReturnById?purchaseReturnID=${encodeURIComponent(purchaseReturnID)}`);
  }
  modifyPurchaseReturn(cPurchageReturn: CreatePurchageReturnModel) {
    return this.http.post(environment.baseServiceURL + `ModifyPurchaseReturn`, cPurchageReturn, this.httpOptions).pipe(
      ((data) => {
        return data;
      }), (error => {
        return (error);
      })
    );
  }
}
