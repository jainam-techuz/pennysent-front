import { Resolve } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Injectable()
export class UserResolver extends BaseComponent implements Resolve<any> {

  constructor(injector: Injector) {
    super(injector);
  }

  async resolve(route) {
    const { id } = route.queryParams;
    if (!id) this.router.navigate([this.CONSTANTS.navigateToDashboard]);
    else return window.atob(id);
  }
}