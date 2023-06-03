import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InwardGatePassService } from '../inward-gate-pass.service';
import { InwardGatePassModel } from '../inward-gate-pass.models';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-inward-search',
  templateUrl: './inward-search.component.html',
  styleUrls: ['./inward-search.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class InwardSearchComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InwardSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private inwardGatePassService: InwardGatePassService,
    private alertService: AlertService) {
    this.inwardType = data;
  }
  isNoRecordFound: boolean;
  inwardType = '';
  searchForm = new FormGroup({
    fromDate: new FormControl('', [Validators.required]),
    toDate: new FormControl('', [Validators.required]),
  });


  ngOnInit() {

  }

  searchInwardGatePass(fromDate: string, toDate: string) {
    try {
      this.inwardGatePassService.searchInwardGatePass(new Date(fromDate).toISOString(), new Date(toDate).toISOString(), this.inwardType)
        .subscribe((data: InwardGatePassModel[]) => {
          if (data && data.length > 0) {
            this.isNoRecordFound = false;
            this.dialogRef.close(data);
          } else {
            this.isNoRecordFound = true;

          }
        }, err => {
          this.isNoRecordFound = true;
          // this.alertService.error('Error has occured while fetching inward gate pass list.');
        });
    } catch (error) {

    }
  }


  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onSearch() {
    if (this.searchForm.valid) {
      const searchCriteria = { fromDate: this.searchForm.controls.fromDate.value, toDate: this.searchForm.controls.toDate.value };
      this.searchInwardGatePass(searchCriteria.fromDate, searchCriteria.toDate);

    }
  }

}
