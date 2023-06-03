import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrganisationModel } from 'src/app/feature-modules/organisation-details/org-details/orgnisation-model';
import { environment } from 'src/environments/environment';
import { ApiResonse, ManualAttendenceDto } from './manual-attendence.model';

@Injectable({
    providedIn: 'root'
})
export class ManualAttendenceService {

    private baseUrl: string;
    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseServiceURL;
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };



    getManualAttendenceDetailsList(areaId: string, fromDate: string, toDate: string, pageIndex: number, pageSize: number) {
        return this.http.get<ApiResonse<any>>(`${this.baseUrl}GetManualAttendenceDetails?areaId=${encodeURIComponent(areaId)}&fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}&pageIndex=${encodeURIComponent(pageIndex)}&pageSize=${encodeURIComponent(pageSize)}`
            , this.httpOptions);
    }
    saveManualAttendence(manualAttendenceDto: ManualAttendenceDto[]) {
        return this.http.post<ApiResonse<boolean>>(`${this.baseUrl}SaveManualAttendence`, manualAttendenceDto, this.httpOptions);

    }
}
