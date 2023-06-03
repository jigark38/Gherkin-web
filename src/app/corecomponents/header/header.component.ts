import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  LogoHeader = 'Gherkin Processing Enterprise Business Software';
  isLoggedin = false;
  userDetails: any;
  constructor(public authService: AuthenticationService, private router: Router) {
    this.authService.isLoggedin
      .subscribe(res => {
        this.isLoggedin = res;
      });
  }

  ngOnInit() {
    this.userDetails = this.authService.getUserdetails();
  }
  public get UserName() {
    try {
      if (this.userDetails) {
        return this.userDetails.userName.toLowerCase() === 'gherkinui' ? 'Admin' : this.userDetails.userName;
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }

  }

  logOut() {
    this.authService.logOut();
  }
}
