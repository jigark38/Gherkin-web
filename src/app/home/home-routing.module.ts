import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouteAllowGaurdService } from 'src/app/services/auth/route-allow.gaurd';
import { AuthGuard } from '../feature-modules/secure/auth-gaurd';
import { HomeComponent } from './home.component';


const routes: Routes = [

  {
    path: 'dashboard',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: HomeComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
