import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddSupplierComponent } from '../shared/dialogs/add-supplier/add-supplier.component';



@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private dialog: MatDialog) {
    }
    addSuppierDialog() {
        const dialogRef = this.dialog.open(AddSupplierComponent);
        return dialogRef.afterClosed();
    }
}
