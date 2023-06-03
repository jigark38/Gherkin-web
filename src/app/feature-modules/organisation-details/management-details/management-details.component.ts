import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActionParams } from 'src/app/shared/components/ng-grid/grid.models';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ManagementService } from './management-details.service';
import { MessageService } from 'primeng/api';
import { OrgManagemet } from './org-management.model';
import { OrganisationOfficesLocatonsDetailsComponent } from './../org-off-loc-details/org-ofc-loc-details.component';
import { RegexMaster } from 'src/app/shared/regex.master';
import { UtilService } from './../../../shared/services/util-service';

@Component({
  selector: 'app-management-details',
  templateUrl: './management-details.component.html',
  providers: [MessageService]
})
export class ManagementDetailsComponent implements OnInit {
  @Input() orgId: any;
  managementForm: FormGroup;
  orgManagemetModel: OrgManagemet = new OrgManagemet();
  managementDetails: OrgManagemet[] = [];
  managementCols: any[];
  mode: any = 'Add';
  actionParams: ActionParams;
  blockSpecial: any;
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private alertService: AlertService, private mgmtService: ManagementService, private utilService: UtilService) { }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: any) {
    if (changes && changes.orgId
      && (changes.orgId.firstChange ||
        (changes.orgId.currentValue !== changes.orgId.previousValue))) {
      this.getManagementDetails();
      if (this.managementForm) {
        this.managementForm.reset();
      }
      this.mode = 'Add';
    }
  }
  ngOnInit() {
    try {
      this.createForm();
      this.initData();
    } catch (ex) {
      console.log('Error on ngOnInit:', ex);
    }
  }
  createForm() {
    try {
      this.managementForm = this.formBuilder.group({
        ...this.orgManagemetModel
      });

      this.managementForm.get('managementName').setValidators([Validators.required]);
      this.managementForm.get('orgMngContactNo').setValidators([Validators.required, Validators.maxLength(10),
      Validators.minLength(10), Validators.pattern(RegexMaster.phone)]);
      this.managementForm.get('orgMngPanDetails').setValidators([Validators.pattern(RegexMaster.pan)]);
      this.managementForm.get('orgMngEmailId').setValidators([Validators.pattern(RegexMaster.email)]);
      this.managementForm.patchValue({ orgCode: this.orgId });
    } catch (error) {
      console.log('Error on createForm:', error);
    }
  }
  initData() {
    this.managementCols = [
      { field: 'managementName', header: 'Management Name' },
      { field: 'managementDesignation', header: 'Designation' },
      { field: 'orgMngContactNo', header: 'Primmary Contact Number' },
      { field: 'orgMngAltContactNo', header: 'Alternate Contant Number' },
      { field: 'orgMngEmailId', header: 'Email ID' },
      { field: 'orgMngResidenceDetails', header: 'Residential Address' },
      { field: 'orgMngPanDetails', header: 'PAN' },
      { field: 'orgMngDinDetails', header: 'DAN' }
    ];
    this.actionParams = { enabled: true, showEdit: true, showDelete: false };
    this.blockSpecial = RegexMaster.blockSpecial;

  }

  addorUpdateManagement() {
    if (this.mode === 'Add') {
      this.addManagement();
    } else {
      this.updateManagement();
    }
  }
  addManagement() {
    try {
      if (this.managementForm.invalid) {
        this.managementForm.markAllAsTouched();
        return;
      }
      const mgmtdata: OrgManagemet = this.managementForm.value;
      mgmtdata.orgCode = this.orgId;
      mgmtdata.orgMngCode = 0;
      this.mgmtService.saveManagement(mgmtdata)
        .subscribe(res => {
          this.alertService.success('Managegement details added successfully.');
          this.getManagementDetails();
          this.clearManagementControls();
        }, error => {
          this.alertService.error('Managegement details save failed.');
          console.error('org details save error', error);
        });
    } catch (ex) {
      console.log('Error on adding Organisation:', ex);
    }
  }
  updateManagement() {
    try {
      if (this.managementForm.invalid) {
        this.managementForm.markAllAsTouched();
        return;
      }
      const mgmtdata = this.managementForm.value;
      this.mgmtService.updateManagement(mgmtdata)
        .subscribe(res => {
          this.alertService.success('Managegement details updated successfully.');
          this.getManagementDetails();
          this.clearManagementControls();
        }, error => {
          this.alertService.error('Managegement details update failed.');
          console.error('org details save error', error);
        });
    } catch (ex) {
      console.log('Error on adding Organisation:', ex);
    }
  }
  getManagementDetails() {
    try {
      this.mgmtService.getManagementDetails(this.orgId)
        .subscribe(res => {
          this.managementDetails = res;
          // this.managementDetails = this.managementDetails.filter(a => a.orgCode === this.orgId);
        },
          error => {
            console.log('error on getting managementDetails', error);
          });
    } catch (ex) {
      console.log('Error on managementDetails:', ex);
    }
  }

  clearManagementControls() {
    try {
      this.mode = 'Add';
      this.managementForm.reset();
      this.managementForm.patchValue(new OrgManagemet());
    } catch (error) {
      console.log('Error on clearManagementControls:', error);
    }
  }
  editClick(mgmt: OrgManagemet) {
    try {
      if (this.managementForm.dirty) {
        return;
      }
      this.mode = 'Update';
      this.orgManagemetModel = mgmt;
      this.managementForm.patchValue(mgmt);
      console.log('data from grid in edit', mgmt);

    } catch (error) {
      console.log('Error on editClick:', error);
    }
  }
  deleteClick(mgmt: any) {
    try {

      console.log('data from grid in delete', mgmt);
      this.mgmtService.deleteManagement(mgmt.orgMngCode)
        .subscribe(res => {
          console.log('response for delete', res);
          this.alertService.success('Managegement details deleted successfully.');
          this.getManagementDetails();
        }, err => {
          this.alertService.error('Managegement details delete failed.');
          console.error('Error on deleteManagement:', err);
        });
    } catch (error) {

      console.log('Error on deleteClick:', error);
    }
  }
  phoneValidate(control: FormControl) {
    const phoneNumber: string = control.value;
    if (phoneNumber) {
      if (phoneNumber.length !== 10) {
        return { error: 'Phone number should be of 10 digits' };
      }
      const websiteRegex = new RegExp('^[789]\d{9}$');
      if (!websiteRegex.test(phoneNumber)) {
        return { error: 'Please enter valid Phone Number' };
      }
      return { error: 'Please enter valid Phone Number' };
    }

  }

}
