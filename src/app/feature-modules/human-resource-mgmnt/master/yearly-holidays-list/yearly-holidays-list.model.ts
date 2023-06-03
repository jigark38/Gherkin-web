export class StatutoryHoliday {
    employeeId: string;
    holidaysPassingNo: number;
    statutoryHolidaysNo: number;
    holidaysDate: Date;
    weekDaysId: number;
    holidayOccasion: string;
}

export class WeekDay {
    weekdaysId: number;
    weekdaysName: string;
}

export class WeeklyHoliday {
    id: number;
    employeeId: string;
    holidaysPassingNo: number;
    weekDaysId: number;
}

export class YearlyCalendar {
    dateOfEntry: Date;
    employeeId: string;
    holidaysPassingNo: number;
    calenderYearFromDate: Date;
    calenderYearToDate: Date;
    yearlyStatutoryHolidayCount: number;
}


export class YearlyCalendarDetail {
    dateOfEntry: Date;
    employeeId: string;
    employeeName: string;
    holidaysPassingNo: number;
    calenderYearFromDate: Date;
    calenderYearToDate: Date;
    yearlyStatutoryHolidayCount: number;
    weeklyHolidaysList: WeeklyHoliday[];
    statutoryHolidaysList: StatutoryHoliday[];
}

