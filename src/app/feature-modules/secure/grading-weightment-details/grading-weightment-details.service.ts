import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Crops } from '../../agri-management/master/crops-and-schemes/crops-and-schemes.model';
import { GreensGradedHarvestGRNDetails, GreensGradingInwardDetails } from './grading-weightment-details.model';

@Injectable({
  providedIn: 'root'
})
export class GradingWeightmentDetailsService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  getLocationsForDropDown() {
    try {
      return this.http.get(environment.baseServiceURL + `/api/V1/GradingWeight/GetLocation`, this.httpOptions).
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

  getDataForGridTwo(UnitHMInwardNo: number) {
    try {
      return this.http.get(environment.baseServiceURL + `/api/V1/GradingWeight/GetGridTwo?UnitHMInwardNo=`
        + encodeURIComponent(UnitHMInwardNo), this.httpOptions).
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

  getGreenReceptionGridData(orgofficeNo: number) {
    try {
      return this.http.get(environment.baseServiceURL + `/api/V1/GradingWeight/GetGridOne?OrgofficeNo=`
        + encodeURIComponent(orgofficeNo), this.httpOptions).
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

  SaveGreensGrading(saveDataModel) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/SaveGreensGrading`,
        saveDataModel,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }


  insertGreensGradingInwardDetails(greensGradingInwardetails: GreensGradingInwardDetails) {

    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/InsertGreensGradingInwardDetails`,
        greensGradingInwardetails,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );

  }

  insertGreensGradedHarvestGRNDetails(greensGradedHarvestGRNDetails: GreensGradedHarvestGRNDetails) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/InsertGreensGradedHarvestGRNDetails`,
        greensGradedHarvestGRNDetails,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }

  insertGreensGradingQuantityDetails(greensGradingQuantityDetails) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/InsertGreensGradingQuantityDetails`,
        greensGradingQuantityDetails,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }

  insertGreensGradingWeighmentDetails(greensGradingWeighmentDetails) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/InsertGreensGradingWeighmentDetails`,
        greensGradingWeighmentDetails,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }

  updateGreensGradingInwardDetails(greensGradingInwardetails: GreensGradingInwardDetails) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/UpdateGreensGradingInwardDetails`,
        greensGradingInwardetails,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }


  updateGreensGradingQuantityDetails(greensGradingQuantityDetails) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/UpdateGreensGradingQuantityDetails`,
        greensGradingQuantityDetails,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }

  saveGradingweighmentDetails(greensGradingInwardDetail) {
    return this.http
      .post(
        environment.baseServiceURL + `/api/V1/GradingWeight/SaveGreensGrading`,
        greensGradingInwardDetail,
        this.httpOptions
      )
      .pipe(
        data => {
          return data;
        },
        error => {
          return error;
        }
      );
  }


  getCropGroup() {
    return this.http.get<any>(environment.baseServiceURL + `GetCropGroup`);
  }

  getCropListByCropGroupCode(cropGroupCode: string) {
    try {
      return this.http.get<Crops[]>(environment.baseServiceURL + `GetCropListByCropGroupCode/`
        + encodeURIComponent(cropGroupCode), this.httpOptions)
        .pipe(
          ((data) => {
            return data;
          }), (error => {
            return (error);
          })
        );
    } catch (error) {

    }
  }

  getCropSchemes(cropNameCode: string) {
    return this.http.get<any>(environment.baseServiceURL + `GetCropSchemes?cropCode=${encodeURIComponent(cropNameCode)}`);
  }

  getGreensGradingByGrdNo(greensGrdNo: number) {
    try {
      return this.http.get(environment.baseServiceURL + `/api/V1/GradingWeight/GetGreensGradingByGrdNo?greensGrdNo=`
        + encodeURIComponent(greensGrdNo), this.httpOptions).
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


  changeStatus(greensGrdNo: number) {
    try {
      return this.http.get(environment.baseServiceURL + `/api/V1/GradingWeight/changeStatus?greensGrdNo=`
        + encodeURIComponent(greensGrdNo), this.httpOptions).
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
