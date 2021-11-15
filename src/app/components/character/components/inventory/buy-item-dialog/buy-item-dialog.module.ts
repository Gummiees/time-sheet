import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '@shared/shared.module';
import { BuyItemDialogComponent } from './buy-item-dialog.component';
@NgModule({
  declarations: [BuyItemDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSlideToggleModule
  ],
  exports: [BuyItemDialogComponent],
  providers: []
})
export class BuyItemDialogModule {}
