import { Component, OnDestroy } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type, TypeName } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html'
})
export class DayComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  public diff: number = 0;
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
    const duration: any = moment.duration(this.diff);
    return `${duration.get('hours')}H ${duration.get('minutes')}m ${duration.get('seconds')}s`;
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading || this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  private isToday(date: Date) {
    if (!date || !(date instanceof Date)) {
      return false;
    }
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  private getDiff() {
    if (this.entriesLoaded && this.typesLoaded && this.types.length > 0) {
      this.setTotalTime();
    }
  }

  private setIntervalDiff() {
    if (!this.intervalFunction) {
      this.intervalFunction = setInterval(() => (this.diff += 1000), 1000);
    }
  }

  private setTotalTime() {
    const checkinId: string | undefined = this.types.find(
      (type) => type.name === TypeName.checkin
    )?.id;
    const checkoutId: string | undefined = this.types.find(
      (type) => type.name === TypeName.checkout
    )?.id;

    if (!checkinId || !checkoutId) {
      throw new Error('Type not found');
    }

    const checkins: TimeSheet[] = this.entries.filter((entry) => entry.typeId === checkinId);
    const checkouts: TimeSheet[] = this.entries.filter((entry) => entry.typeId === checkoutId);

    let allCheckinsHaveCheckouts: boolean = true;
    let diff: number = 0;

    checkins.forEach((checkin) => {
      const checkout: TimeSheet | undefined = checkouts.find((out) =>
        moment(checkin.date).isBefore(out.date)
      );
      if (!checkout) {
        allCheckinsHaveCheckouts = false;
        return;
      }
      diff += moment(checkout.date).diff(moment(checkin.date));
    });

    if (!allCheckinsHaveCheckouts && checkins.length > 0) {
      const lastCheckin: TimeSheet = checkins[checkins.length - 1];
      diff += moment(new Date()).diff(lastCheckin.date);
      this.diff = Math.abs(diff);
      this.setIntervalDiff();
    } else {
      this.diff = diff;
      this.clearIntervalDiff();
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
        this.entries = entries.filter((entry) => this.isToday(entry.date));
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
