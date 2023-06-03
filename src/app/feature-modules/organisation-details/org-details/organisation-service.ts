import { Injectable } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrganisationModel } from './orgnisation-model';



@Injectable({
    providedIn: 'root'
})
export class OrganisationService {
    private baseUrl;
    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseServiceURL;
    }

    saveOrganisation(orgDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/CreateOrganisation`, orgDetails);
    }

    getOrganisationDetails() {
        return this.http.get<OrganisationModel[]>(`${this.baseUrl}Organisation/GetOrganisations`);
    }
    updateOrganisation(orgDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/UpdateOrganisation`, orgDetails);
    }

    deleteOrganisation(orgName: any) {
        return this.http.delete(`${this.baseUrl}Organisation/DeleteOrganisation?orgCode=${encodeURIComponent(orgName)}`);
    }


}
