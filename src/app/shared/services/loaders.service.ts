import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {
  private $signInLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private $userInfoLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}

  isAnyLoading(): boolean {
    return this.signInLoading || this.userInfoLoading;
  }
  set signInLoading(value: boolean) {
    this.$signInLoading.next(value);
  }
  get signInLoading(): boolean {
    return this.$signInLoading.value;
  }
  set userInfoLoading(value: boolean) {
    this.$userInfoLoading.next(value);
  }
  get userInfoLoading(): boolean {
    return this.$userInfoLoading.value;
  }
}
