import { Component, Input, OnDestroy } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html'
})
export class WeekComponent implements OnDestroy {
  @Input() types: Type[] = [];
  public today: number = Date.now();
  public entries: TimeSheet[] = [];
  private subscriptions: Subscription[] = [];
  constructor(
    public loadersService: LoadersService,
    private userService: UserService,
    private timeSheetService: TimeSheetService,
    private messageService: MessageService
  ) {
    this.subscribeToTimeSheet();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.timeSheetLoading;
  }

  public getTypeName(typeId: string): string | undefined {
    return this.types.find((type) => type.id === typeId)?.name;
  }

  private async subscribeToTimeSheet() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      const sub: Subscription = this.timeSheetService
        .listItems(user)
        .subscribe((entries: TimeSheet[]) => {
          this.entries = entries;
        });
      this.subscriptions.push(sub);
    } else {
      this.messageService.showLocalError('You must be logged in to view categories');
    }
  }
}
