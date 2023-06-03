import { CommonModule } from '@angular/common';
import { ManagementDetailsComponent } from './management-details/management-details.component';
import { NgModule } from '@angular/core';
import { OrganisationDetailsComponent } from './org-details/organisation-details.component';
import { OrganisationOfficesLocatonsDetailsComponent } from './org-off-loc-details/org-ofc-loc-details.component';
import { OrganisationRoutingModule } from './organisation-routing.module';
import { SharedModule } from './../../shared.module';

@NgModule({
  declarations: [OrganisationDetailsComponent, ManagementDetailsComponent, OrganisationOfficesLocatonsDetailsComponent],
  imports: [
    SharedModule,
    OrganisationRoutingModule
  ]
})
export class OrganisationModule { }
