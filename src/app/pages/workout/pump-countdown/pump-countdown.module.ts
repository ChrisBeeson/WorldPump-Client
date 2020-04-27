import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PumpCountdownPage } from './pump-countdown.page';

const routes: Routes = [
  {
    path: '',
    component: PumpCountdownPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PumpCountdownPage]
})
export class PumpCountdownPageModule {}
