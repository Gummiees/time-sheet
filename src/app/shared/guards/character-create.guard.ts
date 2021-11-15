import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CharacterService } from 'src/app/components/character/services/character.service';

@Injectable()
export class CanActivateCharacterCreateGuard implements CanActivate {
  constructor(private router: Router, private characterService: CharacterService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>(async (resolve) => {
      const hasCharacters: boolean = await this.characterService.hasCharacters();
      if (!hasCharacters) {
        resolve(true);
        return;
      }
      this.router.navigate(['/statistics']);
      resolve(false);
      return;
    });
  }
}
