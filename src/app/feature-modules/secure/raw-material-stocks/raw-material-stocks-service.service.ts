import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialStocksServiceService {

  baseAPIUrl = environment.baseServiceURL;
  constructor(private http: HttpClient) { }

  getRMStockDetail(orgOfficeNo, rawMaterialGroupCode, rawMaterialDetailsCode) {
    const url = this.baseAPIUrl + `rmstockbranch/findStockDetail?orgOfficeNo=` + encodeURIComponent(orgOfficeNo) +
      `&rawMaterialGroupCode=` + encodeURIComponent(rawMaterialGroupCode) +
      `&rawMaterialDetailsCode=` + encodeURIComponent(rawMaterialDetailsCode);
    return this.http.get(url);
  }

  updateRMStockDetail(rmStockDetails) {
    const url = this.baseAPIUrl + `rmstockbranch/updateStockDetail`;
    return this.http.post(url, rmStockDetails);
  }

}
