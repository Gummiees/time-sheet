import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '@shared/shared.module';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserRoutingModule } from './user.routes';
import { UserComponent } from './user.component';
import { UserInfoService } from './components/user-info/user-info.service';

@NgModule({
  declarations: [UserComponent, UserSettingsComponent, UserInfoComponent],
  imports: [
    SharedModule,
    UserRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  providers: [UserInfoService]
})
export class UserModule {}
