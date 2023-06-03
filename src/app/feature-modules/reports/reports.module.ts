import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared.module';
import { ReportRoutingModule } from './reports-routing.module';
import { DepartmentAndDesignationComponent } from './department-and-designation/department-and-designation.component';
import { FarmerWiseSummaryComponent } from './farmer-wise-summary/farmer-wise-summary.component';
import { SatNativeDateModule, DateAdapter } from 'saturn-datepicker';
import { DialogModule } from 'primeng/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  DateAdapter as RangeDateAdapter,
  MAT_DATE_FORMATS as RANGE_MAT_DATE_FORMATS,
  MAT_DATE_LOCALE as RANGE_MAT_DATE_LOCALE,
  SatDatepickerModule
} from 'saturn-datepicker';
import { MaterialsStockReportComponent } from './materials-stock-report/materials-stock-report.component';
import { DailyGreensReceivingReportComponent } from './daily-greens-receiving-report/daily-greens-receiving-report.component';
import { GreenReceivedSummaryReportComponent } from './green-received-summary-report/green-received-summary-report.component';
import { DailyAttendanceReportComponent } from './daily-attendance-report/daily-attendance-report.component';
import { DailyGreensInwardReportComponent } from './daily-greens-inward-report/daily-greens-inward-report.component';
import { MonthlyAttendanceReportComponent } from '../secure/monthly-attendance-report/monthly-attendance-report.component';
export const MOMENTJS_RANGE_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  providers: [
    { provide: RangeDateAdapter, useClass: MomentDateAdapter, deps: [RANGE_MAT_DATE_LOCALE] },
    { provide: RANGE_MAT_DATE_FORMATS, useValue: MOMENTJS_RANGE_DATE_FORMAT },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
  declarations: [
    DepartmentAndDesignationComponent,
    FarmerWiseSummaryComponent,
    MaterialsStockReportComponent,
    DailyGreensReceivingReportComponent,
    GreenReceivedSummaryReportComponent,
    DailyAttendanceReportComponent,
    DailyGreensInwardReportComponent,
    MonthlyAttendanceReportComponent],
  imports: [
    SharedModule,
    CommonModule,
    ReportRoutingModule,
    SatDatepickerModule,
    SatNativeDateModule,
    DialogModule
  ]
})
export class ReportsModule { }
