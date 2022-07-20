import Swal from 'sweetalert2';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { Category } from './list.interface';
import { category } from 'app/shared/requrl';
import { APIResponse } from 'app/shared/interface/index.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './list.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent extends BaseComponent {

  limitRef: number = 10;
  columnMode = ColumnMode;
  rows: Array<Category> = [];
  categories: Array<Category> = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    injector: Injector,
    private modalService: NgbModal,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.httpService.getData(category).subscribe(({ success, result }) => {
      if (success) {
        result.map(e => { e.disabled = true });
        this.categories = cloneDeep(result);
        this.rows = result;
        this.table.element.click();
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  searchCategory(event) {
    const value = event.target.value.toLowerCase();
    this.rows = this.categories.filter((e) => {
      return e.name.toLowerCase().indexOf(value) !== -1 || !value;
    });
    this.table.offset = 0;
  }

  open(content) {
    this.modalService.open(content);
  }

  add({ value }) {
    if (!value) {
      this.showErrorToastr('Category name cannot be empty');
      return false;
    }
    this.httpService.postData(category, { name: value }).subscribe(
      ({ success, message }: APIResponse) => {
        if (success) {
          this.getCategories();
          this.modalService.dismissAll();
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
        this.showErrorToastr(error.error);
      }
    );
  }

  reset(row: Category) {
    const category = this.categories.find(e => e.id === row.id);
    row.name = category.name;
    row.disabled = true;
  }

  save(row: Category) {
    if (!row.name) {
      this.showErrorToastr('Category name cannot be empty');
      return false;
    }
    const categoryObj = { id: row.id, name: row.name }
    this.httpService.putData(category, categoryObj).subscribe(({ success }: APIResponse) => {
      if (success) {
        const category = this.categories.find(e => e.id === row.id);
        category.name = row.name;
        row.disabled = true;
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  remove(row: Category) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      html: 'You want to delete this category?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.httpService.deleteData(`${category}/${row.id}`).subscribe(
          ({ success, message }: APIResponse) => {
            if (success) {
              this.rows = this.rows.filter(e => e.id !== row.id);
              this.categories = this.categories.filter(e => e.id !== row.id);
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
