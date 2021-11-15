import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '@shared/shared.module';
import { SellItemDialogComponent } from './sell-item-dialog.component';
@NgModule({
  declarations: [SellItemDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  exports: [SellItemDialogComponent],
  providers: []
})
export class SellItemDialogModule {}
