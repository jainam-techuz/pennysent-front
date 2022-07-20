import { Routes } from '@angular/router';

export const CONTENT_ROUTES: Routes = [{
    path: 'auth',
    loadChildren: () => import('../../pages/auth/auth.module').then(m => m.AuthModule)
}];
