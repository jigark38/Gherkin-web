import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { MatSelect } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication-service';
import { SalaryComputationAndFinalizationService } from './salary-computation-and-finalization.service';
import {
  Department, SubDepartment, Organisation, employeeAttendanceDetails, employeeEPFMaster,
  employeeESIMaster, employeePTMaster, employeeLoanDetails, employeeAttendanceSummaryDetails
} from './salary-computation-and-finalization.model';
import { ModalService } from 'src/app/corecomponents/modal/modal.service';
import { Calendar } from 'primeng/calendar/calendar';
import { timer } from 'rxjs';
import moment from 'moment';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { formatDate } from '@angular/common';
export const MY_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);;
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-salary-computation-and-finalization',
  templateUrl: './salary-computation-and-finalization.component.html',
  styleUrls: ['./salary-computation-and-finalization.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class SalaryComputationAndFinalizationComponent implements OnInit {
  @ViewChild('departmentNameDDL', { static: false }) departmentNameDDL: MatSelect;
  @ViewChild('divisionNameDDL', { static: false }) divisionNameDDL: MatSelect;
  @ViewChild('orgNameDDL', { static: false }) orgNameDDL: MatSelect;
  @ViewChild('MonthYearDDL', { static: false }) MonthYearDDL: MatSelect;
  @ViewChild('dateOfApprove', { static: false }) dateOfApprove: ElementRef;

  SalaryComputationAndFinalizationForm: FormGroup;
  loginEmpDetails: any;
  currentMonthYearList: any[] = [];
  currentMonthYear: string;
  departmentList: Department[] = [];
  divisionList: SubDepartment[] = [];
  organisationList: Organisation[] = [];
  employeeAttendanceDetails: employeeAttendanceDetails[] = [];
  selectedDepartmentCode: string;
  selectedSubDepartmentCode: string;
  selectedOrganisation: number;
  selectedMonth: number;
  selectedEmploymentType: string;
  itemsPerPage: number;
  pageNo: number;
  totalCount: number;
  selectedEmployeeBiometric: string;
  selectedEmployee: any;
  employeeAttendanceDetailsSelected: employeeAttendanceDetails[] = [];
  employeeEPFMaster: employeeEPFMaster = new employeeEPFMaster();
  employeeESIMaster: employeeESIMaster = new employeeESIMaster();
  employeePTMaster: employeePTMaster = new employeePTMaster();
  employeeLoan: employeeLoanDetails[] = [];
  employeeAttendanceDetailsList: employeeAttendanceSummaryDetails[] = [];
  selectedDate: string;
  constructor(
    private authService: AuthenticationService,
    private salaryService: SalaryComputationAndFinalizationService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.selectedSubDepartmentCode = "";
    const emp = this.authService.getUserdetails();
    this.loginEmpDetails = emp;
    this.getOfficeLocationsOrderByName();
    this.getCurrentMonthAndYearFormat();
    this.getDepartment();
    this.createForm();
    this.itemsPerPage = 10;
    this.pageNo = 1;
    this.totalCount = 0;

  }

  createForm() {
    this.SalaryComputationAndFinalizationForm = new FormGroup({
      ApprovedBy: new FormControl('', Validators.required),
      ApprovedDate: new FormControl('', Validators.required),
      Organisation: new FormControl('', Validators.required),
      EmployeeCategory: new FormControl('', Validators.required),
      BiometricFieldStaff: new FormControl('', Validators.required),
      MonthYear: new FormControl('', Validators.required),
      CanteenDeductionAmount: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      OtherDeductoins: new FormControl("Per Day"),
      OtherDeductionAmount: new FormControl(0, [Validators.pattern(/^[0-9]*$/)]),
      Department: new FormControl('', Validators.required),
      Division: new FormControl(''),
      EmployeeName: new FormControl('', Validators.required),
      EmployeeID: new FormControl('', Validators.required),
      LeavesBroughtForward: new FormControl(''),
      DaysThisMonth: new FormControl(0, [Validators.pattern(/^[0-9]{1,6}(\.[0-9]{1,3})?$/)]),
      DaysConsiderThisMonth: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]{1,6}(\.[0-9]{1,3})?$/)]),
      DaysCarryForward: new FormControl(0, [Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,2})?$/)]),
      Loans: new FormControl(0, [Validators.pattern(/^[0-9]*$/)]),
      CanteenDeductions: new FormControl(0, [Validators.pattern(/^[0-9]*$/)]),
      Others: new FormControl(0, [Validators.pattern(/^[0-9]*$/)]),
      TDS: new FormControl(0, [Validators.pattern(/^[0-9]*$/)]),
      NetPayable: new FormControl(0),

    });
    this.SalaryComputationAndFinalizationForm.controls.ApprovedDate.setValue(new Date());
    this.SalaryComputationAndFinalizationForm.controls.ApprovedBy.setValue(this.loginEmpDetails.userName);


  }
  getDepartment() {
    this.salaryService.getDepartment().subscribe(res => {
      try {
        console.log("Department Name", res);
        this.departmentList = res;
      }
      catch (error) {

      }
    });
  }
  getCurrentMonthAndYearFormat() {
    let d = new Date();
    let curr_date = d.getDate();
    let curr_month = d.getMonth();
    let curr_year = d.getFullYear()
    let months = new Array("JANUARY", "FEBRUARY", "MARCH",
      "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER",
      "OCTOBER", "NOVEMBER", "DECEMBER");

    let today = months[curr_month] + "-" + curr_year;
    this.currentMonthYear = today;
    this.selectedMonth = curr_month + 1;

    for (let i = 0; i <= curr_month; i++) {
      let todayDate = months[i] + "-" + curr_year;
      let obj = {
        MonthYear: todayDate,
        MonthValue: i + 1
      }
      this.currentMonthYearList.push(obj);
    }
  }
  clear() {
    this.selectedDepartmentCode = '';
    this.employeeAttendanceDetails = [];
    this.selectedDepartmentCode = "";
    this.selectedSubDepartmentCode = "";
    this.selectedOrganisation = null;
    this.selectedMonth = null;
    this.selectedEmploymentType = null;
    this.selectedEmployeeBiometric = null;
    this.selectedEmployee = null;
    this.selectedDate = null;
  }





  getSubDepartments(departmentCode) {
    try {
      this.salaryService.getSubDepartments(departmentCode).subscribe(res => {
        this.divisionList = res;

      });

    } catch (error) {

    }
  }

  getOfficeLocationsOrderByName() {
    try {
      this.salaryService.getOfficeLocationsOrderByName().subscribe(res => {
        this.organisationList = res;
        console.log(this.divisionList);
      });

    } catch (error) {

    }
  }

  changeDepartment(value) {
    try {
      this.selectedDepartmentCode = value;
      if (value != "All") {
        this.getSubDepartments(this.selectedDepartmentCode);

      }
      console.log("Change Department called");
      this.getEmployeeAttendanceDetails();
    }
    catch (error) {

    }
  }
  changeEmployee(value) {
    this.selectedEmploymentType = value;
  }

  changeOrganisation(value) {
    this.selectedOrganisation = value;
  }

  changeSubDepartment(value) {
    this.selectedSubDepartmentCode = value;
    this.getEmployeeAttendanceDetails();
  }

  changeMonthYear(value) {
    this.selectedMonth = value;
    this.getLastDayOfSelectedMonth();
  }

  changeOtherDeductionType(value) {

  }

  changeBioMetric(value) {
    console.log(value);
    this.selectedEmployeeBiometric = value;
  }

  getEmployeeAttendanceDetails() {

    try {
      var param = {
        orgOfficeNo: this.selectedOrganisation,
        attendanceDate: this.selectedMonth,
        employmentType: this.selectedEmploymentType,
        itemsPerPage: 10,
        pageNo: 1,
        department: this.selectedDepartmentCode,
        division: this.selectedSubDepartmentCode
      };

      if (this.selectedEmploymentType == "Permanent" && this.selectedEmployeeBiometric == "Through Biometric Process") {
        this.salaryService.getEmployeeAttendanceDetails(param).subscribe(res => {

          if (res.IsSucceed == true) {
            console.log("Details", res.Data);
            this.employeeAttendanceDetails = res.Data.employeeAttendanceDetails;
            this.employeeEPFMaster = res.Data.epfDetails;
            this.employeeESIMaster = res.Data.esiRate;
            this.employeePTMaster = res.Data.taxMaster;
            this.employeeLoan = res.Data.loanDetails;
            this.employeeAttendanceDetailsList = res.Data.attendanceSummaryDetails;
            this.totalCount = res.Data.totalCount;
          }
          else {
            this.employeeAttendanceDetails = [];
          }
        });
      }
      else {
        console.log("Other");
      }


    } catch (error) {
      this.employeeAttendanceDetails = [];
    }
  }
  changeDayConsider() {
    try {
      if (this.selectedEmployee != null) {
        let item = this.employeeAttendanceDetails[this.selectedEmployee];
        let noOfDays = this.SalaryComputationAndFinalizationForm.controls.DaysConsiderThisMonth.value;
        this.employeeAttendanceDetails[this.selectedEmployee].daysConsider = noOfDays;

        if (this.employeeAttendanceDetails[this.selectedEmployee].employmentStatusAsOn == 'Permenant') {
          let monthlySalary = (item.employeeBasicSalary * noOfDays) + (item.employeeDA * noOfDays) + (item.employeeCA * noOfDays);
          this.employeeAttendanceDetails[this.selectedEmployee].monthlySalary = monthlySalary;
          this.employeeAttendanceDetails[this.selectedEmployee].grossSalary = monthlySalary + (item.perHourSalary * item.othours);
        }
        else {
          this.employeeAttendanceDetails[this.selectedEmployee].monthlySalary = this.employeeAttendanceDetails[this.selectedEmployee].perDaySalary * noOfDays;
          this.employeeAttendanceDetails[this.selectedEmployee].grossSalary = this.employeeAttendanceDetails[this.selectedEmployee].monthlySalary + (item.perHourSalary * item.othours);
        }


        this.employeeAttendanceDetails[this.selectedEmployee].leavesCF = this.employeeAttendanceDetails[this.selectedEmployee].attendanceDaysCount + this.employeeAttendanceDetails[this.selectedEmployee].noOfDaysCarryForward - noOfDays;
        this.NetPaymentCalculations();
        this.NetPayableChange();
      }
    }
    catch (error) {

    }

  }
  ontableItemSelect(item, index) {
    this.selectedEmployee = index;
    this.SalaryComputationAndFinalizationForm.controls.EmployeeName.setValue(item.employeeName);
    this.SalaryComputationAndFinalizationForm.controls.EmployeeID.setValue(item.employeeIDString);
    let loanamount = this.findLoanAmount(this.employeeAttendanceDetails[this.selectedEmployee].employeeID, this.selectedOrganisation);
    this.SalaryComputationAndFinalizationForm.controls.Loans.setValue(loanamount);
    this.employeeAttendanceDetails[this.selectedEmployee].loans = loanamount;
    this.SalaryComputationAndFinalizationForm.controls.DaysConsiderThisMonth.setValue(0);
    this.employeeAttendanceDetails[this.selectedEmployee].selected = true;
  }

  findNoOfDaysBroughtForward(index) {
    for (let i = 0; i < this.employeeAttendanceDetailsList.length; i++) {
      if (this.employeeAttendanceDetailsList[i].employeeID == this.employeeAttendanceDetails[index].employeeIDString) {
        this.employeeAttendanceDetails[this.selectedEmployee].leavesBF = this.employeeAttendanceDetailsList[i].noofDaysCarryForward;
      }
      else {

      }
    }
  }

  findLoanAmount(employeeID, officeNo) {
    let loanAmount = 0;
    for (let i = 0; i < this.employeeLoan.length; i++) {
      if (this.employeeLoan[i].EmployeeID == employeeID && this.employeeLoan[i].OfficeNo== officeNo) {
        loanAmount = this.employeeLoan[i].LoanAmount;
        return loanAmount;
      }
    }
    return 0;
  }

  changeLoan() {
    try {
      if (this.selectedEmployee != null) {
        let loanAmount = this.SalaryComputationAndFinalizationForm.controls.Loans.value;
        this.employeeAttendanceDetails[this.selectedEmployee].loans = loanAmount;
        this.NetPaymentCalculations();
      }
    }
    catch (error) {

    }
  }
  changeCanteenAmount() {
    try {
      if (this.selectedEmployee != null) {
        let canteenAmount = this.SalaryComputationAndFinalizationForm.controls.CanteenDeductions.value;
        this.employeeAttendanceDetails[this.selectedEmployee].canteen = canteenAmount;
        this.NetPaymentCalculations();
      }
    }
    catch (error) {

    }
  }

  changeTDS() {
    try {
      if (this.selectedEmployee != null) {
        let tdsAmount = this.SalaryComputationAndFinalizationForm.controls.TDS.value;
        this.employeeAttendanceDetails[this.selectedEmployee].tDS = tdsAmount;
        this.NetPaymentCalculations();
      }
    }
    catch (error) {

    }
  }

  changeOthers() {
    try {
      if (this.selectedEmployee != null) {
        let othersAmount = this.SalaryComputationAndFinalizationForm.controls.Others.value;
        this.employeeAttendanceDetails[this.selectedEmployee].others = othersAmount;
        this.NetPaymentCalculations();
      }
    }
    catch (error) {

    }
  }

  NetPaymentCalculations() {

    try {
      if (this.selectedEmployee != null) {
        let grossSalary = this.employeeAttendanceDetails[this.selectedEmployee].grossSalary;
        let pf = this.employeeAttendanceDetails[this.selectedEmployee].pFDed;
        let esi = this.employeeAttendanceDetails[this.selectedEmployee].eSIDed;
        let pt = this.employeeAttendanceDetails[this.selectedEmployee].pTDed;
        let loans = this.employeeAttendanceDetails[this.selectedEmployee].loans;
        let canteen = this.employeeAttendanceDetails[this.selectedEmployee].canteen;
        let others = this.employeeAttendanceDetails[this.selectedEmployee].others;
        let tds = this.employeeAttendanceDetails[this.selectedEmployee].tDS;

        let netPay = grossSalary - (pf + esi + pt + loans + canteen + others + tds);
        this.employeeAttendanceDetails[this.selectedEmployee].netPayable = netPay;
        this.SalaryComputationAndFinalizationForm.controls.NetPayable.setValue(netPay.toFixed(2));
      }
    }
    catch (error) {

    }
  }

  getLastDayOfSelectedMonth() {
    let selectedMonth = this.SalaryComputationAndFinalizationForm.controls.MonthYear.value;
    var today = new Date();
    let d = new Date(today.getFullYear(), selectedMonth, 0);
    let formattedDate = this.formatDate(d);
    this.selectedDate = formattedDate;
    //console.log("last Date of selected month ", formattedDate); 
  }

  formatDate(date) {
    if (date.getMonth() <= 9) {
      return date.getDate() + "-0" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }
    else {
      return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }

  }

  NetPayableChange() {
    //console.log("Change in net payable");
    this.calculateESI();
    this.calculateEPF();
    this.calculatePT();
  }

  calculateEPF() {
    try {
      if (this.selectedEmployee != null) {
        if (this.employeeEPFMaster != null && this.employeeAttendanceDetails[this.selectedEmployee].employmentStatusAsOn == 'Permanent') {
          let basicSal = this.employeeAttendanceDetails[this.selectedEmployee].employeeBasicSalary;
          let noOfConsiderThisMonth = this.employeeAttendanceDetails[this.selectedEmployee].daysConsider;
          let empDA = this.employeeAttendanceDetails[this.selectedEmployee].employeeDA;
          let epfAmount = (((basicSal / 30) * noOfConsiderThisMonth) + ((empDA * noOfConsiderThisMonth) * this.employeeEPFMaster.pfEmployeeContribution))/100;
          this.employeeAttendanceDetails[this.selectedEmployee].pFDed = epfAmount;
        }
        else {
          this.employeeAttendanceDetails[this.selectedEmployee].pFDed = 0;
        }
      }
    }
    catch (error) {

    }
  }

  calculateESI() {
    try {
      if (this.selectedEmployee != null) {
        if (this.employeeESIMaster != null && this.employeeAttendanceDetails[this.selectedEmployee].employmentStatusAsOn=='Permanent') {
          let totalSalary = this.employeeAttendanceDetails[this.selectedEmployee].grossSalary;
          if (totalSalary < this.employeeESIMaster.esiMaxLimit) {
            let esiAmount = ((totalSalary * this.employeeESIMaster.esiEmployeeCount) / 100);
            this.employeeAttendanceDetails[this.selectedEmployee].eSIDed = esiAmount;
          }
          else {
            this.employeeAttendanceDetails[this.selectedEmployee].eSIDed = 0;
          }
        }
      }
    }
    catch(error)
    {

    }
  }
  calculatePT() {
    try {
      if (this.selectedEmployee != null) {
        if (this.employeePTMaster != null && this.employeeAttendanceDetails[this.selectedEmployee].employmentStatusAsOn == 'Permanent') {
          let totalSalary = this.employeeAttendanceDetails[this.selectedEmployee].grossSalary;
          if (totalSalary > this.employeePTMaster.PTSalaryFrom && totalSalary < this.employeePTMaster.PTSalaryTo) {
            this.employeeAttendanceDetails[this.selectedEmployee].pTDed = this.employeePTMaster.PTEmployeesAmountPayable;
          }
          else {
            this.employeeAttendanceDetails[this.selectedEmployee].pTDed = 0;
          }
        }
        else {
          this.employeeAttendanceDetails[this.selectedEmployee].pTDed = 0;
        }
      }
    }
    catch (error) {

    }
  }

  saveAttendanceDetails() {
    try {
      var today = new Date();
      let saveattendanceRecords = [];
      for (let i = 0; i < this.employeeAttendanceDetails.length; i++) {
        if (this.employeeAttendanceDetails[i].selected == true) {

          let MonthlyEmployeesSalariesFinalizationParam = {
            salaryAttendanceProcessID: 0,
            loginEmployeeID: this.loginEmpDetails.employeeId,
            salaryApprovalDate: new Date(this.SalaryComputationAndFinalizationForm.controls.ApprovedDate.value),
            orgofficeNo: this.selectedOrganisation,
            salaryMonthYear: new Date(today.getFullYear(), this.SalaryComputationAndFinalizationForm.controls.MonthYear.value, 0),
            deductionCanteenperday: this.employeeAttendanceDetails[i].canteen,
            otherDeductionsType: this.SalaryComputationAndFinalizationForm.controls.OtherDeductoins.value,
            otherDeductionsAmount: this.employeeAttendanceDetails[i].others,
            employeeID: this.employeeAttendanceDetails[i].employeeIDString,
            totalAttendedNoofDays: this.employeeAttendanceDetails[i].attendanceDaysCount,
            noofDaysConsiderThisMonth: this.employeeAttendanceDetails[i].daysConsider,
            noofDaysCarryForward: this.employeeAttendanceDetails[i].noOfDaysCarryForward,
            loanDeductionAmount: this.employeeAttendanceDetails[i].loans,
            canteenDeductionAmount: this.employeeAttendanceDetails[i].canteen,
            othersDeductionAmount: this.employeeAttendanceDetails[i].others,
            tDSDeductionAmount: this.employeeAttendanceDetails[i].tDS,
            employeePFContribution: 0,
            employeeESIContribution: 0,
            employeePTContribution: 0,
            netSalaryPayable: this.employeeAttendanceDetails[i].netPayable
          };
          let MonthlyEmployerContributionsparam = {
            employeeID: this.employeeAttendanceDetails[i].employeeIDString,
            emprContributionsID: 0,
            employerPFContribution: 0.0,
            employerESIContribution: 0.0,
            salaryAttendanceProcessID: 0
          };

          let AttendanceSummaryDetailsParam = {
            attendConfirmationNo: 0,
            employeeID: this.employeeAttendanceDetails[i].employeeIDString,
            monthYear: this.selectedDate,
            totalAttendedNoofDays: 0.0,
            noofDaysConsiderThisMonth: 0.0,
            noofDaysCarryForward: 0.0
          };

          let param = {
            monthlyEmployeesSalariesFinalization: MonthlyEmployeesSalariesFinalizationParam,
            monthlyEmployerContributions: MonthlyEmployerContributionsparam,
            attendanceSummaryDetails: AttendanceSummaryDetailsParam
          };
          saveattendanceRecords.push(param);
        }

      }
      console.log("Save Details ", saveattendanceRecords);
      if (saveattendanceRecords.length != 0) {
        let param = {
          attendanceSalaryDetails: saveattendanceRecords
        };
        this.salaryService.saveSalaryCalulation(param).subscribe(res => {
          if (res.IsSucceed == true) {
            this.alertService.success('Salary saved successfully.');
            this.clear();
            this.createForm();
          }
          else {

          }
        });
      }
    }
    catch (error) {
      console.log("Error while saving", error);
    }
  }

}
