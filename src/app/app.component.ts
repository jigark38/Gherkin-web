import { Component, HostListener } from '@angular/core';

import { AuthenticationService } from './shared/services/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'GherkinEBS';
  isLoggedin = false;

  constructor(public authService: AuthenticationService, private route: Router) {
    this.authService.isLoggedin.subscribe(res => {
      this.isLoggedin = res;
    });
  }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    this.authService.reset();
  }
  @HostListener('document:click', ['$event'])
  onClick(e) {
    this.authService.reset();
  }
  @HostListener('document:keypress', ['$event'])
  keyPress(e) {
    this.authService.reset();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    try {
      const userDetails = this.authService.getUserdetails();
      if (Object.keys(userDetails).length > 0) {
        this.isLoggedin = userDetails.isLoggedin;
        this.authService.isLoggedin.next(true);
      } else {
        this.route.navigate(['/login']);
      }
    } catch (error) {

    }
  }

}
