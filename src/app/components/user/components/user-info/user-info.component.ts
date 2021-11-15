import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  BasicDialogComponent,
  BasicDialogData
} from '@shared/components/basic-dialog/basic-dialog.component';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { CommonService } from '@shared/services/common.service';
import { DialogService } from '@shared/services/dialog.service';
import { GlobalService } from '@shared/services/global.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { ValidatorsService } from '@shared/services/validators.service';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnDestroy {
  public hide: boolean = true;
  public name?: string | null;
  public email?: string | null;
  public photoUrl?: string | null;
  public oroginalPhotoUrl?: string | null;

  form: FormGroup = new FormGroup({});
  photoForm: FormGroup = new FormGroup({});
  photoControl: FormControl = new FormControl(null, [
    Validators.pattern(this.globalService.regexUrl)
  ]);
  usernameControl: FormControl = new FormControl(null, [Validators.required]);
  newPasswordControl: FormControl = new FormControl(null, [Validators.minLength(6)]);
  newPasswordRepeatControl: FormControl = new FormControl(null);

  private subscriptions: Subscription[] = [];

  constructor(
    public loadersService: LoadersService,
    private dialogService: DialogService,
    private globalService: GlobalService,
    private userService: UserService,
    private messageService: MessageService,
    private commonService: CommonService,
    private validatorsService: ValidatorsService
  ) {
    this.setForms();
    this.subscribeToUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onLogout() {
    const dialogModel: BasicDialogModel = {
      header: 'Logout',
      body: 'Are you sure you want to logout?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.userService.logout());
  }

  onDelete() {
    const dialogModel: BasicDialogModel = {
      header: 'Delete account',
      body: 'Are you sure you want to delete your account? Everything related to your account will be erased forever!'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.userService.deleteUser());
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loadersService.userInfoLoading = true;

      try {
        const userPromise = this.updateUsername();
        const pwPromise = this.updatePassword();
        await Promise.all([userPromise, pwPromise]);
        this.messageService.showOk('Profile updated successfully');
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.userInfoLoading = false;
    }
  }

  onPhotoUrlChanged(event: any) {
    if (this.photoControl.valid) {
      this.photoUrl = event.target.value;
    }
  }

  photoUrlHasChanged(): boolean {
    return this.photoUrl !== this.oroginalPhotoUrl;
  }

  async onSubmitPhoto() {
    if (this.photoForm.valid) {
      this.loadersService.userInfoLoading = true;
      await this.updatePhoto();
      this.loadersService.userInfoLoading = false;
    }
  }

  async onDeleteImage() {
    if (!this.photoUrlHasChanged()) {
      await this.userService.updateImage(null);
    }
  }

  private async updatePhoto() {
    try {
      if (this.photoUrlHasChanged()) {
        await this.userService.updateImage(this.photoUrl || null);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
  }

  private async updateUsername() {
    const username = this.usernameControl.value;
    if (username !== this.name) {
      await this.userService.updateUsername(username);
    }
  }

  private async updatePassword() {
    const newPassword = this.newPasswordControl.value;
    const newPasswordRepeat = this.newPasswordRepeatControl.value;
    if (!this.commonService.isNullOrEmpty(newPassword) && newPassword === newPasswordRepeat) {
      await this.userService.updatePassword(newPassword);
    }
  }

  private setUserInfo(user: firebase.User | null) {
    this.setUsername(user?.displayName || null);
    this.email = user?.email || null;
    this.photoUrl = this.userService.imageUrl;
    this.oroginalPhotoUrl = this.userService.imageUrl;
  }

  private setUsername(username: string | null) {
    this.name = username;
    this.usernameControl.setValue(this.name);
  }

  private subscribeToUser() {
    const sub: Subscription = this.userService.$user.subscribe((user: firebase.User | null) =>
      this.setUserInfo(user)
    );
    this.subscriptions.push(sub);
  }

  private setForms() {
    this.form = new FormGroup(
      {
        username: this.usernameControl,
        newPassword: this.newPasswordControl,
        newPasswordRepeat: this.newPasswordRepeatControl
      },
      this.validatorsService.checkIfMatchingPasswords('newPassword', 'newPasswordRepeat')
    );

    this.photoForm = new FormGroup({
      photoUrl: this.photoControl
    });
  }
}
