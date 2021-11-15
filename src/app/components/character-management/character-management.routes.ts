import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterManagementComponent } from './character-management.component';

const routes: Routes = [{ path: '', component: CharacterManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterManagementRoutingModule {}
