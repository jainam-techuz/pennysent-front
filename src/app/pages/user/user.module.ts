// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { UserRoutingModule } from './user-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';

// Resolver
import { UserResolver } from './user.resolver';

// Components
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UserRoutingModule,
    NgxDatatableModule,
  ],
  declarations: [
    ListComponent,
    EditComponent
  ],
  providers: [
    UserResolver,
  ]
})
export class UserModule { }
