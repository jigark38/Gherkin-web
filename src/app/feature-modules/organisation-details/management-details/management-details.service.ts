
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrgManagemet } from './org-management.model';


@Injectable({
    providedIn: 'root'
})
export class ManagementService {
    private baseUrl;
    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseServiceURL;
    }

    saveManagement(mgmtDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/CreateManagement`, mgmtDetails);
    }

    getManagementDetails(orgId: any) {
        return this.http.get<OrgManagemet[]>(`${this.baseUrl}Organisation/GetManagementById?orgCode=${encodeURIComponent(orgId)}`);
    }
    // getManagementDetails(orgId: any) {
    //     return this.http.get<OrgManagemet[]>(`${this.baseUrl}Organisation/GetManagements`);
    // }
    updateManagement(mgmtDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/UpdateManagement`, mgmtDetails);
    }
    deleteManagement(mgmtName: any) {
        return this.http.delete(`${this.baseUrl}Organisation/DeleteManagement?mngCode=${encodeURIComponent(mgmtName)}`);
    }




}
