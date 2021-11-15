import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Character } from '@shared/models/character.model';
import { CharacterStatsService } from '../components/character-stats/character-stats.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { GlobalService } from '@shared/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public get character(): Promise<Character | null> {
    if (this._character) {
      return Promise.resolve(this._character);
    }
    return new Promise<Character | null>(async (resolve) => {
      this._character = await this.getCharacter();
      resolve(this._character);
    });
  }
  private _character: Character | null = null;
  constructor(
    private globalService: GlobalService,
    private firestore: AngularFirestore,
    private userService: UserService,
    private characterStatsService: CharacterStatsService
  ) {}

  hasCharacters(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const character: Character | null = await this.character;
      return character ? resolve(true) : resolve(false);
    });
  }

  async getCharacter(): Promise<Character | null> {
    return new Promise(async (resolve) => {
      const user: firebase.User | null = await this.userService.user;
      if (user) {
        this.firestore
          .collection<Character>('characters', (ref) => ref.where('userId', '==', user.uid))
          .snapshotChanges()
          .pipe(
            catchError((err) => {
              console.error(err);
              return of([]);
            }),
            first()
          )
          .subscribe((items: DocumentChangeAction<Character>[]) => {
            if (items && items.length > 0) {
              const data: Character = items[0].payload.doc.data() as Character;
              data.id = items[0].payload.doc.id;
              resolve(data);
            } else {
              resolve(null);
            }
          });
      } else {
        resolve(null);
      }
    });
  }

  async createCharacter(character: Character, user: firebase.User): Promise<Character> {
    character.userId = user.uid;
    character.gold = 0;
    character.turn = 0;
    character.phase = this.globalService.turnStart;
    character.inCombat = false;
    await this.firestore.collection<Character>('characters').add(character);
    let characterSaved: Character = await this.getCharacterOrThrowError();
    await this.characterStatsService.addDefautStats(characterSaved);
    characterSaved = await this.getCharacterOrThrowError();
    this._character = characterSaved;
    return this._character;
  }

  async deleteCharacter(character: Character): Promise<void> {
    if (!character.id) {
      throw Error('Character id is required');
    }
    await this.firestore.collection<Character>('characters').doc(character.id).delete();
    this._character = null;
  }

  async updateCharacter(character: Character): Promise<Character> {
    character.id = this._character?.id;
    await this.firestore.collection<Character>('characters').doc(character.id).update(character);
    this._character = character;
    return this._character;
  }

  async updateGold(amount: number): Promise<Character> {
    const character: Character | null = await this._character;
    if (!character) {
      throw new Error('Character not found');
    }
    const increment: any = firebase.firestore.FieldValue.increment(amount);
    await this.firestore
      .collection<Character>('characters')
      .doc(character.id)
      .update({ gold: increment });
    this._character = character;
    return this._character;
  }

  async setGold(amount: number): Promise<Character> {
    const character: Character | null = await this._character;
    if (!character) {
      throw new Error('Character not found');
    }
    await this.firestore
      .collection<Character>('characters')
      .doc(character.id)
      .update({ gold: amount });
    this._character = character;
    return this._character;
  }

  private async getCharacterOrThrowError(): Promise<Character> {
    const characterSaved: Character | null = await this.getCharacter();
    if (!characterSaved) {
      throw Error('Character not saved');
    }
    return characterSaved;
  }
}
