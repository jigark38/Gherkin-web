import { MessageService } from 'primeng/api';
import { filter, map } from 'rxjs/operators';
import { BankAccountDetails } from './bank-account-details.model';
import { ActionParams } from 'src/app/shared/components/ng-grid/grid.models';
import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BankAccountDetailsService } from './bank-account-details.service';
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
  selector: 'app-bank-account-details',
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    MessageService
  ],
})

export class BankAccountDetailsComponent implements OnInit {


  organizationlist: any;
  submitted = false;
  bankAccountDetailsForm: FormGroup;
  actionParams: ActionParams;
  bankAccountClosureForm: FormGroup;

  mode = 'Add';
  bankAccountDetails: any;
  submittedClosure: boolean;
  selectedRow: any;
  closureFormDetails: any;
  activeRecord: any;

  constructor(private bankAccountDetailService: BankAccountDetailsService, private messageService: MessageService,
    // tslint:disable-next-line:align
    private formBuilder: FormBuilder) { }
  bankAccountCols: any[];

  ngOnInit() {
    this.createForm();
    this.initData();
    this.getOrgainizationDetails();
    this.getBankAccountDetails();
  }



  createForm = () => {
    try {
      this.mode = 'Add';
      this.bankAccountDetailsForm = this.formBuilder.group({
        id: new FormControl(''),
        bankCode: new FormControl(''),
        organisationCode: new FormControl('', [Validators.required]),
        dateOfEntry: new FormControl('', [Validators.required]),
        bankAccountNumber: new FormControl('', [Validators.required, Validators.pattern('^0[0-9]*$')]),
        bankName: new FormControl('', [Validators.required]),
        bankBranch: new FormControl('', [Validators.required]),
        bankAddress: new FormControl('', [Validators.required]),
        bankIFSC: new FormControl('', [Validators.required, Validators.pattern('^[A-Z0-9]*$')]),
        bankSwiftCode: new FormControl('', [Validators.required]),
        bankOtherDetails: new FormControl(''),
        authorisationEmployee: new FormControl('', [Validators.required]),
        operationDate: new FormControl('', [Validators.required]),
        salaryLinkedAccount: new FormControl('', [Validators.required])
      });

      this.bankAccountClosureForm = this.formBuilder.group({
        id: new FormControl(''),
        bankCode: new FormControl(''),
        accountCloseStatus: new FormControl(''),
        accountClosingDate: new FormControl(''),
        accountCloseReason: new FormControl(''),
      });

    } catch (error) {
      console.log(error);
    }
  }

  initData = () => {
    this.bankAccountCols = [
      // take field name from table
      { field: 'id', header: 'Sl. No.' },
      { field: 'bankAccountNumber', header: 'Account Number' },
      { field: 'bankName', header: 'Name of Bank' },
      { field: 'bankBranch', header: 'Branch Name' },
      { field: 'bankIFSC', header: 'IFS Code' },
      { field: 'salaryLinkedAccount', header: 'Salary Link Account' },
      { field: 'accountCloseStatus', header: 'Status' }

    ];
    this.actionParams = { enabled: true, showRadiobutton: true };
  }

  getOrgainizationDetails = () => {
    try {
      this.bankAccountDetailService.getOrgainizationDetails()
        .subscribe((data: any) => {
          this.organizationlist = data.map(t => t);
        });
    } catch (ex) {
      console.log('Error on getOrganizationList:', ex);
    }
  }

  getBankAccountDetails = () => {
    try {
      this.bankAccountDetailService.getBankAccountDetails()
        .subscribe((res: any) => {
          this.bankAccountDetails = res;
        },
          error => {
            console.log('Error on getting bank account details', error);
          });
    } catch (ex) {
      console.log('Error on getBankAccountDetails:', ex);
    }
  }

  onSubmit = () => {
    this.submitted = true;
    if (this.bankAccountDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    if (this.mode === 'Add') {
      this.addBankAccount();
    } else {
      this.updateBankAccount();
    }

  }

  updateBankAccount = () => {
    try {
      const formData = this.bankAccountDetailsForm.value;
      this.bankAccountDetailService.updateBankAccountDetail(formData)
        .subscribe(res => {
          if (res) {
            this.getBankAccountDetails();
            this.showSuccess('Bank Account Updated Successfully');
            this.selectedRow = null;
            this.closureFormDetails = null;
            this.submittedClosure = false;
            this.createForm();
          }
        },
          error => {
            console.log('Error on updating bank account details', error);
            this.showError(error);
          });
    } catch (ex) {
      console.log('Error on updateBankAccount:', ex);
    }
  }

  addBankAccount = () => {
    try {
      const formData = this.bankAccountDetailsForm.value;
      formData.id = -1;
      this.bankAccountDetailService.addBankAccountDetail(formData)
        .subscribe(res => {
          if (res) {
            this.getBankAccountDetails();
            this.showSuccess('Bank Account Created Successfully');
            this.mode = 'Update';
            this.selectedRow = null;
            this.closureFormDetails = null;
            this.submittedClosure = false;
            this.createForm();
          }
        },
          error => {
            console.log('Error on add bank account details', error);
            this.showError(error);
          });
    } catch (ex) {
      console.log('Error on addBankAccount:', ex);
    }

  }

  clearForm = () => {
    this.bankAccountDetailsForm.reset();
    this.submitted = false;
    this.submittedClosure = false;
    this.mode = 'Add';
    this.selectedRow = null;
    this.closureFormDetails = null;
  }

  bankAccountSelectedRowEvent = (bankAccount) => {
    this.selectedRow = null;
    this.activeRecord = bankAccount.data.accountCloseStatus === 'Active' ? true : false;
    this.bankAccountDetailService.getBankAccountDetailsByBankCode(bankAccount.data.bankCode).subscribe(res => {
      this.selectedRow = res[0];
      this.closureFormDetails = res[1];
    });
  }

  bankAccountSuspension = () => {
    try {
      if (this.bankAccountDetailsForm.dirty) {
        return;
      }
      this.createForm();
      this.mode = 'Close';
      this.bankAccountDetailsForm.patchValue(this.selectedRow);
      Object.keys(this.bankAccountDetailsForm.controls).forEach(key => {
        this.bankAccountDetailsForm.get(key).disable({ onlySelf: true });
      });
      if (this.closureFormDetails) {
        this.bankAccountClosureForm.patchValue(this.closureFormDetails);
      }
      console.log('data from grid in suspension', this.selectedRow);

    } catch (error) {
      console.error('Error on bankAccountSuspension:', error);
    }
  }

  bankAccountCloseSubmit = () => {
    this.submittedClosure = true;
    if (this.bankAccountClosureForm.invalid) {
      return;
    }
    this.submittedClosure = false;
    if (this.mode === 'Close') {
      this.closeBankAccount();
    }
  }

  // bankAccountCloseClearForm = () => {
  //   this.bankAccountClosureForm.reset();
  //   this.submittedClosure = false;
  //   this.submitted = false;
  //   this.selectedRow = null;
  //   this.mode = 'Add';
  // }

  modifyBankAccountDetails = () => {
    try {
      if (this.bankAccountDetailsForm.dirty) {
        return;
      }
      this.createForm();
      this.mode = 'Update';
      this.bankAccountDetailsForm.patchValue(this.selectedRow);
      console.log('data from grid in edit', this.selectedRow);

    } catch (error) {
      console.error('Error on editClick:', error);
    }
  }

  closeBankAccount() {
    try {
      const formData = this.bankAccountClosureForm.value;
      formData.bankCode = this.selectedRow.bankCode;
      this.bankAccountDetailService.closeBankAccountDetail(formData)
        .subscribe(res => {
          if (res) {
            this.getBankAccountDetails();
            this.showSuccess('Bank Account Closed Successfully');
            this.selectedRow = null;
            this.closureFormDetails = null;
            this.submittedClosure = false;
            this.createForm();
          }
        },
          error => {
            console.log('Error on close bank account details', error);
            this.showError(error);
          });
    } catch (ex) {
      console.log('Error on closeBankAccount:', ex);
    }
  }


  addNewBankAccountDetails() {
    this.createForm();
    this.submitted = false;
    this.submittedClosure = false;
    this.selectedRow = null;
    this.closureFormDetails = null;
  }

  showSuccess(msg: any) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }
  showError(msg: any) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }



}
