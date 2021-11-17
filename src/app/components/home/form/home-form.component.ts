import { Component, Input } from '@angular/core';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';

@Component({
  selector: 'app-home-form',
  templateUrl: './home-form.component.html'
})
export class HomeFormComponent {
  @Input() types: Type[] = [];
  constructor(private loadersService: LoadersService, private timeSheetService: TimeSheetService) {}

  public isLoading(): boolean {
    return this.loadersService.typeLoading;
  }
}
