import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ngColumnType } from 'src/app/shared/components/ng-grid/grid.models';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { FarmerAccountDetailsFinalizationService } from './farmer-account-details-finalization.service';
import { FarmerAcccountDetails, GreensListDetails, InputIssue, InputReturn } from './models/farmer-account-details';



@Component({
  selector: 'app-farmer-account-details-finalization',
  templateUrl: './farmer-account-details-finalization.component.html',
  styleUrls: ['./farmer-account-details-finalization.component.css'],
  providers: [],
})
export class FarmerAccountDetailsFinalizationComponent implements OnInit {
  newInputIssues: Array<InputIssue>;
  newInputReturn: Array<InputReturn>;
  farmerAccountForm: FormGroup;
  settlementForm: FormGroup;
  dateValid = true;
  isDisabled = true;
  isSubmitted = false;
  unitList: Array<any> = [];
  cropGroupList: Array<any> = [];
  cropNameList: Array<any> = [];
  seasonList: Array<any> = [];
  areasList: Array<any> = [];
  fieldStaffList: Array<any> = [];
  cropsList: Array<any> = [];
  farmerNameList: Array<any> = [];
  farmerDetailList: Array<FarmerAcccountDetails> = [];
  greensList: Array<GreensListDetails> = [];
  isSearchClicked = false;
  isNewSchedule = false;
  isUpdateSchedule = false;
  disblNewPlantaBtn = false;
  disblFindBtn = false;
  disblModifyBtn = false;
  loginEmpDetails: any;
  disableField: boolean = true;
  isNewButton: boolean = false;
  index: number = 0;
  searchParam: SearchParams;
  showSpinner: boolean = false;
  selectedSettlement: FarmerAcccountDetails;
  farmerAAdvanceDetails: any[] = [];
  farmerInputReturnDetails: any[] = [];
  farmerInputIssuedDetails: any[] = [];
  farmerGreenReceivingDetails: any[] = [];
  materialCols: any[];
  mergeCols: any[];
  buildDataForGrid: any[];
  //disabling
  constructor(
    private authService: AuthenticationService,
    private _service: FarmerAccountDetailsFinalizationService,
    private readonly alertService: AlertService,
    public datepipe: DatePipe
  ) {
    this.newInputIssues = [];
    this.newInputReturn = [];
  }

  ngOnInit() {
    this.farmerAccountForm = new FormGroup({
      empName: new FormControl(null),
      cropGroup: new FormControl(null, Validators.required),
      unit: new FormControl(null),
      area: new FormControl(null, Validators.required),
      cropName: new FormControl(null, Validators.required),
      seasonFromTo: new FormControl(null),
      fieldStaff: new FormControl(null, Validators.required),
      farmerName: new FormControl(null, Validators.nullValidator),
      farmerAccountNo: new FormControl(null, Validators.nullValidator),
    });

    this.settlementForm = new FormGroup({
      Farmer_Name: new FormControl({ value: null, disabled: true }, Validators.nullValidator),
      Farmer_Code: new FormControl({ value: null, disabled: true }, Validators.required),
      Farmers_Account_No: new FormControl({ value: null, disabled: true }, Validators.required),
      PS_Number: new FormControl({ value: null, disabled: true }),
      noOfAcres: new FormControl({ value: null, disabled: true }),
      area: new FormControl({ value: null, disabled: true }, Validators.required),
      fieldStaff: new FormControl({ value: null, disabled: true }, Validators.required),
      Farmer_Balance_Amount: new FormControl({ value: null, disabled: true }, [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
      Farmers_AC_Settlement_Date: new FormControl(null, Validators.required),
      Farmer_Incentive_Amount: new FormControl(null, [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
      Farmer_Deduction_Amount: new FormControl(null, [Validators.pattern(/^(?:\d{0,8}\.\d{1,2})$|^\d{0,8}$/)]),
      Farmer_Final_Payable_Amount: new FormControl(null, [Validators.required]),
      Farmer_Remarks_Details: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
    });

    this.loginEmpDetails = this.authService.getUserdetails();
    this.farmerAccountForm.get("empName").setValue(this.loginEmpDetails.userName);

    this.getUnitsList();
    this.getAllAreas();
    this._service.getCropGroup().subscribe(res => {
      this.cropGroupList = res;
    });

    this.farmerAccountForm.get('seasonFromTo').valueChanges.subscribe(res => {
      let obj = this.seasonList.find(x => x.psNumber == res);
      let from = this.datepipe.transform(obj.seasonFrom, 'dd-MMM-yyyy');
      let to = this.datepipe.transform(obj.seasonTo, 'dd-MMM-yyyy');

      this.formSTL_seasonFromTo.setValue(from + '/' + to);
    })

    this.farmerAccountForm.get('fieldStaff').valueChanges.subscribe(res => {
      let obj = this.fieldStaffList.find(x => x.employeeID == res);
      this.formSTL_fieldStaff.setValue(obj.employeeName);
    })

    this.farmerAccountForm.get('cropGroup').valueChanges.subscribe(res => {
      this.getCropNameCodeList(res);
    })

    this.farmerAccountForm.get('cropName').valueChanges.subscribe(res => {
      this.getSeasonList(res);
    })

    this.farmerAccountForm.get('area').valueChanges.subscribe(res => {
      let obj = this.areasList.find(x => x.areaId == res);
      this.formSTL_area.setValue(obj.areaName);
      this.getFieldStaffList(res);
    });

    this.formFA_farmerAccountNo.valueChanges.subscribe(res => {
      if (this.farmerAccountForm.valid)
        this.searchSettlement();
    });

    this.formFA_fieldStaff.valueChanges.subscribe(res => {
      this.searchSettlement();
    });

    this.formSTL_incentiveAmount.valueChanges.subscribe(incentiveAmount => {
      let sec = parseFloat(incentiveAmount) - parseFloat(this.formSTL_deductionAmount.value);
      let finalAmount = parseFloat(this.formSTL_amountOutstanding.value) - sec;
      this.formSTL_finalSettlementAmount.setValue(finalAmount ? finalAmount.toFixed(0) : 0);
    })

    this.formSTL_deductionAmount.valueChanges.subscribe(deductionAmount => {
      let sec = parseFloat(this.formSTL_incentiveAmount.value) - parseFloat(deductionAmount);
      let finalAmount = parseFloat(this.formSTL_amountOutstanding.value) - sec;
      this.formSTL_finalSettlementAmount.setValue(finalAmount ? finalAmount.toFixed(0) : 0);
    })

  }

  searchSettlement() {
    this.searchParam = {
      unit: this.formFA_unit.value,
      cropGroup: this.formFA_cropGroup.value,
      cropName: this.formFA_cropName.value,
      seasonFromTo: this.formFA_seasonFromTo.value,
      areaId: this.formFA_area.value,
      fieldStaffId: this.formFA_fieldStaff.value,
      farmerName: this.formFA_farmerName.value,
      farmerAccountNo: this.formFA_farmerAccountNo.value == "" ? null : this.formFA_farmerAccountNo.value,
      FarmersAgreementCode: "",
      farmerCode: "",
      PsNumber: this.formFA_seasonFromTo.value
    }
    this._service.searchFarmerAccountSettlement(this.searchParam).subscribe(res => {
      this.farmerDetailList = res.map(x => {
        x.isChecked = false;
        return x
      });
    }, error => {
      this.farmerDetailList = [];
    })
  }

  onSelect(itemToBe: any) {
    this.farmerDetailList.map((item) => {
      if (item.farmerAccountNo == itemToBe.farmerAccountNo)
        item.isChecked = !item.isChecked;
      return item
    })
  }

  checkIfMultipleSelected() {
    var selectedRecords = this.farmerDetailList.filter(x => x.isChecked == true);
    if (selectedRecords.length > 1) {
      return true;
    }
    return false;
  }

  enableForm() {
    this.isNewButton = true; this.disableField = false;
    this.searchParam = {
      unit: null,
      cropGroup: null,
      cropName: null,
      seasonFromTo: null,
      areaId: null,
      fieldStaffId: null,
      farmerName: null,
      farmerAccountNo: null,
      FarmersAgreementCode: "",
      farmerCode: "",
      PsNumber: ''
    }
  }

  clear() { this.isNewButton = false; this.disableField = true; this.farmerAccountForm.reset(); }

  getFieldStaffList(areaId) {
    this._service.getFieldStaffListByAreaId(areaId, 'field staff').subscribe(res => {
      this.fieldStaffList = res;
      this.fieldStaffList = this.fieldStaffList.filter(x => x.areaID === areaId);
    }, err => {
    });
  }

  getAllAreas() {
    this._service.getAllAreas().subscribe(res => {
      this.areasList = res;
    });

  }

  getUnitsList() {
    this.unitList = null;
    this._service.getOfficeLocationDetails().subscribe((res: any) => {
      this.unitList = res;
    }, error => {
      this.alertService.error('Error while getting Location Details!');
    });
  }

  getCropNameCodeList(cropGroupCode) {
    this._service.getCropCode(cropGroupCode).subscribe(res => {
      this.cropNameList = res;
    }, error => {
      this.alertService.error('Error in fetching Crop details!');
    });
  }

  getSeasonList(cropNameCode) {
    this._service.getSeasonFromTo(cropNameCode).subscribe(res => {
      this.seasonList = res;
    }, error => {
      this.alertService.error('Error in fetching Crop details!');
    });
  }

  submitForm() {
    if (this.settlementForm.invalid)
      this.markFormGroupTouched(this.settlementForm)

    this._service.CreateSettlementAgreement(this.settlementForm.getRawValue()).subscribe(res => {
      this.alertService.success('Farmer Settlement saved successfully.');
      this.index = 0;
      this.clear();
      this.farmerAccountForm.reset();
      this.settlementForm.reset();
    });
  }

  clearBtnClick() {
    this.index = 0;
    this.clear();
    this.farmerAccountForm.reset();
    this.settlementForm.reset();
  }


  scrollTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  goToNextTab() {
    if (this.farmerAccountForm.invalid)
      this.markFormGroupTouched(this.farmerAccountForm)
    else {
      if (!this.checkIfMultipleSelected()) {
        let info = this.farmerDetailList.find(x => x.isChecked == true);
        this.formSTL_farmersAccountNo.setValue(info.farmerAccountNo);
        this.formSTL_farmerName.setValue(info.farmerName);
        this.formSTL_noOfAcres.setValue(info.noOfAcres);
        this.formSTL_amountOutstanding.setValue(info.payable);
        this.formSTL_finalSettlementAmount.setValue(info.payable);
        this.formSTL_farmerCode.setValue(info.farmerCode);
        //GetSettlementDetails
        this.searchParam.farmerCode = info.farmerCode;
        this.searchParam.FarmersAgreementCode = info.farmerAgreementCode;
        this.searchParam.PsNumber = this.farmerAccountForm.controls.seasonFromTo.value;
        this.searchParam.farmerAccountNo = info.farmerAccountNo;
        this.searchParam.farmerName = info.farmerName;
        this.materialCols = [];


        //te,p override api
        const GetSettlementDetails = this._service.getFarmerAdvanceDetails(this.searchParam);//this._service.GetSettlementDetails(this.searchParam);


        const getFarmerAdvanceDetails = this._service.getFarmerAdvanceDetails(this.searchParam);
        const getFarmerReturnGridDetails = this._service.getFarmerInputsReturnDetails(this.searchParam);
        const getFarmerInputsIssuedDetails = this._service.getFarmerInputsIssuedDetails(this.searchParam);
        const getFarmerGreensReveivingDetails = this._service.getFarmerGreensReveivingDetails(this.searchParam);
        const getFarmerInputIssued = this._service.getFarmerInputIssue(this.searchParam);
        const getFarmerInputReturn = this._service.getFarmerInputReturn(this.searchParam);

        forkJoin([GetSettlementDetails, getFarmerAdvanceDetails, getFarmerReturnGridDetails,
          getFarmerInputsIssuedDetails, getFarmerGreensReveivingDetails, getFarmerInputIssued, getFarmerInputReturn]).subscribe((results) => {
            this.greensList = results[0];
            this.index = 1;
            console.log('getFarmerAdvanceDetails');
            this.farmerAAdvanceDetails = results[1].Data;
            this.farmerInputReturnDetails = results[2].Data;
            this.farmerInputIssuedDetails = results[3].Data;
            this.farmerGreenReceivingDetails = results[4].Data;
            this.newInputIssues = (results[5].Data ? results[5].Data : []);
            this.newInputReturn = (results[6].Data ? results[6].Data : []);
            this.greensDataGrid(this.farmerGreenReceivingDetails);
          },
            (error) => {
              this.greensList = [];
              this.farmerAAdvanceDetails = [];
              this.farmerInputReturnDetails = [];
              this.farmerInputIssuedDetails = [];
              this.alertService.error('Something went wrong');
            });


        // this._service.GetSettlementDetails(this.searchParam).subscribe(res => {
        //   this.greensList = res;
        //   this.index = 1;
        // }, error => {
        //   this.greensList = [];
        //   this.alertService.error('Something went wrong');
        // });
      }

    }
  }

  greensDataGrid(greensReceivingData) {
    this.mergeCols = [];
    this.buildDataForGrid = [];
    console.log(greensReceivingData);
    this.materialCols.push({ header: 'Harvest Date', field: 'Harvest_Date', type: ngColumnType.date });
    // greensReceivingData.map(item => {
    //   // item.totalAmount = item.Count_wise_Total_Quantity * item.Crop_Rate_As_per_Association;
    //   // item.Harvest_Date = this.datepipe.transform(item.Harvest_Date, 'dd-MM-yyyy');

    // });
    for (let i = 0; i < greensReceivingData.length; i++) {
      let inData = this.mergeCols.findIndex(x => x == greensReceivingData[i].CropSchemePattern);
      if (inData == - 1) {
        this.mergeCols.push(greensReceivingData[i].CropSchemePattern);
        this.materialCols.push({ header: 'Quantity', field: 'Count_wise_Total_Quantity' });
        this.materialCols.push({ header: 'Rate', field: 'Crop_Rate_As_per_Association' });
        this.materialCols.push({ header: 'Amount', field: 'totalAmount' });
      }
    }
    // let unique = this.mergeCols.filter((item, i, ar) => ar.indexOf(item) === i);
    // this.mergeCols = unique;
    let count = 1;
    for (let i = 0; i < greensReceivingData.length; i++) {
      let temp = [];
      let data = greensReceivingData[i];
      data.Harvest_Date = this.datepipe.transform(data.Harvest_Date, 'dd-MM-yy');
      let find = this.buildDataForGrid.filter(x => {
        if (x[1] == data.Harvest_Date) {
          return x;
        }
      });
      if (find && find.length > 0) {
        let index = this.buildDataForGrid.findIndex(x => {
          if (x[1] == data.Harvest_Date) {
            return x;
          }
        });
        let num = this.mergeCols.indexOf(data.CropSchemePattern);
        let finalNumber = 2 + ((num > 0 ? num : 1) * 3);
        this.buildDataForGrid[index][finalNumber] = parseFloat((data.Count_wise_Total_Quantity ? data.Count_wise_Total_Quantity : 0).toFixed(2));
        this.buildDataForGrid[index][finalNumber + 1] = parseFloat((data.Crop_Rate_As_per_Association ? data.Crop_Rate_As_per_Association : 0).toFixed(2));
        this.buildDataForGrid[index][finalNumber + 2] = parseFloat(((data.Count_wise_Total_Quantity ? data.Count_wise_Total_Quantity : 0) * (data.Crop_Rate_As_per_Association ? data.Crop_Rate_As_per_Association : 0)).toFixed(2));
      } else {
        temp.push(count);
        temp.push(data.Harvest_Date);
        this.mergeCols.forEach(element => {
          temp.push(0);
          temp.push(0);
          temp.push(0);
        });
        let index = this.mergeCols.indexOf(data.CropSchemePattern);
        let finalNumber = 2 + (index * 3);
        temp[finalNumber] = parseFloat((data.Count_wise_Total_Quantity ? data.Count_wise_Total_Quantity : 0).toFixed(2));
        temp[finalNumber + 1] = parseFloat((data.Crop_Rate_As_per_Association ? data.Crop_Rate_As_per_Association : 0).toFixed(2));
        temp[finalNumber + 2] = parseFloat(((data.Count_wise_Total_Quantity ? data.Count_wise_Total_Quantity : 0) * (data.Crop_Rate_As_per_Association ? data.Crop_Rate_As_per_Association : 0)).toFixed(2));
        this.buildDataForGrid.push(temp);
        count = count + 1;
      }
    }
    let totalQuantity = 0;
    let totalAmount = 0;
    let totalQuantityCummu = 0;
    let totalAmountCummu = 0;
    for (let i = 0; i < this.buildDataForGrid.length; i++) {
      let Quantity = 0;
      let Amount = 0;
      let number = 2;
      let number2 = 4;
      for (let j = 2; j < this.buildDataForGrid[i].length; j = j + 3) {
        Quantity = parseFloat(this.buildDataForGrid[i][number].toFixed(2)) + parseFloat(Quantity.toFixed(2));
        Amount = parseFloat(this.buildDataForGrid[i][number2].toFixed(2)) + parseFloat(Amount.toFixed(2));
        number = number + 3;
        number2 = number2 + 3;
      }
      totalQuantity = totalQuantity + Quantity;
      totalAmount = totalAmount + Amount;
      this.buildDataForGrid[i].push(parseFloat(Quantity.toFixed(2)));
      this.buildDataForGrid[i].push(parseFloat(Amount.toFixed(2)));

      if (i !== 0) {
        let qu = parseFloat((Quantity + this.buildDataForGrid[i - 1][this.buildDataForGrid[i - 1].length - 2]).toFixed(2));
        let au = parseFloat((Amount + this.buildDataForGrid[i - 1][this.buildDataForGrid[i - 1].length - 1]).toFixed(2));
        totalQuantityCummu = totalQuantityCummu + qu;
        totalAmountCummu = totalAmountCummu + au;
        this.buildDataForGrid[i].push(qu);
        this.buildDataForGrid[i].push(au);
      } else {
        let qu = parseFloat(Quantity.toFixed(2));
        let au = parseFloat(Amount.toFixed(2));
        totalQuantityCummu = totalQuantityCummu + qu;
        totalAmountCummu = totalAmountCummu + au;
        this.buildDataForGrid[i].push(qu);
        this.buildDataForGrid[i].push(au);
      }
    }
    console.log("Data Got");
    let temp2 = [];
    for (let j = 0; j < this.buildDataForGrid[0].length; j++) {
      temp2.push('');
    }
    temp2[0] = 'Totals';
    let lastColumn = this.buildDataForGrid[0].length - 1;
    temp2[lastColumn] = parseFloat(totalAmountCummu.toFixed(2));
    temp2[lastColumn - 1] = parseFloat(totalQuantityCummu.toFixed(2));
    temp2[lastColumn - 2] = parseFloat(totalAmount.toFixed(2));
    temp2[lastColumn - 3] = parseFloat(totalQuantity.toFixed(2));

    for (let a = 2; a < this.buildDataForGrid[0].length - 2; a = a + 3) {
      let Quantity = 0;
      let Rate = 0;
      let Amount = 0;
      for (let j = 0; j < this.buildDataForGrid.length; j++) {
        Quantity = Quantity + parseFloat(this.buildDataForGrid[j][a]);
      }
      for (let j = 0; j < this.buildDataForGrid.length; j++) {
        Rate = Rate + parseFloat(this.buildDataForGrid[j][a + 1]);
      }
      for (let j = 0; j < this.buildDataForGrid.length; j++) {
        Amount = Amount + parseFloat(this.buildDataForGrid[j][a + 2]);
      }
      temp2[a] = parseFloat(Quantity.toFixed(2));
      temp2[a + 1] = parseFloat(Rate.toFixed(2));
      temp2[a + 2] = parseFloat(Amount.toFixed(2));
    }
    this.buildDataForGrid.push(temp2);
    console.log(this.mergeCols);
  }

  isNumber(dd) {
    return typeof dd === 'number';
  }

  //Form Farmer Account Details
  get formFA_empName() { return this.farmerAccountForm.get('empName') }
  get formFA_cropGroup() { return this.farmerAccountForm.get('cropGroup') }
  get formFA_unit() { return this.farmerAccountForm.get('unit') }
  get formFA_area() { return this.farmerAccountForm.get('area') }
  get formFA_cropName() { return this.farmerAccountForm.get('cropName') }
  get formFA_seasonFromTo() { return this.farmerAccountForm.get('seasonFromTo') }
  get formFA_FromDate() { return this.farmerAccountForm.get('FromDate') }
  get formFA_ToDate() { return this.farmerAccountForm.get('ToDate') }
  get formFA_fieldStaff() { return this.farmerAccountForm.get('fieldStaff') }
  get formFA_farmerName() { return this.farmerAccountForm.get('farmerName') }
  get formFA_farmerAccountNo() { return this.farmerAccountForm.get('farmerAccountNo') }

  //Form settlementForm
  get formSTL_farmerName() { return this.settlementForm.get('Farmer_Name') }
  get formSTL_farmerCode() { return this.settlementForm.get('Farmer_Code') }
  get formSTL_farmersAccountNo() { return this.settlementForm.get('Farmers_Account_No') }
  get formSTL_seasonFromTo() { return this.settlementForm.get('PS_Number') }
  get formSTL_noOfAcres() { return this.settlementForm.get('noOfAcres') }
  get formSTL_area() { return this.settlementForm.get('area') }
  get formSTL_fieldStaff() { return this.settlementForm.get('fieldStaff') }
  get formSTL_amountOutstanding() { return this.settlementForm.get('Farmer_Balance_Amount') }
  get formSTL_settlementDate() { return this.settlementForm.get('Farmers_AC_Settlement_Date') }
  get formSTL_incentiveAmount() { return this.settlementForm.get('Farmer_Incentive_Amount') }
  get formSTL_deductionAmount() { return this.settlementForm.get('Farmer_Deduction_Amount') }
  get formSTL_finalSettlementAmount() { return this.settlementForm.get('Farmer_Final_Payable_Amount') }
  get formSTL_remarks() { return this.settlementForm.get('Farmer_Remarks_Details') }
  get formSTL_empName() { return this.settlementForm.get('empName') }
  get formSTL_cropGroup() { return this.settlementForm.get('cropGroup') }
  get formSTL_unit() { return this.settlementForm.get('unit') }
  get formSTL_cropName() { return this.settlementForm.get('cropName') }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
