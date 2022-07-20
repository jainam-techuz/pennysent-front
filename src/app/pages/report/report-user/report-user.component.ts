import { cloneDeep } from 'lodash';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { userList } from 'app/shared/requrl';
import { GetUsersList, User } from './report-user.interface';
import { FrontPagination } from 'app/shared/interface/index.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReportUserComponent extends BaseComponent {

  rows: Array<User> = [];
  rowsCopy: Array<User> = [];
  columnMode = ColumnMode;
  searchObj = { search: null }
  currentClass: string = 'bg-danger';
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
    this.getUsers();
  }

  getClass() {
    if (this.currentClass === 'bg-success') this.currentClass = 'bg-primary';
    else if (this.currentClass === 'bg-primary') this.currentClass = 'bg-danger';
    else if (this.currentClass === 'bg-danger') this.currentClass = 'bg-success';
    return this.currentClass;
  }

  getUsers(page: any = 0) {
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

    this.httpService.getData(userList, params).subscribe(
      ({ success, result: { data, totalRecords } }: GetUsersList) => {
        if (success) {
          this.rowsCopy = cloneDeep(data);
          this.rows = data.map((e) => {
            if (!e.logo_url) e.logoClass = this.getClass();
            return e;
          });
          this.page.totalRecords = totalRecords;
          setTimeout(() => { this.table.element.click(); }, 0);
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
    this.getUsers();
  }

  searchUser(event) {
    const value = event.target.value.toLowerCase();
    this.searchObj.search = value;
    this.getUsers();
    this.table.offset = 0;
  }

  sortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }) {
    this.page.orderDir = sortInfo.sorts[0].dir;
    this.page.orderBy = sortInfo.sorts[0].prop;
    this.getUsers();
  }

  download() {
    const replacer = (key, value) => (value === null ? '' : value);
    let header = ['name', 'contact', 'email', 'balance', 'totalSpent', 'logoClass'];
    const rows = this.rowsCopy.map((e, i) => {
      e.id = i + 1;
      e.totalSpent = e.totalSpent || 0;
      e.logoClass = e.status === 0 ? 'Inactive' : e.status === 1 ? 'Active' : 'Deleted';
      delete e.first_name;
      delete e.last_name;
      delete e.logo_url;
      return e;
    });
    const csv = rows.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
    );
    header = ['Name', 'Contact', 'Email', 'Balance', 'Total Spent', 'Status'];
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
