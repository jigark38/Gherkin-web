import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import {
  GPSTrackingDevices,
  OwnVehiclesDetails,
  OwnVehicleDocuments
} from './own-vehicle-details.model';
@Injectable({
  providedIn: 'root'
})
export class OwnVehicleDetailsService {
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  private baseURL = environment.baseServiceURL;
  updateVehicle(vehicle: OwnVehiclesDetails) {
    try {
      return this.http.put(environment.baseServiceURL + `api/v1/Vehicle/UpdateVehicle`, vehicle, this.httpOptions).
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

  addVehicle(vehicle: OwnVehiclesDetails) {
    try {
      return this.http.post(environment.baseServiceURL + `api/v1/Vehicle/CreateVehicle`, vehicle, this.httpOptions).
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

  saveDocument(vehicleDocument: OwnVehicleDocuments) {
    try {

      const header = new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      });
      const formData: FormData = new FormData();
      formData.append(vehicleDocument.documentName, vehicleDocument.documentDetails);
      return this.http.post(environment.baseServiceURL +
        `api/v1/Vehicle/SaveVehicleDocument?vehicleId=` + encodeURIComponent(vehicleDocument.ownVehicleID) +
        '&imageName=' + encodeURIComponent(vehicleDocument.documentName)
        , formData, { headers: header }).
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

  getVehicleByRegistrationNumber(RegistrationNumber: string): Observable<OwnVehiclesDetails[]> {
    try {
      if (!RegistrationNumber) {
        return of([]);
      }
      return this.http.get<OwnVehiclesDetails[]>(environment.baseServiceURL +
        `api/v1/Vehicle/GetVehicleByRegistrationNumber/` + encodeURIComponent(RegistrationNumber),
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

  getAllVehicles(): Observable<OwnVehiclesDetails[]> {
    try {
      return this.http.get<OwnVehiclesDetails[]>(environment.baseServiceURL +
        `api/v1/Vehicle/GetAllVehicles`,
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

  updateGPSDevice(device: GPSTrackingDevices) {
    try {
      return this.http.put(environment.baseServiceURL + `api/v1/GpsTrackingDevice/UpdateGpsTrackingDevice`, device, this.httpOptions).
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

  addGPSDevice(device: GPSTrackingDevices) {
    try {
      return this.http.post(environment.baseServiceURL + `api/v1/GpsTrackingDevice/CreateGpsTrackingDevice`, device, this.httpOptions).
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

  getVehicleGPSDeviceByVehicleId(vehicleId: number) {
    try {
      return this.http.get(environment.baseServiceURL +
        `api/v1/GpsTrackingDevice/GetGPSDeviceByVehicleId/` +
        encodeURIComponent(vehicleId), this.httpOptions).
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

  getVehicleGPSDeviceByHiredVehicleId(hiredVehicleId: number) {
    try {
      return this.http.get(environment.baseServiceURL + `api/v1/GpsTrackingDevice/GetGPSDeviceByHiredVehicleId/` + hiredVehicleId, this.httpOptions).
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

  getDocumentsByVehicleId(vehicleId: number) {
    try {
      return this.http.get(environment.baseServiceURL +
        `api/v1/Vehicle/GetDocumentsByVehicleId/` + encodeURIComponent(vehicleId), this.httpOptions).
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

  getDocumentByDocumentId(documentId: string) {
    try {
      const header = new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      return this.http.get(environment.baseServiceURL + `api/v1/Vehicle/GetVehicleDocumentByDocId/` +
        encodeURIComponent(documentId), { headers: header, responseType: 'blob' }).
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

  CheckDuplicateRegistrationNumber(registrationNumber: string) {
    try {
      return this.http.get(environment.baseServiceURL +
        `api/v1/Vehicle/CheckDuplicateRegistrationNumber/` + encodeURIComponent(registrationNumber),
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

  CheckDuplicateGPSTrackingDeviceNo(deviceNumber: string) {
    try {
      return this.http.get(environment.baseServiceURL + `api/v1/GpsTrackingDevice/CheckDuplicateGPSTrackingDeviceNo/` +
        encodeURIComponent(deviceNumber), this.httpOptions).
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

  CheckDuplicateVehicleChasisNo(chasisNumber: string) {
    try {
      return this.http.get(environment.baseServiceURL +
        `api/v1/Vehicle/CheckDuplicateVehicleChasisNo/` + encodeURIComponent(chasisNumber),
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
}
