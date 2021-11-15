import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Character } from '@shared/models/character.model';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { CharacterService } from '../character/services/character.service';
import firebase from 'firebase/compat/app';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html'
})
export class CharacterCreateComponent {
  form: FormGroup = new FormGroup({});
  nameControl: FormControl = new FormControl(null, [Validators.required]);
  backstoryControl: FormControl = new FormControl(null);
  personalityControl: FormControl = new FormControl(null);
  appearanceControl: FormControl = new FormControl(null);
  constructor(
    public loadersService: LoadersService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {
    this.setForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loadersService.createCharacterLoading = true;
      try {
        const user: firebase.User | null = await this.userService.user;
        if (user) {
          const character: Character = this.form.value as Character;
          await this.characterService.createCharacter(character, user);
          this.messageService.showOk('Character created successfully. Enjoy!');
          this.router.navigate(['/statistics']);
        } else {
          this.messageService.showLocalError('You must be logged in to create a character');
        }
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.createCharacterLoading = false;
    }
  }

  private setForm() {
    this.form = new FormGroup({
      name: this.nameControl,
      backstory: this.backstoryControl,
      personality: this.personalityControl,
      appearance: this.appearanceControl
    });
  }
}
