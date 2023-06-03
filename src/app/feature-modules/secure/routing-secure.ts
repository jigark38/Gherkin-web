import { RouterModule, Routes } from '@angular/router';

import { AccountMasterComponent } from './account-master/account-master.component';
import { AuthGuard } from './auth-gaurd';
import { BankAccountDetailsComponent } from './bank-account-details/bank-account-details.component';
import { BatchProdPrepDetComponent } from './batch-prod-prep-det/batch-prod-prep-det.component';
import { ConsigneeBuyersComponent } from './Sales-CRM/consignee-buyers/consignee-buyers.component';
import { CullingPackDetailsComponent } from './culling-pack-details/culling-pack-details.component';
import { DailyHarvestDetailsComponent } from './daily-harvest-details/daily-harvest-details.component';
import { FeedandInputTransferComponent } from './feedand-input-transfer/feedand-input-transfer.component';
import { GoodsReceiptNoteComponent } from './goods-receipt-note/goods-receipt-note.component';
import { GradingWeightmentDetailsComponent } from './grading-weightment-details/grading-weightment-details.component';
import { GreenReceiptQualityTestingComponent } from './green-receipt-quality-testing/green-receipt-quality-testing.component';
import { HarvestGrnReceivingWeightmentComponent } from './harvest-grn-receiving-weightment/harvest-grn-receiving-weightment.component';
import { IndentMaterialDetailsComponent } from './indent-material-details/indent-material-details.component';
import { InwardGatePassComponent } from './inward-gate-pass/inward-gate-pass.component';
import { ManagementDetailsComponent } from '../organisation-details/management-details/management-details.component';
import { MatTranToAreaOfficeOgpComponent } from './mat-tran-to-area-office-ogp/mat-tran-to-area-office-ogp.component';
import { MediaBatchDetailsComponent } from './media-batch-details/media-batch-details.component';
import { NewPoComponent } from './new-po/new-po.component';
import { NgModule } from '@angular/core';
import { OrganisationOfficesLocatonsDetailsComponent } from '../organisation-details/org-off-loc-details/org-ofc-loc-details.component';
import { ProductGradeDetailsComponent } from './product-grade-details/product-grade-details.component';
import { ProductionProcessBomDetailsComponent } from './production-process-bom-details/production-process-bom-details.component';
import { ProductionScheduleDetailsComponent } from './production-schedule-details/production-schedule-details.component';
import { ProductionUnitDetailsComponent } from './production-unit-details/production-unit-details.component';
import { ProformaInvoiceComponent } from './proforma-invoice/proforma-invoice.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { RawMaterialBranchStocksComponent } from './raw-material-branch-stocks/raw-material-branch-stocks.component';
import { RawMaterialGroupComponent } from './raw-material-master/raw-material-group.component';
import { RawMaterialMasterComponent } from './raw-material-master/raw-material-master.component';
import { RawMaterialStocksComponent } from './raw-material-stocks/raw-material-stocks.component';
import { SuppliersDetailsComponent } from './suppliers-details/suppliers-details.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { HiredVehicleDetailsComponent } from './hired-vehicle-details/hired-vehicle-details.component';
import { OwnVehicleDetailsComponent } from './own-vehicle-details/own-vehicle-details.component';
import { StoresMasterDetailsComponent } from './stores-master-details/stores-master-details.component';
import { FinishedSemifinishedOpeningStocksComponent } from './finished-semifinished-opening-stocks/finished-semifinished-opening-stocks.component';
import { MaterialIndentByDepartmentsComponent } from './material-indent-by-departments/material-indent-by-departments.component';
import { MaterialIndentByStoresToPurchaseDepartmentsComponent } from './material-indent-by-stores-to-purchase-departments/material-indent-by-stores-to-purchase-departments.component';
import { StoreConsumpitonAndIssuesComponent } from './store-consumpiton-and-issues/store-consumpiton-and-issues.component';
import { StoreQuotationComponent } from './store-quotation/store-quotation.component';
import { StoresGRNComponent } from './stores-grn/stores-grn.component';
import { StoresInwardRegisterComponent } from './stores-inward-register/stores-inward-register.component';
import { StoresPurchaseReturnComponent } from './stores-purchase-return/stores-purchase-return.component';
import { StoresPurchaseOrderComponent } from './stores-purchase-order/stores-purchase-order.component';
import { GreensAgentSupplierDetailsComponent } from './greens-agent-supplier-details/greens-agent-supplier-details.component';
import { AgentsGreensReceivingWeighmentComponent } from './agents-greens-receiving-weighment/agents-greens-receiving-weighment.component';


import { from } from 'rxjs';
import { RouteAllowGaurdService } from 'src/app/services/auth/route-allow.gaurd';

const routes: Routes = [
  {
    path: 'own-vehicle-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: OwnVehicleDetailsComponent,
  },
  {
    path: 'hired-vehicle-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: HiredVehicleDetailsComponent,
  },
  {
    path: 'driver-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DriverDetailsComponent,
  },
  {
    path: 'culling-pack-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: CullingPackDetailsComponent,
  },
  {
    path: 'media-batch-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: MediaBatchDetailsComponent,
  },
  {
    path: 'batch-prod-prep-det',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: BatchProdPrepDetComponent,
  },
  {
    path: 'production-schedule-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProductionScheduleDetailsComponent,
  },
  {
    path: 'grading-weightment-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: GradingWeightmentDetailsComponent
  },
  {
    path: 'production-process-bom-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProductionProcessBomDetailsComponent
  },
  {
    path: 'green-receipt-quality-testing',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: GreenReceiptQualityTestingComponent
  },
  {
    path: 'harvest-grn-receiving-weightment',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: HarvestGrnReceivingWeightmentComponent
  },
  {
    path: 'daily-harvest-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: DailyHarvestDetailsComponent
  },
  {
    path: 'mat-tran-to-area-office-ogp',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: MatTranToAreaOfficeOgpComponent
  },
  {
    path: 'proforma-invoice',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProformaInvoiceComponent,
  },
  {
    path: 'purchase-return',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: PurchaseReturnComponent,
  },
  {
    path: 'goods-receipt-note',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: GoodsReceiptNoteComponent,
  },
  {
    path: 'inward-gate-pass',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: InwardGatePassComponent,
  },
  {
    path: 'bank-account-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: BankAccountDetailsComponent
  },
  {
    path: 'raw-material-branch-stocks',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: RawMaterialBranchStocksComponent
  },
  {
    path: 'account-master',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: AccountMasterComponent
  },
  {
    path: 'user-permission',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: UserPermissionComponent
  },
  {
    path: 'indent-material',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: IndentMaterialDetailsComponent
  },
  {
    path: 'product-grade-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProductGradeDetailsComponent
  },
  {
    path: 'production-unit-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ProductionUnitDetailsComponent
  },
  {
    path: 'suppliers-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: SuppliersDetailsComponent
  },
  {
    path: 'consignee-buyers',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ConsigneeBuyersComponent
  },

  {
    path: 'raw-material-master',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: RawMaterialMasterComponent
  },
  {
    path: 'raw-material-group',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: RawMaterialGroupComponent
  },
  {
    path: 'raw-material-stocks',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: RawMaterialStocksComponent
  },
  {
    path: 'feedand-input-transfer',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: FeedandInputTransferComponent
  },
  {
    path: 'purchase-order',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: PurchaseOrderComponent
  },
  {
    path: 'new-po',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: NewPoComponent
  },
  {
    path: 'consignee-buyers',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: ConsigneeBuyersComponent
  },
  {
    path: 'stores-master-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoresMasterDetailsComponent
  },

  {
    path: 'finished-semifinished-opening-stocks',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: FinishedSemifinishedOpeningStocksComponent
  },

  {
    path: 'material-indent-by-departments',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: MaterialIndentByDepartmentsComponent
  },
  {
    path: 'material-indent-by-stores-to-purchase-departments',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: MaterialIndentByStoresToPurchaseDepartmentsComponent
  },
  {
    path: 'store-consumpiton-and-issues',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoreConsumpitonAndIssuesComponent
  },
  {
    path: 'store-quotation',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoreQuotationComponent
  },

  {
    path: 'stores-grn',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoresGRNComponent
  },

  {
    path: 'stores-inward-register',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoresInwardRegisterComponent
  },
  {
    path: 'stores-purchase-return',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoresPurchaseReturnComponent
  },
  {
    path: 'stores-purchase-order',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: StoresPurchaseOrderComponent
  },

  {
    path: 'greens-agent-supplier-details',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: GreensAgentSupplierDetailsComponent
  },

  {
    path: 'agents-greens-receiving-weighment',
    canActivate: [AuthGuard, RouteAllowGaurdService],
    component: AgentsGreensReceivingWeighmentComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule {
}

