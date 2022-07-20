import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private toggleSidebar = new Subject<boolean>();
  private overlaySidebarToggle = new Subject<boolean>();
  private toggleNotiSidebar = new Subject<boolean>();

  toggleSidebar$ = this.toggleSidebar.asObservable();
  overlaySidebarToggle$ = this.overlaySidebarToggle.asObservable();
  toggleNotiSidebar$ = this.toggleNotiSidebar.asObservable();

  toggleSidebarSmallScreen(toggle: boolean) {
    this.toggleSidebar.next(toggle);
  }

  overlaySidebartoggle(toggle: boolean) {
    this.overlaySidebarToggle.next(toggle);
  }

  toggleNotificationSidebar(toggle: boolean) {
    this.toggleNotiSidebar.next(toggle);
  }

}
