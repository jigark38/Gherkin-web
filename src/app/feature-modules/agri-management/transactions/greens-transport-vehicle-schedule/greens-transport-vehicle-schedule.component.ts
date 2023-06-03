import { startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatSelect, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GreenTransportVehicleScheduleService } from './greens-transport-vehicle-schedule.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
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
  selector: 'app-greens-transport-vehicle-schedule',
  templateUrl: './greens-transport-vehicle-schedule.component.html',
  styleUrls: ['./greens-transport-vehicle-schedule.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class GreensTransportVehicleScheduleComponent implements OnInit {
  selectedTransporterName: any;
  greenTransportVehicleScheduleForm: FormGroup;
  materialDetails = [];
  employeeId;
  employeeUserName;
  disableField = false;
  disableMaterialInfo = false;
  newFormInput = false;
  saveButton = true;
  findbutton = false;
  modifyButton = true;
  allEmployeList = [];
  areaList: any;
  locationDetails: any;
  employeeList = [];
  transportedNames = [];
  vehicleNos = [];
  driverContactNos = [];
  driverNames = [];
  allMaterialGroups = [];
  allMaterials = [];
  transportobj = {};
  rgpDetailList = [];
  gatePassNo = true;
  rgpList = [];
  selectedRowId = 0;
  disableGatePassField = true;
  min = 0;
  max = 10;
  greensTransVehicleDespNo = 0;
  transporterList = [];
  driverNameList = [];
  vehicleNoList = [];
  keyword = 'employeeName';
  driverIdSelected;
  disableDriverContact = true;
  modifyModeOn = false;
  transporterName;

  @ViewChild('dateofEntry', { static: false }) dateofEntry: ElementRef;
  @ViewChild('saveButtonField', { static: false }) saveButtonField: ElementRef;
  @ViewChild('datePassDate', { static: false }) datePassDate: ElementRef;
  @ViewChild('materialGroup', { static: false }) materialGroup: MatSelect;

  constructor(private readonly formBuilder: FormBuilder, private readonly authService: AuthenticationService,
    // tslint:disable-next-line: align
    private readonly alertService: AlertService,
    // tslint:disable-next-line: align
    private readonly dialog: MatDialog,
    // tslint:disable-next-line: align
    private readonly greenTransportVehicleScheduleService: GreenTransportVehicleScheduleService) { }

  ngOnInit() {
    this.formCreation();
    this.getOfficeLocationDetails();
    // this.GetAllEmployee();
    this.getAllMaterialGroup();
    this.disableField = true;
    this.disableDriverContact = true;
    this.disableGatePassField = true;
    this.disableMaterialInfo = true;
  }


  formCreation() {
    try {
      this.greenTransportVehicleScheduleForm = this.formBuilder.group({
        dateOfEntry: [
          '',
          [Validators.required]
        ],
        driverContactNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        totalNO: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        descriptionDetail: ['', [Validators.required]],
        materialName: ['', [Validators.required]],
        materialNameCode: ['', [Validators.required]],
        materialGroup: ['', [Validators.required]],
        materialGroupCode: ['', [Validators.required]],
        remarks: ['', [Validators.required]],
        timeOfDespatch: ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
        startKMSREading: ['', [Validators.required]],
        driverName: ['', [Validators.required]],
        vehicleNo: ['', [Validators.required]],
        transporterName: ['', [Validators.required]],
        returnableGatePassNo: ['', [Validators.required]],
        returnableGatePassDate: ['', [Validators.required]],
        supervisorStaff: ['', [Validators.required]],
        greensBranch: ['', [Validators.required]],
        formUnit: ['', [Validators.required]],
        loginUserName: ['', [Validators.required]],
      });
      this.employeeId = this.authService.getUserdetails().userId;
      this.employeeUserName = this.authService.getUserdetails().userName;
      this.greenTransportVehicleScheduleForm.controls.loginUserName.setValue(this.employeeUserName);
      this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.setValue(this.getCurrentTime());
      this.GetArea();
      this.getHiredTransporterList();
    } catch (error) {
      console.log('form creation error', error);
    }
  }

  getCurrentTime() {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    return time;
  }

  TimeOfDespatchChange() {
    try {
      if (this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.touched
        && this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.valid) {
        const from = this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.value;
        const fromVal = from.split(':');
        let fromMins = +fromVal[1];
        fromMins += fromVal[0] * 60;

        const durationMin = fromMins;
        const durationHrs = Math.trunc(durationMin / 60);
        const durationMins = durationMin % 60;
        this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.setValue(durationHrs + ':' + durationMins);

      } else {
        this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.setValue(this.getCurrentTime());
      }
    } catch (error) {
      console.log('Error on navbar getAllCropGroups: ', error);
    }
  }

  addNewVehicleInfo() {
    this.newFormInput = true;
    this.disableField = false;
    this.modifyModeOn = false;
    this.findbutton = true;
    this.disableGatePassField = false;
    this.disableMaterialInfo = false;
    this.disableDriverContact = false;
    this.GetArea();
    this.greenTransportVehicleScheduleForm.reset();
    this.greenTransportVehicleScheduleForm.controls.loginUserName.setValue(this.employeeUserName);
    this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.setValue(this.getCurrentTime());
    this.transportobj = {};
    this.materialDetails = [];
    this.greensTransVehicleDespNo = 0;
    this.getOfficeLocationDetails();
    // this.GetAllEmployee();
    this.getAllMaterialGroup();
    this.getHiredTransporterList();
    this.gatePassNo = true;
    this.dateofEntry.nativeElement.focus();
  }


  clearVehicleInfo() {
    this.newFormInput = false;
    this.disableField = true;
    this.disableGatePassField = true;
    this.disableMaterialInfo = true;
    this.saveButton = true;
    this.findbutton = false;
    this.modifyButton = true;
    this.GetArea();
    this.greenTransportVehicleScheduleForm.reset();
    this.greenTransportVehicleScheduleForm.controls.loginUserName.setValue(this.employeeUserName);
    this.greenTransportVehicleScheduleForm.controls.timeOfDespatch.setValue(this.getCurrentTime());
    this.transportobj = {};
    this.materialDetails = [];
    this.greensTransVehicleDespNo = 0;
    this.getOfficeLocationDetails();
    // this.GetAllEmployee();
    this.allEmployeList = [];
    this.getAllMaterialGroup();
    this.getHiredTransporterList();
    this.gatePassNo = true;
  }

  GetAllEmployee(areaId, dateOfEntry) {
    this.allEmployeList = [];
    if (areaId !== null && areaId !== '' && dateOfEntry !== null && dateOfEntry !== '') {
      this.greenTransportVehicleScheduleService.getGreensTransportVehicleBuyingSupervisor(areaId, dateOfEntry).subscribe((res: any) => {
        this.allEmployeList = res;
        this.employeeList = this.allEmployeList;
      },
        error => {
          this.alertService.error('Error while getting all employee!');
        });
    }
  }



  getfieldStaff() {
    try {
      const dateOfEntry = new Date(this.greenTransportVehicleScheduleForm.controls.dateOfEntry.value);
      const formattedDate = dateOfEntry.getFullYear() + '-' + (dateOfEntry.getMonth() + 1) + '-' + dateOfEntry.getDate();
      this.GetAllEmployee(
        this.greenTransportVehicleScheduleForm.controls.greensBranch.value,
        formattedDate);
      // if (areaCode && dateOfEntry) {
      // this.employeeList = this.allEmployeList;
      // }
    } catch (error) {
      console.log('get field staff method fail');
    }
  }

  GetArea() {
    this.areaList = null;
    this.greenTransportVehicleScheduleService.getAllAreaDetail().subscribe(res => {
      this.areaList = res;
    },
      error => {
        this.alertService.error('Error while getting area!');
      });
  }

  getOfficeLocationDetails() {
    this.locationDetails = null;
    this.greenTransportVehicleScheduleService.getOfficeLocationDetails().subscribe(res => {
      this.locationDetails = res;
    },
      error => {
        this.alertService.error('Error while getting Loaction Details!');
      });
  }

  getRGPInfo(event, formvalue) {
    if (this.rgpDetailList.length > 0) {
      this.gatePassNo = false;
      this.rgpList = [];
      this.rgpDetailList.forEach(element => {
        const date1 = new Date(formvalue.returnableGatePassDate);
        const date2 = new Date(element.rgpDate);
        if (date1.toDateString() === date2.toDateString()) {
          element.RGPNo = element.RGPNo.split('_');
          element.RGPNo = element.RGPNo[1];
          this.rgpList.push(element);
        }
      });
    } else {
      this.greenTransportVehicleScheduleService.getRGPNo().subscribe((res: any) => {
        res = res.split('_');
        res = res[1];
        this.greenTransportVehicleScheduleForm.controls.returnableGatePassNo.setValue(res);
      },
        error => {
          console.log('error', error);
          this.alertService.error('Error while getting rgp no!');
        });
    }
  }

  clearCascade(data) {
    console.log(data);
  }

  getAllMaterialGroup() {
    try {
      this.allMaterialGroups = [];
      this.greenTransportVehicleScheduleService.getAllMaterialGroup().subscribe((data: []) => {
        this.allMaterialGroups = data;
      },
        (error) => this.alertService.error('Error while getting material group!')
      );
    } catch (error) {
      console.log('Error on getAllMaterialGroup: ', error);
    }
  }


  materialGroupChange(event) {
    try {
      if (event) {
        const selectedGroup = this.allMaterialGroups.filter(p => p.Raw_Material_Group_Code === event.value)[0];
        if (selectedGroup) {
          this.greenTransportVehicleScheduleForm.controls.materialGroup.setValue(selectedGroup.Raw_Material_Group);
          this.getMaterialNameList(selectedGroup.Raw_Material_Group_Code);
        }
      } else {
        this.allMaterials = [];
      }
    } catch (error) {
      console.log('Error on materialGroupChange: ', error);
    }
  }

  materialNameChange(event) {
    try {
      if (event) {
        const materialData = this.allMaterials.filter(g => g.Raw_Material_Details_Code === event.value)[0];
        this.greenTransportVehicleScheduleForm.controls.materialName.setValue(materialData.Raw_Material_Details_Name);
      }
    } catch (error) {
      console.log('error on maerial name change', error);
    }
  }
  getMaterialNameList(groupCode: string) {
    try {
      this.greenTransportVehicleScheduleService.getAllMaterialByMaterialGroup(groupCode).subscribe((res: []) => {

        this.allMaterials = res;
      }, err => {
        this.allMaterials = [];
        this.alertService.error('Error while getting material name list!');
      });
    } catch (error) {
      console.log('Error on getMaterialNameList: ', error);
    }
  }

  updateTransportDetail(event, transportFormDetail) {
    if (this.selectedRowId !== 0) {
      this.materialDetails.forEach((element, index) => {
        if (element.slNo === this.selectedRowId) {
          const materialData = {
            slNo: this.materialDetails.length + 1,
            materialGroup: transportFormDetail.materialGroup,
            materailGroupCode: transportFormDetail.materialGroupCode,
            materialName: transportFormDetail.materialName,
            materialNameCode: transportFormDetail.materialNameCode,
            descDetails: transportFormDetail.descriptionDetail,
            // tslint:disable-next-line: radix
            totalNo: parseInt(transportFormDetail.totalNO),
            id: element.id
          };
          this.materialDetails[index] = materialData;
        }
      });
      this.createTransportObj(transportFormDetail);

      this.saveButton = false;
      setTimeout(() => this.saveButtonField.nativeElement.focus(), 0);
    } else {
      if (!isNaN(transportFormDetail.totalNO) && transportFormDetail.descriptionDetail !== ''
        && transportFormDetail.materialNameCode !== '' && transportFormDetail.materialGroupCode !== '') {
        this.showPopupDialog(transportFormDetail);
      }

    }
  }

  createTransportObj(transportFormDetail) {
    if (this.selectedRowId !== 0) {
      if (transportFormDetail.transporterName === 'OWN') {
        this.transportobj = {
          dateofEntry: this.updateDateFormate(transportFormDetail.dateOfEntry),
          loginUserName: this.employeeId,
          orgOfficeNo: transportFormDetail.formUnit,
          areaId: transportFormDetail.greensBranch,
          buyerEmpId: transportFormDetail.supervisorStaff,
          returnableGatePassDate: this.updateDateFormate(transportFormDetail.returnableGatePassDate),
          rgpNo: 'RGP_' + transportFormDetail.returnableGatePassNo,
          transporterName: transportFormDetail.transporterName,
          ownVehicleID: transportFormDetail.vehicleNo,
          driverID: this.driverIdSelected,
          driverContactNo: transportFormDetail.driverContactNo,
          startKMSReading: transportFormDetail.startKMSREading,
          timeOfDespatch: transportFormDetail.timeOfDespatch,
          remarks: transportFormDetail.remarks,
          GreenTransportMaterials: this.materialDetails,
          greensTransVehicleDespNo: this.greensTransVehicleDespNo
        };
      } else {
        this.transportobj = {
          dateofEntry: this.updateDateFormate(transportFormDetail.dateOfEntry),
          loginUserName: this.employeeId,
          orgOfficeNo: transportFormDetail.formUnit,
          areaId: transportFormDetail.greensBranch,
          buyerEmpId: transportFormDetail.supervisorStaff,
          returnableGatePassDate: this.updateDateFormate(transportFormDetail.returnableGatePassDate),
          rgpNo: 'RGP_' + transportFormDetail.returnableGatePassNo,
          transporterName: this.selectedTransporterName,
          hiredTransID: transportFormDetail.transporterName,
          hiredVehicleID: transportFormDetail.vehicleNo,
          driverName: transportFormDetail.driverName,
          driverContactNo: transportFormDetail.driverContactNo,
          startKMSReading: transportFormDetail.startKMSREading,
          timeOfDespatch: transportFormDetail.timeOfDespatch,
          remarks: transportFormDetail.remarks,
          GreenTransportMaterials: this.materialDetails,
          greensTransVehicleDespNo: this.greensTransVehicleDespNo
        };
      }
    } else {

      if (transportFormDetail.transporterName === 'OWN') {
        this.transportobj = {
          dateofEntry: this.updateDateFormate(transportFormDetail.dateOfEntry),
          loginUserName: this.employeeId,
          orgOfficeNo: transportFormDetail.formUnit,
          areaId: transportFormDetail.greensBranch,
          buyerEmpId: transportFormDetail.supervisorStaff,
          returnableGatePassDate: this.updateDateFormate(transportFormDetail.returnableGatePassDate),
          rgpNo: 'RGP_' + transportFormDetail.returnableGatePassNo,
          transporterName: transportFormDetail.transporterName,
          ownVehicleID: transportFormDetail.vehicleNo,
          driverID: this.driverIdSelected,
          driverContactNo: transportFormDetail.driverContactNo,
          startKMSReading: transportFormDetail.startKMSREading,
          timeOfDespatch: transportFormDetail.timeOfDespatch,
          remarks: transportFormDetail.remarks,
          GreenTransportMaterials: this.materialDetails,
          greensTransVehicleDespNo: this.greensTransVehicleDespNo
        };
      } else {
        this.transportobj = {
          dateofEntry: this.updateDateFormate(transportFormDetail.dateOfEntry),
          loginUserName: this.employeeId,
          orgOfficeNo: transportFormDetail.formUnit,
          areaId: transportFormDetail.greensBranch,
          buyerEmpId: transportFormDetail.supervisorStaff,
          returnableGatePassDate: this.updateDateFormate(transportFormDetail.returnableGatePassDate),
          rgpNo: 'RGP_' + transportFormDetail.returnableGatePassNo,
          transporterName: this.selectedTransporterName,
          hiredTransID: transportFormDetail.transporterName,
          hiredVehicleID: transportFormDetail.vehicleNo,
          driverName: transportFormDetail.driverName,
          driverContactNo: transportFormDetail.driverContactNo,
          startKMSReading: transportFormDetail.startKMSREading,
          timeOfDespatch: transportFormDetail.timeOfDespatch,
          remarks: transportFormDetail.remarks,
          GreenTransportMaterials: this.materialDetails,
          greensTransVehicleDespNo: this.greensTransVehicleDespNo
        };
      }
    }
  }

  showPopupDialog(transportFormDetail) {
    try {
      console.log('transport from detail', transportFormDetail);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you want to add more material details ?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // add the data to the grid
          this.addMaterialDataToList(transportFormDetail);
          this.materialGroup.focus();
          this.greenTransportVehicleScheduleForm.controls.materialGroup.reset();
          this.greenTransportVehicleScheduleForm.controls.materialName.reset();
          this.greenTransportVehicleScheduleForm.controls.descriptionDetail.reset();
          this.greenTransportVehicleScheduleForm.controls.totalNO.reset();
        } else {
          this.addMaterialDataToList(transportFormDetail);
          this.saveButton = false;
          setTimeout(() => this.saveButtonField.nativeElement.focus(), 0);
          this.createTransportObj(transportFormDetail);
        }

      });
    } catch (error) {
      console.log('showPopupDialog', error);
    }
  }

  addMaterialDataToList(transportFormDetail) {
    const materialData = {
      slNo: this.materialDetails.length + 1,
      materialGroup: transportFormDetail.materialGroup,
      materailGroupCode: transportFormDetail.materialGroupCode,
      materialName: transportFormDetail.materialName,
      materialNameCode: transportFormDetail.materialNameCode,
      descDetails: transportFormDetail.descriptionDetail,
      // tslint:disable-next-line: radix
      totalNo: parseInt(transportFormDetail.totalNO)
    };
    this.materialDetails.push(materialData);
  }

  updateDateFormate(dateUpdate) {
    try {
      const date = new Date(dateUpdate);
      date.setDate(date.getDate() + 1);
      return date.toISOString();
    } catch (error) {
      console.log('updateDateFormate', error);
    }
  }

  saveVehicleInfo() {
    if (this.modifyModeOn) {
      this.modifyTransportVehicleSchedule();
    } else {
      this.greenTransportVehicleScheduleService.saveAddGreensTransportVehicleSchedule(this.transportobj).subscribe(res => {
        console.log('response data obj', res);
        this.clearVehicleInfo();
        this.alertService.success('Transport Vehicle Details entered Successfully');
      },
        error => {
          console.log('error', error);
          this.alertService.error('Error while saving vehicle info!');
        });
    }
  }

  findVehicleInfo() {
    this.greenTransportVehicleScheduleService.getRGPDetail().subscribe((res: any) => {
      console.log('res rgp Fetail', res);
      this.rgpDetailList = res;
    },
      error => {
        console.log('error', error);
        this.alertService.error('Error while finding vehicle info!');
      });
    this.findbutton = true;
    this.disableGatePassField = false;
    this.datePassDate.nativeElement.focus();
  }

  getTransportInfoData(rgpCOde) {
    console.log('event data', rgpCOde);
    const rgpData = 'RGP_' + rgpCOde;
    if (rgpCOde) {
      this.greenTransportVehicleScheduleService.getGreensTransportVehicleDetail(rgpData).subscribe((resData: any) => {
        console.log('resData', resData);
        if (resData !== null) {
          this.materialDetails = [];
          this.modifyButton = false;
          const transportData = resData;
          this.greensTransVehicleDespNo = transportData.greensTransVehicleDespNo;
          transportData.GreenTransportMaterials.forEach(element => {
            const materialData = {
              slNo: this.materialDetails.length + 1,
              id: element.id,
              materialGroup: element.materailGroup,
              materailGroupCode: element.materailGroupCode,
              materialName: element.materialName,
              materialNameCode: element.materialNameCode,
              descDetails: element.descDetails,
              // tslint:disable-next-line: radix
              totalNo: parseInt(element.totalNo)
            };
            this.materialDetails.push(materialData);
          });
          transportData.dateofEntry = new Date(transportData.dateofEntry);
          transportData.dateofEntry = transportData.dateofEntry.getFullYear() + '-' + (transportData.dateofEntry.getMonth() + 1) + '-' + transportData.dateofEntry.getDate();
          this.GetAllEmployee(transportData.areaId, transportData.dateofEntry);
          this.greenTransportVehicleScheduleForm.patchValue({
            dateOfEntry: transportData.dateofEntry,
            formUnit: transportData.orgOfficeNo,
            greensBranch: transportData.areaId,
            supervisorStaff: transportData.buyerEmpId,
            transporterName: transportData.transporterName,
            driverContactNo: transportData.driverContactNo,
            startKMSREading: transportData.startKMSReading,
            timeOfDespatch: transportData.timeOfDespatch,
            remarks: transportData.remarks
          });
          this.getHiredTransporterList();
          this.transporterName = transportData.transporterName;
          if (transportData.transporterName === 'OWN') {
            this.greenTransportVehicleScheduleForm.controls.transporterName.setValue(transportData.transporterName);
            this.greenTransportVehicleScheduleForm.controls.vehicleNo.setValue(transportData.ownVehicleID);
            this.getAllDriverNames();
            this.getAllVehicle();
            this.greenTransportVehicleScheduleForm.controls.driverName.setValue(transportData.driverName);
          } else {
            this.greenTransportVehicleScheduleForm.controls.transporterName.setValue(transportData.hiredTransID);
            this.greenTransportVehicleScheduleForm.controls.vehicleNo.setValue(transportData.hiredVehicleID);
            this.getHiredVehicleList(transportData.hiredVehicleID);
            this.greenTransportVehicleScheduleForm.controls.driverName.setValue(transportData.driverName);
          }
        }
      }, error => {
        console.log('error', error);
        this.alertService.error('Error while getting transport info!');
      });
    }
  }

  modifyMaterialDetail(materialDetail) {
    this.selectedRowId = materialDetail.slNo;
    const event = {
      value: materialDetail.materailGroupCode
    };
    this.materialGroupChange(event);
    this.greenTransportVehicleScheduleForm.controls.materialGroupCode.setValue(materialDetail.materailGroupCode);
    this.greenTransportVehicleScheduleForm.controls.materialNameCode.setValue(materialDetail.materialNameCode);
    this.greenTransportVehicleScheduleForm.controls.materialGroup.setValue(materialDetail.materialGroup);
    this.greenTransportVehicleScheduleForm.controls.materialName.setValue(materialDetail.materialName);
    this.greenTransportVehicleScheduleForm.controls.descriptionDetail.setValue(materialDetail.descDetails);
    this.greenTransportVehicleScheduleForm.controls.totalNO.setValue(materialDetail.totalNo);
  }

  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }

  modifyVehicleInfo() {
    this.disableField = false;
    this.disableGatePassField = false;
    this.disableMaterialInfo = false;
    this.modifyModeOn = true;
    if (this.transporterName === 'OWN') {
      this.disableDriverContact = true;
    } else {
      this.disableDriverContact = false;
    }
  }

  modifyTransportVehicleSchedule() {
    console.log('this.transportobj', this.transportobj);
    this.greenTransportVehicleScheduleService.updateGreensTransportVehicleSchedule(this.transportobj).subscribe(res => {
      console.log('res', res);
      this.greensTransVehicleDespNo = 0;
      this.clearVehicleInfo();
      this.alertService.success('Data Updated Successfully');
    },
      error => {
        console.log('error', error);
        this.alertService.error('Error while modifying transport vehicle!');
      });
  }

  getTransporterName(event) {
    if (event === 'OWN') {
      this.getAllVehicle();
      this.getAllDriverNames();
    } else {
      this.driverNames = [];
      this.selectedTransporterName = '';
      var selectedRec = '';
      var selectedRecId = 0;
      this.transporterList.forEach(function (x, index) {
        if (x.hiredTransID === event) {
          selectedRec = x.transporterName;
        }
        if (isNaN(event) && x.transporterName === event) {
          selectedRecId = x.hiredTransID
        }
      });
      this.selectedTransporterName = selectedRec;
      if (isNaN(event)) {
        this.getHiredVehicleList(selectedRecId);
      }
      else {
        this.getHiredVehicleList(event);
      }
    }
  }

  getHiredTransporterList() {
    this.transporterList = [];
    const transport = {
      hiredTransID: 'OWN',
      transporterName: 'OWN'
    };
    this.transporterList.push(transport);
    this.greenTransportVehicleScheduleService.getHiredTransporterList().subscribe((res: any) => {
      console.log('transported detail', res);
      res.forEach(element => {
        this.transporterList.push(element);
      });
    },
      error => {
        console.log('error', error);
        this.alertService.error('Error while fetching hired transporter list!');
      });
  }

  getAllVehicle() {
    this.vehicleNoList = [];
    this.greenTransportVehicleScheduleService.getAllVehicles().subscribe((res: any) => {
      console.log('res', res);
      res.forEach(element => {
        const vehicleInfo = {
          vehicleRegNumber: element.vehicleRegNumber,
          id: element.ownVehicleId
        };
        this.vehicleNoList.push(vehicleInfo);
      });
    },
      error => {
        console.log('error', error);
        this.alertService.error('Error while all vehicle list!');
      });
  }

  getHiredVehicleList(hiredId) {
    if (hiredId) {
      this.vehicleNoList = [];
      this.greenTransportVehicleScheduleService.getHiredVehicleList(hiredId).subscribe((res: any) => {
        console.log('res ', res);
        res.forEach(element => {
          const vehicleInfo = {
            vehicleRegNumber: element.vehicleRegNumber,
            id: element.hiredVehicleID
          };
          this.vehicleNoList.push(vehicleInfo);
        });
      },
        error => {
          console.log('error ', error);
          this.alertService.error('Error while fetching Hired vehicle!');
        });
    }
  }

  driverNameChange(text) {
    console.log('text', text);
    const result = this.driverNames.filter(p => p.name.startWith(text));
    this.driverNames = result;
  }

  getAllDriverNames() {
    this.greenTransportVehicleScheduleService.getAllDriverNames().subscribe((res: any) => {
      console.log('res', res);
      this.driverNames = res;
      this.driverNames.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
      console.log('driverNames  ', this.driverNames);
    }, error => {
      console.log('error', error);
      this.alertService.error('Error while fetching all driver name!');
    });
  }

  selectEvent(event) {
    console.log('event ', event);
    this.driverIdSelected = event.driverId;
    this.disableDriverContact = true;
    this.greenTransportVehicleScheduleForm.controls.driverContactNo.setValue(event.empContactNo);

  }
}
