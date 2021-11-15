import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'primeng/api';
import { SidenavModule } from './components/sidenav/sidenav.module';
import { TopbarModule } from './components/topbar/topbar.module';
import { MenuComponent } from './menu.component';
import { MenuService } from './services/menu.service';

@NgModule({
  declarations: [MenuComponent],
  imports: [SharedModule, MatSidenavModule, TopbarModule, SidenavModule],
  exports: [MenuComponent],
  providers: [MenuService]
})
export class MenuModule {}
