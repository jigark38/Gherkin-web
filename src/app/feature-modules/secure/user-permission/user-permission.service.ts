import { Customer, IPermissionModel, Module } from './user-permissions-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { OrgLocation } from '../../organisation-details/org-off-loc-details/org-ofc-loc-model';
import { OrgLocationService } from '../../organisation-details/org-off-loc-details/org-ofc-loc.service';
import { OrganisationModel } from '../../organisation-details/org-details/orgnisation-model';
import { Users } from './users-data';
import { UtilService } from './../../../shared/services/util-service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserPermissionService {
    private baseUrl;
    constructor(private http: HttpClient, private ofcService: OrgLocationService, private utilService: UtilService) {
        this.baseUrl = environment.baseServiceURL;
    }

    getEmployees(desgCode: any) {
        return this.http.get<Customer[]>(`${this.baseUrl}GetEmployee?designation=${encodeURIComponent(desgCode)}`);
    }
    getOrganisationDetails() {
        return this.http.get<OrganisationModel[]>(`${this.baseUrl}Organisation/GetOrganisations`);
    }
    getLocationsbyOrgid(orgCode: any) {
        return this.http.get<OrgLocation[]>(`${this.baseUrl}Organisation/GetOfficeLocationById?orgCode=${encodeURIComponent(orgCode)}`);
    }
    updateOrganisation(orgDetails: any) {
        return this.http.post(`${this.baseUrl}Organisation/UpdateOrganisation`, orgDetails);
    }

    deleteOrganisation(orgName: any) {
        return this.http.delete(`${this.baseUrl}Organisation/DeleteOrganisation?orgCode=${encodeURIComponent(orgName)}`);
    }

    getModules() {
        return this.http.get<any[]>(`${this.baseUrl}Account/GetMainMenu`);
    }
    getSubMenus(moduleId: any) {
        return this.http.get<any[]>(`${this.baseUrl}Account/GetModuleMenuByMenuId?menuId=${encodeURIComponent(moduleId)}`);
    }
    getSubModulesbyModId(moduleId: any) {
        return this.http.get<any[]>(`${this.baseUrl}Account/GetSubMenuByModuleMenuId?moduleMenuId=${encodeURIComponent(moduleId)}`);
    }

    getDepartments() {
        return this.http.get<any[]>(`${this.baseUrl}GetDepartment`);
    }

    getSubDepartments(deptCode: any) {
        return this.http.get<any[]>(`${this.baseUrl}GetSubdepartment/${encodeURIComponent(deptCode)}`);
    }
    getDesignations(subDeptCode: any) {
        return this.http.get<any[]>(`${this.baseUrl}GetDesignations/${encodeURIComponent(subDeptCode)}`);
    }
    getApprovers() {
        return of(Users);
    }
    getAllCustomers() {
        return this.http.get<Customer[]>(`${this.baseUrl}Account/GetAllCustomers`);
    }
    getPermissions(data: IPermissionModel) {
        const url = `${this.baseUrl}Account/Permissions?userid=${encodeURIComponent(data.userId)}&organisation=${encodeURIComponent(data.organisationId)}&officeLocation=${encodeURIComponent(data.locationId)}`;
        return this.http.get<Customer[]>(url);
    }
    getPermissionsbyMenuid(data: IPermissionModel) {
        data.subMenuId = this.utilService.defaultZero(data.subMenuId);
        const url = `${this.baseUrl}Account/GetUserPermissionByMenuAndModuleIdV2?userid=${encodeURIComponent(data.userId)}&organisation=${encodeURIComponent(data.organisationId)}&officeLocation=${encodeURIComponent(data.locationId)}&menuId=${encodeURIComponent(data.moduleId)}&moduleId=${encodeURIComponent(data.subMenuId)} `;
        return this.http.get<Module[]>(url);
    }

    addPermissions(permissions: any) {
        return this.http.post<any[]>(`${this.baseUrl}Account/SavePermissions`, permissions);
    }
    createUser(userDetails: any) {
        return this.http.post<any[]>(`${this.baseUrl}Account/CreateUser`, userDetails);
    }

    getUserDetails(empId: any) {
        return this.http.get<any[]>(`${this.baseUrl}Account/GetUserNameFromEmployeeId?empId=${encodeURIComponent(empId)}`);
    }
    getMenuPermissions(details: any) {
        return this.http.get<any[]>(`${this.baseUrl}Account/GetPermissionsV2?userid=${encodeURIComponent(details.userId)}&organisation=${encodeURIComponent(details.organisationId)}&officeLocation=${encodeURIComponent(details.locationId)}`);
    }
    resetPassword(userDetails: any) {
        return this.http.post<any[]>(`${this.baseUrl}Account/ResetPassword`, userDetails);
    }
    getAllUsers() {
        return this.http.get<any[]>(`${this.baseUrl}Account/GetAllUsers`);
    }
}
