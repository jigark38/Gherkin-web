import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeInformationDetailsComponent } from './employee-details/employee-details.component';
import { SharedModule } from 'src/app/shared.module';
import { HRMMasterRoutingModule } from './hrm-master-routing.module';
import { EmployeeBankAccountDetailsComponent } from './employee-bank-account-details/employee-bank-account-details.component';
import { ProvidentFundRatesComponent } from './provident-fund-rates/provident-fund-rates.component';
import { ProfessionalTaxRatesComponent } from './professional-tax-rates/professional-tax-rates.component';
import { ESICRatesDetailsComponent } from './esicrates-details/esicrates-details.component';
import { YearlyHolidaysListComponent } from './yearly-holidays-list/yearly-holidays-list.component';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { CustomDatePipe } from './professional-tax-rates/custom.datepipe';
import { AttendancePunchDetailsComponent } from './attendance-punch-details/attendance-punch-details.component';
import { LoansAdvancesDetailsComponent } from './loans-advances-details/loans-advances-details.component';
import { ManualAttendenceComponent } from './manual-attendence/manual-attendence.component';
import { DaywiseAttendanceFinalizationComponent } from './transactions/daywise-attendance-finalization/daywise-attendance-finalization.component';
import { SalaryComputationAndFinalizationComponent } from './salary-computation-and-finalization/salary-computation-and-finalization.component';




@NgModule({
  declarations: [EmployeeInformationDetailsComponent,
    EmployeeBankAccountDetailsComponent,
    ProvidentFundRatesComponent, ProfessionalTaxRatesComponent,
    ESICRatesDetailsComponent, YearlyHolidaysListComponent, ShiftDetailsComponent,
    CustomDatePipe,
    AttendancePunchDetailsComponent,
    LoansAdvancesDetailsComponent,
    ManualAttendenceComponent,
    DaywiseAttendanceFinalizationComponent,
    SalaryComputationAndFinalizationComponent],
  imports: [
    SharedModule,
    HRMMasterRoutingModule
  ]
})
export class HRMMasterModule { }
