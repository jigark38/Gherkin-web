import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
    selector: 'app-base',
    template: ``
})

export class BaseComponent implements OnDestroy {

    public destroyed = new Subject();
    constructor() { }
    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
        this.destroyed.unsubscribe();
    }
}
