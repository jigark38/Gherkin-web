import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { ConsigneeBuyersList, CountryOverSeas, FinishedProductGroups, HarvestAreas, OrganisationOfficeUnits, ProformaInvoices } from './finished-semifinished-opening.model';

@Injectable({
  providedIn: 'root'
})
export class FinishedSemifinishedOpeningStocksService {

  constructor(private http: HttpClient) { }

  private getOrganisationOfficeUnitsUrl = AppConstants.apiUrlGetOrganisationOfficeUnits;
  private getHarvestAreasUrl = AppConstants.apiUrlGetHarvestAreas;
  private getCountryOverSeasUrl = AppConstants.apiUrlGetCountryOverSeas;
  private getConsigneeBuyersListUrl = AppConstants.apiUrlGetConsigneeBuyersList;
  private getProformaInvoicesUrl = AppConstants.apiUrlGetProformaInvoices;
  private getFinishedProductGroupsUrl = AppConstants.apiUrlGetFinishedProductGroups;
  private getFinishedProductDetailsUrl = AppConstants.apiUrlGetFinishedProductDetails;
  private getProductionProcessDetailsUrl = AppConstants.apiUrlGetProductionProcessDetails;
  private getMediaProcessDetailsUrl = AppConstants.apiUrlGetMediaProcessDetails;
  private getFPGradesDetailsUrl = AppConstants.apiUrlGetFPGradesDetails;
  private getContainerPackingDetailsUrl = AppConstants.apiUrlGetContainerPackingDetails;
  private getUOMDetailsUrl = AppConstants.apiUrlGetUOMDetails;
  private saveFinishedSFOpeningStockUrl = AppConstants.apiUrlSaveFinishedSFOpeningStock;
  private getStockDetalsUrl = AppConstants.apiUrlGetStockDetails;
  private updateStockDetalsUrl = AppConstants.apiUrlupdateStockDetals;
  private deleteStockDetalsUrl = AppConstants.apiUrlDeleteStockDetals;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getOrganisationOfficeUnits() {
    return this.http.get<OrganisationOfficeUnits[]>(this.getOrganisationOfficeUnitsUrl);
  }

  getHarvestAreas() {
    return this.http.get<HarvestAreas[]>(this.getHarvestAreasUrl);
  }

  getCountryOverSeas() {
    return this.http.get<CountryOverSeas[]>(this.getCountryOverSeasUrl);
  }

  getConsigneeBuyersList(overseasCountryId) {
    return this.http.get<ConsigneeBuyersList[]>(this.getConsigneeBuyersListUrl.replace('{overseasCountryId}',
      encodeURIComponent(overseasCountryId)));
  }

  getProformaInvoices(cBCode) {
    return this.http.get<ProformaInvoices[]>(this.getProformaInvoicesUrl.replace('{cBCode}', encodeURIComponent(cBCode)));
  }

  getFinishedProductGroups() {
    return this.http.get<FinishedProductGroups[]>(this.getFinishedProductGroupsUrl);
  }

  getFinishedProductDetails(GrpCode) {
    return this.http.get(this.getFinishedProductDetailsUrl.replace('{GrpCode}', encodeURIComponent(GrpCode)));
  }

  getMediaProcessDetails(ProductionProcessCode) {
    return this.http.get(this.getMediaProcessDetailsUrl.replace('{ProductionProcessCode}', encodeURIComponent(ProductionProcessCode)));
  }

  getProductionProcessDetails(VarietyCode) {
    return this.http.get(this.getProductionProcessDetailsUrl.replace('{VarietyCode}', encodeURIComponent(VarietyCode)));
  }

  getFPGradesDetails(VarietyCode) {
    return this.http.get(this.getFPGradesDetailsUrl.replace('{VarietyCode}', encodeURIComponent(VarietyCode)));
  }

  getContainerPackingDetails() {
    return this.http.get(this.getContainerPackingDetailsUrl);
  }

  getUOMDetails() {
    return this.http.get(this.getUOMDetailsUrl);
  }

  addFinishSFOpening(finishedStkProdDetail) {
    return this.http.post(this.saveFinishedSFOpeningStockUrl, finishedStkProdDetail, this.httpOptions);
  }

  getStockDetails(finishedStkProdDetail) {
    return this.http.post(this.getStockDetalsUrl, finishedStkProdDetail, this.httpOptions);
  }
  updateFinishSFOpeningQty(selectedfinishedSFStokQnty) {
    return this.http.post(this.updateStockDetalsUrl, selectedfinishedSFStokQnty, this.httpOptions);
  }

  deleteStockDetals(fSFStockQuantityNo) {
    return this.http.get(this.deleteStockDetalsUrl.replace('{FSFStockQuantityNo}', encodeURIComponent(fSFStockQuantityNo)));
  }

}
