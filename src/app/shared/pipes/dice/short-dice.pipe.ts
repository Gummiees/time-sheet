import { Pipe, PipeTransform } from '@angular/core';
import { Dice } from '@shared/models/dice.model';

@Pipe({ name: 'shortDicePipe' })
export class ShortDicePipe implements PipeTransform {
  transform(dice: Dice): string {
    let result = `D${dice.sides}`;
    if (dice.mult > 1) {
      result += ` x${dice.mult}`;
    }
    return result;
  }
}
