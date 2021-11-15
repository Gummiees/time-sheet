import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from '@shared/models/category.model';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html'
})
export class AddDialogComponent {
  form: FormGroup = new FormGroup({});
  nameControl: FormControl = new FormControl(null, [Validators.required]);
  colorControl: FormControl = new FormControl(null, [Validators.required]);
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>) {
    this.form.addControl('name', this.nameControl);
    this.form.addControl('color', this.colorControl);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const category: Category = {
        name: this.nameControl.value,
        color: this.colorControl.value
      };
      this.dialogRef.close(category);
    }
  }
}
