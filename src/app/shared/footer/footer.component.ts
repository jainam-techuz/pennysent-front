import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'app/shared/components/base/base.component';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent extends BaseComponent {

    currentDate: Date = new Date();

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

}
