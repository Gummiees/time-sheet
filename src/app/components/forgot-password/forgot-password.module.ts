import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { ForgotPasswordRoutingModule } from './forgot-password.routes';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    SharedModule,
    ForgotPasswordRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ]
})
export class ForgotPasswordModule {}
