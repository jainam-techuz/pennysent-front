import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { BaseComponent } from '../components/base/base.component';

@Injectable()
export class AuthGuard extends BaseComponent implements CanActivate {

  constructor(injector: Injector) {
    super(injector);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const token = this.getToken('loggedInUser');
    if (!token) return true;
    this.router.navigate([this.CONSTANTS.navigateToDashboard]);
    return false;
  }

}
