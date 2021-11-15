import { Pipe, PipeTransform } from '@angular/core';
import { Dice } from '@shared/models/dice.model';

@Pipe({ name: 'dicePipe' })
export class DicePipe implements PipeTransform {
  transform(dice: Dice): string {
    let result = `D${dice.sides}`;
    if (dice.mult > 1) {
      result += ` - Multiplier: ${dice.mult}`;
    }
    return result;
  }
}
