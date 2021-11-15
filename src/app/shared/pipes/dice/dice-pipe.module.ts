import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DicePipe } from './dice.pipe';
import { ShortDicePipe } from './short-dice.pipe';

@NgModule({
  declarations: [DicePipe, ShortDicePipe],
  imports: [CommonModule],
  exports: [DicePipe, ShortDicePipe],
  providers: []
})
export class DicePipeModule {}
