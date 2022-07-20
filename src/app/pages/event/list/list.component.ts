import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { circleList } from 'app/shared/requrl';
import { GetEventsList, Event } from './list.interface';
import { FrontPagination } from 'app/shared/interface/index.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './list.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent extends BaseComponent {

  columnMode = ColumnMode;
  rows: Array<Event> = [];
  searchObj = { search: null, type: '', status: '' }
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
      recordPerPage: this.page.recordPerPage
    }

    if (page == 1) this.rows = [];
    if (this.searchObj.search) params.search = this.searchObj.search;
    if (this.searchObj.type) params.type = this.searchObj.type;
    if (this.searchObj.status) params.status = this.searchObj.status;

    if (this.page.orderBy && this.page.orderDir) {
      params.orderBy = this.page.orderBy;
      params.orderDir = this.page.orderDir;
    }

    this.httpService.getData(circleList, params).subscribe(
      ({ success, result: { data, totalRecords } }: GetEventsList) => {
        if (success) {
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

  clearList() {
    this.searchObj = { search: null, type: '', status: '' }
    this.getEvents();
  }

}
