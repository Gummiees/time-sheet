import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { AddItemDialogComponent } from './add-item-dialog.component';
@NgModule({
  declarations: [AddItemDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  exports: [AddItemDialogComponent],
  providers: []
})
export class AddItemDialogModule {}
