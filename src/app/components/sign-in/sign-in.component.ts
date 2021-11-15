import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';

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
    this.loadersService.signInLoading = true;
    try {
      await this.userService.googleSignIn();
      this.messageService.showOk('Welcome back!');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.signInLoading = false;
  }

  async onGitHubSignIn() {
    this.loadersService.signInLoading = true;
    try {
      await this.userService.githubSignIn();
      this.messageService.showOk('Welcome back!');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.signInLoading = false;
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
