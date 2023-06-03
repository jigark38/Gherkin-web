import { ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export class GherkinErrorHandler implements ErrorHandler {
    handleError(error: Error): void {
        const err = {
            message: error.message ? error.message : error.toString(),
            stack: error.stack ? error.stack : ''
        };

        // Log  the error
        console.log(err);
        // if (Error instanceof HttpErrorResponse) {
        //     console.log(error.status);
        // } else {
        //     console.error('an error occurred here', error);
        // }
    }
}
