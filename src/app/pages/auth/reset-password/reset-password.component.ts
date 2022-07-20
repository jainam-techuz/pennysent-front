import Swal from 'sweetalert2';
import { Component, Injector } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { resetPwd } from 'app/shared/requrl';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent extends BaseComponent {

  token: string;
  resetForm: FormGroup;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
  ) {
    super(injector);
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (!this.token) this.router.navigate([this.CONSTANTS.navigateToLogin]);
  }

  ngOnInit(): void {
    this.setResetForm();
  }

  setResetForm() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, this.validationService.passwordValidator]],
      confirm_password: ['', [Validators.required]],
    }, {
      validator: this.validationService.matchPassword('password', 'confirm_password')
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    if (!this.resetForm.valid) {
      this.validationService.validateAllFormFields(this.resetForm);
      return false;
    }

    const data = { 'token': this.token, 'password': this.resetForm.value.password }
    this.httpService.putData(resetPwd, data).subscribe(({ success, message }) => {
      if (success) {
        Swal.fire({
          html: message,
          icon: 'success',
          allowOutsideClick: false,
          confirmButtonText: 'Okay',
          confirmButtonColor: '#01B22E'
        });
        this.router.navigate([this.CONSTANTS.navigateToLogin])
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      if (error.error.status == 422) {
        this.errorHandling(error.message, this.resetForm);
      }
    });
  }

}
