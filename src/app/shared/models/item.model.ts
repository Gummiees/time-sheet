import { Base } from './base.model';

export interface Item extends Base {
  name: string;
  quantity: number;
  weight: number;
  categoryId: string;
}
