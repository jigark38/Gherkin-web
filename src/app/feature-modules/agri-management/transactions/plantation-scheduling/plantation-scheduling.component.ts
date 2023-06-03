import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlantationSchedulingService } from './plantation-scheduling.service';
import { CropGrp, CropName, PlantationSchedul } from './plantation-scheduling.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MatSelect } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-plantation-scheduling',
  templateUrl: './plantation-scheduling.component.html',
  styleUrls: ['./plantation-scheduling.component.css'],
  providers: [],
})
export class PlantationSchedulingComponent implements OnInit {

  PlantationSchdlForm: FormGroup;
  dateValid = true;
  isDisabled = true;
  isSubmitted = false;
  croupGroupList: Array<CropGrp> = [];
  cropsList: Array<CropName> = [];
  isSearchClicked = false;
  plantationScheduleList: Array<PlantationSchedul> = [];
  isNewSchedule = false;
  isUpdateSchedule = false;
  disblNewPlantaBtn = false;
  disblFindBtn = false;
  disblModifyBtn = false;
  loginEmpDetails = [];

  @ViewChild('CropGroupDDL', { static: false }) cropGroupDDL: MatSelect;
  @ViewChild('PsDate', { static: false }) psDate: ElementRef;
  @ViewChild('saveCommand', { static: false }) saveCommand: ElementRef;
  @ViewChild('fromDate', { static: false }) fromDate: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private plantationSchedulingService: PlantationSchedulingService,
    private alertService: AlertService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getCroupGrp();
    this.PlantationSchdlForm = new FormGroup({
      PsDate: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
      PsNumber: new FormControl({ value: null, disabled: this.isDisabled }),
      CropGroupCode: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
      CropNameCode: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
      FromDate: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
      ToDate: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
      PreparedBy: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
      ApprovedBy: new FormControl({ value: null, disabled: this.isDisabled }, Validators.required),
    });

    const emp = this.authService.getUserdetails();
    this.loginEmpDetails.push(emp);
  }

  resetForm() {
    this.PlantationSchdlForm.reset();
    this.plantationScheduleList = new Array<PlantationSchedul>();
    this.PlantationSchdlForm.disable();
    this.isSubmitted = false;
    this.isSearchClicked = false;
    this.isUpdateSchedule = false;
    this.isNewSchedule = false;
    this.disblNewPlantaBtn = false;
    this.disblFindBtn = false;
    this.disblModifyBtn = false;
  }

  OnSubmit() {
    this.isSubmitted = true;
    const dateValid = this.isScheduleDateValid(
      this.PlantationSchdlForm.get('FromDate').value,
      this.PlantationSchdlForm.get('ToDate').value);
    if (!dateValid) {
      this.alertService.error('Seasion from date should be greater than to date');
      return;
    }
    if (this.isNewSchedule) {
      if (this.PlantationSchdlForm.valid) {
        this.plantationSchedulingService.addSchedulePlantation(this.PlantationSchdlForm.value).subscribe(res => {
          this.alertService.success('New plantation schedule added successfully');
          this.resetForm();
        },
          error => {
            this.alertService.error('Error while adding new schedule!');
          });
        this.isSubmitted = false;
      }
    } else if (this.isUpdateSchedule) {
      this.PlantationSchdlForm.enable();
      if (this.PlantationSchdlForm.valid) {
        let plantationSchedul = new PlantationSchedul();
        plantationSchedul = this.PlantationSchdlForm.value;
        this.plantationSchedulingService.updateSchedule(plantationSchedul).subscribe(res => {
          this.alertService.success('Updation of plantation schedule done successfully');
          this.resetForm();
        },
          error => {
            this.alertService.error('Error while updating schedule!');
          });
      }
      this.resetForm();
    }
    this.isSubmitted = false;
  }

  getCroupGrp() {
    this.plantationSchedulingService.getCroupGroup().subscribe(res => {
      this.croupGroupList = res;
    },
      error => {
        this.alertService.error('Error while adding field staff!');
      });
  }

  getCropName(grpCode) {
    this.plantationSchedulingService.getCropName().subscribe(res => {
      this.cropsList = res.filter(
        g => g.CropGroupCode === grpCode
      );
    },
      error => {
        this.alertService.error('Error while adding field staff!');
      });
  }
  getSchedulePlantations() {
    if (this.isSearchClicked) {
      this.plantationScheduleList = new Array<PlantationSchedul>();
      const crpGrp = this.PlantationSchdlForm.controls.CropGroupCode.value;
      const crpName = this.PlantationSchdlForm.controls.CropNameCode.value;
      this.plantationSchedulingService.getPlantationSchedule(crpGrp, crpName).subscribe(res => {
        this.plantationScheduleList = res;
      },
        error => {
          this.alertService.error('Error while fetching plantation schedule!');
        });
    }
  }

  populate(plantationSchedule) {
    try {
      this.PlantationSchdlForm.patchValue(plantationSchedule);
      if (this.isUpdateSchedule) {
        this.PlantationSchdlForm.controls.FromDate.enable();
        this.PlantationSchdlForm.controls.ToDate.enable();
      }
      this.fromDate.nativeElement.focus();
    } catch (error) {

    }
  }


  FindBtnClick() {
    try {
      this.resetForm();
      this.PlantationSchdlForm.controls.CropGroupCode.enable();
      this.PlantationSchdlForm.controls.CropNameCode.enable();
      this.cropGroupDDL.focus();
      this.isSearchClicked = true;
    } catch (error) {

    }
  }
  ModifyBtnClick() {
    this.resetForm();
    this.isUpdateSchedule = true;
    this.PlantationSchdlForm.controls.CropGroupCode.enable();
    this.PlantationSchdlForm.controls.CropNameCode.enable();
    this.PlantationSchdlForm.controls.FromDate.enable();
    this.PlantationSchdlForm.controls.ToDate.enable();
    this.cropGroupDDL.focus();
    this.plantationScheduleList = new Array<PlantationSchedul>();
    this.isSearchClicked = true;
    this.disblNewPlantaBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
  }

  ClearBtnClick() {
    this.resetForm();
  }

  NewPlantationClicked() {
    this.resetForm();
    this.isNewSchedule = true;
    this.PlantationSchdlForm.enable();
    this.PlantationSchdlForm.controls.PsNumber.disable();
    this.disblNewPlantaBtn = true;
    this.disblFindBtn = true;
    this.psDate.nativeElement.focus();
    this.disblModifyBtn = true;
  }

  changeGrpCodeToName(grpCode) {
    try {
      const cropGrpName = this.croupGroupList.filter(
        g => g.CropGroupCode === grpCode
      );
      return cropGrpName[0].Name;
    } catch (error) {

    }
  }

  changeCrpCodeToName(crpCode) {
    try {
      const cropName = this.cropsList.filter(
        g => g.CropCode === crpCode
      );
      return cropName[0].Name;
    } catch (error) {

    }
  }

  isScheduleDateValid(fromDate: Date, toDate: Date) {
    try {
      if (this.datePipe.transform(fromDate, 'dd-MM-yyyy') < this.datePipe.transform(toDate, 'dd-MM-yyyy')) {
        return true;
      } else {
        return false;
      }
    } catch (error) {

    }
  }

  getUserDetail(empid) {
    this.plantationSchedulingService.getEmployeeDetail(empid).subscribe(res => {
      return res.userName;
    });
  }
}
