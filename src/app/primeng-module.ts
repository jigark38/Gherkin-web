import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
    declarations: [
    ],
    imports: [
        AutoCompleteModule,
        AccordionModule,
        ButtonModule,
        CardModule,
        CalendarModule,
        ConfirmDialogModule,
        DropdownModule,
        PanelMenuModule,
        TableModule,
        TabViewModule,
        InputMaskModule,
        FieldsetModule,
        MultiSelectModule,
        ToastModule,
        KeyFilterModule,
        InputTextModule,
        PasswordModule,
        PaginatorModule
    ],
    exports: [
        AutoCompleteModule,
        PanelMenuModule,
        TableModule,
        TabViewModule,
        CalendarModule,
        ConfirmDialogModule,
        MultiSelectModule,
        ButtonModule,
        DropdownModule,
        InputMaskModule,
        FieldsetModule,
        ToastModule,
        AccordionModule,
        KeyFilterModule,
        InputTextModule,
        PasswordModule,
        CardModule,
        PaginatorModule
    ]
})
export class PrimengModule { }
