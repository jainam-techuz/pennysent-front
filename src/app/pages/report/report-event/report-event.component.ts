import { cloneDeep } from 'lodash';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { circleList } from 'app/shared/requrl';
import { GetEventsList, Event } from './report-event.interface';
import { FrontPagination } from 'app/shared/interface/index.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-report-event',
  templateUrl: './report-event.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReportEventComponent extends BaseComponent {

  columnMode = ColumnMode;
  rows: Array<Event> = [];
  rowsCopy: Array<Event> = [];
  searchObj = { search: null }
  page: FrontPagination = {
    recordPerPage: 10,
    totalRecords: 0,
    pages: 0,
    currentPage: 0,
    orderBy: 'id',
    orderDir: 'DESC'
  };
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(page: any = 0) {
    this.page.currentPage = page ? page.offset : page
    const params: any = {
      pageNumber: this.page.currentPage + 1,
      recordPerPage: this.page.recordPerPage,
      isReport: true
    }

    if (page == 1) this.rows = [];
    if (this.searchObj.search) params.search = this.searchObj.search;

    if (this.page.orderBy && this.page.orderDir) {
      params.orderBy = this.page.orderBy;
      params.orderDir = this.page.orderDir;
    }

    this.httpService.getData(circleList, params).subscribe(
      ({ success, result: { data, totalRecords } }: GetEventsList) => {
        if (success) {
          this.rowsCopy = cloneDeep(data);
          this.rows = data.map((e) => {
            e.eid = window.btoa(`${e.id}`);
            return e;
          });
          this.table.element.click();
          this.page.totalRecords = totalRecords;
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  updateLimit(limit) {
    this.page.recordPerPage = limit.target.value;
    this.getEvents();
  }

  searchEvent(event) {
    const value = event.target.value.toLowerCase();
    this.searchObj.search = value;
    this.getEvents();
    this.table.offset = 0;
  }

  sortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }) {
    this.page.orderDir = sortInfo.sorts[0].dir;
    this.page.orderBy = sortInfo.sorts[0].prop;
    this.getEvents();
  }

  download() {
    const replacer = (key, value) => (value === null ? '' : value);
    let header = ['circle_name', 'user', 'type', 'target_amount', 'amount_received', 'status'];
    const rows = this.rowsCopy.map((e: any, i) => {
      e.id = i + 1;
      e.user = e.user.name;
      e.type = e.type === 1 ? 'Public' : 'Private';
      e.status = e.status === 2 ? 'Active' : e.status === 3 ? 'Expired' : 'Deleted';
      return e;
    });
    const csv = rows.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
    );
    header = ['Title', 'Created By', 'Type', 'Target Amount', 'Received', 'Status'];
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'myFile.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
