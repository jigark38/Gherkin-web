import * as R from 'ramda';

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu/panelmenu';
import { UserPermissionService } from 'src/app/feature-modules/secure/user-permission/user-permission.service';
import { menuItems } from './../../shared/data/menu-items';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

declare var $: any;

@Component({
  selector: 'app-primeng-sidenavbar',
  templateUrl: './primeng-sidenavbar.component.html',
  styleUrls: ['./primeng-sidenavbar.component.css']
})
export class PrimengSidenavbarComponent implements OnInit, OnDestroy {
  @ViewChild('menu', { static: true }) menu: PanelMenu;
  items: MenuItem[];
  Permissions: any[];
  userDetails: any;
  accesibleItems: MenuItem[] = [];
  itemsMaster: any[];
  constructor(private userService: UserPermissionService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    try {
      this.bindMenuEvents();
      // this.getUserMenu();
      this.userDetails = this.getUserdetails();
      this.authenticationService.permissions.subscribe(res => {
        if (res && res.length == 0 && this.userDetails.isAdmin) {
          this.accesibleItems = [];
          this.accesibleItems = JSON.parse(JSON.stringify(menuItems));
        } else if (res && res.length > 0 && !this.userDetails.isAdmin) {
          this.items = JSON.parse(JSON.stringify(menuItems));
          this.itemsMaster = JSON.parse(JSON.stringify(menuItems));

          this.Permissions = Object.assign([], res);
          if (res && res.length > 0) {
            this.filterMainmenu();
          }
        }
      });
    } catch (error) {
      console.error('Error on navbar ngOninit', error);
    }
  }

  getUserMenu() {
    this.userDetails = this.getUserdetails();
    if (this.userDetails) {
      if (!this.userDetails.isAdmin) {
        this.items = JSON.parse(JSON.stringify(menuItems));
        this.itemsMaster = JSON.parse(JSON.stringify(menuItems));
        this.getPermissions();
      } else {
        this.accesibleItems = [];
        this.accesibleItems = JSON.parse(JSON.stringify(menuItems));
      }


    }
  }

  bindMenuEvents() {
    $(document).ready(() => {
      $('a.ui-panelmenu-header-link').click((e) => {
        let menuText = $(e.target).text();
        if (!menuText) {
          menuText = $(e.target).parent().find('span.ui-menuitem-text').text();
        }
        this.collapseOthers(menuText);
      });
    });
  }
  clear() {
    if (this.menu) {
      this.menu.collapseAll();
      this.collapseOthers();
    }
  }
  collapseOthers(name?: any) {
    if (this.menu.model && this.menu.model.length > 0) {
      this.menu.model.forEach(m => {
        if (m.label !== name) {
          delete m.expanded;
          if (m.items && m.items.length > 0) {
            m.items.forEach((item) => { delete item.expanded; });
          }
        }
      });
    }
  }
  filterMainmenu() {
    try {
      const menus = this.Permissions;
      const mainmenus = R.uniq(menus.map(m => m.id.split('_')[0]));
      this.items = this.items.filter(m => m.id && mainmenus.indexOf(m.id.split('_')[0]) > -1);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.items.length; i++) {
        const menuId = this.items[i].id;

        const result = R.filter(R.where({ id: R.contains(menuId) }), menus);
        const children = this.isChildrenExist(menuId);
        if ((result && result.length > 0) || children.length > 0) {
          const menuItem = Object.assign({}, this.items[i]) as any;
          menuItem.items = [];
          menuItem.sortId = menuItem.id.split('_')[0];
          this.accesibleItems.push(menuItem);

          const masterChildren = this.itemsMaster.filter(p => p.id === menuId)[0].items;
          if (children.length > 0 && masterChildren && masterChildren.length > 0) {

            try {
              children.forEach(ch => {

                const submenuIds = menus.filter(a => a.id === ch)[0].Children.map(a => a.id);
                const secondlvlMenu = masterChildren.filter(t => t.id === ch)[0];
                secondlvlMenu.sortId = secondlvlMenu.id.split('_')[1];
                secondlvlMenu.items = secondlvlMenu.items.filter(a => submenuIds.indexOf(a.id) > -1);
                this.accesibleItems[i].items.push(
                  secondlvlMenu
                );
              });
              this.accesibleItems[i].items = R.sortBy(R.prop('sortId'), this.accesibleItems[i].items);

            } catch (error) {
              console.error(`Error processing Submenu `, error);
            }
          } else {
            delete this.accesibleItems[this.accesibleItems.length - 1].items;
          }
        }
      }

      this.accesibleItems = R.sortBy(R.prop('sortId'), this.accesibleItems);
      debugger
    } catch (error) {
      console.error('Error on filterMainmenu', error);

    }
  }
  public isChildrenExist(menuid: any) {
    let children = [];
    children = this.Permissions.filter(m => m.id.split('_')[0] === menuid.split('_')[0]).map(m => m.id);
    return children;

  }
  public getUserdetails(): any {
    const userdetails = localStorage.getItem('Userdetails');
    if (userdetails === undefined || userdetails === null) {
      return {};
    }
    return JSON.parse(userdetails);
  }
  getPermissions() {
    const details = { userId: this.userDetails.userId, organisationId: this.userDetails.orgCode, locationId: this.userDetails.orgOfficeCode };
    this.userService.getMenuPermissions(details)
      .subscribe(res => {
        this.Permissions = Object.assign([], res);
        if (res && res.length > 0) {
          this.filterMainmenu();
        }
      }, err => {
        console.error('error on getMenuPermissions', err);
      });
  }
  ngOnDestroy() {
    this.clear();
  }
}


