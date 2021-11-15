import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { TableModule } from 'primeng/table';
import { AddDialogModule } from './add-dialog/add-dialog.module';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories.routes';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    SharedModule,
    CategoriesRoutingModule,
    TableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    AddDialogModule
  ]
})
export class CategoriesModule {}
