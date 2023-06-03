import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Country,
  District,
  Organisation,
  Place,
  State,
  SupplierDetails,
  SupplierDetailsDto,
  SupplierDocument,
  SupplierDocumentDto,
  SupplierRequestModel,
  SupplierResponseModel
} from './suppliers-details.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DateAdapter, MatSelect, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { SuppliersDetailsService } from './suppliers-details.service';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GHERKIN_DATE_FORMATS } from 'src/app/shared/data/date-format';

@Component({
  selector: 'app-suppliers-details',
  templateUrl: './suppliers-details.component.html',
  styleUrls: ['./suppliers-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: GHERKIN_DATE_FORMATS },
  ],
})
export class SuppliersDetailsComponent implements OnInit {

  suppliersDetailsForm: FormGroup;
  supplierModel: SupplierDetails;
  SupplierRequest: SupplierRequestModel;
  stateCtrl = new FormControl();
  countryCtrl = new FormControl();
  filteredStates: Observable<State[]>;
  filteredCountries: Observable<Country[]>;
  filteredDistricts: Observable<District[]>;
  isFileError = false;

  countryList: Country[];
  countryOptionsList: string[];

  stateList: State[];
  stateOptionsList: string[];

  districtList: District[];
  districtOptionsList: string[];

  placeList: Place[];
  placeOptionsList: string[];

  organisationList: SupplierDetails[] = [];

  submitted = false;

  public autoCompleteCountryControl = new FormControl();
  public autoCompleteStateControl = new FormControl();
  public autoCompleteDistrictControl = new FormControl();
  country: Country[] = null;
  states: State[] = null;

  disableSaveButton = true;
  disableFields = true;
  disableFindButton = true;
  disableModifyButton = true;
  disableNewButton = false;
  isModify = false; // For enabling disabling form on find or modify
  isFindOrModify = false; // For Showing Organisation dropwon on Find/Modify and hid the OrgName Field
  userData: any;
  constructor(
    public dialogService: DialogService,
    private authService: AuthenticationService,
    private el: ElementRef,
    private supplierService: SuppliersDetailsService,
    private alertService: AlertService) {
    this.userData = this.authService.getUserdetails();
  }
  documentList: SupplierDocumentDto[] = [];
  docToServer: SupplierDocument[] = [];
  @ViewChild('document', null) documentField: ElementRef;
  @ViewChild('documentPath', null) documentPathField: ElementRef;
  @ViewChild('saveBtn', null) saveBtnRef: ElementRef;
  @ViewChild('dateOfCreation', null) dateOfCreationRef: ElementRef;
  @ViewChild('autoOrg', null) orgSelectRef: ElementRef;

  ngOnInit() {
    this.getCountry();
    this.initalizeForm();
    this.onClearClick();
  }

  // Section Start: CountryAutoComplete & set Values

  getCountry() {
    this.supplierService.getCountry().subscribe((res: Country[]) => {
      if (res) {
        this.countryList = res;
        this.countryOptionsList = res.map(cou => cou.countryName);
      }
    });
  }

  countryValueChange(event) {
    if (event) {
      const selectedCountry = this.countryList.filter(p => p.countryName === event.trim())[0];
      if (selectedCountry) {
        this.suppliersDetailsForm.controls.countryId.setValue(selectedCountry.countryCode);
        this.suppliersDetailsForm.controls.state.setValue('');
        this.suppliersDetailsForm.controls.district.setValue('');
        this.suppliersDetailsForm.controls.place.setValue('');
        this.getState(selectedCountry.countryCode).subscribe(() => { });
      }
    } else {
      this.stateList = [];
      this.stateOptionsList = [];
      this.districtList = [];
      this.districtOptionsList = [];
      this.placeOptionsList = [];
      this.placeList = [];
      this.suppliersDetailsForm.controls.state.setValue('');
      this.suppliersDetailsForm.controls.district.setValue('');
      this.suppliersDetailsForm.controls.place.setValue('');
    }

  }
  savesCountryToList(country: string) {
    if (country && !this.countryList.filter(c => c.countryName === country)[0]) {
      const counrtyObj = new Country();
      counrtyObj.countryName = country;
      this.supplierService.saveCounrtry(counrtyObj).subscribe((data: Country) => {
        if (data) {
          this.suppliersDetailsForm.controls.countryId.setValue(data.countryCode);
          this.countryList.push(data);
          this.countryOptionsList.push(data.countryName);
          this.countryOptionsList = this.countryOptionsList.slice();
          this.alertService.success('Country added successfully!');
        }
      }, err => {
        this.alertService.error('Error has occured while saving contract.');
      });
    }
  }
  // Section End: Country AutoComplete

  // Section Start: StateAutoComplete

  getState(countryCode: string) {
    return new Observable((sub) => {
      this.supplierService.getState(countryCode).subscribe((res: State[]) => {

        this.stateList = res;
        this.stateOptionsList = res.map(sta => sta.stateName);
        this.districtList = [];
        this.districtOptionsList = [];
        this.placeList = [];
        this.placeOptionsList = [];
        sub.next();

      }, err => {
        this.stateList = [];
        this.stateOptionsList = [];
        this.districtList = [];
        this.districtOptionsList = [];
        this.placeList = [];
        this.placeOptionsList = [];
        sub.error(err);
      });
    });
  }

  stateValueChange(event) {
    if (event) {
      const selectedState = this.stateList.filter(p => p.stateName === event.trim())[0];
      if (selectedState) {
        this.suppliersDetailsForm.controls.stateId.setValue(selectedState.stateCode);
        this.suppliersDetailsForm.controls.district.setValue('');
        this.suppliersDetailsForm.controls.place.setValue('');
        this.getDistrict(selectedState.stateCode).subscribe(() => { });
      }
    } else {
      // this.stateList = [];
      // this.stateOptionsList = [];
      this.districtList = [];
      this.districtOptionsList = [];
      this.placeList = [];
      this.placeOptionsList = [];
      //  this.suppliersDetailsForm.controls.state.setValue('');
      //  this.suppliersDetailsForm.controls.stateId.setValue('');
      this.suppliersDetailsForm.controls.district.setValue('');
      this.suppliersDetailsForm.controls.districtId.setValue('');
      this.suppliersDetailsForm.controls.place.setValue('');
      this.suppliersDetailsForm.controls.placeId.setValue('');
    }

  }
  saveStateToList(state: string) {
    if (state && !this.stateList.filter(c => c.stateName === state)[0]) {
      const stateObj = new State();
      stateObj.stateName = state;
      const abc = this.suppliersDetailsForm.controls.countryId;
      const country = this.countryList.filter(a => a.countryName === this.suppliersDetailsForm.controls.country.value)[0];
      if (country) {
        stateObj.countryCode = country.countryCode;
        this.supplierService.saveState(stateObj).subscribe((data: State) => {
          if (data) {

            this.suppliersDetailsForm.controls.stateId.setValue(data.stateCode);
            this.stateList.push(data);
            this.stateOptionsList.push(data.stateName);
            this.stateOptionsList = this.stateOptionsList.slice();
            this.alertService.success('State added successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving state.');
        });
      } else {
        this.alertService.warning('Please select country to add state.');
      }
    }
  }

  // Section End: CountryAutoComplete & set Values

  // Section Start: DistrictAutoComplete

  getDistrict(stateCode: string) {
    return new Observable((sub) => {
      this.supplierService.getDistrict(stateCode).subscribe((res: District[]) => {
        this.districtList = res;
        this.districtOptionsList = res.map(dis => dis.districtName);
        this.placeList = [];
        this.placeOptionsList = [];
        sub.next();

      }, err => {
        this.districtList = [];
        this.districtOptionsList = [];
        this.placeList = [];
        this.placeOptionsList = [];
        sub.error(err);
      });
    });
  }

  districtValueChange(event) {
    if (event) {
      const selectedDistrict = this.districtList.filter(p => p.districtName === event.trim())[0];
      if (selectedDistrict) {

        this.suppliersDetailsForm.controls.districtId.setValue(selectedDistrict.districtCode);
        this.suppliersDetailsForm.controls.place.setValue('');
        this.getPlace(selectedDistrict.districtCode).subscribe(() => { });
      }
    } else {
      this.placeList = [];
      this.placeOptionsList = [];
      this.suppliersDetailsForm.controls.district.setValue('');
      this.suppliersDetailsForm.controls.place.setValue('');
    }

  }
  saveDistrictToList(district: string) {
    if (district && !this.districtList.filter(c => c.districtName === district)[0]) {
      const districtObj = new District();
      districtObj.districtName = district;
      const country = this.countryList.filter(a => a.countryName === this.suppliersDetailsForm.controls.country.value)[0];
      if (country) {
        districtObj.countryCode = country.countryCode;
        const stateCode = this.suppliersDetailsForm.controls.stateId.value;
        if (stateCode === '') {
          this.alertService.warning('Please select state to add district.');
        } else {
          districtObj.stateCode = stateCode;
          this.supplierService.saveDistrict(districtObj).subscribe((data: District) => {
            if (data) {
              this.suppliersDetailsForm.controls.districtId.setValue(data.districtCode);
              this.districtList.push(data);
              this.districtOptionsList.push(data.districtName);
              this.districtOptionsList = this.districtOptionsList.slice();
              this.alertService.success('district added successfully!');
            }
          }, err => {
            this.alertService.error('Error has occured while saving district.');
          });
        }
      } else {
        this.alertService.warning('Please select country, state to add district.');
      }
    }
  }

  // Section End: DistrictAutoComplete & set Values

  getPlace(districtCode: string) {
    return new Observable((sub) => {
      this.supplierService.getPlace(districtCode).subscribe((res: Place[]) => {
        this.placeList = res;
        this.placeOptionsList = res.map(cit => cit.PlaceName);
        sub.next();

      }, err => {
        this.placeList = [];
        this.placeOptionsList = [];
        sub.error(err);
      });
    });
  }

  placeValueChange(event) {
    if (event) {
      const selectedCity = this.placeList.filter(p => p.PlaceName === event.trim())[0];
      if (selectedCity) {

        this.suppliersDetailsForm.controls.placeId.setValue(selectedCity.PlaceCode);

      }
    } else {
      this.suppliersDetailsForm.controls.place.setValue('');
    }

  }
  savePlaceToList(city: string) {
    if (city && !this.placeList.filter(c => c.PlaceName === city)[0]) {
      const cityObj = new Place();
      cityObj.PlaceName = city;
      const countryCode = this.suppliersDetailsForm.controls.countryId.value;
      if (countryCode === '') {
        this.alertService.warning('Please select country, state and district to add place.');
      } else {
        const stateCode = this.suppliersDetailsForm.controls.stateId.value;
        if (stateCode === '') {
          this.alertService.warning('Please select state and district to add place.');
        } else {
          const distCode = this.suppliersDetailsForm.controls.districtId.value;
          if (distCode === '') {
            this.alertService.warning('Please select district to add place.');
          } else {
            cityObj.CountryCode = countryCode;
            cityObj.StateCode = stateCode;
            cityObj.DistrictCode = distCode;
            this.supplierService.savePlace(cityObj).subscribe((data: Place) => {
              if (data) {
                this.suppliersDetailsForm.controls.placeId.setValue(data.PlaceCode);
                this.placeList.push(data);
                this.placeOptionsList.push(data.PlaceName);
                this.placeOptionsList = this.placeOptionsList.slice();
                this.alertService.success('Place added successfully!');
              }
            }, err => {
              this.alertService.error('Error has occured while saving city.');
            });
          }
        }

      }
    }
  }


  initalizeForm(): void {
    this.suppliersDetailsForm = new FormGroup({
      dateOfCreation: new FormControl(null, [Validators.required]),
      userName: new FormControl(this.userData.userName, [Validators.required]),
      organisationName: new FormControl(null, [Validators.required]),
      legalStatus: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      countryId: new FormControl(null), country: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null),
      state: new FormControl(null, [Validators.required]),
      districtId: new FormControl(null),
      district: new FormControl(null, [Validators.required]),
      placeId: new FormControl(null),
      place: new FormControl(null, [Validators.required]),
      pinCode: new FormControl(null, [Validators.maxLength(6)]),
      mgmName: new FormControl(null, []),
      designation: new FormControl(null, []),
      // orgasitationName
      mgmContactNumber: new FormControl(null, [Validators.pattern(/^[0-9]\d*$/)]),
      correspondanceMailID: new FormControl('', []),
      altCorrespondanceMailID: new FormControl('', []),
      cP: new FormControl(null, []),
      cPDesignation: new FormControl(null, []),
      cPNumber: new FormControl([Validators.pattern(/^[0-9]\d*$/)]),
      cPMailID: new FormControl('', []),
      officeNumber: new FormControl(null, [Validators.pattern(/^[0-9]\d*$/)]),
      activity: new FormControl(null, []),
      gSTNo: new FormControl(null, [Validators.required]),
      website: new FormControl(null),
      licenseNo: new FormControl(null),
      bankName: new FormControl(null, []),
      bankBranch: new FormControl(null, []),
      bankACNumber: new FormControl(null, []),
      bankIFSC: new FormControl(null, []),
      approvedBy: new FormControl(null),
      document: new FormControl(null),
      documentPath: new FormControl(null),

      // for serch functionality
      selectedOrg: new FormControl(null),
      supplierOrgID: new FormControl()

    });
  }


  addSupplier() {
    this.suppliersDetailsForm.markAllAsTouched();
    if (this.suppliersDetailsForm.invalid) {
      return;
    }

    this.dialogService.addSuppierDialog().subscribe(res => {
      const doc = this.suppliersDetailsForm.controls.document.value;
      // tslint:disable-next-line: no-shadowed-variable
      const docPath = this.suppliersDetailsForm.controls.documentPath.value;

      if (res) {
        if ((doc !== null && doc !== '') && (docPath !== null && docPath !== '')) {
          this.documentList.push({
            supplierOrgID: '', supplierDocumentName: doc,
            supplierDocumentDetails: JSON.stringify(docPath), supplierOrgDocNo: 0, supplierDocumentPreappendText: ''
          });
          //   this.docToServer.push({ supplierOrgID: '', supplierDocumentName: doc, supplierDocumentDetails: '', supplierOrgDocNo: 0 });

        }
        setTimeout(() => this.documentField.nativeElement.focus(), 1000);

      } else {
        if ((doc !== null && doc !== '') && (docPath !== null && docPath !== '')) {
          this.documentList.push({
            supplierOrgID: '', supplierDocumentName: doc,
            supplierDocumentDetails: JSON.stringify(docPath), supplierOrgDocNo: 0, supplierDocumentPreappendText: ''
          });
          //  this.docToServer.push({ supplierOrgID: '', supplierDocumentName: doc, supplierDocumentDetails: '', supplierOrgDocNo: 0 });
        }
        this.disableSaveButton = false;
        setTimeout(() => this.saveBtnRef.nativeElement.focus(), 1000);

      }
      this.suppliersDetailsForm.patchValue({
        document: '',
        documentPath: ''
      });
    });
  }


  organisationOptionSelected(event) {
    if (event) {
      const orgName = this.suppliersDetailsForm.controls.selectedOrg.value;
      const selectedOrg = this.organisationList.filter(p => p.organisationName === orgName)[0];
      if (selectedOrg) {
        this.supplierService.findSupplierByOrgId(selectedOrg.supplierOrgID).subscribe((res: SupplierResponseModel) => {
          this.fillOrgData(res.SupplierDetailsDto);
          this.documentList = res.SupplierDocumentsDtos;
        });
        if (this.isModify) {
          this.suppliersDetailsForm.enable();
          this.suppliersDetailsForm.controls.userName.disable();
          this.disableSaveButton = false;
        }
      }
    }
  }

  onFocusOut() {
    this.suppliersDetailsForm.markAllAsTouched();
    if (this.suppliersDetailsForm.invalid) {
      return;
    }
    this.disableSaveButton = false;
  }

  onFileChange(event) {
    if (!event.target.files[0].type.toLowerCase().match('image/jp.*')
      && !event.target.files[0].type.toLowerCase().match('image/pn.*')
      && !event.target.files[0].type.toLowerCase().match('application/pd.*')) {
      this.isFileError = true;
      return;
    }
    if (event && event.target.files && event.target.files.length) {
      this.isFileError = false;
      const file: File = event.target.files[0];
      const docGivenName = this.suppliersDetailsForm.controls.document.value;
      const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
      if (!docGivenName) {
        this.suppliersDetailsForm.controls.document.setValue(name);
      }
      // const employeeDocument: SupplierDocument = {
      //   supplierOrgID: '',
      //   supplierOrgDocNo: 0,
      //   supplierDocumentName: name,
      //   supplierDocumentDetails: JSON.stringify(file)
      // };
      const supDoc = new SupplierDocument();

      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        supDoc.supplierDocumentDetails = String(
          myReader.result
        );
      };
      myReader.readAsDataURL(file);

      supDoc.supplierDocumentName = file.name;
      this.documentList.push(supDoc);

      this.suppliersDetailsForm.patchValue({
        document: '',
        documentPath: ''
      });

      this.suppliersDetailsForm.markAllAsTouched();
      if (this.suppliersDetailsForm.invalid) {
        return;
      }
      this.dialogService.addSuppierDialog().subscribe(res => {
        if (res) {
          setTimeout(() => this.documentField.nativeElement.focus(), 1000);
        } else {
          this.disableSaveButton = false;
          setTimeout(() => this.saveBtnRef.nativeElement.focus(), 1000);
        }
      });
    }

    // this.addSupplier();
  }

  downloadFile(document: SupplierDocument) {
    try {

      const indes = document.supplierDocumentDetails.indexOf('base64');
      let byteCharacters;
      let mime;
      if (indes >= 0) {
        const bytearr = document.supplierDocumentDetails.substring(indes + 7);
        mime = document.supplierDocumentDetails.substring(5, indes + 6);
        byteCharacters = atob(bytearr);
      } else {
        byteCharacters = atob(document.supplierDocumentDetails);
        mime = document.supplierDocumentPreappendText.substring(5);
      }
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: mime });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);


      // if (!document.supplierOrgDocNo) {
      //   const blob = new Blob([document.supplierDocumentDetails], { type: document.supplierDocumentDetails.type });
      //   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //     window.navigator.msSaveOrOpenBlob(blob);
      //     return;
      //   }
      //   const downloadURL = URL.createObjectURL(blob);
      //   window.open(downloadURL);

      // }
    } catch (error) {

    }
  }

  saveSupplier() {
    this.suppliersDetailsForm.markAllAsTouched();
    if (this.suppliersDetailsForm.invalid) {
      this.submitted = true;
      return;
    }

    this.supplierModel = this.getSupplierFormValues();
    const request = new SupplierRequestModel();
    request.SupplierDetailsModel = this.supplierModel;
    request.SupplierDocumentDetails = this.documentList;
    // request.SupplierDocumentDetails = this.docToServer;
    if (this.supplierModel.supplierOrgID !== '' && this.supplierModel.supplierOrgID !== null) {
      this.supplierService.updateSupplier(request).subscribe(res => {
        this.alertService.success('Supplier details saved successfully.');
        this.onClearClick();
      }, err => {
        this.alertService.error('Error has occured while saving Supplier details.');

      });
    } else {

      this.supplierService.addSupplier(request).subscribe(res => {
        this.alertService.success('Supplier details saved successfully.');
        this.onClearClick();
      }, err => {
        this.alertService.error('Error has occured while saving Supplier details.');

      });
    }
  }

  getSupplierFormValues(): SupplierDetails {
    const sd = new SupplierDetails();
    if (this.isModify) {
      sd.supplierOrgID = this.suppliersDetailsForm.controls.supplierOrgID.value;
    } else {
      sd.supplierOrgID = '';
    }
    sd.creationDate = this.suppliersDetailsForm.controls.dateOfCreation.value;
    sd.userName = this.userData.userId; // 'Nayak798'; // this.suppliersDetailsForm.controls.userName.value;
    sd.organisationName = this.suppliersDetailsForm.controls.organisationName.value;
    sd.legalStatus = this.suppliersDetailsForm.controls.legalStatus.value;
    sd.address = this.suppliersDetailsForm.controls.address.value;
    sd.countryID = this.suppliersDetailsForm.controls.countryId.value;
    sd.stateID = this.suppliersDetailsForm.controls.stateId.value;
    sd.districtID = this.suppliersDetailsForm.controls.districtId.value;
    sd.placeCode = +this.suppliersDetailsForm.controls.placeId.value;
    sd.pinCode = +this.suppliersDetailsForm.controls.pinCode.value;
    sd.mgmName = this.suppliersDetailsForm.controls.mgmName.value === null ? 'NA' : this.suppliersDetailsForm.controls.mgmName.value;
    // tslint:disable-next-line: max-line-length
    sd.designation = this.suppliersDetailsForm.controls.designation.value === null ? 'NA' : this.suppliersDetailsForm.controls.designation.value;
    sd.mgmContactNumber = +this.suppliersDetailsForm.controls.mgmContactNumber.value;
    // tslint:disable-next-line: max-line-length
    sd.correspondanceMailID = this.suppliersDetailsForm.controls.correspondanceMailID.value === null ? 'NA' : this.suppliersDetailsForm.controls.correspondanceMailID.value;
    // tslint:disable-next-line: max-line-length
    sd.altCorrespondanceMailID = this.suppliersDetailsForm.controls.altCorrespondanceMailID.value === null ? 'NA' : this.suppliersDetailsForm.controls.altCorrespondanceMailID.value;
    sd.contactPerson = this.suppliersDetailsForm.controls.cP.value === null ? 'NA' : this.suppliersDetailsForm.controls.cP.value;
    // tslint:disable-next-line: max-line-length
    sd.contactPersonDesignation = this.suppliersDetailsForm.controls.cPDesignation.value === null ? 'NA' : this.suppliersDetailsForm.controls.cPDesignation.value;
    sd.contactPersonNumber = +this.suppliersDetailsForm.controls.cPNumber.value;
    // tslint:disable-next-line: max-line-length
    sd.contactPersonMailID = this.suppliersDetailsForm.controls.cPMailID.value === null ? 'NA' : this.suppliersDetailsForm.controls.cPMailID.value;
    sd.officeNumber = +this.suppliersDetailsForm.controls.officeNumber.value;
    sd.activity = this.suppliersDetailsForm.controls.activity.value;
    sd.gstNo = this.suppliersDetailsForm.controls.gSTNo.value;
    sd.website = this.suppliersDetailsForm.controls.website.value === null ? 'NA' : this.suppliersDetailsForm.controls.website.value;
    sd.licenseNo = this.suppliersDetailsForm.controls.licenseNo.value === null ? 'NA' : this.suppliersDetailsForm.controls.licenseNo.value;
    sd.bankName = this.suppliersDetailsForm.controls.bankName.value === null ? 'NA' : this.suppliersDetailsForm.controls.bankName.value;
    // tslint:disable-next-line: max-line-length
    sd.bankBranch = this.suppliersDetailsForm.controls.bankBranch.value === null ? 'NA' : this.suppliersDetailsForm.controls.bankBranch.value;
    sd.bankActNo = +this.suppliersDetailsForm.controls.bankACNumber.value;
    sd.iFSCCode = this.suppliersDetailsForm.controls.bankIFSC.value === null ? 'NA' : this.suppliersDetailsForm.controls.bankIFSC.value;
    // tslint:disable-next-line: max-line-length
    sd.approvedBy = this.suppliersDetailsForm.controls.approvedBy.value === null ? 'NA' : this.suppliersDetailsForm.controls.approvedBy.value;
    return sd;
  }
  fillOrgData(sd: SupplierDetailsDto) {

    this.suppliersDetailsForm.patchValue({
      dateOfCreation: sd.creationDate,
      userName: sd.userName,
      organisationName: sd.organisationName,
      legalStatus: sd.legalStatus,
      address: sd.address,
      country: sd.countryName,
      countryId: sd.countryID,
      stateId: sd.stateID,
      state: sd.stateName,
      districtId: sd.districtID,
      district: sd.districtName,
      placeId: sd.placeCode,
      place: sd.placeName,
      pinCode: sd.pinCode,
      mgmName: sd.mgmName,
      designation: sd.designation,
      mgmContactNumber: sd.mgmContactNumber,
      correspondanceMailID: sd.correspondanceMailID,
      altCorrespondanceMailID: sd.altCorrespondanceMailID,
      cP: sd.contactPerson,
      cPDesignation: sd.contactPersonDesignation,
      cPNumber: sd.contactPersonNumber,
      cPMailID: sd.contactPersonMailID,
      officeNumber: sd.officeNumber,
      activity: sd.activity,
      gSTNo: sd.gstNo,
      website: sd.website,
      licenseNo: sd.licenseNo,
      bankName: sd.bankName,
      bankBranch: sd.bankBranch,
      bankACNumber: sd.bankActNo,
      bankIFSC: sd.iFSCCode,
      approvedBy: sd.approvedBy,
      supplierOrgID: sd.supplierOrgID
      // document: sd
      // documentPath: sd

    });
  }

  getAllSupliers() {
    this.supplierService.getAllSuppliers()
      .subscribe(res => {
        this.organisationList = res;
      });

  }
  onNewClick() {
    try {
      this.suppliersDetailsForm.enable();
      this.suppliersDetailsForm.controls.dateOfCreation.setValue(new Date());
      this.suppliersDetailsForm.controls.userName.setValue(this.userData.userName);
      this.suppliersDetailsForm.controls.userName.disable();
      this.disableNewButton = true;
      this.disableSaveButton = true;
      this.disableFindButton = true;
      this.disableModifyButton = true;
      setTimeout(() => this.dateOfCreationRef.nativeElement.focus(), 1000);

    } catch (error) {
      console.log('Error on newIndent: ', error);
    }
  }
  onClearClick() {
    this.disableNewButton = false;
    this.disableSaveButton = true;
    this.disableFindButton = false;
    this.disableModifyButton = false;
    this.isModify = false;
    this.isFindOrModify = false;
    this.suppliersDetailsForm.reset();
    this.suppliersDetailsForm.disable();
    this.documentList = [];
  }
  onFindClick() {
    this.getAllSupliers();
    this.suppliersDetailsForm.controls.userName.setValue(this.userData.userName);
    this.disableNewButton = true;
    this.disableModifyButton = true;
    this.disableFindButton = true;
    this.disableSaveButton = true;
    this.isFindOrModify = true;
    this.isModify = false;
    this.suppliersDetailsForm.controls.selectedOrg.enable();
    setTimeout(this.orgSelectRef.nativeElement.focus(), 1000);
  }
  onModifyClick() {
    this.getAllSupliers();
    this.suppliersDetailsForm.controls.userName.setValue(this.userData.userName);
    this.disableNewButton = true;
    this.disableSaveButton = true;
    this.disableModifyButton = true;
    this.disableFindButton = true;
    this.isModify = true;
    this.isFindOrModify = true;
    this.suppliersDetailsForm.controls.selectedOrg.enable();
    setTimeout(this.orgSelectRef.nativeElement.focus(), 1000);
  }

}
