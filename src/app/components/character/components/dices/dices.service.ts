import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Dice } from '@shared/models/dice.model';
import { BaseService } from '@shared/services/base.service';
import { UserService } from '@shared/services/user.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Character } from '@shared/models/character.model';

@Injectable()
export class DiceService extends BaseService<Dice> {
  protected userCollection?: AngularFirestoreCollection<Dice> | null;
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('dices', firestore, userService);
  }

  protected getUserCollection(
    character: Character,
    user: firebase.User
  ): AngularFirestoreCollection<Dice> {
    if (!this.userCollection) {
      this.userCollection = this.firestore.collection<Dice>(
        `characters/${character.id}/dices`,
        (ref) => ref.where('userId', '==', user.uid)
      );
    }
    return this.userCollection;
  }

  listAllItems(character: Character, user: firebase.User): Observable<Dice[]> {
    return combineLatest([this.listUserItems(character, user), super.listItems()]).pipe(
      map((dices: any) => {
        dices = dices.flat() as Dice[];
        return dices.sort((a: Dice, b: Dice) => {
          if (a.sides < b.sides) {
            return -1;
          }
          if (a.sides > b.sides) {
            return 1;
          }

          if (a.mult < b.mult) {
            return -1;
          }
          if (a.mult > b.mult) {
            return 1;
          }
          return 0;
        });
      })
    );
  }

  private listUserItems(character: Character, user: firebase.User): Observable<Dice[]> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    return this.getUserCollection(character, user)
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Dice>[]) => {
          return items.map((item: DocumentChangeAction<Dice>) => {
            return {
              ...item.payload.doc.data(),
              id: item.payload.doc.id
            };
          });
        })
      );
  }

  public async createItem(character: Character, item: Dice): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    item.userId = user.uid;
    await this.getUserCollection(character, user).add(item);
  }

  public async deleteItem(character: Character, item: Dice): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    await this.getUserCollection(character, user).doc(item.id).delete();
  }

  public async updateItem(character: Character, item: Dice): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    await this.getUserCollection(character, user).doc(item.id).update(item);
  }

  public async setItem(character: Character, item: Dice): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    await this.getUserCollection(character, user).doc(item.id).set(item);
  }
}
