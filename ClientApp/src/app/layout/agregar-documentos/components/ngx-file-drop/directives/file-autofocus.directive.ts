import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appFileAutofocus]'
})
export class FileAutofocusDirective implements OnInit {
  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
      setTimeout(() => this.elementRef.nativeElement.focus(), 500);
  }
}
