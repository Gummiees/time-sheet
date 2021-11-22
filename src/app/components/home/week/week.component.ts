import { Component, OnDestroy } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html'
})
export class WeekComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  public today: number = Date.now();
  private subscriptions: Subscription[] = [];
  constructor(private loadersService: LoadersService, private homeService: HomeService) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  private subscribeToTypes() {
    const sub: Subscription = this.homeService.types$.subscribe((types) => {
      this.types = [...types];
    });
    this.subscriptions.push(sub);
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
      const sub: Subscription = this.homeService.entries$.subscribe((entries: TimeSheet[]) => {
        this.entries = [...entries];
      });
      this.subscriptions.push(sub);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }
}
