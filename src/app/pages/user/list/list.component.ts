import Swal from 'sweetalert2';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { user, userList } from 'app/shared/requrl';
import { GetUsersList, User } from './list.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';
import { APIResponse, FrontPagination } from 'app/shared/interface/index.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent extends BaseComponent {

  columnMode = ColumnMode;
  rows: Array<User> = [];
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
      recordPerPage: this.page.recordPerPage
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
          this.rows = data.map((e) => {
            e.eid = window.btoa(`${e.id}`);
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

  remove(row: User) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: 'You want to delete this user?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.httpService.deleteData(`${user}/${row.id}`).subscribe(
          ({ success, message }: APIResponse) => {
            if (success) {
              row.status = 2;
              Swal.fire({
                html: message,
                icon: 'success',
                allowOutsideClick: false,
                confirmButtonText: 'Okay',
                confirmButtonColor: '#01B22E'
              });
            }
            this.spinner.hide();
          }, error => {
            this.spinner.hide();
          }
        );
      }
    });
  }

}
