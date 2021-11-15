import { Directive, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[saveCmd]'
})
export class SaveCmdDirective {
  @HostListener('keydown.control.s', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    console.log('control and s');
  }
}
