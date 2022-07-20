import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { BaseComponent } from '../components/base/base.component';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class PageGuard extends BaseComponent implements CanActivate, CanActivateChild {
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.check(route.data);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.check(route.data);
  }

  check(data) {
    const user: any = this.getToken('loggedInUser');
    if (user) {
      if (user && user.role && data && data.roles &&
        data.roles.indexOf(+(user.role)) !== -1) {
        return true;
      } else {
        this.goToHome();
        return false;
      }
    }
    this.goToHome();
    return false;
  }
}
