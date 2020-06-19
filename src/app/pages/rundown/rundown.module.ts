import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RundownPage } from './rundown.page';
import { PumpSlideComponent } from './pump-slide/pump-slide.component';
import { RundownService } from 'src/app/services/rundown.service';
import { CountdownTimer } from './countdown-timer/countdown-timer';

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
  declarations: [RundownPage, PumpSlideComponent, CountdownTimer],
  providers:[RundownService]
})
export class RundownModule {}
