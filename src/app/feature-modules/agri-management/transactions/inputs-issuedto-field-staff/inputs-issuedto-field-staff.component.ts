import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import {
  MatSelect, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatDatepicker, MatDatepickerInput, MatOptgroup
} from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';
import { InputIssuedToFieldStaffService } from './inputs-issued.service';
import {
  AreaDetails,
  CropDetailsByGroupCode, CropGroupDetailsByAreaId, EmpInfoByHarvestArea,
  PlantationSchDetailsByAreaID, OrgLocation, InputIssuedToFieldStaffMaterials
} from './inputs-issued.model';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../../../corecomponents/modal/modal.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, concat, forkJoin, from, of, empty } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-inputs-issuedto-field-staff',
  templateUrl: './inputs-issuedto-field-staff.component.html',
  styleUrls: ['./inputs-issuedto-field-staff.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MatDatepicker, MatDatepickerInput]
    },

    { provide: MatSelect, useValue: GHERKIN_DATE_FORMATS },
  ],
})


export class InputsIssuedtoFieldStaffComponent implements OnInit {
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild('saveFocus', { static: false }) saveFocus: ElementRef;
  @ViewChild('matOptGrp', { static: false }) matOptGrp: MatSelect;
  @ViewChild('YesBtn', { static: false }) yesBtn: ElementRef;
  employeeName = '';
  employeeId = '';
  locationDetails: any;
  areaDetails: any;
  empDetails: any;
  cropGroupDetails: any;
  cropDetails: any;
  plantationSchdls: any;
  materialStocksGrid1: any;
  materialStocksGrid2: any;
  packagePracticeDivision: any;
  packagePracticeMaterials: any;
  rawMaterialMaster: any;
  rawMaterialDetails: any;
  selectedRowId = 0;
  // matStocks: any[]=[{id:1, Batch_Date_/_Batch_No:'', Available_Stock_Qty :''}]
  batchDateNo: string;
  availableStockQty: number;
  issueQty: string;
  stockRate: string;
  mulQtyAndRate: string;
  qtyDisabled = true;
  editable = -1;
  seletedMatStockObj: any;
  outwaredGateAPIObj: any;
  saveFieldToMatObj: InputIssuedToFieldStaffMaterials[] = [];
  matFsNo: any;
  addIssueEnabled = true;
  saveEnabled = true;
  findEnabled = true;
  modifyEnabled = true;
  noDataFoundG1 = false;
  noDataFoundG2 = false;
  labelSelect = false;
  optgroup = '';
  branchAreaPlace = '';
  popIDsList: number[];
  areaId: '';

  fieldStaffForm = new FormGroup({
    Date_of_Issue: new FormControl('', [Validators.required]),
    Issued_from: new FormControl('', [Validators.required]),
    Branch_Area: new FormControl('', [Validators.required]),
    Name_of_Field_Staff: new FormControl('', [Validators.required]),
    Crop_Group: new FormControl('', [Validators.required]),
    Crop_Name: new FormControl('', [Validators.required]),
    Season_From_To: new FormControl('', [Validators.required]),
    Issued_By: new FormControl('', [Validators.required]),
    Outward_Gate_Pass_No: new FormControl(''),
    Outward_Gate_Pass_Date: new FormControl('', [Validators.required]),
  });

  constructor(private alertService: AlertService, private authService: AuthenticationService, private el: ElementRef,
    // tslint:disable-next-line: align
    private service: InputIssuedToFieldStaffService, private modalService: ModalService) { }

  ngOnInit() {
    try {
      this.resetForm();
      const emp = this.authService.getUserdetails();
      this.employeeName = emp.userName;
      this.employeeId = emp.employeeId;
    } catch (error) {
      this.resetForm();
    }
  }

  addIssues() {
    this.fieldStaffForm.enable();
    this.addIssueEnabled = false;
    this.saveEnabled = false;
    this.findEnabled = false;
    this.modifyEnabled = false;

    this.fieldStaffForm.controls.Date_of_Issue.setValue(new Date());
    this.fieldStaffForm.controls.Issued_By.setValue(this.employeeName);
    this.fieldStaffForm.controls.Issued_By.disable();

    this.fieldStaffForm.controls.Outward_Gate_Pass_Date.setValue(new Date());

    const getAllOrgOfficeLocDetails = this.service.getAllOrgOfficeLocDetails();
    const getAllAreaDetails = this.service.getAreaDetails();
    const getOutGatePassNo = this.service.getOutwaredGatePassNo();
    const getMatFSno = this.service.getMatIssueFSNoNo();

    forkJoin([getAllOrgOfficeLocDetails, getAllAreaDetails, getOutGatePassNo, getMatFSno]).subscribe((results) => {
      this.locationDetails = results[0];
      this.areaDetails = results[1];
      this.outwaredGateAPIObj = results[2];
      this.matFsNo = results[3];
      this.fieldStaffForm.controls.Outward_Gate_Pass_No.setValue(this.outwaredGateAPIObj);
      this.fieldStaffForm.controls.Outward_Gate_Pass_No.disable();
    },
      (error) => {
        this.alertService.error('Error while processing your request. Try Again!');
      });

    this.areaDetails = this.areaDetails.sort((a, b) => (a.areaName < b.areaName ? -1 : 1));
  }

  selectedGroup(e) {
    if (e !== null && e !== '') {
      this.labelSelect = true;
      this.optgroup = e.OrgOfficeName;

      // tslint:disable-next-line: no-string-literal
      this.fieldStaffForm.controls['Issued_from'].patchValue(e.OrgOfficeName);
      this.matOptGrp.close();
      // this.fieldStaffForm.controls.Issued_from.disable();
      this.branchAreaPlace = 'Select Branch Area';
      this.fieldStaffForm.controls.Branch_Area.enable();
      const control = this.el.nativeElement.querySelector('[formControlName="Branch_Area"]');
      control.focus();

    }
  }

  openOptGrp(): void {
    this.matOptGrp.open();
    this.labelSelect = !this.labelSelect;
  }

  getEmpDetailsByIssueFronDDL(e) {
    if (e !== null && e !== '') {
      this.service.getEmpInfoDetailsByAreaId(e.areaId).subscribe(
        (data) => {
          this.branchAreaPlace = e.areaName;
          // this.fieldStaffForm.controls.Branch_Area.patchValue(e.areaName);
          this.fieldStaffForm.controls.Branch_Area.disable();
          const control = this.el.nativeElement.querySelector('[formControlName="Name_of_Field_Staff"]');
          control.focus();
          this.empDetails = data;
        },
        (error) => {
          this.alertService.success('No Data Found. Try Again!');
        }
      );
    }
  }

  getEmpDetailsByAreaId(e) {
    if (e !== null && e !== '') {
      this.service.getEmpInfoDetailsByAreaId(e.areaId).subscribe(
        (data) => {
          this.empDetails = data;
        },
        (error) => {
          this.alertService.success('No Data Found. Try Again!');
        }
      );
    }
  }

  getCropGroupDetailsByAreaId(e) {
    if (e !== null && e !== '') {
      this.service.getCropDetailsByAreaId(e.areaID).subscribe(
        (data) => {
          this.areaId = e.areaID;
          this.cropGroupDetails = data;
          this.cropDetails = [];
        },
        (error) => {
          this.alertService.success('No Data Found. Try Again!');
        }
      );
    }
  }

  getCropNameByGroupCode(e) {
    if (e !== null && e !== '') {
      this.service.getCropNameByGroupCode(e.cropGroupCode).subscribe(
        (data) => {
          this.cropDetails = data;
          this.plantationSchdls = [];
        },
        (error) => {
          this.alertService.success('No Data Found. Try Again!');
        }
      );
    }
  }

  getSchDetailsByCropNameCode(e) {
    if (e !== null && e !== '') {
      this.plantationSchdls = [];
      this.service.getSchDetailsByCropNameCode(this.areaId).subscribe(
        (data) => {
          this.plantationSchdls = data;
        },
        (error) => {
          this.alertService.success('No Data Found. Try Again!');
        }
      );

    }
  }

  getHbomDetailsByCropNameCodeAndPsNum(e) {
    if (e !== null && e !== '') {
      const cropObj = this.fieldStaffForm.controls.Crop_Name.value;
      // console.log(cropObj.cropNameCode);
      // console.log(e.pSNumber);
      this.selectedRowId = 0;
      this.materialStocksGrid1 = [];
      this.service.getHbomDetailsByCropNameCodeAndPsNum(cropObj.cropNameCode, e.pSNumber).subscribe(
        (data: any[]) => {
          if (data.length > 0) {
            this.noDataFoundG1 = false;
            this.materialStocksGrid1 = data;
            this.popIDsList = data.map(ob => ob.id);

          } else {
            this.noDataFoundG1 = true;
            this.noDataFoundG2 = false;
            this.materialStocksGrid2 = [];
          }
        },
        (error) => {
          this.alertService.success('No Data Found. Try Again!');
        }
      );
    }
  }

  rowSelected(obj) {
    this.selectedRowId = obj.id;
    const dateObj = this.fieldStaffForm.controls.Date_of_Issue.value;
    this.seletedMatStockObj = obj;
    this.materialStocksGrid2 = [];
    this.service.getRMSStockGridA(formatDate(dateObj, 'yyyy-MM-dd', 'en_US'),
      obj.rawMaterialGroupCode, obj.rawMaterialDetailsCode).subscribe(
        (data: any[]) => {
          if (data.length > 0) {
            this.noDataFoundG2 = false;
            const resObj = data.filter(item => {
              return new Date(item.rmTransferDate) <= new Date(dateObj);
            });

            resObj.forEach((e) => {
              if (e.rmBatchNo_B !== 0) { // BATCH
                const sumOfBatchFSMatQty = e.rmGRNReceivedQty_B - e.sumRmMaterialTransferQty_B;
                e.sumBatchNoFSMatIssueQty = sumOfBatchFSMatQty - e.sumBatchNoFSMatIssueQty < 0 ? 0 :
                  sumOfBatchFSMatQty - e.sumBatchNoFSMatIssueQty;
                e.disabledGrid = e.sumBatchNoFSMatIssueQty > 0 ? false : true;
              } else { // STOCK
                const sumOfStockNoFSMatQty = e.rmStockLotGrnQty - e.sumRmMaterialTransferQty;
                e.sumStockNoFSMatIssueQty = sumOfStockNoFSMatQty - e.sumStockNoFSMatIssueQty < 0 ? 0 :
                  sumOfStockNoFSMatQty - e.sumStockNoFSMatIssueQty;
                e.disabledGrid = e.sumStockNoFSMatIssueQty > 0 ? false : true;
              }
            });

            this.materialStocksGrid2 = resObj;
            // console.log(this.materialStocksGrid2);
          } else {
            this.noDataFoundG2 = true;
          }

        },
        (error) => {
          this.alertService.error('Error while processing your request. Try Again!');
        }
      );
  }

  addQty(selectedRowObj, inputVal) {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });

    if (inputVal !== null && inputVal !== '') {

      const newFieldStaffObj = new InputIssuedToFieldStaffMaterials();

      if (selectedRowObj.rmBatchNo_B === 0) { // A
        const valueOfG1 = selectedRowObj.rmStockLotGrnRate;
        // selectedRowObj.sumStockNoFSMatIssueQty - selectedRowObj.sumRmMaterialTransferQty;

        this.mulQtyAndRate = (valueOfG1 * inputVal).toString();
        // newFieldStaffObj.rmMaterialTransferAmount = selectedRowObj.rmStockLotGrnRate;
      } else { // B
        const valuOfG2 = selectedRowObj.rmGRNMaterialwiseTotalRate_B;
        // selectedRowObj.sumBatchNoFSMatIssueQty - selectedRowObj.sumRmMaterialTransferQty_B;
        this.mulQtyAndRate = (valuOfG2 * inputVal).toString();
        // newFieldStaffObj.rmMaterialTransferAmount = selectedRowObj.rmGRNMaterialwiseTotalRate_B;
      }

      selectedRowObj.enteredAmount = this.mulQtyAndRate;

      this.seletedMatStockObj.totalIssuedQty = this.seletedMatStockObj.totalIssuedQty === null ? Number(inputVal) :
        this.seletedMatStockObj.totalIssuedQty + Number(inputVal);

      this.seletedMatStockObj.totalAmountSum = this.seletedMatStockObj.totalAmountSum === null ? Number(this.mulQtyAndRate) :
        Number(this.seletedMatStockObj.totalAmountSum) + Number(this.mulQtyAndRate);

      newFieldStaffObj.rmMaterialTransferAmount = +this.mulQtyAndRate;
      // console.log('GRID 1');
      // console.log(this.seletedMatStockObj);
      // console.log('GRID 2');
      // console.log(selectedRowObj);

      newFieldStaffObj.materialIssuedFSNo = this.matFsNo;
      newFieldStaffObj.inputsIssuedFSDate = this.fieldStaffForm.controls.Date_of_Issue.value;
      newFieldStaffObj.hbomPracticeNo = this.seletedMatStockObj.hbomPracticeNo;
      newFieldStaffObj.rawMaterialGroupCode = this.seletedMatStockObj.rawMaterialGroupCode;
      newFieldStaffObj.rawMaterialDetailsCode = this.seletedMatStockObj.rawMaterialDetailsCode;
      newFieldStaffObj.stockNo = selectedRowObj.stockNo;
      newFieldStaffObj.rmStockLOTGRNNo = selectedRowObj.rmmStockLOTGRNNo;
      newFieldStaffObj.rmStockLotGrnRate = selectedRowObj.rmStockLotGrnRate;
      newFieldStaffObj.rmGRNNO = selectedRowObj.rmGRNNo_B;
      newFieldStaffObj.rmGRNMaterialwiseTotalRate = selectedRowObj.rmGRNMaterialwiseTotalRate_B; // may be null
      newFieldStaffObj.FSMaterialIssuedQty = inputVal;
      newFieldStaffObj.ogpNO = this.outwaredGateAPIObj;
      newFieldStaffObj.rmBatchNo = selectedRowObj.rmBatchNo_B;
      newFieldStaffObj.ogpDate = this.fieldStaffForm.controls.Outward_Gate_Pass_Date.value;

      // tslint:disable-next-line: no-string-literal
      if (this.fieldStaffForm.controls.Issued_from.value !== null && this.labelSelect) {
        const orgofficeNo = this.locationDetails.filter(a => a.OrgOfficeName.toString().toLowerCase() ===
          // tslint:disable-next-line: no-string-literal
          this.fieldStaffForm.controls.Issued_from.value.toString().toLowerCase())[0].OrgOfficeNo;

        newFieldStaffObj.orgofficeNo = orgofficeNo; // IF AREA SELECTED THEN NULL
        newFieldStaffObj.areaID = null;
      } else {
        newFieldStaffObj.orgofficeNo = null;
        const areaID = this.areaDetails.filter(a => a.areaName.toLowerCase() ===
          // tslint:disable-next-line: no-string-literal
          this.fieldStaffForm.controls.Issued_from.value['areaName'].toLowerCase())[0].areaId;

        newFieldStaffObj.areaID = areaID;
      }

      const employeeID = this.empDetails.filter(a => a.employeeName.toLowerCase() ===
        // tslint:disable-next-line: no-string-literal
        this.fieldStaffForm.controls.Name_of_Field_Staff.value['employeeName'].toLowerCase())[0].employeeID;

      newFieldStaffObj.employeeID = employeeID;

      const cropGroupCode = this.cropGroupDetails.filter(a => a.cropGroupName.toLowerCase() ===
        // tslint:disable-next-line: no-string-literal
        this.fieldStaffForm.controls.Crop_Group.value['cropGroupName'].toLowerCase())[0].cropGroupCode;

      newFieldStaffObj.cropGroupCode = cropGroupCode;

      const cropNameCode = this.cropDetails.filter(a => a.cropName.toLowerCase() ===
        // tslint:disable-next-line: no-string-literal
        this.fieldStaffForm.controls.Crop_Name.value['cropName'].toLowerCase())[0].cropNameCode;

      newFieldStaffObj.cropNameCode = cropNameCode;

      const pSNumber = this.plantationSchdls.filter(a => a.seasonFromToDate.toLowerCase() ===
        // tslint:disable-next-line: no-string-literal
        this.fieldStaffForm.controls.Season_From_To.value['seasonFromToDate'].toLowerCase())[0].pSNumber;

      newFieldStaffObj.pSNumber = pSNumber;

      newFieldStaffObj.issuedByEmpId = this.employeeId;

      this.saveFieldToMatObj.push(newFieldStaffObj);
      this.modalService.open('AddMoreQty');
      this.yesBtn.nativeElement.focus();

    }
  }

  onCheckboxChange(e) {
    if (e !== null && e !== '') {
      this.editable = e;
    }
  }

  openNewPop() {
    this.modalService.close('AddMoreQty');
    console.log(this.selectedRowId);
    console.log(this.popIDsList);

    const index = this.popIDsList.indexOf(this.selectedRowId);
    if (index >= 0 && index < this.popIDsList.length - 1) {
      const nextItem = this.popIDsList[index + 1];

      const nextRowObj: any = this.materialStocksGrid1.filter(ob => ob.id == nextItem);
      console.log(nextRowObj);
      this.rowSelected(nextRowObj[0]);
    } else {
      this.saveEnabled = true;
      this.saveFocus.nativeElement.focus();
    }

  }

  onNoClick() {
    this.modalService.close('AddMoreQty');
    this.saveEnabled = true;
    this.saveFocus.nativeElement.focus();
  }

  save() {
    if (this.fieldStaffForm.valid) {
      this.saveEnabled = false;
      // console.log(this.saveFieldToMatObj);

      this.service.addToFieldStaffMaterials(this.saveFieldToMatObj).subscribe(
        (data) => {
          // console.log('saved =>', data);

          if (data) {
            this.alertService.success('Inputs Issued to Field Staff Inserted Successfully');
            this.resetForm();
          }
        },
        (error) => {
          console.log('error in saved =>', error);
          this.alertService.error('Error while processing your request. Try Again!');
        }
      );

    }
  }

  disable() {
    this.editable = -1;
  }

  scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  resetForm() {
    this.scrollToTop();
    this.fieldStaffForm.reset();
    this.fieldStaffForm.disable();
    this.selectedRowId = 0;
    this.locationDetails = [];
    this.areaDetails = [];
    this.empDetails = [];
    this.cropGroupDetails = [];
    this.cropDetails = [];
    this.plantationSchdls = [];
    this.materialStocksGrid1 = [];
    this.materialStocksGrid2 = [];
    this.packagePracticeDivision = [];
    this.packagePracticeMaterials = [];
    this.rawMaterialMaster = [];
    this.rawMaterialDetails = [];
    this.saveFieldToMatObj = [];
    this.addIssueEnabled = true;
    this.saveEnabled = false;
    this.findEnabled = true;
    this.modifyEnabled = true;
    this.labelSelect = false;
    this.branchAreaPlace = 'Select Branch Area';
  }

}
