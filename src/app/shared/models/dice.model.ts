import { Base, BaseUser } from './base.model';

export interface Dice extends BaseUser {
  sides: number;
  mult: number;
}
