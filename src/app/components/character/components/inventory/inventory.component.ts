import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '@shared/models/category.model';
import { Character } from '@shared/models/character.model';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { Item } from '@shared/models/item.model';
import { CommonService } from '@shared/services/common.service';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Subscription, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { CategoryService } from 'src/app/components/categories/categories.service';
import { CharacterService } from '../../services/character.service';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { AddItem } from './add-item-dialog/add-item.model';
import { BuyItemDialogComponent } from './buy-item-dialog/buy-item-dialog.component';
import { BuyItem } from './buy-item-dialog/buy-item.model';
import { GoldDialogComponent } from './gold-dialog/gold-dialog.component';
import { InventoryService } from './inventory.service';
import { SellItemDialogComponent } from './sell-item-dialog/sell-item-dialog.component';
import { SellItem } from './sell-item-dialog/sell-item.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnDestroy {
  inventory: Item[] = [];
  categories: Category[] = [];
  gold: number = 0;
  private subscriptions: Subscription[] = [];
  constructor(
    public loadersService: LoadersService,
    private characterService: CharacterService,
    private categoryService: CategoryService,
    private inventoryService: InventoryService,
    private userService: UserService,
    private dialogService: DialogService,
    private commonService: CommonService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.subscribeToInventory();
    this.subscribeToCategoryList();
    this.getGold();
  }

  buttonsDisabled(): boolean {
    return (
      this.loadersService.categoriesLoading ||
      this.loadersService.inventoryLoading ||
      this.loadersService.goldLoading
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addItem() {
    this.dialogService
      .openGenericDialog(AddItemDialogComponent, this.categories)
      .pipe(first())
      .subscribe((addItem: AddItem) => {
        if (!this.commonService.isNullOrUndefined(addItem)) {
          this.createItem(addItem);
        }
      });
  }

  public async onDelete(item: Item) {
    const dialogModel: BasicDialogModel = {
      body: 'Are you sure you want to delete the item?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete(item));
  }

  public async onSell(item: Item) {
    this.dialogService
      .openGenericDialog(SellItemDialogComponent, item)
      .pipe(first())
      .subscribe((sellItem: SellItem) => {
        if (!this.commonService.isNullOrUndefined(sellItem)) {
          this.sell(sellItem);
        }
      });
  }

  public async onBuy(item: Item) {
    this.dialogService
      .openGenericDialog(BuyItemDialogComponent, item)
      .pipe(first())
      .subscribe((buyItem: BuyItem) => {
        if (!this.commonService.isNullOrUndefined(buyItem)) {
          this.buy(buyItem);
        }
      });
  }

  public async onEditGold() {
    this.dialogService
      .openGenericDialog(GoldDialogComponent, this.gold)
      .pipe(first())
      .subscribe((gold: number) => {
        if (!this.commonService.isNullOrUndefined(gold)) {
          this.editGold(gold);
        }
      });
  }

  private editGold(gold: number) {
    this.loadersService.goldLoading = true;
    try {
      this.characterService.setGold(gold);
      this.gold = gold;
      this.messageService.showOk('Gold updated successfully');
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.goldLoading = false;
  }

  private async createItem(addItem: AddItem) {
    this.loadersService.inventoryLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.inventoryService.createItem(character, addItem.item);
        if (addItem.cost > 0) {
          await this.characterService.updateGold(addItem.cost * -1);
          this.gold = this.gold - addItem.cost;
        }
        this.messageService.showOk('Item added successfully');
      } else {
        this.messageService.showLocalError('You must have a character to add an item');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.inventoryLoading = false;
  }

  private async delete(item: Item) {
    this.loadersService.inventoryLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.inventoryService.deleteItem(character, item);
        this.messageService.showOk('Item deleted successfully');
      } else {
        this.messageService.showLocalError('You must have a character to delete an item');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.inventoryLoading = false;
  }

  private async sell(sellItem: SellItem) {
    this.loadersService.inventoryLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.inventoryService.sellItem(character, sellItem);
        if (sellItem.price > 0) {
          await this.characterService.updateGold(sellItem.price);
          this.gold = this.gold + sellItem.price;
        }
        this.messageService.showOk('Item sold successfully');
      } else {
        this.messageService.showLocalError('You must have a character to sell an item');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.inventoryLoading = false;
  }

  private async buy(buyItem: BuyItem) {
    this.loadersService.inventoryLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        await this.inventoryService.buyItem(character, buyItem);
        if (buyItem.price > 0) {
          await this.characterService.updateGold(buyItem.price * -1);
          this.gold = this.gold - buyItem.price;
        }
        this.messageService.showOk('Item bought successfully');
      } else {
        this.messageService.showLocalError('You must have a character to buy an item');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.inventoryLoading = false;
  }

  private async getGold() {
    try {
      this.loadersService.goldLoading = true;
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.gold = character.gold;
      } else {
        this.messageService.showLocalError('You must have a character');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.goldLoading = false;
  }

  private async subscribeToInventory() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.loadersService.inventoryLoading = true;
        const sub: Subscription = this.inventoryService
          .listItems(character, user)
          .pipe(
            catchError((err) => {
              this.loadersService.inventoryLoading = false;
              return throwError(err);
            })
          )
          .subscribe((inventory: Item[]) => {
            this.inventory = inventory;
            this.loadersService.inventoryLoading = false;
          });
        this.subscriptions.push(sub);
      } else {
        this.messageService.showLocalError('You must have a character');
        this.router.navigate(['/create']);
      }
    } else {
      this.messageService.showLocalError('You must be logged in');
    }
  }

  private async subscribeToCategoryList() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      this.loadersService.categoriesLoading = true;
      const sub: Subscription = this.categoryService
        .listItems(user)
        .pipe(
          catchError((err) => {
            this.loadersService.categoriesLoading = false;
            return throwError(err);
          })
        )
        .subscribe((categories: any) => {
          this.categories = categories.flat() || [];
          this.loadersService.categoriesLoading = false;
        });
      this.subscriptions.push(sub);
    } else {
      this.messageService.showLocalError('You must be logged in');
    }
  }
}
