import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventResolver } from './event.resolver';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [{
    path: '',
    component: ListComponent,
    data: { title: 'Events', roles: [1] }
}, {
    path: 'view',
    component: ViewComponent,
    resolve: { eventId: EventResolver },
    data: { title: 'Event', roles: [1] }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventRoutingModule { }
