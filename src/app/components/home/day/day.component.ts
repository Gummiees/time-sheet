import { Component, OnDestroy } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html'
})
export class DayComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  private diff: number = 0;
  private intervalFunction: any;
  private subscriptions: Subscription[] = [];
  private entriesLoaded: boolean = false;
  private typesLoaded: boolean = false;
  constructor(private loadersService: LoadersService, private homeService: HomeService) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  ngOnDestroy(): void {
    this.clearIntervalDiff();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public getDiffString(): string {
    return this.homeService.getDiffString(this.diff);
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading || this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  private getDiff() {
    if (this.entriesLoaded && this.typesLoaded && this.types.length > 0) {
      this.diff = this.homeService.setTotalTime(this.types, this.entries);
      if (this.homeService.needsInterval(this.types, this.entries)) {
        this.setIntervalDiff();
      } else {
        this.clearIntervalDiff();
      }
    }
  }

  private setIntervalDiff() {
    if (!this.intervalFunction) {
      this.intervalFunction = setInterval(() => (this.diff += 1000), 1000);
    }
  }

  private clearIntervalDiff() {
    if (this.intervalFunction) {
      clearInterval(this.intervalFunction);
      this.intervalFunction = undefined;
    }
  }

  private subscribeToTypes() {
    const sub: Subscription = this.homeService.types$.subscribe((types: Type[]) => {
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
        this.entries = entries.filter((entry) => this.homeService.isToday(entry.date));
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
