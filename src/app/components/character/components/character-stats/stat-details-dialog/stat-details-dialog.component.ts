import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dice } from '@shared/models/dice.model';
import { Statistic } from '@shared/models/statistic.model';
import { ValidatorsService } from '@shared/services/validators.service';

export interface StatDialogData {
  statistic: Statistic | null | undefined;
  dices: Dice[];
}

@Component({
  selector: 'app-stat-details-dialog',
  templateUrl: './stat-details-dialog.component.html'
})
export class StatDetailsDialogComponent {
  form: FormGroup = new FormGroup({});
  abvControl: FormControl = new FormControl(null, [Validators.required]);
  nameControl: FormControl = new FormControl(null, [Validators.required]);
  totalControl: FormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  currentControl: FormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  dicesControl: FormControl = new FormControl([], [Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<StatDetailsDialogComponent>,
    private validatorsService: ValidatorsService,
    @Inject(MAT_DIALOG_DATA) public data: StatDialogData
  ) {
    this.initForm();
    this.initData();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const stat: Statistic = this.form.value as Statistic;
      this.dialogRef.close(stat);
    }
  }

  private initForm() {
    this.form = new FormGroup(
      {
        abv: this.abvControl,
        name: this.nameControl,
        total: this.totalControl,
        current: this.currentControl,
        dices: this.dicesControl
      },
      this.validatorsService.exceedsTotal('current', 'total')
    );
  }

  private initData() {
    if (this.data && this.data.statistic) {
      this.form.patchValue(this.data.statistic);
    }
  }
}
