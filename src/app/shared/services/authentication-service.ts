import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

const store = require('store');
const STORE_KEY = 'lastAction';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject(false);
    baseUrl: string;
    logoutTime = 60;
    public permissions: BehaviorSubject<any> = new BehaviorSubject(null);
    userStoredPermissions: any[];
    isPermissionDataLoaded: boolean;
    constructor(private http: HttpClient, private router: Router) {
        this.baseUrl = environment.baseServiceURL;
        this.check();
        this.initInterval();
    }
    get lastAction() {
        return store.get(STORE_KEY) as number;
    }
    set lastAction(value) {
        store.set(STORE_KEY, value);
    }
    public setUserdetails(details: any) {
        this.reset();
        localStorage.setItem('Userdetails', JSON.stringify(details));
    }
    public getUserdetails(): any {
        const userdetails = localStorage.getItem('Userdetails');
        if (userdetails === undefined || userdetails === null) {
            return {};
        }
        return JSON.parse(userdetails);
    }
    public validateLogin(userDetails: any) {
        return this.http.post(`${this.baseUrl}api/V1/Login/UserLogin`, userDetails);
    }
    public get userLoggedin(): boolean {
        const userdetails = localStorage.getItem('Userdetails');
        if (userdetails === undefined || userdetails === null) {
            return false;
        }
        return true;
    }
    private initInterval() {
        setInterval(() => {
            this.check();
        }, 1000);
    }

    public logOut() {
        this.isPermissionDataLoaded = false;

        localStorage.removeItem('Userdetails');
        this.router.navigate(['login']);
    }

    public reset() {
        this.lastAction = Date.now();
    }

    check() {
        const now = Date.now();
        const timeleft = this.lastAction + this.logoutTime * 60 * 1000;
        const diff: any = timeleft - now;
        const isTimeout = diff < 0;

        if (isTimeout && this.userLoggedin) {
            this.logOut();
        }
    }
}
