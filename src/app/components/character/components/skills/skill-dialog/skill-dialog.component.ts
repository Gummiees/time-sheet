import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dice } from '@shared/models/dice.model';
import { Skill, StatAffected } from '@shared/models/skill.model';
import { Statistic } from '@shared/models/statistic.model';
import { GlobalService } from '@shared/services/global.service';
import { Subscription } from 'rxjs';

export interface SkillDialogData {
  skill: Skill | null | undefined;
  readonly: boolean;
  statistics: Statistic[];
  dices: Dice[];
}

@Component({
  selector: 'app-skill-dialog',
  templateUrl: './skill-dialog.component.html'
})
export class SkillDialogComponent implements OnDestroy {
  form: FormGroup = new FormGroup({});
  nameControl: FormControl = new FormControl(null, [Validators.required]);
  descriptionControl: FormControl = new FormControl(null);
  activeControl: FormControl = new FormControl(false);
  doesRollDiceControl: FormControl = new FormControl(false);
  whenRollDiceControl: FormControl = new FormControl(this.globalService.turnStart, [
    Validators.required
  ]);
  turnBasedControl: FormControl = new FormControl(false);
  turnsLeftControl: FormControl = new FormControl(0, [Validators.min(0)]);
  levelControl: FormControl = new FormControl(1, [Validators.min(0)]);
  caster_nameControl: FormControl = new FormControl(null);
  statsControl: FormControl = new FormControl([]);
  dicesControl: FormControl = new FormControl([]);
  tableStats: StatAffected[] = [];

  step: number = 0;

  private subscriptions: Subscription[] = [];
  private skillId?: string;
  constructor(
    public globalService: GlobalService,
    public dialogRef: MatDialogRef<SkillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SkillDialogData
  ) {
    this.initForm();
    this.initData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const item: Skill = {
        id: this.skillId,
        name: this.nameControl.value,
        description: this.descriptionControl.value,
        active: this.activeControl.value,
        doesRollDice: this.doesRollDiceControl.value,
        whenRollDice: this.getWhenRollDice(),
        turnBased: this.turnBasedControl.value,
        turnsLeft: this.getTurnsLeft(),
        level: this.levelControl.value,
        caster_name: this.caster_nameControl.value,
        stats: this.tableStats,
        dices: this.dicesControl.value
      };
      this.dialogRef.close(item);
    }
  }

  public onDoesRollDiceChanges() {
    this.doesRollDiceControl.value
      ? this.whenRollDiceControl.enable()
      : this.whenRollDiceControl.disable();
  }

  public onTurnBasedChanges() {
    this.turnBasedControl.value ? this.turnsLeftControl.enable() : this.turnsLeftControl.disable();
  }

  public previous() {
    this.step--;
  }

  public next() {
    this.step++;
  }

  public getStatName(statAffected: StatAffected): string {
    const stat = this.data.statistics.find((stat) => stat.id === statAffected.statId);
    return stat ? stat.name : '';
  }

  private getTurnsLeft(): number {
    if (!this.turnBasedControl.value) {
      return 0;
    }
    return this.turnsLeftControl.value;
  }

  private getWhenRollDice(): string | undefined {
    if (!this.doesRollDiceControl.value) {
      return this.globalService.turnStart;
    }
    return this.whenRollDiceControl.value;
  }

  private initForm() {
    this.form = new FormGroup({
      name: this.nameControl,
      description: this.descriptionControl,
      active: this.activeControl,
      doesRollDice: this.doesRollDiceControl,
      whenRollDice: this.whenRollDiceControl,
      turnBased: this.turnBasedControl,
      turnsLeft: this.turnsLeftControl,
      level: this.levelControl,
      caster_name: this.caster_nameControl,
      stats: this.statsControl,
      dices: this.dicesControl
    });

    const sub: Subscription = this.statsControl.valueChanges.subscribe((stats: Statistic[]) => {
      this.onStatChanges(stats);
    });
    this.subscriptions.push(sub);
  }

  private initData() {
    if (this.data && this.data.skill) {
      this.skillId = this.data.skill.id;
      this.form.patchValue(this.data.skill);
      this.tableStats = this.data.skill.stats;
      debugger;
      if (this.data.readonly) {
        this.form.disable();
      }
    }
  }

  private onStatChanges(stats: Statistic[]) {
    if (!stats || stats.length === 0) {
      this.tableStats = [];
      return;
    }

    if (!this.tableStats || this.tableStats.length === 0) {
      this.tableStats = this.mapStats(stats);
      return;
    }

    if (this.tableStats.length > stats.length) {
      this.tableStats = this.tableStats.filter((skillStat) =>
        stats.some((stat) => stat.id === skillStat.statId)
      );
      return;
    }

    const addedStats: Statistic[] = stats.filter((stat) =>
      this.tableStats.every((skillStat) => stat.id !== skillStat.statId)
    );
    this.tableStats = [...this.tableStats, ...this.mapStats(addedStats)];
  }

  private mapStats(stats: Statistic[]): StatAffected[] {
    return stats.map((stat) => {
      return {
        statId: stat.id,
        value: 0
      };
    });
  }

  private reverseMapStats(stats: StatAffected[]): Statistic[] {
    if (!this.data.statistics || this.data.statistics.length === 0) {
      return [];
    }

    return stats
      .map((stat) => {
        return this.data.statistics.find((statistic) => statistic.id === stat.statId);
      })
      .filter((stat) => stat !== undefined) as Statistic[];
  }
}
