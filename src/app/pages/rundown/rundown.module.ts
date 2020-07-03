import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RundownPage } from './rundown.page';
import { CountdownTimer } from './countdown-timer/countdown-timer';
import { LobbyComponent } from './lobby/lobby.component';
import { WorkoutCompleteComponent } from './workout-complete/workout-complete.component';
import { WorkoutCountdownComponent } from './workout-countdown/workout-countdown.component';
import { PumpComponent } from './pump/pump.component';
import { RundownService } from './services/rundown.service';
import { AttendanceService } from './services/attendance.service';
import { NumberSuffixPipe } from './pipes/number-suffix.pipe';
import { Insomnia } from '@ionic-native/insomnia/ngx';

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
    WorkoutCompleteComponent,NumberSuffixPipe,
],

  providers:[RundownService, AttendanceService,  Insomnia],

  exports:[NumberSuffixPipe],
})
export class RundownModule {}
