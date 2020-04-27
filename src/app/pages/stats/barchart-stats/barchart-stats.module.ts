import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BarchartStatsPage } from './barchart-stats.page';

const routes: Routes = [
  {
    path: '',
    component: BarchartStatsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BarchartStatsPage]
})
export class BarchartStatsPageModule {}
