import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Character } from '@shared/models/character.model';
import { Item } from '@shared/models/item.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseCharacterService } from '../../services/base-character.service';
import { BuyItem } from './buy-item-dialog/buy-item.model';
import { SellItem } from './sell-item-dialog/sell-item.model';

@Injectable()
export class InventoryService extends BaseCharacterService<Item> {
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('inventory', firestore, userService);
  }

  public listItems(character: Character, user: firebase.User): Observable<Item[]> {
    return super
      .listItems(character, user)
      .pipe(map((items: Item[]) => items.sort((a: Item, b: Item) => a.name.localeCompare(b.name))));
  }

  public async sellItem(character: Character, sellItem: SellItem): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }

    if (sellItem.quantity >= sellItem.item.quantity) {
      await this.getCollection(character, user).doc(sellItem.item.id).delete();
    } else {
      const increment: any = firebase.firestore.FieldValue.increment(sellItem.quantity * -1);
      await this.getCollection(character, user)
        .doc(sellItem.item.id)
        .update({ quantity: increment });
    }
  }

  public async buyItem(character: Character, buyItem: BuyItem): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    const increment: any = firebase.firestore.FieldValue.increment(buyItem.quantity);
    await this.getCollection(character, user).doc(buyItem.item.id).update({ quantity: increment });
  }
}
