import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CullingPackDetailsService {

    constructor(private http: HttpClient, private datePipe: DatePipe) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };


    GetOrgofficelocationDetails() {
        try {
            return this.http.get(environment.baseServiceURL + `GetOrgofficelocationDetails`, this.httpOptions).
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
