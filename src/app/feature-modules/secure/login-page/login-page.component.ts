import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loginDisable = false;
  invlidLogin = false;
  serverError: boolean;
  year = new Date().getFullYear();
  constructor(private router: Router, private authServie: AuthenticationService,
    // tslint:disable-next-line: align
    private loadingService: LoadingBarService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    try {
      this.loginForm = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      });
    } catch (error) {
      console.error('Error on createForm:', error);
    }
  }
  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  validateLogin() {
    try {
      if (this.loginForm.invalid) {
        this.markFieldAsTouched(this.loginForm);
        return;
      }
      this.invlidLogin = false;
      this.loadingService.start();
      this.loginDisable = true;
      this.authServie.validateLogin(this.loginForm.value)
        .subscribe((res: any) => {
          this.loginDisable = false;
          this.loadingService.stop();
          if (res && res.Status === 'Success') {
            const userDetails = {
              userName: this.loginForm.value.userName,
              authToken: res.Message,
              userId: res.UserId,
              employeeId: res.EmployeeId,
              TokenExpires: res.ExpiryMinutes,
              isAdmin: res.IsAdmin,
              isLoggedin: true,
              orgOfficeCode: res.OfficeLocationCode,
              orgCode: res.OrgCode
            };
            this.authServie.setUserdetails(userDetails);
            this.authServie.isLoggedin.next(true);
            this.router.navigate(['']);
          } else {
            this.loginDisable = false;
            this.invlidLogin = true;
          }
        }, err => {
          this.loginDisable = false;
          this.serverError = true;
        });
    } catch (error) {
      console.error('Error on validateLogin:', error);
    }
  }
  reset() {
    try {
      this.loginDisable = this.invlidLogin = this.serverError = false;
      this.createForm();
    } catch (error) {

    }
  }
}
