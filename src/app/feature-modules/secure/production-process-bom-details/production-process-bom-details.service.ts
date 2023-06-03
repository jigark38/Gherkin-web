import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { ProductGroup, VarietyGroup, ProdProcessDetails, ProdProcessCombine, RawMaterialGroup, RawMaterialDetailsGroup } from './production-process-details';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductionProcessBomDetailsService {
  constructor(private http: HttpClient) { }
  private apiGetAllProductGroups = AppConstants.apiUrlGetAllProductGroups;
  private apiUrlGetVariety = AppConstants.apiUrlGetVariety;
  private apiUrlSaveProductionProcess = AppConstants.apiUrlSaveProductionProcess;
  private apiUrlAllSavedProductGroup = AppConstants.apiUrlAllSavedProductGroup;
  private apiUrlSavedVariety = AppConstants.apiUrlSavedVariety;
  private apiUrlFetchProdProcess = AppConstants.apiUrlFetchProdProcess;
  private apiUrlSaveProductionProcessBOM = AppConstants.apiUrlSaveProductionProcessBOM;
  private apiUrlGetRawMaterialGroup = AppConstants.apiUrlGetRawMaterialGroup;
  private apiUrlGetRawMaterialDetailsGroup = AppConstants.apiUrlGetRawMaterialDetailsGroup;
  private apiUrlGetMaterialUOM = AppConstants.apiUrlGetMaterialUOM;
  private apiUrlGetProductionUOM = AppConstants.apiUrlGetProductionUOM;
  getAllProdGroups() {
    return this.http.get<ProductGroup[]>(this.apiGetAllProductGroups, httpOptions)
      .pipe(map((res: ProductGroup[]) => {
        return res;
      })
      );
  }
  getVariety(productGroupCode: string) {
    const api = this.apiUrlGetVariety + productGroupCode;
    return this.http.get<VarietyGroup[]>(api, httpOptions)
      .pipe(map((res: VarietyGroup[]) => {
        return res;
      })
      );
  }
  SaveProductionProcess(prodProcessDetails: ProdProcessDetails) {
    return this.http.post(this.apiUrlSaveProductionProcess, prodProcessDetails, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getAllSavedProductGroup() {
    return this.http.get<ProductGroup[]>(this.apiUrlAllSavedProductGroup, httpOptions)
      .pipe(map((res: ProductGroup[]) => {
        return res;
      })
      );
  }
  getSavedVariety(productGroupCode: string) {
    const api = this.apiUrlSavedVariety + productGroupCode;
    return this.http.get<VarietyGroup[]>(api, httpOptions)
      .pipe(map((res: VarietyGroup[]) => {
        return res;
      })
      );
  }
  fetchProdProcess(grpVarCode: { fpGroupCode: string, fpVarietyCode: string }) {
    return this.http.post(this.apiUrlFetchProdProcess, grpVarCode, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  saveProductionProcessBOM(prodProcessCombine: ProdProcessCombine) {
    return this.http.post(this.apiUrlSaveProductionProcessBOM, prodProcessCombine, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getRawMaterialGroup() {
    return this.http.get<RawMaterialGroup[]>(this.apiUrlGetRawMaterialGroup, httpOptions)
      .pipe(map((res: RawMaterialGroup[]) => {
        return res;
      })
      );
  }
  getRawMaterialDetailsGroup(rawMaterialGrpCode: string) {
    const api = this.apiUrlGetRawMaterialDetailsGroup + rawMaterialGrpCode;
    return this.http.get<RawMaterialDetailsGroup[]>(api, httpOptions)
      .pipe(map((res: RawMaterialDetailsGroup[]) => {
        return res;
      })
      );
  }
  getProductionUOM(uomKey: string) {
    const api = this.apiUrlGetProductionUOM + uomKey;
    return this.http.get<any[]>(api, httpOptions)
      .pipe(map((res: any[]) => {
        return res;
      })
      );
  }
  getBOMUOM(uomKey: string) {
    const api = this.apiUrlGetMaterialUOM + uomKey;
    return this.http.get<any[]>(api, httpOptions)
      .pipe(map((res: any[]) => {
        return res;
      })
      );
  }
}
