// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { ReportRoutingModule } from './report-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';

// Components
import { ReportUserComponent } from './report-user/report-user.component';
import { ReportEventComponent } from './report-event/report-event.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SharedModule,
    ReportRoutingModule,
  ],
  declarations: [
    ReportUserComponent,
    ReportEventComponent,
  ],
})
export class ReportModule { }
