import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '@shared/models/item.model';
import { BuyItem } from './buy-item.model';

@Component({
  selector: 'app-buy-item-dialog',
  templateUrl: './buy-item-dialog.component.html'
})
export class BuyItemDialogComponent {
  form: FormGroup = new FormGroup({});
  priceControl: FormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  quantityControl: FormControl = new FormControl(1);
  switchPriceControl: FormControl = new FormControl(false);
  constructor(
    public dialogRef: MatDialogRef<BuyItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {
    this.quantityControl.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.data.quantity)
    ]);
    this.form.addControl('price', this.priceControl);
    this.form.addControl('quantity', this.quantityControl);
    this.form.addControl('switchPrice', this.switchPriceControl);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const BuyItem: BuyItem = {
        item: this.data,
        price: this.getPrice(),
        quantity: this.quantityControl.value
      };
      this.dialogRef.close(BuyItem);
    }
  }

  public buyForTitle(): string {
    if (this.switchPriceControl.value) {
      return '(total price)';
    }
    return '(unit price)';
  }

  private getPrice(): number {
    if (this.switchPriceControl.value) {
      return this.priceControl.value;
    }
    return this.priceControl.value * this.quantityControl.value;
  }
}
