import { Injectable } from '@angular/core';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { TimeSheetService } from '@shared/services/time-sheet.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HomeService {
  private types: Type[] = [];
  private entries: TimeSheet[] = [];
  public types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>(this.types || []);
  public entries$: BehaviorSubject<TimeSheet[]> = new BehaviorSubject<TimeSheet[]>(
    this.entries || []
  );
  constructor(
    private loadersService: LoadersService,
    private userService: UserService,
    private timeSheetService: TimeSheetService,
    private typeService: TypeService
  ) {
    this.subscribeToTypes();
    this.subscribeToTimeSheet();
  }

  private subscribeToTypes() {
    this.typeService.listItems().subscribe((types) => {
      this.types = [...types];
      this.types$.next(this.types);
    });
  }

  private async subscribeToTimeSheet() {
    this.loadersService.timeSheetLoading = true;
    try {
      const user: firebase.User | null = await this.userService.user;
      if (user) {
        this.timeSheetService.listItems(user).subscribe((entries: TimeSheet[]) => {
          this.entries = [...entries];
          this.entries$.next(this.entries);
        });
      } else {
        throw new Error('You must be logged in to view categories');
      }
    } finally {
      this.loadersService.timeSheetLoading = false;
    }
  }
}
