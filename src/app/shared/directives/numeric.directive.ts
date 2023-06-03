import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[numeric]'
})
export class NumericDirective {
    // tslint:disable-next-line: no-input-rename
    @Input('decimals') decimals: number = 0;
    // tslint:disable-next-line: no-input-rename
    @Input('negative') negative: number = 0;

    private checkAllowNegative(value: string) {
        if (this.decimals <= 0) {
            return String(value).match(new RegExp(/^-?\d+$/));
        } else {
            const regExpString =
                '^-?\\s*((\\d+(\\.\\d{0,' +
                this.decimals +
                '})?)|((\\d*(\\.\\d{1,' +
                this.decimals +
                '}))))\\s*$';
            return String(value).match(new RegExp(regExpString));
        }
    }

    private check(value: string) {
        if (this.decimals <= 0) {
            return String(value).match(new RegExp(/^\d+$/));
        } else {
            const regExpString =
                '^\\s*((\\d+(\\.\\d{0,' +
                this.decimals +
                '})?)|((\\d*(\\.\\d{1,' +
                this.decimals +
                '}))))\\s*$';
            return String(value).match(new RegExp(regExpString));
        }
    }

    private run(oldValue) {
        setTimeout(() => {
            const currentValue: string = this.el.nativeElement.value;
            const allowNegative = this.negative > 0 ? true : false;

            if (allowNegative) {
                if (
                    !['', '-'].includes(currentValue) &&
                    !this.checkAllowNegative(currentValue)
                ) {
                    this.el.nativeElement.value = oldValue;
                }
            } else {
                if (currentValue !== '' && !this.check(currentValue)) {
                    this.el.nativeElement.value = oldValue;
                }
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