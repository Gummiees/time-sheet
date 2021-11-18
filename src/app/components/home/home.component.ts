import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Type } from '@shared/models/type.model';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { TypeService } from '@shared/services/type.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnDestroy {
  public types: Type[] = [];
  private subscriptions: Subscription[] = [];
  constructor(
    private loadersService: LoadersService,
    private typeService: TypeService,
    private messageService: MessageService
  ) {
    this.subscribeToTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public isLoading(): boolean {
    return this.loadersService.typeLoading || this.loadersService.timeSheetLoading;
  }

  private async subscribeToTypes() {
    this.loadersService.typeLoading = true;
    try {
      const sub: Subscription = this.typeService.listItems().subscribe((types) => {
        this.types = types;
      });
      this.subscriptions.push(sub);
    } catch (e: any) {
      this.messageService.showLocalError(e);
      console.error(e);
    } finally {
      this.loadersService.typeLoading = false;
    }
  }
}
