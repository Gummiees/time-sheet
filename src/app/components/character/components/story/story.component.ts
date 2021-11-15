import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Character } from '@shared/models/character.model';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { Subscription } from 'rxjs';
import { debounceTime, filter, skip } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoryComponent implements OnDestroy {
  form: FormGroup = new FormGroup({});
  storyControl: FormControl = new FormControl(null);
  private character?: Character;
  private subscriptions: Subscription[] = [];
  constructor(
    public loadersService: LoadersService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.setForm();
    this.subscribeToStory();
    this.patchCharacter();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onSubmit() {
    if (this.form.valid) {
      const story: string = this.form.value.story;
      this.save(story);
    }
  }

  isDisabled(): boolean {
    return (
      this.form.invalid ||
      (this.form.untouched && this.form.pristine) ||
      this.loadersService.storyLoading
    );
  }

  private setForm() {
    this.form = new FormGroup({
      story: this.storyControl
    });
  }

  private async patchCharacter() {
    this.loadersService.storyLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.character = character;
        this.storyControl.setValue(character.story);
      } else {
        this.messageService.showLocalError('Character not found');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.storyLoading = false;
  }

  private subscribeToStory() {
    const sub: Subscription = this.storyControl.valueChanges
      .pipe(
        debounceTime(5000),
        filter(() => this.form.touched || this.form.dirty)
      )
      .subscribe((val: string) => this.save(val));
    this.subscriptions.push(sub);
  }

  private async save(story: string) {
    this.loadersService.storyLoading = true;
    try {
      if (this.character) {
        this.character.story = story;
        await this.characterService.updateCharacter(this.character);
        this.form.markAsUntouched();
        this.form.markAsPristine();
        this.messageService.showOk('Character updated successfully');
      } else {
        this.messageService.showLocalError('Character not found');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.storyLoading = false;
  }
}
