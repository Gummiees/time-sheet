import { Component, OnDestroy } from '@angular/core';
import { Category } from '@shared/models/category.model';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { CommonService } from '@shared/services/common.service';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { Subscription } from 'rxjs';
import { CategoryService } from './categories.service';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnDestroy {
  public isEditingRow: boolean = false;
  public categoryList: Category[] = [];
  private clonedCategories: { [s: string]: Category } = {};
  private subscriptions: Subscription[] = [];
  constructor(
    public loadersService: LoadersService,
    private dialogService: DialogService,
    private commonService: CommonService,
    private categoryService: CategoryService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.subscribeToListItems();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  buttonsDisabled(): boolean {
    return this.loadersService.categoriesLoading || this.isEditingRow;
  }

  addCategory() {
    this.dialogService
      .openGenericDialog(AddDialogComponent)
      .pipe(first())
      .subscribe((category: Category) => {
        if (!this.commonService.isNullOrUndefined(category)) {
          this.createItem(category);
        }
      });
  }

  private async createItem(category: Category) {
    this.loadersService.categoriesLoading = true;
    try {
      const user: firebase.User | null = await this.userService.user;
      if (user) {
        await this.categoryService.createItem(category, user);
        this.messageService.showOk('Category created successfully');
      } else {
        this.messageService.showLocalError('You must be logged in to create a category');
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.categoriesLoading = false;
  }

  public async onEditInit(category: Category) {
    if (category.id) {
      this.clonedCategories[category.id] = { ...category };
      this.isEditingRow = true;
    }
  }

  public async onEditCancel(category: Category, index: number) {
    if (category.id) {
      this.categoryList[index] = this.clonedCategories[category.id];
      delete this.clonedCategories[category.id];
      this.isEditingRow = false;
    }
  }

  public async onEditSave(category: Category) {
    if (category.id) {
      this.loadersService.categoriesLoading = true;
      try {
        const user: firebase.User | null = await this.userService.user;
        if (user) {
          await this.categoryService.updateItem(category);
          this.isEditingRow = false;
          this.messageService.showOk('Category updated successfully');
        } else {
          this.messageService.showLocalError('You must be logged in to update a category');
        }
      } catch (e: any) {
        console.error(e);
        this.messageService.showLocalError(e);
      }
      this.loadersService.categoriesLoading = false;
    }
  }

  public async onDelete(category: Category) {
    const dialogModel: BasicDialogModel = {
      body: 'Are you sure you want to delete the category?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete(category));
  }

  private async delete(category: Category) {
    this.loadersService.categoriesLoading = true;
    try {
      const user: firebase.User | null = await this.userService.user;
      if (user) {
        await this.categoryService.deleteItem(category);
        this.messageService.showOk('Category deleted successfully');
      } else {
        this.messageService.showLocalError('You must be logged in to update a category');
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.categoriesLoading = false;
  }

  private async subscribeToListItems() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      const sub: Subscription = this.categoryService
        .listItemsMaintenance(user)
        .subscribe((categories: Category[]) => (this.categoryList = categories || []));
      this.subscriptions.push(sub);
    } else {
      this.messageService.showLocalError('You must be logged in to view categories');
    }
  }
}
