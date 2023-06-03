import { OnInit, Component } from '@angular/core';
import { FarmerWiseSummaryService } from './farmer-wise-summary.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CropGroupDto, CropName, CropFromTo, PlantationSchemeDetail, Area, FarmerDetails } from './farmer-wise-summary.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { SatDatepickerInputEvent, SatDatepickerRangeValue } from 'saturn-datepicker';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
declare let jsPDF;

@Component({
  selector: 'app-farmer-wise-summary-report',
  templateUrl: './farmer-wise-summary.component.html',
  styleUrls: ['./farmer-wise-summary.component.css'],
  providers: [],
})
export class FarmerWiseSummaryComponent implements OnInit {
  cropGroupForm: FormGroup;
  cropNameForm: FormGroup;
  schemeDetailsForm: FormGroup;
  branchDetailsForm: FormGroup;
  datePickerForm: FormGroup;
  cropGroupsData: any;
  cropNames: Array<CropName>;
  cropFromToDetails: Array<CropFromTo>;
  plantationSchemeDetails: Array<PlantationSchemeDetail>;
  areas: Array<Area>;
  farmerDetails: Array<FarmerDetails>;
  selectedPsNumber: string;
  selectedArea: string;
  selectedAreaName: string;
  lastDateChange: SatDatepickerRangeValue<Date>  | null;
  isDateInvalid: boolean;
  displayPopup = false;
  displayPopupForDownload = false;
  document: any;

  constructor(
    private farmerwiseSummaryService: FarmerWiseSummaryService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public datepipe: DatePipe
  ) {
    this.plantationSchemeDetails = new Array();
  }

  ngOnInit() {
    this.getCropGroups();
    this.getAllAreas();
    this.buildInputForm();
    GherkinValidator.isInvalidSubject$.subscribe(value => {
      this.isDateInvalid = value;
      if (this.isDateInvalid) {
        this.schemeDetailsForm.get('fromToDate').setValue('');
        this.selectedPsNumber = null;
      }
    });
  }

  buildInputForm() {
    this.cropGroupForm = this.formBuilder.group({
      cropGroupName: [{ value: '', disabled: false }],
    });

    this.cropNameForm = this.formBuilder.group({
      cropNameControl: [{ value: '', disabled: false }],
    });
    this.schemeDetailsForm = this.formBuilder.group({
      fromToDate: [{ value: '', disabled: false }],
    });
    this.branchDetailsForm = this.formBuilder.group({
      branchName: [{ value: '', disabled: false }],
    });
    this.datePickerForm = this.formBuilder.group({
      date: [{begin: '', end: ''}, [
        GherkinValidator.dateValidator()
      ]]
    });
  }

  resetForm(selectedField: string): void {
    switch (selectedField) {
      case 'cropgroup' :
        this.cropNameForm.get('cropNameControl').setValue('');
        this.schemeDetailsForm.get('fromToDate').setValue('');
        this.branchDetailsForm.get('branchName').setValue('');
        this.datePickerForm.get('date').setValue('');
        this.farmerDetails = this.cropFromToDetails = this.plantationSchemeDetails = this.selectedPsNumber =  null;
        break;

      case 'cropname' :
        this.schemeDetailsForm.get('fromToDate').setValue('');
        this.branchDetailsForm.get('branchName').setValue('');
        this.datePickerForm.get('date').setValue('');
        this.farmerDetails = this.cropFromToDetails = this.plantationSchemeDetails = this.selectedPsNumber =  null;
        break;

      case 'season' :
      case 'datechange' :
        this.branchDetailsForm.get('branchName').setValue('');
        this.farmerDetails  = this.plantationSchemeDetails = this.selectedPsNumber =  null;
        break;

      case 'clear' :
        this.cropGroupForm.get('cropGroupName').setValue('');
        this.cropNameForm.get('cropNameControl').setValue('');
        this.schemeDetailsForm.get('fromToDate').setValue('');
        this.branchDetailsForm.get('branchName').setValue('');
        this.datePickerForm.get('date').setValue('');
        this.farmerDetails = this.cropFromToDetails = this.plantationSchemeDetails = this.selectedPsNumber =  null;
        break;
    }
  }

  getCropGroups() {
    this.farmerwiseSummaryService.getCropGroups().subscribe(
      (result) => {
        this.cropGroupsData = result;
        console.log(result);
      },
      (error) => {
        this.alertService.error('Error while getting Crop Group details!');
      }
    );
  }

  getAllAreas() {
    this.farmerwiseSummaryService.getAllArea().subscribe(
      (result) => {

        this.areas = result;
        console.log(this.areas);
      },
      (error) => {
        this.alertService.error('Error while getting Crop Group details!');
      }
    );
  }

  getCropNameOnGroupCodeChange(groupCode: string) {
    console.log(groupCode);
    this.resetForm('cropgroup');
    this.farmerwiseSummaryService.getCropNamesByGroupCode(groupCode).subscribe(
      (result) => {
        console.log('crop names- ' + result[0]);
        this.cropNames = result;
      },
      (error) => {
        this.alertService.error('Error while getting Crop Name details!');
      }
    );
  }

  getSchemeDetailsOnCropNameChange(cropNameCode: string) {
    console.log(cropNameCode);
    this.resetForm('cropname');
    this.farmerwiseSummaryService.getPlantationSchemeDetails(cropNameCode).subscribe(
      (result) => {
        this.cropFromToDetails = result;
      },
      (error) => {
        this.alertService.error('Error while getting Plantation Scheme details!');
      }
    );
  }

  getSelectedSeason(psNumber: string) {
    this.selectedPsNumber = psNumber;
    console.log(this.selectedPsNumber);
  }

  getSelectedArea(areaId: string) {
    this.selectedArea = areaId;
    const area = this.areas.find(data => data.areaId === areaId );
    this.selectedAreaName = area.areaName;
    // tslint:disable-next-line: only-arrow-functions
    this.selectedAreaName = this.selectedAreaName.replace(/\w+/g, function(w) {return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
    console.log(this.selectedArea);
  }

  onDateChange = (e: SatDatepickerInputEvent<Date>) => {
    this.resetForm('datechange');
    this.schemeDetailsForm.get('fromToDate').setValue('');
    this.plantationSchemeDetails = new Array();
    this.lastDateChange = e.value as SatDatepickerRangeValue<Date>;
    this.cropFromToDetails.map(value => {
      const plantationScheme = new PlantationSchemeDetail();
      plantationScheme.psNumber = value.psNumber;
      const dateFrom = new Date(value.seasonFrom.substr(0, value.seasonFrom.indexOf('T')));
      const dateTo = new Date(value.seasonTo.substr(0, value.seasonTo.indexOf('T')));
      const dateFromNew = this.datepipe.transform(value.seasonFrom.substr(0, value.seasonFrom.indexOf('T')), 'dd-MM-yyyy');
      const dateToNew = this.datepipe.transform(value.seasonTo.substr(0, value.seasonTo.indexOf('T')), 'dd-MM-yyyy');

      console.log(dateFromNew);
      plantationScheme.seasonFromTo = dateFromNew + ' / ' + dateToNew;
      if (dateFrom >= this.lastDateChange.begin && dateFrom <= this.lastDateChange.end) {
        this.plantationSchemeDetails.push(plantationScheme);
      }
    });
  }

  viewData() {
    if (this.selectedPsNumber && this.selectedArea) {
      this.farmerwiseSummaryService.getFarmerWiseSummaryDetails(this.selectedArea, this.selectedPsNumber).subscribe((result) => {
        this.farmerDetails = result;
        this.farmerDetails.sort((a, b) => 0 - (a.alternativeContactPerson > b.alternativeContactPerson ? -1 : 1));
        console.log(this.farmerDetails);
      });
    }
  }

  createPdf(potrait = true) {
    if (!potrait) {
      this.document = new jsPDF('l', 'mm', [297, 210]);

    } else {
      this.document = new jsPDF();
    }
    this.document.setFontSize(12);
    let i; let j; const chunk = 28;
    let pageNumber = 1;
    for (i = 0, j = this.farmerDetails.length; i < j; i += chunk) {
      if (pageNumber > 1) {
        this.document = this.document.addPage();
      }
      if (!potrait) {
        this.document.setTextColor('green');
        this.document.text('P&G ESS', 10, 12);
        this.document.setTextColor('green');
        this.document.text(this.selectedAreaName, 14, 25);
        this.document.setTextColor('black');
        this.document.text('Farmer Wise Summary Report', 109, 20);
      } else {
        this.document.setTextColor('green');
        this.document.text('P&G ESS', 10, 12);
        this.document.setTextColor('green');
        this.document.text(this.selectedAreaName, 14, 25);
        this.document.setTextColor('black');
        this.document.text('Farmer Wise Summary Report', 75, 20);
      }
      this.document.page = pageNumber;
      const gridSplitData = this.farmerDetails.slice(i, i + chunk);
      const properBodyForPdf = this.SetSinglePageData(gridSplitData);
      this.insertDatainPdf(properBodyForPdf);
      if (!potrait) {
        this.document.text(10, 200, 'GherkinUI');
        this.document.text(270, 200, 'page ' + pageNumber);
      } else {
        this.document.text(10, 285, 'GherkinUI');
        this.document.text(180, 285, 'page ' + pageNumber);
      }
      pageNumber++;
    }
    return this.document;
  }

  downloadPdf(isportrait = true) {
    if (this.farmerDetails && this.farmerDetails.length > 0) {
      this.document = null;
      const doc = this.createPdf(isportrait);
      doc.save('Report' + this.getFormattedTime() + '.pdf');
      this.alertService.success('Pdf Successfully downloaded.');
    } else {
      this.alertService.error('No Data Found.');
    }
  }

  printPdf(isPotrait = true) {
    if (this.farmerDetails && this.farmerDetails.length > 0) {
      this.document = null;
      const doc = this.createPdf(isPotrait);
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
      this.alertService.error('No Data Found.');
    }
  }

  SetSinglePageData(data: Array<FarmerDetails>) {
    const pdfData = [];
    data.forEach((value, index) => {
      pdfData.push([index + 1, value.alternativeContactPerson, value.farmerName, value.farmerAddress, value.stateName,
                    value.districtName, value.mandalName, value.villageName]);
    });
    return pdfData;
  }

  insertDatainPdf(data: any) {
    this.document.autoTable({
      startY: 10 + 20,
      theme: 'grid',
      head: [['#', 'Account No', 'Farmer Name', 'Father Name', 'State', 'District', 'Mandal/Taluk', 'Village']],
      body: data
    });
  }

  getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    // JavaScript months are 0-based.
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
  }

  clear() {
    this.resetForm('clear');
  }

  createLandScapePdf() {
    this.displayPopup = false;
    this.printPdf(false);
  }

  createPotraitPdf() {
    this.displayPopup = false;
    this.printPdf();
  }

  createLandScapePdfDownload() {
    this.displayPopupForDownload = false;
    this.downloadPdf(false);
  }

  createPotraitPdfDownload() {
    this.displayPopupForDownload = false;
    this.downloadPdf();
  }

  printClick() {
    if (this.farmerDetails && this.farmerDetails.length > 0) {
      this.displayPopup = true;
    } else {
      this.alertService.error('No Data Found.');
    }
  }

  downloadClick() {
    if (this.farmerDetails && this.farmerDetails.length > 0) {
      this.displayPopupForDownload = true;
    } else {
      this.alertService.error('No Data Found.');
    }
  }

}

export class GherkinValidator {

  static isInvalidSubject$ = new BehaviorSubject<boolean>(false);

  static  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        const startDate = new Date(control.value.begin);
        const endDate = new Date(control.value.end);
        if (+startDate === +endDate || startDate > endDate) {
          this.isInvalidSubject$.next(true);
          return {invalidDate: true};
        }

        let year = new Date(startDate).getFullYear();
        const maxDate = new Date(year, 2, 31);
        if (startDate < maxDate && endDate > maxDate) {
          this.isInvalidSubject$.next(true);
          return {invalidDate: true};
        } else {
          const newMaxDate = new Date(++year, 2, 31);
          if (endDate > newMaxDate) {
            this.isInvalidSubject$.next(true);
            return {invalidDate: true};
          }
        }
        this.isInvalidSubject$.next(false);
        return null;
    };
 }}
