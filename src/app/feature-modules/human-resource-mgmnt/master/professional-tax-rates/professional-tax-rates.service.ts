import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfessionalTaxRatesService {
    baseUrl = environment.baseServiceURL;
    constructor(private http: HttpClient) { }

    getProfessionalTaxRateDetails() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetProfessionalTaxRates', httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    saveProfessionalTaxRateDatails(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'CreateProfessionalTaxRates', data, httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    modifyProfessionalTaxRateDatails(data, ptPassingNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'UpdateProfessionalTaxRates/' + ptPassingNo, data, httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }
}


