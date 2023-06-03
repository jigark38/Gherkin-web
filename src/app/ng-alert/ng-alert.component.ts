import { Component, OnInit } from '@angular/core';

import { AlertMessage } from './alert-type';
import { AlertService } from '../corecomponents/alert/alert.service';
import { MessageService } from 'primeng/api';
import { NgAlertService } from './ng-alert.service';

@Component({
  selector: 'app-ng-alert',
  templateUrl: './ng-alert.component.html',
  styleUrls: ['./ng-alert.component.css'],
  providers: [MessageService]
})
export class NgAlertComponent implements OnInit {

  constructor(private messageService: MessageService, private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alert.subscribe((res: AlertMessage) => {
      this.showMessage(res);
    });
  }

  showMessage(message: AlertMessage) {
    this.messageService.add({ severity: message.type, summary: '', detail: message.message });
  }
}

