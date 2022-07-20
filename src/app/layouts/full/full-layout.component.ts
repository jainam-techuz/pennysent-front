import {
  Component,
  OnInit,
  Inject,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from 'rxjs/operators';
import { DOCUMENT } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WINDOW } from 'app/shared/services/window.service';
import { ConfigService } from "app/shared/services/config.service";
import { LayoutService } from 'app/shared/services/layout.service';
import { CustomizerService } from 'app/shared/services/customizer.service';

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  hideSidebar: boolean = true;
  overlayContent = false;
  configSub: Subscription;
  layoutSub: Subscription;
  bgImage: string;
  bgColor: string;
  resizeTimeout;
  isSmallScreen = false;
  menuPosition = 'Side';
  displayOverlayMenu = false; // Vertical Side menu for screenSize < 1200
  isMenuCollapsedOnHover = false;
  isNavbarSeachTextEmpty = true;
  isScrollTopVisible = false;
  public config: any = {};
  public innerWidth: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private configService: ConfigService,
    private layoutService: LayoutService,
    private customizerService: CustomizerService,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    private deviceService: DeviceDetectorService
  ) {

    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;

    // On toggle sidebar menu
    this.layoutSub = layoutService.toggleSidebar$.subscribe(isShow => {
      this.hideSidebar = !isShow;
      if (this.hideSidebar) {
        this.overlayContent = false;
      } else {
        this.overlayContent = true;
      }
      this.toggleSidebar();
    });
  }

  ngOnInit() {
    this.configSub = this.configService.templateConf$.subscribe((templateConf) => {
      if (templateConf) {
        this.config = templateConf;
      }
      this.loadLayout();
      this.cdr.markForCheck();
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      if (this.config.layout.menuPosition === "Side" || this.displayOverlayMenu) {
        if (this.innerWidth < 1200) {
          this.layoutService.toggleSidebarSmallScreen(false);
          this.overlayContent = false;
          this.renderer.removeClass(this.document.body, "overflow-hidden");
        }
      }
    });
  }

  ngAfterViewInit() {
    this.setMenuLayout();
  }

  ngOnDestroy() {
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  setMenuLayout() {
    this.overlayContent = false;
    this.renderer.removeClass(this.document.body, "blank-page");
    if (this.config.layout.menuPosition === "Side") {
      if (this.innerWidth < 1200) { // If Screen size < 1200
        this.displayOverlayMenu = true;
        this.renderer.removeClass(this.document.body, "horizontal-layout");
        this.renderer.removeClass(this.document.body, "horizontal-menu");
        this.renderer.removeClass(this.document.body, "horizontal-menu-padding");
        this.renderer.removeClass(this.document.body, "menu-expanded");
        this.renderer.removeClass(this.document.body, "vertical-menu");
        this.renderer.removeClass(this.document.body, "menu-open");
        this.renderer.removeClass(this.document.body, "nav-collapsed");
        this.renderer.addClass(this.document.body, "vertical-layout");
        this.renderer.addClass(this.document.body, "menu-hide");
      }
      else { // If Screen size > 1200
        this.displayOverlayMenu = false;
        this.renderer.removeClass(this.document.body, "horizontal-layout");
        this.renderer.removeClass(this.document.body, "horizontal-menu");
        this.renderer.removeClass(this.document.body, "horizontal-menu-padding");
        // this.renderer.removeClass(this.document.body, "blank-page");
        this.renderer.setAttribute(this.document.body, "data-menu", "vertical-menu");
        this.renderer.addClass(this.document.body, "vertical-layout");
        if (!this.config.layout.sidebar.collapsed) {
          this.renderer.addClass(this.document.body, "menu-expanded");
          this.renderer.addClass(this.document.body, "menu-open");
        }
        this.renderer.addClass(this.document.body, "vertical-menu");
        this.renderer.removeClass(this.document.body, "menu-hide");
        this.renderer.removeClass(this.document.body, "vertical-overlay-menu");
      }
    }
  }


  loadLayout() {
    if (this.config.layout.menuPosition && this.config.layout.menuPosition.toString().trim() != "") {
      this.menuPosition = this.config.layout.menuPosition;
    }

    if (!this.config.layout.sidebar.backgroundImage) {
      this.bgImage = "";
    } else {
      this.bgImage = this.config.layout.sidebar.backgroundImageURL;
    }

    if (!this.config.layout.sidebar.backgroundColor) {
      this.bgColor = this.customizerService.light_dark_colors[7].code;
    } else {
      this.bgColor = this.config.layout.sidebar.backgroundColor;
    }

    if (this.config.layout.menuPosition === "Side") {
      if (this.config.layout.sidebar.collapsed) {
        this.isMenuCollapsedOnHover = true;
      }
      else {
        this.isMenuCollapsedOnHover = true;
      }
      this.toggleSidebar();
    }

    this.removeTransparentBGClasses();

    if (this.config.layout.variant === "Light") {
      this.renderer.removeClass(this.document.body, "layout-dark");
      this.renderer.removeClass(this.document.body, "layout-transparent");
    }
    else if (this.config.layout.variant === "Dark") {
      this.renderer.removeClass(this.document.body, "layout-transparent");
      this.renderer.addClass(this.document.body, "layout-dark");
    }
    else if (this.config.layout.variant === "Transparent") {
      this.renderer.addClass(this.document.body, "layout-dark");
      this.renderer.addClass(this.document.body, "layout-transparent");
      this.renderer.addClass(this.document.body, this.bgColor);
      this.bgImage = "";
    }

    this.setMenuLayout();

    if (this.config.layout.sidebar.size === 'sidebar-sm') {
      this.renderer.removeClass(this.document.body, "sidebar-lg");
      this.renderer.addClass(this.document.body, "sidebar-sm");
    }
    else if (this.config.layout.sidebar.size === 'sidebar-lg') {
      this.renderer.removeClass(this.document.body, "sidebar-sm");
      this.renderer.addClass(this.document.body, "sidebar-lg");
    }
    else {
      this.renderer.removeClass(this.document.body, "sidebar-sm");
      this.renderer.removeClass(this.document.body, "sidebar-lg");
    }

    if (this.config.layout.menuPosition === "Side") {
      if (this.config.layout.sidebar.collapsed && !this.isSmallScreen) {
        this.renderer.removeClass(this.document.body, "menu-expanded");
        this.renderer.addClass(this.document.body, "nav-collapsed");
      }
      else {
        this.renderer.removeClass(this.document.body, "nav-collapsed");
        this.renderer.addClass(this.document.body, "menu-expanded");
      }
    }

    if (this.config.layout.navbar.type === 'Static') {
      this.renderer.removeClass(this.document.body, "navbar-sticky");
      this.renderer.addClass(this.document.body, "navbar-static");
    }
    else if (this.config.layout.navbar.type === 'Fixed') {
      this.renderer.removeClass(this.document.body, "navbar-static");
      this.renderer.addClass(this.document.body, "navbar-sticky");
    }
  }

  toggleSidebar() {
    if (this.hideSidebar) {
      this.renderer.removeClass(this.document.body, "menu-expanded");
      this.renderer.removeClass(this.document.body, "vertical-menu");
      this.renderer.removeClass(this.document.body, "menu-open");

      this.renderer.addClass(this.document.body, "vertical-layout");
      this.renderer.addClass(this.document.body, "menu-hide");

      if (this.config.layout.menuPosition === "Top") {
        this.renderer.addClass(this.document.body, "vertical-overlay-menu");
      }
    }
    else {
      this.renderer.addClass(this.document.body, "vertical-layout");
      this.renderer.addClass(this.document.body, "menu-expanded");
      this.renderer.addClass(this.document.body, "vertical-menu");
      if (this.config.layout.sidebar.collapsed) {
        this.renderer.removeClass(this.document.body, "menu-open");
      }
      else {
        this.renderer.addClass(this.document.body, "menu-open");
      }
      this.renderer.removeClass(this.document.body, "menu-hide");
    }
    this.isTouchDevice();
  }

  isTouchDevice() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
      if (!this.hideSidebar) {
        this.renderer.addClass(this.document.body, "overflow-hidden");
      } else {
        this.renderer.removeClass(this.document.body, "overflow-hidden");
      }
    }
  }

  hideCompactMenuOnSmallScreen() {
    if (this.innerWidth < 1200) {
      let conf = this.config;
      conf.layout.sidebar.collapsed = false;
      this.configService.applyTemplateConfigChange({ layout: conf.layout });
    }
  }

  //Remove transparent layout classes
  removeTransparentBGClasses() {
    this.customizerService.transparent_colors.forEach(_ => {
      this.renderer.removeClass(this.document.body, _.class);
    });
    this.customizerService.transparent_colors_with_shade.forEach(_ => {
      this.renderer.removeClass(this.document.body, _.class);
    });
  }

  sidebarMouseenter(e) {
    if (this.config.layout.sidebar.collapsed) {
      this.isMenuCollapsedOnHover = false;
      this.layoutService.overlaySidebartoggle(this.isMenuCollapsedOnHover);
    }
  }

  sidebarMouseleave(e) {
    if (this.config.layout.sidebar.collapsed) {
      this.isMenuCollapsedOnHover = true;
      this.layoutService.overlaySidebartoggle(this.isMenuCollapsedOnHover);
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  onOutsideClick(e) {
    if (this.innerWidth < 1200) {
      if (
        !e.target.classList.contains("toggleSidebarNavbarButton")
      ) {
        this.layoutService.toggleSidebarSmallScreen(false);
      }
    }
  }

  onWrapperClick() {
    this.isNavbarSeachTextEmpty = true;
  }

  checkNavbarSeachTextEmpty($event) {
    this.isNavbarSeachTextEmpty = $event;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
      this.innerWidth = event.target.innerWidth;
      this.setMenuLayout();
      this.hideCompactMenuOnSmallScreen();
    }).bind(this), 500);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (number > 60) {
      this.renderer.addClass(this.document.body, "navbar-scrolled");
    } else {
      this.renderer.removeClass(this.document.body, "navbar-scrolled");
    }

    if (number > 400) {
      this.isScrollTopVisible = true;
    } else {
      this.isScrollTopVisible = false;
    }

    if (number > 20) {
      this.renderer.addClass(this.document.body, "page-scrolled");
    } else {
      this.renderer.removeClass(this.document.body, "page-scrolled");
    }
  }

}
