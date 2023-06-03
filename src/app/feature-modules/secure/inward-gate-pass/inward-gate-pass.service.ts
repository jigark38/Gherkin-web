import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InwardGatePassModel } from './inward-gate-pass.models';


@Injectable({
    providedIn: 'root'
})
export class InwardGatePassService {

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    createMaterialInward(inwardGatePassModel: InwardGatePassModel) {
        try {
            return this.http.post(environment.baseServiceURL + `materialinward/add`, inwardGatePassModel, this.httpOptions).
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

    updateMaterialInward(id: string, inwardGatePassModel: InwardGatePassModel) {
        try {
            return this.http.post(environment.baseServiceURL + `materialinward/update/` + id, inwardGatePassModel, this.httpOptions).
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

    searchInwardGatePass(fromDate: string, toDate: string, inwardType: string) {
        try {
            return this.http.post(environment.baseServiceURL + `materialinward/find?dateFrom=` +
                encodeURIComponent(fromDate) + '&dateTo=' + encodeURIComponent(toDate) + '&inwardType=' +
                encodeURIComponent(inwardType), null, this.httpOptions).
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

    getOfficeLocations() {
        try {
            return this.http.get(environment.baseServiceURL + `Organisation/GetOfficeLocations`, this.httpOptions).
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
