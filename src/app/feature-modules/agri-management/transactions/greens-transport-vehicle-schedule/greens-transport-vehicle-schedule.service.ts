import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GreenTransportVehicleScheduleService {
    baseUrl = environment.baseServiceURL;
    constructor(private http: HttpClient) { }

    getOfficeLocationDetails() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'Organisation/GetOfficeLocations', httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getAllAreaDetail() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'Area/GetAllArea', httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getAllEmployee() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetAllEmployee', httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getGreensTransportVehicleBuyingSupervisor(areaId, dateOfEntry) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `getGreensTransportVehicleBuyingSupervisor/${areaId}/${dateOfEntry}`, httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getRGPNo() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetRGPNo', httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }


    getFieldStaffByArea(areaCode) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetFieldStaffbyArea?area=' + encodeURIComponent(areaCode), httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getAllMaterialGroup() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'rawmaterial/master/', httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getAllMaterialByMaterialGroup(groupId) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'rawmaterial/GetRMDeatilsCodeNameByGroupCode?rawMaterialGroupCode=' + encodeURIComponent(groupId),
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }

    saveAddGreensTransportVehicleSchedule(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'AddGreensTransportVehicleSchedule', data, httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }


    getRGPDetail() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetRGPDetail',
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }

    getGreensTransportVehicleDetail(rgpNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetGreensTransportVehicleDetail/' + rgpNo,
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }

    updateGreensTransportVehicleSchedule(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'UpdateGreensTransportVehicleSchedule', data, httpOptions).subscribe(
                (res: any) => {
                    observer.next(res);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    getHiredTransporterList() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'api/v1/HiredTransporterDetails/GetHiredTransporterList',
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }

    getAllVehicles() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'api/v1/Vehicle/GetAllVehicles',
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }

    getHiredVehicleList(hiredTransID: number) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'api/v1/HiredTransporterDetails/GetHiredVehicleList/' + hiredTransID,
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }

    getAllDriverNames() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + '/GetAllDriverNames',
                httpOptions).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                        observer.complete();
                    }
                );
        });
    }
}


