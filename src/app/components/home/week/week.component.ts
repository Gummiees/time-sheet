import { Component, OnDestroy } from '@angular/core';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html'
})
export class WeekComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  public today: number = Date.now();
  private diff: number = 0;
  private subscriptions: Subscription[] = [];
  private intervalFunction: any;
  private entriesLoaded: boolean = false;
  private typesLoaded: boolean = false;
  private clonedEntries: { [s: string]: TimeSheet } = {};
  constructor(
    private loadersService: LoadersService,
    private homeService: HomeService,
    private timeSheetService: TimeSheetService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  ngOnDestroy(): void {
    this.clearIntervalDiff();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading;
  }

  public getDiffString(): string {
    return this.homeService.getDiffString(this.diff);
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

  private setIntervalDiff() {
    if (!this.intervalFunction) {
      this.intervalFunction = setInterval(
        () => (this.diff += this.homeService.updateInterval),
        this.homeService.updateInterval
      );
    }
  }

  private getDiff() {
    if (this.entriesLoaded && this.typesLoaded && this.types.length > 0) {
      this.diff = this.homeService.setTotalTime(this.types, this.entries);
      if (this.homeService.lastCheckoutExists(this.types, this.entries)) {
        this.clearIntervalDiff();
      } else {
        this.setIntervalDiff();
      }
    }
  }

  private clearIntervalDiff() {
    if (this.intervalFunction) {
      clearInterval(this.intervalFunction);
      this.intervalFunction = undefined;
    }
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
    const sub: Subscription = this.homeService.types$.subscribe((types) => {
      this.types = [...types];
      this.typesLoaded = true;
      this.getDiff();
    });
    this.subscriptions.push(sub);
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
      const sub: Subscription = this.homeService.entries$.subscribe((entries: TimeSheet[]) => {
        this.entries = entries.filter((entry) => this.homeService.isCurrentWeek(entry.date));
        this.entriesLoaded = true;
        this.getDiff();
      });
      this.subscriptions.push(sub);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }
}
