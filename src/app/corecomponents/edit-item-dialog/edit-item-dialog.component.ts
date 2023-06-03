import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-edit-item-dialog',
    templateUrl: 'edit-item-dialog.component.html',
    styleUrls: ['edit-item-dialog.component.css']
})
export class EditItemDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<EditItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string) {
        this.itemText = data;
    }

    itemText = '';
    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick() {
        this.dialogRef.close(this.itemText);
    }
}
