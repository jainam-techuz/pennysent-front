import { Component, Injector } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { login } from 'app/shared/requrl';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent extends BaseComponent {

  loginForm: FormGroup;
  submitted: boolean = false;
  toggleEye: string = this.CONSTANTS.eyeOff;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.setLoginForm();
  }

  togglePassword(Password) {
    this.toggleEye = (this.toggleEye == this.CONSTANTS.eye)
      ? this.CONSTANTS.eyeOff
      : this.CONSTANTS.eye;
    Password.type = Password.type === 'password' ? 'text' : 'password';
  }

  setLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      this.validationService.validateAllFormFields(this.loginForm);
      return false;
    }

    const data = this.loginForm.value;
    this.httpService.postData(login, data).subscribe(({ success, result }) => {
      if (success) {
        result.id = window.btoa(result.id);
        this.setToken('loggedInUser', result);
        this.router.navigate([this.CONSTANTS.navigateToDashboard]);
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      if (error.status == 422) {
        this.errorHandling(error.message, this.loginForm);
      }
    });
  }

}
