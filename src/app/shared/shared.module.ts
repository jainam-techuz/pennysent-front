import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { OverlayModule } from '@angular/cdk/overlay';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PipeModule } from 'app/shared/pipes/pipe.module';
import { AutocompleteModule } from './components/autocomplete/autocomplete.module';

// COMPONENTS
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { CustomizerComponent } from './customizer/customizer.component';
import { VerticalMenuComponent } from "./vertical-menu/vertical-menu.component";
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';

// DIRECTIVES
import { SidebarDirective } from './directives/sidebar.directive';
import { SidebarLinkDirective } from './directives/sidebar-link.directive';
import { SidebarDropdownDirective } from './directives/sidebar-dropdown.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebar-anchor-toggle.directive';
import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        VerticalMenuComponent,
        ControlMessagesComponent,
        CustomizerComponent,
        SidebarDirective,
        NgbModule,
        PipeModule,
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        FormsModule,
        OverlayModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        ClickOutsideModule,
        AutocompleteModule,
        PipeModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        VerticalMenuComponent,
        ControlMessagesComponent,
        CustomizerComponent,
        SidebarLinkDirective,
        SidebarDropdownDirective,
        SidebarAnchorToggleDirective,
        ToggleFullscreenDirective,
        SidebarDirective,
    ]
})
export class SharedModule { }
