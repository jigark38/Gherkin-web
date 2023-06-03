import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserPermissionService } from 'src/app/feature-modules/secure/user-permission/user-permission.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { menuItems } from './../../shared/data/menu-items';
@Injectable({ providedIn: 'root' })
export class RouteAllowGaurdService implements CanActivate {
    constructor(private router: Router, private userService: UserPermissionService,
        private authenticationService: AuthenticationService) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.getPermissions(route['_routerState'].url);
    }

    private getUserdetails(): any {
        const userdetails = localStorage.getItem('Userdetails');
        if (userdetails === undefined || userdetails === null) {
            return {};
        }
        return JSON.parse(userdetails);
    }


    getPermissions(currentRoute: string): Observable<boolean> {
        return new Observable<boolean>((sub) => {
            let userDetails = this.getUserdetails();
            if (userDetails.isAdmin) {
                this.authenticationService.userStoredPermissions = [];
                sub.next(true);
                if (!this.authenticationService.isPermissionDataLoaded) {
                    this.authenticationService.permissions.next([]);
                }
                this.authenticationService.isPermissionDataLoaded = true;
                sub.complete();
            } else if (this.authenticationService.userStoredPermissions && this.authenticationService.userStoredPermissions.length > 0) {
                sub.next(this.isRouteAllowed(currentRoute));
                if (!this.authenticationService.isPermissionDataLoaded) {
                    this.authenticationService.permissions.next(this.authenticationService.userStoredPermissions);
                }
                this.authenticationService.isPermissionDataLoaded = true;
                sub.complete();
            } else {
                const details = { userId: userDetails.userId, organisationId: userDetails.orgCode, locationId: userDetails.orgOfficeCode };
                this.userService.getMenuPermissions(details).subscribe(res => {
                    this.authenticationService.isPermissionDataLoaded = true;
                    this.authenticationService.userStoredPermissions = [];
                    this.authenticationService.userStoredPermissions = Object.assign([], res);
                    this.authenticationService.permissions.next(res);
                    sub.next(this.isRouteAllowed(currentRoute));
                    sub.complete();
                }, err => {
                    console.error('error on getMenuPermissions', err);
                    sub.error(err);
                    sub.complete();
                });
            }

        });

    }

    isRouteAllowed(currentRoute: string) {
        let menu = menuItems;
        let allowedMenu = this.authenticationService.userStoredPermissions;
        let matchedMenuId: string;
        if (currentRoute.toLocaleLowerCase() == "/home") {
            return true;
        }
        menuItems.forEach(parent => {
            if (parent.items && parent.items.length > 0) {
                parent.items.forEach(firstChild => {
                    if (firstChild.items && firstChild.items.length > 0) {
                        firstChild.items.forEach(child => {
                            if ('/' + child.routerLink == currentRoute) {
                                matchedMenuId = child.id;
                            }
                        });
                    }
                });
            }
        });
        let isMatchFound: boolean;
        if (matchedMenuId) {
            if (allowedMenu && allowedMenu.length > 0) {
                allowedMenu.forEach(firstChild => {
                    if (firstChild && firstChild.Children && firstChild.Children.length > 0) {
                        firstChild.Children.forEach(child => {
                            if (child.id == matchedMenuId) {
                                isMatchFound = true;
                                return true;
                            }
                        });
                    }
                });
            }
        } else {
            return false;
        }
        return isMatchFound;
    };
}