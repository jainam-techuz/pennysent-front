import { ColumnMode } from "@swimlane/ngx-datatable";
import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { circleDetails } from 'app/shared/requrl';
import { GetEvent, Event, Contribution } from './view.interface';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: 'app-event-view',
  templateUrl: './view.component.html',
  styleUrls: ["../../../../assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent extends BaseComponent {

  eventId: number;
  circleDetails: Event;
  columnMode = ColumnMode;
  rows: Array<Contribution> = [];
  currentClass: string = 'bg-danger';

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.eventId = this.activatedRoute.snapshot.data.eventId;
  }

  ngOnInit(): void {
    this.getEvent();
  }

  getClass() {
    if (this.currentClass === 'bg-success') this.currentClass = 'bg-primary';
    else if (this.currentClass === 'bg-primary') this.currentClass = 'bg-danger';
    else if (this.currentClass === 'bg-danger') this.currentClass = 'bg-success';
    return this.currentClass;
  }

  getEvent() {
    this.httpService.getData(`${circleDetails}/${this.eventId}`).subscribe(
      ({ success, result }: GetEvent) => {
        if (success) {
          this.circleDetails = result;
          this.circleDetails.amount_received = result.contributors.reduce((a, b) => { return a + b.contributed }, 0);
          this.rows = this.circleDetails.contributors.map(e => {
            if (!e.user.logo_url) e.logoClass = this.getClass();
            return e;
          });
          document.getElementById('click').click();
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.showErrorToastr(error);
      }
    );
  }

  copyToClipboard(item): void {
    const listener = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    document.getElementById('copy').className = 'success';
    setTimeout(() => {
      document.getElementById('copy').className = 'info';
    }, 3000);
  }

}

