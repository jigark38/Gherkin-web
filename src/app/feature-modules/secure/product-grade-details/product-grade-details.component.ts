import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductDetails, ProductGrade, ProductGroup, ProductVariety } from './product-grade-details.model';

import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { Observable } from 'rxjs';
import { ProductGradeDetailsService } from './product-grade-details.service';

@Component({
  selector: 'app-product-grade-details',
  templateUrl: './product-grade-details.component.html',
  styleUrls: ['./product-grade-details.component.css']
})
export class ProductGradeDetailsComponent implements OnInit {

  productDetailsList: ProductDetails[];

  pGroupList: ProductGroup[] = [];
  pGroupOptionsList: string[] = [];

  pVarietyList: ProductVariety[] = [];
  pVarietyOptionsList: string[] = [];
  pGradeForm: FormGroup;
  // disableSaveButton = true;
  disableSaveButton = true;
  disableFields = true;
  disableFindButton = true;
  disableModifyButton = true;
  disableNewButton = false;
  disableClearButton = true;
  gradeFromToError = false;

  constructor(
    private productService: ProductGradeDetailsService,
    private alertService: AlertService
  ) { }

  @ViewChild('dateOfCreation', null) dateCreateFieldRef: ElementRef;

  ngOnInit() {
    try {
      this.onInit();
      this.getProductDetails();
      this.onClearClick();
    } catch (ex) {
      console.log('Error on ngOnInit: ', ex);
    }
  }
  onInit() {
    this.initalizeForm();
    this.getPGroup();
    // this.disableSaveButton = true;
  }

  getProductDetails() {
    try {
      this.productService.getProductDetails().subscribe((res: ProductDetails[]) => {
        if (res) {
          this.productDetailsList = res;
        }
      });
    } catch (ex) {
      console.log('Error on getProductDetails: ', ex);
    }
  }

  initalizeForm(): void {
    try {
      this.pGradeForm = new FormGroup({
        dateOfCreation: new FormControl(null),
        productGroup: new FormControl(null, [Validators.required]),
        variety: new FormControl(null, [Validators.required]),
        scientificName: new FormControl(null),
        gradeFrom: new FormControl(null, [Validators.required, Validators.maxLength(3)]),
        gradeTo: new FormControl(null, [Validators.required, Validators.maxLength(3)])
      }
      );
    } catch (ex) {
      console.log('Error on initalizeForm: ', ex);
    }
  }

  getGradeFromToErrorMessage() {
    const from = this.pGradeForm.controls.gradeFrom.value;
    const to = this.pGradeForm.controls.gradeTo.value;
    if (from !== null && to !== null && from >= to) {
      this.gradeFromToError = true;
      return 'GradeTo must be greater than GradeFrom value.';
    } else {
      this.gradeFromToError = false;
      return '';
    }
  }



  // START product Section
  getPGroup() {
    try {
      this.productService.getAllProductGroup().subscribe((res: ProductGroup[]) => {
        if (res) {
          this.pGroupList = res;
          this.pGroupOptionsList = res.map(pg => pg.grpName);
        }
      });
    } catch (ex) {
      console.log('Error on getPGroup: ', ex);
    }
  }

  pGroupValueChange(event) {
    try {
      if (event) {
        const selectedPGroup = this.pGroupList.filter(p => p.grpName === event.trim())[0];
        if (selectedPGroup) {
          this.pGradeForm.controls.variety.setValue('');
          this.getPVariety(selectedPGroup.groupCode).subscribe(() => { });
        }
      } else {
        this.pVarietyList = [];
        this.pVarietyOptionsList = [];
        this.pGradeForm.controls.productGroup.setValue('');
        this.pGradeForm.controls.variety.setValue('');
      }
    } catch (ex) {
      console.log('Error on pGroupValueChange: ', ex);
    }

  }
  savesPGroupToList(pGroup: string) {
    try {
      if (pGroup && !this.pGroupList.filter(c => c.grpName === pGroup)[0]) {
        const pGroupObj = new ProductGroup();
        pGroupObj.grpName = pGroup;
        pGroupObj.createdDate = this.pGradeForm.controls.dateOfCreation.value;
        this.productService.saveProductGroup(pGroupObj).subscribe((data: ProductGroup) => {
          if (data) {
            this.pGroupList.push(data);
            this.pGroupOptionsList.push(data.grpName);
            this.pGroupOptionsList = this.pGroupOptionsList.slice();
            this.pVarietyList = [];
            this.pVarietyOptionsList = [];
            this.alertService.success('Group added successfully!');
          }
        }, err => {
          this.alertService.error('Error has occured while saving group.');
        });
      }
    } catch (ex) {
      console.log('Error on savesPGroupToList: ', ex);
    }
  }
  // END productGroup Section

  // START state Section
  getPVariety(pGradeCode: string) {
    try {
      return new Observable((sub) => {
        this.productService.getProductVariety(pGradeCode).subscribe((res: ProductVariety[]) => {

          this.pVarietyList = res;
          this.pVarietyOptionsList = res.map(sta => sta.varietyName);
          sub.next();

        }, err => {
          this.pVarietyList = [];
          this.pVarietyOptionsList = [];
          sub.error(err);
        });
      });
    } catch (ex) {
      console.log('Error on getPVariety: ', ex);
    }
  }

  pVarietyValueChange(event) {
    try {
      if (event) {
        const selectedVariety = this.pVarietyList.filter(p => p.varietyName === event)[0];
        if (selectedVariety) {
        }
      } else {
        this.pGradeForm.controls.variety.setValue('');
      }
    } catch (ex) {
      console.log('Error on pVarietyValueChange: ', ex);
    }
  }

  savePVarietyToList(variety: string) {
    try {
      if (variety && !this.pVarietyList.filter(c => c.varietyName === variety)[0]) {
        const pVarietyObj = new ProductVariety();
        pVarietyObj.varietyName = variety;
        const group = this.pGroupList.filter(a => a.grpName === this.pGradeForm.controls.productGroup.value)[0];
        if (group) {
          pVarietyObj.groupCode = group.groupCode;
          pVarietyObj.scientificName = this.pGradeForm.controls.scientificName.value;
          this.productService.saveProductVariety(pVarietyObj).subscribe((data: ProductVariety) => {
            if (data) {
              this.pVarietyList.push(data);
              this.pVarietyOptionsList.push(data.varietyName);
              this.pVarietyOptionsList = this.pVarietyOptionsList.slice();
              this.alertService.success('Variety added successfully!');
            }
          }, err => {
            this.alertService.error('Error has occured while saving variety.');
          });
        } else {
          this.alertService.warning('Please select Group to add Variety.');
        }
      }
    } catch (ex) {
      console.log('Error on savePVarietyToList: ', ex);
    }
  }
  onNewClick() {
    this.disableNewButton = true;
    this.disableSaveButton = false;
    this.disableClearButton = false;
    this.pGradeForm.controls.dateOfCreation.disable();
    this.pGradeForm.controls.dateOfCreation.setValue(new Date());
    this.pGradeForm.enable();
    setTimeout(() => this.dateCreateFieldRef.nativeElement.focus(), 1000);
  }

  onClearClick() {
    try {
      // this.onInit();
      this.disableNewButton = false;
      this.disableSaveButton = true;
      this.disableClearButton = true;
      this.pGradeForm.reset();
      this.pGradeForm.disable();

    } catch (error) {
      console.log('Error on onClearClick: ', error);
    }
  }
  onSaveProductGrade() {
    try {
      const productGrade: ProductGrade = this.getProductGrade();
      if (!productGrade) {
        return;
      }
      const abc = this.pGradeForm.controls.gradeFrom.value + '-' + this.pGradeForm.controls.gradeTo.value;
      const dupValue = this.productDetailsList.filter(p => p.gradefromTo === abc)[0];
      if (!dupValue) {
        this.disableSaveButton = true;
        this.productService.saveProductGrade(productGrade).subscribe(() => {
          this.alertService.success('Product Details created successfully.');
          this.getProductDetails();
          // this.initalizeForm();
          this.onClearClick();
        }, err => {
          this.disableSaveButton = false;
          this.alertService.error('Error has occured while creating Product Details.');
        });
      } else { this.alertService.error('Duplicate series of Grades can not be saved.'); }
    } catch (ex) {
      console.log('Error on onSaveProductGrade: ', ex);
    }
  }

  getProductGrade(): ProductGrade {
    try {
      if (this.pGradeForm.valid && this.gradeFromToError === false) {
        const productGrade = new ProductGrade();
        const group = this.pGroupList.filter(pg => pg.grpName === this.pGradeForm.controls.productGroup.value)[0];
        if (group) {
          productGrade.gradeCode = group.groupCode;
        }
        const variety = this.pVarietyList.filter(pv => pv.varietyName === this.pGradeForm.controls.variety.value)[0];
        if (variety) {
          productGrade.varietyCode = variety.varietyCode;
        }
        productGrade.gradeFrom = this.pGradeForm.controls.gradeFrom.value;
        productGrade.gradeTo = this.pGradeForm.controls.gradeTo.value;

        return productGrade;
      } else {
        this.pGradeForm.markAllAsTouched();
        return null;
      }
    } catch (ex) {
      console.log('Error on getProductGrade: ', ex);
    }
  }
}
