import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RunCountGuard } from './guards/run-count.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/onboard', pathMatch: 'full' },
  { path: '', redirectTo: '/rundown', pathMatch: 'full' },
  {
    path: 'onboard',
    loadChildren: () =>
      import('./pages/onboard/onboard.module').then(m => m.OnboardPageModule),
   // canActivate: [RunCountGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
    // todo: Guard that requires user to be logged out
  },

  {
    path: 'notification-authorisation',
    loadChildren: () =>
      import('./pages/notification-authorisation/notification-authorisation.module').then(m => m.NotificationAuthorisationPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'wait',
    loadChildren: () =>
      import('./pages/wait/wait.module').then(m => m.WaitPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'rundown',
    loadChildren: () =>
      import('./pages/rundown/rundown.module').then(m => m.RundownModule),
      canActivate: [AuthGuard]
  },

  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },


  { path: 'pump-countdown', loadChildren: './pump-countdown/pump-countdown.module#PumpCountdownPageModule' },
  { path: 'pump', loadChildren: './pump/pump.module#PumpPageModule' },
  { path: 'barchart-stats', loadChildren: './pages/stats/barchart-stats/barchart-stats.module#BarchartStatsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
