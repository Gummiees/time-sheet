import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateCharacterCreateGuard } from '@shared/guards/character-create.guard';
import { CharacterCreateComponent } from './character-create.component';

const routes: Routes = [
  {
    path: '',
    component: CharacterCreateComponent,
    canActivate: [CanActivateCharacterCreateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterCreateRoutingModule {}
