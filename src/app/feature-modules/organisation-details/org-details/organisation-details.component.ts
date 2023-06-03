import { ActionParams, ngColumnType } from 'src/app/shared/components/ng-grid/grid.models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { OrganisationModel } from './orgnisation-model';
import { OrganisationService } from './organisation-service';
import { RegexMaster } from 'src/app/shared/regex.master';
import { error } from 'util';

@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  providers: [MessageService]
})
// export class OrganisationDetailsComponent implements OnInit, CanComponentDeactivate {
export class OrganisationDetailsComponent extends BaseComponent implements OnInit {
  // public Editor = ClassicEditor;
  selectdTab = 0;
  orgnisationForm: FormGroup;
  organisationModel: OrganisationModel = new OrganisationModel();
  organisationDetails: OrganisationModel[] = [];
  orgCols: any[];
  selectedRow: OrganisationModel;
  selectedOrgCode: any;
  actionParams: ActionParams;
  mode: any = 'Add';
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private orgService: OrganisationService) {
    super();
  }



  // tslint:disable-next-line: use-lifecycle-interface

  ngOnInit() {
    try {
      this.createForm();
      this.initData();
      this.getOrganisationDetails();
    } catch (ex) {
      console.log('Error on ngOnInit:', ex);
    }


    // throw new error('organisation failed');
  }
  initData() {
    this.orgCols = [
      { field: 'organisationName', header: 'Name of the Company', type: ngColumnType.link },
      { field: 'orgStatus', header: 'Legal Status', width: '100px' },
      { field: 'regCertificateDetails', header: 'ROC/Registration No' },
      { field: 'certificatationNo', header: 'Certificates No' },
      { field: 'otherCertificateNo', header: 'Other Certificates Details' },
      { field: 'orgMngEmailId', header: 'Org Mail Id' },
      { field: 'websiteDetails', header: 'Website' }
    ];
    this.actionParams = { enabled: true, showEdit: true, showDelete: false };

  }
  createForm() {
    try {

      this.orgnisationForm = new FormGroup({
        orgCode: new FormControl(''),
        organisationName: new FormControl('', [Validators.required]),
        orgStatus: new FormControl('', [Validators.required]),
        regCertificateDetails: new FormControl('', [Validators.required]),
        certificatationNo: new FormControl(''),
        otherCertificateNo: new FormControl(''),
        websiteDetails: new FormControl('', [this.siteValidate.bind(this)]),
        orgMngEmailId: new FormControl('', [Validators.required, Validators.pattern(RegexMaster.email)])
      });

    } catch (error) {
      console.error('Error on createForm:', error);

    }

  }
  addorUpdateOrganisation() {
    if (this.mode === 'Add') {
      this.addOrganisation();
    } else {
      this.updateOrganisation();
    }
  }
  addOrganisation() {
    try {
      if (this.orgnisationForm.invalid) {
        this.orgnisationForm.markAllAsTouched();
        return;
      }
      const formData: OrganisationModel = this.orgnisationForm.value;
      console.log('Org Form Details:', this.orgnisationForm.value);
      formData.orgCode = 0;
      this.orgService.saveOrganisation(formData)
        .pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          this.alertService.success('Added Organisation Details successfully');
          this.orgnisationForm.reset();
          this.getOrganisationDetails();
        }, err => {
          this.alertService.error('Organisation Details add failed');
          console.error('org details save error', err);
        });
    } catch (ex) {
      console.log('Error on adding Organisation:', ex);
    }
  }
  updateOrganisation() {
    try {
      if (this.orgnisationForm.invalid) {
        this.orgnisationForm.markAllAsTouched();
        return;
      }
      const formData = this.orgnisationForm.value;
      console.log('Org Form Details:', this.orgnisationForm.value);
      this.orgService.updateOrganisation(formData)
        .pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          this.alertService.success('Updated Organisation details  successfully');
          this.mode = 'Add';
          this.orgnisationForm.reset();
          this.getOrganisationDetails();
        }, err => {
          this.alertService.error('Organisation Details add failed');
          console.error('org updateOrganisation error', err);
        });
    } catch (ex) {
      console.log('Error on adding Organisation:', ex);
    }
  }
  getOrganisationDetails() {
    try {
      this.orgService.getOrganisationDetails()
        .pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          this.organisationDetails = res;
        },
          err => {
            console.log('erro on getting org details', error);
          });
    } catch (ex) {
      console.log('Error on getOrganisationDetails:', ex);
    }
  }
  setTab(index: number) {
    this.selectdTab = index;
  }

  clearOrgDetails() {
    try {
      this.createForm();
      this.mode = 'Add';
    } catch (error) {
      console.error('Error on clearOrgDetails:', error);
    }
  }


  editClick(mgmt: any) {
    try {
      if (this.orgnisationForm.dirty) {
        return;
      }
      this.mode = 'Update';
      this.createForm();
      this.orgnisationForm.patchValue(mgmt);
      console.log('data from grid in edit', mgmt);

    } catch (error) {
      console.error('Error on editClick:', error);
    }
  }
  deleteClick(mgmt: any) {
    try {

      console.log('data from grid in delete', mgmt);
      this.orgService.deleteOrganisation(mgmt.orgCode)
        .pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          console.log('response for delete', res);
          this.alertService.success('Deleted Organisation Details  successfully');
          this.getOrganisationDetails();
        }, err => {
          this.alertService.error('Organisation Details delete failed');
          console.error('Error on deleteOrganisation:', err);
        });
    } catch (error) {
      console.error('Error on deleteClick:', error);
    }
  }
  siteValidate(control: FormControl) {
    try {
      const siteName: string = control.value;
      if (siteName) {

        if (!(siteName.toLowerCase().endsWith('.com') ||
          siteName.toLowerCase().endsWith('.net') ||
          siteName.toLowerCase().endsWith('.in') ||
          siteName.toLowerCase().endsWith('.co.in'))) {
          return { error: 'This field should end with .com/.net/.co.in' };
        }
        const websiteRegex = new RegExp(RegexMaster.website);
        if (!websiteRegex.test(siteName)) {

          return { error: 'Please enter valid Website name' };
        }
        return null;
      }
    } catch (error) {
      console.error('Error on siteValidate:', error);
    }
  }
  linkHandler(event: any) {
    this.selectedRow = event.data;
    this.selectedOrgCode = this.selectedRow.orgCode;
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.orgnisationForm.dirty) {
      return false;
    }
    return true;
  }
}


