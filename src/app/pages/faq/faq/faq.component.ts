import Swal from 'sweetalert2';
import { Component, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FAQ } from './faq.interface';
import { faq } from 'app/shared/requrl';
import { APIResponse } from 'app/shared/interface/index.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent extends BaseComponent {

  faqs: Array<FAQ> = [];
  faqForm: FormGroup;

  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getFAQs();
    this.setFAQForm();
  }

  getFAQs() {
    this.httpService.getData(faq).subscribe(({ success, result }) => {
      if (success) {
        this.faqs = result;
        document.getElementById('click').click();
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  open(content, faq: FAQ) {
    this.faqForm.reset();
    this.faqForm.patchValue(faq);
    this.modalService.open(content);
  }

  setFAQForm() {
    this.faqForm = this.formBuilder.group({
      id: [''],
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  get f() { return this.faqForm.controls; }

  onSubmit() {
    if (!this.faqForm.valid) {
      this.validationService.validateAllFormFields(this.faqForm);
      return false;
    }
    this.httpService.putData(faq, this.faqForm.value).subscribe(
      ({ success, message }: APIResponse) => {
        if (success) {
          this.getFAQs();
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
        if (error.status == 422) {
          this.errorHandling(error.error.message, this.faqForm);
        } else {
          this.showErrorToastr(error.error)
        }
      }
    );
  }

}
