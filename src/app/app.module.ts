import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import {
  AngularFirePerformanceModule,
  PerformanceMonitoringService
} from '@angular/fire/compat/performance';
import { QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicDialogModule } from '@shared/components/basic-dialog/basic-dialog.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { MenuModule } from '@shared/components/menu/menu.module';
import { SharedModule } from '@shared/shared.module';
import { RippleModule } from 'primeng/ripple';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { AddItemDialogModule } from './components/character/components/inventory/add-item-dialog/add-item-dialog.module';
import { BuyItemDialogModule } from './components/character/components/inventory/buy-item-dialog/buy-item-dialog.module';
import { GoldDialogModule } from './components/character/components/inventory/gold-dialog/gold-dialog.module';
import { SellItemDialogModule } from './components/character/components/inventory/sell-item-dialog/sell-item-dialog.module';
import { SaveCmdDirective } from '@shared/directives/save-cmd.directive';
import { StatDetailsDialogModule } from './components/character/components/character-stats/stat-details-dialog/stat-details-dialog.module';
import { SkillDialogModule } from './components/character/components/skills/skill-dialog/skill-dialog.module';
import { DiceDialogModule } from './components/character/components/dices/dice-dialog/dice-dialog.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RippleModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFirePerformanceModule,
    AngularFireAnalyticsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    QuillModule.forRoot({
      customOptions: [
        {
          import: 'formats/font',
          whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
        }
      ]
    }),
    BasicDialogModule,
    MenuModule,
    FooterModule,
    AddItemDialogModule,
    SellItemDialogModule,
    BuyItemDialogModule,
    GoldDialogModule,
    StatDetailsDialogModule,
    SkillDialogModule,
    DiceDialogModule
  ],
  providers: [
    PerformanceMonitoringService,
    ScreenTrackingService,
    UserTrackingService,
    SaveCmdDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
