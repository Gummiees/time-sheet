import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '@shared/models/category.model';
import { Item } from '@shared/models/item.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddItem } from './add-item.model';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html'
})
export class AddItemDialogComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  categoryControl: FormControl = new FormControl(null, [Validators.required]);
  nameControl: FormControl = new FormControl(null, [Validators.required]);
  quantityControl: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  weightControl: FormControl = new FormControl(null, [Validators.required, Validators.min(0)]);
  costControl: FormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  filteredOptions?: Observable<Category[]>;
  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category[]
  ) {
    this.form.addControl('name', this.nameControl);
    this.form.addControl('quantity', this.quantityControl);
    this.form.addControl('weight', this.weightControl);
    this.form.addControl('categoryId', this.categoryControl);
    this.form.addControl('cost', this.costControl);
  }

  ngOnInit(): void {
    this.filteredOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.data.slice()))
    );
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const addItem: AddItem = {
        item: {
          name: this.nameControl.value,
          quantity: this.quantityControl.value,
          weight: this.weightControl.value,
          categoryId: this.categoryControl.value.id
        },
        cost: this.costControl.value
      };
      this.dialogRef.close(addItem);
    }
  }

  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }

  private _filter(name: string): Category[] {
    return this.data.filter((category) => category.name.toLowerCase().includes(name.toLowerCase()));
  }
}
