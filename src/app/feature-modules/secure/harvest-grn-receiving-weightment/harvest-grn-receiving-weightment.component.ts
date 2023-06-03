import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HarvestGrnService } from './harvest-grn-receiving-weighment.service';
import {
  InwardDetails, ReceptionDetails, SummaryReceivingDetail, SummaryWeighmentDetails, HarvestGrnForm, ReceivingDetailList,
  WeighmentDetails
} from './harvest-grn-receiving-weighment.model';
import { MatSelect } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/corecomponents/modal/modal.service';
import { Calendar } from 'primeng/calendar/calendar';
import { timer } from 'rxjs';
import moment from 'moment';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';

@Component({
  selector: 'app-harvest-grn-receiving-weightment',
  templateUrl: './harvest-grn-receiving-weightment.component.html',
  styleUrls: ['./harvest-grn-receiving-weightment.component.css']
})
export class HarvestGrnReceivingWeightmentComponent implements OnInit {
  @ViewChild('unitNameDDL', { static: false }) unitNameDDL: MatSelect;
  @ViewChild('noOfCrates', { static: false }) noOfCrates: ElementRef;
  @ViewChild('grossWt', { static: false }) grossWt: ElementRef;
  @ViewChild('tareWt', { static: false }) tareWt: ElementRef;
  @ViewChild('netWt', { static: false }) netWt: ElementRef;
  @ViewChild('wtNo', { static: false }) wtNo: ElementRef;
  @ViewChild('saveBtn', { static: false }) saveBtn: ElementRef;
  @ViewChild('summaryKgs', { static: false }) summaryKgs: ElementRef;
  @ViewChild('summaryCrates', { static: false }) summaryCrates: ElementRef;
  @ViewChild('recTime', { static: false }) recTime: Calendar;
  showGrid = false;
  index = 0;
  timeDifference;
  showSave = false;
  employeeDetails: any;
  showNext = false;
  showBack = false;
  showModify = false;
  harvestWeighmentForm: FormGroup;
  OfficeLocations: any = [];
  selectedUnit: any;
  summaryWeighmentDetailList: Array<SummaryWeighmentDetails> = [];
  summaryWeighmentDetail: Array<SummaryWeighmentDetails> = [];
  summaryReceivingDetails: Array<SummaryReceivingDetail> = [];
  selectedSummaryRecDetail: SummaryReceivingDetail = null;
  finalSummeryRecDetail: Array<SummaryReceivingDetail> = [];
  receivingDetails: Array<ReceivingDetailList> = [];
  weighmentDetails: Array<WeighmentDetails> = [];
  inwardDetails: InwardDetails[];
  selectedInwardDetail: InwardDetails;
  selectedReceptionDetails: ReceptionDetails;
  receptionDetails: ReceptionDetails[];
  constructor(
    private harvestGrnService: HarvestGrnService, private datepipe: DatePipe,
    private modalservice: ModalService, private alertService: AlertService) { }

  ngOnInit() {
    try {
      this.getOfficeLocations();
      this.createForm();
      this.getEmployees();
    } catch (error) {
      // console.log('Error in OnInit Harvest GRN', error);
    }
  }
  getEmployees() {
    try {
      this.harvestGrnService.getEmployeeDetails().subscribe(res => {
        this.employeeDetails = res;
      }, (error) => {
        // console.log(error);
      });
    } catch (error) {
      // console.log('Error in getEmployees:', error);
    }
  }
  goBack() {
    try {
      this.index = 0;
      this.showBack = false;
      this.showNext = true;
    } catch (error) {
      // console.log('Error in navigation:', error);
    }
  }
  openNext() {
    try {
      this.index = (this.index === 1) ? 0 : this.index + 1;
      const date = new Date(this.selectedReceptionDetails.harvestGRNNo.toString() !== '0' ? this.selectedReceptionDetails.startiTime : '2020-01-01T' + this.selectedReceptionDetails.startigreenProcurementTime);
      this.populateSummaryGrid();
      this.showNext = false;
      this.showBack = true;
      // console.log(this.showNext);
      this.harvestWeighmentForm.patchValue({
        receivingUnit: this.selectedUnit.orgOfficeName,
        area: this.selectedReceptionDetails.areaName,
        receivharvestGrnDate: this.selectedReceptionDetails.harvestGRNDate,
        harvestGrnNo: this.selectedReceptionDetails.harvestGRNNo.toString() !== '0' ?
          this.selectedReceptionDetails.harvestGRNNo : this.selectedReceptionDetails.greenProcurementNo,
        vehicleNo: this.selectedReceptionDetails.veichleNo,
        startingKmReading: this.selectedReceptionDetails.startingKMs,
        timeOfDispatch: date,
        noOfCratesDispatch: this.selectedReceptionDetails.despNoOfCrates,
        totalQuantity: this.selectedReceptionDetails.harvestGRNTotalQuantity
      });
      this.calculateTotalQty();
      this.calculateTotalCrates();
    } catch (error) {
      // console.log('Error in Next navigation:', error);
    }
  }
  populateSummaryGrid() {
    // console.log(this.selectedReceptionDetails.grades);
    try {
      for (const grade of this.selectedReceptionDetails.grades) {
        const summaryReceivingDetail = new SummaryReceivingDetail();
        summaryReceivingDetail.cropSchemeCode = grade.cropSchemeCode;
        summaryReceivingDetail.grade = grade.cropGradeHeader;
        summaryReceivingDetail.despKgs = grade.cropGradeValue !== null ? +grade.cropGradeValue.split('/')[0] : null;
        summaryReceivingDetail.despCrates = grade.cropGradeValue !== null ? +grade.cropGradeValue.split('/')[1] : null;
        if (grade.cropGradeValue !== null) {
          this.summaryReceivingDetails.push(summaryReceivingDetail);
        }
      }
      // console.log(this.summaryReceivingDetails.length);
    } catch (error) {
      // console.log('Error in Summary grid:', error);
    }
  }
  createForm() {
    try {
      this.harvestWeighmentForm = new FormGroup({
        receivingUnit: new FormControl('', [Validators.required]),
        area: new FormControl('', [Validators.required]),
        supervisor: new FormControl('', [Validators.required]),
        receivharvestGrnDate: new FormControl('', [Validators.required]),
        harvestGrnNo: new FormControl('', [Validators.required]),
        vehicleNo: new FormControl('', [Validators.required]),
        startingKmReading: new FormControl('', [Validators.required]),
        timeOfDispatch: new FormControl('', [Validators.required]),
        noOfCratesDispatch: new FormControl('', [Validators.required]),
        totalQuantity: new FormControl('', [Validators.required]),
        receivingDate: new FormControl('', [Validators.required]),
        endingKm: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{0,6}$/)]),
        factoryReceiveTime: new FormControl('', [Validators.required]),
        noOfKms: new FormControl('', [Validators.required]),
        duration: new FormControl('', [Validators.required]),
        noOfCratesReceived: new FormControl('', [Validators.required]),
        totalQtyReceived: new FormControl('', [Validators.required]),
        weighmentMode: new FormControl('', [Validators.required])
      });
      this.harvestWeighmentForm.controls.receivingUnit.disable();
      this.harvestWeighmentForm.controls.area.disable();
      this.harvestWeighmentForm.controls.receivharvestGrnDate.disable();
      this.harvestWeighmentForm.controls.harvestGrnNo.disable();
      this.harvestWeighmentForm.controls.vehicleNo.disable();
      this.harvestWeighmentForm.controls.startingKmReading.disable();
      this.harvestWeighmentForm.controls.timeOfDispatch.disable();
      this.harvestWeighmentForm.controls.noOfCratesDispatch.disable();
      this.harvestWeighmentForm.controls.totalQuantity.disable();
      this.harvestWeighmentForm.controls.receivingDate.setValue(new Date());
      this.harvestWeighmentForm.controls.noOfKms.disable();
      this.harvestWeighmentForm.controls.duration.disable();
      this.harvestWeighmentForm.controls.noOfCratesReceived.disable();
      this.harvestWeighmentForm.controls.totalQtyReceived.disable();
    } catch (error) {
      // console.log('Error in create form Harvet GRN:', error);
    }
  }

  getOfficeLocations() {
    try {
      this.harvestGrnService.getOfficeLocations().subscribe(res => {
        this.OfficeLocations = res;
      }, (error) => {
        // console.log('Error while fetching get office location', error);
      });
      this.selectedInwardDetail = null;
      this.selectedReceptionDetails = null;
    } catch (error) {
      // console.log('Error in fetching office location in Harvet GRN:', error);
    }
  }
  loadGridDetails(office: any) {
    try {
      this.selectedUnit = office;
      this.loadInwardDetails(office.orgOfficeNo);
      this.loadReceptionDetails(office.orgOfficeNo);
    } catch (error) {
      // console.log('Error in load grid details in Harvet GRN:', error);
    }
  }

  loadInwardDetails(orgOfficeNo: any) {
    try {
      this.harvestGrnService.getInwardDetails(orgOfficeNo).subscribe(res => {
        this.inwardDetails = res;
      });
    } catch (error) {
      // console.log('Error in inward detail grid in Harvet GRN:', error);
    }
  }
  loadReceptionDetails(orgOfficeNo: any) {
    try {
      this.harvestGrnService.getReceptionDetails(orgOfficeNo).subscribe(res => {
        this.receptionDetails = res;
      });
    } catch (error) {
      // console.log('Error in reception detail grid in Harvet GRN:', error);
    }
  }
  radioSelected(event: any) {
    try {
      this.selectedInwardDetail = event;
      if (this.selectedReceptionDetails !== null) {
        this.showNext = true;
      }
    } catch (error) {
      // console.log('Error in inward detail selection in Harvet GRN:', error);
    }
  }
  onChecked(reception: any) {
    try {
      this.summaryWeighmentDetailList = [];
      this.summaryWeighmentDetail = [];
      this.summaryReceivingDetails = [];
      this.selectedReceptionDetails = reception;
      // console.log(this.selectedReceptionDetails);
      if (this.selectedInwardDetail !== null) {
        this.showNext = true;
      }
    } catch (error) {
      // console.log('Error in reception detail selection in Harvet GRN:', error);
    }
  }
  harvestGRN() {
    this.unitNameDDL.open();
  }
  clear() {
    try {
      this.unitNameDDL.writeValue(null);
      this.inwardDetails = null;
      this.receptionDetails = null;
      this.selectedInwardDetail = null;
      this.selectedReceptionDetails = null;
      this.summaryWeighmentDetailList = [];
      this.summaryWeighmentDetail = [];
      this.summaryReceivingDetails = [];
      this.harvestWeighmentForm.reset();
      this.index = 0;
      this.showBack = false;
    } catch (error) {
      // console.log('Error in clearing form Harvet GRN:', error);
    }
  }
  changeWeighmentMode(mode: any) {
    try {
      if (mode === 'Direct') {
        this.showGrid = false;
        this.showSave = true;
      } else {
        this.showGrid = true;
        this.showSave = false;
      }
    } catch (error) {
      // console.log('Error in change weighment in Harvest GRN:', error);
    }
  }
  selectIndexForGrid3: number;
  onSummarySelected(summaryDetail: any, i: number) {
    try {
      debugger;
      this.selectIndexForGrid3 = i;
      this.summaryWeighmentDetail = [];
      this.selectedSummaryRecDetail = summaryDetail;
      if (this.summaryWeighmentDetailList.length > 0) {
        if (this.summaryWeighmentDetailList.some(obj => obj.grade === summaryDetail.grade)) {
          this.summaryWeighmentDetailList.forEach(obj => {
            if (obj.grade === summaryDetail.grade) {
              const summaryWeighmentDetail = new SummaryWeighmentDetails();
              summaryWeighmentDetail.weightNo = obj.weightNo + 1;
              summaryWeighmentDetail.grade = obj.grade;
              this.summaryWeighmentDetail.pop();
              this.summaryWeighmentDetail.push(summaryWeighmentDetail);
            }
          });
        } else {
          const summaryWeighmentDetail = new SummaryWeighmentDetails();
          summaryWeighmentDetail.weightNo = 1;
          summaryWeighmentDetail.grade = summaryDetail.grade;
          this.summaryWeighmentDetail.push(summaryWeighmentDetail);
        }
      } else {
        const summaryWeighmentDetail = new SummaryWeighmentDetails();
        summaryWeighmentDetail.weightNo = 1;
        summaryWeighmentDetail.grade = summaryDetail.grade;
        this.summaryWeighmentDetail.push(summaryWeighmentDetail);
      }
    } catch (error) {
      // console.log('Error in Summary selection in Harvest GRN form:', error);
    }
  }
  calcNetWt(event, summaryWeighment) {
    const grossWt = summaryWeighment.grossWt;
    const tareWt = summaryWeighment.tareWt;
    const netWt = grossWt - tareWt;
    summaryWeighment.netWt = isNaN(netWt) ? 0 : Number(netWt.toFixed(3));
  }
  showPopUp() {
    if (isNaN(this.summaryWeighmentDetail[0].noOfCrates) || this.summaryWeighmentDetail[0].noOfCrates === null
      || isNaN(this.summaryWeighmentDetail[0].grossWt) || this.summaryWeighmentDetail[0].grossWt === null
      || isNaN(this.summaryWeighmentDetail[0].tareWt) || this.summaryWeighmentDetail[0].tareWt === null) {

    } else {
      this.modalservice.open('save-weighment-Modal');
    }
  }
  weighmentGridCalculation() {
    try {
      const netWt = +(this.grossWt.nativeElement.innerText - this.tareWt.nativeElement.innerText);
      // this.netWt.nativeElement.innerText = netWt;
      const noOfCrates =
        this.selectedSummaryRecDetail.recdCrates =
        isNaN(this.selectedSummaryRecDetail.recdCrates) ? (this.selectedSummaryRecDetail.recdCrates =
          +this.noOfCrates.nativeElement.innerText) :
          (this.selectedSummaryRecDetail.recdCrates = (+this.selectedSummaryRecDetail.recdCrates) +
            +this.noOfCrates.nativeElement.innerText);
      isNaN(this.selectedSummaryRecDetail.recdKgs) ? (this.selectedSummaryRecDetail.recdKgs =
        +this.netWt.nativeElement.innerText) :
        (this.selectedSummaryRecDetail.recdKgs = (+this.selectedSummaryRecDetail.recdKgs) + +this.netWt.nativeElement.innerText);
      this.selectedSummaryRecDetail.diffCrates = this.selectedSummaryRecDetail.despCrates - this.selectedSummaryRecDetail.recdCrates;
      this.selectedSummaryRecDetail.diffKgs = this.selectedSummaryRecDetail.despKgs - this.selectedSummaryRecDetail.recdKgs;
      const summaryWeighmentDetail = new SummaryWeighmentDetails();
      summaryWeighmentDetail.cropSchemeCode = this.selectedSummaryRecDetail.cropSchemeCode;
      summaryWeighmentDetail.grade = this.selectedSummaryRecDetail.grade;
      summaryWeighmentDetail.weightNo = +this.wtNo.nativeElement.innerText;
      summaryWeighmentDetail.grossWt = +this.grossWt.nativeElement.innerText;
      summaryWeighmentDetail.netWt = +(this.grossWt.nativeElement.innerText - this.tareWt.nativeElement.innerText);
      summaryWeighmentDetail.tareWt = +this.tareWt.nativeElement.innerText;
      summaryWeighmentDetail.noOfCrates = +this.noOfCrates.nativeElement.innerText;
      this.summaryWeighmentDetailList.push(summaryWeighmentDetail);
      this.showSave = true;
      this.modalservice.open('save-weighment-Modal');
    } catch (error) {
      // console.log('Error in grid calculation in Harvest GRN form:', error);
    }
  }
  noofCratesChange(i: number) {
    debugger;
    if (this.summaryWeighmentDetail[i].noOfCrates > 0 && this.summaryWeighmentDetail[i].crateTareWt > 0) {
      this.summaryWeighmentDetail[i].tareWt = this.summaryWeighmentDetail[i].noOfCrates * this.summaryWeighmentDetail[i].crateTareWt;
      if (this.summaryWeighmentDetail[i].tareWt > 0 && this.summaryWeighmentDetail[i].grossWt > 0) {
        this.summaryWeighmentDetail[i].netWt = this.summaryWeighmentDetail[i].grossWt - this.summaryWeighmentDetail[i].tareWt;
      }
    }
    // this.summaryReceivingDetails[this.selectIndexForGrid3 - 1].recdCrates = Number(0);
    // for (var j = 0; j < this.summaryWeighmentDetail.length; j++) {
    //   if (this.selectIndexForGrid3 > 0) {
    //     this.summaryReceivingDetails[this.selectIndexForGrid3 - 1].recdCrates = this.summaryReceivingDetails[this.selectIndexForGrid3 - 1].recdCrates +
    //       Number(this.summaryWeighmentDetail[j].noOfCrates);
    //   }
    // }
  }

  crateTarWtChange(i: number) {
    debugger
    if (this.summaryWeighmentDetail[i].noOfCrates > 0 && this.summaryWeighmentDetail[i].crateTareWt > 0) {
      this.summaryWeighmentDetail[i].tareWt = this.summaryWeighmentDetail[i].noOfCrates * this.summaryWeighmentDetail[i].crateTareWt;
      if (this.summaryWeighmentDetail[i].tareWt > 0 && this.summaryWeighmentDetail[i].grossWt > 0) {
        this.summaryWeighmentDetail[i].netWt = this.summaryWeighmentDetail[i].grossWt - this.summaryWeighmentDetail[i].tareWt;
      }
    }
    // this.summaryReceivingDetails[this.selectIndexForGrid3 - 1].recdKgs = Number(0);
    // for (var j = 0; j < this.summaryWeighmentDetail.length; j++) {
    //   if (this.selectIndexForGrid3 > 0) {
    //     this.summaryReceivingDetails[this.selectIndexForGrid3 - 1].recdKgs = Number(this.summaryReceivingDetails[this.selectIndexForGrid3 - 1].recdKgs) +
    //       Number(this.summaryWeighmentDetail[j].crateTareWt);
    //   }
    // }
  }

  tareWtChange(i: number) {
    debugger
    if (this.summaryWeighmentDetail[i].tareWt > 0 && this.summaryWeighmentDetail[i].grossWt > 0) {
      this.summaryWeighmentDetail[i].netWt = this.summaryWeighmentDetail[i].grossWt - this.summaryWeighmentDetail[i].tareWt;
    }
  }
  updateSummaryRecievedDetail() {
    try {
      const selectedSummaryRecDetailrecdCrates = Number(isNaN(this.selectedSummaryRecDetail.recdCrates) ? 0 :
        this.selectedSummaryRecDetail.recdCrates);
      this.selectedSummaryRecDetail.recdCrates = selectedSummaryRecDetailrecdCrates + Number(this.summaryWeighmentDetail[0].noOfCrates);
      const selectedSummaryRecDetailrecdKgs = Number(isNaN(this.selectedSummaryRecDetail.recdKgs) ? 0 :
        this.selectedSummaryRecDetail.recdKgs);
      this.selectedSummaryRecDetail.recdKgs = Number(Number(selectedSummaryRecDetailrecdKgs +
        this.summaryWeighmentDetail[0].netWt).toFixed(3));
      this.selectedSummaryRecDetail.diffCrates = this.selectedSummaryRecDetail.despCrates - this.selectedSummaryRecDetail.recdCrates;
      this.selectedSummaryRecDetail.diffKgs = Number(Number(this.selectedSummaryRecDetail.despKgs -
        this.selectedSummaryRecDetail.recdKgs).toFixed(3));
      const summaryWeighmentDetail = new SummaryWeighmentDetails();
      summaryWeighmentDetail.cropSchemeCode = this.selectedSummaryRecDetail.cropSchemeCode;
      summaryWeighmentDetail.grade = this.selectedSummaryRecDetail.grade;
      summaryWeighmentDetail.weightNo = +this.summaryWeighmentDetail[0].weightNo;
      summaryWeighmentDetail.grossWt = +this.summaryWeighmentDetail[0].grossWt;
      summaryWeighmentDetail.netWt = +this.summaryWeighmentDetail[0].netWt;
      summaryWeighmentDetail.tareWt = +this.summaryWeighmentDetail[0].tareWt;
      summaryWeighmentDetail.noOfCrates = +this.summaryWeighmentDetail[0].noOfCrates;
      this.summaryWeighmentDetailList.push(summaryWeighmentDetail);
    } catch (error) {
      // console.log('Error in grid calculation in Harvest GRN form:', error);
    }
  }
  sameGrade() {
    try {
      this.updateSummaryRecievedDetail();
      this.calculateTotalQty();
      this.calculateTotalCrates();
      this.showSave = false;
      this.modalservice.close('save-weighment-Modal');
      const summaryWeighmentDetail = new SummaryWeighmentDetails();
      this.summaryWeighmentDetail[0].weightNo = this.summaryWeighmentDetail[0].weightNo + 1;
      this.summaryWeighmentDetail[0].noOfCrates = null;
      this.summaryWeighmentDetail[0].grossWt = null;
      this.summaryWeighmentDetail[0].tareWt = null;
      this.summaryWeighmentDetail[0].netWt = null;
      this.noOfCrates.nativeElement.focus();
    } catch (error) {
      // console.log('Error in Same grade in Harvest GRN form:', error);
    }
  }
  changeGrade() {
    try {
      this.updateSummaryRecievedDetail();
      this.calculateTotalQty();
      this.calculateTotalCrates();
      this.showSave = false;
      this.modalservice.close('save-weighment-Modal');
      this.summaryWeighmentDetail = [];
    } catch (error) {
      // console.log('Error in Change grade in Harvest GRN form:', error);
    }
  }
  complete() {
    try {
      this.updateSummaryRecievedDetail();
      this.calculateTotalQty();
      this.calculateTotalCrates();
      this.modalservice.close('save-weighment-Modal');
      this.showSave = true;
      this.summaryWeighmentDetail = [];
      this.saveBtn.nativeElement.focus();
      // console.log('inner grid', this.summaryWeighmentDetail);
      // console.log('over all grid', this.summaryWeighmentDetailList);
      // console.log('rec details', this.summaryReceivingDetails);
    } catch (error) {
      // console.log('Error in Complete in Harvest GRN form:', error);
    }
  }
  ThreeDigitDecimalNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,5}\.?\d{0,3}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  OnlyNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,4}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  calculateTotalQty() {
    let sum = 0;
    this.summaryReceivingDetails.forEach(obj => {
      if (!isNaN(obj.recdKgs)) {
        sum = sum + +obj.recdKgs;
      }
    });
    this.harvestWeighmentForm.controls.totalQtyReceived.setValue(Number(sum.toFixed(3)));
  }
  calculateTotalCrates() {
    try {
      let sum = 0;
      this.summaryReceivingDetails.forEach(obj => {
        if (!isNaN(obj.recdCrates)) {
          sum = sum + +obj.recdCrates;
        }
      });
      this.harvestWeighmentForm.controls.noOfCratesReceived.setValue(sum);
    } catch (error) {
      // console.log('Error in calculating Crates:', error);
    }
  }
  calculateKm() {
    this.harvestWeighmentForm.controls.noOfKms.setValue(
      this.harvestWeighmentForm.controls.endingKm.value - this.harvestWeighmentForm.controls.startingKmReading.value
    );
  }
  calculateTime() {
    if (this.recTime.overlayVisible === true) {
      const time = this.harvestWeighmentForm.controls.factoryReceiveTime.value - this.harvestWeighmentForm.controls.timeOfDispatch.value;
      this.timeDifference = +((moment.utc(time).format('HH:mm').toString()).split(':')[0] + '.'
        + (moment.utc(time).format('HH:mm').toString()).split(':')[1]);
      this.harvestWeighmentForm.controls.duration.setValue(this.datepipe.transform(new Date(0, 0, 0, 0, 0, 0, time), 'HH:mm:ss'));
    }
    this.recTime.overlayVisible = false;
  }
  directModeCalculation(summaryDetail: any) {
    this.selectedSummaryRecDetail = summaryDetail;
    // console.log(this.selectedSummaryRecDetail);
    this.selectedSummaryRecDetail.diffCrates = this.selectedSummaryRecDetail.despCrates - +this.summaryCrates.nativeElement.innerText;
    this.selectedSummaryRecDetail.diffKgs = this.selectedSummaryRecDetail.despKgs - +this.summaryKgs.nativeElement.innerText;
    this.showSave = true;
    this.calculateTotalQty();
    this.calculateTotalCrates();
    // console.log('inner grid', this.summaryWeighmentDetail);
    // console.log('over all grid', this.summaryWeighmentDetailList);
    // console.log('rec details', this.summaryReceivingDetails);
  }
  calcCratesDiff(event, summaryDetail) {
    const despCrates = summaryDetail.despCrates;
    const recdCrates = summaryDetail.recdCrates;
    const diffCrates = despCrates - recdCrates;
    summaryDetail.diffCrates = isNaN(diffCrates) ? 0 : diffCrates;
    this.calculateTotalCrates();
  }
  calcKgsDiff(event, summaryDetail) {
    const despKgs = summaryDetail.despKgs;
    const recdKgs = summaryDetail.recdKgs;
    const diffKgs = despKgs - recdKgs;
    summaryDetail.diffKgs = isNaN(diffKgs) ? 0 : Number(diffKgs.toFixed(3));
    this.calculateTotalQty();
  }
  saveDetails() {
    if (this.harvestWeighmentForm.valid) {
      const harvestGrnForm = new HarvestGrnForm();
      harvestGrnForm.unitHMInwardNo = this.selectedUnit.orgOfficeNo;
      harvestGrnForm.igpNo = this.selectedInwardDetail.igpNo;
      harvestGrnForm.orgID = this.selectedReceptionDetails.orgID;
      harvestGrnForm.areaId = this.selectedReceptionDetails.areaId;
      harvestGrnForm.supervisorId = this.harvestWeighmentForm.controls.supervisor.value;
      harvestGrnForm.harvestGRNNo = this.selectedReceptionDetails.harvestGRNNo;
      harvestGrnForm.greenProcurementNo = this.selectedReceptionDetails.greenProcurementNo;
      harvestGrnForm.cropNameCode = this.selectedReceptionDetails.cropCode;
      harvestGrnForm.cropGroupCode = this.selectedReceptionDetails.cropGroupCode;
      harvestGrnForm.harvestGRNTotalDespCrates = this.selectedReceptionDetails.despNoOfCrates == null ? 0 : this.selectedReceptionDetails.despNoOfCrates;
      harvestGrnForm.harvestGRNTotalQuantity = this.selectedReceptionDetails.harvestGRNTotalQuantity == null ? 0 :
        this.selectedReceptionDetails.harvestGRNTotalQuantity;
      harvestGrnForm.unitHarvestMaterialInwardDate = this.harvestWeighmentForm.controls.receivingDate.value;
      harvestGrnForm.vehicleReachReading = this.harvestWeighmentForm.controls.endingKm.value;
      harvestGrnForm.vehicleReachTime = this.datepipe.transform(this.harvestWeighmentForm.controls.factoryReceiveTime.value, 'HH:mm');
      harvestGrnForm.vehicleTransitDuration = this.timeDifference;
      harvestGrnForm.vehicleTransitKms = this.harvestWeighmentForm.controls.noOfKms.value;
      harvestGrnForm.totalReceivedCrates = this.harvestWeighmentForm.controls.noOfCratesReceived.value;
      harvestGrnForm.totalReceivedQantity = this.harvestWeighmentForm.controls.totalQtyReceived.value;
      const weighmentDetails = [];
      if (this.harvestWeighmentForm.controls.weighmentMode.value !== 'Direct') {
        this.summaryWeighmentDetailList.forEach(obj => {
          const weighmentDetail = new WeighmentDetails();
          weighmentDetail.cropSchemeCode = obj.cropSchemeCode;
          weighmentDetail.grossWeight = obj.grossWt;
          weighmentDetail.netWeight = obj.netWt;
          weighmentDetail.tareWeight = obj.tareWt;
          weighmentDetail.weightNoOfCrates = obj.noOfCrates;
          weighmentDetail.cratesTareWeight = obj.crateTareWt;
          weighmentDetails.push(weighmentDetail);
        });
      }
      harvestGrnForm.SummaryWeighmentDetails = weighmentDetails;
      const receivingDetails = [];
      this.summaryReceivingDetails.forEach(obj => {
        const receivingDetail = new ReceivingDetailList();
        receivingDetail.cropSchemeCode = obj.cropSchemeCode;
        receivingDetail.gradeWiseTotalQuantity = isNaN(obj.recdKgs) ? 0 : obj.recdKgs;
        receivingDetail.noOfCrates = isNaN(obj.recdCrates) ? 0 : obj.recdCrates;
        receivingDetails.push(receivingDetail);
      });
      harvestGrnForm.SummaryReceivingDetails = receivingDetails;
      // console.log(harvestGrnForm);
      /*if (this.showGrid) {
        this.summaryReceivingDetails.forEach(obj => {
          if (this.weighmentDetails.some(x => x.cropSchemeCode === obj.grade.split(' ')[0])) {
            const receivingDetail = new ReceivingDetailList();
            receivingDetail.cropSchemeCode = obj.grade.split(' ')[0];
            receivingDetail.gradeWiseTotalQuantity = obj.diffKgs == null ? 0 : obj.diffKgs;
            receivingDetail.noOfCrates = obj.diffCrates == null ? 0 : obj.diffCrates;
            this.receivingDetails.push(receivingDetail);
          }
        });
        harvestGrnForm.SummaryReceivingDetails = this.receivingDetails;
      } else {
        this.summaryReceivingDetails.forEach(obj => {
          if (obj.diffCrates !== undefined || obj.diffKgs !== undefined) {
            const receivingDetail = new ReceivingDetailList();
            receivingDetail.cropSchemeCode = obj.grade.split(' ')[0];
            receivingDetail.gradeWiseTotalQuantity = obj.diffKgs == null ? 0 : obj.diffKgs;
            receivingDetail.noOfCrates = obj.diffCrates == null ? 0 : obj.diffCrates;
            this.receivingDetails.push(receivingDetail);
          }
        });
        harvestGrnForm.SummaryReceivingDetails = this.receivingDetails;
      }*/
      this.harvestGrnService.saveHarvestGrnDetails(harvestGrnForm).subscribe(res => {
        if (res) {
          this.showSuccess();
          this.clear();
        }
      }, (error) => {
        // console.log(error);
        this.showError();
      });
    } else {
      // console.log(this.harvestWeighmentForm.controls.supervisor.value);
      Object.keys(this.harvestWeighmentForm.controls).forEach(field => {
        if (this.harvestWeighmentForm.get(field).value === '') {
          const control = this.harvestWeighmentForm.get(field);
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }
  showSuccess() {
    this.alertService.success('Harvest GRN Weighment Details Added Successfully');
  }
  showError() {
    this.alertService.error('Error in adding the details.');
  }
}
