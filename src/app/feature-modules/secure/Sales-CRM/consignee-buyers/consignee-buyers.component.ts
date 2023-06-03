import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { DialogService } from 'src/app/services/dialog.service';
import { ConsigneeBuyersService } from './consignee-buyers.service';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { StateOverseas, CityOverseas, CountryOverseas, CurrencyOverseas, Consignee, ConsigneeDocument } from './consignee-buyers.model';
import { MatSelect } from '@angular/material';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-consignee-buyers',
  templateUrl: './consignee-buyers.component.html',
  styleUrls: ['./consignee-buyers.component.css']
})
export class ConsigneeBuyersComponent implements OnInit {

  isFileError = false;
  consigneeForm: FormGroup;

  countryList: CountryOverseas[] = [];
  countryOptionsList: string[] = [];

  stateList: StateOverseas[] = [];
  stateOptionsList: string[] = [];

  cityList: CityOverseas[] = [];
  cityOptionsList: string[] = [];
  userList: Consignee[] = [];
  userOptionsList: string[] = [];

  currencyList: CurrencyOverseas[] = [];
  currencyOptionsList: string[] = [];

  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;
  consigneeDocuments: ConsigneeDocument[] = [];
  consDoc = new ConsigneeDocument();

  fileBase64 = '';

  submitted = false;
  disableSaveButton = true;
  disableFindButton = true;
  disableModifyButton = true;
  disableClearButton = true;
  disableNewButton = false;
  disableCountryAutocomplete = true;

  isModify = false; // For enabling disabling form on find or modify
  isFindOrModify = false; // For Showing Organisation dropwon on Find/Modify and hid the OrgName Field

  constructor(
    public dialogService: DialogService,
    // private el: ElementRef,
    private consigneeService: ConsigneeBuyersService,
    private alertService: AlertService) { }

  documentList: { documentName: string, documentPath: string }[] = [];
  documentName = '';
  documentPath1: any;

  @ViewChild('consigneeBuyerSelect', null) consigneeBuyerMatSelectRef: MatSelect;
  @ViewChild('documentPath', null) documentPathField: ElementRef;
  // @ViewChild('saveButton', null) saveBtn: ElementRef;
  @ViewChild('saveBtn', null) saveBtn: ElementRef;
  @ViewChild('country', null) country: ElementRef;


  ngOnInit() {
    try {

      this.initalizeForm();
      this.onClearConsignee();

    } catch (error) {
      console.log('Error on ngOninit: ', error);
    }
  }

  userTypeValueChange(event) {
    try {
      if (this.isFindOrModify) {
        if (event) {
          this.getUsersByType(event.value).subscribe(() => { });

        } else {
          this.userList = [];
          this.userOptionsList = [];

          this.consigneeForm.controls.countryId.setValue('');
          this.consigneeForm.controls.stateId.setValue('');
          this.consigneeForm.controls.cityId.setValue('');
        }
      }
    } catch (error) {
      console.log('Error on countryValueChange: ', error);
    }
  }

  getUsersByType(userType: string) {
    try {
      return new Observable((sub) => {
        this.consigneeService.getUserByType(userType).subscribe((res: Consignee[]) => {
          this.userList = res;
          this.consigneeForm.reset();
          this.consigneeForm.controls.consigneeBuyer.setValue(userType);
          this.userOptionsList = res.map(usr => usr.cbName);
          sub.next();

        }, err => {
          this.consigneeForm.reset();
          this.userList = [];
          this.userOptionsList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getState :', error);
    }
  }
  userValueChange(event) {
    try {
      if (event) {
        const user = this.consigneeForm.controls.selectedUser.value;
        const selectedUser = this.userList.filter(p => p.cbName === user)[0];
        if (selectedUser) {
          // this.consigneeForm.controls.consigneeBuyer.setValue(selectedCountry.countryId);

          const userType = this.consigneeForm.controls.consigneeBuyer.value;
          this.getUsersByCode(userType, selectedUser.cbCode).subscribe(() => { });
        }
      } else {
        this.stateList = [];
        this.stateOptionsList = [];
        this.cityOptionsList = [];
        this.cityList = [];
        this.consigneeForm.controls.countryId.setValue('');
        this.consigneeForm.controls.stateId.setValue('');
        this.consigneeForm.controls.cityId.setValue('');
      }
    } catch (error) {
      console.log('Error on countryValueChange: ', error);
    }
  }



  getUsersByCode(userType: string, userCode: string) {
    try {
      return new Observable((sub) => {
        this.consigneeService.getUserByCode(userType, userCode).subscribe((res: Consignee) => {
          this.fillFindData(res);
          sub.next();

        }, err => {
          this.userList = [];
          this.userOptionsList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getState :', error);
    }
  }
  // START country Section
  getCountry() {
    try {
      this.consigneeService.getAllCounrtries().subscribe((res: CountryOverseas[]) => {
        if (res) {
          this.countryList = res;
          this.countryOptionsList = res.map(cou => cou.countryName);
        }
      });
    } catch (error) {
      console.log('Error on getCountry: ', error);
    }

  }

  countryValueChange(event) {
    try {
      if (event) {
        const selectedCountry = this.countryList.filter(p => p.countryName === event.trim())[0];
        if (selectedCountry) {
          this.consigneeForm.controls.countryId.setValue(selectedCountry.countryId);
          //  this.consigneeForm.controls.stateId.setValue('');
          //  this.consigneeForm.controls.cityId.setValue('');
          this.consigneeForm.controls.state.setValue('');
          this.consigneeForm.controls.city.setValue('');
          this.stateList = [];
          this.stateOptionsList = [];
          this.cityOptionsList = [];
          this.cityList = [];
          this.getState(selectedCountry.countryId).subscribe(() => { });
        }
      } else {
        this.stateList = [];
        this.stateOptionsList = [];
        this.cityOptionsList = [];
        this.cityList = [];
        //  this.consigneeForm.controls.countryId.setValue('');
        this.consigneeForm.controls.stateId.setValue('');
        this.consigneeForm.controls.cityId.setValue('');
        //  this.consigneeForm.controls.country.setValue('');
        this.consigneeForm.controls.state.setValue('');
        this.consigneeForm.controls.city.setValue('');
      }
    } catch (error) {
      console.log('Error on countryValueChange: ', error);
    }
  }
  savesCountryToList(country: string) {
    try {
      if (country && !this.countryList.filter(c => c.countryName === country)[0]) {
        const counrtyObj = new CountryOverseas(); // = <CountryOverseas>new Object();
        counrtyObj.countryName = country;
        this.consigneeService.saveCounrtry(counrtyObj).subscribe((data: CountryOverseas) => {
          if (data) {
            this.countryList.push(data);
            this.countryOptionsList.push(data.countryName);
            this.countryOptionsList = this.countryOptionsList.slice();
            this.consigneeForm.controls.countryId.setValue(data.countryId);
            this.alertService.success('Country added successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving Country.');
        });
      }
    } catch (error) {
      console.log('Error on savesCountryToList: ', error);
    }
  }

  // END productGroup Section
  // START state Section
  getState(countryId: string) {
    try {
      return new Observable((sub) => {
        this.consigneeService.getStatesByCounrtry(countryId).subscribe((res: StateOverseas[]) => {

          this.stateList = res;
          this.stateOptionsList = res.map(sta => sta.stateName);
          this.cityList = [];
          this.cityOptionsList = [];
          sub.next();

        }, err => {
          this.stateList = [];
          this.stateOptionsList = [];
          this.cityList = [];
          this.cityOptionsList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getState :', error);
    }
  }

  stateValueChange(event) {
    try {
      if (event) {
        const selectedState = this.stateList.filter(p => p.stateName === event.trim())[0];
        if (selectedState) {
          this.consigneeForm.controls.stateId.setValue(selectedState.stateId);
          this.consigneeForm.controls.cityId.setValue('');
          this.consigneeForm.controls.city.setValue('');
          this.cityList = [];
          this.cityOptionsList = [];
          this.getCity(selectedState.stateId).subscribe(() => { });
        }
      } else {
        //  this.stateList = [];
        //  this.stateOptionsList = [];
        this.cityList = [];
        this.cityOptionsList = [];
        this.consigneeForm.controls.stateId.setValue('');
        this.consigneeForm.controls.cityId.setValue('');
        this.consigneeForm.controls.state.setValue('');
        this.consigneeForm.controls.city.setValue('');
      }
    } catch (error) {
      console.log('Error on stateValueChange: ', error);
    }
  }
  saveStateToList(state: string) {
    try {
      if (state && !this.stateList.filter(c => c.stateName === state)[0]) {
        const stateObj = new StateOverseas();
        stateObj.stateName = state;
        const country = this.countryList.filter(a => a.countryId === this.consigneeForm.controls.countryId.value)[0];
        if (country) {
          stateObj.countryId = country.countryId;
          this.consigneeService.saveState(stateObj).subscribe((data: StateOverseas) => {
            if (data) {
              this.stateList.push(data);
              this.stateOptionsList.push(data.stateName);
              this.stateOptionsList = this.stateOptionsList.slice();
              this.consigneeForm.controls.stateId.setValue(data.stateId);
              this.alertService.success('State added successfully!');
            }
          }, err => {
            this.alertService.error('Error has occured while saving state.');
          });
        } else {
          this.alertService.warning('Please select country to add state.');
        }
      }
    } catch (error) {
      console.log('Error on saveStateToList: ', error);
    }
  }
  // END productGroup Section

  // START city Section
  getCity(stateId: string) {
    try {
      return new Observable((sub) => {
        this.consigneeService.getCityByStateId(stateId).subscribe((res: CityOverseas[]) => {
          this.cityList = res;
          this.cityOptionsList = res.map(cit => cit.cityName);
          sub.next();

        }, err => {
          this.cityList = [];
          this.cityOptionsList = [];
          sub.error(err);
        });
      });
    } catch (error) {
      console.log('Error on getCity: ', error);
    }
  }

  cityValueChange(event) {
    try {
      if (event) {
        const selectedCity = this.cityList.filter(p => p.cityName === event.trim())[0];
        if (selectedCity) {
          this.consigneeForm.controls.cityId.setValue(selectedCity.cityId);
        }
      } else {
        //  this.cityList = [];
        //  this.cityOptionsList = [];
        this.consigneeForm.controls.cityId.setValue('');
      }
    } catch (error) {
      console.log('Error on cityValueChange: ', error);
    }
  }
  saveCityToList(city: string) {
    try {
      if (city && !this.cityList.filter(c => c.cityName === city)[0]) {
        const cityObj = new CityOverseas();
        const country = this.countryList.filter(a => a.countryId === this.consigneeForm.controls.countryId.value)[0];
        if (country) {
          cityObj.countryId = country.countryId;
          const state = this.stateList.filter(a => a.stateId === this.consigneeForm.controls.stateId.value)[0];

          if (state) {
            cityObj.stateId = state.stateId;
            cityObj.cityName = city;
            // to do
            this.consigneeService.saveCity(cityObj).subscribe((data: CityOverseas) => {
              if (data) {
                this.cityList.push(data);
                this.cityOptionsList.push(data.cityName);
                this.cityOptionsList = this.cityOptionsList.slice();
                this.consigneeForm.controls.cityId.setValue(data.cityId);
                this.alertService.success('City added successfully!');
              }
            }, err => {
              this.alertService.error('Error has occured while saving city.');
            });
          } else {
            this.alertService.warning('Please select state to add city.');
          }
        } else {
          this.alertService.warning('Please select country to add city.');
        }
      }
    } catch (error) {
      console.log('Error on saveCityToList: ', error);
    }
  }
  // END productGroup Section

  // START country Section
  getCurrency() {
    try {
      this.consigneeService.getCurrency().subscribe((res: CurrencyOverseas[]) => {
        if (res) {
          this.currencyList = res;
          this.currencyOptionsList = res.map(cou => cou.currencyName);
        }
      });
    } catch (error) {
      console.log('Error on getCurrency: ', error);
    }
  }

  currencyValueChange(event) {
    try {
      if (event) {
        const selectedCurrency = this.currencyList.filter(p => p.currencyName === event.trim())[0];
        if (selectedCurrency) {
          this.consigneeForm.controls.currencyCode.setValue(selectedCurrency.currencyCode);
        }
      } else {
        this.consigneeForm.controls.currencyCode.setValue('');
        this.consigneeForm.controls.currency.setValue('');
      }
    } catch (error) {
      console.log('Error on currencyValueChange: ', error);
    }
  }
  savesCurrencyToList(currency: string) {
    try {
      if (currency && !this.currencyList.filter(c => c.currencyName === currency)[0]) {
        const currencyObj = new CurrencyOverseas();
        currencyObj.currencyName = currency;
        this.consigneeService.saveCurrency(currencyObj).subscribe((data: CurrencyOverseas) => {
          if (data) {
            this.currencyList.push(data);
            this.currencyOptionsList.push(data.currencyName);
            this.currencyOptionsList = this.currencyOptionsList.slice();
            this.consigneeForm.controls.currencyCode.setValue(data.currencyCode);
            this.alertService.success('Currency added successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving Currency.');
        });
      }
    } catch (error) {
      console.log('Error on savesCurrencyToList: ', error);
    }
  }

  // END productGroup Section

  initalizeForm(): void {
    try {
      this.consigneeForm = new FormGroup({
        consigneeBuyer: new FormControl(null, [Validators.required]),
        id: new FormControl(),
        cbCode: new FormControl(),
        name: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required]),
        countryId: new FormControl(null),
        country: new FormControl(null, [Validators.required]),
        stateId: new FormControl(null),
        state: new FormControl(null, [Validators.required]),
        cityId: new FormControl(null),
        city: new FormControl(null, [Validators.required]),
        pincode: new FormControl(null, [Validators.required]),
        countryAreaCode: new FormControl(null, [Validators.required]),
        mgmName: new FormControl(null, [Validators.required]),
        mgmMobileNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
        officeNumber: new FormControl(null, [Validators.required]),
        altNumber: new FormControl(null, [Validators.required]),
        eMailID: new FormControl(null, [Validators.required, Validators.email]),
        altEMailID: new FormControl(null, [Validators.required, Validators.email]),
        licenseNo: new FormControl(null, [Validators.required]),
        creditLimit: new FormControl(null, [Validators.required]),
        currency: new FormControl(null, [Validators.required]),
        currencyCode: new FormControl(null),
        document: new FormControl(null),
        documentPath: new FormControl(null),
        documentNumber: new FormControl(),

        selectedUser: new FormControl(null)
      });
    } catch (error) {
      console.log('Error on initalizeForm: ', error);
    }
  }

  onFindConsignee() {
    try {
      // this.fillDummyData();
    } catch (error) {
      console.log('Error on onFindConsignee: ', error);
    }
  }



  onSaveConsignee() {
    try {
      const consignee: Consignee = this.getConsignee();
      if (!consignee) {
        return;
      }
      this.disableSaveButton = true;
      if (consignee.cbCode !== '' && consignee.cbCode !== null) {
        this.consigneeService.updateConsignee(consignee).subscribe(() => {
          this.alertService.success('Consignee updated successfully.');
          this.onClearConsignee();
        }, err => {
          this.disableSaveButton = false;
          this.alertService.error('Error has occured while updating Consignee.');
        });
      } else {
        this.consigneeService.saveConsignee(consignee).subscribe(() => {
          this.alertService.success('Consignee created successfully.');
          this.onClearConsignee();
        }, err => {
          this.disableSaveButton = false;
          this.alertService.error('Error has occured while creating an Consignee.');
        });
      }
    } catch (error) {
      console.log('Error on onSaveConsignee: ', error);
    }
  }

  getConsignee(): Consignee {
    try {
      if (this.consigneeForm.valid) {
        const consigneeDetails = new Consignee();
        const idVal = this.consigneeForm.controls.id.value;
        consigneeDetails.id = idVal === null ? 0 : idVal;
        consigneeDetails.cbCode = this.consigneeForm.controls.cbCode.value;
        consigneeDetails.ConsgbuyerType = this.consigneeForm.controls.consigneeBuyer.value;
        consigneeDetails.cbName = this.consigneeForm.controls.name.value;
        consigneeDetails.cbAddress = this.consigneeForm.controls.address.value;
        consigneeDetails.countryId = this.consigneeForm.controls.countryId.value;
        consigneeDetails.stateId = this.consigneeForm.controls.stateId.value;
        consigneeDetails.cityId = this.consigneeForm.controls.cityId.value;
        consigneeDetails.pinCode = this.consigneeForm.controls.pincode.value;
        consigneeDetails.countryareaCode = this.consigneeForm.controls.countryAreaCode.value;
        consigneeDetails.managmentName = this.consigneeForm.controls.mgmName.value;
        consigneeDetails.mobileNo = this.consigneeForm.controls.mgmMobileNumber.value;
        consigneeDetails.officeNo = this.consigneeForm.controls.officeNumber.value;
        consigneeDetails.alternateNo = this.consigneeForm.controls.altNumber.value;
        consigneeDetails.mailId = this.consigneeForm.controls.eMailID.value;
        consigneeDetails.altmailId = this.consigneeForm.controls.altEMailID.value;
        consigneeDetails.licenseNo = this.consigneeForm.controls.licenseNo.value;
        consigneeDetails.creditLimited = this.consigneeForm.controls.creditLimit.value;
        consigneeDetails.currencyCode = this.consigneeForm.controls.currencyCode.value;
        // consigneeDetails.documentName = this.consigneeForm.controls.document.value;
        const consigneeDoc = new ConsigneeDocument();
        consigneeDoc.documentName = this.consigneeForm.controls.document.value;
        consigneeDoc.documentDetails = this.consDoc.documentDetails;
        consigneeDoc.documentNo = this.consDoc.documentNo; // consigneeForm.controls.documentNumber.value;
        consigneeDetails.documentUploadeds = [];
        consigneeDetails.documentUploadeds.push(consigneeDoc);
        return consigneeDetails;
      } else {
        this.consigneeForm.markAllAsTouched();
        return null;
      }
    } catch (error) {
      console.log('Error on getConsignee: ', error);
    }
  }

  onClearConsignee() {
    try {
      this.consigneeForm.reset();
      this.consigneeForm.disable();
      this.documentList = [];
      this.disableSaveButton = true;
      this.disableClearButton = true;
      this.disableNewButton = false;
      this.disableFindButton = false;
      this.disableModifyButton = false;
      this.isFindOrModify = false;
      this.isModify = false;
    } catch (error) {
      console.log('Error on onClearConsignee: ', error);
    }
  }


  onNew() {
    try {
      this.getCountry();
      this.getCurrency();
      this.consigneeForm.enable();
      this.consigneeForm.controls.name.setValue('');
      // this.consigneeForm.controls.name.disable();
      this.disableSaveButton = true;
      this.disableClearButton = false;
      this.disableNewButton = true;
      this.disableFindButton = true;
      this.disableModifyButton = true;
      this.isFindOrModify = false;
      this.isModify = false;
      this.consigneeBuyerMatSelectRef.focus();
      //  this.indentMaterialForm.controls.indentDate.setValue(new Date());
    } catch (error) {
      console.log('Error on newIndent: ', error);
    }
  }

  onFindClick() {
    // this.getAllSupliers();
    this.disableNewButton = true;
    this.disableModifyButton = true;
    this.disableFindButton = true;
    this.disableClearButton = false;
    this.isFindOrModify = true;
    this.consigneeForm.controls.consigneeBuyer.enable();
    this.consigneeForm.controls.selectedUser.enable();
    //  setTimeout(this.orgSelectRef.nativeElement.focus(), 1000);
  }
  onModifyClick() {
    // this.getAllSupliers();
    this.disableNewButton = true;
    this.disableSaveButton = true;
    this.disableModifyButton = true;
    this.disableClearButton = false;
    this.isModify = true;
    this.isFindOrModify = true;
    this.consigneeForm.enable();
    // this.consigneeForm.controls.selectedUser.enable();
    // this.suppliersDetailsForm.controls.selectedOrg.enable();
    //  setTimeout(this.orgSelectRef.nativeElement.focus(), 1000);
  }

  onFileChange(event) {
    if (!event.target.files[0].type.toLowerCase().match('image/jp.*')
      && !event.target.files[0].type.toLowerCase().match('image/pn.*')
      && !event.target.files[0].type.toLowerCase().match('application/pd.*')) {
      this.isFileError = true;
      return;
    }
    this.disableSaveButton = false;
    this.saveBtn.nativeElement.focus();
    this.consigneeDocuments = [];
    if (event && event.target.files && event.target.files.length) {
      this.isFileError = false;
      const file: File = event.target.files[0];
      const docGivenName = this.consigneeForm.controls.document.value;
      const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
      if (!docGivenName) {
        this.consigneeForm.controls.document.setValue(name);
      }

      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.consDoc.documentDetails = String(
          myReader.result
        );
        //  this.consigneeForm.controls.documentPath.setValue(consDoc.documentDetails);
        this.consDoc.documentName = name;
        // this.consigneeDocuments.push(consDoc);
      };
      myReader.readAsDataURL(file);
    }
  }



  fillFindData(data: Consignee) {
    try {
      // this.consigneeForm.markAllAsTouched();
      const data1 = data.documentUploadeds[0];
      this.documentPath1 = data1.documentDetails;
      this.consigneeForm.patchValue({
        id: data.id,
        // consigneeBuyer: data.ConsgbuyerType,
        cbCode: data.cbCode,
        name: data.cbName,
        address: data.cbAddress,
        countryId: data.countryId,
        country: data.countryName,
        stateId: data.stateId,
        state: data.stateName,
        cityId: data.cityId,
        city: data.cityName,
        pincode: data.pinCode,
        countryAreaCode: data.countryareaCode,
        mgmName: data.managmentName,
        mgmMobileNumber: data.mobileNo,
        officeNumber: data.officeNo,
        altNumber: data.alternateNo,
        eMailID: data.mailId,
        altEMailID: data.altmailId,
        licenseNo: data.licenseNo,
        creditLimit: data.creditLimited,
        currencyCode: data.currencyCode,
        currency: data.currencyName,
      });
      if (data.documentUploadeds.length > 0) {
        this.consigneeForm.patchValue({
          document: data.documentUploadeds[0].documentName
        });
        this.consDoc.documentName = data.documentUploadeds[0].documentName;
        this.consDoc.documentDetails = data.documentUploadeds[0].documentDetails;
        this.consDoc.documentNo = data.documentUploadeds[0].documentNo;
      }


      // this.fileBase64 = data.documentUploadeds[0].documentDetails;
    } catch (error) {
      console.log('Error on fillDummyData: ', error);
    }
  }

  downloadFile(consDocument: any) {
    try {
      const indes = consDocument.indexOf('base64');
      const bytearr = consDocument.substring(indes + 7);
      const mime = consDocument.substring(5, indes + 6);
      const byteCharacters = atob(bytearr);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: mime });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {

    }
  }
}
