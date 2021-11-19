import { Component, Input } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html'
})
export class WeekComponent {
  @Input() types: Type[] = [];
  @Input() entries: TimeSheet[] = [];
  public today: number = Date.now();
  constructor(private loadersService: LoadersService) {}

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }
}
