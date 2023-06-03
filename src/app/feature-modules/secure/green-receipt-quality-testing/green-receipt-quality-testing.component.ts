import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ActionParams } from './../../../shared/components/ng-grid/grid.models';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { GreenReceiptQualityTestingService } from './green-receipt-quality-testing.service';


@Component({
  selector: 'app-green-receipt-quality-testing',
  templateUrl: './green-receipt-quality-testing.component.html',
  styleUrls: ['./green-receipt-quality-testing.component.css']
})
export class GreenReceiptQualityTestingComponent implements OnInit, AfterViewInit {
  inwardGrid: any[];
  greenRecpDetailsGrid: any[];
  actionParams: ActionParams;
  OrgOfficeNo: any;
  index = 0;
  organisationUnitList: any;
  inwardGridData: any;
  greenRecpDetailsGridData: any;
  @ViewChild('grid2', { read: ElementRef, static: false }) elem: any;
  inwardGridSelectedRow: any;
  greenRecpDetailsGridSelectedRow: any;
  actionButtonStatus = {
    Next: true
  };
  constructor(private greenReceiptQualityTestingService: GreenReceiptQualityTestingService, private datePipe: DatePipe,
    // tslint:disable-next-line:align
    private renderer: Renderer2) {

  }


  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
    this.setStyleToGreenRecpGrid();
  }


  setStyleToGreenRecpGrid() {
    if (this.elem.nativeElement.getElementsByTagName('td').length > 0) {
      for (const el of this.elem.nativeElement.getElementsByTagName('td')) {
        if (el.textContent === 'Received & In Process') {
          this.renderer.setStyle(el.parentNode, 'background-color', '#f0f8ff');
        }
      }
    }
  }

  initData() {
    this.inwardGrid = [
      { field: 'inwardDateTime', header: 'IGP Date' },
      { field: 'inwardGatePassNo', header: 'IGP No' },
      { field: 'areaName', header: 'Area / Branch Name' },
      { field: 'invVehicleNo', header: 'Vehicle No' }
    ];

    this.greenRecpDetailsGrid = [
      { field: 'siNo', header: 'SI. No' },
      { field: 'harvestGrnDate', header: 'GRN Date' },
      { field: 'harvestGRNNo', header: 'GRN No' },
      { field: 'areaName', header: 'Area Name' },
      { field: 'vehicalNo', header: 'Vehicle No' },
      { field: 'cropName', header: 'Crop Name' },
      { field: 'harvestGRNTotalQty', header: 'Quantity' },
      { field: 'status', header: 'Status' }
    ];

    this.actionParams = { enabled: true, showRadiobutton: true };
    this.greenQualityCheck();
  }

  inwardGridSelectedRowEvent(event: any) {
    this.inwardGridSelectedRow = event.data;
    this.greenRecpDetailsGridData.map(d => {
      d.status = event.data.inwardGatePassNo && d.harvestGRNNo === event.harvestGRNNo ? 'Received & In Process' : 'Process not started';
    });
    this.setStyleToGreenRecpGrid();
  }

  populateGrids() {
    if (this.OrgOfficeNo) {
      forkJoin(this.greenReceiptQualityTestingService.getGreenRecpetionDetails(this.OrgOfficeNo),
        this.greenReceiptQualityTestingService.getInwardDetails(this.OrgOfficeNo),
        this.greenReceiptQualityTestingService.getAllAreas(),
        this.greenReceiptQualityTestingService.getAllCrops()
      ).subscribe((data: any) => {
        if (data) {
          this.inwardGridData = data[1];
          if (this.inwardGridData) {
            this.inwardGridData.map(d => {
              d.invoiceDCDate = this.datePipe.transform(d.invoiceDCDate, 'dd-MMM-yyyy');
              d.inwardDateTime = this.datePipe.transform(d.inwardDateTime, 'dd-MMM-yyyy');
              d.areaName = data[2].find(el => el.areaId === d.areaId).areaName;
            });
          }
          if (data[0]) {
            this.greenRecpDetailsGridData = data[0];
            let index = 1;
            this.greenRecpDetailsGridData.map(d => {
              d.siNo = index;
              d.harvestGrnValidDate = d.harvestGrnDate;
              d.harvestGrnDate = this.datePipe.transform(d.harvestGrnDate, 'dd-MMM-yyyy');
              var area = data[2].find(el => el.areaId === d.areaId);
              if (area) {
                d.areaName = area.areaName;
              }
              var crop = data[3].find(o => o.CropCode === d.cropNameCode);
              if (crop) {
                d.cropName = crop.Name;
              }
              index++;
            });
          }
        }
      });
    }
  }


  greenQualityCheck() {
    this.greenReceiptQualityTestingService.getAllUnit().subscribe((data: any) => {
      this.organisationUnitList = data;
    });
  }

  openNext() {
    this.index = (this.index === 1) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 1 : this.index - 1;
  }

  greenRecpDetailsGridSelectedRowEvent(event) {
    this.greenRecpDetailsGridSelectedRow = event.data;
    this.actionButtonStatus.Next = false;
  }

  inwardGridRowUnSelectedEvent(event) {
    this.inwardGridSelectedRow = null;
  }

  greenRecpDetailsGridRowUnSelectedEvent(event) {
    this.greenRecpDetailsGridSelectedRow = null;
    this.actionButtonStatus.Next = true;
  }

 //delete the item once saved 
  getUpdatedvalue(event){
    if(event === true){
      if(this.inwardGridSelectedRow){
      this.inwardGridData = this.inwardGridData.filter(emp => emp.inwardGatePassNo != this.inwardGridSelectedRow.inwardGatePassNo);
      }

      if(this.greenRecpDetailsGridSelectedRow){
      this.greenRecpDetailsGridData = this.greenRecpDetailsGridData.filter(emp => emp.harvestGRNNo != this.greenRecpDetailsGridSelectedRow.harvestGRNNo);
      }
    }
  }

}
