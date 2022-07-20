import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, AfterViewInit, OnDestroy, OnInit, Injector } from '@angular/core';
import { BaseComponent } from './shared/components/base/base.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    subscription: Subscription;
    routeOptions: any;
    private _router: Subscription;
    public onlineEvent: Observable<Event>;
    public offlineEvent: Observable<Event>;
    public subscriptions: Subscription[] = [];
    impersonate_mode: string;
    constructor(
        private titleService: Title,
        private route: ActivatedRoute,
        injector: Injector,
    ) {
        super(injector);
    }

    async ngOnInit() {
        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');
        this.subscriptions.push(this.onlineEvent.subscribe(event => {
            this.toastr.success('You are online');
        }));
        this.subscriptions.push(this.offlineEvent.subscribe(e => {
            this.toastr.error('Please check your internet connection');
        }));
        this._router = this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.runOnRouteChange();
            }
        });
        this.subscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => window.scrollTo(0, 0));
    }

    ngAfterViewInit(): void {
        setTimeout(_ => this.runOnRouteChange());
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this._router.unsubscribe();
    }

    runOnRouteChange(): void {
        this.route.children.forEach((route: ActivatedRoute) => {
            let activeRoute: ActivatedRoute = route;
            while (activeRoute.firstChild) {
                activeRoute = activeRoute.firstChild;
            }
            this.routeOptions = activeRoute.snapshot.data;
        });

        if (this.routeOptions) {
            if (this.routeOptions.hasOwnProperty('title')) {
                this.setTitle(this.routeOptions.title);
            }
        }
    }

    setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle + ' | PennySent');
    }
}
