import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DicePipeModule } from '@shared/pipes/dice/dice-pipe.module';
import { SharedModule } from '@shared/shared.module';
import { TableModule } from 'primeng/table';
import { SkillDialogComponent } from './skill-dialog.component';
@NgModule({
  declarations: [SkillDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    TableModule,
    DicePipeModule
  ],
  exports: [SkillDialogComponent],
  providers: []
})
export class SkillDialogModule {}
