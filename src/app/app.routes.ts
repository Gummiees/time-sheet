import { NgModule } from '@angular/core';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);

// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () =>
//       import('./components/character/character.module').then((m) => m.CharacterModule),
//     canActivate: [AngularFireAuthGuard],
//     data: { authGuardPipe: redirectUnauthorizedToSignIn }
//   },
//   {
//     path: 'create',
//     loadChildren: () =>
//       import('./components/character-create/character-create.module').then(
//         (m) => m.CharacterCreateModule
//       ),
//     canActivate: [AngularFireAuthGuard],
//     data: { authGuardPipe: redirectUnauthorizedToSignIn }
//   },
//   {
//     path: 'categories',
//     loadChildren: () =>
//       import('./components/categories/categories.module').then((m) => m.CategoriesModule),
//     ...canActivate(redirectUnauthorizedToSignIn)
//   },
//   {
//     path: 'character-management',
//     loadChildren: () =>
//       import('./components/character-management/character.module').then(
//         (m) => m.CharacterManagementModule
//       ),
//     ...canActivate(redirectUnauthorizedToSignIn)
//   },
//   {
//     path: 'user',
//     loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule),
//     ...canActivate(redirectUnauthorizedToSignIn)
//   },
//   {
//     path: 'sign-in',
//     loadChildren: () => import('./components/sign-in/sign-in.module').then((m) => m.SignInModule),
//     ...canActivate(redirectLoggedInToMain)
//   },
//   {
//     path: 'sign-up',
//     loadChildren: () => import('./components/sign-up/sign-up.module').then((m) => m.SignUpModule),
//     ...canActivate(redirectLoggedInToMain)
//   },
//   {
//     path: 'forgot-password',
//     loadChildren: () =>
//       import('./components/forgot-password/forgot-password.module').then(
//         (m) => m.ForgotPasswordModule
//       ),
//     ...canActivate(redirectLoggedInToMain)
//   },
//   { path: '**', redirectTo: '', pathMatch: 'full' }
// ];

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
