import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Character } from '@shared/models/character.model';
import { Skill } from '@shared/models/skill.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseCharacterService } from '../../services/base-character.service';

@Injectable()
export class SkillService extends BaseCharacterService<Skill> {
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('skills', firestore, userService);
  }

  public listSkills(character: Character, user: firebase.User): Observable<Skill[]> {
    return super
      .listItems(character, user)
      .pipe(map((skills: Skill[]) => skills.sort((a, b) => a.name.localeCompare(b.name))));
  }
}
