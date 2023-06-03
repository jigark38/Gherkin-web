import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import {
  SubDepartment,
  Designation,
  Organisation,
  Department,
  Employee,
  Bank,
  EmployeeBankAccountDetail
} from './employee-bank-account-details.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class BankDetailsService {
  private baseUrl;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseServiceURL;
  }
  private getDepartmentsUrl = AppConstants.apiUrlGetDepartment;
  private getSubDepartmentURL = AppConstants.apiUrlGetSubDepartment;
  private getDesgBySubDeptURL = AppConstants.apiUrlGetDesignationBySubDepart;
  private getEmpByDesgURL = AppConstants.apiUrlGetEmpByDesg;

  public getOrgofficelocationDetails(): Observable<Array<Organisation>> {
    return this.http.get<Array<Organisation>>(
      `${this.baseUrl}/GetOrgofficelocationDetails`,
      httpOptions
    );
  }

  public getAllDepartments(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(this.getDepartmentsUrl, httpOptions);
  }

  public getSubDepartment(departmentId): Observable<Array<SubDepartment>> {
    return this.http.get<Array<SubDepartment>>(
      this.getSubDepartmentURL.replace('{DeptId}', departmentId),
      httpOptions
    );
  }

  public getDesgBySubDeprt(subDeprt): Observable<Array<Designation>> {
    return this.http.get<Array<Designation>>(
      this.getDesgBySubDeptURL.replace('{subDepartment}', subDeprt),
      httpOptions
    );
  }

  public getEmployeByDesg(desigination): Observable<Array<Employee>> {
    return this.http.get<Array<Employee>>(this.getEmpByDesgURL + encodeURIComponent(desigination), httpOptions);
  }

  public getBankAccountDetails(): Observable<Array<Bank>> {

    return this.http.get<Array<Bank>>(environment.baseServiceURL + `GetBankAccountDetails`, httpOptions);
  }

  public addBankDetails(employeeBankDetails: EmployeeBankAccountDetail) {
    return this.http.post(environment.baseServiceURL + `BankDetails/AddBankDetails`, employeeBankDetails, httpOptions);
  }

  public getBankDetailsByEmployee(empId: string): Observable<Array<EmployeeBankAccountDetail>> {
    return this.http.get<Array<EmployeeBankAccountDetail>>(environment.baseServiceURL +
      'BankDetails/GetBankDetails?empId=' + encodeURIComponent(empId), httpOptions);
  }
}

