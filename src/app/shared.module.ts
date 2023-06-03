import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDialogRef,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
} from '@angular/material';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';

import { AppFormulaComponent } from './shared/components/app-formula/app-formula.component';
import { AutoCompleteComponent } from './corecomponents/auto-complete/auto-complete.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CameraCaptureDialogComponent } from './corecomponents/camera-capture-dialog/camera-capture-dialog.component';
import { ConfirmationDialogComponent } from './corecomponents/confirmation-dialog/confirmation-dialog.component';
import { MessageService } from 'primeng/api';
import { ModalModule } from './corecomponents/modal/modal.module';
import { NgAlertComponent } from './ng-alert/ng-alert.component';
import { NgGridComponent } from './shared/components/ng-grid/ng-grid.component';
import { NgModule } from '@angular/core';
import { PrimengModule } from './primeng-module';
import { SHARED_DIALOG_COMPONENTS } from './shared/dialogs';
import { UpperCaseDirective } from './shared/directives/uppertext.directive';
import { EditItemDialogComponent } from './corecomponents/edit-item-dialog/edit-item-dialog.component';
import { NumericDirective } from './shared/directives/numeric.directive';
import { FivNumTwoDecimalDirective } from './shared/directives/5Num2Decimal.directive';

@NgModule({
    declarations: [
        ...SHARED_DIALOG_COMPONENTS,
        CameraCaptureDialogComponent,
        AutoCompleteComponent,
        EditItemDialogComponent,
        ConfirmationDialogComponent,
        ...SHARED_DIALOG_COMPONENTS,
        NgGridComponent,
        UpperCaseDirective,
        AppFormulaComponent,
        NgAlertComponent,
        NumericDirective,
        FivNumTwoDecimalDirective
    ],
    imports: [
        AutocompleteLibModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatListModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatNativeDateModule,
        MatRippleModule,
        MatDialogModule,
        MatIconModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        ModalModule,
        MatRadioModule,
        MatProgressBarModule,
        PrimengModule,
        MatPaginatorModule
    ],
    entryComponents: [
        ...SHARED_DIALOG_COMPONENTS,
        CameraCaptureDialogComponent,
        ConfirmationDialogComponent,
        EditItemDialogComponent
    ],
    exports: [
        AutocompleteLibModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatListModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatNativeDateModule,
        MatRippleModule,
        MatDialogModule,
        MatIconModule,
        ConfirmationDialogComponent,
        MatAutocompleteModule,
        AutoCompleteComponent,
        EditItemDialogComponent,
        CameraCaptureDialogComponent,
        ConfirmationDialogComponent,
        MatSnackBarModule,
        ModalModule,
        MatRadioModule,
        MatProgressBarModule,
        PrimengModule,
        NgGridComponent,
        UpperCaseDirective,
        AppFormulaComponent,
        NgAlertComponent,
        MatPaginatorModule,
        NumericDirective,
        FivNumTwoDecimalDirective
    ],
    providers: [DatePipe, MessageService, NumericDirective, FivNumTwoDecimalDirective, { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }],

})
export class SharedModule { }
