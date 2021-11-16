import { Component, OnDestroy } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnDestroy {
  public photoUrl: string | null = this.userService.imageUrl;
  public username?: string | null;
  public version: string = '0.0.1';
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService) {
    this.subscribeToUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private setUserInfo(user: firebase.User | null) {
    this.username = user?.displayName || user?.email;
    this.photoUrl = this.userService.imageUrl;
  }

  private subscribeToUser() {
    const sub: Subscription = this.userService.$user.subscribe((user: firebase.User | null) =>
      this.setUserInfo(user)
    );
    this.subscriptions.push(sub);
  }
}
