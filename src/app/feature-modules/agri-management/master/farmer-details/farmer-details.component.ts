import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FarmerBankDetails, FarmerDetails, FarmerDocuments, FileModel } from './farmer-details.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FarmerDetailsService } from './farmer-details.service';
import { ModalService } from '../../../../corecomponents/modal/modal.service';
import { concat, of } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';
import { AlertService } from '../../../../corecomponents/alert/alert.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatSelect } from '@angular/material';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { UserPermissionService } from '../../../secure/user-permission/user-permission.service';

import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-farmer-details',
  templateUrl: './farmer-details.component.html',
  styleUrls: ['./farmer-details.component.css'],
  providers: [],
})
export class FarmerDetailsComponent implements OnInit {


  constructor(
    private farmerDetailsService: FarmerDetailsService,
    private modalService: ModalService,
    private alertService: AlertService,
    private el: ElementRef,
    public authService: AuthenticationService,
    public userDetailService: UserPermissionService,
    private dialog: MatDialog) { }

  @ViewChild('FarmerNameDDL', { static: false }) farmerNameDDL: ElementRef;
  @ViewChild('FarmerNameTxt', { static: false }) farmerName: ElementRef;
  @ViewChild('BankName', { static: false }) bankName: ElementRef;
  @ViewChild('saveCommand', { static: false }) saveCommand: ElementRef;
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  @ViewChild('YesBtn', { static: false }) yesBtn: ElementRef;
  @ViewChild('YesBankBtn', { static: false }) yesBankBtn: ElementRef;
  @ViewChild('UploadDocBtn', { static: false }) uploadDocBtn: ElementRef;

  filteredOptions: Observable<any>;
  filteredOptionsAccount: Observable<any>;
  farmerForm: FormGroup;
  myControl = new FormControl({ value: null }, [Validators.required]);
  myAccountControl = new FormControl({ value: null });
  farmerDocuments: FormGroup;
  farmerBankDetails: FormGroup;
  currentDate: Date = new Date();
  farmerDetails: FarmerDetails = null;
  respfarmerdetl: any = null;
  files = [];
  respFile = new Array<FileModel>();
  countryList = null;
  stateList = null;
  districtList = null;
  mandalList = null;
  villageList = null;
  isAddFarmerClicked = false;
  isSubbmitted = false;
  isFindBtnClicked = false;
  isModifyBtnClicked = false;
  isAddBankBtnClicked = false;
  isPopulated = false;
  farmerDetailArray: any;
  farmerAccountDetailArray: any;
  disblAddFarmerBtn = false;
  disblFindBtn = false;
  disblModifyBtn = false;
  disblAddBankBtn = false;
  showFarmerTxt = true;
  isNoClicked = false;
  isNoBankClicked = false;
  employeeId: string;
  employeeName: string;
  selectedEmpDetail = null;
  farmerBankDetailsList = new Array<FarmerBankDetails>();
  selectedBankForEdit = new FarmerBankDetails();
  isFileError: boolean;
  documentList: FarmerDocuments[] = [];

  ngOnInit() {
    this.farmerForm = new FormGroup({
      dateOfEntry: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      farmerName: new FormControl(null, Validators.required),
      farmerAddress: new FormControl(null, Validators.required),
      countryCode: new FormControl(null, Validators.required),
      stateCode: new FormControl(null, Validators.required),
      districtCode: new FormControl(null, Validators.required),
      mandalCode: new FormControl(null, Validators.required),
      villageCode: new FormControl(null, Validators.required),
      pinCode: new FormControl(null, [Validators.minLength(0), Validators.pattern('^null|[0-9]*$')]),
      alternativeContactPerson: new FormControl(null, Validators.required),
      contactNumber: new FormControl(null, Validators.required),
      aadharCardNo: new FormControl(null, [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]),
      noOfAcres: new FormControl(null, Validators.required),
      bankName: new FormControl(null),
      bankBranch: new FormControl(null),
      bankAccountNo: new FormControl(null),
      bankIFSC: new FormControl(null),
      approvedBy: new FormControl(null),
    });

    this.farmerBankDetails = new FormGroup({
      farmerAccountHolderName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      farmerBankName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      farmerBankBranch: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      farmerBankAccountNo: new FormControl(null, [Validators.required, Validators.max(2147483647)]),
      farmerBankIFSC: new FormControl(null, [Validators.required, Validators.pattern('^[A-Za-z]{4}0[A-Z0-9a-z]{6}$')]),
      preferredBank: new FormControl(null, Validators.required),
    });

    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.farmerDocuments = new FormGroup({
      documentName: new FormControl(null, Validators.required),
      document: new FormControl(null),
    });
    this.resetForm();
  }

  resetForm() {
    this.scrollToTop();
    this.farmerForm.reset();
    this.myControl.reset();
    this.farmerDocuments.reset();
    this.farmerBankDetails.reset();
    this.farmerForm.disable();
    this.farmerDocuments.disable();
    this.myControl.disable();
    this.farmerBankDetails.disable();
    this.farmerAccountDetailArray = [];
    this.files = [];
    this.farmerBankDetailsList = [];
    this.respFile = new Array<FileModel>();
    this.documentList = new Array<FileModel>();
    this.isAddFarmerClicked = false;
    this.isSubbmitted = false;
    this.isFindBtnClicked = false;
    this.isModifyBtnClicked = false;
    this.isAddBankBtnClicked = false;
    this.isPopulated = false;
    this.isNoClicked = false;
    this.getCountry();
    this.farmerForm.disable();
    this.disblAddFarmerBtn = false;
    this.disblFindBtn = false;
    this.disblModifyBtn = false;
    this.disblAddBankBtn = false;
    this.showFarmerTxt = true;
  }

  onAddfarmerClick() {
    this.resetForm();
    this.isAddFarmerClicked = true;
    this.farmerForm.enable();
    this.farmerBankDetails.enable();
    this.farmerDocuments.enable();
    this.farmerForm.controls.dateOfEntry.setValue(this.currentDate);
    this.farmerForm.controls.userName.setValue(this.employeeName);
    this.farmerForm.get(['dateOfEntry']).disable();
    this.farmerForm.get(['userName']).disable();
    this.disblAddFarmerBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
    this.disblAddFarmerBtn = true;
    this.disblAddBankBtn = true;
    const control = this.el.nativeElement.querySelector('[formControlName="farmerName"]');
    control.focus();
  }

  onSubmit() {
    if (!(this.farmerBankDetailsList.some(a => a.preferredBank === 'YES'))) {
      this.alertService.error('Mark any one bank as preffered!');
      return;
    }
    if ((this.farmerBankDetailsList.filter(a => a.preferredBank === 'YES')).length > 1) {
      this.alertService.error('Only one bank can be preffered at a time!');
      return;
    }
    this.isSubbmitted = true;
    if (this.farmerForm.valid) {
      if (this.isModifyBtnClicked) {
        let farmerDetal = new FarmerDetails();
        farmerDetal = this.farmerForm.value;
        farmerDetal.dateOfEntry = this.farmerForm.get('dateOfEntry').value;
        farmerDetal.userName = this.respfarmerdetl.userName;
        farmerDetal.farmerBankDetails = this.farmerBankDetailsList;
        farmerDetal.id = this.farmerDetails.id;
        farmerDetal.farmerCode = this.farmerDetails.farmerCode;
        this.modalService.close('AddMoreDoc');
        this.updateFarmerDetail(farmerDetal);
        this.isModifyBtnClicked = false;
      }
      if (this.isAddFarmerClicked && this.isNoBankClicked) {
        let farmerDetails = new FarmerDetails();
        farmerDetails = this.farmerForm.value;
        farmerDetails.farmerBankDetails = this.farmerBankDetailsList;
        farmerDetails.dateOfEntry = this.farmerForm.get('dateOfEntry').value;
        farmerDetails.userName = this.employeeId;
        farmerDetails.id = 0;
        farmerDetails.farmerCode = null;
        this.farmerDetailsService.saveFarmerDetail(farmerDetails).subscribe(res => {
          this.respfarmerdetl = res;
          if (this.respfarmerdetl.farmerCode != null) {
            this.uploadFarmerDocument(this.respfarmerdetl.farmerCode, this.respfarmerdetl.farmerName);
          }
          this.modalService.close('AddMoreDoc');
          this.alertService.success('Farmer Details saved successfuly!');
          this.resetForm();
        },
          error => {
            this.alertService.error('Error while adding farmer details!');
          });
      }
    }
    if (this.isAddBankBtnClicked) {
      let newBankDetails = new Array<FarmerBankDetails>();
      newBankDetails = this.farmerBankDetailsList;
      newBankDetails.forEach(item => item.farmerCode = this.farmerDetails.farmerCode);
      console.log(newBankDetails);
      this.farmerDetailsService.addFarmerBankAccount(newBankDetails).subscribe(res => {
        this.resetForm();
      },
        error => {
          this.alertService.error('Error while adding farmer details!');
        });
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
        const docGivenName = this.farmerDocuments.controls.documentName.value;
        const name = docGivenName ? docGivenName + '.' + file.name.split('.')[1] : file.name;
        if (!docGivenName) {
          this.farmerDocuments.controls.documentName.setValue(name);
        }
        const farmerDocument: FarmerDocuments = {
          // employeeDocName: name,
          // employeeDocDetails: file,
          // employeeId: null,
          id: null,
          farmerCode: null,
          documentName: name,
          document: file
        };
        this.documentList.push(farmerDocument);


        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '350px',
          data: 'Do You Want to add more documents?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.farmerDocuments.get('documentName').setValue('');
            // this.uploadDocBtn.nativeElement.focus();
          } else {
            this.isNoClicked = true;
            this.saveCommand.nativeElement.focus();
          }

        });
      }
    } catch (error) {

    }
  }

  onFileAddClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inprogress: false, progress: 0 });
        this.farmerDocuments.get('documentName').setValue(file.name);
        if (this.farmerDocuments.valid) {
          this.onBlurMethod();
        }
      }
    };
    fileUpload.click();
  }

  onFileUpldClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inprogress: false, progress: 0 });
      }
    };
    fileUpload.click();
  }

  addNewBank() {
    this.modalService.close('AddMoreBank');
    this.bankName.nativeElement.focus();
  }

  onNoBankClick() {
    this.modalService.close('AddMoreBank');
    this.isNoBankClicked = true;
    if (this.isAddBankBtnClicked === true) {
      this.saveCommand.nativeElement.focus();
    } else {
      // this.uploadDocBtn.nativeElement.focus();
    }
  }

  addNewDoc() {
    this.modalService.close('AddMoreDoc');
    this.farmerDocuments.get('documentName').setValue('');
    // this.uploadDocBtn.nativeElement.focus();
  }

  onNoClick() {
    this.isNoClicked = true;
    this.modalService.close('AddMoreDoc');
    this.saveCommand.nativeElement.focus();
  }

  uploadFarmerDocument(farmerId: string, farmerName: string) {
    try {
      // return new Observable((obs) => {

      if (this.documentList && this.documentList.length > 0) {
        const fileUploadObs: Observable<any>[] = [];
        this.documentList.forEach(farmerDocument => {
          if (!farmerDocument.id) {
            farmerDocument.farmerCode = farmerId;
            fileUploadObs.push(this.farmerDetailsService.saveFarmerImage(farmerDocument));
          }
        });
        //       // this.disableButton = true;
        //       if (fileUploadObs && fileUploadObs.length > 0) {
        //         concat(...fileUploadObs).subscribe(res => {
        //           //this.disableButton = false;
        //           obs.next();
        //           obs.complete();
        //         }, err => {
        //           obs.error();
        //         });
        //       } else {
        //         obs.next();
        //         obs.complete();
        //       }
        //     } else {
        //       obs.next();
        //       obs.complete();
        //     }
        //   });
      }
    } catch (error) {

    }
  }


  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }



  uploadFile(file) {
    const formData = new FormData();
    formData.append(file.data.name, file.data);
    const farmerCode: string = this.respfarmerdetl.farmerCode;
    file.inProgress = true;
    this.farmerDetailsService.saveFarmerDocs(formData, farmerCode, file.data.name).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }
  getCountry() {
    this.farmerDetailsService.getCountryList().subscribe(res => {
      this.countryList = res;
    });
  }

  getState(contryCode) {
    if (contryCode !== null) {
      this.farmerDetailsService.getStateList(contryCode).subscribe(res => {
        this.stateList = res;
      });
    }
  }

  getDisrtict(stateCode) {
    if (stateCode !== null) {
      this.farmerDetailsService.getDistrictList(stateCode).subscribe(district => {
        this.districtList = district;
      });
    }
  }

  getMandal(districtCode) {
    if (districtCode != null) {
      this.farmerDetailsService.getMandalByDistrict(districtCode).subscribe(mandal => {
        this.mandalList = mandal;
      });
    }
  }

  getVillage(mandalCode) {
    if (mandalCode != null) {
      this.farmerDetailsService.getVillageListByMandal(mandalCode).subscribe(village => {
        this.villageList = village;
      });
    }
  }
  onFindBtnClick() {
    this.resetForm();
    this.showFarmerTxt = false;
    this.isFindBtnClicked = true;
    this.myControl.enable();
    this.farmerNameDDL.nativeElement.focus();
    this.getAllFarmers();
    this.disblAddFarmerBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
    this.disblAddBankBtn = true;
  }

  getAllFarmers() {
    this.farmerDetailsService.getAllFarmers().subscribe(res => {
      this.farmerDetailArray = res;
      this.farmerAccountDetailArray = res;
      this.filteredOptionsAccount = this.myAccountControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.alternativeContactPerson),
          map(name => name ? this._filterAccount(name) : this.farmerAccountDetailArray.slice())
        );
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.farmerName),
          map(name => name ? this._filter(name) : this.farmerDetailArray.slice())
        );

    },
      error => {
        this.alertService.error('Error while getting farmer details!');
      });
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();

    return this.farmerDetailArray.filter(option => option.farmerName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterAccount(name: string): any {
    const filterValue = name.toLowerCase();
    return this.farmerAccountDetailArray.filter(option => option.alternativeContactPerson.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(searchItem): string {
    if (searchItem != null) {
      const data = this.farmerDetailArray.find(_ => _.farmerCode === searchItem);
      return data ? this.farmerDetailArray.find(_ => _.farmerCode === searchItem).farmerName : '';
    }
  }

  displayAccountFn(searchItem): string {
    if (searchItem != null) {
      const data = this.farmerAccountDetailArray.find(_ => _.farmerCode === searchItem);
      return data ? this.farmerAccountDetailArray.find(_ => _.farmerCode === searchItem).alternativeContactPerson : '';
    }
  }

  getfarmerById(farmerId) {
    if (farmerId != null) {
      this.showFarmerTxt = true;
      this.farmerDetails = new FarmerDetails();
      this.respfarmerdetl = null;
      this.farmerDetailsService.getFarmerDetailById(farmerId).subscribe(res => {
        try {
          this.userDetailService.getUserDetails(res.userName).subscribe((detail: any) => {
            this.selectedEmpDetail = detail;
            this.respfarmerdetl = res;
            this.farmerDetails = res;
            this.farmerBankDetailsList = res.farmerBankDetails;
            this.mapFormWithValues(res);
            this.getFarmerDocByCode(res.farmerCode);
            this.isPopulated = true;
            if (this.isAddBankBtnClicked === true) {
              this.farmerForm.disable();
              this.farmerBankDetails.enable();
              this.bankName.nativeElement.focus();
            }
          });
        } catch (error) {
          console.log(error.message);
        }
      },
        error => {
          this.alertService.error('Error while getting farmer details!');
        });
    }
  }

  mapFormWithValues(farmerDetail) {
    this.farmerForm.get('dateOfEntry').setValue(farmerDetail.dateOfEntry);
    this.farmerForm.get('userName').setValue(this.selectedEmpDetail.userName);
    this.farmerForm.get('farmerName').setValue(farmerDetail.farmerName);
    this.farmerForm.get('farmerAddress').setValue(farmerDetail.farmerAddress);
    this.farmerForm.get('countryCode').setValue(farmerDetail.countryCode);
    this.farmerForm.get('stateCode').setValue(farmerDetail.stateCode);
    this.farmerForm.get('districtCode').setValue(farmerDetail.districtCode);
    this.farmerForm.get('mandalCode').setValue(farmerDetail.mandalCode);
    this.farmerForm.get('villageCode').setValue(farmerDetail.villageCode);
    this.farmerForm.get('pinCode').setValue(farmerDetail.pinCode);
    this.farmerForm.get('alternativeContactPerson').setValue(farmerDetail.alternativeContactPerson);
    this.farmerForm.get('contactNumber').setValue(farmerDetail.contactNumber);
    this.farmerForm.get('aadharCardNo').setValue(farmerDetail.aadharCardNo);
    this.farmerForm.get('noOfAcres').setValue(farmerDetail.noOfAcres);
    this.farmerForm.get('approvedBy').setValue(farmerDetail.approvedBy);
  }

  getFarmerDocByCode(farmercod) {
    this.farmerDetailsService.getFarmerDocByFarmerCod(farmercod).subscribe(res => {
      this.documentList = new Array<FileModel>();
      this.documentList = res;
    },
      error => {
        this.alertService.error('Error while getting farmer docs!');
      });
  }
  onDownloadClick(file) {
    let contentType = '';
    const splitted = file.documentName.split('.', 2);
    const fileType = splitted[1];
    switch (fileType) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'xlsx':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'txt':
        contentType = 'application/text/plain';
        break;
      case 'xml':
        contentType = 'application/text/xml';
        break;
      case 'docx':
        contentType = 'application/msword';
        break;
      default:
        contentType = '';
        break;
    }
    this.downloadBase64File(contentType, file.farmerDocument, file.documentName);
  }

  downloadBase64File(contentType, base64Data, fileName) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  onModifyBtnClick() {
    this.resetForm();
    this.myControl.reset();
    this.showFarmerTxt = false;
    this.isModifyBtnClicked = true;
    this.myControl.enable();
    this.farmerForm.enable();
    this.farmerDocuments.enable();
    this.farmerForm.get(['dateOfEntry']).disable();
    this.farmerForm.get(['userName']).disable();
    this.farmerNameDDL.nativeElement.focus();
    this.getAllFarmers();
    this.disblAddFarmerBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
    this.disblAddBankBtn = true;
  }

  onAddBankAccountClick() {
    this.resetForm();
    this.myControl.reset();
    this.showFarmerTxt = false;
    this.isAddBankBtnClicked = true;
    this.myControl.enable();
    this.myAccountControl.enable();
    this.farmerForm.enable();
    this.farmerDocuments.enable();
    this.farmerForm.get(['dateOfEntry']).disable();
    this.farmerForm.get(['userName']).disable();
    this.farmerNameDDL.nativeElement.focus();
    this.getAllFarmers();
    this.disblAddFarmerBtn = true;
    this.disblFindBtn = true;
    this.disblModifyBtn = true;
  }

  updateFarmerDetail(farmerDetail) {
    this.farmerDetailsService.updateFarmer(farmerDetail).subscribe(res => {
      this.uploadFiles();
      this.alertService.success('Farmer details updated successfully!');
      this.resetForm();
    },
      error => {
        this.alertService.error('Error while updating!');
      });
  }

  deleteDocument(docId, farmerCode) {
    this.farmerDetailsService.deleteFarmerDocumentsByID(docId).subscribe(res => {
      this.scrollToTop();
      this.alertService.success('Document deleted');
      this.getFarmerDocByCode(farmerCode);
    },
      error => {
        this.alertService.error('Error while deleting document!');
      });
  }

  scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  onBlurMethod() {
    if (this.farmerForm.valid && this.farmerDocuments.valid) {
      if (this.isAddFarmerClicked) {
        this.modalService.open('AddMoreDoc');
        this.yesBtn.nativeElement.focus();
      }
    }
  }

  onPrefferedBlur() {
    if (this.farmerBankDetails.valid && (this.isModifyBtnClicked === false)) {
      if (this.farmerBankDetails.get('preferredBank').value === 'YES' && this.isModifyBtnClicked === false) {
        this.updatePreffered();
      }
      this.farmerBankDetailsList.push(this.farmerBankDetails.value);
      this.modalService.open('AddMoreBank');
      this.farmerBankDetails.reset();
      this.yesBankBtn.nativeElement.focus();
    }
  }

  disableSave() {
    if (((this.farmerForm.valid) && (this.isModifyBtnClicked || this.isNoBankClicked || this.isAddBankBtnClicked))) {
      return false;
    } else {
      return true;
    }
  }
  populateBank(bank) {
    if (this.isAddBankBtnClicked === false) {
      this.selectedBankForEdit = new FarmerBankDetails();
      this.selectedBankForEdit = bank;
      this.farmerBankDetails.enable();
      this.farmerBankDetails.get('farmerAccountHolderName').setValue(bank.farmerAccountHolderName);
      this.farmerBankDetails.get('farmerBankName').setValue(bank.farmerBankName);
      this.farmerBankDetails.get('farmerBankAccountNo').setValue(bank.farmerBankAccountNo);
      this.farmerBankDetails.get('farmerBankIFSC').setValue(bank.farmerBankIFSC);
      this.farmerBankDetails.get('preferredBank').setValue(bank.preferredBank);
      this.farmerBankDetails.get('farmerBankBranch').setValue(bank.farmerBankBranch);
    }

  }

  onbankDetailChange(val) {
    if (this.isModifyBtnClicked) {
      switch (val) {
        case 1:
          this.farmerBankDetailsList.forEach(element => {
            if (element.farmerBankCode === this.selectedBankForEdit.farmerBankCode) {
              element.farmerAccountHolderName = this.farmerBankDetails.get('farmerAccountHolderName').value;
            }
          });
          break;
        case 2:
          this.farmerBankDetailsList.forEach(element => {
            if (element.farmerBankCode === this.selectedBankForEdit.farmerBankCode) {
              element.farmerBankName = this.farmerBankDetails.get('farmerBankName').value;
            }
          });
          break;
        case 3:
          this.farmerBankDetailsList.forEach(element => {
            if (element.farmerBankCode === this.selectedBankForEdit.farmerBankCode) {
              element.farmerBankBranch = this.farmerBankDetails.get('farmerBankBranch').value;
            }
          });
          break;
        case 4:
          this.farmerBankDetailsList.forEach(element => {
            if (element.farmerBankCode === this.selectedBankForEdit.farmerBankCode) {
              element.farmerBankAccountNo = this.farmerBankDetails.get('farmerBankAccountNo').value;
            }
          });
          break;
        case 5:
          this.farmerBankDetailsList.forEach(element => {
            if (element.farmerBankCode === this.selectedBankForEdit.farmerBankCode) {
              element.farmerBankIFSC = this.farmerBankDetails.get('farmerBankIFSC').value;
            }
          });
          break;
        case 6:
          this.farmerBankDetailsList.forEach(element => {
            if (element.farmerBankCode === this.selectedBankForEdit.farmerBankCode) {
              element.preferredBank = this.farmerBankDetails.get('preferredBank').value;
            }
          });
          break;
      }
    }
  }
  findIndexToUpdate(newItem) {
    return newItem.farmerBankCode === this;
  }

  updatePreffered() {
    if (this.farmerBankDetailsList.some(a => a.preferredBank === 'YES')) {
      this.farmerBankDetailsList = this.farmerBankDetailsList.map(f => {
        f.preferredBank = 'NO';
        return f;
      });
    }
  }

}
