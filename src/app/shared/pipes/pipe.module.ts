import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { FilterPipe } from './filter.pipe';
import { DateSuffix } from './date-suffix.pipe';
import { LastSeenPipe } from './last-seen.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [FilterPipe, DateSuffix, LastSeenPipe],
  declarations: [FilterPipe, DateSuffix, LastSeenPipe],
})
export class PipeModule { }
