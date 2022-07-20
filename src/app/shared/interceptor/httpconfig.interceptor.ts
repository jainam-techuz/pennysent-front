import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { BaseComponent } from '../components/base/base.component';
import { HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HttpConfigInterceptor extends BaseComponent implements HttpInterceptor {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();
    if (request.url.search("/auth/") === -1) request = this.addToken(request);

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.spinner.hide();
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        let errData;
        this.spinner.hide();
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 400:
              errData = err.error.error.errors ? err.error.error.errors : err.error.error;
              break;
            case 401:
              errData = err.error.message || 'Please login to continue';
              this.showErrorToastr(errData);
              this.logout();
              break;
            case 403:
              errData = err.error.error || 'Not allowed to access';
              this.showErrorToastr(errData);
              break;
            case 404:
              errData = err.error.result || err.error.error || err.error.message;
              this.showErrorToastr(errData);
              break;
            case 409:
              errData = err.error.error || err.error.message;
              this.showErrorToastr(errData);
              break;
            case 500:
              errData = err.error.result || err.error.error || err.error.message;
              this.showErrorToastr(errData);
              break;
            default:
              break;
          }
        }
        return throwError(err);
      })
    );
  }

  addToken(request: HttpRequest<any>) {
    const { token } = this.getToken('loggedInUser');
    request = request.clone({
      headers: request.headers.set("Authorization", `Bearer ${token}`),
    });
    return request;
  }

}
