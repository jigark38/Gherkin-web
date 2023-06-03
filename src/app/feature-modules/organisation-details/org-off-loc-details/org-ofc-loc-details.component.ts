import * as R from 'ramda';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActionParams } from 'src/app/shared/components/ng-grid/grid.models';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { OrgLocation } from './org-ofc-loc-model';
import { OrgLocationService } from './org-ofc-loc.service';
import { SuppliersDetailsService } from '../../secure/suppliers-details/suppliers-details.service';
import { Country, State, District, Place } from '../../secure/suppliers-details/suppliers-details.model';

@Component({
  selector: 'app-org-ofc-loc-details',
  templateUrl: './org-ofc-loc-details.component.html',
  providers: [ConfirmationService, MessageService]
})
export class OrganisationOfficesLocatonsDetailsComponent implements OnInit {
  @Input() orgId: any;
  @ViewChild('country', { static: true }) country;
  @ViewChild('state', { static: true }) state;
  @ViewChild('district', { static: true }) district;
  @ViewChild('city', { static: true }) city;
  locationForm: FormGroup;
  locationModel: OrgLocation = new OrgLocation();
  locationDetails: OrgLocation[] = [];
  locationCols: any[];
  countries: Country[] = [];
  filteredCountries: Observable<any[]>;
  states: any[] = [];
  filteredStates: any[] = [];
  msgs: Message[] = [];
  actionParams: ActionParams;
  mode: any = 'Add';
  stateCode: any = 'AP';
  places: any[] = [];
  filteredPlaces: any[] = [];
  districts: any[] = [];
  filteredDistricts: any[] = [];
  keyword = 'countryName';
  locationData: any;
  countryOptionsList: string[];
  stateOptionsList: any;
  districtOptionsList: any;
  placeOptionsList: any;
  constructor(private formBuilder: FormBuilder,
    private locService: OrgLocationService,
    private alertService: AlertService,
    private supplierService: SuppliersDetailsService) { }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: any) {
    if (changes && changes.orgId
      && (changes.orgId.firstChange ||
        (changes.orgId.currentValue !== changes.orgId.previousValue))) {
      this.getLocationDetails();
      if (this.locationForm) {
        this.locationForm.reset();
        this.patchOrgId(changes.orgId.currentValue);
      }
      this.mode = 'Add';
    }
  }
  countryChange(item) {
    if (item) {
      this.states = [];
      this.districts = [];
      this.places = [];

      this.stateOptionsList = [];
      this.districtOptionsList = [];
      this.placeOptionsList = [];


      this.locationForm.controls.stateCode.reset();
      this.locationForm.controls.districtCode.reset();
      this.locationForm.controls.PlaceCode.reset();

      const selectedCountry = this.countries.filter(p => p.countryName === item.trim())[0];
      this.clearCascade('country');
      if (selectedCountry) {
        this.getStatesbyCountryId(selectedCountry.countryCode);
      }

    }
  }

  saveStateToList(state: string) {
    if (state && !this.states.filter(c => c.stateName === state)[0]) {
      const stateObj = new State();
      stateObj.stateName = state;
      const abc = this.locationForm.controls.countryCode;
      const country = this.countries.filter(a => a.countryName === this.locationForm.controls.countryCode.value)[0];
      if (country) {
        stateObj.countryCode = country.countryCode;
        this.supplierService.saveState(stateObj).subscribe((data: State) => {
          if (data) {

            this.locationForm.controls.stateCode.setValue(data.stateName);
            this.states.push(data);
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

  stateChange(item) {
    if (item) {
      const selectedState = this.states.filter(p => p.stateName === item.trim())[0];
      this.clearCascade('state');
      if (selectedState) {
        this.districts = [];
        this.places = [];
        this.districtOptionsList = [];
        this.placeOptionsList = [];
        this.locationForm.controls.districtCode.reset();
        this.locationForm.controls.PlaceCode.reset();
        this.getdistricts(selectedState.stateCode);
      }
    }
  }

  districtChange(item) {
    if (item) {

      if (this.districts) {
        const selectedDistrict = this.districts.filter(p => p.districtName === item.trim())[0];
        if (selectedDistrict) {
          this.places = [];
          this.placeOptionsList = [];
          this.locationForm.controls.PlaceCode.reset();
          this.locationForm.controls.districtCode.setValue(selectedDistrict.districtName);
          this.getPlaces(selectedDistrict.districtCode);
        }
      }
      this.clearCascade('district');
    }
  }

  saveDistrictToList(district: string) {
    if (district && !this.districts.filter(c => c.districtName === district)[0]) {
      const districtObj = new District();
      districtObj.districtName = district;
      const country = this.countries.filter(a => a.countryName === this.locationForm.controls.countryCode.value)[0];
      if (country) {
        districtObj.countryCode = country.countryCode;
        const selectedState = this.states.filter(p => p.stateName === this.locationForm.controls.stateCode.value)[0];
        if (!selectedState && selectedState.stateCode === 0) {
          this.alertService.warning('Please select state to add district.');
        } else {
          districtObj.stateCode = selectedState.stateCode;
          this.supplierService.saveDistrict(districtObj).subscribe((data: District) => {
            if (data) {
              this.locationForm.controls.districtCode.setValue(data.districtName);
              this.districts.push(data);
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



  async ngOnInit() {
    try {
      this.loadData();
      this.createForm();
      this.getAllCountries();
    } catch (error) {
      console.error('error on  ngOnInit', error);
    }
  }

  patchOrgId(orgId: any) {
    if (this.locationForm) {
      this.locationForm.patchValue({ orgCode: orgId });
    }
  }
  createForm() {
    try {
      this.locationForm = this.formBuilder.group({
        ...this.locationModel
      });
      this.locationForm.get('orgOfficeName').setValidators([Validators.required, Validators.maxLength(50)]);
      this.locationForm.get('countryCode').setValidators([Validators.required]);
      this.locationForm.get('stateCode').setValidators([Validators.required]);
      this.locationForm.get('PlaceCode').setValidators([Validators.required]);
      this.locationForm.get('districtCode').setValidators([Validators.required]);
      this.locationForm.get('locationPhoneDetails').setValidators([Validators.pattern('^[0-9]{10}$')]);
      this.locationForm.patchValue({ orgCode: this.orgId });
    } catch (error) {
      console.error('error while createForm', error);
    }
  }


  loadData() {
    try {
      this.locationCols = [
        { field: 'orgOfficeName', header: 'Office Name' },
        { field: 'natureOfficeDetails', header: 'Nature of Office' },
        { field: 'locationOfficeAddress', header: 'Address' },
        { field: 'countryName', header: 'Country' },
        { field: 'stateName', header: 'State' },
        { field: 'districtName', header: 'District' },
        { field: 'placeName', header: 'City' },
        { field: 'locationPhoneDetails', header: 'Phone No' },
        { field: 'locationFaxDetails', header: 'Fax No' },
        { field: 'locationCellPhone', header: 'Mobile No' },
        { field: 'locationEmailId', header: 'Email Id', width: '150px' },
        { field: 'laborLicenseNo', header: 'Labour Certification No' },
        { field: 'otherLicenseDetails', header: 'Other Licenses Details' }
      ];
      this.actionParams = { enabled: true, showEdit: true, showDelete: false };
      // this.countries = countries;
    } catch (error) {
      console.error('error on loadData', error);
    }
  }

  clearLocDetails() {
    try {
      // this.country.clear();
      // this.state.clear();
      // this.district.clear();
      // this.city.clear();
      // this.country.close();
      this.states = this.districts = this.places = [];
      this.mode = 'Add';
      this.locationForm.reset();
      this.locationForm.patchValue({ orgCode: this.orgId });
    } catch (error) {
      console.error('error on clearLocDetails', error);
    }
  }
  addorUpdateDetails() {
    if (this.mode === 'Add') {
      this.addLocationDetails();
    } else {
      this.UpdateLocationDetails();
    }
  }
  processLocationData() {
    this.locationData = Object.assign({}, this.locationForm.value);
    const data = Object.assign({}, this.locationForm.value);

    if (typeof data.locationPhoneDetails === 'number') {
      data.locationPhoneDetails = +data.locationPhoneDetails;
    }
    if (typeof data.countryCode === 'object') {
      data.countryName = data.countryCode.countryName;
    } else {
      data.countryName = data.countryCode;
    }
    if (typeof data.stateCode === 'object') {
      data.stateName = data.stateCode.stateName;
    } else {
      data.stateName = data.stateCode;
    }
    if (typeof data.districtCode === 'object') {
      data.districtName = data.districtCode.districtName;
    } else {
      data.districtName = data.districtCode;
    }
    if (typeof data.PlaceCode === 'object') {
      data.PlaceName = data.PlaceCode.PlaceName;
    } else {
      data.placeName = data.PlaceCode;
    }
    return data;
  }
  addLocationDetails() {
    try {
      if (this.locationForm.invalid) {
        this.locationForm.markAllAsTouched();
        return;
      }
      const locationData = this.processLocationData();
      console.log('add location', locationData);

      if (this.mode !== 'Update') {
        locationData.orgOfficeNo = 0;
      }

      this.locService.saveLocation(locationData)
        .subscribe(res => {
          this.getLocationDetails();
          this.getAllCountries();
          this.clearLocDetails();
          this.alertService.success('successfully added Location details.');
        },
          err => {
            // this.locationForm.patchValue(this.locationData);
            console.error('error on saving location', err);
            this.alertService.error('adding Location details failed.');
          });
    } catch (error) {
      console.error('error on addLocationDetails', error);
    }
  }

  UpdateLocationDetails() {
    try {
      if (this.locationForm.invalid) {
        this.locationForm.markAllAsTouched();
        return;
      }
      const locationData: any = this.processLocationData();
      this.locService.updateLocation(locationData)
        .subscribe(res => {
          this.alertService.success('successfully updated Location details.');
          this.getAllCountries();
          this.clearLocDetails();
          this.getLocationDetails();
        },
          err => {
            // this.locationForm.patchValue(this.locationData);
            console.error('error on saving location', err);
            this.alertService.error('updating Location details failed.');
          });
    } catch (error) {
      console.error('error on UpdateLocationDetails', error);
    }
  }
  getLocationDetails() {
    try {
      this.locService.getLocationDetails(this.orgId)
        .subscribe(res => {
          this.locationDetails = res;
        }, err => {
          console.error('error on getLocationDetails', err);
        });
    } catch (error) {
      console.error('error on getLocationDetails', error);
    }

  }

  savesCountryToList(country: string) {
    if (country && !this.countries.filter(c => c.countryName === country)[0]) {
      const counrtyObj = new Country();
      counrtyObj.countryName = country;
      this.supplierService.saveCounrtry(counrtyObj).subscribe((data: any) => {
        if (data) {
          this.locationForm.controls.countryCode.setValue(data.countryName);
          this.countries.push(data);
          this.countryOptionsList.push(data.countryName);
          this.countryOptionsList = this.countryOptionsList.slice();
          this.alertService.success('Country added successfully!');
        }
      }, err => {
        this.alertService.error('Error has occured while saving contract.');
      });
    }
  }

  getAllCountries() {
    this.countryOptionsList = [];
    this.stateOptionsList = [];
    this.locService.getAllCountries().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        res.forEach(c => {
          if (c) {
            c.countryName = c.countryName.toUpperCase();
            this.countryOptionsList.push(c.countryName);
          }
        });
        this.countries = R.sortBy(R.prop('countryName'), R.uniq(res));
      }
    }, err => {

      console.error('error while getting country details');
    });
  }
  editClick(loc: OrgLocation) {
    try {
      if (this.locationForm.dirty) {
        return;
      }
      this.mode = 'Update';
      this.locationForm.patchValue(loc);
      this.locationForm.patchValue({
        countryCode: loc.countryName, stateCode: loc.stateName, districtCode: loc.districtName,
        PlaceCode: loc.placeName
      });
    } catch (error) {
      console.error('error on editClick', error);
    }
  }

  deleteClick(loc: any) {
    try {
      // OrgOfficeNo
      this.locService.deleteLocation(loc.OrgOfficeNo)
        .subscribe(res => {
          console.log('response for delete', res);
          this.alertService.success('successfully deleted Location details.');
          this.getLocationDetails();
        }, err => {
          console.error('Error on deleteOrganisation:', err);
          this.alertService.error('Location details delete failed.');
        });
    } catch (error) {
      console.error('error on deleteClick', error);
    }
  }
  getStatesbyCountryId(countryid: any) {
    try {
      this.stateOptionsList = [];
      this.locService.getSates(countryid)
        .subscribe((res: any[]) => {
          res.forEach(c => {
            if (c) {
              this.stateOptionsList.push(c.stateName.toUpperCase());
              c.stateName = c.stateName.toUpperCase();
            }
          });
          this.states = R.sortBy(R.prop('stateName'), R.uniq(res));
        }, err => {
          console.error('error while getting states', err);

        });
    } catch (error) {
      console.error('error on getStatesbyCountryId', error);
    }
  }
  getPlaces(districtCode: any) {
    this.placeOptionsList = [];
    try {
      this.locService.getPlaces(districtCode)
        .subscribe((res: any[]) => {
          res.forEach(c => {
            if (c) {
              c.PlaceName = c.PlaceName.toUpperCase();
              this.placeOptionsList.push(c.PlaceName);
            }
          });
          this.places = R.sortBy(R.prop('PlaceName'), R.uniq(res));
        }, err => {
          console.error('error while getting places', err);
        });
    } catch (error) {
      console.error('error while getting Places', error);
    }
  }

  savePlaceToList(city: string) {
    if (city && !this.places.filter(c => c.PlaceName === city)[0]) {
      const cityObj = new Place();
      cityObj.PlaceName = city;
      const country = this.countries.filter(a => a.countryName === this.locationForm.controls.countryCode.value)[0];
      if (country && country.countryCode === '') {
        this.alertService.warning('Please select country, state and district to add place.');
      } else {
        const selectedState = this.states.filter(p => p.stateName === this.locationForm.controls.stateCode.value)[0];
        if (selectedState && selectedState.stateCode === '') {
          this.alertService.warning('Please select state and district to add place.');
        } else {
          const selectedDistrict = this.districts.filter(p => p.districtName === this.locationForm.controls.districtCode.value.trim())[0];
          if (selectedDistrict && selectedDistrict.districtCode === '') {
            this.alertService.warning('Please select district to add place.');
          } else {
            cityObj.CountryCode = country.countryCode;
            cityObj.StateCode = selectedState.stateCode;
            cityObj.DistrictCode = selectedDistrict.districtCode;
            this.supplierService.savePlace(cityObj).subscribe((data: Place) => {
              if (data) {
                this.locationForm.controls.PlaceCode.setValue(data.PlaceName);
                this.places.push(data);
                this.placeOptionsList.push(data.PlaceName);
                this.alertService.success('Place added successfully!');
                this.placeOptionsList = this.placeOptionsList.slice();
              }
            }, err => {
              this.alertService.error('Error has occured while saving city.');
            });
          }
        }

      }
    }
  }


  getdistricts(stateCode: any) {
    this.places = [];
    this.placeOptionsList = [];
    this.districtOptionsList = [];
    this.locService.getDistricts(stateCode)
      .subscribe((res: any[]) => {
        res.forEach(c => {
          if (c) {
            c.districtName = c.districtName.toUpperCase();
            this.districtOptionsList.push(c.districtName);
          }
        });
        this.districts = R.sortBy(R.prop('districtName'), R.uniq(res));
      }, err => {
        console.error('error on getdistricts', err);
      });
  }

  clearCascade(control: any, event?: any) {
    if (control === 'country') {
      this.states = this.districts = this.places = [];
      this.locationForm.patchValue({ stateCode: undefined, districtCode: undefined, PlaceCode: undefined });
    } else if (control === 'state') {
      this.districts = this.places = [];
      this.locationForm.patchValue({ districtCode: undefined, PlaceCode: undefined });
    } else if (control === 'district') {
      this.places = [];
      this.locationForm.patchValue({ PlaceCode: undefined });
    }
  }
  cascadeFocused(control: any, event: any) {
    // event.stopPropagation();
    // if (control === 'country') {
    //   this.country.open();
    // } else if (control === 'state') {
    //   this.state.open();
    // } else if (control === 'district') {
    //   this.district.open();
    // } else if (control === 'city') {
    //   this.city.open();
    // }
  }

}
