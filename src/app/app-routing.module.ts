import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './feature-modules/secure/auth-gaurd';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './feature-modules/secure/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouteAllowGaurdService } from './services/auth/route-allow.gaurd';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginPageComponent
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then(a => a.HomeModule),
  },
  {
    path: 'org',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-modules/organisation-details/organisation.module').then(a => a.OrganisationModule),
  },
  {
    path: 'hrm',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-modules/human-resource-mgmnt/master/hrm-master.module').then(a => a.HRMMasterModule),
  },
  {
    path: 'secure',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-modules/secure/secure.module').then(a => a.SecureModule),
  },
  {
    path: 'report',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-modules/reports/reports.module').then(a => a.ReportsModule),
  },
  {
    path: 'agri',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature-modules/agri-management/agri-management.module').then(m => m.AgriManagementModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
