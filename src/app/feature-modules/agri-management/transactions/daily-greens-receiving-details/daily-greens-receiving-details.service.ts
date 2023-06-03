import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FarmerAndVillage } from '../inputs-returns-from-farmers/inputs-returns-from-farmers.model';

@Injectable({
    providedIn: 'root'
})
export class DailyGreensReceivingDetailService {
    baseUrl = environment.baseServiceURL;
    constructor(private http: HttpClient) { }

    getCropGroup() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'GetCropGroup', httpOptions).subscribe(
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

    getCropName(cropcode) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetCropNameCode/${encodeURIComponent(cropcode)}`, httpOptions).subscribe(
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

    getSeasonFromTo(cropNameCode) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetSeasonFromTo/${encodeURIComponent(cropNameCode)}`, httpOptions).subscribe(
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

    getVillageCode(areaId) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetVillageCode/${areaId}`, httpOptions).subscribe(
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


    getFarmersByVillageCode(villageCode) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetFarmersByVillageCode?villageCode=${encodeURIComponent(villageCode)}`, httpOptions).subscribe(
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

    getFarmerByCode(farmerId) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetFarmerByCode?code=${encodeURIComponent(farmerId)}`, httpOptions).subscribe(
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

    getCropSchemes(cropNameCode) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetCropSchemes?cropCode=${encodeURIComponent(cropNameCode)}`,
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
    getBuyerSchedules() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'api/v1/DailyHarvest/GetBuyerSchedules',
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



    getOfficeLocations() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'Organisation/GetOfficeLocations',
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

    getAllArea() {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + 'Area/GetAllArea',
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

    addGreensProcurement(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'api/v1/DailyHarvest/AddGreensProcurement', data,
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

    addGreensQuantityCratewiseDetail(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'api/v1/DailyHarvest/AddGreensQuantityCratewiseDetail', data,
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

    addGreensQuantityCountwiseDetail(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'api/v1/DailyHarvest/AddGreensQuantityCountwiseDetail', data,
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

    addGreensFarmersDetail(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'api/v1/DailyHarvest/AddGreensFarmersDetail', data,
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

    addGreensFarmersDetailList(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'api/v1/DailyHarvest/AddGreensFarmersDetailList', data,
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

    addGreensQuantityCratewiseDetailList(data) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.post(this.baseUrl + 'api/v1/DailyHarvest/AddGreensQuantityCratewiseDetailList', data,
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

    GetGreensProcurementByDespNo(DespNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `api/v1/DailyHarvest/GetGreensProcurementByDespNo/${encodeURIComponent(DespNo)}`,
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
    GetGreensFarmersDetails(GreenProcurementNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `api/v1/DailyHarvest/GetGreensFarmersDetails/${encodeURIComponent(GreenProcurementNo)}`,
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
    GetGreensQuantityCrateWiseDetails(GreenProcurementNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `api/v1/DailyHarvest/GetGreensQuantityCrateWiseDetails/${encodeURIComponent(GreenProcurementNo)}`,
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
    GetGreensQuantityCountWiseDetails(GreenProcurementNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `api/v1/DailyHarvest/GetGreensQuantityCountWiseDetails/${encodeURIComponent(GreenProcurementNo)}`,
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
    GetFarmerListByAreaAndVillageCodeAndPSNumberAndFarmerName(farmerName: string, areaId: string, psNumber: string, villageCode: string) {
        if (!farmerName || !areaId || !villageCode || !psNumber) {
            return of([]);
        }
        return this.http.get<FarmerAndVillage[]>(this.baseUrl + `GetFarmerListByAreaAndVillageCodeAndPSNumber/`
            + encodeURIComponent(farmerName)
            + `/` + encodeURIComponent(areaId)
            + `/` + encodeURIComponent(villageCode)
            + `/` + encodeURIComponent(psNumber));
    }

    GetFarmerListByAreaAndVillageCodeAndPSNumber(areaId: string, psNumber: string, villageCode: string) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetFarmerListByAreaAndVillageCodeAndPSNumber/`
                + encodeURIComponent(areaId)
                + `/` + encodeURIComponent(psNumber)
                + `/` + encodeURIComponent(villageCode)
                , httpOptions).subscribe(
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

    GetFarmerByAreaAndPSNumberAndAccountNo(areaId: string, psNumber: string, accounNo: string) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `GetFarmerByAreaAndPSNumberAndAccountNo/`
                + encodeURIComponent(areaId)
                + `/` + encodeURIComponent(psNumber)
                + `/` + encodeURIComponent(accounNo)
                , httpOptions).subscribe(
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

    GetCompletedDailyGreensRecieving(harvestDate) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `api/v1/DailyHarvest/GetCompletedDailyGreensRecieving/`
                + encodeURIComponent(harvestDate),
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

    GetDailyGreensQuantityCrateWiseDetails(GreenProcurementNo) {
        return new Observable(observer => {
            const httpOptions = {
                headers: new HttpHeaders(
                    'application/json'
                )
            };
            this.http.get(this.baseUrl + `api/v1/DailyHarvest/GetDailyGreensQuantityCrateWiseDetails/`
                + encodeURIComponent(GreenProcurementNo),
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


