import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { UserService } from '@shared/services/user.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService extends BaseService<TimeSheet> {
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('time-sheet', firestore, userService);
  }
}
