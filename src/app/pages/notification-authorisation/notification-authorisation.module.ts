import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationAuthorisationPage } from './notification-authorisation.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationAuthorisationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificationAuthorisationPage]
})
export class NotificationAuthorisationPageModule {}
