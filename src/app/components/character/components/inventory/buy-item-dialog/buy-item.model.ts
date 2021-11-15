import { Item } from '@shared/models/item.model';

export interface BuyItem {
  price: number;
  item: Item;
  quantity: number;
}
