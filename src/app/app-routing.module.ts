import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

// Routes
import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

// Guards
import { AuthGuard } from './shared/guards/auth-guard.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '', component: FullLayoutComponent, children: Full_ROUTES },
  {
    path: '', component: ContentLayoutComponent,
    children: CONTENT_ROUTES, canActivate: [AuthGuard]
  },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
