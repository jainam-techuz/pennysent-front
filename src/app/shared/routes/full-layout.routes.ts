import { Routes } from '@angular/router';
import { PageGuard } from '../guards/page-guard.service';

export const Full_ROUTES: Routes = [/* {
  path: 'report',
  loadChildren: () => import('../../pages/report/report.module').then(m => m.ReportModule),
  canActivateChild: [PageGuard]
},  */{
  path: 'user',
  loadChildren: () => import('../../pages/user/user.module').then(m => m.UserModule),
  canActivateChild: [PageGuard]
}, {
  path: 'event',
  loadChildren: () => import('../../pages/event/event.module').then(m => m.EventModule),
  canActivateChild: [PageGuard]
}, {
  path: 'category',
  loadChildren: () => import('../../pages/category/category.module').then(m => m.CategoryModule),
  canActivateChild: [PageGuard]
}, {
  path: 'faq',
  loadChildren: () => import('../../pages/faq/faq.module').then(m => m.FaqModule),
  canActivateChild: [PageGuard]
}];
