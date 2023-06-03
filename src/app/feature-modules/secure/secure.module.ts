import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatTreeModule } from '@angular/material';

import { AccountMasterComponent } from './account-master/account-master.component';
import { BankAccountDetailsComponent } from './bank-account-details/bank-account-details.component';
import { BatchProdPrepDetComponent } from './batch-prod-prep-det/batch-prod-prep-det.component';
import { CommonModule } from '@angular/common';
import { ConsigneeBuyersComponent } from './Sales-CRM/consignee-buyers/consignee-buyers.component';
import { CullingPackDetailsComponent } from './culling-pack-details/culling-pack-details.component';
import { DailyHarvestDetailsComponent } from './daily-harvest-details/daily-harvest-details.component';
import { DialogModule } from 'primeng/dialog';
import { FeedandInputTransferComponent } from './feedand-input-transfer/feedand-input-transfer.component';
import { GoodsReceiptNoteComponent } from './goods-receipt-note/goods-receipt-note.component';
import { GradingWeightmentDetailsComponent } from './grading-weightment-details/grading-weightment-details.component';
import { GreenReceiptQualityCheckDetailTestingComponent } from './green-receipt-quality-testing/green-receipt-quality-check-detail-testing/green-receipt-quality-check-detail-testing.component';
import { GreenReceiptQualityTestingComponent } from './green-receipt-quality-testing/green-receipt-quality-testing.component';
import { HarvestGrnReceivingWeightmentComponent } from './harvest-grn-receiving-weightment/harvest-grn-receiving-weightment.component';
import { HttpClientModule } from '@angular/common/http';
import { IndentMaterialDetailsComponent } from './indent-material-details/indent-material-details.component';
import { InwardGatePassComponent } from './inward-gate-pass/inward-gate-pass.component';
import { InwardSearchComponent } from './inward-gate-pass/inward-search/inward-search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTranToAreaOfficeOgpComponent } from './mat-tran-to-area-office-ogp/mat-tran-to-area-office-ogp.component';
import { MediaBatchDetailsComponent } from './media-batch-details/media-batch-details.component';
import { MomentUtcDateAdapter } from '../../corecomponents/datePickerformat/moment-utc-date-adapter';
import { NewPoComponent } from './new-po/new-po.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { NgModule } from '@angular/core';
import { PlantationSchedulingComponent } from '../agri-management/transactions/plantation-scheduling/plantation-scheduling.component';
import { ProductAddComponent } from './product-add/product-add.component';
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
import { SecureRoutingModule } from './routing-secure';
import { SharedModule } from '../../shared.module';
import { SuppliersDetailsComponent } from './suppliers-details/suppliers-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { PopDialogComponent } from './production-process-bom-details/pop-dialog/pop-dialog.component';
import { OwnVehicleDetailsComponent } from './own-vehicle-details/own-vehicle-details.component';
import { HiredVehicleDetailsComponent } from './hired-vehicle-details/hired-vehicle-details.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { from } from 'rxjs';
import { MathcesFarmerPipe } from 'src/app/shared/pipes/matchesFarmer.pipe';
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
import { ReceivedMaterialPopupComponent } from './goods-receipt-note/received-material-popup/received-material-popup.component';
import { MonthlyAttendanceReportComponent } from './monthly-attendance-report/monthly-attendance-report.component';
// tslint:disable-next-line: max-line-length
@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
  ],
  declarations: [
    FeedandInputTransferComponent,

    RawMaterialStocksComponent,
    ProductionUnitDetailsComponent,
    SuppliersDetailsComponent,
    RawMaterialMasterComponent,
    RawMaterialGroupComponent,
    ProductAddComponent,
    PurchaseOrderComponent,
    NewPoComponent,
    ConsigneeBuyersComponent,
    IndentMaterialDetailsComponent,
    ProductGradeDetailsComponent,
    UserPermissionComponent,
    AccountMasterComponent,
    RawMaterialBranchStocksComponent,
    BankAccountDetailsComponent,
    InwardGatePassComponent,
    GoodsReceiptNoteComponent,
    ProformaInvoiceComponent,
    PurchaseReturnComponent,
    InwardSearchComponent,
    MatTranToAreaOfficeOgpComponent,
    DailyHarvestDetailsComponent,
    HarvestGrnReceivingWeightmentComponent,
    GreenReceiptQualityTestingComponent,
    GradingWeightmentDetailsComponent,
    ProductionProcessBomDetailsComponent,
    ProductionScheduleDetailsComponent,
    BatchProdPrepDetComponent,
    MediaBatchDetailsComponent,
    CullingPackDetailsComponent,
    GreenReceiptQualityCheckDetailTestingComponent,
    FilterPipe,
    PopDialogComponent,
    OwnVehicleDetailsComponent,
    HiredVehicleDetailsComponent,
    DriverDetailsComponent,
    StoresMasterDetailsComponent,
    FinishedSemifinishedOpeningStocksComponent,
    MaterialIndentByDepartmentsComponent,
    MaterialIndentByStoresToPurchaseDepartmentsComponent,
    StoreConsumpitonAndIssuesComponent,
    StoreQuotationComponent,
    StoresGRNComponent,
    StoresInwardRegisterComponent,
    StoresPurchaseReturnComponent,
    StoresPurchaseOrderComponent,
    GreensAgentSupplierDetailsComponent,
    AgentsGreensReceivingWeighmentComponent,
    ReceivedMaterialPopupComponent,
    // MonthlyAttendanceReportComponent,

  ],
  imports: [
    SecureRoutingModule,
    MatProgressSpinnerModule,
    TranslateModule,
    Ng2CompleterModule,
    MatAutocompleteModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
  ],
  entryComponents: [InwardSearchComponent, PopDialogComponent, ReceivedMaterialPopupComponent]
})

export class SecureModule { }

