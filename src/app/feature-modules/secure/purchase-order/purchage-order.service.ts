import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { DatePipe } from '@angular/common';
import { OrderMaterialDetail, PurchaseOrderDetail, CreatePOWithMaterialAndCondition } from './purchage-order.models';

@Injectable({
    providedIn: 'root'
})
export class PurchageOrderService {

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    getIndentDetails() {
        try {
            return this.http.get(environment.baseServiceURL + `GetIndentDetails`, this.httpOptions).
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

    getNextPurchageOrderId() {
        try {
            return this.http.get(environment.baseServiceURL + `GetNextPurchageOrderId`, this.httpOptions).
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

    getAllSuppliers() {
        try {
            return this.http.get(environment.baseServiceURL + `GetAllSuppliers`, this.httpOptions).
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

    getPlacesBySuppOrgId(supplierOrgId: string) {
        try {
            return this.http.get(environment.baseServiceURL + `GetPlacesBySuppOrgId?suppOrgId=` +
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
            return this.http.get(environment.baseServiceURL + `GetStatesBySuppOrgId?suppOrgId=` +
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
            return this.http.get(environment.baseServiceURL + `GetCountryBySppOrgId?suppOrgId=` +
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

    getTaxPercentByGSTType(detailCode: string, gstType: string) {
        try {
            return this.http.get(environment.baseServiceURL + `GetTaxPercentByGSTType?detailCode=` +
                encodeURIComponent(detailCode) + '&gstType=' + encodeURIComponent(gstType), this.httpOptions).
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

    createOrderMaterial(orderMaterialDetail: OrderMaterialDetail) {
        try {
            return this.http.post(environment.baseServiceURL + `CreateOrderMaterial?detailCode`, orderMaterialDetail, this.httpOptions).
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

    createPurchageOrder(purchaseOrderDetail: CreatePOWithMaterialAndCondition) {
        try {
            return this.http.post(environment.baseServiceURL + `CreatePurchageOrder?detailCode`, purchaseOrderDetail, this.httpOptions).
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

    GetOrderIdsBySuppOrgId(SuppOrgId: string) {
        try {
            return this.http.get(environment.baseServiceURL +
                `GetOrderIdsBySuppOrgId?SuppOrgId=${encodeURIComponent(SuppOrgId)}`, this.httpOptions).
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
    GetPurchaseOrderByID(RmPoNo: string) {
        try {
            return this.http.get(environment.baseServiceURL +
                `GetPurchaseOrderByID?RmPoNo=${encodeURIComponent(RmPoNo)}`, this.httpOptions).
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

    ModifyPurchaseOrder(createPOWithMaterialAndCondition: CreatePOWithMaterialAndCondition) {
        try {
            return this.http.post(environment.baseServiceURL + `ModifyPurchaseOrder`, createPOWithMaterialAndCondition, this.httpOptions).
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
