import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable, forkJoin } from 'rxjs';
import { BankAccountDetails } from './bank-account-details.model';



@Injectable({
    providedIn: 'root'
})
export class BankAccountDetailsService {

    constructor(private http: HttpClient) { }
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };
    private baseURL = environment.baseServiceURL;

    getBankAccountDetails() {
        return this.http.get(environment.baseServiceURL + `GetBankAccountDetails`, this.httpOptions).pipe(
            ((data) => {
                return data;
            }), (error => {
                return (error);
            })
        );
    }

    updateBankAccountDetail(bankAccount: BankAccountDetails) {
        return this.http.post(environment.baseServiceURL + `UpdateBankAccountDetails?bankCode=${encodeURIComponent(bankAccount.bankCode)}`,
            bankAccount, this.httpOptions).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

    addBankAccountDetail(bankAccount) {
        return this.http.post(environment.baseServiceURL + `AddBankAccountDetails`, bankAccount, this.httpOptions).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

    public getOrgainizationDetails() {
        return this.http.get(environment.baseServiceURL + `Organisation/GetOrganisations`, this.httpOptions).
            pipe(
                ((data) => {
                    return data;
                }), (error => {
                    return (error);
                })
            );
    }

    closeBankAccountDetail(suspendBankAccount) {
        if (suspendBankAccount.id) {
            return this.http.post(environment.baseServiceURL
                + `UpdateSuspendBankAccount?bankCode=${encodeURIComponent(suspendBankAccount.bankCode)}`, suspendBankAccount,
                this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        } else {
            suspendBankAccount.id = -1;
            return this.http.post(environment.baseServiceURL + `SuspendBankAccount`, suspendBankAccount, this.httpOptions).
                pipe(
                    ((data) => {
                        return data;
                    }), (error => {
                        return (error);
                    })
                );
        }
    }

    public getBankAccountDetailsByBankCode(bankCode): Observable<any[]> {
        const response1 = this.http.get(environment.baseServiceURL +
            `GetAccountDetailsByBankCode?bankCode=${encodeURIComponent(bankCode)}`, this.httpOptions);
        const response2 = this.http.get(environment.baseServiceURL +
            `GetAccountStatusByBankCode?bankCode=${encodeURIComponent(bankCode)}`, this.httpOptions);
        return forkJoin([response1, response2]);
    }

}
