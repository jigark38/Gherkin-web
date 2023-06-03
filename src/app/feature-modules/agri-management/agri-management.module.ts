import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgriManagementRoutingModule } from './agri-management-routing.module';
import { SharedModule } from 'src/app/shared.module';

import { CentreAreasandVillagesComponent } from './master/centre-areasand-villages/centre-areasand-villages.component';
import { BuyingStaffDetailsComponent } from './master/buying-staff-details/buying-staff-details.component';
import { CropRateComponent } from './master/crop-rate/crop-rate.component';
import { CropsAndSchemesComponent } from './master/crops-and-schemes/crops-and-schemes.component';
import { FarmerDetailsComponent } from './master/farmer-details/farmer-details.component';
import { FarmersInputRatesSeasonWiseComponent } from './master/farmers-input-rates-season-wise/farmers-input-rates-season-wise.component';
import { DateAdapter, MatAutocompleteModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTreeModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentUtcDateAdapter } from 'src/app/corecomponents/datePickerformat/moment-utc-date-adapter';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2CompleterModule } from 'ng2-completer';
import { DialogModule } from 'primeng/dialog';
import { FieldstaffdetailsComponent } from './master/fieldstaffdetails/fieldstaffdetails.component';
import { HarvestStageDetailsComponent } from './master/harvest-stage-details/harvest-stage-details.component';
import { PackageOfPracticeComponent } from './master/package-of-practice/package-of-practice.component';
import { AmountAdvancesToFarmersComponent } from './transactions/amount-advances-to-farmers/amount-advances-to-farmers.component';
import { AreaBranchMaterialReceivingDetailsComponent } from './transactions/area-branch-material-receiving-details/area-branch-material-receiving-details.component';
import { BuyingMaterialDetailsComponent } from './transactions/buying-material-details/buying-material-details.component';
import { DailyGreensReceivingDetailsComponent } from './transactions/daily-greens-receiving-details/daily-greens-receiving-details.component';
import { MathcesFarmerPipe } from 'src/app/shared/pipes/matchesFarmer.pipe';
import { FarmerAccountDetailsFinalizationComponent } from './transactions/farmer-account-details-finalization/farmer-account-details-finalization.component';
import { GreensTransportVehicleScheduleComponent } from './transactions/greens-transport-vehicle-schedule/greens-transport-vehicle-schedule.component';
import { InputsIssuedtoFieldStaffComponent } from './transactions/inputs-issuedto-field-staff/inputs-issuedto-field-staff.component';
import { InputsReturnsFromFarmersComponent } from './transactions/inputs-returns-from-farmers/inputs-returns-from-farmers.component';
import { InputsTransferDetailsComponent } from './transactions/inputs-transfer-details/inputs-transfer-details.component';
import { MaterialInputIssueToFarmerComponent } from './transactions/material-input-issue-to-farmer/material-input-issue-to-farmer.component';
import { PlantationSchedulingComponent } from './transactions/plantation-scheduling/plantation-scheduling.component';
import { FarmersAgreementComponent } from './transactions/farmers-agreement/farmers-agreement.component';
import { SowingFarmerDetailsComponent } from './transactions/sowing-farmer-details/sowing-farmer-details.component';


@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
  ],
  declarations: [BuyingStaffDetailsComponent,
    CropRateComponent,
    CropsAndSchemesComponent,
    FarmerDetailsComponent,
    FarmersInputRatesSeasonWiseComponent,
    FieldstaffdetailsComponent,
    HarvestStageDetailsComponent,
    PackageOfPracticeComponent,
    AmountAdvancesToFarmersComponent,
    BuyingMaterialDetailsComponent,
    MathcesFarmerPipe,
    InputsIssuedtoFieldStaffComponent,
    InputsReturnsFromFarmersComponent,
    GreensTransportVehicleScheduleComponent,
    DailyGreensReceivingDetailsComponent,
    FarmerAccountDetailsFinalizationComponent,
    InputsTransferDetailsComponent,
    AreaBranchMaterialReceivingDetailsComponent,
    MaterialInputIssueToFarmerComponent,
    PlantationSchedulingComponent,
    FarmersAgreementComponent,
    SowingFarmerDetailsComponent,
    CentreAreasandVillagesComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    Ng2CompleterModule,
    MatAutocompleteModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    AgriManagementRoutingModule
  ]
})
export class AgriManagementModule { }
