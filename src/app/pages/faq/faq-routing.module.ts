import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [{
    path: '',
    component: FaqComponent,
    data: { title: 'FAQs', roles: [1] }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FaqRoutingModule { }
