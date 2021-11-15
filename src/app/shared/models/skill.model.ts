import { Base } from './base.model';
import { Dice } from './dice.model';

export interface StatAffected extends Base {
  statId?: string;
  value: number;
}

export interface Skill extends Base {
  name: string;
  description?: string;
  active: boolean;
  doesRollDice: boolean;
  whenRollDice?: string;
  turnBased: boolean;
  turnsLeft: number;
  level?: number;
  caster_name?: string;
  stats: StatAffected[];
  dices: Dice[];
}
