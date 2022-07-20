import Swal from 'sweetalert2';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { APIResponse } from 'app/shared/interface/index.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';
import { user, userEdit, transactions, notifications } from 'app/shared/requrl';
import { GetUser, GetWalletInfo, Transaction, GetNotifications, NotificationObj } from './edit.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EditComponent extends BaseComponent {

  userId: number;
  balance: number;
  logoUrl: string;
  isAdmin: boolean;
  userForm: FormGroup;
  columnMode = ColumnMode;
  rows: Array<Transaction> = [];
  notifications: Array<NotificationObj> = [];
  toggleEye: string = this.CONSTANTS.eyeOff;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
  ) {
    super(injector);
    this.userId = this.activatedRoute.snapshot.data.userId;
  }

  ngOnInit(): void {
    this.setForm();
    this.getTransactions();
    this.getNotifications();
  }

  togglePassword(Password) {
    this.toggleEye = (this.toggleEye == this.CONSTANTS.eye)
      ? this.CONSTANTS.eyeOff
      : this.CONSTANTS.eye;
    Password.type = Password.type === 'password' ? 'text' : 'password';
  }

  setForm() {
    this.userForm = this.formBuilder.group({
      id: [''],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      country_code: ['', [Validators.required, this.validationService.countryCode]],
      mobile_number: ['', [Validators.required, this.validationService.mobileNumber, this.validationService.onlyNumber]],
      status: ['', [Validators.required]],
      password: ['', [Validators.minLength(6), Validators.maxLength(20), this.validationService.passwordValidator]]
    });
    this.getUser();
  }

  get f() { return this.userForm.controls; }

  getUser() {
    this.httpService.getData(`${user}/${this.userId}`).subscribe(
      async ({ success, result }: GetUser) => {
        if (success) {
          this.logoUrl = result.logo_url;
          this.isAdmin = result.role === 1 ? true : false;
          this.isAdmin && this.userForm.controls.status.disable();
          this.userForm.patchValue(result);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.showErrorToastr(error);
      }
    );
  }

  getTransactions() {
    const url = `${transactions}/${this.userId}`;
    this.httpService.getData(url).subscribe(({ success, result }: GetWalletInfo) => {
      if (success) {
        this.balance = result.balance;
        this.rows = result.transactions.map(e => {
          return e;
        });
        document.getElementById('click').click();
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getNotificationType(type: number) {
    switch (type) {
      case 1: return 'Payment Completed';
      case 2: return 'Refund Requested';
      case 3: return 'Refund Processed';
      case 4: return 'Circle Update';
      case 5: return 'Circle Closed';
      case 6: return 'Refund Request Rejected';
    }
  }

  getNotifications() {
    const url = `${notifications}/${this.userId}`;
    this.httpService.getData(url).subscribe(({ success, result }: GetNotifications) => {
      if (success) {
        this.notifications = result.map(e => {
          e.typeName = this.getNotificationType(e.type);
          return e;
        });
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.validationService.validateAllFormFields(this.userForm);
      return false;
    }
    if (this.isAdmin) this.userForm.value.status = 1;
    this.httpService.putData(userEdit, this.userForm.value).subscribe(
      ({ success, message }: APIResponse) => {
        if (success) {
          Swal.fire({
            html: message,
            icon: 'success',
            allowOutsideClick: false,
            confirmButtonText: 'Okay',
            confirmButtonColor: '#01B22E'
          }).then(result => {
            if (result.value) {
              this.router.navigate([this.CONSTANTS.navigateToUsers]);
            }
          });
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        if (error.status == 422) {
          this.errorHandling(error.message, this.userForm);
        } else {
          this.showErrorToastr(error.error)
        }
      }
    );
  }

}
