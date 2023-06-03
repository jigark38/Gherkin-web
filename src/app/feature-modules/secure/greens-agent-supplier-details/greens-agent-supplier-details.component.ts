import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { GreensAgentSupplierService } from './greens-agent-supplier.service';
import { SupplierInformationDetails, AgentOrgDocuments, AgentOrgDetails, AgentBankDetails } from './greens-agent-supplier-details.model';
import { CountryModel, StateModel, DistrictModel, MandalModel } from '../../agri-management/master/centre-areasand-villages/centre-areasand-villages.model';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { Place } from '../suppliers-details/suppliers-details.model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { SuppliersDetailsService } from '../suppliers-details/suppliers-details.service';
// import { StateModel } from '../purchase-order/purchage-order.models';

@Component({
  selector: 'app-greens-agent-supplier-details',
  templateUrl: './greens-agent-supplier-details.component.html',
  styleUrls: ['./greens-agent-supplier-details.component.css']
})
export class GreensAgentSupplierDetailsComponent implements OnInit {

  @ViewChild('docName', { read: ElementRef, static: false }) docName: ElementRef;
  @ViewChild('agentOrgDetail', { read: ElementRef, static: false }) agentOrgDetail: ElementRef;
  @ViewChild('bankName', { read: ElementRef, static: false }) bankName: ElementRef;
  @ViewChild('saveBtn', { read: ElementRef, static: false }) saveBtn: ElementRef;

  constructor(
    public authService: AuthenticationService,
    public greensAgentSuplrService: GreensAgentSupplierService,
    private dialog: MatDialog,
    private service: WebservicewrapperService,
    private supplierService: SuppliersDetailsService,
    private alertService: AlertService
  ) {
    this.countryList = new Array<CountryModel>();
    this.stateList = new Array<StateModel>();
    this.districtList = new Array<DistrictModel>();
    this.mandalList = new Array<MandalModel>();
    this.placeList = new Array<Place>();
    this.agentOrgDetailList = new Array<AgentOrgDetails>();
  }

  agentOrgDetailControl = new FormControl({ value: null });
  greensAgentSupplierForm: FormGroup;
  agentDocumentForm: FormGroup;
  agentBankDetailsForm: FormGroup;
  employeeName: string;
  employeeId: number;
  filteredCountry: Observable<any>;
  filteredState: Observable<any>;
  filteredDistrict: Observable<any>;
  filteredMandal: Observable<any>;
  filteredPlace: Observable<any>;
  filteredAgentOrgDetail: Observable<any>;
  countryList: any[];
  countryOptionsList: string[];
  stateList: any[];
  stateOptionsList: string[];
  districtList: any[];
  districtOptionsList: string[];
  mandalList = null;
  villageList = null;
  placeList: any[];
  placeOptionsList: string[];
  agentOrgDetailList = null;
  addGreensBtnClicked = false;
  addBankBtnClicked = false;
  findBtnClicked = false;
  modifyBtnClicked = false;
  saveBtnClicked = false;
  currentDate: Date = new Date();
  addGreensBtnDisable = false;
  addBankBtnDisable = false;
  saveBtnDisable = true;
  findBtnDisable = false;
  modifyBtnDisable = false;
  isFileError = false;
  documentList = [];
  agntBankDetailList = [];
  supplierInformationDetails = new SupplierInformationDetails();
  base64textString: any;
  showAgntNameTxtBox = true;

  ngOnInit() {
    this.greensAgentSupplierForm = new FormGroup({
      agentOrgID: new FormControl(null),
      agentCreationDate: new FormControl(null, Validators.required),
      empCreatedID: new FormControl(null, Validators.required),
      empCreatedName: new FormControl(null),
      agentOrganisationName: new FormControl(null, Validators.required),
      agentOrganisationLegalStatus: new FormControl(null, Validators.required),
      agentOrganisationAddress: new FormControl(null, Validators.required),
      countryCode: new FormControl(null, Validators.required),
      stateCode: new FormControl(null, Validators.required),
      districtCode: new FormControl(null, Validators.required),
      placeCode: new FormControl(null),
      // placeName: new FormControl(null, Validators.required),
      agentPINCode: new FormControl(null),
      agentManagementName: new FormControl(null, Validators.required),
      agentManagementDesignation: new FormControl(null, Validators.required),
      agentManagementCN: new FormControl(null, Validators.required),
      agentManagementMID: new FormControl(null, Validators.email),
      agentOrganisationOfficeNumber: new FormControl(null),
      agentOrganisationActivity: new FormControl(null),
      agentOrganisationGSTN: new FormControl(null),
      agentOrganisationWebsite: new FormControl(null, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')),
    });

    this.agentDocumentForm = new FormGroup({
      agentOrgDocNo: new FormControl(null),
      agentOrgID: new FormControl(null),
      agentDocumentName: new FormControl(null),
      agentDocumentDetails: new FormControl(null),
      documentPath: new FormControl(null)
    });

    this.agentBankDetailsForm = new FormGroup({
      agentBankCode: new FormControl(null),
      agentOrgID: new FormControl(null),
      agentOrganisationBankName: new FormControl(null, Validators.required),
      agentOrganisationBankBranch: new FormControl(null, Validators.required),
      agentOrganisationBankAccountNo: new FormControl(null, Validators.required),
      agentOrganisationBankIFSC: new FormControl(null, Validators.required),
      preferredBank: new FormControl(null),
    });

    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.reset();
    this.getCountry();
  }

  reset() {
    this.showAgntNameTxtBox = true;
    this.addGreensBtnClicked = false;
    this.addBankBtnClicked = false;
    this.findBtnClicked = false;
    this.modifyBtnClicked = false;
    this.saveBtnClicked = false;
    this.addGreensBtnDisable = false;
    this.addBankBtnDisable = false;
    this.saveBtnDisable = true;
    this.findBtnDisable = false;
    this.modifyBtnDisable = false;
    this.greensAgentSupplierForm.reset();
    this.greensAgentSupplierForm.disable();
    this.agentBankDetailsForm.reset();
    this.agentBankDetailsForm.disable();
    this.agentDocumentForm.reset();
    this.agentDocumentForm.disable();
    this.agntBankDetailList = [];
    this.documentList = [];
    this.countryList = [];
    this.countryOptionsList = [];
    this.stateList = [];
    this.stateOptionsList = [];
    this.districtList = [];
    this.districtOptionsList = [];
    this.placeList = [];
    this.placeOptionsList = [];
  }

  clearAndReset() {
    // this.reset();
    // this.ngOnInit();
    window.location.reload();
  }

  getCountry() {
    this.greensAgentSuplrService.getCountryList().subscribe((res: any[]) => {
      this.stateList = [];
      this.stateOptionsList = [];
      this.greensAgentSupplierForm.controls.stateCode.setValue('');
      this.countryList = res;
      this.countryOptionsList = this.countryList.map(a => a.countryName);
      this.countryOptionsList = this.countryOptionsList.slice();
      // this.greensAgentSupplierForm.controls.stateCode.reset();
      // this.greensAgentSupplierForm.controls.districtCode.reset();
      // this.greensAgentSupplierForm.controls.placeCode.reset();
      // this.filteredCountry = this.greensAgentSupplierForm.controls.countryCode.valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => typeof value === 'string' ? value : value.countryCode),
      //     map(name => name ? this._filterCountry(name) : this.countryList.slice()),
      //   );
    }, () => {
      this.countryList = [];
      this.countryOptionsList = [];
    });
  }
  saveCountry(e) {

    if (e && !this.countryList.filter(a => a.countryName.toUpperCase() === e.trim().toUpperCase())[0]) {
      this.service.AddCountry(e.trim().toUpperCase()).subscribe((data: CountryModel) => {
        if (data) {
          this.countryList.push(data);
          this.countryOptionsList.push(data.countryName);
          this.countryOptionsList = this.countryOptionsList.slice();
          this.alertService.success('Country ' + data.countryName + ' created successfully.');
          this.stateList = [];
          this.stateOptionsList = [];
          this.greensAgentSupplierForm.controls.stateCode.setValue('');
          this.districtList = [];
          this.districtOptionsList = [];
          this.greensAgentSupplierForm.controls.districtCode.setValue('');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        } else {
          this.stateList = [];
          this.stateOptionsList = [];
          this.greensAgentSupplierForm.controls.stateCode.setValue('');
          this.districtList = [];
          this.districtOptionsList = [];
          this.greensAgentSupplierForm.controls.districtCode.setValue('');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        }
      }, err => {
        this.alertService.error('Error while creating new country.');
        this.stateList = [];
        this.stateOptionsList = [];
        this.greensAgentSupplierForm.controls.stateCode.setValue('');
        this.districtList = [];
        this.districtOptionsList = [];
        this.greensAgentSupplierForm.controls.districtCode.setValue('');
        this.placeList = [];
        this.placeOptionsList = [];
        this.greensAgentSupplierForm.controls.placeCode.setValue('');
      });
    }
  }
  changeCountryValue(e) {
    if (e) {
      const countryObj = this.countryList.filter(a => a.countryName === e.trim())[0];
      if (countryObj) {
        this.greensAgentSuplrService.getStateList(countryObj.countryCode).subscribe(
          (data: StateModel[]) => {
            this.stateList = [];
            this.stateOptionsList = [];
            this.greensAgentSupplierForm.controls.stateCode.setValue('');
            this.districtList = [];
            this.districtOptionsList = [];
            this.greensAgentSupplierForm.controls.districtCode.setValue('');
            this.placeList = [];
            this.placeOptionsList = [];
            this.greensAgentSupplierForm.controls.placeCode.setValue('');
            this.stateList = data;
            this.stateOptionsList = this.stateList.map(a => a.stateName);
          }, err => {
            this.stateList = [];
            this.stateOptionsList = [];
            this.greensAgentSupplierForm.controls.stateCode.setValue('');
            this.districtList = [];
            this.districtOptionsList = [];
            this.greensAgentSupplierForm.controls.districtCode.setValue('');
            this.placeList = [];
            this.placeOptionsList = [];
            this.greensAgentSupplierForm.controls.placeCode.setValue('');
          });
      }
    } else {
      this.stateList = [];
      this.stateOptionsList = [];
      this.greensAgentSupplierForm.controls.stateCode.setValue('');
      this.districtList = [];
      this.districtOptionsList = [];
      this.greensAgentSupplierForm.controls.districtCode.setValue('');
      this.placeList = [];
      this.placeOptionsList = [];
      this.greensAgentSupplierForm.controls.placeCode.setValue('');
    }
  }

  saveState(e) {
    if (e && this.greensAgentSupplierForm.controls.countryCode.value &&
      !this.stateList.filter(a => a.stateName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
      const countryCode: string = this.countryList.filter(a => a.countryName.toUpperCase() ===
        this.greensAgentSupplierForm.controls.countryCode.value.toUpperCase())[0].countryCode;
      const state: StateModel = new StateModel();
      state.stateName = e.trim().toUpperCase();
      state.countryCode = countryCode;
      this.service.AddState(state).subscribe((data: StateModel) => {
        if (data) {
          this.stateList.push(data);
          this.stateOptionsList.push(data.stateName);
          this.stateOptionsList = this.stateOptionsList.slice();
          this.alertService.success('State ' + data.stateName + ' created successfully.');
          this.districtList = [];
          this.districtOptionsList = [];
          this.greensAgentSupplierForm.controls.districtCode.setValue('');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        } else {
          this.districtList = [];
          this.districtOptionsList = [];
          this.greensAgentSupplierForm.controls.districtCode.setValue('');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        }
      }, err => {
        this.alertService.error('Error has occured while creating the state.');
      });
    }
  }


  changeStateValue(e) {
    if (e) {
      const selectedState = this.stateList.filter(a => a.stateName === e.trim())[0];
      if (selectedState) {
        this.greensAgentSuplrService.getDistrictList(selectedState.stateCode).subscribe((res: DistrictModel[]) => {
          this.districtList = [];
          this.districtOptionsList = [];
          this.greensAgentSupplierForm.controls.districtCode.setValue('');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
          this.districtList = res;
          this.districtOptionsList = this.districtList.map(a => a.districtName.toUpperCase());
        }, err => {
          this.districtList = [];
          this.districtOptionsList = [];
          this.greensAgentSupplierForm.controls.districtCode.setValue('');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        });
      } else {
        this.districtList = [];
        this.districtOptionsList = [];
        this.greensAgentSupplierForm.controls.districtCode.setValue('');
        this.placeList = [];
        this.placeOptionsList = [];
        this.greensAgentSupplierForm.controls.placeCode.setValue('');
      }
    } else {
      this.districtList = [];
      this.districtOptionsList = [];
      this.greensAgentSupplierForm.controls.districtCode.setValue('');
      this.placeList = [];
      this.placeOptionsList = [];
      this.greensAgentSupplierForm.controls.placeCode.setValue('');
    }
  }

  saveDistrict(e) {
    if (e && this.greensAgentSupplierForm.controls.countryCode.value && this.greensAgentSupplierForm.controls.stateCode.value &&
      !this.districtList.filter(a => a.districtName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
      const countryCode: string = this.countryList.filter(a => a.countryName.toUpperCase() ===
        this.greensAgentSupplierForm.controls.countryCode.value.toUpperCase())[0].countryCode;
      const stateCode: string = this.stateList.filter(a => a.stateName.toUpperCase() ===
        this.greensAgentSupplierForm.controls.stateCode.value.toUpperCase())[0].stateCode;
      const district: DistrictModel = new DistrictModel();
      district.countryCode = countryCode;
      district.stateCode = stateCode;
      district.districtName = e.trim().toUpperCase();

      this.service.AddDistrict(district).subscribe((data: DistrictModel) => {
        if (data) {
          this.districtList.push(data);
          this.districtOptionsList.push(data.districtName);
          this.districtOptionsList = this.districtOptionsList.slice();
          this.alertService.success('District ' + data.districtName + ' created successfully.');
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        }
      }, err => {
        this.alertService.error('Error has occured while creating district.');
        this.placeList = [];
        this.placeOptionsList = [];
        this.greensAgentSupplierForm.controls.placeCode.setValue('');
      });
    }
  }

  changeDistrictValue(e) {
    if (e) {
      const selectedDistrict = this.districtList.filter(a => a.districtName === e.trim())[0];
      if (selectedDistrict) {
        this.greensAgentSuplrService.getPlaceByDistrict(selectedDistrict.districtCode).subscribe((res: any) => {
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
          this.placeList = res;
          this.placeOptionsList = this.placeList.map(a => a.PlaceName.toUpperCase());
        }, err => {
          this.placeList = [];
          this.placeOptionsList = [];
          this.greensAgentSupplierForm.controls.placeCode.setValue('');
        });
      } else {
        this.placeList = [];
        this.placeOptionsList = [];
        this.greensAgentSupplierForm.controls.placeCode.setValue('');
      }
    } else {
      this.placeList = [];
      this.placeOptionsList = [];
      this.greensAgentSupplierForm.controls.placeCode.setValue('');
    }
  }

  placeValueChange(e) {

  }

  savePlaceToList(e) {
    if (e && this.greensAgentSupplierForm.controls.countryCode.value && this.greensAgentSupplierForm.controls.stateCode.value &&
      this.greensAgentSupplierForm.controls.districtCode.value &&
      !this.placeList.filter(a => a.placeName.trim().toUpperCase() === e.trim().toUpperCase())[0]) {
      const countryCode: string = this.countryList.filter(a => a.countryName.toUpperCase() ===
        this.greensAgentSupplierForm.controls.countryCode.value.toUpperCase())[0].countryCode;
      const stateCode: string = this.stateList.filter(a => a.stateName.toUpperCase() ===
        this.greensAgentSupplierForm.controls.stateCode.value.toUpperCase())[0].stateCode;
      const districtCode: string = this.districtList.filter(a => a.districtName.toUpperCase() ===
        this.greensAgentSupplierForm.controls.districtCode.value.toUpperCase())[0].districtCode;
      const place = new Place();
      place.CountryCode = countryCode;
      place.StateCode = stateCode;
      place.DistrictCode = districtCode;
      place.PlaceName = e.trim().toUpperCase();
      this.supplierService.savePlace(place).subscribe((data: Place) => {
        if (data) {
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

  private _filterCountry(name: string): any {
    const filterValue = name.toLowerCase();
    return this.countryList.filter(option => option.countryName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayCountry(searchItem): string {
    if (searchItem != null) {
      const data = this.countryList.find(_ => _.countryCode === searchItem);
      return data ? this.countryList.find(_ => _.countryCode === searchItem).countryName : '';
    }
  }


  getState(contryCode) {
    if (contryCode !== null) {

      this.greensAgentSupplierForm.controls.districtCode.reset();
      this.greensAgentSupplierForm.controls.placeCode.reset();
      this.greensAgentSuplrService.getStateList(contryCode).subscribe((res: any[]) => {
        this.stateList = res;
        this.stateOptionsList = this.stateList.map(a => a.stateName);
        setTimeout(() => {
          this.greensAgentSupplierForm.controls.countryCode.setValue(this.countryList.find(a => a.countryCode == contryCode).countryName);
        }, 1500);
        // this.filteredState = this.greensAgentSupplierForm.controls.stateCode.valueChanges
        //   .pipe(
        //     startWith(''),
        //     map(value => typeof value === 'string' ? value : value.stateCode),
        //     map(name => name ? this._filterState(name) : this.stateList.slice())
        //   );

      });
    }
  }
  private _filterState(name: string): any {
    const filterValue = name.toLowerCase();
    return this.stateList.filter(option => option.stateName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayState(searchItem): string {
    if (searchItem != null) {
      const data = this.stateList.find(_ => _.stateCode === searchItem);
      return data ? this.stateList.find(_ => _.stateCode === searchItem).stateName : '';
    }
  }

  getDistrict(stateCode) {
    if (stateCode !== null) {
      this.greensAgentSupplierForm.controls.placeCode.reset();
      // this.greensAgentSupplierForm.controls.placeName.reset();
      this.greensAgentSuplrService.getDistrictList(stateCode).subscribe((res: any[]) => {
        this.districtList = res;
        this.districtOptionsList = this.districtList.map(a => a.districtName);
        setTimeout(() => {
          this.greensAgentSupplierForm.controls.stateCode.setValue(this.stateList.find(a => a.stateCode == stateCode).stateName);
        }, 1500);
        // this.filteredDistrict = this.greensAgentSupplierForm.controls.districtCode.valueChanges
        //   .pipe(
        //     startWith(''),
        //     map(value => typeof value === 'string' ? value : value.districtCode),
        //     map(name => name ? this._filterDistrict(name) : this.districtList.slice())
        //   );

      });
    }
  }
  private _filterDistrict(name: string): any {
    const filterValue = name.toLowerCase();
    return this.districtList.filter(option => option.districtName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayDistrict(searchItem): string {
    if (searchItem != null) {
      const data = this.districtList.find(_ => _.districtCode === searchItem);
      return data ? this.districtList.find(_ => _.districtCode === searchItem).districtName : '';
    }
  }

  setPlace(placeCode) {
    if (placeCode != 0 && this.placeList.length > 0) {
      this.greensAgentSupplierForm.controls.placeCode.setValue(this.placeList.find(x => x.PlaceCode == placeCode).PlaceName);
    }
  }

  getPlace(districtCode, placeCode) {
    if (districtCode !== null) {
      this.greensAgentSuplrService.getPlaceByDistrict(districtCode).subscribe((res: any) => {
        this.placeList = res;
        this.placeOptionsList = this.placeList.map(a => a.PlaceName);
        setTimeout(() => {
          this.greensAgentSupplierForm.controls.districtCode.setValue(this.districtList.find(a => a.districtCode == districtCode).districtName);
          this.greensAgentSupplierForm.controls.placeCode.setValue(this.placeList.find(a => a.PlaceCode == placeCode).PlaceName);

        }, 1500);
      });
    }
  }
  private _filterPlace(name: string): any {
    const filterValue = name.toLowerCase();
    return this.placeList.filter(option => option.PlaceName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayPlace(searchItem): string {
    if (searchItem != null) {
      const data = this.placeList.find(_ => _.PlaceCode === searchItem);
      return data ? this.placeList.find(_ => _.PlaceCode === searchItem).PlaceName : '';
    }
  }

  getAgentOrgDetail() {
    this.greensAgentSuplrService.GetAgentOrganisationDetails().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.agentOrgDetailList = res.Data;
        this.filteredAgentOrgDetail = this.agentOrgDetailControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.agentOrgID),
            map(name => name ? this._filterAgentOrgDetail(name) : this.agentOrgDetailList.slice())
          );
      } else {
        this.agentOrgDetailList = [];
        this.alertService.error('Failed to get Organization details');
      }

    });
  }
  private _filterAgentOrgDetail(name: string): any {
    const filterValue = name.toLowerCase();
    return this.agentOrgDetailList.filter(option => option.agentOrganisationName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayAgentOrgDetail(searchItem): string {
    if (searchItem != null) {
      const data = this.agentOrgDetailList.find(_ => _.agentOrgID === searchItem);
      return data ? this.agentOrgDetailList.find(_ => _.agentOrgID === searchItem).agentOrganisationName : '';
    }
  }

  onAddGreensClick() {
    this.addGreensBtnClicked = true;
    this.addBankBtnClicked = false;
    this.addGreensBtnDisable = true;
    this.addBankBtnDisable = true;
    this.saveBtnDisable = true;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.getAgentOrgDetail();
    this.greensAgentSupplierForm.enable();
    this.agentDocumentForm.enable();
    this.greensAgentSupplierForm.controls.empCreatedID.setValue(this.employeeId);
    this.greensAgentSupplierForm.controls.empCreatedName.setValue(this.employeeName);
    this.greensAgentSupplierForm.controls.agentCreationDate.setValue(this.currentDate);
    this.greensAgentSupplierForm.controls.empCreatedName.disable();
    setTimeout(() => {
      this.greensAgentSupplierForm.valueChanges.subscribe(val => {
        console.log(this.greensAgentSupplierForm.value);
        if (this.greensAgentSupplierForm.valid) {
          this.saveBtnDisable = false;
        }
      });
    });
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
      const docGivenName = this.agentDocumentForm.controls.agentDocumentName.value;
      const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
      if (!docGivenName) {
        this.agentDocumentForm.controls.agentDocumentName.setValue(name);
      }

      const supDoc = new AgentOrgDocuments();

      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        supDoc.agentDocumentDetails = (
          this.strToUtf16Bytes(myReader.result)
        );

      };
      myReader.readAsDataURL(file);


      supDoc.agentDocumentName = file.name;
      this.documentList.push(supDoc);

      this.agentDocumentForm.patchValue({
        agentDocumentName: '',
        documentPath: ''
      });

      this.agentDocumentForm.markAllAsTouched();
      if (this.agentDocumentForm.invalid) {
        return;
      }
      // this.dialogService.addSuppierDialog().subscribe(res => {
      //   if (res) {
      //     setTimeout(() => this.documentField.nativeElement.focus(), 1000);
      //   } else {
      //     this.disableSaveButton = false;
      //     setTimeout(() => this.saveBtnRef.nativeElement.focus(), 1000);
      //   }
      // });
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do You Want to add more documents?'
      });
      dialogRef.afterClosed().subscribe((res) => {

        if (res) {
          setTimeout(() => this.docName.nativeElement.focus(), 1000);
        } else {

        }
      });
    }

    // this.addSupplier();
  }

  strToUtf16Bytes(str) {
    const bytes = [];
    for (let ii = 0; ii < str.length; ii++) {
      const code = str.charCodeAt(ii); // x00-xFFFF
      bytes.push(code & 255, code >> 8); // low, high
    }
    return bytes;
  }



  onSaveGreensClick() {
    if (this.addGreensBtnClicked) {
      this.supplierInformationDetails = new SupplierInformationDetails();
      this.supplierInformationDetails = this.greensAgentSupplierForm.value;
      this.supplierInformationDetails.agentOrgDocumentsList = [];
      this.supplierInformationDetails.agentBankDetailsList = [];
      this.supplierInformationDetails.agentOrgDocumentsList = this.documentList;
      this.supplierInformationDetails.countryCode = this.countryList.find(a => a.countryName == this.greensAgentSupplierForm.controls.countryCode.value).countryCode;
      this.supplierInformationDetails.stateCode = this.stateList.find(a => a.stateName == this.greensAgentSupplierForm.controls.stateCode.value).stateCode;
      this.supplierInformationDetails.districtCode = this.districtList.find(a => a.districtName == this.greensAgentSupplierForm.controls.districtCode.value).districtCode;
      this.supplierInformationDetails.placeCode = this.placeList.find(a => a.PlaceName == this.greensAgentSupplierForm.controls.placeCode.value).PlaceCode;
      this.supplierInformationDetails.placeName = this.placeList.find(a => a.PlaceName == this.greensAgentSupplierForm.controls.placeCode.value).PlaceName;
      this.greensAgentSuplrService.saveSupplierdetails(this.supplierInformationDetails).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.alertService.success('Suppliers Details Successfully Inserted Successfully');
        } else {
          this.alertService.error('Failed to Insert Suppliers Details');
        }
      });
    } else if (this.addBankBtnClicked) {
      this.greensAgentSuplrService.saveBankAccountDetails(this.agntBankDetailList).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.alertService.success('Bank account Details Successfully Inserted Successfully');
        } else {
          this.alertService.error('Failed to Insert Bank Account Details');
        }
      })
    } else if (this.modifyBtnClicked) {
      this.supplierInformationDetails = new SupplierInformationDetails();
      this.supplierInformationDetails = this.greensAgentSupplierForm.value;
      this.supplierInformationDetails.agentOrgDocumentsList = [];
      this.supplierInformationDetails.agentBankDetailsList = [];
      this.supplierInformationDetails.agentOrgDocumentsList = this.documentList;
      this.supplierInformationDetails.countryCode = this.countryList.find(a => a.countryName == this.greensAgentSupplierForm.controls.countryCode.value).countryCode;
      this.supplierInformationDetails.stateCode = this.stateList.find(a => a.stateName == this.greensAgentSupplierForm.controls.stateCode.value).stateCode;
      this.supplierInformationDetails.districtCode = this.districtList.find(a => a.districtName == this.greensAgentSupplierForm.controls.districtCode.value).districtCode;
      this.supplierInformationDetails.placeCode = this.placeList.find(a => a.PlaceName == this.greensAgentSupplierForm.controls.placeCode.value).PlaceCode;
      this.supplierInformationDetails.placeName = this.placeList.find(a => a.PlaceName == this.greensAgentSupplierForm.controls.placeCode.value).PlaceName;
      this.greensAgentSuplrService.modifyGreensAgentSupplier(this.supplierInformationDetails).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.alertService.success('Suppliers Details Successfully Updated Successfully');
        } else {
          this.alertService.error('Failed to update Suppliers Details');
        }
      });
    }
  }

  GetAgentOrganisationDetails() {
    this.greensAgentSuplrService.GetAgentOrganisationDetails().subscribe((res: any) => {
      if (res.IsSucceed) {

      } else {

      }
    });
  }

  onAddBankClick() {
    this.reset();
    this.addGreensBtnDisable = true;
    this.addBankBtnDisable = true;
    this.saveBtnDisable = true;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.addBankBtnClicked = true;
    this.showAgntNameTxtBox = false;
    this.getAgentOrgDetail();
    this.agentBankDetailsForm.enable();
    this.agentOrgDetailControl.setValue('');

    setTimeout(() => this.agentOrgDetail.nativeElement.focus(), 1000);
    setTimeout(() => {
      this.agentBankDetailsForm.valueChanges.subscribe(val => {
        if (this.agentBankDetailsForm.valid) {
          this.saveBtnDisable = false;
        }
      });
    });
  }

  getAgentDetail() {
    const agentOrgID = this.agentOrgDetailControl.value;
    this.greensAgentSuplrService.GetSupplierInformationDetail(agentOrgID).subscribe((res: any) => {
      if (res.IsSucceed) {
        this.supplierInformationDetails = res.Data;
        this.getState(res.Data.countryCode);
        this.getDistrict(res.Data.stateCode);
        this.getPlace(res.Data.districtCode, res.Data.placeCode);
        this.greensAgentSupplierForm.enable();
        setTimeout(() => this.greensAgentSupplierForm.patchValue(res.Data,), 1000);
        this.documentList = res.Data.agentOrgDocumentsList;
        this.agntBankDetailList = res.Data.agentBankDetailsList;
        if (this.addBankBtnClicked) {
          setTimeout(() => this.bankName.nativeElement.focus(), 1000);
        } else if (this.findBtnClicked) {
          this.greensAgentSupplierForm.disable();
        } else if (this.modifyBtnClicked) {
          this.greensAgentSupplierForm.enable();
          this.agentDocumentForm.enable();
        }


      } else {

      }
    });
  }

  addMore() {
    if (this.agentBankDetailsForm.valid) {
      let agntBankDetail = new AgentBankDetails();
      agntBankDetail = this.agentBankDetailsForm.value;
      agntBankDetail.agentOrgID = this.supplierInformationDetails.agentOrgID;
      if (agntBankDetail.preferredBank == "Yes") {
        this.agntBankDetailList.forEach(x => x.preferredBank = 'No')
      } else {
        if (!this.agntBankDetailList.some(x => x.preferredBank == 'Yes')) {
          agntBankDetail.preferredBank = "Yes"
        }
      }
      this.agntBankDetailList.push(agntBankDetail);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do You Want to add more bank details?'
      });
      dialogRef.afterClosed().subscribe((res) => {

        if (res) {
          this.bankName.nativeElement.focus();
        } else {
          this.saveBtn.nativeElement.focus();
        }
      });
    }
  }

  onFindClick() {
    this.reset();
    this.modifyBtnClicked = false;
    this.addBankBtnClicked = false;
    this.findBtnClicked = true;
    this.addGreensBtnDisable = true;
    this.addBankBtnDisable = true;
    this.saveBtnDisable = true;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.showAgntNameTxtBox = false;
    this.getAgentOrgDetail();
    this.agentOrgDetailControl.setValue('');
    setTimeout(() => this.agentOrgDetail.nativeElement.focus(), 1000);
  }

  onModifyClick() {
    this.reset();
    this.modifyBtnClicked = true;
    this.addBankBtnClicked = false;
    this.findBtnClicked = false;
    this.addGreensBtnDisable = true;
    this.addBankBtnDisable = true;
    //this.saveBtnDisable = true;
    this.findBtnDisable = true;
    this.modifyBtnDisable = true;
    this.showAgntNameTxtBox = false;
    this.getAgentOrgDetail();
    this.agentOrgDetailControl.setValue('');
    this.greensAgentSupplierForm.controls.empCreatedID.setValue(this.employeeId);
    this.greensAgentSupplierForm.controls.empCreatedName.setValue(this.employeeName);
    setTimeout(() => this.agentOrgDetail.nativeElement.focus(), 1000);
    setTimeout(() => {
      this.agentBankDetailsForm.valueChanges.subscribe(val => {
        if (this.agentBankDetailsForm.valid) {
          this.saveBtnDisable = false;
        }
      });
    });
  }

  deleteDoc(doc, i) {
    this.documentList.splice(i, 1);
    if (doc.AgentOrgDocNo != null || doc.AgentOrgDocNo != 0) {
      this.greensAgentSuplrService.deleteDocumentByDocId(doc.AgentOrgDocNo).subscribe((res: any) => {
        if (res.IsSucceed) {
          this.alertService.success('Document deleted Successfully');
        } else {
          this.alertService.error('Failed to delete doc');
        }
      });
    }
  }
}
