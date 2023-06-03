import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { YearlyCalendar, WeeklyHoliday, StatutoryHoliday } from './yearly-holidays-list.model';
import { DatePipe } from '@angular/common';
import { AppConstants } from '../../../../constants/app.constants';

@Injectable({
    providedIn: 'root'
})
export class YearlyHolidaysListService {

    constructor(private http: HttpClient, private datePipe: DatePipe) { }

    private getAllWeekDays = AppConstants.apiUrlGetAllWeekDays;
    private getYearlyCalendarDetails = AppConstants.apiUrlGetYearlyCalendarDetails;
    private addYearlyCalendarDetails = AppConstants.apiUrlAddYearlyCalendarDetails;
    private addWeeklyHolidays = AppConstants.apiUrlAddWeeklyHolidays;
    private addStatutoryHolidays = AppConstants.apiUrlAddStatutoryHolidays;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    GetAllWeekDays(): Observable<any> {
        try {
            return this.http.get(this.getAllWeekDays, this.httpOptions).
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
    GetYearlyCalendarDetailsByEmpId(empId): Observable<any> {
        try {
            return this.http.get(this.getYearlyCalendarDetails + encodeURIComponent(empId), this.httpOptions).
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

    AddYearlyCalendarDetails(yearlyCalendar: YearlyCalendar) {
        try {
            return this.http.post(this.addYearlyCalendarDetails, yearlyCalendar, this.httpOptions).
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
    AddWeeklyHolidays(weeklyHolidaysList: WeeklyHoliday[]) {
        try {
            return this.http.post(this.addWeeklyHolidays, weeklyHolidaysList, this.httpOptions).
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

    AddStatutoryHolidays(statutoryHolidayList: StatutoryHoliday[]) {
        try {
            return this.http.post(this.addStatutoryHolidays, statutoryHolidayList, this.httpOptions).
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
