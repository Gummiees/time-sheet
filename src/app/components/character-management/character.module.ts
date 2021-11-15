import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CharacterManagementComponent } from './character-management.component';
import { CharacterManagementRoutingModule } from './character-management.routes';

@NgModule({
  declarations: [CharacterManagementComponent],
  imports: [SharedModule, CharacterManagementRoutingModule],
  exports: [],
  providers: []
})
export class CharacterManagementModule {}
