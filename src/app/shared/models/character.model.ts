import { Item } from './item.model';
import { Statistic } from './statistic.model';
export interface Character {
  id?: string;
  userId?: string;
  name: string;
  personality: string;
  appearance: string;
  backstory: string;
  story: string;
  turn: number;
  phase: string;
  inCombat: boolean;
  gold: number;
  inventory: Item[];
  statistics: Statistic[];
}
