import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../../../constants/app.constants';
import { InwardDetail, PendingPurchaseOrder } from './goods-receipt-note.model';
import { SupplierDetails } from '../suppliers-details/suppliers-details.model';
import { environment } from 'src/environments/environment';
import { BatchMaterialDetails } from './received-material-popup/batch-material-details.models';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptNoteService {
  private getInwardDetailURL = AppConstants.apiUrlInwardDetail;
  private getPendingPurchaseOrderUrl = AppConstants.apiUrlPendingPurchaseOrder;
  private getSupplierDetailsByIDURL = AppConstants.apiUrlSupplierDetailsByID;
  private getGRNCodeURL = AppConstants.apiUrlGetGRNCode;
  private getCountryByCodeUrl = AppConstants.apiUrlGetCountryByCode;
  private addGoodsReceiptNoteDetailsUrl = AppConstants.apiUrlAddGoodsReceiptNoteDetails;
  private updateGoodsReceiptNoteDetailsUrl = AppConstants.apiUrlUpdateGoodsReceiptNoteDetails;
  private updateBatchMaterialDetailsUrl = AppConstants.apiUrlupdateBatchMaterialDetails;
  private getGRNCodeBySupOrgId = AppConstants.apiUrlGetGRNCodeBySupOrgId;
  private getGoodsReceiptNoteByGRNCode = AppConstants.apiUrlGetGoodsReceiptNoteByGRNCode;
  private apiGetAllSuppliers = AppConstants.apiUrlGetAllSupplierOrgs;


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  constructor(private http: HttpClient) { }

  getInwardDetail() {
    return this.http.get<InwardDetail[]>(this.getInwardDetailURL, this.httpOptions);
  }

  getPendingPurchaseOrder() {
    return this.http.get<PendingPurchaseOrder[]>(this.getPendingPurchaseOrderUrl, this.httpOptions);
  }
  getSupplierDetailsByID(SupplierOrgId) {
    return this.http.get<any>(this.getSupplierDetailsByIDURL.replace('{0}', encodeURIComponent(SupplierOrgId)), this.httpOptions);
  }
  getGRNCode() {
    return this.http.get<any>(this.getGRNCodeURL, this.httpOptions);
  }
  getCountryByCode(countryCode) {
    return this.http.get<any>(this.getCountryByCodeUrl + encodeURIComponent(countryCode), this.httpOptions);
  }
  addGoodsReceiptNoteDetails(payload) {
    return this.http.post(this.addGoodsReceiptNoteDetailsUrl, payload, this.httpOptions);
  }

  GetGRNCodeBySupOrgId(SupOrgId) {
    return this.http.get<any>(this.getGRNCodeBySupOrgId.replace('{SupOrgId}', encodeURIComponent(SupOrgId)), this.httpOptions);
  }

  GetGoodsReceiptNoteByGRNCode(GRNCode) {
    return this.http.get<any>(this.getGoodsReceiptNoteByGRNCode.replace('{GRNCode}', encodeURIComponent(GRNCode)), this.httpOptions);
  }

  getAllSuppliers() {
    return this.http.get<SupplierDetails[]>(this.apiGetAllSuppliers, this.httpOptions);
  }
  getPlacesBySuppOrgId(supplierOrgId: string) {
    try {
      return this.http.get<any>(environment.baseServiceURL + `GetPlacesBySuppOrgId?suppOrgId=` +
        encodeURIComponent(supplierOrgId), this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  getStatesBySuppOrgId(supplierOrgId: string) {
    try {
      return this.http.get<any>(environment.baseServiceURL + `GetStatesBySuppOrgId?suppOrgId=` +
        encodeURIComponent(supplierOrgId), this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  getCountryBySppOrgId(supplierOrgId: string) {
    try {
      return this.http.get<any>(environment.baseServiceURL + `GetCountryBySppOrgId?suppOrgId=` +
        encodeURIComponent(supplierOrgId), this.httpOptions).
        pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }
  updateGoodsReceiptNoteDetails(payload) {
    return this.http.post<any>(this.updateGoodsReceiptNoteDetailsUrl, payload, this.httpOptions);
  }

  updateBatchMaterialDetails(batchMaterialDetails: BatchMaterialDetails) {
    return this.http.post<any>(this.updateBatchMaterialDetailsUrl, batchMaterialDetails, this.httpOptions);
  }

  getBatchMaterialDetailsByBatchNo(batchNo: string) {
    try {
      return this.http.get<any>(environment.baseServiceURL + `GetBatchMaterialDetailsByBatchNo?batchNo=` +
        encodeURIComponent(batchNo), this.httpOptions).
        pipe(
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
