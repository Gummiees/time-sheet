import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '@shared/models/item.model';
import { SellItem } from './sell-item.model';

@Component({
  selector: 'app-sell-item-dialog',
  templateUrl: './sell-item-dialog.component.html'
})
export class SellItemDialogComponent {
  form: FormGroup = new FormGroup({});
  priceControl: FormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  quantityControl: FormControl = new FormControl(1);
  switchPriceControl: FormControl = new FormControl(false);
  switchSellAllControl: FormControl = new FormControl(false);
  constructor(
    public dialogRef: MatDialogRef<SellItemDialogComponent>,
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
    this.form.addControl('switchSellAll', this.switchSellAllControl);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const sellItem: SellItem = {
        item: this.data,
        price: this.getPrice(),
        quantity: this.getQuantity()
      };
      this.dialogRef.close(sellItem);
    }
  }

  public soldForTitle(): string {
    if (this.switchPriceControl.value || this.switchSellAllControl.value) {
      return '(total price)';
    }
    return '(unit price)';
  }

  private getPrice(): number {
    if (this.switchPriceControl.value || this.switchSellAllControl.value) {
      return this.priceControl.value;
    }
    return this.priceControl.value * this.getQuantity();
  }

  private getQuantity(): number {
    if (this.switchSellAllControl.value) {
      return this.data.quantity;
    }
    return this.quantityControl.value;
  }
}
