import { Component, OnInit } from '@angular/core';
import { DepartmentAndDesignationService } from './department-and-designation.service';
import { DepartmentDesignation, Department } from './department-and-designation.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
declare let jsPDF;

@Component({
  selector: 'app-department-and-designation',
  templateUrl: './department-and-designation.component.html',
  styleUrls: ['./department-and-designation.component.css']
})
export class DepartmentAndDesignationComponent implements OnInit {
  gridData: Array<DepartmentDesignation>;
  gridDataOnDropdownClick: Array<DepartmentDesignation>;
  departmentDropDown: Array<Department>;
  departmentCode: string;
  displayPopup = false;
  displayPopupForDownload = false;
  document: any;
  rowCount = 1;
  constructor(private departmentAndDesignationService: DepartmentAndDesignationService, private alertService: AlertService) {
    this.gridData = new Array<DepartmentDesignation>();
    this.departmentDropDown = new Array<Department>();
  }

  ngOnInit() {
    this.getDataForDepartmentDropDown();
  }

  getDataForGrid(departmentCode = '') {
    this.departmentAndDesignationService.getDepartmentDesignationReportData(departmentCode).subscribe(
      data => {
        if (data && data.length > 0) {
          this.gridDataOnDropdownClick = data;
        } else {
          this.gridDataOnDropdownClick = new Array<DepartmentDesignation>();
          this.gridData = new Array<DepartmentDesignation>();
          this.alertService.error('No Data Found');
        }
      },
      error => {
        console.error('Error while fetching data');
      }
    );
  }

  getDataForDepartmentDropDown() {
    this.departmentAndDesignationService.getDropDownForDepartmentList().subscribe(
      data => {
        if (data) {
          this.departmentDropDown = data;
        } else {
          this.departmentDropDown = new Array<Department>();
          this.alertService.error('No Data Found');
        }
      },
      error => {
        console.error('Error while fetching data');
      }
    );
  }

  departmentCodeChangeEvent(id: string) {
    this.getDataForGrid(id);
  }

  viewData() {
    if (this.departmentCode) {
      if (this.gridDataOnDropdownClick && this.gridDataOnDropdownClick.length > 0) {
        this.gridData = this.gridDataOnDropdownClick;
        console.log(this.gridData);
      }
    }
  }

  selectedCode() {
    if (this.departmentCode) {
      this.gridDataOnDropdownClick = new Array<DepartmentDesignation>();
      this.gridData = new Array<DepartmentDesignation>();
      if (this.departmentCode === 'ALL') {
        this.getDataForGrid('');
      } else {
        this.getDataForGrid(this.departmentCode);
      }
    } else {
      this.alertService.error('Please select Department');
    }

  }

  createPdf(potrait = true) {
    let chunk = 0;
    if (!potrait) {
      this.document = new jsPDF('l', 'mm', [297, 210]);
      chunk = 20;
    } else {
      this.document = new jsPDF();
      chunk = 32;
    }

    this.document.setFontSize(12);

    let i; let j;
    let pageNumber = 1;
    for (i = 0, j = this.gridDataOnDropdownClick.length; i < j; i += chunk) {
      if (pageNumber > 1) {
        this.document = this.document.addPage();
      }
      if (!potrait) {
        this.document.setTextColor('green');
        this.document.text('P&G ESS', 10, 12);
        this.document.setTextColor('black');
        this.document.text('Departments Report', 109, 20);
      } else {
        this.document.setTextColor('green');
        this.document.text('P&G ESS', 10, 12);
        this.document.setTextColor('black');
        this.document.text('Departments Report', 80, 20);
      }
      this.document.page = pageNumber;
      const gridSplitData = this.gridDataOnDropdownClick.slice(i, i + chunk);
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
    if (this.gridDataOnDropdownClick && this.gridDataOnDropdownClick.length > 0) {
      this.document = null;
      const doc = this.createPdf(isportrait);
      doc.save('Report' + this.getFormattedTime() + '.pdf');
      this.alertService.success('Pdf Successfully downloaded.');
    } else {
      this.alertService.error('No Data Found.');
    }
  }

  printPdf(isPotrait = true) {
    if (this.gridDataOnDropdownClick && this.gridDataOnDropdownClick.length > 0) {
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

  printClick() {
    if (this.gridDataOnDropdownClick && this.gridDataOnDropdownClick.length > 0) {
      this.displayPopup = true;
    } else {
      this.alertService.error('No Data Found.');
    }
  }

  downloadClick() {
    if (this.gridDataOnDropdownClick && this.gridDataOnDropdownClick.length > 0) {
      this.displayPopupForDownload = true;
    } else {
      this.alertService.error('No Data Found.');
    }
  }

  createLandScapePdf() {
    this.rowCount = 1;
    this.displayPopup = false;
    this.printPdf(false);
  }

  createPotraitPdf() {
    this.rowCount = 1;
    this.displayPopup = false;
    this.printPdf();
  }

  createLandScapePdfDownload() {
    this.rowCount = 1;
    this.displayPopupForDownload = false;
    this.downloadPdf(false);
  }

  createPotraitPdfDownload() {
    this.rowCount = 1;
    this.displayPopupForDownload = false;
    this.downloadPdf();
  }

  SetSinglePageData(data: Array<DepartmentDesignation>) {
    const pdfData = [];
    data.forEach((value) => {
      pdfData.push([this.rowCount, value.DepartmentName, value.SubDepartmentName, value.DesignationName, value.SkillsName]);
      this.rowCount++;
    });
    return pdfData;
  }

  insertDatainPdf(data: any) {
    this.document.autoTable({
      startY: 5 + 20,
      theme: 'grid',
      head: [['#', 'Department', 'SubDepartment', 'Designation', 'Skills']],
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
    this.departmentCode = null;
    this.gridData = [];
    this.gridDataOnDropdownClick = [];
  }

}
