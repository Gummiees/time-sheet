import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CanActivateCharacterGuard } from '@shared/guards/character.guard';
import { DicePipeModule } from '@shared/pipes/dice/dice-pipe.module';
import { SharedModule } from '@shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { TableModule } from 'primeng/table';
import { CharacterComponent } from './character.component';
import { CharacterRoutingModule } from './character.routes';
import { CharacterInfoComponent } from './components/character-info/character-info.component';
import { CharacterStatsComponent } from './components/character-stats/character-stats.component';
import { DicesComponent } from './components/dices/dices.component';
import { DiceService } from './components/dices/dices.service';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryService } from './components/inventory/inventory.service';
import { SkillService } from './components/skills/skill.service';
import { SkillsComponent } from './components/skills/skills.component';
import { StoryComponent } from './components/story/story.component';

@NgModule({
  declarations: [
    CharacterComponent,
    CharacterStatsComponent,
    InventoryComponent,
    SkillsComponent,
    CharacterInfoComponent,
    StoryComponent,
    DicesComponent
  ],
  imports: [
    SharedModule,
    CharacterRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatTooltipModule,
    TableModule,
    QuillModule,
    DicePipeModule
  ],
  providers: [CanActivateCharacterGuard, InventoryService, SkillService, DiceService]
})
export class CharacterModule {}
