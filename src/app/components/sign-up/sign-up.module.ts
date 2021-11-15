import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { SignUpRoutingModule } from './sign-up.routes';
import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    SharedModule,
    SignUpRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  exports: [],
  providers: []
})
export class SignUpModule {}
