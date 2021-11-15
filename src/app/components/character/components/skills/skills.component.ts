import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '@shared/models/character.model';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { Dice } from '@shared/models/dice.model';
import { Skill } from '@shared/models/skill.model';
import { Statistic } from '@shared/models/statistic.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Subscription, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { CharacterService } from '../../services/character.service';
import { CharacterStatsService } from '../character-stats/character-stats.service';
import { DiceService } from '../dices/dices.service';
import { SkillDialogComponent, SkillDialogData } from './skill-dialog/skill-dialog.component';
import { SkillService } from './skill.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnDestroy {
  skills: Skill[] = [];
  private stats: Statistic[] = [];
  private dices: Dice[] = [];
  private subscriptions: Subscription[] = [];
  constructor(
    public loadersService: LoadersService,
    private dialogService: DialogService,
    private characterService: CharacterService,
    private statsService: CharacterStatsService,
    private diceService: DiceService,
    private skillService: SkillService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {
    this.subscribeToSkills();
    this.subscribeToStats();
    this.subscribeToDices();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public buttonsDisabled(): boolean {
    return (
      this.loadersService.skillsLoading ||
      this.loadersService.statisticsLoading ||
      this.loadersService.dicesLoading
    );
  }

  public async onCreateSkill() {
    const skill: Skill | null = await this.openSkillDialog();
    if (skill) {
      this.create(skill);
    }
  }

  public onView(skill: Skill) {
    this.openSkillDialog(skill, true);
  }

  public async onEdit(oldSkill: Skill) {
    const skill: Skill | null = await this.openSkillDialog(oldSkill);
    if (skill) {
      this.save(skill);
    }
  }

  public async onDelete(skill: Skill) {
    const dialogModel: BasicDialogModel = {
      body: 'Are you sure you want to delete the skill?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete(skill));
  }

  public onActiveChanges(skill: Skill) {
    this.save(skill);
  }

  private async openSkillDialog(skill?: Skill, readonly?: boolean): Promise<Skill | null> {
    const data: SkillDialogData = {
      skill,
      readonly: readonly || false,
      statistics: this.stats,
      dices: this.dices
    };
    return this.dialogService
      .openGenericDialog(SkillDialogComponent, data)
      .pipe(first())
      .toPromise();
  }

  private async delete(skill: Skill) {
    this.loadersService.skillsLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.skillService.deleteItem(character, skill);
        this.messageService.showOk('Skill deleted successfully');
      } else {
        this.messageService.showLocalError('You must have a character to delete a skill');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.skillsLoading = false;
  }

  private async save(skill: Skill) {
    this.loadersService.skillsLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.skillService.updateItem(character, skill);
        this.messageService.showOk('Skill updated successfully');
      } else {
        this.messageService.showLocalError('You must have a character to update a skill');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.skillsLoading = false;
  }

  private async create(skill: Skill) {
    this.loadersService.skillsLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.skillService.createItem(character, skill);
        this.messageService.showOk('Skill added successfully');
      } else {
        this.messageService.showLocalError('You must have a character to add a skill');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.skillsLoading = false;
  }

  private async subscribeToSkills() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.loadersService.skillsLoading = true;
        const sub: Subscription = this.skillService
          .listItems(character, user)
          .pipe(
            catchError((err) => {
              this.loadersService.skillsLoading = false;
              return throwError(err);
            })
          )
          .subscribe((skills: Skill[]) => {
            this.skills = skills;
            this.loadersService.skillsLoading = false;
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

  private async subscribeToStats() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.loadersService.statisticsLoading = true;
        const sub: Subscription = this.statsService
          .listStats(character, user)
          .pipe(
            catchError((err) => {
              this.loadersService.statisticsLoading = false;
              return throwError(err);
            })
          )
          .subscribe((stats: Statistic[]) => {
            this.stats = stats;
            this.loadersService.statisticsLoading = false;
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
