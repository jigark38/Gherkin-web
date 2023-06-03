import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ProductGroup, ProductVariety, ProductGrade, ProductDetails } from './product-grade-details.model';
import { AppConstants } from 'src/app/constants/app.constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductGradeDetailsService {

  constructor(private http: HttpClient) { }

  private getProductGroups = AppConstants.apiUrlGetProductGroups;
  private addProductGroup = AppConstants.apiUrlAddProductGroup;
  private apiGetProductVariety = AppConstants.apiUrlGetProductVariety;
  private addProductVariety = AppConstants.apiUrlAddProductVariety;
  private addProductGrade = AppConstants.apiUrlAddProductGrade;
  private getProductGrade = AppConstants.apiUrlGetProductGrade;
  private apiGetProductDetails = AppConstants.apiUrlGetProductDetails;

  getProductDetails() {
    return this.http.get<ProductDetails[]>(this.apiGetProductDetails, httpOptions)
      .pipe(map((res: ProductDetails[]) => {
        return res;
      })
      );
  }
  getAllProductGroup() {
    return this.http.get<ProductGroup[]>(this.getProductGroups, httpOptions)
      .pipe(map(res => {
        return res;
      })
      );
  }

  saveProductGroup(productGroup: ProductGroup) {
    return this.http.post<ProductGroup>(this.addProductGroup, productGroup, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  getProductVariety(productGroupCode: string) {
    return this.http.get<ProductVariety[]>(this.apiGetProductVariety + encodeURIComponent(productGroupCode), httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  saveProductVariety(productVariety: ProductVariety) {
    return this.http.post<ProductVariety>(this.addProductVariety, productVariety, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  saveProductGrade(productGrade: ProductGrade) {
    return this.http.post<ProductGrade>(this.addProductGrade, productGrade, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
}
