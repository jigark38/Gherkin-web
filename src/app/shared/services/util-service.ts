import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})


export class UtilService {




    public defaultZero(data) {
        if (data === '' || data === null || data === undefined) {
            return 0;
        }
        return data;
    }
    private isValidJson(data: any): boolean {
        try {
            const jsondata = JSON.stringify(data);
            return true;
        } catch (e) {
            return false;
        }
    }
    public jsonParse(data: any) {
        if (this.isValidJson(data)) {
            return JSON.parse(JSON.stringify(data), this.DateTimeReviver);
        }
    }
    private DateTimeReviver(key: any, value: any) {
        const dbDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*?Z)?)$/.exec(value);
        const dtYYYYMMDD = /^(\d{4})-(\d{2})-(\d{2})$/;
        if (dbDate) {
            return this.incrementDate(value);
            // if (+dbDate[4] === 0 && +dbDate[5] === 0 && +dbDate[6] === 0) {
            //     return new Date(+dbDate[1], +dbDate[2] - 1, +dbDate[3]);
            // }
            // return new Date(
            //     Date.UTC(+dbDate[1], +dbDate[2] - 1, +dbDate[3], +dbDate[4], +dbDate[5], +dbDate[6])
            // );
        }
        //  else if (dtYYYYMMDD) {
        //     const splt = value.split('-');
        //     return new Date(splt[0], splt[1] - 1, splt[2]);
        // }
        return value;
    }
    private incrementDate(dateInput) {
        const dateFormatTotime = new Date(dateInput);
        const increasedDate = new Date(dateFormatTotime.getTime() + (1 * 86400000));
        return increasedDate;
    }
}
