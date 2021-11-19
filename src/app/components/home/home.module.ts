import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { HomeFormComponent } from './form/home-form.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routes';

@NgModule({
  declarations: [HomeComponent, HomeFormComponent],
  imports: [
    CalendarModule,
    SharedModule,
    HomeRoutingModule,
    AngularFireAuthModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  exports: [],
  providers: []
})
export class HomeModule {}
