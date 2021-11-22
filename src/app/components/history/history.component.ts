import { Component, OnDestroy } from '@angular/core';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  public today: number = Date.now();
  private subscriptions: Subscription[] = [];
  private clonedEntries: { [s: string]: TimeSheet } = {};
  constructor(
    private loadersService: LoadersService,
    private timeSheetService: TimeSheetService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private typeService: TypeService,
    private userService: UserService
  ) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading || this.loadersService.typeLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  public async onDelete(entry: TimeSheet) {
    const dialogModel: BasicDialogModel = {
      body: 'Are you sure you want to delete the entry?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete(entry));
  }

  public onRowEditInit(entry: TimeSheet) {
    if (!entry.id) {
      return;
    }
    this.clonedEntries[entry.id] = { ...entry };
  }

  public async onRowEditSave(entry: TimeSheet) {
    if (!entry.id) {
      return;
    }
    this.loadersService.timeSheetLoading = true;
    try {
      await this.timeSheetService.updateItem(entry);
      this.messageService.showOk('Entry saved successfully');
      delete this.clonedEntries[entry.id];
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.timeSheetLoading = false;
  }

  public onRowEditCancel(entry: TimeSheet, rowIndex: number) {
    if (!entry.id) {
      return;
    }
    this.entries[rowIndex] = this.clonedEntries[entry.id];
    delete this.clonedEntries[entry.id];
  }

  private async delete(entry: TimeSheet) {
    this.loadersService.timeSheetLoading = true;
    try {
      await this.timeSheetService.deleteItem(entry);
      this.messageService.showOk('Entry created successfully');
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.timeSheetLoading = false;
  }

  private subscribeToTypes() {
    const sub: Subscription = this.typeService.listItems().subscribe((types) => {
      this.types = [...types];
    });
    this.subscriptions.push(sub);
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
      const user: firebase.User | null = await this.userService.user;
      if (user) {
        this.timeSheetService.listItems(user).subscribe((entries: TimeSheet[]) => {
          this.entries = [...entries];
        });
      } else {
        throw new Error('You must be logged in to view categories');
      }
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }
}
