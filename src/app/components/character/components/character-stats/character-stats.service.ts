import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Character } from '@shared/models/character.model';
import { Statistic, DefaultStat } from '@shared/models/statistic.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatsService {
  private collection?: AngularFirestoreCollection<Statistic> | null;
  constructor(private firestore: AngularFirestore, private userService: UserService) {}

  private getCollection(
    character: Character,
    user: firebase.User
  ): AngularFirestoreCollection<Statistic> {
    if (!this.collection) {
      this.collection = this.firestore.collection<Statistic>(
        `characters/${character.id}/statistics`,
        (ref) => ref.where('userId', '==', user.uid)
      );
    }
    return this.collection;
  }

  public listStats(character: Character, user: firebase.User): Observable<Statistic[]> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    return this.getCollection(character, user)
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Statistic>[]) => {
          return items
            .map((item: DocumentChangeAction<Statistic>) => {
              return {
                ...item.payload.doc.data(),
                id: item.payload.doc.id
              };
            })
            .sort((a: Statistic, b: Statistic) => a.abv.localeCompare(b.abv));
        })
      );
  }

  public async createStat(character: Character, stat: Statistic): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    stat.userId = user.uid;
    await this.getCollection(character, user).add(stat);
  }

  public async deleteStat(character: Character, stat: Statistic): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    await this.getCollection(character, user).doc(stat.id).delete();
  }

  public async setStat(character: Character, stat: Statistic): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    await this.getCollection(character, user).doc(stat.id).set(stat);
  }

  public async updateStat(character: Character, stat: Statistic): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    await this.getCollection(character, user).doc(stat.id).update(stat);
  }

  public async addDefautStats(character: Character): Promise<void> {
    if (!character.id) {
      throw new Error('Character ID is required');
    }
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }

    const defaultStats: DefaultStat[] = await this.getDefaultStats();
    for (const defaultStat of defaultStats) {
      const newStat: Statistic = {
        ...defaultStat,
        current: 10,
        userId: user.uid,
        total: 10
      };
      await this.getCollection(character, user).add(newStat);
    }
  }

  private async getDefaultStats(): Promise<DefaultStat[]> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }

    return this.firestore
      .collection<DefaultStat>('statistics')
      .snapshotChanges()
      .pipe(
        first(),
        map((items: DocumentChangeAction<DefaultStat>[]) => {
          return items.map((item: DocumentChangeAction<DefaultStat>) => {
            return {
              ...item.payload.doc.data(),
              id: item.payload.doc.id
            };
          });
        })
      )
      .toPromise();
  }
}
