import { Injectable } from '@angular/core';
import { MeService } from '@shared/services/me.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';

export type SignIn = 'google' | 'github';

@Injectable()
export class SignInService {
  constructor(private userService: UserService, private meService: MeService) {}

  async signIn(signInWith: SignIn) {
    switch (signInWith) {
      case 'google':
        await this.userService.googleSignIn();
        break;
      case 'github':
        await this.userService.githubSignIn();
        break;
    }

    const user: firebase.User | null = await this.userService.user;
    if (user) {
      this.meService.createUser(user);
    }
  }
}
