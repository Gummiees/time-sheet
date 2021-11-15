import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { InputTimeRoutingModule } from './input-time.routes';
import { InputTimeComponent } from './input-time.component';

@NgModule({
  declarations: [InputTimeComponent],
  imports: [
    SharedModule,
    InputTimeRoutingModule,
    AngularFireAuthModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  exports: [],
  providers: []
})
export class InputTimeModule {}
