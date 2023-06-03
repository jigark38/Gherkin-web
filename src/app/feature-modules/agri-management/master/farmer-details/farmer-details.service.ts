import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { FarmerDetails, FarmerDocuments } from './farmer-details.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FarmerDetailsService {

  constructor(private http: HttpClient) { }

  private getCountryUrl = AppConstants.apiUrlCountry;
  private getStateUrl = AppConstants.apiUrlState;
  private getDistrictUrl = AppConstants.apiUrlDistrict;
  private getAllFarmersUrl = AppConstants.apiUrlGetAllfarmers;
  private getFamerDetailByIdUrl = AppConstants.apiUrlGetFarmerById;
  private updateFarmerUrl = AppConstants.apiUrlUpdateFarmer;
  private saveFarmerUrl = AppConstants.apiUrlSaveFarmerDetail;
  private uploadDocsUrl = AppConstants.apiUrlUploadFile;
  private saveDocsUrl = AppConstants.apiUrlSaveFile;
  private addBankDetails = AppConstants.apiUrlAddBankAccount;
  private getVillagebyMandalUrl = AppConstants.apiUrlVillageByMandal;
  private getFarmerDocByFarmerCodUrl = AppConstants.apiUrlGetFarmerDocByFarmercode;
  private deleteFarmerDocumentsByIDUrl = AppConstants.apiUrlDeleteFarmerDocumentsByID;
  private getMandalUrl = AppConstants.apiUrlAllMandal;
  private getMandalByDistrictUrl = AppConstants.apiUrlMandalByDistrict;

  getCountryList() {
    return this.http.get(this.getCountryUrl);
  }
  getStateList(countrycode) {
    return this.http.get(this.getStateUrl.replace('{countryCode}', encodeURIComponent(countrycode)));
  }

  getDistrictList(statecode) {
    return this.http.get(this.getDistrictUrl.replace('{stateCode}', encodeURIComponent(statecode)));
  }

  getAllMandal() {
    return this.http.get(this.getMandalUrl);
  }

  getMandalByDistrict(districtCode) {
    return this.http.get(this.getMandalByDistrictUrl.replace('{districtCode}', encodeURIComponent(districtCode)));
  }

  getVillageListByMandal(mandalCode) {
    return this.http.get(this.getVillagebyMandalUrl.replace('{mandalCode}', encodeURIComponent(mandalCode)));
  }

  getAllFarmers() {
    return this.http.get<any>(this.getAllFarmersUrl);
  }

  getFarmerDetailById(farmerId) {

    return this.http.get<FarmerDetails>(this.getFamerDetailByIdUrl.replace('{Id}', encodeURIComponent(farmerId)));
  }

  updateFarmer(farmerModel) {
    return this.http.put(this.updateFarmerUrl, farmerModel);
  }

  saveFarmerDetail(farmerModel) {
    return this.http.post(this.saveFarmerUrl, farmerModel);

  }

  uploadfarmerDocs(docdata) {
    return this.http.post<any>(this.uploadDocsUrl, docdata, {
      reportProgress: true,
      observe: 'events'
    });

  }
  saveFarmerDocs(docdata, farmerId, fileName) {
    console.log(this.saveDocsUrl.replace('{farmerId}', farmerId).replace('{fileName}', fileName));
    return this.http.post(this.saveDocsUrl.replace('{farmerId}', encodeURIComponent(farmerId)).replace('{fileName}',
      encodeURIComponent(fileName)), docdata, {
      reportProgress: true,
      observe: 'events'
    });
  }

  saveFarmerImage(farmerDocument: FarmerDocuments) {
    try {
      const header = new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      const formData: FormData = new FormData();
      formData.append(farmerDocument.documentName, farmerDocument.document);
      console.log(this.saveDocsUrl.replace('{farmerCode}', farmerDocument.farmerCode).replace('{fileName}', farmerDocument.documentName));
      return this.http.post(this.saveDocsUrl.replace('{farmerCode}', farmerDocument.farmerCode)
        .replace('{fileName}', farmerDocument.documentName), formData, { headers: header });
      // return this.http.post(environment.baseServiceURL + `SaveFarmerDocument?farmerCode=` + farmerDocument.farmerCode +
      //   '&fileName=' + farmerDocument.documentName
      //   , formData, { headers: header }).
      //   pipe(
      //     ((data) => {
      //       return data;
      //     }), (error => {
      //       return (error);
      //     })
      //   );
    } catch (error) {
      console.log(error);
    }
  }

  addFarmerBankAccount(bankDetailsList) {
    return this.http.post(this.addBankDetails, bankDetailsList);
  }

  getFarmerDocByFarmerCod(farmerCod) {
    return this.http.get<any>(this.getFarmerDocByFarmerCodUrl.replace('{Farmer_cod}', farmerCod));

  }

  deleteFarmerDocumentsByID(docId) {
    return this.http.post<any>(this.deleteFarmerDocumentsByIDUrl.replace('{DocId}', docId), null, {
      reportProgress: true,
      observe: 'events'
    });
  }


}
