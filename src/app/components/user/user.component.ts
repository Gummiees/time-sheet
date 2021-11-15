import { Component } from '@angular/core';
import { TabItem } from '@shared/models/tab-item.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent {
  tabs: TabItem[] = [
    {
      label: 'Account',
      link: '/user/account',
      icon: 'account_circle',
    },
    {
      label: 'Settings',
      link: '/user/settings',
      icon: 'settings',
    },
  ];
  constructor() {}
}
