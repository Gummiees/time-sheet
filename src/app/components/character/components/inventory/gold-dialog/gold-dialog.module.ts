import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { GoldDialogComponent } from './gold-dialog.component';
@NgModule({
  declarations: [GoldDialogComponent],
  imports: [SharedModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  exports: [GoldDialogComponent],
  providers: []
})
export class GoldDialogModule {}
