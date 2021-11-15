import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Category } from '@shared/models/category.model';
import firebase from 'firebase/compat/app';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private firestore: AngularFirestore) {}

  listItems(user: firebase.User): Observable<[Category[], Category[]]> {
    return combineLatest([this.listUserItems(user), this.listUserItems()]);
  }

  listItemsMaintenance(user: firebase.User): Observable<Category[]> {
    return this.listUserItems(user);
  }

  async createItem(item: Category, user: firebase.User): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (user) {
        item.userId = user.uid;
        await this.firestore.collection<Category>('categories').add(item);
        resolve();
      }
      reject('Not signed in!');
    });
  }

  async updateItem(item: Category): Promise<void> {
    return this.firestore.collection<Category>('categories').doc(item.id).set(item);
  }

  async deleteItem(item: Category): Promise<void> {
    return this.firestore.collection<Category>('categories').doc(item.id).delete();
  }

  private listUserItems(user?: firebase.User): Observable<Category[]> {
    return this.firestore
      .collection<Category>('categories', (ref) => ref.where('userId', '==', user?.uid || null))
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Category>[]) => {
          return items
            .map((item: DocumentChangeAction<Category>) => {
              const data: Category = item.payload.doc.data() as Category;
              data.id = item.payload.doc.id;
              return data;
            })
            .sort((a: Category, b: Category) => a.name.localeCompare(b.name));
        })
      );
  }
}
