import { AlertMessage, AlertType } from 'src/app/ng-alert/alert-type';
import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
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
