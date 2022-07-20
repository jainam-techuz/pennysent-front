// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { FaqRoutingModule } from './faq-routing.module';

// Modules
import { SharedModule } from '../../shared/shared.module';

// Components
import { FaqComponent } from './faq/faq.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FaqRoutingModule,
  ],
  declarations: [FaqComponent],
})
export class FaqModule { }
