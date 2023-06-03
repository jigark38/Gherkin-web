import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountMasterService } from 'src/app/shared/services/account-master.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { AccountMaster, AccountsGroup } from 'src/app/shared/models/account-master.model';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


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



/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
// interface FoodNode {
//   name: string;
//   children?: FoodNode[];
//   length: 0;
// }

const TREE_DATA: AccountsGroup[] = [
];

@Component({
  selector: 'app-account-master',
  templateUrl: './account-master.component.html',
  styleUrls: ['./account-master.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]


})


export class AccountMasterComponent implements OnInit {

  organisationList: any[] = [];
  groupList: AccountsGroup[] = [];
  newGroupOrAcc: AccountsGroup;
  isNewGroup = true;
  isFindEnabled = false;
  accountMaster: AccountMaster;
  accountHeadList = [
    { AccHeadCode: 'M01', HeadName: 'Sources of Funds' },
    { AccHeadCode: 'M02', HeadName: 'Application of Funds' },
    { AccHeadCode: 'M03', HeadName: 'Income' },
    { AccHeadCode: 'M04', HeadName: 'Expenditure' }

  ];

  @ViewChild('form', { static: false }) ngForm: NgForm;
  @ViewChild('OrgCode', { read: ElementRef, static: false }) OrgCode: any;
  @ViewChild('AccountName', { read: ElementRef, static: false }) AccountName: ElementRef;
  @ViewChild('SubGroupName', { read: ElementRef, static: false }) SubGroupName: ElementRef;


  treeControl = new NestedTreeControl<AccountsGroup>(node => node.children);
  dataSource = new MatTreeNestedDataSource<AccountsGroup>();


  hasChild = (_: number, node: AccountsGroup) => !!node.children && node.children.length > 0;



  constructor(private accountMasterService: AccountMasterService, private alertService: AlertService) {
    this.dataSource.data = TREE_DATA;
    this.accountMaster = new AccountMaster();
    this.newGroupOrAcc = new AccountsGroup();


    this.groupList = [

      {
        HeadCode: 'M01', OrgCode: null, MainGroupCode: null, AccountOrGroupCode: 'M01', AccountOrGroupName: 'Sources of Funds',
        ParentGroupCode: null, IsAccount: false
      },
      {
        HeadCode: 'M02', OrgCode: null, MainGroupCode: null, AccountOrGroupCode: 'M02', AccountOrGroupName: 'Application of Funds',
        ParentGroupCode: null, IsAccount: false
      },
      {
        HeadCode: 'M03', OrgCode: null, MainGroupCode: null, AccountOrGroupCode: 'M03', AccountOrGroupName: 'Income', ParentGroupCode: null,
        IsAccount: false
      },
      {
        HeadCode: 'M04', OrgCode: null, MainGroupCode: null, AccountOrGroupCode: 'M04', AccountOrGroupName: 'Expenditure',
        ParentGroupCode: null, IsAccount: false
      },

      // {
      //   HeadCode: 'M01', MainGroupCode: null, AccountOrGroupCode: '01', AccountOrGroupName: '2 - wheeler', ParentGroupCode: 'M01',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M01', MainGroupCode: null, AccountOrGroupCode: '02', AccountOrGroupName: '4 - wheeler', ParentGroupCode: 'M01',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M01', MainGroupCode: '01', AccountOrGroupCode: '0101', AccountOrGroupName: 'Audi', ParentGroupCode: '01',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M01', MainGroupCode: '01', AccountOrGroupCode: '010202', AccountOrGroupName: 'Aston Martin', ParentGroupCode: '0101',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M03', MainGroupCode: null, AccountOrGroupCode: '03', AccountOrGroupName: 'Trucks', ParentGroupCode: 'M03',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M03', MainGroupCode: '03', AccountOrGroupCode: '0301', AccountOrGroupName: 'Carriers', ParentGroupCode: '03',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M03', MainGroupCode: '03', AccountOrGroupCode: '030101', AccountOrGroupName: 'Ashok Leyland', ParentGroupCode: '0301',
      //   IsAccount: false
      // },
      // {
      //   HeadCode: 'M01', MainGroupCode: '01', AccountOrGroupCode: 'A_101', AccountOrGroupName: 'Account', ParentGroupCode: '01',
      //   IsAccount: true
      // },
    ];
  }

  ngOnInit() {

    try {
      this.accountMasterService.getOrganisation().subscribe(res => {
        console.log('Organisation details', res);
        this.organisationList = res;
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching organisation details');
      });

      this.getGroupsAndAccounts();

    } catch (err) {
      console.log('Error in NgOninit', err);
    }




  }

  getGroupsAndAccounts() {

    try {


      this.accountMasterService.getGroupList().subscribe(res => {
        for (const group of res) {
          this.groupList.push(group);
        }
        console.log('My GroupList', this.groupList);
        this.dataSource = this.createTree();

      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Group details');
      });

    } catch (err) {
      console.log('Error in getting groups and accounts', err);
    }



  }

  createTree() {



    try {

      console.log('New Group List', this.groupList);

      const nest = (items, AccountOrGroupCode = null, link = 'ParentGroupCode') =>
        items
          .filter(item => item[link] === AccountOrGroupCode)
          .map(item => ({ ...item, children: nest(items, item.AccountOrGroupCode) }));

      return nest(this.groupList);

    } catch (err) {
      console.log('Error in creating tree', err);
    }



  }



  allotStatus() {
    try {

      const ind = this.organisationList.findIndex(x => Number(x.orgCode) === Number(this.accountMaster.OrgCode));
      if (ind > -1) {
        this.accountMaster.LegalStatus = this.organisationList[ind].orgStatus;
      }

    } catch (err) {
      console.log('Error in allocating legl status', err);
    }

  }
  allotHeadName() {
    this.accountMaster.HeadName = this.accountHeadList.filter(x => x.AccHeadCode === this.accountMaster.AccHeadCode)[0].HeadName;
    this.findGroupsOnAccount();

  }

  findGroupsOnAccount() {
    try {
      this.groupList = [];
      this.accountMaster.GroupName = undefined;
      this.accountMaster.AccGroupCode = undefined;
      this.accountMasterService.getGroupsForAccount(this.accountMaster.AccHeadCode).subscribe(res => {
        for (const group of res) {
          this.groupList.push(group);
        }
      }, error => {
        console.error(error);
        this.alertService.error('Error in fetching Group details');
      });

    } catch (err) {
      console.log('Error in getting groups and accounts', err);
    }
  }













  allotGroupName() {

    try {

      console.log('GroupList', this.groupList);
      console.log('Ac master', this.accountMaster);
      const index = this.groupList.findIndex(x => x.AccountOrGroupCode === this.accountMaster.AccGroupCode);
      console.log('Index', index);
      this.accountMaster.GroupName = this.groupList[index].AccountOrGroupName;
      this.accountMaster.MainGroupCode = this.groupList[index].MainGroupCode;

      const ind = this.accountHeadList.findIndex(x => x.AccHeadCode === this.groupList[index].HeadCode);
      this.accountMaster.AccHeadCode = this.accountHeadList[ind].AccHeadCode;
      this.accountMaster.HeadName = this.accountHeadList[ind].HeadName;

      console.log('Account Master', this.accountMaster);

      if (this.isNewGroup) {
        this.SubGroupName.nativeElement.focus();

      } else {
        this.AccountName.nativeElement.focus();

      }

    } catch (err) {
      console.log('Error in allocating group Name', err);
    }


  }

  newGroup() {

    try {

      this.clrAccMaster();
      this.isNewGroup = true;
      this.OrgCode.nativeElement.focus();

    } catch (err) {
      console.log('Error after new Group is clicked', err);
    }



  }


  newAccount() {

    try {

      this.clrAccMaster();
      this.isNewGroup = false;
      this.OrgCode.nativeElement.focus();

    } catch (err) {
      console.log('Error after new Account is clicked', err);
    }


  }



  saveAccMaster() {

    try {

      if (this.isNewGroup) {
        // save functionality for new group
        console.log('Before saving group', this.accountMaster);
        this.accountMasterService.saveNewGroup(this.accountMaster).subscribe(res => {
          console.log(res);
          this.pushNewGroup(res);
           this.alertService.success('New Group created/updated successfully');

          this.clrAccMaster();
        }, error => {
          console.error(error);
          this.alertService.error('Error in creating New group');

        });
      } else {

        this.accountMasterService.saveAccountName(this.accountMaster).subscribe(res => {
          console.log('res');
          this.pushNewGroup(res);
          this.alertService.success('New Account created/updated successfully');
          this.clrAccMaster();
        }, error => {
          console.error(error);
          this.alertService.error('Error in creating new account');

        });

      }

    } catch (err) {
      console.log('Error in crting new Group/Account', err);
    }



  }

  findAccMaster(node) {

    try {

      if (node.OrgCode) {

        this.accountMasterService.findAccountMaster(node).subscribe(res => {
          console.log('Res', res);
          this.isNewGroup = !node.IsAccount;
          this.accountMaster = res;
          this.allotStatus();
        }, error => {
          console.error(error);
          this.alertService.error('Error in fetching details');
        });

      }



    } catch (err) {
      console.log('Error in finding details', err);
    }



  }

  pushNewGroup(res) {


    console.log(res);

    try {

      this.newGroupOrAcc = res;
      this.groupList.push(this.newGroupOrAcc);
      this.dataSource = this.createTree();
      console.log('Renewed tree structure', this.dataSource);

    } catch (err) {
      console.log('Unable to push newly created group', err);
    }


  }

  modifyAccMaster() {

    try {

    } catch (err) {
      console.log('Error', err);
    }

  }

  clrAccMaster() {

    try {

      this.accountMaster = new AccountMaster();
      this.ngForm.resetForm();

    } catch (err) {
      console.log('Error in clearing form', err);
    }

  }


  // ---------------------- Nodes --------------------------------------------------------------

  noChildern(node) {

    try {
      console.log('Node having no children', node);
      this.findAccMaster(node);

    } catch (err) {
      console.log('Error in finding node', err);
    }

  }


  loadChildren(node) {

    try {

      console.log('Node having Children', node);
      this.findAccMaster(node);

    } catch (err) {
      console.log('Error in finding node', err);
    }

  }

  styleTree(node) {

    try {

      if (!node.ParentGroupCode) {
        // it means it is head -------------
        return 'style-head';
      } else if (node.ParentGroupCode && !node.MainGroupCode) {
        // this means it is main group instead of  a head
        return 'style-group';
      } else {
        // this means it is either subGroup/account
        return 'style-subgroup';
      }

    } catch (err) {
      console.log('Error in styling node', err);
    }


  }

}
