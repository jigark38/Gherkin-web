import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[fivNumTwoDecimal]'
})
export class FivNumTwoDecimalDirective {
    // tslint:disable-next-line: no-input-rename
    @Input('decimals') decimals: number = 0;
    // tslint:disable-next-line: no-input-rename
    @Input('negative') negative: number = 0;

    private check(value: string) {
        return String(value).match(new RegExp(/^(\.\d{1,2}|\d{1,5}\.?\d{0,2}|\d{4}\.?\d?|\d{5}\.?)$/));
    }

    private run(oldValue) {
        setTimeout(() => {
            const currentValue: string = this.el.nativeElement.value;
            const allowNegative = this.negative > 0 ? true : false;

            if (currentValue !== '' && !this.check(currentValue)) {
                this.el.nativeElement.value = oldValue;
            }
        });
    }

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.run(this.el.nativeElement.value);
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        this.run(this.el.nativeElement.value);
    }
}