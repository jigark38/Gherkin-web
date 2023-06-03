import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-ng-grid',
  templateUrl: './ng-grid.component.html',
  styleUrls: ['./ng-grid.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class NgGridComponent implements OnInit {
  @Input() cols: any[];
  @Input() data: any[];
  @Input() caption: any[];
  @Input() actions: any;
  @Input() actionsColName = '';
  @Input() autoIndexingEnabled = false;
  @Output() editHandler = new EventEmitter();
  @Output() deleteHandler = new EventEmitter();
  @Output() linkHandler = new EventEmitter();
  @Output() selectedRowHandler = new EventEmitter();
  @Output() editColumnHandler = new EventEmitter();
  @Output() unSelectedRowHandler = new EventEmitter();
  eventData: any;
  selectedObj: any;
  editField: any;

  checked = false;
  disabled = false;
  constructor(
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) { }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: any) {
    // if (changes && changes.cols) {
    // }
  }
  ngOnInit() { }

  editClick(event: any) {
    this.editHandler.emit(event);
  }
  deleteClick(event: any) {
    // this.confirmService.confirm({
    //   message: 'Do you want to delete this record?',
    //   header: 'Delete Confirmation',
    //   icon: 'pi pi-info-circle',
    //   accept: () => {
    //     this.deleteHandler.emit(event);
    //   },
    //   key: 'positionDialog'
    // });

    // if (confirm('Are you sure to delete record?')) {

    // }
    this.deleteHandler.emit(event);
  }
  showConfirm(event: any) {
    this.eventData = event;
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Are you sure to delete?',
      detail: 'Confirm to proceed',
    });
  }
  onConfirm() {
    this.clearMessages();
    this.deleteClick(this.eventData);
  }
  onReject() {
    this.clearMessages();
  }
  clearMessages() {
    this.messageService.clear('c');
  }
  onRowSelect(event: any) {
    this.selectedRowHandler.emit(event);
  }
  onRowUnselect(event: any) {
    this.unSelectedRowHandler.emit(event);
  }
  columnClick(col: any, data: any) {
    this.linkHandler.emit({ col, data });
  }

  updateList(field: any, index: any, event: any) {
    const editField = event.target.value;
    this.data[index][field] = editField;
    this.editColumnHandler.emit({ col: this.cols, data: this.data });
  }
  toggleCheckBox(event: any) {
    console.log(event.checked);
  }
}
