import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../secure/auth-gaurd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { DepartmentAndDesignationComponent } from './department-and-designation/department-and-designation.component';
import { FarmerWiseSummaryComponent } from './farmer-wise-summary/farmer-wise-summary.component';
import { MaterialsStockReportComponent } from './materials-stock-report/materials-stock-report.component';
import { DailyGreensReceivingReportComponent } from './daily-greens-receiving-report/daily-greens-receiving-report.component';
import { GreenReceivedSummaryReportComponent } from './green-received-summary-report/green-received-summary-report.component';
import { RouteAllowGaurdService } from 'src/app/services/auth/route-allow.gaurd';
import { DailyAttendanceReportComponent } from './daily-attendance-report/daily-attendance-report.component';
import { DailyGreensInwardReportComponent } from './daily-greens-inward-report/daily-greens-inward-report.component';
import { MonthlyAttendanceReportComponent } from '../secure/monthly-attendance-report/monthly-attendance-report.component';

const routes: Routes = [
  {
    path: 'department-designation',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DepartmentAndDesignationComponent,
  },
  {
    path: 'farmer-summary-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: FarmerWiseSummaryComponent,
  },
  {
    path: 'materials-stock-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: MaterialsStockReportComponent,
  },
  {
    path: 'daily-greens-receiving-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DailyGreensReceivingReportComponent
  },
  {
    path: 'daily-attendance-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DailyAttendanceReportComponent
  },
  {
    path: 'green-received-summary-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: GreenReceivedSummaryReportComponent
  },
  {
    path: 'daily-greens-inward-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DailyGreensInwardReportComponent
  },
  {
    path: 'monthly-attendance-report',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: MonthlyAttendanceReportComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
