export const menuItems: any[] = [
  {
    id: '1_0_0',
    label: 'Organisation Management',
    icon: 'pi pi-pw pi-sitemap',
    routerLink: 'org/organisation-details'
  },
  {
    id: '2_0_0',
    label: 'Administration & Users',
    items: [
      {
        label: 'Master', icon: 'fa fa-table font-i', items: [
          {
            label: 'User Permissions',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/user-permission'
          }]
      }]
  },
  {
    id: '3_0_0',
    label: 'Human Resource Management',
    items: [
      {
        id: '3_1_0', label: 'Master', icon: 'fa fa-table font-i',
        items: [
          {
            id: '3_1_1',
            label: 'Employee Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/employee-information-details'
          },
          {
            id: '3_1_2',
            label: 'Experience Details',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_3',
            label: 'Salary And CTC Approval',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_4',
            label: 'Salary Deductions',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_5',
            label: 'Loans & Advances',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/loans-advances-details'
          },
          {
            id: '3_1_6',
            label: 'ESIC Rates',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/esicrates-details'
          },
          {
            id: '3_1_7',
            label: 'Provident Fund Rates',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/provident-fund-rates'
          },
          {
            id: '3_1_8',
            label: 'Professional Tax Rates',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/professional-tax-rates'
          },
          {
            id: '3_1_9',
            label: 'TDS Calculations',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_10',
            label: 'IT rebate Details',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_11',
            label: 'Bonus Calculations',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_12',
            label: 'Shift Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/shift-details',
          },
          {
            id: '3_1_13',
            label: 'Employee Transfer',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_14',
            label: 'Bank Details',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_15',
            label: 'Statuary Holiday Master',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_1_16',
            label: 'Employee Bank Account Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/employee-bank-account-details',
          },
          {
            id: '3_1_17',
            label: 'Yearly Holidays List',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/yearly-holidays-list',
          },
        ]
      },
      {
        id: '3_2_0', label: 'Transactions', icon: 'fa fa-edit font-i',
        items: [
          {
            id: '3_2_1',
            label: 'Shift Management',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/shift-details',
          },
          {
            id: '3_2_2',
            label: 'Manual Attendance',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/manual-attendence',
          },
          {
            id: '3_2_3',
            label: 'Leave Request - Employee',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_4',
            label: 'Leave Process - Manager',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_18',
            label: 'Attendance Punch Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/attendance-punch-details',
          },
          {
            id: '3_2_5',
            label: 'Attendance Finalization',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/daywise-attendance-finalization',
          },
          {
            id: '3_2_6',
            label: 'Loan & Adavance Approvals',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_7',
            label: 'Deductions Adjustment',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_8',
            label: 'Salary Computation & Finalization (Days/Monthly)',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'hrm/salary-computation-and-finalization'
          },
          {
            id: '3_2_9',
            label: 'Appraisal Process(180/ 360 Degrees)',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_10',
            label: 'Salary Increment',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_11',
            label: 'Incentives',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_12',
            label: 'PF Return',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_13',
            label: 'ESIC Return',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_14',
            label: 'Professional Tax Return',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_15',
            label: 'TDS Computation',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_16',
            label: 'TDS Return',
            icon: 'fa fa-arrow-circle-right font-i',
          },
          {
            id: '3_2_17',
            label: 'Bonus Approval',
            icon: 'fa fa-arrow-circle-right font-i',
          }


        ]
      },
      {
        id: '3_3_0', label: 'Reports',
        icon: 'fa fa-book font-i',
        items: [
          { id: '3_3_1', label: 'Department Designation', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_2', label: 'Employee Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_3', label: 'Employee Information', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_4', label: 'Salary Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_5', label: 'Deduction Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_6', label: 'Attendance Register', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'report/daily-attendance-report' },
          { id: '3_3_7', label: 'Leave Application', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_8', label: 'Leave Register', icon: 'fa fa-arrow-circle-right font-i' },
          {
            id: '3_3_9',
            label: 'Salary Register',
            items: [
              {
                id: '3_2_1',
                label: 'Monthly Attedance Report',
                icon: 'fa fa-arrow-circle-right font-i',
                routerLink: 'report/monthly-attendance-report',
              },]

          },
          { id: '3_3_10', label: 'Summary Wage Register (Days / Monthly)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_11', label: 'Employee Wise Salary details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_12', label: 'ESIC Reports', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_13', label: 'Statuary Rates', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_14', label: 'ESI Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_15', label: 'ESI Deduction Summary', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_16', label: 'PF Reports', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_17', label: 'Statuary Rates', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_18', label: 'PF Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_19', label: 'Consolidated PF Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_20', label: 'Employee Wise Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_21', label: 'PT Reports', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_22', label: 'Statuary Rates', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_23', label: 'PT Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_24', label: 'Employee Wise Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_25', label: 'Leave Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_26', label: 'Leave Status', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_27', label: 'Salary Increment', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_28', label: 'Employee Wise History', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_29', label: 'Approvals (180/ 360 Degree)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_30', label: 'Department employee Wise Salary', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_31', label: 'Income Tax Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_32', label: 'IT Rates', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_33', label: 'IT Deductions(TDS)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_34', label: 'TDS Return', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_35', label: 'TDS Return', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_36', label: 'Holiday List Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_37', label: 'Bank Account Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '3_3_38', label: 'Loans & Advances', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      },
    ]
  },
  {
    id: '4_0_0',
    label: 'Agri Management',
    items: [
      {
        id: '4_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          {
            id: '4_1_1',
            label: 'Area & Villages',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/centre-areasand-villages'
          },
          {
            id: '4_1_2',
            label: 'Field Staff',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/fieldstaffdetails'
          },
          {
            id: '4_1_3',
            label: 'Crops & Schemes',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/cropsandschemes'
          },
          {
            id: '4_1_4',
            label: 'Farmers Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/farmer-details'
          },
          {
            id: '4_1_5',
            label: 'Crop Rates',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/crop-rate'
          },
          {
            id: '4_1_6',
            label: 'Harvesting Stages',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/harvest-stage-details'
          },
          {
            id: '4_1_7',
            label: 'Package of Practice',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/package-of-practice'
          },

          {
            id: '4_1_8',
            label: 'Farmers Input Rates Season Wise',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/farmers-input-rates-seasonwise-component'
          },
          {
            id: '4_1_9',
            label: 'Buying Staff Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/buying-staff-details'
          },
        ]
      },
      {
        id: '4_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          {
            id: '4_2_1',
            label: 'Farmers Agreement',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/farmers-agreement'
          },
          {
            id: '4_2_2',
            label: 'Plantations Scheduling',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/plantation-scheduling'
          },
          {
            id: '4_2_3',
            label: 'Feed & Inputs Transfer',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/inputs-transfer-details'
          },
          {
            id: '4_2_4',
            label: 'Area / Branch Materials Receiving Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/area-branch-material-receiving-details'
          },
          {
            id: '4_2_5',
            label: 'Inputs Issued to Field Staff',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/inputs-issuedto-field-staff'
          },
          {
            id: '4_2_6',
            label: 'Material / Inputs Issue to Farmer',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/material-input-issue-to-farmer'
          },
          {
            id: '4_2_7',
            label: 'Sowing & Farming Details',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/sowing-farmer-details'
          },
          {
            id: '4_2_8',
            label: 'Greens Transport Vehicle Schedule',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/greens-transport-vehicle-schedule'
          },

          {
            id: '4_2_9',
            label: 'Daily Greens Receiving Details',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: 'agri/daily-greens-receiving-details'
          },
          {
            id: '4_2_10',
            label: 'GRN & Material Classification',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: 'agri/buying-material-details'
          },
          {
            id: '4_2_17',
            label: 'Farmer Account Details & Finalization',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: 'agri/farmer-account-details-finalization'
          },
          {
            id: '4_2_11',
            label: 'Inputs Returns from Farmers',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: 'agri/inputs-returns-from-farmers'
          },
          {
            id: '4_2_12',
            label: 'Amount Advances to Farmers',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'agri/amount-advances-to-farmers'
          },
          {
            id: '4_2_13',
            label: 'Farmers Input Bill Finalization',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: ''
          },
          {
            id: '4_2_14',
            label: 'Farmers Agreement Renewal',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: ''
          },
          {
            id: '4_2_15',
            label: 'Input Invoice',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: ''
          },
          {
            id: '4_2_16',
            label: 'Debit / Credit Note',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: ''
          },
        ]
      },
      {
        id: '4_3_0',
        label: 'Reports',
        icon: 'fa fa-book font-i',
        items: [
          { id: '4_3_1', label: 'Daily Greens Receiving Report', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'report/daily-greens-receiving-report' },
          { id: '4_3_2', label: 'Input Material Consumption Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_3', label: 'Farmer wise Harvesting Report', icon: 'fa fa-arrow-circle-right font-i' },
          {
            id: '4_3_4',
            label: 'Greens Received Summary Report',
            icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'report/green-received-summary-report'
          },
          { id: '4_3_5', label: 'Feed & Input Transfers Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_6', label: 'Feed & Input Returns Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_7', label: 'Harvesting Analysis Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_8', label: 'Area wise Analysis Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_9', label: 'Village wise Analysis Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_10', label: 'Sowing List Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_11', label: 'Crop Input Saels (Materials / Rate wise)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_12', label: 'Outward Supplies Details Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_13', label: 'GST Issue Statement', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_14', label: 'GST Return Statement', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '4_3_15', label: 'Package of Practice Report', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      }
    ]
  },
  {
    id: '5_0_0',
    label: 'Purchase Management',
    items: [
      {
        id: '5_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          {
            id: '5_1_1',
            label: 'Raw Material Details', icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/raw-material-master'
          },
          {
            id: '5_1_3',
            label: 'Suppliers Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/suppliers-details'
          },
          {
            id: '5_1_2',
            label: 'Raw Material Stock',
            icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/raw-material-stocks'
          },
          {
            id: '5_1_4',
            label: 'Raw Material Branch Stocks', icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/raw-material-branch-stocks'
          },
          {
            id: '5_1_5',
            label: 'Greens Agent Supplier Details', icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/greens-agent-supplier-details'
          },
        ]
      },
      {
        id: '5_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          { id: '5_2_1', label: 'Quotation Received', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '5_2_2', label: 'Purchase Order', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/purchase-order' },
          { id: '5_2_3', label: 'Inward & Gate Pass', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/inward-gate-pass' },
          { id: '5_2_4', label: 'Goods Receipt Note', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/goods-receipt-note' },
          // tslint:disable-next-line: max-line-length
          { id: '5_2_5', label: 'Purchase Return', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/purchase-return' },
          { id: '5_2_7', label: 'Indent Request', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/indent-material' },
          { id: '5_2_6', label: 'Material Transfer to Area Office & OGP', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/mat-tran-to-area-office-ogp' }
        ]
      },
      {
        id: '5_3_0',
        label: 'Reports',
        icon: 'fa fa-book font-i',
        items: [
          { id: '5_3_1', label: 'Purchase Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '5_3_2', label: 'Materials Stock Report', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'report/materials-stock-report' },
          { id: '5_3_3', label: 'Daily Greens Inward Report', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/daily-greens-inward-report' }
        ]
      }
    ]
  },
  {
    id: '6_0_0',
    label: 'Production Process Filling & Ware House Division',
    items: [
      {
        id: '6_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          {
            id: '6_1_1', label: 'Product Grade Details', icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/product-grade-details'
          },
          { id: '6_1_2', label: 'Production Process & BOM Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/production-process-bom-details' },
          { id: '6_1_3', label: 'Finished / Semifinished Opening Stocks', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/finished-semifinished-opening-stocks' }
        ]
      },
      {
        id: '6_2_0',
        label: 'Transactions',
        icon: 'fa fa-book font-i',
        items: [
          { id: '6_2_1', label: 'Harvest GRN Receiving & Weighment', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/harvest-grn-receiving-weightment' },
          { id: '6_2_2', label: 'Green Receipt & Quality Testing', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/green-receipt-quality-testing' },
          { id: '6_2_3', label: 'Grading & Weighment Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/grading-weightment-details' },
          { id: '6_2_4', label: 'Production Schedule Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/production-schedule-details' },
          { id: '6_2_5', label: 'Batch Production Preparation Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/batch-prod-prep-det' },
          { id: '6_2_6', label: 'Culling & Pack Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/culling-pack-details' },
          { id: '6_2_7', label: 'Media Batch Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/media-batch-details' },
          { id: '6_2_8', label: 'Media Filling & Stocking' },
          { id: '6_2_9', label: 'Media Topping' },
          { id: '6_2_10', label: 'Agents Greens Receiving & Weighment', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/agents-greens-receiving-weighment' },
        ]
      },
      {
        id: '6_3_0',
        label: 'Reports',
        icon: 'fa fa-book font-i',
        items: [
          { id: '6_3_1', label: 'Daily Greens Inward Report', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'report/daily-greens-inward-report' },
          { id: '6_3_1', label: 'GRN & Clasification Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '6_3_2', label: 'Green Receipts Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '6_3_3', label: 'Grading Weighment Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '6_3_5', label: 'Culling Weighment Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '6_3_4', label: 'Batch Process Report', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      },
    ]
  },
  {
    id: '7_0_0',
    label: 'Sales & CRM',
    items: [
      {
        id: '7_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          { id: '7_1_1', label: 'Currency', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_1_2', label: 'Consignee & Buyers Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/consignee-buyers' },
        ]
      },
      {
        id: '7_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          { id: '7_2_1', label: 'Sales Enquiry', icon: 'fa fa-arrow-circle-right font-i' },
          // tslint:disable-next-line: max-line-length
          { id: '7_2_2', label: 'Proforma Invoice', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/proforma-invoice' },
          { id: '7_2_3', label: 'Packing Material Status & Indent', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_4', label: 'Re Packing Schedule', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_5', label: 'Container Booking & Schedule', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_6', label: 'QC Analysis Intimation', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_7', label: 'Customs Invoice', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_8', label: 'Bill of Lading ', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_9', label: 'Shipment Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_10', label: 'Orders Tracking', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_11', label: 'Packing Material Indent', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_2_12', label: 'Agent Expenses', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      },
      {
        id: '7_3_0',
        label: 'Reports',
        icon: 'fa fa-book font-i',
        items: [
          { id: '7_3_1', label: 'Enquiry Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_2', label: 'Proforma Invoice Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_3', label: 'Orders Status', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_4', label: 'Order Schedules Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_5', label: 'Despatch Schedule Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_6', label: 'Invoice Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_7', label: 'Invoice Sales Documents', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_8', label: 'Sales Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_9', label: 'Pending Order Register', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_10', label: 'Debtors Outstanding', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_11', label: 'Agent Expenses Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '7_3_12', label: 'Port wise Shipment Report', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      }
    ]
  },
  {
    id: '8_0_0',
    label: 'Quality Control Management',
    items: [
      {
        id: '8_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          { id: '8_1_1', label: 'Tests Methods', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      },
      {
        id: '8_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          { id: '8_2_1', label: 'In House Sample Analysis', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '8_2_2', label: 'Outside Sample Report Details', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      }
    ]
  },
  {
    id: '9_0_0',
    label: 'Packing & General Material Management',
    items: [
      {
        id: '9_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          { id: '9_1_1', label: 'Stores Master Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/stores-master-details' },
          { id: '9_1_2', label: 'Packing Material', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_1_3', label: 'Packing Stock Details', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_1_4', label: 'Packing Material (BOM)', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      },
      {
        id: '9_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          { id: '9_2_1', label: 'Stores Quotation Received', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_2', label: 'Purchase Order', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_3', label: 'Stores GRN', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_4', label: 'Customers Packing Material GRN', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_5', label: 'Stores Consumption & Issues', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_6', label: 'Stores Purchase Return', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_7', label: 'Material Indent by Stores to PD', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_8', label: 'Service Work Order', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_9', label: 'Job Work Issues (Returnable)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_10', label: 'Job Work Material Receipt (Returnable)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_11', label: 'Assets - Repairs Issued (Returnable)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_12', label: 'Assets - Repairs Received', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_2_13', label: 'Material Issued - Non Returnable', icon: 'fa fa-arrow-circle-right font-i' },

        ]
      },
      {
        id: '9_3_0',
        label: 'Reports',
        icon: 'fa fa-book font-i',
        items: [
          { id: '9_3_1', label: 'Indent Received Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_2', label: 'Quotation Received Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_3', label: 'Stores Purchase Order Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_4', label: 'Stores Purchase Order Pending Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_5', label: 'Stores GRN Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_6', label: 'Stores Consumption Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_7', label: 'Stores Purchase Return Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_8', label: 'Material Indent to PD Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_9', label: 'Job Work Issued & Received (Returnable)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_10', label: 'Stock Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_11', label: 'Job Work Material Receipt (Returnable)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_12', label: 'Stock Statement (Customers)', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_13', label: 'Non Returnble Goods Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_14', label: 'Outward Gate Pass Report', icon: 'fa fa-arrow-circle-right font-i' },
          { id: '9_3_15', label: 'Material Index', icon: 'fa fa-arrow-circle-right font-i' },
        ]
      }
    ]
  },
  {
    id: '10_0_0',
    label: 'Accounts & Finance Management',
    icon: 'pi pi-pw pi-sitemap',
    items: [

      {
        id: '10_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          {
            id: '10_1_1',
            label: 'Account Master', icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/account-master'
          },
          {
            id: '10_1_2',
            label: 'Bank Account Details', icon: 'fa fa-arrow-circle-right font-i',
            routerLink: 'secure/bank-account-details'
          },
        ]
      },
      {
        id: '10_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          { id: '10_2_1', label: 'Sample', icon: 'fa fa-arrow-circle-right font-i' }
        ]
      }
    ]
  },
  {
    id: '11_0_0',
    label: 'Transport & Vehicle Management',
    items: [
      {
        id: '11_1_0',
        label: 'Master',
        icon: 'fa fa-table font-i',
        items: [
          // tslint:disable-next-line: max-line-length
          { id: '11_1_1', label: 'Own Vehicle Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/own-vehicle-details' },
          // tslint:disable-next-line: max-line-length
          { id: '11_1_2', label: 'Hire Vehicle Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/hired-vehicle-details' },
          { id: '11_1_3', label: 'Driver Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/driver-details' },
        ]
      },
      {
        id: '11_2_0',
        label: 'Transactions',
        icon: 'fa fa-edit font-i',
        items: [
          { id: '11_2_1', label: 'Greens Transport Vehicle Schedule', icon: 'fa fa-arrow-circle-right font-i', routerLink: '' },
        ]
      }
    ]
  },
  {
    id: '12_0_0',
    label: ' Management Information Systems',
    icon: 'pi pi-pw pi-sitemap',
  },
  {
    id: '13_0_0',
    label: 'User Manual & Help',
    icon: 'pi pi-pw pi-sitemap',
  }
  // {
  //     id: '13_0_0',
  //     label: 'Temporary Path(To be changed once decided)',
  //     icon: 'pi pi-pw pi-sitemap',
  // items: [
  // tslint:disable-next-line: max-line-length
  // { label: 'Area / Branch Materials Receiving Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/area-branch-material-receiving-details' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Material / Inputs Issue to Farmer', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/material-input-issue-to-farmer' },
  // { label: 'Sowing & Farming Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/sowing-farmer-details' },
  // tslint:disable-next-line: max-line-length
  // { label: 'GRN & Material Classification', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/buying-material-details' },
  // { label: 'Daily Harvest Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/daily-harvest-details' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Harvest GRN Receiving & Weighment', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/harvest-grn-receiving-weightment' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Green Receipt & Quality Testing', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/green-receipt-quality-testing' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Grading & Weighment Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/grading-weightment-details' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Production Process & BOM Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/production-process-bom-details' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Production Schedule Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/production-schedule-details' },
  // tslint:disable-next-line: max-line-length
  // { label: 'Batch Production Preparation Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/batch-prod-prep-det' },
  // { label: 'Media Batch Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/media-batch-details' },
  // { label: 'Culling & Pack Details', icon: 'fa fa-arrow-circle-right font-i', routerLink: 'secure/culling-pack-details' },
  // { label: '', icon: 'fa fa-arrow-circle-right font-i', routerLink: '' },
  // { label: '', icon: 'fa fa-arrow-circle-right font-i', routerLink: '' },
  // { label: '', icon: 'fa fa-arrow-circle-right font-i', routerLink: '' },
  // { label: '', icon: 'fa fa-arrow-circle-right font-i', routerLink: '' },
  // { label: '', icon: 'fa fa-arrow-circle-right font-i', routerLink: '' },
  // ]
  // }
];


export const accesibleItems: any[] = [
  {
    id: '1_0_0',
    moduleName: 'Organisation Management',
    moduleShortCut: 'OCR',
    Children: [
      {
        id: '1_0_0',
        moduleName: 'Organisation Management',
        moduleShortCut: 'OCR'
      },
      {
        id: '1_0_0',
        moduleName: 'Organisation Management',
        moduleShortCut: 'OCR'
      }
    ]
  },
  {
    id: '3_1_0',
    moduleName: 'HRM Masters',
    moduleShortCut: 'HRM-M',
    Children: [
      {
        id: '3_1_1',
        moduleName: 'Employee Details',
        moduleShortCut: 'HRM-M-EMPD'
      },
      {
        id: '3_1_2',
        moduleName: 'Experience Details',
        moduleShortCut: 'HRM-M-ED'
      },
      {
        id: '3_1_3',
        moduleName: 'Salary And CTC Approval',
        moduleShortCut: 'HRM-M-SCTC'
      }
    ]
  }
];
