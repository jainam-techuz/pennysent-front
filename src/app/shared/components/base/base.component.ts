// Core
import { Title } from '@angular/platform-browser';
import { Component, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Third Party Libraries
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from 'ngx-spinner';

// Services
import { HttpService } from 'app/shared/services/http.service';
import { CONSTANTS } from 'app/shared/services/constant.service';
import { ValidationService } from 'app/shared/services/validator.service';

@Component({
    template: ''
})
export class BaseComponent {
    protected title: Title;
    protected router: Router;
    public CONSTANTS = CONSTANTS;
    protected toastr: ToastrService;
    protected httpService: HttpService;
    protected spinner: NgxSpinnerService;
    protected cookieService: CookieService;
    protected activatedRoute: ActivatedRoute;
    protected validationService: ValidationService;

    constructor(injector: Injector) {
        this.router = injector.get(Router);
        this.toastr = injector.get(ToastrService);
        this.httpService = injector.get(HttpService);
        this.spinner = injector.get(NgxSpinnerService);
        this.cookieService = injector.get(CookieService);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.validationService = injector.get(ValidationService);
    }

    setToken(key: string, value: string) {
        return this.cookieService.put(key, JSON.stringify(value));
    }

    getToken(key: string) {
        const data = this.cookieService.get(key);
        return data ? JSON.parse(data) : null;
    }

    removeToken(key: string) {
        return this.cookieService.remove(key);
    }

    clearToken() {
        return this.cookieService.removeAll();
    }

    logout() {
        this.clearToken();
        return this.router.navigate([this.CONSTANTS.navigateToLogin]);
    }

    goToHome() {
        const token = this.cookieService.get('loggedInUser');
        if (token) return this.router.navigate([this.CONSTANTS.navigateToDashboard]);
        return this.logout();
    }

    scrollTo(el: Element): void {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    scrollToError(formId): void {
        const container = document.querySelector(`#${formId}`);
        const firstElementWithError = container.querySelector('.ng-invalid');
        this.scrollTo(firstElementWithError);
    }

    showErrorToastr(response) {
        let message: string;
        if (typeof (response) == 'string') {
            message = response;
        } else if (response.data && response.data.message) {
            message = response.data.message;
        } else if (response.message) {
            message = response.message;
        } else {
            message = 'Something went wrong';
        }
        this.toastr.error(message);
    }

    showSuccessToastr(response) {
        let message: string;
        if (typeof (response) == 'string') {
            message = response;
        } else if (response.data && response.data.message) {
            message = response.data.message;
        } else if (response.message) {
            message = response.message;
        } else {
            message = 'Success';
        }
        this.toastr.success(message);
    }

    showWarningToastr(response) {
        let message: string;
        if (typeof (response) == 'string') {
            message = response;
        } else if (response.data && response.data.message) {
            message = response.data.message;
        } else if (response.message) {
            message = response.message;
        } else {
            message = 'Success';
        }
        this.toastr.warning(message);
    }

    getLoggedInUser() {
        const token = this.getToken('loggedInUser');
        return token;
    }

    trackByFn(index, item) {
        return index; // or item.id
    }

    objectToFormData(data = {}, form = null, namespace = '') {
        const files = {};
        const model = {};
        for (const propertyName in data) {
            if (data.hasOwnProperty(propertyName) && data[propertyName] instanceof File) {
                files[propertyName] = data[propertyName]
            } else {
                model[propertyName] = data[propertyName]
            }
        }

        const formData = form || new FormData();

        for (const propertyName in model) {
            if (!model.hasOwnProperty(propertyName)) { continue; }
            const formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
            if (model[propertyName] instanceof Date) {
                formData.append(formKey, model[propertyName].toISOString());
            } else if (model[propertyName] instanceof File) {
                formData.append(formKey, model[propertyName]);
            } else if (model[propertyName] instanceof Array) {
                model[propertyName].forEach((element, index) => {
                    const tempFormKey = `${formKey}[${index}]`;
                    if (element instanceof File) {
                        formData.append(tempFormKey, element);
                    } else if (typeof element === 'object') {
                        this.objectToFormData(element, formData, tempFormKey);
                    } else {

                        formData.append(tempFormKey, element.toString());
                    }
                });
            } else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) {
                this.objectToFormData(model[propertyName], formData, formKey);
            } else {
                formData.append(formKey, model[propertyName].toString());
            }
        }

        for (const propertyName in files) {
            if (files.hasOwnProperty(propertyName)) {
                formData.append(propertyName, files[propertyName]);
            }
        }
        return formData;
    };

    errorHandling(errors, form) {
        for (const error of errors) {
            const { property, constraints } = error;
            const msg = Object.values(constraints);
            form.controls[property].setErrors({
                serverError: msg.length ? msg.join('<br />') : msg
            });
        }
        return form;
    }

}
