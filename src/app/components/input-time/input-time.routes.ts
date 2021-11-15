import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputTimeComponent } from './input-time.component';

const routes: Routes = [{ path: '', component: InputTimeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputTimeRoutingModule {}
