import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'onboard',
    loadChildren: () =>
      import('./pages/onboard/onboard.module').then(m => m.OnboardPageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },

  { 
    path: 'notification-authorisation',
  loadChildren: () =>
  import('./pages/notification-authorisation/notification-authorisation.module').then(m => m.NotificationAuthorisationPageModule) 
},

  { 
    path: 'wait', 
  loadChildren: () =>
  import('./pages/wait/wait.module').then(m => m.WaitPageModule) 
  },

  {
    path: 'lobby',
    loadChildren: () =>
      import('./pages/workout/lobby/lobby.module').then(m => m.LobbyPageModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  // Satas


  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },


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
