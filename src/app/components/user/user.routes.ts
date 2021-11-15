import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        component: UserInfoComponent,
      },
      {
        path: 'settings',
        component: UserSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
