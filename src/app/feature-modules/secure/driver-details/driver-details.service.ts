import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DriverDetail, DriverDocument } from './driver-details.model';
@Injectable({
  providedIn: 'root',
})
export class DriverDetailService {
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  private baseURL = environment.baseServiceURL;


  addDriverDetail(driverDetail: DriverDetail) {
    try {
      return this.http
        .post(
          environment.baseServiceURL + `AddDriverDetail`,
          driverDetail,
          this.httpOptions
        )
        .pipe(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        );
    } catch (error) { }
  }

  updateDriverDetail(driverDetail: DriverDetail) {
    try {
      return this.http
        .put(
          environment.baseServiceURL + `UpdateDriverDetail`,
          driverDetail,
          this.httpOptions
        )
        .pipe(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        );
    } catch (error) { }
  }

  uploadDriverDocument(driverDocument: DriverDocument) {
    try {
      const header = new HttpHeaders({
        // 'content-type': 'multipart/form-data; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });
      const formData: FormData = new FormData();
      formData.append(
        driverDocument.driverDocumentName,
        driverDocument.driverDocumentDetails
      );
      return this.http
        .post(
          environment.baseServiceURL +
          `UploadDriverDocument?driverId=` +
          driverDocument.driverId +
          '&imageName=' +
          driverDocument.driverDocumentName,
          formData,
          { headers: header }
        )
        .pipe(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        );
    } catch (error) { }
  }

  getDriverDetailbyDriverId(driverId: string) {
    try {
      return this.http
        .get(
          environment.baseServiceURL + `GetDriverDetail/` + driverId,
          this.httpOptions
        )
        .pipe(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        );
    } catch (error) { }
  }

  getDriverDetailByEmployeeId(driverId: string) {
    try {
      return this.http
        .get(
          environment.baseServiceURL + `GetDriverDetailByEmployeeId/` + driverId,
          this.httpOptions
        )
        .pipe(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        );
    } catch (error) { }
  }

  GetDriverDocumentByDocumentUploadNumber(documentUploadnumber: number) {
    try {
      const header = new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http
        .get(environment.baseServiceURL + `GetDriverDocumentByDocumentUploadNumber/` + documentUploadnumber, {
          headers: header,
          responseType: 'blob',
        })
        .pipe(
          (data) => {
            return data;
          },
          (error) => {
            return error;
          }
        );
    } catch (error) { }
  }

  getAllEmployeeNotRegisterWithDriverDetails(designation: any) {
    try {
      return this.http.get(environment.baseServiceURL
        + `getAllEmployeeNotRegisterWithDriverDetails/` + designation + `/`, this.httpOptions).
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

  getAllEmployeeRegisterWithDriverDetails(designation: any) {
    try {
      return this.http.get(environment.baseServiceURL + `GetAllEmployeeRegisterWithDriverDetails/` + designation + `/`, this.httpOptions).
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
