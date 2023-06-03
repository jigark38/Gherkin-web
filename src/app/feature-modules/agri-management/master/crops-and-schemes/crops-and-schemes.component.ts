import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CropesAndSchemesService } from './cropes-and-schemes.service';
import { CropGroup, CropsModel, Crops, Schemes } from './crops-and-schemes.model';
import { MatSelect } from '@angular/material';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ModalService } from '../../../../corecomponents/modal/modal.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';


export interface User {
  name: string;
  age: number;
}

@Component({
  selector: 'app-crops-and-schemes',
  templateUrl: './crops-and-schemes.component.html',
  styleUrls: ['./crops-and-schemes.component.css'],
  providers: [],
})

export class CropsAndSchemesComponent implements OnInit {

  myControl = new FormControl({ value: null });
  CropName = new FormControl({ value: null });
  filteredOptions: Observable<CropGroup[]>;
  filteredCrop: Observable<Crops[]>;
  employeeId: string;
  employeeName: string;

  constructor(
    private authService: AuthenticationService,
    private cropesAndSchemesService: CropesAndSchemesService,
    protected alertService: AlertService,
    private modalService: ModalService) { }

  @ViewChild('CropGroupNameDDL', { static: false }) CropGroupNameDDL: MatSelect;
  @ViewChild('SaveCommand', { static: false }) saveCommand: ElementRef;
  @ViewChild('cropGrpNameAC', { static: false }) cropGrpNameAC: ElementRef;
  @ViewChild('CropScheme', { static: false }) cropSchemeEle: ElementRef;
  @ViewChild('yesBtn', { static: false }) yesBtnEle: ElementRef;
  @ViewChild('signDDL', { static: false }) signDDLBtnEle: MatSelect;

  cropsNSchemesForm: FormGroup;
  addCropGrpBtnClicked = false;
  addCropBtnClicked = false;
  isSubmittClicked = false;
  currentDate = new Date();
  groupList = new Array<CropGroup>();
  cropDetails = new CropsModel();
  cropList = new Array<Crops>();
  schemesList = new Array<Schemes>();
  cropSchemeSigns = ['+', '-'];
  hideGroupNameDLL = true;
  hideCropNameDLL = false;
  cropNameAlreadyExist = false;
  cropGroupAlreadyExist = false;
  findButtonClicked = false;
  modifyBtnClicked = false;
  selectedCropGrop = null;
  selectedScheme = null;
  disableGrpBtn = false;
  disableCropBtn = false;
  disableModifyBtn = false;
  disableFindBtn = false;
  NoClicked = false;
  selectRowClicked = false;

  ngOnInit() {
    this.cropsNSchemesForm = new FormGroup({
      EntryDate: new FormControl({ value: null }, [Validators.required]),
      UserName: new FormControl({ value: null }, [Validators.required]),
      GroupCode: new FormControl({ value: null }, [Validators.required]),
      CropCode: new FormControl({ value: null }),
      From: new FormControl({ value: null }, [Validators.required]),
      Count: new FormControl({ value: null }, [Validators.required]),
      Sign: new FormControl({ value: null }, [Validators.required]),
    });

    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.cropsNSchemesForm.reset();
    this.cropsNSchemesForm.disable();
    this.myControl.disable();
    this.CropName.disable();
    this.getCropGroup();
  }



  displayCrpGrpFn(cropGroup: CropGroup): string {
    return cropGroup && cropGroup.Name ? cropGroup.Name : '';
  }

  onBlurMethod() {
    if (this.addCropBtnClicked) {
      if (!this.cropsNSchemesForm.valid) {
        console.log('not valid');
        return;
      }
      const crop = this.cropList.filter(
        cropdetail => cropdetail.Name.toUpperCase() === this.CropName.value.toUpperCase()
      );
      if (crop.length === 0) {
        this.cropDetails = new CropsModel();
        const grpSelecte: any = this.groupList.filter(
          grp => grp.CropGroupCode === this.cropsNSchemesForm.get('GroupCode').value
        );
        console.log(this.signDDLBtnEle);
        this.cropDetails.EntryDate = this.cropsNSchemesForm.get('EntryDate').value;
        this.cropDetails.UserName = this.cropsNSchemesForm.get('UserName').value;
        this.cropDetails.GroupCode = grpSelecte[0].CropGroupCode;
        this.cropDetails.CropCode = '';
        this.cropDetails.CropName = this.CropName.value.toUpperCase();
        this.cropDetails.Schemes = new Array<Schemes>();

        const scheme = new Schemes();
        scheme.CropCode = '';
        scheme.CropSchemeId = 0;
        scheme.Code = '';
        scheme.From = this.cropsNSchemesForm.get('From').value;
        scheme.Count = this.cropsNSchemesForm.get('Count').value;
        scheme.Sign = this.cropsNSchemesForm.get('Sign').value;

        this.schemesList.push(scheme);
        this.cropDetails.Schemes = this.schemesList;

        this.modalService.open('save-scheme-Modal');
        this.yesBtnEle.nativeElement.focus();
      } else {
        this.alertService.error('This crop already exists under this group');
        this.cropNameAlreadyExist = true;
      }
    }
  }

  displayGrpFn(crop: Crops): string {
    return crop && crop.Name ? crop.Name : '';
  }

  private _filter(name: string): CropGroup[] {
    const filterValue = name.toLowerCase();

    return this.groupList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCrop(name: string): Crops[] {
    const filterValue = name.toLowerCase();
    return this.cropList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }

  resetForm() {
    this.cropsNSchemesForm.reset();
    this.myControl.reset();
    this.CropName.reset();
    this.cropsNSchemesForm.disable();
    this.myControl.disable();
    this.CropName.disable();
    this.addCropGrpBtnClicked = false;
    this.addCropBtnClicked = false;
    this.isSubmittClicked = false;
    this.cropNameAlreadyExist = false;
    this.cropGroupAlreadyExist = false;
    this.cropDetails = new CropsModel();
    this.schemesList = new Array<Schemes>();
    this.findButtonClicked = false;
    this.modifyBtnClicked = false;
    this.selectedCropGrop = null;
    this.selectedScheme = null;
    this.disableGrpBtn = false;
    this.disableCropBtn = false;
    this.disableModifyBtn = false;
    this.disableFindBtn = false;
    this.NoClicked = false;
    this.selectRowClicked = false;
    this.getCropGroup();
  }

  addCropGroup() {
    try {
      this.getCropGroup();
      this.resetForm();
      this.disableGrpBtn = true;
      this.disableCropBtn = true;
      this.disableModifyBtn = true;
      this.disableFindBtn = true;
      this.hideGroupNameDLL = true;
      this.hideCropNameDLL = false;
      this.addCropGrpBtnClicked = true;
      this.cropsNSchemesForm.get('EntryDate').setValue(this.currentDate);
      this.cropsNSchemesForm.get('UserName').setValue(this.employeeName);
      this.myControl.enable();
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.Name),
          map(name => name ? this._filter(name) : this.groupList.slice())
        );
      this.cropGrpNameAC.nativeElement.focus();
    } catch (error) {

    }
  }

  getCropGroup() {
    this.cropesAndSchemesService.getCropGroupList().subscribe(res => {
      this.groupList = new Array<CropGroup>();
      this.groupList = res;
    });
  }

  getCrops(data) {
    try {
      if (data) {
        this.cropsNSchemesForm.get('From').setValue('');
        this.cropsNSchemesForm.get('Count').setValue('');
        this.cropDetails = new CropsModel();
        this.cropesAndSchemesService.getCrops().subscribe(res => {
          this.cropList = new Array<Crops>();
          this.cropList = res;
          this.filteredCrop = this.CropName.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.Name),
              map(name => name ? this._filterCrop(name) : this.cropList.slice())
            );
          this.cropList = this.cropList.filter(
            crop => crop.CropGroupCode === data
          );
        });
      }
    } catch (error) {

    }
  }

  addCrop() {
    this.resetForm();
    this.getCropGroup();
    this.disableGrpBtn = true;
    this.disableCropBtn = true;
    this.disableModifyBtn = true;
    this.disableFindBtn = true;
    this.hideGroupNameDLL = false;
    this.addCropBtnClicked = true;
    this.hideCropNameDLL = false;
    this.cropsNSchemesForm.enable();
    this.CropName.enable();
    this.cropsNSchemesForm.get('EntryDate').disable();
    this.cropsNSchemesForm.get('UserName').disable();
    this.cropsNSchemesForm.get('EntryDate').setValue(this.currentDate);
    this.cropsNSchemesForm.get('UserName').setValue(this.employeeName);
    this.CropGroupNameDDL.focus();
  }

  onSubmit() {
    this.isSubmittClicked = true;
    if (this.addCropGrpBtnClicked) {

      const item = this.groupList.filter(
        group => group.Name.toUpperCase() === this.myControl.value.toUpperCase()
      );
      if (item.length === 0) {
        this.addCropGrpBtnClicked = false;
        this.isSubmittClicked = false;
        const grpDetail = new CropGroup();
        grpDetail.CropGroupId = 0;
        grpDetail.CropGroupCode = 'CG_1';
        grpDetail.UserId = this.cropsNSchemesForm.get('UserName').value;
        grpDetail.EntryDate = this.cropsNSchemesForm.get('EntryDate').value;
        grpDetail.Name = this.myControl.value.toUpperCase();
        this.cropesAndSchemesService.saveGroupName(grpDetail).subscribe(res => {
          this.alertService.success('crop group added successfuly!');
          this.resetForm();
        },
          error => {
            console.log(error);
            this.alertService.error('Error has occured while saving!');
          });
      } else {
        this.alertService.error('This crop already exists under this group');
        this.cropNameAlreadyExist = true;
      }
    } else if (this.NoClicked) {
      const cropData = this.cropDetails;
      this.cropesAndSchemesService.saveCropsAndSchemes(cropData).subscribe(res => {
        this.alertService.success('Crop added successfuly!');
        this.resetForm();
      },
        error => {
          this.alertService.error('Error has occured while saving!');
        });
    } else if (this.modifyBtnClicked) {
      this.cropDetails = new CropsModel();
      let scheme = new Schemes();
      this.cropDetails = this.selectedCropGrop;
      this.cropDetails.UserName = this.cropsNSchemesForm.get('UserName').value;
      this.cropDetails.EntryDate = this.cropsNSchemesForm.get('EntryDate').value;
      scheme = this.selectedScheme;
      scheme.From = this.cropsNSchemesForm.get('From').value;
      scheme.Count = this.cropsNSchemesForm.get('Count').value;
      scheme.Sign = this.cropsNSchemesForm.get('Sign').value;
      this.cropDetails.Schemes = new Array<Schemes>();
      this.cropDetails.Schemes.push(scheme);
      if (!this.cropsNSchemesForm.get('From').valid || !this.cropsNSchemesForm.get('Count').valid) {
        return;
      }
      this.cropesAndSchemesService.update(this.cropDetails).subscribe(res => {
        this.alertService.success('Crop details updated successfully');
        this.resetForm();
      },
        error => {
          console.log(error);
          this.alertService.error('Error has occured while updating!');
        });
    }

  }

  addNewScheme() {
    this.modalService.close('save-scheme-Modal');
    this.cropsNSchemesForm.get('From').setValue('');
    this.cropsNSchemesForm.get('Count').setValue('');
    this.cropsNSchemesForm.get('Sign').setValue('');
    this.cropSchemeEle.nativeElement.focus();
    this.cropsNSchemesForm.controls.GroupCode.disable();
    this.CropName.disable();
  }

  onSave() {
    this.NoClicked = true;
    this.modalService.close('save-scheme-Modal');
    this.saveCommand.nativeElement.focus();
    this.disableGrpBtn = true;
    this.disableCropBtn = true;
    this.disableModifyBtn = true;
    this.disableFindBtn = true;
  }

  FindData() {
    this.getCropGroup();
    this.resetForm();
    this.findButtonClicked = true;
    this.cropsNSchemesForm.get('GroupCode').enable();
    this.cropsNSchemesForm.get('CropCode').enable();
    this.hideGroupNameDLL = false;
    this.hideCropNameDLL = true;
    this.CropGroupNameDDL.focus();
    this.disableGrpBtn = true;
    this.disableCropBtn = true;
    this.disableModifyBtn = true;
    this.disableFindBtn = true;
  }

  ModifyData() {
    this.getCropGroup();
    this.resetForm();
    this.modifyBtnClicked = true;
    this.hideGroupNameDLL = false;
    this.hideCropNameDLL = true;
    this.cropsNSchemesForm.enable();
    this.CropGroupNameDDL.focus();
    this.disableGrpBtn = true;
    this.disableCropBtn = true;
    this.disableModifyBtn = true;
    this.disableFindBtn = true;
  }

  search(data) {
    if ((this.findButtonClicked || this.modifyBtnClicked) && data) {
      this.cropsNSchemesForm.get('From').setValue('');
      this.cropsNSchemesForm.get('Count').setValue('');
      const crop = this.cropList.filter(
        cr => cr.CropCode === data
      );
      this.cropesAndSchemesService.search(crop[0]).subscribe(res => {
        this.cropDetails = res;
      });
    }
  }

  selectRow(schemes, cropDetail) {
    try {
      this.selectRowClicked = true;
      this.disableGrpBtn = true;
      this.disableCropBtn = true;
      this.disableModifyBtn = true;
      this.disableFindBtn = true;
      this.selectedCropGrop = cropDetail;
      this.selectedScheme = schemes;
      this.cropsNSchemesForm.patchValue({
        EntryDate: cropDetail.EntryDate,
        UserName: cropDetail.UserName,
        GroupCode: cropDetail.GroupCode,
        CropCode: schemes.CropCode,
        From: schemes.From,
        Count: schemes.Count,
        Sign: schemes.Sign,
      });
      // this.cropsNSchemesForm.get('GroupCode').disable();
      // this.cropsNSchemesForm.get('CropCode').disable();
    } catch (error) {
      console.log(error);
    }
  }

  disableSave() {
    try {
      if (
        (this.addCropGrpBtnClicked) ||
        (this.addCropBtnClicked && this.cropsNSchemesForm.valid) ||
        this.modifyBtnClicked ||
        this.NoClicked) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  changeGrpCodeToName(grpCode) {
    try {
      if (this.groupList.length > 0) {
        const dept = this.groupList.filter(
          g => g.CropGroupCode.toUpperCase() === grpCode.toUpperCase()
        );
        return dept[0].Name;
      }
      return grpCode;
    } catch (error) {
      console.log(error);
    }
  }

  deleteCrop(i) {
    this.cropDetails.Schemes.splice(i, 1);
  }

}
