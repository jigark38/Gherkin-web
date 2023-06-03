import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { URLS } from 'src/app/configuration';
import { ShiftDetails } from './shift-details.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ShiftDetailsService {

  constructor(private http: HttpClient) { }

  saveShiftDetails(sDetails: ShiftDetails) {
    const abc = JSON.stringify(sDetails);
    return this.http.post<ShiftDetails>(URLS.saveShiftDetail, sDetails, httpOptions);
  }

  cancelShift(sDetails: ShiftDetails) {
    const abc = JSON.stringify(sDetails);
    return this.http.post<ShiftDetails>(URLS.cancelShift, sDetails, httpOptions);
  }
  getShiftList() {
    return this.http.get<ShiftDetails[]>(URLS.getShiftList, httpOptions);
  }
}
