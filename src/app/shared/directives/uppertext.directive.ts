import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[UpperCase]'
})
export class UpperCaseDirective {

  constructor(public ref: ElementRef, private control: NgControl, private renderer: Renderer2) {
    if (this.control.control) {
      this.control.control.valueChanges.subscribe((value: any) => {
        this.control.control.setValue(value.toUpperCase());
      });
    }
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    if (this.ref != null) {
      this.renderer.listen(this.ref.nativeElement, 'input', (event) => {
        // handle the event
        const upper = event.target.value;
        this.control.control.setValue(upper.toUpperCase());
      });
      this.renderer.listen(this.ref.nativeElement, 'onchanges', (event) => {
        // handle the event
        const upper = event.target.value;
        this.control.control.setValue(upper.toUpperCase());
      });
    }
  }
}
