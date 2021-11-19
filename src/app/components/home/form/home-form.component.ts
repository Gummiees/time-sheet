import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';

@Component({
  selector: 'app-home-form',
  templateUrl: './home-form.component.html'
})
export class HomeFormComponent {
  @Input() types: Type[] = [];
  form: FormGroup = new FormGroup({});
  typeControl: FormControl = new FormControl(null, [Validators.required]);
  dateControl: FormControl = new FormControl(new Date(), [Validators.required]);
  constructor(
    private loadersService: LoadersService,
    private timeSheetService: TimeSheetService,
    private messageService: MessageService
  ) {
    this.setForms();
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading;
  }

  public isDisabled(): boolean {
    return this.isLoading() || this.form.invalid;
  }

  async onSubmit() {
    if (this.form.valid && this.typeControl.value) {
      this.loadersService.userInfoLoading = true;
      try {
        await this.createEntry();
        this.messageService.showOk('Entry created successfully');
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.userInfoLoading = false;
    }
  }

  private async createEntry() {
    const entry: TimeSheet = {
      typeId: this.typeControl.value,
      date: this.dateControl.value
    };
    return await this.timeSheetService.createItem(entry);
  }

  private setForms() {
    this.form = new FormGroup({
      type: this.dateControl,
      date: this.dateControl
    });
  }
}
