import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Character } from '@shared/models/character.model';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { first } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-character-info',
  templateUrl: './character-info.component.html'
})
export class CharacterInfoComponent {
  form: FormGroup = new FormGroup({});
  nameControl: FormControl = new FormControl(null, [Validators.required]);
  backstoryControl: FormControl = new FormControl(null);
  personalityControl: FormControl = new FormControl(null);
  appearanceControl: FormControl = new FormControl(null);
  constructor(
    public loadersService: LoadersService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.setForm();
    this.patchCharacter();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loadersService.characterInfoLoading = true;
      try {
        const character: Character = this.form.value as Character;
        await this.characterService.updateCharacter(character);
        this.messageService.showOk('Character updated successfully');
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.disable();
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.characterInfoLoading = false;
    }
  }

  public async onCancel() {
    this.patchCharacter();
    this.form.disable();
  }

  public async onDelete() {
    const dialogModel: BasicDialogModel = {
      header: 'Delete character',
      body: 'Are you sure you want to delete your character? Everything related to your character will be erased forever!'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete());
  }

  private async delete() {
    const character: Character | null = await this.characterService.character;
    if (character) {
      this.loadersService.characterInfoLoading = true;
      try {
        await this.characterService.deleteCharacter(character);
        this.router.navigate(['/create']);
        this.messageService.showOk('Character deleted successfully');
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.characterInfoLoading = false;
    } else {
      this.messageService.showLocalError('Character not found');
      this.router.navigate(['/create']);
    }
  }

  public onEdit() {
    this.form.enable();
  }

  private setForm() {
    this.form = new FormGroup({
      name: this.nameControl,
      backstory: this.backstoryControl,
      personality: this.personalityControl,
      appearance: this.appearanceControl
    });
    this.form.disable();
  }

  private async patchCharacter() {
    this.loadersService.characterInfoLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.form.patchValue(character);
      } else {
        this.messageService.showLocalError('Character not found');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.characterInfoLoading = false;
  }
}
