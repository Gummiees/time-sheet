import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [AddDialogComponent],
  imports: [SharedModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  exports: [AddDialogComponent],
  providers: []
})
export class AddDialogModule {}
