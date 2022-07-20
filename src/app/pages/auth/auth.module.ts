import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from '../../shared/shared.module';

// Components
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ]
})
export class AuthModule { }
