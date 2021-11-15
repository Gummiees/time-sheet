import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
  public hide: boolean = true;
  form: FormGroup = new FormGroup({});
  emailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  usernameControl: FormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(4)
  ]);
  passwordControl: FormControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6)
  ]);
  passwordRepeatControl: FormControl = new FormControl(null);
  constructor(
    public loadersService: LoadersService,
    private validatorsService: ValidatorsService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.setForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loadersService.signUpLoading = true;
      try {
        const { email, username, password } = this.form.value;
        await this.userService.createUser(email, password, username);
        this.messageService.showOk('Welcome and have fun!');
        this.router.navigate(['/']);
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.signUpLoading = false;
    }
  }

  public async onGoogleSignUp() {
    this.loadersService.signUpLoading = true;
    try {
      await this.userService.googleSignUp();
      this.messageService.showOk('Welcome and have fun!');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.signUpLoading = false;
  }

  public goToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  private setForm() {
    this.form = new FormGroup(
      {
        email: this.emailControl,
        username: this.usernameControl,
        password: this.passwordControl,
        passwordRepeat: this.passwordRepeatControl
      },
      this.validatorsService.checkIfMatchingPasswords('password', 'passwordRepeat')
    );
  }
}
