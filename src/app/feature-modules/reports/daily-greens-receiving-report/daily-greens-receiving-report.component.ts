import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { SowingFarmerDetailsService } from '../../agri-management/transactions/sowing-farmer-details/sowing-farmer-details.service';
import { HarvestArea } from '../../agri-management/transactions/sowing-farmer-details/sowing-farmer-details.model';
import { DialyGreensService } from './dialy-greens.service';
import { BuyersInfo } from './daily-greens-model';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import moment from 'moment';
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
  selector: 'app-daily-greens-receiving-report',
  templateUrl: './daily-greens-receiving-report.component.html',
  styleUrls: ['./daily-greens-receiving-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class DailyGreensReceivingReportComponent implements OnInit {
  formDialyBuyerWiseReport: FormGroup;
  formSummaryReport: FormGroup;
  harvestAreas: Array<HarvestArea>;
  buyers: Array<BuyersInfo>;
  seasons: Array<BuyersInfo>;
  maintianBuyers: Array<BuyersInfo>;
  document: any;
  userDetails: any;
  selectTabFirst = true;
  constructor(private readonly formBuilder: FormBuilder,
    private alertService: AlertService,
    private areas: SowingFarmerDetailsService,
    private greensService: DialyGreensService,
    public authService: AuthenticationService) {
    this.formDialyBuyerWiseReport = this.formBuilder.group({
      radio: [''],
      dialydate: [''],
      areaName: [''],
      buyerName: [''],
      seasons: ['']
    });

    this.formSummaryReport = this.formBuilder.group({
      radio: [''],
      summaryDate: ['', [Validators.required]],
      areaName: ['', [Validators.required]],
      vehicleNo: ['', [Validators.required]],
    });
    //this.downloadPdf();
    this.getHarvestAreaList();
  }
  buyerWiseBuyerChange() {
    this.greensService.getDataForBuyersReports(this.formDialyBuyerWiseReport.controls.buyerName.value).subscribe(
      (data: any) => {
        if (data && data.Data && data.Data.ColumnsName) {
          this.downloadPdf(data.Data);
          console.log(data);
        } else {
          this.document = null;
          this.alertService.error('No Data Found');
        }
      },
      error => {
        this.alertService.error('Error While Loading Data');
      }
    );
  }
  clear() {
    //this.formDialyBuyerWiseReport.reset();
    this.formSummaryReport.reset();
    this.document = null;
    this.buyers = [];
    this.selectTabFirst = true;
    this.formDialyBuyerWiseReport.controls.dialydate.reset();

    this.formDialyBuyerWiseReport.controls.areaName.reset();

    this.formDialyBuyerWiseReport.controls.buyerName.reset();
    this.formDialyBuyerWiseReport.controls.seasons.reset();
  }
  exportPdf() {
    if (this.document) {
      if (this.formDialyBuyerWiseReport.controls.dialydate.value &&
        this.formDialyBuyerWiseReport.controls.areaName.value &&
        this.formDialyBuyerWiseReport.controls.buyerName.value) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
        const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const secconds = date.getSeconds();

        const seedatetime = month + '.' + day + '.' + year + ' - ' + hour + ':' + minutes + ':' + secconds;


        this.document.save('DialyBuyersReport' + seedatetime + '.pdf');
      } else {
        this.alertService.error('Select mandatory fields');
      }
    }

  }
  downloadPdf(data: any) {
    var doc = new jsPDF();

    const listOne = [];
    let selectedDate = this.formDialyBuyerWiseReport.controls.dialydate.value._i;
    listOne['Date'] = selectedDate.year + '-' + (selectedDate.month + 1) + '-' + selectedDate.date;
    let areaName = this.formDialyBuyerWiseReport.controls.areaName.value;
    listOne['Area Name'] = areaName.areaName;
    let dataSelectedBuyer: BuyersInfo = this.formDialyBuyerWiseReport.controls.buyerName.value;
    listOne['Start Time'] = dataSelectedBuyer.TimeOdDispatch;
    listOne['End Time'] = dataSelectedBuyer.HarvestEndingTime;
    listOne['Duration'] = dataSelectedBuyer.HarvestTimeDuration;
    listOne['Crop Name'] = data.CropNameDetail ? data.CropNameDetail.Name : 'No Data';
    listOne['Season'] = data.PlantationDate;


    const listTwo = [];
    listTwo['Buyer Name'] = dataSelectedBuyer.EmployeeName;
    listTwo['Helper Name'] = data.HelperNameFirst;
    listTwo['Helper Name-2'] = data.HelperNameSecond;
    if (data.VehicleInfo) {
      listTwo['Vehicle No'] = data.VehicleInfo ? data.VehicleInfo.vehicleRegNumber : 0;
    } else if (data.VehicleInfo2) {
      listTwo['Vehicle No'] = data.VehicleInfo2 ? data.VehicleInfo2.vehicleRegNumber : 0;
    } else {
      listTwo['Vehicle No'] = 0;
    }
    listTwo['Driver Name'] = data.DriverName;
    listTwo['Destination'] = data.OrganisationDetail.orgOfficeName;
    // doc.setFontType('bold');
    doc.text(data.Organisation.organisationName, 10, 12);
    doc.setFontSize(12);
    doc.text(50, 20, 'DAILY GREENS RECEIVING REPORT - BUYER WISE');

    doc.setFontSize(10);
    let count = 35;
    Object.entries(listOne).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(15, count, key.trim().toUpperCase());
      doc.text(45, count, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(47, count, value.toString().trim().toUpperCase());
      count = count + 7;
    });

    let count2 = 35;
    Object.entries(listTwo).forEach(([key, value]) => {
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setTextColor(195, 195, 195);
      doc.text(110, count2, key.trim().toUpperCase());
      doc.text(146, count2, ':');
      doc.setFont('normal');
      doc.setFontType('normal');
      doc.setTextColor(0, 0, 0);
      if (!value) {
        value = 'No Data';
      }
      doc.text(148, count2, value.toString().trim().toUpperCase());
      count2 = count2 + 7;
    });



    doc.autoTable({
      startY: count + 3,
      theme: 'grid',
      head: [data.ColumnsName],
      body: data.GridData
    });
    this.userDetails = this.authService.getUserdetails();

    doc.text(10, 290, (this.userDetails.userName ? this.userDetails.userName : 'GherkinUI'));
    doc.text(180, 290, 'page ' + 1);
    this.document = doc;
  }

  printbtnClick() {
    if (this.formDialyBuyerWiseReport.controls.dialydate.value &&
      this.formDialyBuyerWiseReport.controls.areaName.value &&
      this.formDialyBuyerWiseReport.controls.buyerName.value) {
      this.printPdf();
    } else {
      this.alertService.error('Select mandatory fields');
    }
  }

  dateChange() {
    this.formDialyBuyerWiseReport.controls.areaName.reset();
    this.formDialyBuyerWiseReport.controls.buyerName.reset();
    this.buyers = [];
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

  ngOnInit() {
  }

  buyerWiseAreaChange() {
    this.seasons = [];
    this.buyers = [];
    if (this.formDialyBuyerWiseReport.controls.dialydate.value) {
      this.getBuyers();
    } else {
      this.formDialyBuyerWiseReport.controls.areaName.reset();
      this.alertService.error('Select Date First');
    }
  }

  handleChange(event: any) {
    if (event.target.value === '1') {
      this.formSummaryReport.reset();
    } else {
      this.formDialyBuyerWiseReport.reset();
    }
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
  getSeasons(data: BuyersInfo[]) {
    const unique = [...new Set(data.map(item => item.PsNumber))];

    const distinctThings = data.filter(
      (thing, i, arr) => arr.findIndex(t => t.PsNumber === thing.PsNumber) === i
    );

    const newValues = distinctThings.forEach(element => {
      let fromDate = moment(element.SeasonFrom).format('DD-MMM-YYYY');
      let toDate = moment(element.SeasonTo).format('DD-MMM-YYYY');
      element.FromToDate = fromDate + ' / ' + toDate;
    });
    this.seasons = distinctThings;
    console.log(distinctThings);

  }
  seasonsChange(data: any) {
    this.filterBuyers(data.value, this.maintianBuyers);
  }

  filterBuyers(data: BuyersInfo, fullData: BuyersInfo[]) {
    let filterData = fullData.filter(function (x) {
      if (x.PsNumber === data.PsNumber) {
        return x;
      }
    });
    const distinctThings = filterData.filter(
      (thing, i, arr) => arr.findIndex(t =>
        t.GreensProcurementNo === thing.GreensProcurementNo && t.BuyerEmployeeId === thing.BuyerEmployeeId) === i
    );
    this.buyers = distinctThings;
    console.log(distinctThings);
  }
  getBuyers() {
    this.greensService.getBuyers(this.formDialyBuyerWiseReport.controls.dialydate.value,
      this.formDialyBuyerWiseReport.controls.areaName.value).subscribe(
        (data: any) => {
          if (data.IsSucceed && data.Data && data.Data.length > 0) {
            this.getSeasons(data.Data);
            this.maintianBuyers = data.Data;
          } else {
            this.alertService.error('Buyers Not Found');
          }
        },
        error => {
          this.alertService.error('Something Went Wrong');
        }
      );
  }
}

