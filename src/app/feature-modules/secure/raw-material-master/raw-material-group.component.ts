import { Component } from '@angular/core';
import { WebservicewrapperService } from 'src/app/services/backendcall/webservicewrapper.service';
import { Router } from '@angular/router';
import { RawMaterialMaster } from './raw-material-master-model';
import { AlertService } from 'src/app/corecomponents/alert/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
    selector: 'app-raw-material-group',
    templateUrl: './raw-material-group.component.html',
    styleUrls: ['./raw-material-group.component.css']
})
export class RawMaterialGroupComponent {
    // public MaterialPurchase;

    public MaterialPurchaseMaster: any[];
    public FilteredMaterialGroup: any[];
    public SelectedGroup: RawMaterialMaster;

    public MaterialPurchase = [
        { id: 1, text: 'Import' },
        { id: 2, text: 'Domestic' },
        { id: 3, text: 'Both' }
    ];

    public SelectedMaterialPurchase = '';
    public MaterialGroup = '';
    submitted = false;
    public MaterialMasterModel: RawMaterialMaster;
    IsLoading = false;
    modifyGroup = false;
    enableEdit = false;
    disableModify: boolean;


    rawMaterialGroupForm = new FormGroup({
        MaterialGroup: new FormControl('', [Validators.required]),
        SelectPurchaseMaterial: new FormControl('', [Validators.required]),
        SelectMaterialGroup: new FormControl('')
    });

    // tslint:disable-next-line: variable-name
    constructor(private _service: WebservicewrapperService, private _router: Router, private alertService: AlertService) {
        // _service.GetRawMaterialMaster().subscribe(
        //     (data) => this.MaterialPurchase = data,
        //     (error) => console.log(error)
        // );

        this._service.GetRawMaterialMaster().subscribe(
            (data) => {
                this.MaterialPurchaseMaster = data;

            },
            (error) => console.log(error)
        );

    }


    validateForm(): boolean {
        if (this.SelectedMaterialPurchase === '' || this.MaterialGroup === '') {
            return false;
        } else {
            return true;
        }

    }
    CreateGroup() {
        this.submitted = true;
        try {

            if (!this.validateForm()) {
                return;
            }
            this.IsLoading = true;
            if (!this.modifyGroup) {
                this.MaterialMasterModel = new RawMaterialMaster();
                this.MaterialMasterModel.Material_Purchases = this.SelectedMaterialPurchase;
                this.MaterialMasterModel.Raw_Material_Group = this.MaterialGroup;
                // create raw material group
                this._service.PostRawMaterialMaster(this.MaterialMasterModel).subscribe(
                    (data) => {
                        this.IsLoading = false;
                        this.alertService.success('Material Group added successfully.');
                    },
                    (error) => {
                        this.IsLoading = false;
                        this.alertService.error('There is some error while prococessing your request.Please try again.');
                    }
                );
            } else {
                this.SelectedGroup.Raw_Material_Group = this.MaterialGroup;
                this._service.UpdateRawMaterialMaster(this.SelectedGroup).subscribe(
                    (data) => {
                        this.IsLoading = false;
                        this.alertService.success('Material Group updated successfully.');
                        this.modifyGroup = false;
                        this.enableEdit = false;
                        this.disableModify = false;
                    },
                    (error) => {
                        this.IsLoading = false;
                        this.alertService.error('There is some error while prococessing your request.Please try again.');
                    }
                );
            }
        } catch (error) {
            console.log('Method: CreateGroup', error);
        }

    }
    NavigateToMaster() {
        this._router.navigateByUrl('secure/raw-material-master').then(e => {
            if (e) {
                // console.log("Navigation is successful!");
            } else {
                // console.log("Navigation has failed!");
            }
        });
    }
    ModifyGroup() {
        this.modifyGroup = true;
        this.MaterialGroup = '';
        this.disableModify = true;
    }


    onChangeGroup() {
        try {
            console.log(this.SelectedGroup);
            this.MaterialGroup = this.SelectedGroup.Raw_Material_Group;
            this.enableEdit = true;
            // this.MaterialGroup = this.SelectedGroup

        } catch (error) {
            // console.log('Method : onChangeGroup', error);
        }

    }

    onChangePurchase() {
        try {
            this.FilteredMaterialGroup = this.MaterialPurchaseMaster.filter(a => a.Material_Purchases.toLowerCase() ===
                this.SelectedMaterialPurchase.toLowerCase());
        } catch (error) {

        }

    }
}
