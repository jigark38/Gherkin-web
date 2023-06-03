import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../corecomponents/alert/alert.service';
import { MaterialTransferModel } from './mat-tran-to-area-office-ogp.model';
import { MatTranToAreaOfficeOgpService } from './mat-tran-to-area-office-ogp.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY HH:mm:ss',
  },
  display: {
    dateInput: 'DD-MMM-YYYY hh:mm:ss',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-mat-tran-to-area-office-ogp',
  templateUrl: './mat-tran-to-area-office-ogp.component.html',
  styleUrls: ['./mat-tran-to-area-office-ogp.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class MatTranToAreaOfficeOgpComponent implements OnInit {

  materialTransToOfficeForm: FormGroup;
  isGatePassClicked = false;
  isSubbmitted = false;
  isGridRowSelected = false;
  disblGatePassBtn = false;
  disblModifyBtn = false;
  disblPrintOGPBtn = false;
  selectedRow = new MaterialTransferModel();
  materialTransferList = new Array<MaterialTransferModel>();
  logedInUser = 'FURQAN';
  rowIndex = null;
  gridRowCountChecked = false;
  defaultDate = new Date();
  checkboxes: boolean[];

  @ViewChild('TransporterName', { static: false }) transporterNameEle: ElementRef;

  constructor(
    private materialTranService: MatTranToAreaOfficeOgpService,
    private alertService: AlertService, private authServie: AuthenticationService,) { }

  ngOnInit() {
    this.materialTransToOfficeForm = new FormGroup({
      EmployeeId: new FormControl(null, Validators.required),
      AreaName: new FormControl(null, Validators.required),
      OgpDate: new FormControl(null, Validators.required),
      OgpNumber: new FormControl(null, Validators.required),
      TransporterName: new FormControl(null, Validators.required),
      VehicleNumber: new FormControl(null, Validators.required),
      DriverName: new FormControl(null, Validators.required),
      DriverContactNumber: new FormControl(null),
      FieldStaff: new FormControl(null, Validators.required),
      FreightAmount: new FormControl(null, Validators.required),
      AdvanceAmount: new FormControl(null, Validators.required),
      ApproxMaterialAmount: new FormControl(null, Validators.required),
      DespatchDate: new FormControl(new Date(), Validators.required),
      Remarks: new FormControl(null, Validators.required),
    });
    this.materialTransToOfficeForm.disable();
  }

  resetForm() {
    this.materialTransToOfficeForm.reset();
    this.materialTransferList = new Array<MaterialTransferModel>();
    this.selectedRow = new MaterialTransferModel();
    this.isGatePassClicked = false;
    this.isSubbmitted = false;
    this.disblGatePassBtn = false;
    this.disblModifyBtn = false;
    this.disblPrintOGPBtn = false;
    this.isGridRowSelected = false;
    this.rowIndex = null;
    this.gridRowCountChecked = false;
  }

  gatePass() {
    this.isGatePassClicked = true;
    this.disblGatePassBtn = true;
    this.disblModifyBtn = true;
    this.disblPrintOGPBtn = true;
    this.materialTransferList = new Array<MaterialTransferModel>();
    this.materialTranService.getAllMaterialOutwardsDetails().subscribe(res => {
      this.gridRowCountChecked = true;
      this.materialTransferList = res;
    },
      error => {
        this.alertService.error('Error while getting material outward details!');
      });
  }

  onSave() {
    this.isSubbmitted = true;
    if (this.materialTransToOfficeForm.valid) {
      if (this.isGatePassClicked && this.isGridRowSelected) {
        // this.materialTransToOfficeForm.get('EmployeeId').enable();
        // this.materialTransToOfficeForm.get('AreaName').enable();
        // this.materialTransToOfficeForm.get('OgpDate').enable();
        // this.materialTransToOfficeForm.get('OgpNumber').enable();
        const formValue = this.materialTransToOfficeForm.value;
        let materialModel = new MaterialTransferModel();
        materialModel = formValue;
        materialModel.RmTransferNo = this.selectedRow.RmTransferNo;
        materialModel.TotalMaterial = this.selectedRow.TotalMaterial;
        materialModel.Id = 0;
        const userInfo = this.authServie.getUserdetails();
        materialModel.EmployeeId = Number(userInfo.employeeId);
        materialModel.DespatchDate = this.materialTransToOfficeForm.controls.DespatchDate.value;
        materialModel.OgpNumber = this.materialTransToOfficeForm.controls.OgpNumber.value;
        materialModel.OgpDate = this.materialTransToOfficeForm.controls.OgpDate.value;


        materialModel.AreaId = this.selectedRow.AreaId;
        //   console.log(materialModel);
        this.materialTranService.saveMaterialOutwardsDetails(materialModel).subscribe(res => {
          this.resetForm();
          this.alertService.success('Material transfer details saved sucessfully!');
        },
          error => {
            this.alertService.error('Error while saving all material transfer details!');
          });
      }
    }
  }

  onSelectRow(material, row) {
    if (material) {
      const userInfo = this.authServie.getUserdetails();
      this.rowIndex = row;
      this.selectedRow = material;
      this.materialTransToOfficeForm.enable();

      this.materialTransToOfficeForm.get('EmployeeId').setValue(userInfo.EmployeeId);
      this.materialTransToOfficeForm.get('EmployeeId').disable();
      this.materialTransToOfficeForm.get('AreaName').disable();
      this.materialTransToOfficeForm.get('OgpDate').disable();
      this.materialTransToOfficeForm.get('OgpNumber').disable();
      this.isGridRowSelected = true;
      this.materialTransToOfficeForm.patchValue(material);
      const now = new Date();
      this.materialTransToOfficeForm.controls['DespatchDate'].setValue(now);

      // this.materialTransToOfficeForm.controls.DespatchDate.setValue('');
      this.materialTransToOfficeForm.get('OgpDate').setValue(material.OgpDate);
      this.transporterNameEle.nativeElement.focus();
    }
  }

  disblSave() {
    if (this.materialTransToOfficeForm.valid) {
      return false;
    }
    return true;
  }

  clearClick() {
    this.resetForm();
  }

  selectedTblRow(row, i) {
    if (this.rowIndex === row) {
      this.checkboxes[i] = row.target.checked;
      return true;
    }
    return false;
  }


}
