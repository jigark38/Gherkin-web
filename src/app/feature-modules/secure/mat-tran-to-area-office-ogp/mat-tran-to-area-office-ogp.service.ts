import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/constants/app.constants';
import { MaterialTransferModel } from './mat-tran-to-area-office-ogp.model';

@Injectable({
    providedIn: 'root'
})

export class MatTranToAreaOfficeOgpService {

    constructor(private http: HttpClient) { }

    private getAllMaterialOutwardDetails = AppConstants.apiUrlGetAllMaterialOutwardDetails;
    private postMaterialOutwardDetails = AppConstants.apiUrlPostMaterialOutwardDetails;

    getAllMaterialOutwardsDetails() {
        return this.http.get<Array<MaterialTransferModel>>(this.getAllMaterialOutwardDetails);
    }

    saveMaterialOutwardsDetails(matDetails) {
        return this.http.post(this.postMaterialOutwardDetails, matDetails);
    }
}
