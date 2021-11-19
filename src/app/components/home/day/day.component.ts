import { Component, Input } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html'
})
export class DayComponent {
  @Input() types: Type[] = [];
  @Input() entries: TimeSheet[] = [];
  public today: number = Date.now();
  constructor(private loadersService: LoadersService) {}

  public getTodayEntries(): TimeSheet[] {
    return this.entries.filter((entry) => this.isToday(entry.date));
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

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }
}
