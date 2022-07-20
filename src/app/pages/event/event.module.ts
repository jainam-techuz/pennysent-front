// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { EventRoutingModule } from './event-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';

// Resolver
import { EventResolver } from './event.resolver';

// Components
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EventRoutingModule,
    NgxDatatableModule,
  ],
  declarations: [
    ListComponent,
    ViewComponent
  ],
  providers: [
    EventResolver,
  ]
})
export class EventModule { }
