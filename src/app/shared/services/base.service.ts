import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Base } from '@shared/models/base.model';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseService<T extends Base> {
  protected collection?: AngularFirestoreCollection<T> | null;
  constructor(
    public collectionName: string,
    protected firestore: AngularFirestore,
    protected userService: UserService
  ) {}

  protected getCollection(): AngularFirestoreCollection<T> {
    if (!this.collection) {
      this.collection = this.firestore.collection<T>(`${this.collectionName}`);
    }
    return this.collection;
  }

  public listItems(): Observable<T[]> {
    return this.getCollection()
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
}
