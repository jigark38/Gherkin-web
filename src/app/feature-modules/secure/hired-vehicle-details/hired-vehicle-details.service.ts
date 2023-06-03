import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HiredTransporterDetail, HiredVehicleDetail, HiredVehicleDocument } from './hired-vehicle-details.model';

@Injectable({
  providedIn: 'root'
})
export class HiredVehicleDetailsService {

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  private baseURL = environment.baseServiceURL;

  CreateHiredTransporterDetails(hiredTransporterDetail: HiredTransporterDetail) {
    try {
      return this.http.post(environment.baseServiceURL + `api/v1/HiredTransporterDetails/CreateHiredTransporterDetails`,
        hiredTransporterDetail, this.httpOptions).
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

  UpdateHiredTransporterDetails(hiredTransporterDetail: HiredTransporterDetail) {
    try {
      return this.http.put(environment.baseServiceURL + `api/v1/HiredTransporterDetails/UpdateHiredTransporterDetails`,
        hiredTransporterDetail, this.httpOptions).
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

  GetHiredTransporterList() {
    try {
      return this.http.get<HiredTransporterDetail[]>(environment.baseServiceURL + `api/v1/HiredTransporterDetails/GetHiredTransporterList`,
        this.httpOptions).
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



  CreateHiredVehicleDetails(hiredVehicleDetail: HiredVehicleDetail) {
    try {
      return this.http.post(environment.baseServiceURL + `api/v1/HiredTransporterDetails/CreateHiredVehicleDetails`,
        hiredVehicleDetail, this.httpOptions).
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

  UpdateHiredVehicleDetails(hiredVehicleDetail: HiredVehicleDetail) {
    try {
      return this.http.put(environment.baseServiceURL + `api/v1/HiredTransporterDetails/UpdateHiredVehicleDetails`,
        hiredVehicleDetail, this.httpOptions).
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

  GetHiredVehicleList(hiredTransporterId: number) {
    try {
      return this.http.get<HiredVehicleDetail[]>(environment.baseServiceURL + `api/v1/HiredTransporterDetails/GetHiredVehicleList/`
        + hiredTransporterId, this.httpOptions).
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

  CheckDuplicateHiredVehicleRegNo(vehicleRegNo: string) {
    try {
      return this.http.get(environment.baseServiceURL + `api/v1/HiredTransporterDetails/CheckDuplicateHiredVehicleRegNo/`
        + vehicleRegNo, this.httpOptions).
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

  CheckDuplicateHiredVehicleChassisNo(chassisNo: string) {
    try {
      return this.http.get(environment.baseServiceURL + `api/v1/HiredTransporterDetails/CheckDuplicateHiredVehicleChassisNo/`
        + chassisNo, this.httpOptions).
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


  CreateHiredVehicleDocuments(hiredVehicleDocument: HiredVehicleDocument) {
    try {

      const header = new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      const formData: FormData = new FormData();
      formData.append('docUploadNo', hiredVehicleDocument.docUploadNo);
      formData.append('documentDetails', hiredVehicleDocument.documentDetails);
      formData.append('documentName', hiredVehicleDocument.documentName);
      formData.append('hiredVehicleID', hiredVehicleDocument.hiredVehicleID.toString());
      return this.http.post(environment.baseServiceURL + `api/v1/HiredTransporterDetails/CreateHiredVehicleDocuments`,
        formData, { headers: header }).
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

  GetHiredVehicleDocumentsList(hiredVehicleId: number) {
    try {
      return this.http.get<HiredVehicleDocument[]>(environment.baseServiceURL + `api/v1/HiredTransporterDetails/GetHiredVehicleDocumentsList/` + hiredVehicleId, this.httpOptions).
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

  GetHiredVehicleDocumentByDocId(docUploadNo: string) {
    try {
      const header = new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      return this.http.get(environment.baseServiceURL + `api/v1/HiredTransporterDetails/GetHiredVehicleDocumentByDocId/` + docUploadNo,
        { headers: header, responseType: 'blob' }).
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
