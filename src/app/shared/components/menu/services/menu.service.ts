import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MenuService implements OnDestroy {
  public isActive: boolean = false;
  public $toggle: Subject<boolean> = new Subject<boolean>();
  private subscription?: Subscription;

  constructor(private router: Router) {
    this.detectRouteChanges();
  }

  ngOnDestroy(): void {
    this.$toggle.unsubscribe();
    this.subscription?.unsubscribe();
  }

  public toggle(): void {
    this.isActive = !this.isActive;
    this.$toggle.next(this.isActive);
  }

  private detectRouteChanges(): void {
    this.subscription = this.router.events
      .pipe(filter((val) => val instanceof NavigationEnd))
      .subscribe(() => {
        this.isActive = false;
        this.$toggle.next(this.isActive);
      });
  }
}
