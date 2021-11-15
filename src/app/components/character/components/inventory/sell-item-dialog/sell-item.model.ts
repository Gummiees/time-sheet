import { Item } from '@shared/models/item.model';

export interface SellItem {
  price: number;
  item: Item;
  quantity: number;
}
