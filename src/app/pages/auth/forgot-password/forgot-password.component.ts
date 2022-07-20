import Swal from 'sweetalert2';
import { Component, Injector } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { forgotPwd } from 'app/shared/requrl';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent extends BaseComponent {

    forgotPwdForm: FormGroup;

    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.setForgotPasswordForm();
    }

    setForgotPasswordForm() {
        this.forgotPwdForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.forgotPwdForm.controls; }

    onSubmit() {
        if (!this.forgotPwdForm.valid) {
            this.validationService.validateAllFormFields(this.forgotPwdForm);
            return false;
        }

        const data = this.forgotPwdForm.value;
        this.httpService.putData(forgotPwd, data).subscribe(({ success, message }) => {
            if (success) {
                Swal.fire({
                    html: message,
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: 'Okay',
                    confirmButtonColor: '#01B22E'
                });
                this.router.navigate([this.CONSTANTS.navigateToLogin]);
            }
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            if (error.status == 422) {
                this.errorHandling(error.message, this.forgotPwdForm);
            }
        });
    }

}
