import { NgModule } from "@angular/core";
import { ToastrModule } from "ngx-toastr";
import { CookieModule } from 'ngx-cookie';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// Modules
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "./app.component";
import { WINDOW_PROVIDERS } from './shared/services/window.service';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

// Interceptor
import { HttpConfigInterceptor } from './shared/interceptor/httpconfig.interceptor';

// Guards
import { AuthGuard } from './shared/guards/auth-guard.service';
import { PageGuard } from './shared/guards/page-guard.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
}

@NgModule({
  declarations: [
    AppComponent, FullLayoutComponent, ContentLayoutComponent, NotfoundComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    CookieModule.forRoot(),
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true,
      preventDuplicates: true,
      progressBar: true,
      timeOut: 2000,
    }),
    NgbModule,
    NgxSpinnerModule,
    PerfectScrollbarModule
  ],
  providers: [
    AuthGuard,
    PageGuard,
    WINDOW_PROVIDERS,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
