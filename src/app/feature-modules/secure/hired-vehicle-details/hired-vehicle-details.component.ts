import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HiredTransporterDetail, HiredVehicleDetail, HiredVehicleDocument } from './hired-vehicle-details.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDatepicker, MatDialog, MatInput, MatSelect } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { HiredVehicleDetailsService } from './hired-vehicle-details.service';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { OwnVehicleDetailsService } from '../own-vehicle-details/own-vehicle-details.service';
import { GPSTrackingDevices } from '../own-vehicle-details/own-vehicle-details.model';


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
  selector: 'app-hired-vehicle-details',
  templateUrl: './hired-vehicle-details.component.html',
  styleUrls: ['./hired-vehicle-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HiredVehicleDetailsComponent implements OnInit {

  @ViewChild('dateOfEntry', { static: false }) dateOfEntry: ElementRef;
  @ViewChild('transporterAgencyName', { static: false }) transporterAgencyName: MatSelect;
  @ViewChild('vehicleType', { static: false }) vehicleType: MatSelect;
  @ViewChild('vehicleRegNumber', { static: false }) vehicleRegNumber: MatSelect;
  @ViewChild('documentName', { static: false }) documentName: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('modifyButton', { static: false }) modifyButton: ElementRef;

  isLoading: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  isAddVehicleMode: boolean;
  disableButton: boolean;
  isNewOn: boolean;

  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;

  hiredTransporterDetailsList: HiredTransporterDetail[];
  hiredVehicleDetailsList: HiredVehicleDetail[];
  selectedVehicleGPSDeviceForEdit: GPSTrackingDevices;
  selectedHiredVehicleForEdit: HiredVehicleDetail;

  hiredTransporterID: number;
  hiredVehicleID: number;
  gpsTrackingDeviceId: number;
  loggedInUserName: string;
  loggedInUserID: string;

  isGpsDeviceInvalid: boolean;
  isVehicleRegNoInvalid: boolean;
  isFileInvalid: boolean;
  isChassisNoInvalid: boolean;

  hiredVehicleDocuments: HiredVehicleDocument[];

  transporterForm = new FormGroup({
    EnteredBy: new FormControl('', [Validators.required]),
    DateOfEntry: new FormControl('', [Validators.required]),
    TransporterAgencyName: new FormControl('', [Validators.required]),
    ManagementDetails: new FormControl('', [Validators.required]),
    Address: new FormControl('', [Validators.required]),
    ContactNumber: new FormControl('', [Validators.required, Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)]),
    AlternateContactNumber: new FormControl('', [Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)]),
    EmailId: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)])
  });

  vehicleForm = new FormGroup({
    VehicleType: new FormControl('', [Validators.required]),
    VehicleMake: new FormControl('', [Validators.required]),
    VehicleDOP: new FormControl('', [Validators.required]),
    VehicleRegNumber: new FormControl('', [Validators.required]),
    VehicleChassisNo: new FormControl('', [Validators.required]),
    VehicleNosTyres: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    VehicleAvgMileage: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{0,2}\.\d{1,2})$|^\d{0,2}$/)]),
    VehicleRenewalDuration: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    VehicleMaxCapacity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)])
  });

  gpsTrackingDeviceForm = new FormGroup({
    GpsTrackingDeviceId: new FormControl(''),
    OwnVehicleID: new FormControl(''),
    HiredVehicleID: new FormControl(''),
    GpsDeviceNo: new FormControl('')
  });

  vehicleDocumentForm = new FormGroup({
    DocUploadNo: new FormControl(''),
    DocumentName: new FormControl(''),
    HiredVehicleID: new FormControl(''),
    DocumentDetails: new FormControl('')
  });

  constructor(public authService: AuthenticationService, public hiredVehicleDetailsService: HiredVehicleDetailsService,
              private alertService: AlertService, private ownVehicleDetailsService: OwnVehicleDetailsService, private dialog: MatDialog) { }

  ngOnInit() {
    try {
      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;

      this.hiredTransporterDetailsList = [];
      this.hiredVehicleDetailsList = [];
      this.hiredTransporterID = 0;
      this.hiredVehicleID = 0;

      const loggedInUser = this.authService.getUserdetails();
      this.loggedInUserID = loggedInUser.employeeId;
      this.loggedInUserName = loggedInUser.userName;
      this.transporterForm.controls.EnteredBy.setValue(this.loggedInUserName);
      this.transporterForm.controls.DateOfEntry.setValue(new Date());

      this.isGpsDeviceInvalid = false;
      this.isVehicleRegNoInvalid = false;
      this.isFileInvalid = false;
      this.isChassisNoInvalid = false;

      this.hiredVehicleDocuments = [];

      this.getExistingHiredTransportersList();

      this.transporterForm.disable();
      this.vehicleForm.disable();
      this.gpsTrackingDeviceForm.disable();
      this.vehicleDocumentForm.disable();

    } catch (error) {

    }
  }

  getExistingHiredTransportersList() {
    this.hiredVehicleDetailsService.GetHiredTransporterList().subscribe((data: HiredTransporterDetail[]) => {
      this.hiredTransporterDetailsList = data;
    });
  }

  getExistingHiredVehiclesListByTransporter() {
    this.hiredVehicleDetailsService.GetHiredVehicleList(this.hiredTransporterID).subscribe((data: HiredVehicleDetail[]) => {
      this.hiredVehicleDetailsList = data;
    });
  }

  gpsTrackingDeviceBlurred() {
    const gpsTrackingDeviceNo = this.gpsTrackingDeviceForm.controls.GpsDeviceNo.value;
    if (gpsTrackingDeviceNo && (!this.selectedVehicleGPSDeviceForEdit ||
      this.selectedVehicleGPSDeviceForEdit.gpsDeviceNo !== gpsTrackingDeviceNo)) {
      this.ownVehicleDetailsService.CheckDuplicateGPSTrackingDeviceNo(gpsTrackingDeviceNo).subscribe((data: boolean) => {
        this.isGpsDeviceInvalid = data;
      });
    } else {
      this.isGpsDeviceInvalid = false;
    }
  }

  vehicleChassisNoBlurred() {
    const vehicleChassisNo = this.vehicleForm.controls.VehicleChassisNo.value;
    if (vehicleChassisNo && (!this.selectedHiredVehicleForEdit ||
      this.selectedHiredVehicleForEdit.vehicleChassisNo !== vehicleChassisNo)) {
      this.hiredVehicleDetailsService.CheckDuplicateHiredVehicleChassisNo(vehicleChassisNo).subscribe((data: boolean) => {
        this.isChassisNoInvalid = data;
      });
    } else {
      this.isChassisNoInvalid = false;
    }
  }

  vehicleRegNoBlurred() {
    try {
      const vehicleRegNo = this.vehicleForm.controls.VehicleRegNumber.value;
      if (vehicleRegNo && this.hiredVehicleID === 0) {
        this.hiredVehicleDetailsService.CheckDuplicateHiredVehicleRegNo(vehicleRegNo).subscribe((data: boolean) => {
          this.isVehicleRegNoInvalid = data;
        });
      } else {
        this.isVehicleRegNoInvalid = false;
      }
    } catch (error) {

    }
  }

  onFileChange(event) {
    try {
      if (!event.target.files[0].type.toLowerCase().match('image/jp.*')
        && !event.target.files[0].type.toLowerCase().match('image/pn.*')
        && !event.target.files[0].type.toLowerCase().match('application/pd.*')) {
        this.isFileInvalid = true;
        return;
      }

      if (event && event.target.files && event.target.files.length) {
        this.isFileInvalid = false;
        const file: File = event.target.files[0];
        const docGivenName = this.vehicleDocumentForm.controls.DocumentName.value;
        const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
        if (!docGivenName) {
          this.vehicleDocumentForm.controls.DocumentName.setValue(name);
        }
        const vehicleDocument = new HiredVehicleDocument();
        vehicleDocument.documentName = name;
        vehicleDocument.documentDetails = file;
        vehicleDocument.hiredVehicleID = this.hiredVehicleID;
        // vehicleDocument.docUploadNo will be generated after vehicle is saved
        this.hiredVehicleDocuments.push(vehicleDocument);


        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more documents?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.documentName.nativeElement.focus();
            this.vehicleDocumentForm.controls.DocumentName.setValue('');
          } else {
            if (this.isFindOn) {
              this.modifyButton.nativeElement.focus();
              return;
            }
            this.saveButton.nativeElement.focus();
          }

        });
      }
    } catch (error) {

    }
  }

  downloadFile(document: HiredVehicleDocument) {
    try {

      if (!document.docUploadNo) {
        const blob = new Blob([document.documentDetails], { type: document.documentDetails.type });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const downloadURL = URL.createObjectURL(blob);
        window.open(downloadURL);

      } else {
        this.hiredVehicleDetailsService.GetHiredVehicleDocumentByDocId(document.docUploadNo).subscribe((data: Blob) => {

          const blob = new Blob([data], {
            type: document.documentName.toLowerCase().indexOf('.pdf') !== - 1 ?
              'application/pdf' : 'image/' + document.documentName.split('.')[1]
          });

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
          }
          const downloadURL = URL.createObjectURL(blob);
          window.open(downloadURL);
        });
      }
    } catch (error) {

    }
  }

  clearFormDetails() {
    try {
      this.isFindOn = false;
      this.isModifyOn = false;
      this.isAddVehicleMode = false;
      this.isNewOn = false;

      this.transporterForm.reset();
      this.transporterForm.disable();

      this.vehicleForm.reset();
      this.vehicleForm.disable();

      this.gpsTrackingDeviceForm.reset();
      this.gpsTrackingDeviceForm.disable();

      this.vehicleDocumentForm.reset();
      this.vehicleDocumentForm.disable();

      this.hiredTransporterID = 0;
      this.hiredVehicleID = 0;
      this.isGpsDeviceInvalid = false;
      this.isVehicleRegNoInvalid = false;
      this.isFileInvalid = false;
      this.isChassisNoInvalid = false;

      this.hiredVehicleDocuments = [];
      this.selectedVehicleGPSDeviceForEdit = null;
      this.selectedHiredVehicleForEdit = null;

      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;
      const loggedInUser = this.authService.getUserdetails();
      this.loggedInUserID = loggedInUser.employeeId;
      this.loggedInUserName = loggedInUser.userName;
      this.transporterForm.controls.EnteredBy.disable();
      this.transporterForm.controls.DateOfEntry.setValue(new Date());

    } catch (error) {

    }
  }

  newTransporter() {
    try {
      this.clearFormDetails();
      this.transporterForm.enable();
      this.transporterForm.controls.EnteredBy.setValue(this.loggedInUserName);
      this.transporterForm.controls.EnteredBy.disable();
      this.vehicleForm.enable();
      this.gpsTrackingDeviceForm.enable();
      this.vehicleDocumentForm.enable();
      this.focusDateOfEntry();
      this.enableNew = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;

      this.hiredTransporterID = 0;
      this.hiredVehicleID = 0;
      this.isNewOn = true;
    } catch (error) {

    }
  }

  saveTransporter() {
    if (this.isGpsDeviceInvalid) {
      return;
    }
    const transporter: HiredTransporterDetail = this.getTransporter();
    if (!transporter) {
      return;
    }

    this.disableButton = true;
    this.saveHiredTransporter();
  }

  saveHiredTransporter() {    
    const transporter = this.getTransporter();
    if (transporter.hiredTransID === 0) {      
      this.hiredVehicleDetailsService.CreateHiredTransporterDetails(transporter).subscribe((data: HiredTransporterDetail) => {
        this.alertService.success('Transporter created successfully.');
        this.hiredTransporterID = data.hiredTransID;
        this.saveHiredVehicle();
      });
    } else {
      this.hiredVehicleDetailsService.UpdateHiredTransporterDetails(transporter).subscribe((data: HiredTransporterDetail) => {
        this.alertService.success('Transporter updated successfully.');
        this.saveHiredVehicle();
      });      
    }
  }


  saveHiredVehicle() {
    if (this.isVehicleRegNoInvalid || this.isChassisNoInvalid || this.isGpsDeviceInvalid) {
      return;
    }

    const vehicle = this.getVehicle();
    if (vehicle.hiredVehicleID === 0) {
      this.hiredVehicleDetailsService.CreateHiredVehicleDetails(vehicle).subscribe((data: HiredVehicleDetail) => {
        this.alertService.success('Vehicle created successfully.');
        this.hiredVehicleID = data.hiredVehicleID;
        this.hiredTransporterID = data.hiredTransID;
        this.selectedHiredVehicleForEdit = data;
        this.saveVehicleGpsTrackingDevice();
      });
    } else {
      this.hiredVehicleDetailsService.UpdateHiredVehicleDetails(vehicle).subscribe((data: HiredVehicleDetail) => {
        this.alertService.success('Vehicle updated successfully.');
        this.selectedHiredVehicleForEdit = data;
        this.saveVehicleGpsTrackingDevice();
      });
    }
  }

  saveVehicleGpsTrackingDevice() {
    const gpsTrackingDeviceNo = this.gpsTrackingDeviceForm.controls.GpsDeviceNo.value;
    if (gpsTrackingDeviceNo) {
      const gpsTrackingDeviceNoModel = this.getGpsTrackingDeviceNo();
      if (gpsTrackingDeviceNoModel.gpsTrackingDeviceId === 0) {
        this.ownVehicleDetailsService.addGPSDevice(gpsTrackingDeviceNoModel).subscribe((data: GPSTrackingDevices) => {
          this.gpsTrackingDeviceId = data.gpsTrackingDeviceId;
          this.selectedVehicleGPSDeviceForEdit = data;
        });
      } else {
        this.ownVehicleDetailsService.updateGPSDevice(gpsTrackingDeviceNoModel).subscribe((data: GPSTrackingDevices) => {
          this.selectedVehicleGPSDeviceForEdit = data;
        });
      }
    }
    this.saveVehicleDocuments();
  }

  saveVehicleDocuments() {
    if (this.isFileInvalid) {
      return;
    }

    // generate document no. field
    this.hiredVehicleDocuments.forEach((document, index) => {
      document.docUploadNo = 'Doc_' + this.hiredVehicleID + '_Sl_' + (this.hiredVehicleDocuments.length + 1);
    });

    this.hiredVehicleDocuments.forEach((document, index) => {
      this.hiredVehicleDetailsService.CreateHiredVehicleDocuments(document).subscribe((data: HiredVehicleDocument) => {
        console.log(data);
      });
    });

    this.disableButton = false;
    this.clearFormDetails();
  }

  getTransporter() {
    try {
      if (this.transporterForm.disabled || this.transporterForm.valid) {
        const transporter = new HiredTransporterDetail();
        transporter.hiredTransID = this.hiredTransporterID;
        transporter.empCreatedID = this.loggedInUserID;
        transporter.dateOfEntry = new Date(this.transporterForm.controls.DateOfEntry.value).toLocaleString();        
        if (this.isNewOn) {
          transporter.transporterName = this.transporterForm.controls.TransporterAgencyName.value;
        } else {
          transporter.transporterName = this.hiredTransporterDetailsList.filter(a =>
            a.hiredTransID === this.transporterForm.controls.TransporterAgencyName.value)[0].transporterName;
        }       

        transporter.transporterManagementName = this.transporterForm.controls.ManagementDetails.value;
        transporter.transAddress = this.transporterForm.controls.Address.value;
        transporter.transContactNo = this.transporterForm.controls.ContactNumber.value;
        transporter.transAltContactNo = this.transporterForm.controls.AlternateContactNumber.value || 0;
        transporter.transMailId = this.transporterForm.controls.EmailId.value;
        return transporter;
      } else {
        this.markFieldAsTouched(this.transporterForm);
      }
    } catch (error) {

    }
  }

  getVehicle() {
    try {
      if (this.vehicleForm.disabled || this.vehicleForm.valid) {
        const vehicle = new HiredVehicleDetail();
        vehicle.hiredVehicleID = this.hiredVehicleID;
        vehicle.hiredTransID = this.hiredTransporterID;
        vehicle.vehicleType = this.vehicleForm.controls.VehicleType.value;
        vehicle.vehicleMake = this.vehicleForm.controls.VehicleMake.value;
        vehicle.vehicleDOP = new Date(this.vehicleForm.controls.VehicleDOP.value).toLocaleString();
        if (this.isModifyOn) {
          vehicle.vehicleRegNumber = this.hiredVehicleDetailsList.filter(a =>
            a.hiredVehicleID === this.vehicleForm.controls.VehicleRegNumber.value)[0].vehicleRegNumber;
        } else {
          vehicle.vehicleRegNumber = this.vehicleForm.controls.VehicleRegNumber.value;
        }

        vehicle.vehicleChassisNo = this.vehicleForm.controls.VehicleChassisNo.value;
        vehicle.vehicleNosTyres = this.vehicleForm.controls.VehicleNosTyres.value;
        vehicle.vehicleAvgMileage = this.vehicleForm.controls.VehicleAvgMileage.value;
        vehicle.vehicleRenewalDuration = this.vehicleForm.controls.VehicleRenewalDuration.value;
        vehicle.vehicleMaxCapacity = this.vehicleForm.controls.VehicleMaxCapacity.value;
        return vehicle;
      } else {
        this.markFieldAsTouched(this.vehicleForm);
      }
    } catch (error) {

    }
  }

  getGpsTrackingDeviceNo() {
    try {
      if (this.gpsTrackingDeviceForm.disabled || this.gpsTrackingDeviceForm.valid) {
        const gpsTrackingDevice = new GPSTrackingDevices();
        gpsTrackingDevice.gpsTrackingDeviceId = this.gpsTrackingDeviceId || 0;
        gpsTrackingDevice.hiredVehicleID = this.hiredVehicleID || 0;
        gpsTrackingDevice.gpsDeviceNo = this.gpsTrackingDeviceForm.controls.GpsDeviceNo.value;
        return gpsTrackingDevice;
      } else {
        this.markFieldAsTouched(this.gpsTrackingDeviceForm);
      }
    } catch (error) {

    }
  }

  setTransporter(transporter: HiredTransporterDetail) {
    try {

      this.hiredTransporterID = transporter.hiredTransID;

      this.transporterForm.controls.DateOfEntry.setValue(transporter.dateOfEntry);
      // this.transporterForm.controls.TransporterAgencyName.setValue(transporter.transporterName);
      this.transporterForm.controls.ManagementDetails.setValue(transporter.transporterManagementName);
      this.transporterForm.controls.Address.setValue(transporter.transAddress);
      this.transporterForm.controls.ContactNumber.setValue(transporter.transContactNo);
      if (transporter.transAltContactNo > 0) {
        this.transporterForm.controls.AlternateContactNumber.setValue(transporter.transAltContactNo);
      }
      this.transporterForm.controls.EmailId.setValue(transporter.transMailId);
    } catch (error) {

    }
  }

  setVehicle(vehicle: HiredVehicleDetail) {
    try {

      this.hiredVehicleID = vehicle.hiredVehicleID;
      this.hiredTransporterID = vehicle.hiredTransID;

      this.vehicleForm.controls.VehicleType.setValue(vehicle.vehicleType);
      this.vehicleForm.controls.VehicleMake.setValue(vehicle.vehicleMake);
      this.vehicleForm.controls.VehicleDOP.setValue(vehicle.vehicleDOP);
      // this.vehicleForm.controls.VehicleRegNumber.setValue(vehicle.vehicleRegNumber);
      this.vehicleForm.controls.VehicleChassisNo.setValue(vehicle.vehicleChassisNo);
      this.vehicleForm.controls.VehicleNosTyres.setValue(vehicle.vehicleNosTyres);
      this.vehicleForm.controls.VehicleAvgMileage.setValue(vehicle.vehicleAvgMileage);
      this.vehicleForm.controls.VehicleRenewalDuration.setValue(vehicle.vehicleRenewalDuration);
      this.vehicleForm.controls.VehicleMaxCapacity.setValue(vehicle.vehicleMaxCapacity);
    } catch (error) {

    }
  }

  setGpsTrackingDeviceNo(gpsTrackingDevice: GPSTrackingDevices) {
    try {
      this.gpsTrackingDeviceId = gpsTrackingDevice.gpsTrackingDeviceId;
      this.gpsTrackingDeviceForm.controls.GpsTrackingDeviceId.setValue(gpsTrackingDevice.gpsTrackingDeviceId);
      this.gpsTrackingDeviceForm.controls.GpsDeviceNo.setValue(gpsTrackingDevice.gpsDeviceNo);
      this.gpsTrackingDeviceForm.controls.HiredVehicleID.setValue(gpsTrackingDevice.hiredVehicleID);
    } catch (error) {

    }
  }

  markFieldAsTouched(form: FormGroup) {
    try {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    } catch (error) {

    }
  }

  addVehicle() {
    this.isModifyOn = false;
    this.isFindOn = false;
    this.isAddVehicleMode = true;

    this.enableNew = false;
    this.enableSave = true;
    this.enableFind = false;
    this.enableModify = false;
    this.transporterForm.controls.TransporterAgencyName.enable();
    this.focusTransporterAgencyName();
  }

  modifyTransporter() {
    this.isModifyOn = true;
    this.isFindOn = false;
    this.isAddVehicleMode = false;

    this.enableSave = true;
    this.enableNew = false;
    this.enableFind = false;
    this.enableModify = false;

    this.getExistingHiredTransportersList();

    this.transporterForm.controls.TransporterAgencyName.enable();
    this.focusTransporterAgencyName();
  }

  findTransporter() {
    this.isModifyOn = false;
    this.isFindOn = true;
    this.isAddVehicleMode = false;

    this.enableNew = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;

    this.getExistingHiredTransportersList();

    this.transporterForm.controls.TransporterAgencyName.enable();
    this.focusTransporterAgencyName();
  }

  onTransportAgencyNameBlurred() {
    try {
      const selectedTransporter = this.hiredTransporterDetailsList.filter(a =>
        a.hiredTransID === this.transporterForm.controls.TransporterAgencyName.value)[0];
      if (selectedTransporter) {
        this.hiredTransporterID = selectedTransporter.hiredTransID;
        this.setTransporter(selectedTransporter);

        if (this.isModifyOn) {
          setTimeout(() => {
            this.vehicleForm.controls.VehicleRegNumber.enable();
          }, 1);
          this.getExistingHiredVehiclesListByTransporter();
          this.focusVehicleRegNumber();
        } else if (this.isFindOn) {
          setTimeout(() => {
            this.vehicleForm.controls.VehicleRegNumber.enable();
          }, 1);

          this.getExistingHiredVehiclesListByTransporter();
          this.focusVehicleRegNumber();
        } else if (this.isAddVehicleMode) {
          this.transporterForm.disable();

          this.vehicleForm.enable();
          this.gpsTrackingDeviceForm.enable();
          this.vehicleDocumentForm.enable();

          this.getExistingHiredVehiclesListByTransporter();
          this.focusVehicleType();
        }
      }
    } catch (error) {

    }
  }

  onVehicleRegNoChanged() {
    try {
      const selectedVehicle = this.hiredVehicleDetailsList.filter(a =>
        a.hiredVehicleID === this.vehicleForm.controls.VehicleRegNumber.value)[0];
      if (selectedVehicle) {
        this.hiredVehicleID = selectedVehicle.hiredVehicleID;
        this.setVehicle(selectedVehicle);
        this.selectedHiredVehicleForEdit = selectedVehicle;
        if (this.isModifyOn) {
          this.transporterForm.enable();
          this.transporterForm.controls.EnteredBy.setValue(this.loggedInUserName);
          this.transporterForm.controls.EnteredBy.disable();
          this.transporterForm.controls.TransporterAgencyName.disable();

          this.vehicleForm.enable();
          this.vehicleForm.controls.VehicleRegNumber.disable();
          this.gpsTrackingDeviceForm.enable();
          this.vehicleDocumentForm.enable();
          this.focusDateOfEntry();
        }

        // fetch vehicle gps tracking device and documents here
        this.ownVehicleDetailsService.getVehicleGPSDeviceByHiredVehicleId(selectedVehicle.hiredVehicleID)
          .subscribe((data: GPSTrackingDevices) => {
            this.setGpsTrackingDeviceNo(data);
            this.selectedVehicleGPSDeviceForEdit = data;

            this.hiredVehicleDetailsService.GetHiredVehicleDocumentsList(selectedVehicle.hiredVehicleID)
              .subscribe((data2: HiredVehicleDocument[]) => {
                this.hiredVehicleDocuments = data2;
              });
          });
      }
    } catch (error) {

    }
  }

  focusDateOfEntry() {
    setTimeout(() => {
      this.dateOfEntry.nativeElement.focus();
    }, 50);
  }

  focusTransporterAgencyName() {
    setTimeout(() => {
      this.transporterAgencyName.focus();
      // this.transporterAgencyName.open();
    }, 50);
  }

  focusVehicleRegNumber() {
    setTimeout(() => {
      this.vehicleRegNumber.focus();
      // this.vehicleRegNumber.open();
    }, 50);
  }

  focusVehicleType() {
    setTimeout(() => {
      this.vehicleType.focus();
      // this.vehicleType.open();
    }, 50);
  }

}
