import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AttendancePunchDetailsService {
    baseUrl = environment.baseServiceURL;
    constructor(private http: HttpClient) { }

    getOfficeLocationDetails() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'Organisation/GetOfficeLocations', httpOptions).subscribe(
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

    getAllDepartment() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetDepartment', httpOptions).subscribe(
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

    getAttendanceDetails(formvalue) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'api/v1/Attendance/GetAttendanceDetail?date=' +
                encodeURIComponent(this.updateDateFormate(formvalue.dateOfEntry)) +
                '&category=' + encodeURIComponent(formvalue.punchingCategory) +
                '&orgOfficeNo=' + encodeURIComponent(formvalue.organisation) +
                '&deptCode=' + encodeURIComponent(formvalue.department) +
                '&gender=' + encodeURIComponent(formvalue.gender) +
                '&division=' + encodeURIComponent(formvalue.division) +
                '&biometricNo=' + encodeURIComponent(formvalue.biometricId ? +formvalue.biometricId : 0) +
                '&filter=' + encodeURIComponent(formvalue.filter), httpOptions).subscribe(
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


    getDepartmentByOrganisation(orgofficeNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetDepartmentByOrganisation/${encodeURIComponent(orgofficeNo)}`, httpOptions).subscribe(
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


    updateDateFormate(dateUpdate) {
        try {
            const date = new Date(dateUpdate);
            date.setDate(date.getDate() + 1);
            const data = date.toISOString();
            return data.split('T')[0];

        } catch (error) {
            console.log('updateDateFormate', error);
        }
    }
}


