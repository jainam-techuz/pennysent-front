import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  static getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any,
    fieldName?: any
  ) {
    if (!fieldName) fieldName = 'This';
    const config = {
      required: `${fieldName} is required`,
      email: 'Please enter a valid email address',
      minlength: `Minimum character length is ${validatorValue.requiredLength}`,
      maxlength: `Maximum character length is ${validatorValue.requiredLength}`,
      equalTo: `Confirm password not matching`,
      invalidNumber: `Only Numbers are allowed`,
      invalidChar: 'Only alphabets are allowed',
      invalidCountrycode: 'Invalid code',
      invalidMobile: 'Please enter a valid mobile number',
      invalidPassword: 'Password should contain atleast 1 uppercase, 1 lowercase & 1 number'
    };
    return config[validatorName];
  }

  alphaNumericValidator(control) {
    if (control.value) {
      if (control.value.match(/^[a-z A-Z0-9_]*$/)) {
        return null;
      } else {
        return { invalidPattern: true };
      }
    }
  }

  passwordValidator(control) {
    if (control.value) {
      const regex = /^(?=.*?[A-Z])(?=.*?[0-9]).{6,20}$/;
      if (control.value.match(regex)) {
        return null;
      } else {
        return { invalidPassword: true };
      }
    }
  }

  matchPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ equalTo: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onlyNumber(control) {
    if (control.value) {
      if (control.value.toString().match(/^-?(0|[1-9]\d*)?$/)) {
        return null;
      } else {
        return { invalidNumber: true };
      }
    }
  }

  onlyChars(control) {
    if (control.value) {
      if (control.value.toString().match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
        return null;
      } else {
        return { invalidChar: true };
      }
    }
  }

  mobileNumber(control) {
    if (control.value) {
      if (control.value.toString().match(/^[0-9]{9,10}$/)) {
        return null;
      } else {
        return { invalidMobile: true };
      }
    }
  }

  countryCode(control) {
    if (control.value) {
      if (control.value.toString().match(/^(\+?\d{1,3}|\d{1,4})$/)) {
        return null;
      } else {
        return { invalidCountrycode: true };
      }
    }
  }

  // Validate all fields on submit
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
    let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
    if (invalidFields[1]) {
      invalidFields[1].focus();
    }
  }
}
