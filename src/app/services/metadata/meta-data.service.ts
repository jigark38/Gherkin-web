import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MasterData } from './MasterData';
import { TypeList } from './typelist.modal';
import { deserialize } from 'serializer.ts/Serializer';



@Injectable({
  providedIn: 'root'
})
export class MetaDataService {

  private menuList: TypeList;

  constructor(private http: HttpClient) {
    this.http = http;
    this.menuList = new TypeList();
  }

  public getMenuList() {
    this.menuList.name = 'menulist';
    this.menuList.typeCodes = [
      {
        label: MasterData.Menu.MENU_ITEMS.menuItemTitle1.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.menuItemTitle1.routing.toString(),
      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu2.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu2.routing.toString(),
      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu3.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu3.routing.toString(),
      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu4.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu4.routing.toString(),

      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu5.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu5.routing.toString(),

      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu6.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu6.routing.toString(),

      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu7.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu7.routing.toString(),

      }
      ,
      {
        label: MasterData.Menu.MENU_ITEMS.submenu8.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu8.routing.toString(),

      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu9.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu9.routing.toString(),

      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu10.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu10.routing.toString(),

      },
      {
        label: MasterData.Menu.MENU_ITEMS.submenu11.value.toString(),
        routing: MasterData.Menu.MENU_ITEMS.submenu11.routing.toString(),

    },
    {
      label: MasterData.Menu.MENU_ITEMS.submenu12.value.toString(),
      routing: MasterData.Menu.MENU_ITEMS.submenu12.routing.toString(),

    },
    {
      label: MasterData.Menu.MENU_ITEMS.submenu13.value.toString(),
      routing: MasterData.Menu.MENU_ITEMS.submenu13.routing.toString(),

    },
    {
      label: MasterData.Menu.MENU_ITEMS.submenu14.value.toString(),
      routing: MasterData.Menu.MENU_ITEMS.submenu14.routing.toString(),

    },
    {
      label: MasterData.Menu.MENU_ITEMS.submenu15.value.toString(),
      routing: MasterData.Menu.MENU_ITEMS.submenu15.routing.toString(),

    }

    ];
    return this.menuList;
  }
}
