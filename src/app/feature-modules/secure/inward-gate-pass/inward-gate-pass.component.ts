import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelect, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { InwardGatePassModel, OfficeLocationModel } from './inward-gate-pass.models';
import { InwardGatePassService } from './inward-gate-pass.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { InwardSearchComponent } from './inward-search/inward-search.component';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MomentUtcDateAdapter } from 'src/app/shared/directives/moment-utc-date-adapter';
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
  selector: 'app-inward-gate-pass',
  templateUrl: './inward-gate-pass.component.html',
  styleUrls: ['./inward-gate-pass.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentUtcDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class InwardGatePassComponent implements OnInit {

  @ViewChild('inwardTypeElement', { static: false }) inwardTypeElement: MatSelect;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('unitLocationField', { static: false }) unitLocationField: MatSelect;

  actions: any = { enabled: true, showEdit: true };
  selectedInwardGatePassEdit: InwardGatePassModel;
  isModifyMode: boolean;
  officeLocationList: OfficeLocationModel[] = [];
  constructor(public authService: AuthenticationService,
    // tslint:disable-next-line: align
    private inwardGatePassService: InwardGatePassService, private alertService: AlertService,
    // tslint:disable-next-line: align
    private dialog: MatDialog,
    // tslint:disable-next-line: align
    private datePipe: DatePipe) { }

  inwardGatePassForm = new FormGroup({
    unitLocation: new FormControl('', [Validators.required]),
    inwardType: new FormControl('', [Validators.required]),
    inwardDateTime: new FormControl('', [Validators.required]),
    inwardNo: new FormControl(''),
    supplierTransporterName: new FormControl('', [Validators.required]),
    supplierTransportPlace: new FormControl('', [Validators.required]),
    invDcNo: new FormControl(''),
    invDcDate: new FormControl(''),
    invVehicleNo: new FormControl(''),
    driverName: new FormControl(''),
    receivedMaterialName: new FormControl(''),
    receivedQuantity: new FormControl('', [Validators.pattern(/^(?:\d{0,7}\.\d{1,3})$|^\d{0,7}$/)]),
    employeeNo: new FormControl('', [Validators.required]),
    inwardRemarks: new FormControl('')
  });

  enableNewInward: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  isFindMode: boolean;
  inwardGatePassList: InwardGatePassModel[] = [];
  orgCols: any[];
  employeeId: string;
  employeeName: string;
  ngOnInit() {
    try {
      this.enableNewInward = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;
      const emp = this.authService.getUserdetails();
      this.employeeName = emp.userName;
      this.employeeId = emp.employeeId;
      this.inwardGatePassForm.disable();
      this.inwardGatePassForm.controls.inwardNo.disable();
      this.inwardGatePassForm.controls.employeeNo.disable();
      this.inwardGatePassForm.controls.employeeNo.setValue(this.employeeName);
      this.initData();
      this.getOfficeLocations();

    } catch (error) {

    }
  }

  initData() {

    this.orgCols = [
      // take field name from table
      { field: 'inwardDateTime', header: 'Date & Time' },
      { field: 'inwardGatePassNo', header: 'Inward No' },
      { field: 'supplierTransporterName', header: 'Supplier/Transporter Name' },
      { field: 'supplierTransportPlace', header: 'Place' },
      { field: 'invVehicleNo', header: 'Vehicle No' },
      { field: 'employeeNo', header: 'Entered By' },
      { field: 'inwardRemarks', header: 'Remarks' },
    ];

  }

  blurRemarks() {
    try {
      if (this.inwardGatePassForm.valid) {
        this.enableNewInward = false;
        this.enableSave = true;
        this.enableFind = false;
        this.enableModify = false;
        this.saveButton.nativeElement.focus();
      }
    } catch (error) {

    }
  }

  getOfficeLocations() {
    try {
      this.inwardGatePassService.getOfficeLocations().subscribe((data: OfficeLocationModel[]) => {
        if (data) {
          this.officeLocationList = data;
        }
      }, err => {
        this.officeLocationList = [];
        // this.alertService.error('');
      });
    } catch (error) {

    }
  }

  clearPackOfPracDetails() { }

  //#region buttons opeations

  markFieldAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  changeInwardType(e) {
    try {
      if ((this.isFindMode || (this.isModifyMode && !this.selectedInwardGatePassEdit))
        && this.inwardGatePassForm.controls.inwardType.value) {

        const dialogRef = this.dialog.open(InwardSearchComponent, {
          width: '550px',
          data: this.inwardGatePassForm.controls.inwardType.value
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            result.map(a => {
              a.inwardDateTime = this.datePipe.transform(a.inwardDateTime, 'dd-MMM-yyyy');
            });
            this.inwardGatePassList = result;
            this.enableSave = false;
          }
        });
      }

    } catch (error) {
    }
  }

  find() {
    try {
      this.isFindMode = true;
      this.enableNewInward = false;
      this.enableSave = false;
      this.enableFind = false;
      this.enableModify = false;
      this.inwardGatePassForm.controls.inwardType.enable();
      this.inwardTypeElement.focus();
    } catch (error) {

    }
  }

  getEditItem(item: InwardGatePassModel) {
    if (this.isFindMode) {
      this.inwardGatePassForm.disable();
    }
    if (this.isModifyMode) {
      this.inwardGatePassForm.enable();
      this.enableSave = true;
      this.inwardGatePassForm.controls.inwardNo.disable();
      this.inwardGatePassForm.controls.employeeNo.disable();
      this.inwardGatePassForm.controls.employeeNo.setValue(this.employeeName);
    }
    this.selectedInwardGatePassEdit = new InwardGatePassModel();
    this.selectedInwardGatePassEdit = item;
    this.setInwardGatePass();
  }

  getInwardGatePass() {
    try {
      const inwardGatePass = new InwardGatePassModel();
      inwardGatePass.id = this.selectedInwardGatePassEdit ? this.selectedInwardGatePassEdit.id : null;
      inwardGatePass.orgOfficeNo = this.inwardGatePassForm.controls.unitLocation.value;
      inwardGatePass.inwardType = this.inwardGatePassForm.controls.inwardType.value;
      inwardGatePass.inwardDateTime = new Date(this.inwardGatePassForm.controls.inwardDateTime.value).toISOString();
      inwardGatePass.inwardGatePassNo = this.inwardGatePassForm.controls.inwardNo.value;
      inwardGatePass.supplierTransporterName = this.inwardGatePassForm.controls.supplierTransporterName.value;
      inwardGatePass.supplierTransportPlace = this.inwardGatePassForm.controls.supplierTransportPlace.value;
      inwardGatePass.invDcNo = this.inwardGatePassForm.controls.invDcNo.value;
      inwardGatePass.invDcDate = new Date(this.inwardGatePassForm.controls.invDcDate.value).toLocaleDateString();
      inwardGatePass.invVehicleNo = this.inwardGatePassForm.controls.invVehicleNo.value;
      inwardGatePass.driverName = this.inwardGatePassForm.controls.driverName.value;
      inwardGatePass.receivedMaterialName = this.inwardGatePassForm.controls.receivedMaterialName.value;
      inwardGatePass.receivedQuantity = this.inwardGatePassForm.controls.receivedQuantity.value;
      inwardGatePass.employeeNo = this.employeeId;
      inwardGatePass.inwardRemarks = this.inwardGatePassForm.controls.inwardRemarks.value;
      return inwardGatePass;
    } catch (error) {

    }
  }

  setInwardGatePass() {
    try {
      if (this.selectedInwardGatePassEdit) {
        this.inwardGatePassForm.controls.unitLocation.setValue(this.selectedInwardGatePassEdit.orgOfficeNo);
        this.inwardGatePassForm.controls.inwardType.setValue(this.selectedInwardGatePassEdit.inwardType);
        this.inwardGatePassForm.controls.inwardDateTime.setValue(new Date(this.selectedInwardGatePassEdit.inwardDateTime));
        this.inwardGatePassForm.controls.inwardNo.setValue(this.selectedInwardGatePassEdit.inwardGatePassNo);
        this.inwardGatePassForm.controls.supplierTransporterName.setValue(this.selectedInwardGatePassEdit.supplierTransporterName);
        this.inwardGatePassForm.controls.supplierTransportPlace.setValue(this.selectedInwardGatePassEdit.supplierTransportPlace);
        this.inwardGatePassForm.controls.invDcNo.setValue(this.selectedInwardGatePassEdit.invDcNo);
        this.inwardGatePassForm.controls.invDcDate.setValue(this.selectedInwardGatePassEdit.invDcDate);
        this.inwardGatePassForm.controls.invVehicleNo.setValue(this.selectedInwardGatePassEdit.invVehicleNo);
        this.inwardGatePassForm.controls.driverName.setValue(this.selectedInwardGatePassEdit.driverName);
        this.inwardGatePassForm.controls.receivedMaterialName.setValue(this.selectedInwardGatePassEdit.receivedMaterialName);
        this.inwardGatePassForm.controls.receivedQuantity.setValue(this.selectedInwardGatePassEdit.receivedQuantity);
        this.inwardGatePassForm.controls.employeeNo.setValue(this.employeeName);
        this.inwardGatePassForm.controls.inwardRemarks.setValue(this.selectedInwardGatePassEdit.inwardRemarks);
      }
    } catch (error) {

    }
  }

  save() {
    try {
      if (!this.inwardGatePassForm.valid) {
        this.markFieldAsTouched(this.inwardGatePassForm);
      } else {
        if (!this.isModifyMode && !this.selectedInwardGatePassEdit) {
          // Create
          const inwardGatePass = this.getInwardGatePass();
          this.inwardGatePassService.createMaterialInward(inwardGatePass).subscribe((data: InwardGatePassModel) => {
            if (data) {
              this.clear();
              this.alertService.success('Inward & Gate Pass created successfully.');
            }
          }, err => {
            this.alertService.error('Error has occured while saving Inward & Gate Pass.');
          });
        } else if (this.isModifyMode && this.selectedInwardGatePassEdit) {
          // Update

          this.modifyItem();
        }

      }
    } catch (error) {

    }
  }

  modify() {
    try {
      this.isModifyMode = true;
      this.enableNewInward = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
      this.inwardGatePassForm.controls.inwardType.enable();
      this.inwardTypeElement.focus();
    } catch (error) {

    }
  }

  modifyItem() {
    try {
      if (this.selectedInwardGatePassEdit && this.inwardGatePassForm.valid) {
        const inwardObj = this.getInwardGatePass();
        this.inwardGatePassService.updateMaterialInward(this.selectedInwardGatePassEdit.id,
          inwardObj).subscribe((data: InwardGatePassModel) => {
            if (data) {
              this.inwardGatePassList.forEach(inwardGatePass => {
                // tslint:disable-next-line: triple-equals
                if (inwardGatePass.id == data.id) {
                  inwardGatePass.id = data.id;
                  inwardGatePass.inwardType = data.inwardType;
                  inwardGatePass.inwardDateTime = data.inwardDateTime;
                  inwardGatePass.inwardDateTime = this.datePipe.transform(data.inwardDateTime, 'dd-MMM-yyyy');
                  inwardGatePass.inwardGatePassNo = data.inwardGatePassNo;
                  inwardGatePass.supplierTransporterName = data.supplierTransporterName;
                  inwardGatePass.supplierTransportPlace = data.supplierTransportPlace;
                  inwardGatePass.invDcNo = data.invDcNo;
                  inwardGatePass.invDcDate = data.invDcDate;
                  inwardGatePass.invVehicleNo = data.invVehicleNo;
                  inwardGatePass.driverName = data.driverName;
                  inwardGatePass.receivedMaterialName = data.receivedMaterialName;
                  inwardGatePass.receivedQuantity = data.receivedQuantity;
                  inwardGatePass.employeeNo = data.employeeNo;
                  inwardGatePass.inwardRemarks = data.inwardRemarks;
                }
              });
              this.alertService.success('Inward & Gate Pass updated successfully.');
              this.clear();
            }
          }, err => {
            this.alertService.error('Error has occured while updating Inward & Gate Pass.');
          });
      } else {
        this.markFieldAsTouched(this.inwardGatePassForm);
      }
    } catch (error) {

    }
  }



  newInward() {
    try {
      this.inwardGatePassForm.enable();
      this.inwardGatePassForm.controls.inwardNo.disable();
      this.inwardGatePassForm.controls.employeeNo.disable();
      this.inwardGatePassForm.controls.employeeNo.setValue(this.employeeName);
      this.unitLocationField.focus();
      this.enableNewInward = false;
      this.enableSave = false;
      this.enableModify = false;
      this.enableFind = false;
      this.inwardGatePassForm.controls.inwardDateTime.setValue(new Date());
    } catch (error) {

    }
  }
  clear() {
    try {

      this.inwardGatePassForm.reset();
      this.inwardGatePassForm.disable();
      this.inwardGatePassForm.controls.inwardNo.disable();
      this.inwardGatePassForm.controls.employeeNo.disable();
      this.inwardGatePassForm.controls.employeeNo.setValue(this.employeeName);
      this.enableNewInward = true;
      this.enableSave = false;
      this.enableModify = true;
      this.enableFind = true;
      this.selectedInwardGatePassEdit = null;
      this.inwardGatePassList = [];
      this.isFindMode = false;
      this.isModifyMode = false;
    } catch (error) {

    }
  }
  //#endregion

}
