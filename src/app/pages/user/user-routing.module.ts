import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserResolver } from './user.resolver';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [{
    path: '',
    component: ListComponent,
    data: { title: 'Users', roles: [1] }
}, {
    path: 'edit',
    component: EditComponent,
    resolve: { userId: UserResolver },
    data: { title: 'Edit User', roles: [1] }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
