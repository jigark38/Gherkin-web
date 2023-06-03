import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GreenReceivedSummaryService } from './green-received-summary.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MaterialGroup, MaterialName, Seasons, ReportSummaryOption } from './green-received-summary-report.model';
import moment from 'moment';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
declare let jsPDF;
@Component({
  selector: 'app-green-received-summary-report',
  templateUrl: './green-received-summary-report.component.html',
  styleUrls: ['./green-received-summary-report.component.css']
})
export class GreenReceivedSummaryReportComponent implements OnInit {
  greenReceivedForm: FormGroup;
  materialGroup: Array<MaterialGroup>;
  materialName: Array<MaterialName>;
  seasons: Array<Seasons>;
  document: any;
  userDetails: any;
  constructor(private greenReceivedSummaryService: GreenReceivedSummaryService,
    private alertService: AlertService,
    private readonly formBuilder: FormBuilder,
    public authService: AuthenticationService) { }

  ngOnInit() {

    this.greenReceivedForm = this.formBuilder.group({
      seasons: [''],
      materialGroup: [''],
      materialName: [''],
      fromDate: [''],
      toDate: ['']
    });

    this.getMaterialGroup();
    this.getSeasonFromTo();
  }

  getSeasonFromTo() {
    this.greenReceivedSummaryService.getSeasonFromTo().subscribe(
      (data: any) => {
        if (data.IsSucceed && data.Data && data.Data.length > 0) {
          this.seasons = data.Data;
        } else {
          this.alertService.error('No Seasons Found');
        }
      },
      error => {
        this.alertService.error('Something Went Wrong');
      }
    );
  }

  getMaterialName() {
    this.greenReceivedSummaryService.getMaterialName(this.greenReceivedForm.controls.materialGroup.value.CropGroupCode).subscribe(
      (data: any) => {
        if (data.IsSucceed && data.Data && data.Data.length > 0) {
          this.materialName = data.Data;
        } else {
          this.alertService.error('Material Name not found');
        }
      },
      error => {
        this.alertService.error('Material Name not found');
      }
    );
  }

  clear() {
    this.document = null;
    this.materialName = null;
    this.greenReceivedForm.controls.fromDate.reset();
    this.greenReceivedForm.controls.toDate.reset();
    this.greenReceivedForm.controls.seasons.reset();
    this.greenReceivedForm.controls.materialGroup.reset();
    this.greenReceivedForm.controls.materialName.reset();
  }

  printbtnClick() {
    if (this.greenReceivedForm.controls.fromDate.value &&
      this.greenReceivedForm.controls.toDate.value &&
      this.greenReceivedForm.controls.seasons.value
      &&
      this.greenReceivedForm.controls.materialGroup.value
      && this.greenReceivedForm.controls.materialName.value) {
      this.printPdf();
    } else {
      this.alertService.error('Select mandatory fields');
    }
  }

  exportReport() {
    if (this.greenReceivedForm.controls.fromDate.value &&
      this.greenReceivedForm.controls.toDate.value &&
      this.greenReceivedForm.controls.seasons.value
      &&
      this.greenReceivedForm.controls.materialGroup.value
      && this.greenReceivedForm.controls.materialName.value) {

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
      const day = date.getDate();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const secconds = date.getSeconds();

      const seedatetime = month + '.' + day + '.' + year + ' - ' + hour + ':' + minutes + ':' + secconds;
      this.document.save('Report ' + seedatetime + '.pdf');
    } else {
      this.alertService.error('Select mandatory fields');
    }
  }

  printPdf() {
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
    }
  }

  toDateChange() {
    if (this.greenReceivedForm.controls.fromDate.value) {
      let fromDate = moment(this.greenReceivedForm.controls.fromDate.value).format('MM/DD/YYYY HH:mm');
      let toDate = moment(this.greenReceivedForm.controls.toDate.value).format('MM/DD/YYYY HH:mm');
      if (moment(fromDate).isSameOrAfter(toDate, 'day')) {
        this.alertService.error('Please select greater than from date or same date');
        this.greenReceivedForm.controls.toDate.reset();
        return;
      }
      if (this.greenReceivedForm.controls.seasons.value &&
        this.greenReceivedForm.controls.materialGroup.value &&
        this.greenReceivedForm.controls.materialName.value) {
        let reportSummaryOption = new ReportSummaryOption();
        reportSummaryOption.PsNumber = this.greenReceivedForm.controls.seasons.value.PsNumber;
        reportSummaryOption.CropNameCode = this.greenReceivedForm.controls.materialName.value.cropNameCode;
        reportSummaryOption.FromDate = fromDate;
        reportSummaryOption.ToDate = toDate;

        this.greenReceivedSummaryService.getReportDataOfSummary(reportSummaryOption).subscribe(
          data => {

            if (data && data.IsSucceed) {
              if (!data.Data) {
                this.alertService.error('Data Not Found');
                return;
              } else {
                this.downloadPdf(data.Data);
              }
            }
            console.log(data);
          },
          error => { }
        );

      } else {
        this.alertService.error('select all fields');
        return;
      }
    }


  }

  downloadPdf(data: any) {
    var doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Option 1 Report Summary', 10, 12);
    doc.text(data.org, 10, 20);
    doc.text(65, 25, 'GREENS RECEIVED SUMMARY REPORT');
    let f = moment(this.greenReceivedForm.controls.seasons.value.FromDate).format('DD-MM-YYYY');
    let l = moment(this.greenReceivedForm.controls.seasons.value.ToDate).format('DD-MM-YYYY');
    doc.setFontSize(10);
    doc.text(14, 40, 'Season From / To :' + f + ' / ' + l);
    let fromDate = moment(this.greenReceivedForm.controls.fromDate.value).format('DD-MM-YYYY');
    let toDate = moment(this.greenReceivedForm.controls.toDate.value).format('DD-MM-YYYY');
    doc.text(144, 40, 'Date :' + fromDate + ' To ' + toDate);
    this.userDetails = this.authService.getUserdetails();

    let i; let j;
    let pageNumber = 2;
    const gridSplitData = data.GridData.slice(0, 24);
    const length = data.GridData.length - 25;
    doc.autoTable({
      startY: 43,
      theme: 'grid',
      head: [data.ColumnsName],
      body: gridSplitData,
      styles: { fontSize: 8 }
    });

    doc.text(10, 285, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
    doc.text(180, 285, 'page 1');

    let chunk = 27;
    if (length > 0) {
      for (i = 24, j = data.GridData.length; i < j; i += chunk) {

        doc = doc.addPage();

        doc.page = pageNumber;
        const gridSplitData = data.GridData.slice(i, i + chunk);

        doc.autoTable({
          startY: 20,
          theme: 'grid',
          head: [data.ColumnsName],
          body: gridSplitData,
          styles: { fontSize: 8 }
        });

        doc.text(10, 285, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
        doc.text(180, 285, 'page ' + pageNumber);
        pageNumber++;
      }
    }
    this.document = doc;
  }
  getMaterialGroup() {

    this.greenReceivedSummaryService.getMaterialGroup().subscribe(
      (data: any) => {
        if (data.IsSucceed && data.Data && data.Data.length > 0) {
          this.materialGroup = data.Data;
        } else {
          this.alertService.error('No Material Group Found');
        }
      },
      error => {
        this.alertService.error('No Material Group Found');
      }
    );
  }
}
