import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { Injectable } from '@angular/core';

// export class Permissions {
//     canGoToRoute(user: UserToken, id: string): boolean {
//       return true;
//     }
//   }

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if (route.url[0].path === 'login') {
            if (!this.authService.userLoggedin) {
                return of(true);
            } else {
                this.router.navigate(['login']);
                return of(false);
            }
        }
        if (!this.authService.userLoggedin) {
            this.router.navigate(['login']);
            return of(false);
        }
        return of(true);
    }
}
