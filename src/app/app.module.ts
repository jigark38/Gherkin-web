import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpInterceptor } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppHttpInterceptor } from './interceptors/http-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { BaseComponent } from 'src/app/shared/base.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CropsAndSchemesComponent } from './feature-modules/agri-management/master/crops-and-schemes/crops-and-schemes.component';
import { GherkinErrorHandler } from './services/auth/error/error-handler';
import { HeaderComponent } from './corecomponents/header/header.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoginPageComponent } from './feature-modules/secure/login-page/login-page.component';
import { ModalModule } from './corecomponents/modal/modal.module';
import { PrimengModule } from './primeng-module';
import { PrimengSidenavbarComponent } from './corecomponents/primeng-sidenavbar/primeng-sidenavbar.component';
import { SharedModule } from './shared.module';
import { SnackBarComponent } from './corecomponents/snackbar/snackbar.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WebservicewrapperService } from './services/backendcall/webservicewrapper.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BaseComponent,
    PrimengSidenavbarComponent,
    SnackBarComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    SharedModule,
    PrimengModule,
    // configure the imports
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    SnackBarComponent,
  ],
  providers: [WebservicewrapperService,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
