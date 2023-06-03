import { AlertMessage, AlertType } from './alert-type';
import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NgAlertService {
    public alert = new Subject<AlertMessage>();

    success(msg: string) {
        this.alert.next({ type: AlertType.success, message: msg });
    }

    error(msg: string) {
        this.alert.next({ type: AlertType.error, message: msg });
    }

    info(msg: string) {
        this.alert.next({ type: AlertType.info, message: msg });
    }

    warning(msg: string) {
        this.alert.next({ type: AlertType.warning, message: msg });
    }


}
