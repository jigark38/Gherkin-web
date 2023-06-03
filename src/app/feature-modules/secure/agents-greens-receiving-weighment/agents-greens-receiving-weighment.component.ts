import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatSelect } from '@angular/material';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { ConfirmationDialogComponent } from 'src/app/corecomponents/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { CropGroup, CropName, SeasonFromTo } from '../../agri-management/master/package-of-practice/package-of-practice.model';
import { SupplierInformationDetails } from '../greens-agent-supplier-details/greens-agent-supplier-details.model';
import { InwardGatePassModel } from '../inward-gate-pass/inward-gate-pass.models';
import { GreensAgentActualWeightDetails, GreensAgentDespCountWeightDetails, GreensAgentGradesActualDetails, GreensAgentReceivedDetails } from './agents-greens-receiving-weighment.model';
import { AgentsGreensReceivingWeighmentService } from './agents-greens-receiving-weighment.service';
declare var $: any;

@Component({
  selector: 'app-agents-greens-receiving-weighment',
  templateUrl: './agents-greens-receiving-weighment.component.html',
  styleUrls: ['./agents-greens-receiving-weighment.component.css']
})
export class AgentsGreensReceivingWeighmentComponent implements OnInit {
  tabIndex: any;
  disableNextPanel: any;
  ddlOrganizations: any;
  inwardGatePassList: Array<InwardGatePassModel>;
  selectedInward: InwardGatePassModel;
  supplierInformationDetails: Array<SupplierInformationDetails>;
  agentsGreensReceivingWeighmentForm: FormGroup;
  groupList: Array<CropGroup>;
  cropNameList: Array<CropName>;
  SeasonFromToList: Array<SeasonFromTo>;
  disableAgntReceiBtn: boolean;
  disableNextBtn: boolean;
  disableSaveBtn: boolean;
  disableFindBtn: boolean;
  disableModifyBtn: boolean;
  uniqueId: number;
  isAgntReceiBtnClicked: boolean;
  greensAgentDespCountWeightDetailsList: Array<GreensAgentDespCountWeightDetails>;
  cropSchemeList = [];
  selectedCropSchemeList = [];
  selectedTab = 'materialDetails';
  greensAgentActualWeightDetailsList: Array<GreensAgentActualWeightDetails>;
  greensAgentGradesActualDetailsList: Array<GreensAgentGradesActualDetails>;
  gridActualWeightDetailList: Array<GreensAgentActualWeightDetails>;
  selectedSummary: GreensAgentGradesActualDetails;
  isRadioSelected: boolean;
  greensAgentReceivedDetails: GreensAgentReceivedDetails;
  locactionList = [];
  unitName;
  employeeId: string;
  employeeName: string;
  totlQty: number;
  min = 0;
  max = 10;

  @ViewChild('UnitName', { static: false }) UnitName: MatSelect;
  @ViewChild('nxtBtn', { static: false }) nxtBtn: ElementRef;

  constructor(
    private service: AgentsGreensReceivingWeighmentService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private authService: AuthenticationService,
  ) {
    this.uniqueId = 0;
    this.greensAgentDespCountWeightDetailsList = [];
    this.greensAgentActualWeightDetailsList = [];
    this.greensAgentGradesActualDetailsList = [];
    this.gridActualWeightDetailList = [];
    this.isRadioSelected = false;
    this.supplierInformationDetails = [];
  }

  ngOnInit() {

    const emp = this.authService.getUserdetails();
    this.employeeName = emp.userName;
    this.employeeId = emp.employeeId;

    this.agentsGreensReceivingWeighmentForm = new FormGroup({
      greensAgentGRNNo: new FormControl(null),
      orgOfficeNo: new FormControl(null, Validators.required),
      greensAgentGRNDateTime: new FormControl(null, Validators.required),
      agentOrgID: new FormControl(null),
      place: new FormControl(null),
      invoiceDCNo: new FormControl(null, Validators.required),
      invoiceDCDate: new FormControl(null, Validators.required),
      cropGroupCode: new FormControl(null, Validators.required),
      cropNameCode: new FormControl(null, Validators.required),
      pSNumber: new FormControl(null, Validators.required),
      greensAgentDespQty: new FormControl(null, Validators.required),
      greensAgentDespCrates: new FormControl(null),
      inwardGatePassNo: new FormControl(null, Validators.required)
    });
    this.reset();
    this.service.getLocatons().subscribe((res: any) => {
      if (res.IsSucceed) {
        this.locactionList = res.Data;
      }
      else {
        this.alertService.error('Error while getting location list!');
      }

    },
      error => {
        this.alertService.error('Error while getting location list!');
      });

  }

  onTabChange(event) {
    if (event === 1) {
      // this.summaryformCreation();
      this.selectedTab = 'materialDetails';
      //this.prepareFarmerWiseSummaryGrid();
    } else {
      this.selectedTab = 'weighmentDetails';
    }
  }

  getInwardDetails(event) {
    this.service.getInwardDetails(event.value).subscribe(x => {
      if (x.IsSucceed) {
        this.inwardGatePassList = x.Data
      }
      else {
        this.alertService.error('Error in fetching Inward details');
      }
    })
  }

  setPlace(event) {
    this.agentsGreensReceivingWeighmentForm.controls.place.setValue(this.supplierInformationDetails.length > 0 ? this.supplierInformationDetails.find(x => x.agentOrgID == event).placeName : "");
    this.agentsGreensReceivingWeighmentForm.controls.place.disable();
  }

  selectedInWard(item) {
    this.agentsGreensReceivingWeighmentForm.reset();
    this.greensAgentDespCountWeightDetailsList = [];
    this.greensAgentGradesActualDetailsList = [];
    this.gridActualWeightDetailList = [];
    this.selectedInward = new InwardGatePassModel();
    this.selectedInward = item;
    this.agentsGreensReceivingWeighmentForm.controls.inwardGatePassNo.setValue(this.selectedInward.inwardGatePassNo);
    this.agentsGreensReceivingWeighmentForm.controls.greensAgentGRNNo.setValue(0);
    this.getCropGroup();
    this.getSupplierInformationDetails();
    if (this.selectedInward.isOngoing) {
      this.GetGreensRecvDetailsByGatePass(this.selectedInward.inwardGatePassNo);
    }
  }

  getSupplierInformationDetails() {
    this.service.getSupplierInformationDetails().subscribe(res => {
      if (res.IsSucceed) {
        this.supplierInformationDetails = res.Data;
      }
    })
  }

  getCropGroup() {
    this.service.getCropGroupList().subscribe(res => {
      this.groupList = new Array<CropGroup>();
      this.groupList = res;
    });
  }

  getCropName(groupCode: string) {
    this.service.getCropListByCropGroupCode(groupCode).subscribe(res => {
      this.cropNameList = new Array<CropName>();
      this.cropNameList = res;
    })
  }

  getAllPSNoByCropNameCode(cropNameCode: string) {
    this.greensAgentDespCountWeightDetailsList = [];
    this.uniqueId = 0;
    this.service.getAllPSNoByCropNameCode(cropNameCode).subscribe(res => {
      this.SeasonFromToList = new Array<SeasonFromTo>();
      this.SeasonFromToList = res;

    });
  }


  reset() {
    this.totlQty = 0.00;
    this.agentsGreensReceivingWeighmentForm.reset();
    this.agentsGreensReceivingWeighmentForm.disable();
    this.disableAgntReceiBtn = false;
    this.disableNextBtn = true;
    this.disableSaveBtn = true;
    this.disableFindBtn = false;
    this.disableModifyBtn = false;
    // this.UnitName.disabled = true;
    // this.UnitName.value = null;
    this.isAgntReceiBtnClicked = false;
    this.greensAgentDespCountWeightDetailsList = [];
    this.cropSchemeList = [];
    this.unitName = null;
    this.inwardGatePassList = [];
    this.gridActualWeightDetailList = [];
    this.greensAgentGradesActualDetailsList = [];
    this.selectedTab = 'materialDetails';
  }

  onAgentReceiptsClick() {
    this.reset();
    this.agentsGreensReceivingWeighmentForm.enable();
    this.agentsGreensReceivingWeighmentForm.controls.greensAgentGRNNo.disable();
    this.UnitName.disabled = false;
    this.UnitName.value = null;
    this.disableFindBtn = true;
    this.disableModifyBtn = true;
    this.isAgntReceiBtnClicked = true;
    this.service.getAllOrganizations().subscribe(x => {
      this.ddlOrganizations = x;
    });
    setTimeout(() => { this.UnitName.focus(); }, 500);

  }

  NumberOfCretesblur() {
    this.service.getCropSchemeDetails(this.agentsGreensReceivingWeighmentForm.get('cropNameCode').value).subscribe(res => {
      if (res.IsSucceed) {
        this.cropSchemeList = res.Data;
        this.cropSchemeList.forEach(i => i.isDisabled = false)
      }
    })
    if (this.isAgntReceiBtnClicked && this.greensAgentDespCountWeightDetailsList.length == 0) {
      var greensAgentDespCountWeightDetail = new GreensAgentDespCountWeightDetails();
      this.uniqueId = this.uniqueId + 1;
      greensAgentDespCountWeightDetail.uniqueId = this.uniqueId;

      this.greensAgentDespCountWeightDetailsList.push(greensAgentDespCountWeightDetail);
    }
  }

  GridItemBlur(item) {
    this.cropSchemeList.find(i => i.Code == item.cropSchemeCode).isDisabled = true;
    let greensActualDetail = new GreensAgentGradesActualDetails();
    greensActualDetail.greensAgentGRNNo = item.greensAgentGRNNo;
    greensActualDetail.agentReceivedNo = item.agentCropReceivedNo;
    greensActualDetail.cropNameCode = this.agentsGreensReceivingWeighmentForm.get('cropNameCode').value;
    greensActualDetail.cropSchemeCode = item.cropSchemeCode;
    greensActualDetail.countTotalCrates = 0
    greensActualDetail.countTotalWeight = 0.00
    if (this.greensAgentGradesActualDetailsList.some(x => x.cropSchemeCode != greensActualDetail.cropSchemeCode) || this.greensAgentGradesActualDetailsList.length == 0) {
      this.greensAgentGradesActualDetailsList.push(greensActualDetail);
    }


    item.isDisabled = true;
    if (this.greensAgentDespCountWeightDetailsList.length > 0 && this.cropSchemeList.some(i => i.isDisabled == false)) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you want to add more Agent Despatched Details?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //this.selectedCropSchemeList = this.cropSchemeList.filter(i => (this.greensAgentDespCountWeightDetailsList.map(function (obj) { return obj.cropSchemeCode; })).includes(i.Code));
          //this.cropSchemeList = this.cropSchemeList.filter(i => !(this.greensAgentDespCountWeightDetailsList.map(function (obj) { return obj.cropSchemeCode; })).includes(i.Code));
          var greensAgentDespCountWeightDetail = new GreensAgentDespCountWeightDetails();
          greensAgentDespCountWeightDetail.uniqueId = this.uniqueId + 1;

          this.greensAgentDespCountWeightDetailsList.push(greensAgentDespCountWeightDetail);
        } else {
          this.disableNextBtn = false;
          this.nxtBtn.nativeElement.focus();
        }
      });
    }
    else {
      this.disableNextBtn = false;
      this.nxtBtn.nativeElement.focus();
    }
  }

  saveAndNext() {
    this.selectedTab = 'weighmentDetails';
    this.disableNextBtn = true;
    this.greensAgentReceivedDetails = this.agentsGreensReceivingWeighmentForm.value;
    this.save()
  }

  // saveAndNext() {
  //   if (this.selectedInward.isOngoing) {
  //     this.selectedTab = 'weighmentDetails';
  //     this.disableNextBtn = true;
  //   }
  //   else if (this.agentsGreensReceivingWeighmentForm.valid && this.greensAgentDespCountWeightDetailsList.length > 0) {
  //     this.greensAgentReceivedDetails = new GreensAgentReceivedDetails();
  //     this.greensAgentReceivedDetails = this.agentsGreensReceivingWeighmentForm.value;
  //     this.greensAgentReceivedDetails.employeeID = this.employeeId;
  //     this.greensAgentReceivedDetails.greensAgentDespCountWeightDetails = [];
  //     this.greensAgentReceivedDetails.greensAgentDespCountWeightDetails = this.greensAgentDespCountWeightDetailsList;
  //     this.service.partialSaveGreensRecvDetails(this.greensAgentReceivedDetails).subscribe(res => {
  //       if (res.IsSucceed) {
  //         this.greensAgentReceivedDetails = res.Data
  //         this.agentsGreensReceivingWeighmentForm.patchValue({
  //           greensAgentGRNNo: this.greensAgentReceivedDetails.greensAgentGRNNo,
  //           orgOfficeNo: this.greensAgentReceivedDetails.orgOfficeNo,
  //           greensAgentGRNDateTime: this.greensAgentReceivedDetails.greensAgentGRNDateTime,
  //           agentOrgID: this.greensAgentReceivedDetails.agentOrgID,
  //           place: (this.supplierInformationDetails.length > 0 ? this.supplierInformationDetails.find(x => x.agentOrgID == this.greensAgentReceivedDetails.agentOrgID).placeName : ""),
  //           invoiceDCNo: this.greensAgentReceivedDetails.invoiceDCNo,
  //           invoiceDCDate: this.greensAgentReceivedDetails.invoiceDCDate,
  //           cropGroupCode: this.greensAgentReceivedDetails.cropGroupCode,
  //           cropNameCode: this.greensAgentReceivedDetails.cropNameCode,
  //           pSNumber: this.greensAgentReceivedDetails.pSNumber,
  //           greensAgentDespQty: this.greensAgentReceivedDetails.greensAgentDespQty,
  //           greensAgentDespCrates: this.greensAgentReceivedDetails.GreensAgentDespCrates,
  //           inwardGatePassNo: this.greensAgentReceivedDetails.inwardGatePassNo,
  //         });
  //         this.greensAgentDespCountWeightDetailsList = this.greensAgentReceivedDetails.greensAgentDespCountWeightDetails;
  //         this.selectedTab = 'weighmentDetails';
  //         this.disableNextBtn = true;
  //       }
  //       else {
  //         this.alertService.error('Error in fetching saving details');
  //       }
  //     })
  //   }
  //   else {
  //     this.alertService.error('Please fill up the requered fields');
  //   }

  // }

  selectSummaryReceiving(actualDetail) {
    this.selectedSummary = actualDetail;
    this.gridActualWeightDetailList = this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == actualDetail.cropSchemeCode);
    let greensActualWeightDetail = new GreensAgentActualWeightDetails();
    greensActualWeightDetail.cropSchemeCode = actualDetail.cropSchemeCode;
    greensActualWeightDetail.cropNameCode = actualDetail.cropNameCode;
    greensActualWeightDetail.actualWeightNoofCrates = 0;
    greensActualWeightDetail.actualWeightNoofCrates = 0;
    greensActualWeightDetail.actualGrossWeight = 0;
    greensActualWeightDetail.actualTareWeight = 0;
    greensActualWeightDetail.actualNetWeight = 0;

    this.gridActualWeightDetailList.push(greensActualWeightDetail);
  }

  calculateTareWeight(actWeitDetail) {
    actWeitDetail.actualTareWeight = actWeitDetail.actualWeightNoofCrates * actWeitDetail.actualCratesTareWeight;
  }

  calculateNetWeight(actWeitDetail) {
    actWeitDetail.actualNetWeight = actWeitDetail.actualGrossWeight - actWeitDetail.actualTareWeight;
    let sum2: number = 0;
    this.greensAgentActualWeightDetailsList.forEach(a => sum2 += Number(a.actualNetWeight));
    this.totlQty = sum2;
    this.showPopup(actWeitDetail);
  }

  // addMoreSumryReceiving() {

  // }

  continueToAddCount() {
    this.gridActualWeightDetailList = this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode);
    this.selectedTab = 'weighmentDetails';
    this.disableNextBtn = true;
    this.greensAgentReceivedDetails = this.agentsGreensReceivingWeighmentForm.value;
    this.save();
    let greensActualWeightDetail = new GreensAgentActualWeightDetails();
    greensActualWeightDetail.cropSchemeCode = this.selectedSummary.cropSchemeCode;
    greensActualWeightDetail.cropNameCode = this.selectedSummary.cropNameCode;
    greensActualWeightDetail.actualWeightNoofCrates = 0;
    greensActualWeightDetail.actualWeightNoofCrates = 0;
    greensActualWeightDetail.actualGrossWeight = 0;
    greensActualWeightDetail.actualTareWeight = 0;
    greensActualWeightDetail.actualNetWeight = 0;
    this.gridActualWeightDetailList.push(greensActualWeightDetail);
  }

  changeCountdata() {
    this.gridActualWeightDetailList = [];
    let sum1: number = 0;
    this.greensAgentGradesActualDetailsList.forEach(a => sum1 += Number(a.countTotalWeight));
    this.totlQty = sum1;
    this.save();
    this.selectedSummary = new GreensAgentGradesActualDetails();
    this.isRadioSelected = false;
  }

  completeWeighment() {
    this.save();
    this.disableSaveBtn = false;
  }

  showPopup(actWeitDetail) {
    this.greensAgentActualWeightDetailsList.push(actWeitDetail);
    let sum: number = 0;
    this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == actWeitDetail.cropSchemeCode).forEach(a => sum += Number(a.actualWeightNoofCrates));
    this.greensAgentGradesActualDetailsList.find(x => x.cropSchemeCode == actWeitDetail.cropSchemeCode).countTotalCrates = sum;

    let netsum: number = 0;
    this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == actWeitDetail.cropSchemeCode).forEach(a => netsum += Number(a.actualNetWeight));
    this.greensAgentGradesActualDetailsList.find(x => x.cropSchemeCode == actWeitDetail.cropSchemeCode).countTotalWeight = netsum;
    $('#AddMoreData').modal('show');
  }

  closePopup() {
    $('#AddMoreData').modal('hide');
  }

  calculateGrossWt() {
    let grossWeight: number = 0;
    if (this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode).length > 0) {

      this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode).forEach(a => grossWeight += Number(a.actualGrossWeight));

    }
    return grossWeight
  }

  calculateTareWt() {
    let tareWeight: number = 0;
    if (this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode).length > 0) {
      this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode).forEach(a => tareWeight += Number(a.actualTareWeight));
    }
    return tareWeight
  }

  calculateNetWt() {
    let netWeight: number = 0;
    if (this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode).length > 0) {
      this.greensAgentActualWeightDetailsList.filter(x => x.cropSchemeCode == this.selectedSummary.cropSchemeCode).forEach(a => netWeight += Number(a.actualNetWeight));
    }
    if (this.greensAgentGradesActualDetailsList.length > 0 && this.selectedSummary != undefined) {
      this.greensAgentGradesActualDetailsList.find(c => c.cropSchemeCode == this.selectedSummary.cropSchemeCode).countTotalWeight;
    }
    return netWeight
  }

  GetGreensRecvDetailsByGatePass(inwardGatePassNo) {
    this.service.GetGreensRecvDetailsByGatePass(inwardGatePassNo).subscribe(res => {
      if (res.IsSucceed) {
        this.greensAgentReceivedDetails = new GreensAgentReceivedDetails;
        this.greensAgentReceivedDetails = res.Data
        this.agentsGreensReceivingWeighmentForm.patchValue({
          greensAgentGRNNo: this.greensAgentReceivedDetails.greensAgentGRNNo,
          orgOfficeNo: this.greensAgentReceivedDetails.orgOfficeNo,
          greensAgentGRNDateTime: this.greensAgentReceivedDetails.greensAgentGRNDateTime,
          agentOrgID: this.greensAgentReceivedDetails.agentOrgID,
          place: (this.supplierInformationDetails.length > 0 ? this.supplierInformationDetails.find(x => x.agentOrgID == this.greensAgentReceivedDetails.agentOrgID).placeName : ""),
          invoiceDCNo: this.greensAgentReceivedDetails.invoiceDCNo,
          invoiceDCDate: this.greensAgentReceivedDetails.invoiceDCDate,
          cropGroupCode: this.greensAgentReceivedDetails.cropGroupCode,
          cropNameCode: this.greensAgentReceivedDetails.cropNameCode,
          pSNumber: this.greensAgentReceivedDetails.pSNumber,
          greensAgentDespQty: this.greensAgentReceivedDetails.greensAgentDespQty,
          greensAgentDespCrates: this.greensAgentReceivedDetails.greensAgentDespCrates,
          inwardGatePassNo: this.greensAgentReceivedDetails.inwardGatePassNo,
        });
        this.service.getCropSchemeDetails(this.agentsGreensReceivingWeighmentForm.get('cropNameCode').value).subscribe(res => {
          if (res.IsSucceed) {
            this.cropSchemeList = res.Data;
            this.cropSchemeList.forEach(i => i.isDisabled = false);
            this.greensAgentDespCountWeightDetailsList = this.greensAgentReceivedDetails.greensAgentDespCountWeightDetails;

            this.greensAgentDespCountWeightDetailsList.forEach(x => {
              let greensActualDetail = new GreensAgentGradesActualDetails();
              greensActualDetail.greensAgentGRNNo = x.greensAgentGRNNo;
              greensActualDetail.agentReceivedNo = x.agentCropReceivedNo;
              greensActualDetail.cropNameCode = this.agentsGreensReceivingWeighmentForm.get('cropNameCode').value;
              greensActualDetail.cropSchemeCode = x.cropSchemeCode;
              greensActualDetail.countTotalCrates = 0
              greensActualDetail.countTotalWeight = 0.00
              this.greensAgentGradesActualDetailsList.push(greensActualDetail);
            })
          }
        });
        this.agentsGreensReceivingWeighmentForm.controls.cropNameCode.disable();
        this.disableNextBtn = false;

      }
      else {
        this.alertService.error('Error in fetching Inward details');
      }
    })
  }

  changeOngoingStatus(grnNo) {
    this.service.ChangeOnGoingStatus(grnNo).subscribe(res => {
      if (res.IsSucceed) {
        this.reset();
        this.selectedTab = 'materialDetails';
        this.alertService.success('etails saved Sucessfully');
      }
      else {
        this.alertService.error('Error in saving details');
      }
    });

  }

  save() {
    var agentsGrnRecivWeignment = new GreensAgentReceivedDetails();
    agentsGrnRecivWeignment = this.greensAgentReceivedDetails;
    this.agentsGreensReceivingWeighmentForm.controls.greensAgentGRNNo.enable();
    agentsGrnRecivWeignment.greensAgentGRNNo = this.agentsGreensReceivingWeighmentForm.controls.greensAgentGRNNo.value ? this.agentsGreensReceivingWeighmentForm.controls.greensAgentGRNNo.value : 0;
    this.agentsGreensReceivingWeighmentForm.controls.greensAgentGRNNo.disable();
    agentsGrnRecivWeignment.totalQuantityReceived = this.totlQty;
    agentsGrnRecivWeignment.weightMode = "ManualWeighment";
    agentsGrnRecivWeignment.employeeID = this.employeeId;
    agentsGrnRecivWeignment.greensAgentDespCountWeightDetails = this.greensAgentDespCountWeightDetailsList;
    agentsGrnRecivWeignment.greensAgentActualWeightDetails = this.greensAgentActualWeightDetailsList;
    agentsGrnRecivWeignment.GreensAgentGradesActualDetails = this.greensAgentGradesActualDetailsList;


    this.service.SaveGreensRecvDetails(agentsGrnRecivWeignment).subscribe(res => {
      if (res.IsSucceed) {
        this.greensAgentReceivedDetails = res.Data;
        this.totlQty = this.greensAgentReceivedDetails.totalQuantityReceived;
        this.employeeId = this.greensAgentReceivedDetails.employeeID;
        this.greensAgentDespCountWeightDetailsList = res.Data.greensAgentDespCountWeightDetails;
        this.greensAgentActualWeightDetailsList = res.Data.actualWeightDetails;
        this.greensAgentGradesActualDetailsList = res.Data.actualDetails;
        //this.gridActualWeightDetailList = res.Data.actualDetails;
        this.agentsGreensReceivingWeighmentForm.patchValue({
          greensAgentGRNNo: this.greensAgentReceivedDetails.greensAgentGRNNo,
          orgOfficeNo: this.greensAgentReceivedDetails.orgOfficeNo,
          greensAgentGRNDateTime: this.greensAgentReceivedDetails.greensAgentGRNDateTime,
          agentOrgID: this.greensAgentReceivedDetails.agentOrgID,
          place: (this.supplierInformationDetails.length > 0 ? this.supplierInformationDetails.find(x => x.agentOrgID == this.greensAgentReceivedDetails.agentOrgID).placeName : ""),
          invoiceDCNo: this.greensAgentReceivedDetails.invoiceDCNo,
          invoiceDCDate: this.greensAgentReceivedDetails.invoiceDCDate,
          cropGroupCode: this.greensAgentReceivedDetails.cropGroupCode,
          cropNameCode: this.greensAgentReceivedDetails.cropNameCode,
          pSNumber: this.greensAgentReceivedDetails.pSNumber,
          greensAgentDespQty: this.greensAgentReceivedDetails.greensAgentDespQty,
          greensAgentDespCrates: this.greensAgentReceivedDetails.greensAgentDespCrates,
          inwardGatePassNo: this.greensAgentReceivedDetails.inwardGatePassNo,
        });
        let sum2: number = 0;
        this.greensAgentActualWeightDetailsList.forEach(a => sum2 += Number(a.actualNetWeight));
        this.totlQty = sum2;
      }
      else {
        this.alertService.error('Error in saving details');
      }
    })
  }

  ChangeStatus() {
    this.service.ChangeOnGoingStatus(this.greensAgentReceivedDetails.greensAgentGRNNo).subscribe(res => {
      if (res.IsSucceed) {
        this.reset();
        this.selectedTab = 'materialDetails';
        this.alertService.success('etails saved Sucessfully');
      }
      else {
        this.alertService.error('Error in saving details');
      }
    });
  }
  ThreeDigitDecimalNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,5}\.?\d{0,3}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  OnlyNumber(event) {
    const regex: RegExp = new RegExp(/^\d{0,4}$/g);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    // Allow Backspace, tab, end, and home keys
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = event.target.value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  paginate(e) {
    this.min = (+e.first);
    this.max = (+e.first + +e.rows);
  }
}
