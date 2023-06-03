import { RouterModule, Routes } from '@angular/router';


import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { AuthGuard } from '../../secure/auth-gaurd';
import { EmployeeInformationDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeBankAccountDetailsComponent } from './employee-bank-account-details/employee-bank-account-details.component';
import { ProvidentFundRatesComponent } from './provident-fund-rates/provident-fund-rates.component';
import { ProfessionalTaxRatesComponent } from './professional-tax-rates/professional-tax-rates.component';
import { ESICRatesDetailsComponent } from './esicrates-details/esicrates-details.component';
import { YearlyHolidaysListComponent } from './yearly-holidays-list/yearly-holidays-list.component';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { AttendancePunchDetailsComponent } from './attendance-punch-details/attendance-punch-details.component';
import { LoansAdvancesDetailsComponent } from './loans-advances-details/loans-advances-details.component';
import { ManualAttendenceComponent } from './manual-attendence/manual-attendence.component';
import { RouteAllowGaurdService } from 'src/app/services/auth/route-allow.gaurd';
import { DaywiseAttendanceFinalizationComponent } from './transactions/daywise-attendance-finalization/daywise-attendance-finalization.component';
import { SalaryComputationAndFinalizationComponent } from './salary-computation-and-finalization/salary-computation-and-finalization.component';


const routes: Routes = [

  {
    path: 'employee-information-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: EmployeeInformationDetailsComponent,
  },
  {
    path: 'employee-bank-account-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: EmployeeBankAccountDetailsComponent,
  },
  {
    path: 'provident-fund-rates',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProvidentFundRatesComponent,
  },
  {
    path: 'professional-tax-rates',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProfessionalTaxRatesComponent,
  },
  {
    path: 'esicrates-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ESICRatesDetailsComponent,
  },
  {
    path: 'yearly-holidays-list',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: YearlyHolidaysListComponent,
  },
  {
    path: 'shift-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ShiftDetailsComponent,
  },
  {
    path: 'attendance-punch-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: AttendancePunchDetailsComponent,
  },
  {
    path: 'loans-advances-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: LoansAdvancesDetailsComponent,
  },
  {
    path: 'manual-attendence',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ManualAttendenceComponent,
  },
  {
    path: 'daywise-attendance-finalization',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DaywiseAttendanceFinalizationComponent,
  },
  {
    path: 'salary-computation-and-finalization',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: SalaryComputationAndFinalizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRMMasterRoutingModule {
}
