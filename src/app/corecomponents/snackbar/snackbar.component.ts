import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
@Component({
  selector: 'app-snackbar',
  templateUrl: 'snackbar.component.html',
  styleUrls: ['snackbar.component.css']
})
export class SnackBarComponent {
  open = false;
constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
  dataval: any =  this.data;
}
