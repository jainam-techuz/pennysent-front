import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [{
  path: 'login',
  component: LoginComponent,
  data: { title: 'Login' }
}, {
  path: 'forgot-password',
  component: ForgotPasswordComponent,
  data: { title: 'Forgot Password' }
}, {
  path: 'reset-password',
  component: ResetPasswordComponent,
  data: { title: 'Reset Password' }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
