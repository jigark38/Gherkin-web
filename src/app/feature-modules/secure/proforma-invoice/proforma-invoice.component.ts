import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ProductionDetails, ProformaInvoiceDetails } from 'src/app/shared/models/proforma-invoice.model';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { NgForm } from '@angular/forms';
import { ProformaInvoiceService } from 'src/app/shared/services/proforma-invoice.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

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

declare var $: any;

@Component({
  selector: 'app-proforma-invoice',
  templateUrl: './proforma-invoice.component.html',
  styleUrls: ['./proforma-invoice.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})




export class ProformaInvoiceComponent implements OnInit {

  bankAccDetails: any[] = [];
  consigneeBuyerList: any[] = [];
  countryOverSeasList: any[] = [];
  productGroupList: any[] = [];
  productVarietyList: any[] = [];
  productGradeList: any[] = [];
  profInvoice: ProformaInvoiceDetails;
  productDetails: ProductionDetails;

  isSaved = false;
  isFindEnabled = false;
  disableProformaFields = false;
  isSearchResults = false;
  isEditEnabled = false;


  toAddGrid = -1;
  selectedProductIndex = 0;
  producttoDelete;
  loginDetails: any;




  @ViewChild('form1', { static: false }) ngForm1: NgForm;
  @ViewChild('form2', { static: false }) ngForm2: NgForm;
  @ViewChild('fPGroupCode', { read: ElementRef, static: false }) fPGroupCode: ElementRef;
  @ViewChild('oceanFreight', { read: ElementRef, static: false }) oceanFreight: ElementRef;

  constructor(
    private authenticationService: AuthenticationService,
    private proformaService: ProformaInvoiceService, private alertService: AlertService) {
    this.profInvoice = new ProformaInvoiceDetails();
    this.productDetails = new ProductionDetails();
  }

  ngOnInit() {


    this.loginDetails = this.authenticationService.getUserdetails();


    this.generateInvoiceNoAndDate();
    this.proformaService.getBankAccDetails().subscribe(res => {
      this.bankAccDetails = res;
      console.log('Bank Account Details', this.bankAccDetails);

    }, error => {

      console.log(error);
    });

    this.proformaService.getConsigneeBuyer().subscribe(res => {
      this.consigneeBuyerList = res;
      console.log('Consignee Buyer Details', this.consigneeBuyerList);
    }, error => {

      console.log(error);
    });

    this.proformaService.getCountryOverSeas().subscribe(res => {
      this.countryOverSeasList = res;
      console.log('Country Oversea List', this.countryOverSeasList);
    }, error => {

      console.log(error);
    });

    this.proformaService.getProductGroup().subscribe(res => {
      this.productGroupList = res;
      console.log('Get Product Group', this.productGroupList);

    }, error => {

      console.log(error);
    });

  }


  generateInvoiceNoAndDate() {

    try {

      this.proformaService.getInvoiceNumber().subscribe(res => {
        this.profInvoice.profInvNo = res;

      }, error => {

        console.log(error);
      });

      this.profInvoice.profInvDate = new Date();
      this.profInvoice.shipmentDate = new Date();

    } catch (error) {
      console.log('Error in generating invoice number', error);
    }

  }


  allocateConsigneeCountry() {

    try {

      const consDetailInd = this.consigneeBuyerList.findIndex(x => x.cbCode === this.profInvoice.consigneeCbCode);

      if (consDetailInd > -1) {
        this.profInvoice.consigneeAddress = this.consigneeBuyerList[consDetailInd].cbAddress;
        const countryInd = this.countryOverSeasList.findIndex(x => x.countryId === this.consigneeBuyerList[consDetailInd].countryId);
        if (countryInd > -1) {
          this.profInvoice.consigneeCountry = this.countryOverSeasList[countryInd].countryName;

        }
      }

    } catch (error) {
      console.log('Error in allocating consignee country', error);
    }

  }


  allocateBuyerCountry() {

    try {
      const buyDetailInd = this.consigneeBuyerList.findIndex(x => x.cbCode === this.profInvoice.buyerCBCode);

      if (buyDetailInd > -1) {
        this.profInvoice.buyerAddress = this.consigneeBuyerList[buyDetailInd].cbAddress;
        const countryInd = this.countryOverSeasList.findIndex(x => x.countryId === this.consigneeBuyerList[buyDetailInd].countryId);
        if (countryInd > -1) {
          this.profInvoice.buyerCountry = this.countryOverSeasList[countryInd].countryName;

        }
      }

    } catch (error) {
      console.log('Error in allocating buyer country', error);
    }

  }

  findProductVariety() {

    try {
      this.emptyProductVariety();
      const ind = this.productGroupList.findIndex(x => x.groupCode === this.productDetails.fPGroupCode);
      this.productDetails.fPGroupName = this.productGroupList[ind].grpName;
      this.proformaService.getProductVariety(this.productDetails.fPGroupCode).subscribe(res => {
        this.productVarietyList = res;
        console.log('Product Varieties', this.productVarietyList);
      });

    } catch (err) {
      console.error(err);
    }

  }

  findProductGrade() {
    try {

      this.emptyProductGrade();
      const ind = this.productVarietyList.findIndex(x => x.varietyCode === this.productDetails.fPVarietyCode);
      this.productDetails.fPVarietyName = this.productVarietyList[ind].varietyName;
      this.proformaService.getProductGrade(this.productDetails.fPVarietyCode).subscribe(res => {
        this.productGradeList = res;
        console.log('Product grades', this.productGradeList);
      });

    } catch (err) {
      console.error(err);
    }

  }

  allotGradeFromTo() {
    if (this.productGradeList.length > 0) {
      const ind = this.productGradeList.findIndex(x => x.gradeCode === this.productDetails.fPGradeCode);
      if (ind > -1) {
        this.productDetails.fPGradeFromTo = this.productGradeList[ind].gradeFrom + ' / ' + this.productGradeList[ind].gradeTo;
      }
    }

    console.log('Product Details', this.productDetails);

  }


  focusToProduct() {
    this.scrollToBottom();
    this.fPGroupCode.nativeElement.focus();
  }

  openPopup(templateForm) {
    try {

      console.log('Opeing Modal', templateForm.valid, this.ngForm1.controls.oceanFreight.valid);
      console.log(this.ngForm1.controls);
      if (templateForm) {

        if (templateForm.valid && !this.ngForm1.controls.oceanFreight.invalid) {
          $('#continueModal').modal('show');
        }
      }
    } catch (error) {
      console.error('Error in opening pop up!', error);
    }

  }


  calQtyUOM() {

    if (this.productDetails.qtyDrum && this.productDetails.orderQuantity) {
      this.productDetails.qtyUOM = Math.round(this.productDetails.qtyDrum * this.productDetails.orderQuantity);
    }
  }


  calTotalNumberOfDrums() {
    if (this.profInvoice.productionDetails) {
      if (this.profInvoice.productionDetails.length > 0) {

        let totalDrums = 0;
        for (const pro of this.profInvoice.productionDetails) {
          totalDrums = totalDrums + pro.orderQuantity;

        }
        this.profInvoice.totalNos = totalDrums;
      }
    }
  }

  calNetDrumsWeight() {

    if (this.profInvoice.productionDetails) {
      if (this.profInvoice.productionDetails.length > 0) {

        let totalNetWeight = 0;
        for (const pro of this.profInvoice.productionDetails) {
          totalNetWeight = totalNetWeight + pro.qtyUOM;

        }
        this.profInvoice.totalNetWtKgs = totalNetWeight;
      }
    }

  }

  calGrossDrumsWeight() {

    if (this.profInvoice.productionDetails) {
      if (this.profInvoice.productionDetails.length > 0) {

        let totalGrossWeight = 0;
        for (const pro of this.profInvoice.productionDetails) {
          totalGrossWeight = totalGrossWeight + pro.qtyUOM + (pro.orderQuantity * pro.drumWeight);

        }
        this.profInvoice.totalGrossWtKgs = totalGrossWeight;
      }
    }

  }

  calProductAmount() {

    this.productDetails.productOrderAmount = Math.round(this.productDetails.qtyUOM * this.productDetails.orderRate);
    console.log(this.productDetails);

  }

  calProformaAmount() {

    if (this.profInvoice.productionDetails) {
      if (this.profInvoice.productionDetails.length > 0) {

        let proformaAmount = 0;
        for (const pro of this.profInvoice.productionDetails) {
          proformaAmount = proformaAmount + pro.productOrderAmount;

        }
        this.profInvoice.profInvoiceAmount = proformaAmount;
      }
    }

  }

  calTotalProformaAmount() {

    this.profInvoice.totalProfInvoiceAmount = this.profInvoice.profInvoiceAmount + this.profInvoice.oceanFreight;

  }


  addProductToGrid(num) {

    try {

      // -- order of calc matters a lot ------------------------


      // const index = this.profInvoice.productionDetails.findIndex(x => x.fPGroupCode === this.productDetails.fPGroupCode);

      // if (index > -1) {
      //   console.log('User is trying to update the details. So, add the details only one time');
      //   this.profInvoice.productionDetails.splice(index, 1);

      // }



      if (this.toAddGrid === 0) {
        console.log('User is trying to update the details. So, add the details only one time');
        this.profInvoice.productionDetails.splice(this.profInvoice.productionDetails.length - 1, 1);
      }

      this.toAddGrid = num;
      this.calProductAmount();
      const prodDetails = { ...this.productDetails };


      this.profInvoice.productionDetails.push(prodDetails);
      if (this.ngForm1.valid) {

        this.disableProformaFields = true;

      }


      console.log('After pushing the list', this.profInvoice);
      this.calTotalNumberOfDrums();
      this.calProformaAmount();
      this.calNetDrumsWeight();
      this.calGrossDrumsWeight();
      this.calTotalProformaAmount();

      if (num === 1 && this.productGroupList.length > 1) {
        this.productDetails = new ProductionDetails();
        // const ind = this.productGroupList.findIndex(x => x.groupCode === prodDetails.fPGroupCode);
        // this.productGroupList.splice(ind, 1);

      }


    } catch (err) {
      console.error(err);

    }

  }

  newProforma() {

    try {

      this.clrProforma();

    } catch (err) {
      console.error(err);

    }

  }



  saveProforma() {

    try {

      console.log('Before saving prof invoice', this.profInvoice);

      const index = this.profInvoice.productionDetails.findIndex(x => x.fPGroupCode === this.productDetails.fPGroupCode);

      if (index === -1) {
        console.log('User has not added the product in grid but wants to save unknowingly.');
        this.calProductAmount();


        const prodDetails = { ...this.productDetails };


        this.profInvoice.productionDetails.push(prodDetails);
        this.disableProformaFields = true;

        console.log('After pushing the list', this.profInvoice);
        this.calTotalNumberOfDrums();
        this.calProformaAmount();
        this.calNetDrumsWeight();
        this.calGrossDrumsWeight();
        this.calTotalProformaAmount();

      }


      console.log(JSON.stringify(this.profInvoice));

      this.profInvoice.employeeID = this.loginDetails.employeeId;

      this.proformaService.saveProformaInvoice(this.profInvoice).subscribe(res => {

        this.isSaved = true;
        this.alertService.success('Proforma Invoice saved successfully. Please keep ' + this.profInvoice.profInvNo + ' for reference');
        this.scrollToTop();
      }, error => {
        this.scrollToTop();
        console.log(error);
        this.alertService.error('Error in saving Profoma Invoice');
      });

    } catch (err) {
      console.error(err);

    }

  }

  findProforma() {

    try {

    } catch (err) {
      console.error(err);

    }

  }


  modifyProforma() {

    try {

    } catch (err) {
      console.error(err);

    }

  }




  clrProforma() {

    try {

      this.scrollToTop();
      // this.profInvoice = new ProformaInvoiceDetails();
      // this.productDetails = new ProductionDetails();
      if (this.ngForm1) {
        this.ngForm1.reset({ userName: this.loginDetails.userName, approvedEmployeeId: 12 });
      }

      if (this.ngForm2) {
        this.ngForm2.reset({ packUOM: 'KGS', rateUOM: 'KGS' });
      }

      this.disableProformaFields = false;
      this.isSaved = false;
      this.toAddGrid = -1;

      this.generateInvoiceNoAndDate();





    } catch (err) {
      console.error(err);

    }

  }

  deleteProductDetails() {

  }


  approveProforma() {

    try {

    } catch (err) {
      console.error(err);

    }

  }


  scrollToTop() {
    try {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error in Scrolling top!', error);
    }

  }


  scrollToBottom() {
    try {
      window.scroll({ top: 2000, left: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error in Scrolling bottom!', error);
    }

  }


  emptyProductVariety() {

    try {
      this.productVarietyList = [];
      this.emptyProductGrade();

    } catch (err) {

    }


  }

  emptyProductGrade() {
    try {
      this.productGradeList = [];
    } catch (err) {

    }

  }



}
