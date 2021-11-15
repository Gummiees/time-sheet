import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '@shared/models/character.model';
import { TabItem } from '@shared/models/tab-item.model';
import { CommonService } from '@shared/services/common.service';
import { GlobalService } from '@shared/services/global.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { CharacterService } from './services/character.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CharacterComponent {
  tabs: TabItem[] = [
    {
      label: 'Statistics',
      link: '/statistics',
      icon: 'insert_chart_outlined'
    },
    {
      label: 'Skills',
      link: '/skills',
      icon: 'hiking'
    },
    {
      label: 'Dices',
      link: '/dices',
      icon: 'casino'
    },
    {
      label: 'Inventory',
      link: '/inventory',
      icon: 'backpack'
    },
    {
      label: 'Information',
      link: '/information',
      icon: 'account_circle'
    },
    {
      label: 'Story',
      link: '/story',
      icon: 'menu_book'
    }
  ];

  currentPhase: string = this.globalService.turnStart;
  inCombat: boolean = true;
  constructor(
    public loadersService: LoadersService,
    private globalService: GlobalService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.loadCharacter();
  }

  public previousTurn() {
    const iTurn: number | undefined = this.globalService.turns.indexOf(this.currentPhase);
    if (!this.commonService.isNullOrUndefined(iTurn)) {
      if (iTurn === 0) {
        this.setCurrentPhase(this.globalService.turns.length - 1);
      } else {
        this.setCurrentPhase(iTurn - 1);
      }

      this.save();
    }
  }

  public nextTurn() {
    const iTurn: number | undefined = this.globalService.turns.indexOf(this.currentPhase);
    if (!this.commonService.isNullOrUndefined(iTurn)) {
      if (iTurn === this.globalService.turns.length - 1) {
        this.setCurrentPhase(0);
      } else {
        this.setCurrentPhase(iTurn + 1);
      }
      this.save();
    }
  }

  public toggleCombat() {
    this.inCombat = !this.inCombat;
    if (!this.inCombat) {
      this.currentPhase = this.globalService.turnStart;
    }
    this.save();
  }

  private setCurrentPhase(key: number) {
    this.currentPhase = this.globalService.turns[key];
  }

  private async save() {
    this.loadersService.turnLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        character.phase = this.currentPhase;
        character.inCombat = this.inCombat;
        await this.characterService.updateCharacter(character);
      } else {
        this.messageService.showLocalError('You must have a character to change the turn phase.');
        this.router.navigate(['/create']);
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    }
    this.loadersService.turnLoading = false;
  }

  private async loadCharacter() {
    this.loadersService.turnLoading = true;
    try {
      const character: Character | null = await this.characterService.character;
      if (character) {
        this.currentPhase = character.phase;
        this.inCombat = character.inCombat;
      }
    } catch (e: any) {
      console.error(e);
      this.messageService.showLocalError(e);
    } finally {
      this.loadersService.turnLoading = false;
    }
  }
}
