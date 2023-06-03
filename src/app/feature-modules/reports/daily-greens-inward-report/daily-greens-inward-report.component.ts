import { Component, OnInit } from '@angular/core';
import { InWardReportService } from './in-ward-report.service';
import moment from 'moment';
import { HarvestArea } from '../../agri-management/transactions/sowing-farmer-details/sowing-farmer-details.model';
import { SowingFarmerDetailsService } from '../../agri-management/transactions/sowing-farmer-details/sowing-farmer-details.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InwardDetailRequest } from './daily-greens-inward-report.model';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

declare let jsPDF;
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
  selector: 'app-daily-greens-inward-report',
  templateUrl: './daily-greens-inward-report.component.html',
  styleUrls: ['./daily-greens-inward-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DailyGreensInwardReportComponent implements OnInit {
  userDetails: any;
  document: any;
  constructor(private service: InWardReportService,
    private readonly formBuilder: FormBuilder,
    private areas: SowingFarmerDetailsService,
    private alertService: AlertService,
    public authService: AuthenticationService) {
    this.inwardDetailRequest = new InwardDetailRequest();
  }
  harvestAreas: Array<HarvestArea>;
  formSummaryReport: FormGroup;
  inwardDetailRequest: InwardDetailRequest;
  ngOnInit() {

    this.formSummaryReport = this.formBuilder.group({
      summaryDate: ['', [Validators.required]],
      areaName: ['', [Validators.required]],
      ownAgent: ['', [Validators.required]]
    });
    // this.formSummaryReport.controls.ownAgent.setValue("1");
    this.getHarvestAreaList();
  }

  getDate(date: Date) {
    return date['_i'].year + '-' + (date['_i'].month + 1) + '-' + date['_i'].date;
  };
  onSubmit() {
    if (this.formSummaryReport.invalid) {
      this.alertService.error("Please select mandatory Fields");
    }
    this.inwardDetailRequest.AreaId = this.formSummaryReport.controls.areaName.value.areaId;
    this.inwardDetailRequest.SelectedDate = this.getDate(this.formSummaryReport.controls.summaryDate.value);
    this.inwardDetailRequest.OwnAgent = this.formSummaryReport.controls.ownAgent.value;

    this.service.getReport(this.inwardDetailRequest).subscribe(
      (dataRequest: any) => {

        if (dataRequest && dataRequest.IsSucceed && dataRequest.Data) {
          let data = dataRequest.Data;
          var doc = new jsPDF();

          const listOne = [];

          listOne['Date'] = data.SelectedDate;
          listOne['Received from'] = data.SelectedLabel;
          listOne['No. of Trucks '] = data.TotalRows;
          listOne['Total No. of Crates'] = data.SumOfCrates;

          const listTwo = [];
          listTwo['Area Name'] = data.AreaName;
          listTwo['Total Qty Dispatched'] = "PENDING";
          listTwo['Total Qty Received '] = data.SumOfTotalQuantity;
          listTwo['Quantity Difference'] = "PENDING";

          doc.text(data.OrganisationName, 10, 12);
          doc.setFontSize(12);
          if (this.formSummaryReport.controls.ownAgent.value == "1") {
            doc.text(50, 20, "DAILY GREENS RECEIVING REPORT - Own Crop");
          } else {
            doc.text(50, 20, "DAILY GREENS RECEIVING REPORT - Agent Crop");
          }

          doc.setFontSize(10);
          let count = 35;
          Object.entries(listOne).forEach(([key, value]) => {
            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.setTextColor(195, 195, 195);
            doc.text(15, count, key.trim().toUpperCase());
            doc.text(57, count, ':');
            doc.setFont('normal');
            doc.setFontType('normal');
            doc.setTextColor(0, 0, 0);
            if (!value) {
              value = 'No Data';
            }
            doc.text(59, count, value.toString().trim().toUpperCase());
            count = count + 7;
          });

          let count2 = 35;
          Object.entries(listTwo).forEach(([key, value]) => {
            doc.setFont('helvetica');
            doc.setFontType('bold');
            doc.setTextColor(195, 195, 195);
            doc.text(110, count2, key.trim().toUpperCase());
            doc.text(158, count2, ':');
            doc.setFont('normal');
            doc.setFontType('normal');
            doc.setTextColor(0, 0, 0);
            if (!value) {
              value = 'No Data';
            }
            doc.text(160, count2, value.toString().trim().toUpperCase());
            count2 = count2 + 7;
          });

          this.userDetails = this.authService.getUserdetails();

          let i; let j;
          let pageNumber = 2;
          const gridSplitData = data.GridData.slice(0, 36);
          const length = data.GridData.length - 37;
          doc.autoTable({
            startY: count + 3,
            theme: 'grid',
            head: [data.ColumnsName],
            body: gridSplitData,
            styles: { fontSize: 5 }
          });

          doc.text(10, 285, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
          doc.text(180, 285, 'page 1');

          let chunk = 44;
          if (length > 0) {
            for (i = 36, j = data.GridData.length; i < j; i += chunk) {

              doc = doc.addPage();

              doc.page = pageNumber;
              const gridSplitData = data.GridData.slice(i, i + chunk);

              doc.autoTable({
                startY: 20,
                theme: 'grid',
                head: [data.ColumnsName],
                body: gridSplitData,
                styles: { fontSize: 5 }
              });

              doc.text(10, 285, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
              doc.text(180, 285, 'page ' + pageNumber);
              pageNumber++;
            }
          }
          this.document = doc;
        } else {
          this.alertService.error('No Data Found');
        }

      }
      , error => {
        this.alertService.error('Something went wrong');
      });
  }
  printClick() {
    if (this.document) {
      const doc = this.document;
      doc.autoPrint();
      const hiddFrame = document.createElement('iframe');
      hiddFrame.style.position = 'fixed';
      hiddFrame.style.width = '1px';
      hiddFrame.style.height = '1px';
      hiddFrame.style.opacity = '0.01';
      const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
      if (isSafari) {
        // fallback in safari
        hiddFrame.onload = () => {
          try {
            hiddFrame.contentWindow.document.execCommand('print', false, null);
          } catch (e) {
            hiddFrame.contentWindow.print();
          }
        };
      }
      hiddFrame.src = doc.output('bloburl');
      document.body.appendChild(hiddFrame);
    } else {
      this.alertService.error('No Data Found');
    }
  }
  exportClick() {
    if (this.document) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
      const day = date.getDate();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const secconds = date.getSeconds();

      const seedatetime = month + '.' + day + '.' + year + ' - ' + hour + ':' + minutes + ':' + secconds;


      this.document.save('DAILY_GREENS_RECEIVING_REPORT' + seedatetime + '.pdf');
    } else {
      this.alertService.error('No Data Found');
    }
  }
  clear() {
    this.formSummaryReport.reset();
    // this.formSummaryReport.controls.ownAgent.setValue("1");
    this.document = null;
  }
  getHarvestAreaList() {
    this.areas.getHarvestAreaList().subscribe(
      data => {
        this.harvestAreas = data;
      },
      error => {
        this.alertService.error('Error While Loading Areas');
      }
    );
  }

}
