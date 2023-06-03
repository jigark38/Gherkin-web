import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DailyGreensComponent } from './daily-greens/daily-greens.component';
import { ProcessedComponent } from './processed/processed.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { PackedInventoryComponent } from './packed-inventory/packed-inventory.component';

@NgModule({
  declarations: [HomeComponent, DailyGreensComponent, ProcessedComponent, PendingOrdersComponent, PackedInventoryComponent],
  imports: [
    SharedModule,
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
