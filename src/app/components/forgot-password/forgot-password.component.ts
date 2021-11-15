import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  public hide: boolean = true;
  form: FormGroup = new FormGroup({});
  emailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);
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
      this.loadersService.forgotPasswordLoading = true;
      try {
        const { email } = this.form.value;
        await this.userService.forgotPassword(email);
        this.messageService.showOk('An email was sent to recover the password.');
        this.router.navigate(['/login']);
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.forgotPasswordLoading = false;
    }
  }

  private setForm() {
    this.form = new FormGroup({
      email: this.emailControl
    });
  }
}
