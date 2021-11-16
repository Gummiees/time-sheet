import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';

type SignIn = 'google' | 'github';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
  public hide: boolean = true;
  constructor(
    public loadersService: LoadersService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async onGoogleSignIn() {
    this.onSignIn('google');
  }

  async onGitHubSignIn() {
    this.onSignIn('github');
  }

  private async onSignIn(signInWith: SignIn) {
    this.loadersService.signInLoading = true;
    try {
      switch (signInWith) {
        case 'google':
          await this.userService.googleSignIn();
          break;
        case 'github':
          await this.userService.githubSignIn();
          break;
      }
      this.messageService.showOk('Welcome back!');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.signInLoading = false;
  }
}
