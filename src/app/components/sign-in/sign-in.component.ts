import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup = new FormGroup({});
  emailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  passwordControl: FormControl = new FormControl(null, [Validators.required]);
  constructor(
    public loadersService: LoadersService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.setForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loadersService.signInLoading = true;
      try {
        const { email, password } = this.form.value;
        await this.userService.signIn(email, password);
        this.messageService.showOk('Welcome back!');
        this.router.navigate(['/']);
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.signInLoading = false;
    }
  }

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

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  private setForm() {
    this.form = new FormGroup({
      email: this.emailControl,
      password: this.passwordControl
    });
  }
}
