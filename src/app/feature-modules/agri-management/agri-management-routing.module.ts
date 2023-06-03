import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAllowGaurdService } from 'src/app/services/auth/route-allow.gaurd';
import { AuthGuard } from '../secure/auth-gaurd';
import { AmountAdvancesToFarmersComponent } from './transactions/amount-advances-to-farmers/amount-advances-to-farmers.component';

import { BuyingStaffDetailsComponent } from './master/buying-staff-details/buying-staff-details.component';
import { CentreAreasandVillagesComponent } from './master/centre-areasand-villages/centre-areasand-villages.component';
import { CropRateComponent } from './master/crop-rate/crop-rate.component';
import { CropsAndSchemesComponent } from './master/crops-and-schemes/crops-and-schemes.component';
import { FarmerDetailsComponent } from './master/farmer-details/farmer-details.component';
import { FarmersInputRatesSeasonWiseComponent } from './master/farmers-input-rates-season-wise/farmers-input-rates-season-wise.component';
import { FieldstaffdetailsComponent } from './master/fieldstaffdetails/fieldstaffdetails.component';
import { HarvestStageDetailsComponent } from './master/harvest-stage-details/harvest-stage-details.component';
import { PackageOfPracticeComponent } from './master/package-of-practice/package-of-practice.component';
import { AreaBranchMaterialReceivingDetailsComponent } from './transactions/area-branch-material-receiving-details/area-branch-material-receiving-details.component';
import { BuyingMaterialDetailsComponent } from './transactions/buying-material-details/buying-material-details.component';
import { DailyGreensReceivingDetailsComponent } from './transactions/daily-greens-receiving-details/daily-greens-receiving-details.component';
import { FarmerAccountDetailsFinalizationComponent } from './transactions/farmer-account-details-finalization/farmer-account-details-finalization.component';
import { GreensTransportVehicleScheduleComponent } from './transactions/greens-transport-vehicle-schedule/greens-transport-vehicle-schedule.component';
import { InputsIssuedtoFieldStaffComponent } from './transactions/inputs-issuedto-field-staff/inputs-issuedto-field-staff.component';
import { InputsReturnsFromFarmersComponent } from './transactions/inputs-returns-from-farmers/inputs-returns-from-farmers.component';
import { InputsTransferDetailsComponent } from './transactions/inputs-transfer-details/inputs-transfer-details.component';
import { MaterialInputIssueToFarmerComponent } from './transactions/material-input-issue-to-farmer/material-input-issue-to-farmer.component';
import { PlantationSchedulingComponent } from './transactions/plantation-scheduling/plantation-scheduling.component';
import { FarmersAgreementComponent } from './transactions/farmers-agreement/farmers-agreement.component';
import { SowingFarmerDetailsComponent } from './transactions/sowing-farmer-details/sowing-farmer-details.component';

const routes: Routes = [{
  path: 'buying-staff-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: BuyingStaffDetailsComponent
},
{
  path: 'centre-areasand-villages',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: CentreAreasandVillagesComponent
},
{
  path: 'crop-rate',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: CropRateComponent
},
{
  path: 'cropsandschemes',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: CropsAndSchemesComponent
},
{
  path: 'farmer-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: FarmerDetailsComponent
},

{
  path: 'farmers-input-rates-seasonwise-component',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: FarmersInputRatesSeasonWiseComponent
},
{
  path: 'fieldstaffdetails',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: FieldstaffdetailsComponent
},
{
  path: 'harvest-stage-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: HarvestStageDetailsComponent
},
{
  path: 'package-of-practice',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: PackageOfPracticeComponent
},
{
  path: 'amount-advances-to-farmers',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: AmountAdvancesToFarmersComponent
},
{
  path: 'area-branch-material-receiving-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: AreaBranchMaterialReceivingDetailsComponent
},
{
  path: 'buying-material-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: BuyingMaterialDetailsComponent
},
{
  path: 'daily-greens-receiving-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: DailyGreensReceivingDetailsComponent
},
{
  path: 'farmer-account-details-finalization',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: FarmerAccountDetailsFinalizationComponent
},
{
  path: 'greens-transport-vehicle-schedule',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: GreensTransportVehicleScheduleComponent
},
{
  path: 'inputs-issuedto-field-staff',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: InputsIssuedtoFieldStaffComponent
},
{
  path: 'inputs-returns-from-farmers',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: InputsReturnsFromFarmersComponent
},
{
  path: 'inputs-transfer-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: InputsTransferDetailsComponent,
},
{
  path: 'material-input-issue-to-farmer',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: MaterialInputIssueToFarmerComponent
},
{
  path: 'plantation-scheduling',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: PlantationSchedulingComponent
},
{
  path: 'farmers-agreement',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: FarmersAgreementComponent
},
{
  path: 'sowing-farmer-details',
  canActivate: [AuthGuard, RouteAllowGaurdService],
  component: SowingFarmerDetailsComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgriManagementRoutingModule { }
