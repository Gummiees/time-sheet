import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '@shared/models/character.model';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { Dice } from '@shared/models/dice.model';
import { CommonService } from '@shared/services/common.service';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';
import { Subscription, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';
import { DiceDialogComponent, DiceDialogData } from './dice-dialog/dice-dialog.component';
import { DiceService } from './dices.service';
import firebase from 'firebase/compat/app';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html'
})
export class DicesComponent implements OnDestroy {
  dices: Dice[] = [];
  form: FormGroup = new FormGroup({});
  selectedDicesControl: FormControl = new FormControl([], [Validators.required]);
  private subscriptions: Subscription[] = [];
  constructor(
    public loadersService: LoadersService,
    private commonService: CommonService,
    private userService: UserService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private diceService: DiceService,
    private router: Router
  ) {
    this.form = new FormGroup({
      name: this.selectedDicesControl
    });
    this.subscribeToDices();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public buttonsDisabled(): boolean {
    return this.loadersService.dicesLoading;
  }

  public removeDice(oldDice: Dice) {
    const index: number = this.selectedDicesControl.value.findIndex(
      (dice: Dice) => dice.id === oldDice.id
    );
    if (index > -1) {
      this.selectedDicesControl.value.splice(index, 1);
    }
  }

  public onSelect(dice: Dice) {
    const dices: Dice[] = [...this.selectedDicesControl.value, dice];
    console.log('dices', dices);
    this.selectedDicesControl.setValue(dices);
  }

  public isSelected(dice: Dice) {
    return this.selectedDicesControl.value.some((d: Dice) => d.id === dice.id);
  }

  public onSubmit() {
    if (this.form.valid) {
      // TODO: Roll dices
    }
  }

  public async onAdd() {
    const dice: Dice | null = await this.openStatDetailsDialog();
    if (!this.commonService.isNullOrUndefined(dice)) {
      this.create(dice as Dice);
    }
  }

  public async onEdit(dice: Dice) {
    const newDice: Dice | null = await this.openStatDetailsDialog(dice);
    if (!this.commonService.isNullOrUndefined(newDice)) {
      this.update(newDice as Dice);
    }
  }

  public async onDelete(dice: Dice) {
    const dialogModel: BasicDialogModel = {
      body: 'Are you sure you want to delete the dice?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete(dice));
  }

  public showActions(): boolean {
    return this.dices.some((dice) => dice.userId);
  }

  private openStatDetailsDialog(dice?: Dice): Promise<Dice | null> {
    const data: DiceDialogData = {
      dice: dice
    };
    return this.dialogService
      .openGenericDialog(DiceDialogComponent, data)
      .pipe(first())
      .toPromise();
  }

  private async create(dice: Dice) {
    this.loadersService.dicesLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.diceService.createItem(character, dice);
        this.messageService.showOk('Stat added successfully');
      } else {
        this.messageService.showLocalError('You must have a character to add a dice');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.dicesLoading = false;
  }

  private async update(dice: Dice) {
    this.loadersService.dicesLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.diceService.updateItem(character, dice);
        this.messageService.showOk('Dice saved successfully');
      } else {
        this.messageService.showLocalError('You must have a character');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.dicesLoading = false;
  }

  private async delete(dice: Dice) {
    this.loadersService.dicesLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.diceService.deleteItem(character, dice);
        this.messageService.showOk('Stat deleted successfully');
      } else {
        this.messageService.showLocalError('You must have a character to delete a dice');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.dicesLoading = false;
  }

  private async subscribeToDices() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.loadersService.dicesLoading = true;
        const sub: Subscription = this.diceService
          .listAllItems(character, user)
          .pipe(
            catchError((err) => {
              this.loadersService.dicesLoading = false;
              this.messageService.showError(err);
              return throwError(err);
            })
          )
          .subscribe((dices: Dice[]) => {
            this.dices = dices;
            this.loadersService.dicesLoading = false;
          });
        this.subscriptions.push(sub);
      } else {
        this.messageService.showLocalError('You must have a character');
        this.router.navigate(['/create']);
      }
    } else {
      this.messageService.showLocalError('You must be logged in');
    }
  }
}
