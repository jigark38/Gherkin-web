import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { JsonPipe } from '@angular/common';

import { URLS } from 'src/app/configuration';
import { Area, MaterialGroup, MaterialName, BranchIndentDetails, ModelForSaving, BranchIndentMaterialDetails } from './indent-material-details.model';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class IndentMaterialDetailsService {
  protected searchData = ['red', 'green', 'blue', 'cyan', 'magenta'];
  constructor(private http: HttpClient) { }
  protected countryData: MaterialGroup[] = [{ Raw_Material_Group_Code: 'IND_101', Raw_Material_Group: 'INDIA' }, { Raw_Material_Group_Code: 'IND_102', Raw_Material_Group: 'USA' }];

  getAllAreas() {
    // return this.http.get<any>(this.baseUrl + 'Area/GetAllArea', httpOptions);
    return this.http
      .get<Area[]>(URLS.getAllArea, httpOptions);
  }

  getUOMList() {
    // return this.http.get<any>(this.baseUrl + 'Area/GetAllArea', httpOptions);
    return this.http
      .get<MaterialName[]>(URLS.getMaterialUOM, httpOptions);
  }


  getAllMaterialGroup() {
    return this.http
      .get<MaterialGroup[]>(URLS.getAllMaterialGroup, httpOptions);
  }
  getAllMaterialByMaterialGroup(groupCode: string) {
    return this.http
      .get<MaterialName[]>(URLS.getAllMaterialNameByMaterialGroupCode + '?rawMaterialGroupCode=' +
        encodeURIComponent(groupCode), httpOptions);
  }

  getAllIndent() {
    return this.http
      .get<ModelForSaving[]>(URLS.GetAllIndentRequest, httpOptions);
  }

  findIndentDetails(searchString: string) {
    // this.searchedSupplier.userName='testUser From Service';
    return of(this.searchData);
    // return this.http.get<any>(`${this.baseURL}/getEmployeeDetails`).subscribe(res=>{
    // });

  }
  saveIndent(indent: ModelForSaving) {
    const abc = JSON.stringify(indent);
    return this.http.post(URLS.saveIndentMaterial, indent, httpOptions).pipe(
      ((data) => {
        return data;
      }), (error => {
        return (error);
      })
    );
  }

  UpdateIndent(indent: BranchIndentMaterialDetails) {
    return this.http.post(URLS.updateIndentMaterial, indent, httpOptions).pipe(
      ((data) => {
        return data;
      }), (error => {
        return (error);
      })
    );
  }

  getOfficeLocations() {
    try {
      return this.http.get(environment.baseServiceURL + `Organisation/GetOfficeLocations`, httpOptions).
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
