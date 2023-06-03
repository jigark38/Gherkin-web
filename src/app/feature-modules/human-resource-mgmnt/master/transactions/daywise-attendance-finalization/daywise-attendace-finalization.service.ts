import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AttendanceDetailSearchModel, AttendanceRequestmodel, DaywiseAttendaceModel } from './daywise-attendance-finalization.model';


@Injectable({
    providedIn: 'root'
})
export class DaywiseAttendaceFinalizationService {
    baseUrl = environment.baseServiceURL;
    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };


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

    getSubDepartments(deptCode: any) {
        return this.http.get<any[]>(`${this.baseUrl}GetSubdepartment/${encodeURIComponent(deptCode)}`);
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

    getEmployeeByDivision(division: string) {

        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'api/v1/Attendance/GetEmployeeByDivision?division=' + encodeURIComponent(division),
                httpOptions
            ).subscribe(
                (res: DaywiseAttendaceModel[]) => {
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

    addESICRates(employee: DaywiseAttendaceModel) {
        try {
            return this.http.post(environment.baseServiceURL + `CreateEmployeeDetails`, employee, this.httpOptions).
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

    getAttendanceDetail(searchModel: AttendanceDetailSearchModel) {
        try {
            return this.http.post(this.baseUrl + `api/v1/Attendance/GetAttendanceDetail`, searchModel, this.httpOptions).
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

    GetEmployeeById(searchModel: AttendanceDetailSearchModel) {
        try {
            return this.http.post(this.baseUrl + `api/v1/Attendance/GetEmployeeById`, searchModel, this.httpOptions).
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

    updateAttendanceDetail(updateModel: AttendanceRequestmodel) {
        try {
            return this.http.post(this.baseUrl + `api/v1/Attendance/updateAttendanceDetail`, updateModel, this.httpOptions).
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
