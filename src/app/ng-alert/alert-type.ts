export enum AlertType {
    warning = 'warning',
    success = 'success',
    error = 'error',
    info = 'info'
}
export class AlertMessage {
    type: AlertType;
    message: string;
    constructor(type: AlertType, message: string) {
        this.type = type;
        this.message = message;
    }
}
