import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dice } from '@shared/models/dice.model';
import { Statistic } from '@shared/models/statistic.model';

export interface DiceDialogData {
  dice: Dice | null | undefined;
}

@Component({
  selector: 'app-dice-dialog',
  templateUrl: './dice-dialog.component.html'
})
export class DiceDialogComponent {
  form: FormGroup = new FormGroup({});
  sidesControl: FormControl = new FormControl(null, [Validators.required]);
  multiplierControl: FormControl = new FormControl(1, [Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<DiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiceDialogData
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
    this.form = new FormGroup({
      sides: this.sidesControl,
      mult: this.multiplierControl
    });
  }

  private initData() {
    if (this.data && this.data.dice) {
      this.form.patchValue(this.data.dice);
    }
  }
}
