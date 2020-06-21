import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RundownPage } from './rundown.page';
import { RundownService } from 'src/app/pages/rundown/rundown.service';
import { CountdownTimer } from './countdown-timer/countdown-timer';
import { LobbyComponent } from './lobby/lobby.component';
import { PumpComponent } from './pump/pump.component';
import { WorkoutCountdownComponent } from './workout-countdown/workout-countdown.component';
import { WorkoutCompleteComponent } from './workout-complete/workout-complete.component';

const routes: Routes = [
  {
    path: '',
    component: RundownPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    RundownPage, 
    CountdownTimer, 
    LobbyComponent, 
    WorkoutCountdownComponent,
    PumpComponent, 
    WorkoutCompleteComponent
],
  providers:[RundownService]
})
export class RundownModule {}
