import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportUserComponent } from './report-user/report-user.component';
import { ReportEventComponent } from './report-event/report-event.component';

const routes: Routes = [{
    path: 'users',
    component: ReportUserComponent,
    data: { title: 'Report', roles: [1] }
}, {
    path: 'events',
    component: ReportEventComponent,
    data: { title: 'Report', roles: [1] }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }
