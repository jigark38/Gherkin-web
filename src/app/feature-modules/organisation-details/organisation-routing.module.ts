import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../secure/auth-gaurd';
import { CommonModule } from '@angular/common';
import { ManagementDetailsComponent } from './management-details/management-details.component';
import { NgModule } from '@angular/core';
import { OrganisationDetailsComponent } from './org-details/organisation-details.component';
import { OrganisationOfficesLocatonsDetailsComponent } from './org-off-loc-details/org-ofc-loc-details.component';
import { SharedModule } from '../../shared.module';
import { RouteAllowGaurdService } from 'src/app/services/auth/route-allow.gaurd';

const routes: Routes = [

  {
    path: 'organisation-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: OrganisationDetailsComponent,
  },
  // {
  //   path: 'management-details',
  //   canActivate: [AuthGuard],
  //   component: ManagementDetailsComponent
  // },
  // {
  //   path: 'org-ofc-loc-details',
  //   canActivate: [AuthGuard],
  //   component: OrganisationOfficesLocatonsDetailsComponent
  // },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule {
}
