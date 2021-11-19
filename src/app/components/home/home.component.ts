import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnDestroy {
  public types: Type[] = [];
  public entries: TimeSheet[] = [];
  private subscriptions: Subscription[] = [];
  constructor(
    private loadersService: LoadersService,
    private typeService: TypeService,
    private messageService: MessageService,
    private userService: UserService,
    private timeSheetService: TimeSheetService
  ) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading || this.loadersService.timeSheetLoading;
  }

  private subscribeToTypes() {
    const sub: Subscription = this.typeService.listItems().subscribe((types) => {
      this.types = types;
    });
    this.subscriptions.push(sub);
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
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
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }
}
