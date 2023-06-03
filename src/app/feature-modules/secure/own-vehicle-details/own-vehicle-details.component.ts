import { Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import {
  GPSTrackingDevices,
  OwnVehiclesDetails,
  OwnVehicleDocuments
} from './own-vehicle-details.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDatepicker, MatDialog, MatInput, MatSelect } from '@angular/material';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Observable, concat, forkJoin } from 'rxjs';
import { debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { CameraCaptureDialogComponent } from 'src/app/corecomponents/camera-capture-dialog/camera-capture-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { OwnVehicleDetailsService } from './own-vehicle-details.service';
import { RegexMaster } from 'src/app/shared/regex.master';
import { OfficeLocationModel } from 'src/app/feature-modules/secure/inward-gate-pass/inward-gate-pass.models';
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


@Component({
  selector: 'app-own-vehicle-details',
  templateUrl: './own-vehicle-details.component.html',
  styleUrls: ['./own-vehicle-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class OwnVehicleDetailsComponent implements OnInit {
  @ViewChild('dateOfEntry', { static: false }) dateOfEntry: ElementRef;
  @ViewChild('registrationNumber', { static: false }) registrationNumber: ElementRef;
  @ViewChild('documentName', { static: false }) documentName: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;
  @ViewChild('modifyButton', { static: false }) modifyButton: ElementRef;
  @ViewChild('formDirective', { static: false }) formDirective: FormGroupDirective;
  @ViewChild('registrationNumberSelect', { static: false }) registrationNumberSelect: MatSelect;
  actions: any = { enabled: true, showEdit: true };
  vehicleForm = new FormGroup({
    EnteredBy: new FormControl('', [Validators.required]),
    DateOfEntry: new FormControl('', [Validators.required]),
    VehicleType: new FormControl('', [Validators.required]),
    VehicleMake: new FormControl('', [Validators.required]),
    DateOfPurchase: new FormControl('', [Validators.required]),
    RegistrationNumber: new FormControl('', [Validators.required]),
    ChassisNumber: new FormControl('', [Validators.required]),
    Tyres: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{0,2}$/)]),
    Mileage: new FormControl('', [Validators.required, Validators.pattern(/^\d{0,2}(\.\d{0,2})?$/)]),
    PermitDuration: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{0,2}$/)]),
    Capacity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{0,5}$/)]),
    GPSDeviceNumber: new FormControl(''),
    DocumentName: new FormControl(''),
    UploadDocument: new FormControl('')
  });
  isLoading: boolean;
  isFindOn: boolean;
  isModifyOn: boolean;
  disableButton: boolean;
  isFileError: boolean;
  enableNew: boolean;
  enableSave: boolean;
  enableFind: boolean;
  enableModify: boolean;
  documentList: OwnVehicleDocuments[] = [];
  selectedVehicleForEdit: OwnVehiclesDetails;
  selectedVehicleGPSDeviceForEdit: GPSTrackingDevices;
  registrationNumberError: boolean = null;
  gpsDeviceError: boolean = null;
  chasisNumberError: boolean = null;
  constructor(
    public authService: AuthenticationService,
    private ownVehicleDetailsService: OwnVehicleDetailsService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private alertService: AlertService) {

  }
  enteredById: string;
  enteredByName: string;
  RegistrationNumberList: OwnVehiclesDetails[];
  RegistrationNumberListOptions: string[] = [];
  ngOnInit() {
    try {

      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;
      this.gpsDeviceError = false;
      const loggedInUser = this.authService.getUserdetails();
      this.enteredById = loggedInUser.employeeId;
      this.enteredByName = loggedInUser.userName;
      this.vehicleForm.controls.EnteredBy.setValue(this.enteredByName);
      this.vehicleForm.disable();
    } catch (error) {

    }

  }

  bindRegistrationNumber() {
    try {

      this.disableButton = true;
      this.ownVehicleDetailsService.getAllVehicles().subscribe((data: OwnVehiclesDetails[]) => {
        this.disableButton = false;
        if (data) {
          this.RegistrationNumberList = data;
          this.RegistrationNumberListOptions = data.map(a => a.vehicleRegNumber);
          this.vehicleForm.controls.RegistrationNumber.enable();
          setTimeout(() => {
            this.registrationNumberSelect._elementRef.nativeElement.focus();
          }, 100);
        }
      }, err => {
        this.disableButton = false;
      });
    } catch (error) {

    }
  }

  findVehicle() {
    this.isFindOn = true;
    this.bindRegistrationNumber();
    this.enableNew = false;
    this.enableSave = false;
    this.enableFind = false;
    this.enableModify = false;
  }
  modifyClick() {
    try {
      this.findVehicle();
      this.enableSave = true;
      this.isModifyOn = true;
    } catch (error) {

    }
  }
  setVehicleGPSDevice(vehicleGPSDevice: GPSTrackingDevices) {
    try {
      this.vehicleForm.controls.GPSDeviceNumber.setValue(vehicleGPSDevice.gpsDeviceNo);
    } catch (error) {

    }
  }
  getVehicleGPSDeviceByVehicleId(vehicleId: number) {
    try {
      this.ownVehicleDetailsService.getVehicleGPSDeviceByVehicleId(vehicleId).subscribe((data: GPSTrackingDevices) => {
        if (data) {
          this.selectedVehicleGPSDeviceForEdit = data;
          this.setVehicleGPSDevice(data);
        }
      }, err => {
        this.alertService.error('Error has occured while getting vehicle gps device.');
      });
    } catch (error) {

    }
  }

  modifyVehicle() {
    try {
      if (!this.selectedVehicleForEdit) {
        return;
      }

      const vehicle = this.getVehicle();
      vehicle.ownVehicleId = this.selectedVehicleForEdit.ownVehicleId;
      const vehicleGPSDevice = this.getGPSDevice(vehicle);
      vehicleGPSDevice.ownVehicleID = this.selectedVehicleForEdit.ownVehicleId;
      this.disableButton = true;
      this.ownVehicleDetailsService.
        updateVehicle(vehicle).
        subscribe((responsedata: OwnVehiclesDetails) => {
          this.disableButton = false;
          if (responsedata) {
            vehicleGPSDevice.gpsTrackingDeviceId = this.selectedVehicleGPSDeviceForEdit ?
              this.selectedVehicleGPSDeviceForEdit.gpsTrackingDeviceId : 0;
            this.disableButton = true;
            const vehiclegpsDeviceCall = this.selectedVehicleGPSDeviceForEdit ?
              this.ownVehicleDetailsService.updateGPSDevice(vehicleGPSDevice)
              : this.createGPSDevice(vehicleGPSDevice);
            forkJoin(vehiclegpsDeviceCall, this.uploadVehicleDocument(vehicle.ownVehicleId)).subscribe((data) => {
              this.disableButton = false;
              if (data) {
                this.clearVehicleDetails();
                this.alertService.success('Vehicle modified successfully.');
              }
            }, err => {
              this.disableButton = false;
            });
          }
        }, err => {
          this.disableButton = false;
          this.alertService.error('Error has occured while updating the vehicle.');
        });
    } catch (error) {

    }
  }

  clearVehicleDetails() {
    try {
      this.isFindOn = false;
      this.isModifyOn = false;
      this.vehicleForm.reset();
      this.vehicleForm.disable();
      this.documentList = [];
      this.selectedVehicleForEdit = null;
      this.selectedVehicleGPSDeviceForEdit = null;
      this.RegistrationNumberList = [];
      this.RegistrationNumberListOptions = [];
      this.enableNew = true;
      this.enableSave = false;
      this.enableFind = true;
      this.enableModify = true;
      this.registrationNumberError = null;
      this.gpsDeviceError = false;
      this.chasisNumberError = null;
      setTimeout(() => {
        this.vehicleForm.controls.EnteredBy.setValue(this.enteredByName);
      }, 100);
    } catch (error) {

    }
  }

  addNewVehicle() {
    try {
      this.clearVehicleDetails();
      this.vehicleForm.enable();
      this.vehicleForm.controls.EnteredBy.disable();
      this.vehicleForm.controls.DateOfEntry.setValue(new Date());
      setTimeout(() => {
        this.dateOfEntry.nativeElement.focus();
      }, 100);
      this.enableNew = false;
      this.enableSave = true;
      this.enableFind = false;
      this.enableModify = false;
    } catch (error) {

    }
  }

  onFileChange(event) {
    try {
      if (!event.target.files[0].type.toLowerCase().match('image/jp.*')
        && !event.target.files[0].type.toLowerCase().match('image/pn.*')
        && !event.target.files[0].type.toLowerCase().match('application/pd.*')) {
        this.isFileError = true;
        return;
      }
      if (event && event.target.files && event.target.files.length) {
        this.isFileError = false;
        const file: File = event.target.files[0];
        const docGivenName = this.vehicleForm.controls.DocumentName.value;
        const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
        if (!docGivenName) {
          this.vehicleForm.controls.DocumentName.setValue(name);
        }

        const vehicleDocument: OwnVehicleDocuments = {
          docUploadNo: null,
          documentName: name,
          documentDetails: file,
          ownVehicleID: null
        };
        this.documentList.push(vehicleDocument);


        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add new document?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.documentName.nativeElement.focus();
            this.vehicleForm.controls.DocumentName.setValue('');
          } else {

            this.saveButton.nativeElement.focus();
          }

        });
      }
    } catch (error) {

    }
  }

  uploadVehicleDocument(vehicleId: number) {
    try {
      return new Observable((obs) => {
        if (this.documentList && this.documentList.length > 0) {
          const fileUploadObs: Observable<any>[] = [];
          this.documentList.forEach(vehicleDocument => {
            if (!vehicleDocument.ownVehicleID) {
              vehicleDocument.ownVehicleID = vehicleId;
              fileUploadObs.push(this.ownVehicleDetailsService.saveDocument(vehicleDocument));
            }
          });
          if (fileUploadObs && fileUploadObs.length > 0) {
            concat(...fileUploadObs).subscribe(res => {
              this.disableButton = false;
              obs.next();
              obs.complete();
            }, err => {
              obs.error();
            });
          } else {
            obs.next();
            obs.complete();
          }
        } else {
          obs.next();
          obs.complete();
        }
      });
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

  getVehicle(): OwnVehiclesDetails {
    try {
      if (this.vehicleForm.valid && this.registrationNumberError === false) {
        const vehicle: OwnVehiclesDetails = new Object() as OwnVehiclesDetails;
        vehicle.empCreatedId = this.enteredById;
        vehicle.vehicleEntryDate = new Date(this.vehicleForm.controls.DateOfEntry.value).toLocaleString();
        vehicle.vehicleType = this.vehicleForm.controls.VehicleType.value;
        vehicle.vehicleMake = this.vehicleForm.controls.VehicleMake.value;
        vehicle.vehicleDOP = new Date(this.vehicleForm.controls.DateOfPurchase.value).toLocaleString();
        vehicle.vehicleRegNumber = this.vehicleForm.controls.RegistrationNumber.value;
        vehicle.vehicleChassisNo = this.vehicleForm.controls.ChassisNumber.value;
        vehicle.vehicleNosTyres = this.vehicleForm.controls.Tyres.value;
        vehicle.vehicleAvgMileage = this.vehicleForm.controls.Mileage.value;
        vehicle.vehicleRenewalDuration = this.vehicleForm.controls.PermitDuration.value;
        vehicle.vehicleMaxCapacity = this.vehicleForm.controls.Capacity.value;
        return vehicle;

      } else {
        this.markFieldAsTouched(this.vehicleForm);
        return null;
      }
    } catch (error) {

    }
  }

  getGPSDevice(vehicle: OwnVehiclesDetails): GPSTrackingDevices {
    try {
      const vehicleGPSDevice: GPSTrackingDevices = new GPSTrackingDevices();
      vehicleGPSDevice.gpsDeviceNo = this.vehicleForm.controls.GPSDeviceNumber.value;
      return vehicleGPSDevice;
    } catch (error) {

    }
  }
  createGPSDevice(device: GPSTrackingDevices) {
    try {
      return new Observable((obs) => {
        if (device.gpsDeviceNo) {
          this.ownVehicleDetailsService.addGPSDevice(device).subscribe((data: GPSTrackingDevices) => {
            this.disableButton = false;
            obs.next();
            obs.complete();
          }, err => {
            obs.error();
          });
        } else {
          this.disableButton = false;
          obs.next();
          obs.complete();
        }
      });

    } catch (error) {

    }
  }
  saveVehicle() {
    try {
      if (this.selectedVehicleForEdit) {
        this.modifyVehicle();
        return;
      }
      if ((this.isFindOn || this.isModifyOn)) {
        return;
      }
      const vehicle: OwnVehiclesDetails = this.getVehicle();
      if (!vehicle) {
        return;
      }
      const vehicleGPSDevice = this.getGPSDevice(vehicle);
      this.disableButton = true;
      this.ownVehicleDetailsService.addVehicle(vehicle).subscribe((data: OwnVehiclesDetails) => {
        this.disableButton = false;
        this.alertService.success('Vehicle created successfully.');

        if (data.ownVehicleId) {
          vehicleGPSDevice.ownVehicleID = data.ownVehicleId;
          this.disableButton = true;
          forkJoin(
            this.createGPSDevice(vehicleGPSDevice),
            this.uploadVehicleDocument(data.ownVehicleId)).subscribe(() => {

              this.disableButton = false;
              this.clearVehicleDetails();

            });

        }
      }, err => {
        this.disableButton = false;
        this.alertService.error('Error has occured while creating an vehicle.');
      });
    } catch (error) {

    }
  }

  getDocumentsByVehicleId(vehicleId: number) {
    try {
      this.documentList = [];
      this.disableButton = true;
      this.ownVehicleDetailsService.getDocumentsByVehicleId(vehicleId).subscribe((data: OwnVehicleDocuments[]) => {
        this.disableButton = false;
        if (data) {
          this.documentList = data;
        }
      }, err => {
        this.disableButton = false;
      });
    } catch (error) {

    }
  }
  downloadFile(vehicleDocument: OwnVehicleDocuments) {
    try {

      if (!vehicleDocument.docUploadNo) {
        const blob = new Blob([vehicleDocument.documentDetails], { type: vehicleDocument.documentDetails.type });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        const downloadURL = URL.createObjectURL(blob);
        window.open(downloadURL);

      } else {
        this.ownVehicleDetailsService.getDocumentByDocumentId(vehicleDocument.docUploadNo).subscribe((data: Blob) => {

          const blob = new Blob([data], {
            type: vehicleDocument.documentName.toLowerCase().indexOf('.pdf') !== -1 ?
              'application/pdf' : 'image/' + vehicleDocument.documentName.split('.')[1]
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
  setVehicle(vehicle: OwnVehiclesDetails) {
    try {
      this.vehicleForm.controls.DateOfEntry.setValue(vehicle.vehicleEntryDate);
      this.vehicleForm.controls.VehicleType.setValue(vehicle.vehicleType);
      this.vehicleForm.controls.VehicleMake.setValue(vehicle.vehicleMake);
      this.vehicleForm.controls.DateOfPurchase.setValue(vehicle.vehicleDOP);
      this.vehicleForm.controls.RegistrationNumber.setValue(vehicle.vehicleRegNumber);
      this.vehicleForm.controls.ChassisNumber.setValue(vehicle.vehicleChassisNo);
      this.vehicleForm.controls.Tyres.setValue(vehicle.vehicleNosTyres);
      this.vehicleForm.controls.Mileage.setValue(vehicle.vehicleAvgMileage);
      this.vehicleForm.controls.PermitDuration.setValue(vehicle.vehicleRenewalDuration);
      this.vehicleForm.controls.Capacity.setValue(vehicle.vehicleMaxCapacity);
      this.getDocumentsByVehicleId(vehicle.ownVehicleId);
    } catch (error) {

    }
  }
  optionSelectedRegistrationNumber(event) {
    try {
      const selectedVehicle = this.RegistrationNumberList.filter(a => a.vehicleRegNumber === event.value)[0];
      if (selectedVehicle) {
        this.registrationNumberError = false;
        this.gpsDeviceError = false;
        this.chasisNumberError = false;
        if (this.isModifyOn) {
          this.vehicleForm.enable();
          this.vehicleForm.controls.EnteredBy.disable();
        }
        this.selectedVehicleForEdit = selectedVehicle;
        this.setVehicle(selectedVehicle);
        this.getVehicleGPSDeviceByVehicleId(selectedVehicle.ownVehicleId);
      }
    } catch (error) {

    }
  }

  RegistrationNumberBlur() {
    if (this.vehicleForm.controls.DateOfEntry.disabled) {
      this.registrationNumberError = false;
      return;
    }
    try {
      this.registrationNumberError = null;
      const regNumber = this.vehicleForm.controls.RegistrationNumber.value;
      if (regNumber) {
        if ((regNumber && !this.selectedVehicleForEdit) || (this.selectedVehicleForEdit &&
          this.selectedVehicleForEdit.vehicleRegNumber.toLowerCase() !== regNumber.toLowerCase())) {

          this.ownVehicleDetailsService.CheckDuplicateRegistrationNumber(regNumber).subscribe((data: boolean) => {
            if (data) {
              this.registrationNumberError = data;
            } else {
              this.registrationNumberError = false;
            }
          });
        } else {
          this.registrationNumberError = false;
        }
      } else {
        this.registrationNumberError = false;
      }
    } catch (error) {
      this.registrationNumberError = null;
    }
  }

  GPSDeviceBlur() {
    try {
      this.gpsDeviceError = null;
      const gpsDeviceNo = this.vehicleForm.controls.GPSDeviceNumber.value;
      if (gpsDeviceNo) {
        if ((gpsDeviceNo && !this.selectedVehicleGPSDeviceForEdit)
          || (this.selectedVehicleGPSDeviceForEdit && this.selectedVehicleGPSDeviceForEdit.gpsDeviceNo &&
            this.selectedVehicleGPSDeviceForEdit.gpsDeviceNo.toLowerCase() !== gpsDeviceNo.toLowerCase())) {

          this.ownVehicleDetailsService.CheckDuplicateGPSTrackingDeviceNo(gpsDeviceNo).subscribe((data: boolean) => {
            if (data) {
              this.gpsDeviceError = data;
            } else {
              this.gpsDeviceError = false;
            }
          });
        } else {
          this.gpsDeviceError = false;
        }
      } else {
        this.gpsDeviceError = false;
      }
    } catch (error) {
      this.gpsDeviceError = null;
    }
  }

  ChasisNumberBlur() {
    try {
      this.chasisNumberError = null;
      const chasisNumber = this.vehicleForm.controls.ChassisNumber.value;
      if (chasisNumber) {
        if ((chasisNumber && !this.selectedVehicleForEdit) || (this.selectedVehicleForEdit &&
          this.selectedVehicleForEdit.vehicleChassisNo.toLowerCase() !== chasisNumber.toLowerCase())) {

          this.ownVehicleDetailsService.CheckDuplicateVehicleChasisNo(chasisNumber).subscribe((data: boolean) => {
            if (data) {
              this.chasisNumberError = data;
            } else {
              this.chasisNumberError = false;
            }
          });
        } else {
          this.chasisNumberError = false;
        }
      } else {
        this.chasisNumberError = false;
      }
    } catch (error) {
      this.chasisNumberError = null;
    }
  }
}
