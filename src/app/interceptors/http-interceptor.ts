import { MessageService } from 'primeng/api';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { AuthenticationService } from '../shared/services/authentication-service';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { UtilService } from '../shared/services/util-service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticationService, private utilService: UtilService, private messageService: MessageService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // tslint:disable-next-line: one-variable-per-declaration
        let userDetails, token = '';
        if (req.url.indexOf('Login/UserLogin') === -1) {
            userDetails = this.authService.getUserdetails();
            token = Object.keys(userDetails).length > 0 ? userDetails.authToken : '';
        }
        const authReq = req.clone({
            headers: new HttpHeaders({
                'access-control-allow-origin': '*',
                Authorization: token
            }),
            body: req.body
            // this.utilService.jsonParse(req.body)
        });
        return next.handle(authReq).pipe(
            map(resp => {
                if (resp instanceof HttpResponse) {
                    // const formattedBody = this.utilService.jsonParse(resp.body);
                    // console.log('Intercepted response', formattedBody);
                    return resp.clone({ body: resp.body });
                }
            }),
            catchError((err: any) => {
                const error = err.error ? err.error.message : err.statusText;
                Object.entries(err.error.ModelState).map((prop: any) => {
                    if (prop.length === 2) {
                        prop[1].map((msg: string) => {
                            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
                        });
                    }
                });

                return throwError(error);
            })
        );


    }
}

