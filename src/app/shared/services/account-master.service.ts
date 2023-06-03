import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountMaster, AccountsGroup } from '../models/account-master.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})


export class AccountMasterService {

  baseUrl = environment.baseServiceURL;

  constructor(private http: HttpClient) { }


  getOrganisation() {
    return this.http.get<any>(this.baseUrl + 'Organisation/GetOrganisations');
  }

  getGroupList() {

    return this.http.get<any>(this.baseUrl + 'GetAllAccountsGroup');
    // return this.http.get<any>('https://ed35c9a0.ngrok.io/GetAllAccountsGroup');
  }

  getGroupsForAccount(AccountHead) {
    return this.http.get<any>(this.baseUrl + `GetAllGroupsHead?AccountHead=${encodeURIComponent(AccountHead)}`);
  }

  saveNewGroup(accountMaster) {
    return this.http.post<any>(this.baseUrl + 'AddAccountsGroup', accountMaster);
    // return this.http.post<any>('https://ed35c9a0.ngrok.io/AddAccountsGroup', accountMaster);
  }

  saveAccountName(accountMaster) {
    return this.http.post<any>(this.baseUrl + 'AddAccount', accountMaster);
    // return this.http.post<any>('https://ed35c9a0.ngrok.io/AddAccount', accountMaster);
  }
  findAccountMaster(groupList): Observable<AccountMaster> {
    return this.http.get<AccountMaster>(this.baseUrl + `FindAccountGroup?headCode=${encodeURIComponent(groupList.HeadCode)}
    &orgCode=${encodeURIComponent(groupList.OrgCode)}&accountOrGroupCode=${encodeURIComponent(groupList.AccountOrGroupCode)}
    &mainGroupCode=${encodeURIComponent(groupList.MainGroupCode)}&parentGroupCode=${encodeURIComponent(groupList.ParentGroupCode)}&isAccount=${encodeURIComponent(groupList.IsAccount)}`);
  }

  modifyAccountMaster(accountMaster) {
    return this.http.post<any>(this.baseUrl + 'AddAccountsGroup', accountMaster);
  }


}
