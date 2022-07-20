// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { CategoryRoutingModule } from './category-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';

// Components
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CategoryRoutingModule,
    NgxDatatableModule,
  ],
  declarations: [ListComponent],
})
export class CategoryModule { }
