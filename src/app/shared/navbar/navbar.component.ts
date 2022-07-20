import { Subscription } from 'rxjs';
import { Component, Output, EventEmitter, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren, QueryList, HostListener, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LISTITEMS } from '../data/template-search';
import { LayoutService } from '../services/layout.service';
import { ConfigService } from '../services/config.service';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html"
})
export class NavbarComponent extends BaseComponent implements OnDestroy {

  currentLang = "en";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  menuPosition = 'Side';
  isSmallScreen = false;
  searchOpenClass = "";
  transparentBGClass = "";
  hideSidebar: boolean = true;
  layoutSub: Subscription;
  configSub: Subscription;
  listItems = [];
  control = new FormControl();
  protected innerWidth: any;
  public isCollapsed = true;
  public config: any = {};
  user: any;

  @ViewChild('search') searchElement: ElementRef;
  @ViewChildren('searchResults') searchResults: QueryList<any>;
  @Output() toggleHideSidebar = new EventEmitter<Object>();
  @Output() seachTextEmpty = new EventEmitter<boolean>();

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef,
    private layoutService: LayoutService,
    private configService: ConfigService,
  ) {
    super(injector);
    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;

    this.layoutSub = layoutService.toggleSidebar$.subscribe(isShow => {
      this.hideSidebar = !isShow;
    });
  }

  ngOnInit() {
    this.listItems = LISTITEMS;
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
    this.user = this.getLoggedInUser();
  }

  ngAfterViewInit() {
    this.configSub = this.configService.templateConf$.subscribe((templateConf) => {
      if (templateConf) {
        this.config = templateConf;
      }
      this.loadLayout();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  loadLayout() {
    if (this.config.layout.menuPosition && this.config.layout.menuPosition.toString().trim() != "") {
      this.menuPosition = this.config.layout.menuPosition;
    }

    /* if (this.config.layout.variant === "Light") {
      this.logoUrl = 'assets/img/logo-dark.png';
    } else {
      this.logoUrl = 'assets/img/logo.png';
    } */

    if (this.config.layout.variant === "Transparent") {
      this.transparentBGClass = this.config.layout.sidebar.backgroundColor;
    } else {
      this.transparentBGClass = "";
    }
  }

  onSearchKey(event: any) {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.first.host.nativeElement.classList.add('first-active-item');
    }
    if (event.target.value === "") {
      this.seachTextEmpty.emit(true);
    }
    else {
      this.seachTextEmpty.emit(false);
    }
  }

  removeActiveClass() {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.first.host.nativeElement.classList.remove('first-active-item');
    }
  }

  onEscEvent() {
    this.control.setValue("");
    this.searchOpenClass = '';
    this.seachTextEmpty.emit(true);
  }

  onEnter() {
    if (this.searchResults && this.searchResults.length > 0) {
      let url = this.searchResults.first.url;
      if (url && url != '') {
        this.control.setValue("");
        this.searchOpenClass = '';
        this.router.navigate([url]);
        this.seachTextEmpty.emit(true);
      }
    }
  }

  redirectTo(value) {
    this.router.navigate([value]);
    this.seachTextEmpty.emit(true);
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleSearchOpenClass(display) {
    this.control.setValue("");
    if (display) {
      this.searchOpenClass = 'open';
      setTimeout(() => {
        this.searchElement.nativeElement.focus();
      }, 0);
    }
    else {
      this.searchOpenClass = '';
    }
    this.seachTextEmpty.emit(true);
  }

  toggleSidebar() {
    this.layoutService.toggleSidebarSmallScreen(this.hideSidebar);
  }

  editProfile() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([this.CONSTANTS.navigateToEditProfile], { queryParams: { id: this.user.id } })
    );
  }

  logoutAdmin() {
    this.logout();
  }

}
