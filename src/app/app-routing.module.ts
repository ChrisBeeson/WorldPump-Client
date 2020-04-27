import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'lobby',
    loadChildren: () =>
      import('./pages/workout/lobby/lobby.module').then(m => m.LobbyPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        m => m.ResetPasswordPageModule
      )
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  { path: 'lobby', loadChildren: './pages/lobby/lobby.module#LobbyPageModule' },
  { path: 'pump-countdown', loadChildren: './pump-countdown/pump-countdown.module#PumpCountdownPageModule' },
  { path: 'pump', loadChildren: './pump/pump.module#PumpPageModule' },
  { path: 'barchart-stats', loadChildren: './pages/stats/barchart-stats/barchart-stats.module#BarchartStatsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
