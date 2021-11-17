import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { BaseUser } from '@shared/models/base.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseService<T extends BaseUser> {
  protected collection?: AngularFirestoreCollection<T> | null;
  constructor(
    public collectionName: string,
    protected firestore: AngularFirestore,
    protected userService: UserService
  ) {}

  protected getCollection(user: firebase.User): AngularFirestoreCollection<T> {
    if (!this.collection) {
      this.collection = this.firestore.collection<T>(`${this.collectionName}`);
    }
    return this.collection;
  }

  public listItems(user: firebase.User): Observable<T[]> {
    return this.getCollection(user)
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<T>[]) => {
          return items.map((item: DocumentChangeAction<T>) => {
            return {
              ...item.payload.doc.data(),
              id: item.payload.doc.id
            };
          });
        })
      );
  }

  public async createItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    item.userId = user.uid;
    await this.getCollection(user).add(item);
  }

  public async deleteItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    await this.getCollection(user).doc(item.id).delete();
  }

  public async updateItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    await this.getCollection(user).doc(item.id).update(item);
  }

  public async setItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    await this.getCollection(user).doc(item.id).set(item);
  }
}
