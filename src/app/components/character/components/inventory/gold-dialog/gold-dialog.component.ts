import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gold-dialog',
  templateUrl: './gold-dialog.component.html'
})
export class GoldDialogComponent {
  form: FormGroup = new FormGroup({});
  quantityControl: FormControl = new FormControl(null, [Validators.required, Validators.min(0)]);
  constructor(
    public dialogRef: MatDialogRef<GoldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.quantityControl.setValue(data);
    this.form.addControl('quantity', this.quantityControl);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.quantityControl.value);
    }
  }
}
