import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DicePipeModule } from '@shared/pipes/dice/dice-pipe.module';
import { SharedModule } from '@shared/shared.module';
import { DiceDialogComponent } from './dice-dialog.component';
@NgModule({
  declarations: [DiceDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DicePipeModule
  ],
  exports: [DiceDialogComponent],
  providers: []
})
export class DiceDialogModule {}
