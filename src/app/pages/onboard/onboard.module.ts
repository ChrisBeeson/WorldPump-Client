import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { OnboardPage } from './onboard.page';
import { LoginPageModule } from '../login/login.module';
import { RegisterComponent } from '../register/register.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    LoginPageModule

  ],
  declarations: [OnboardPage, RegisterComponent]
})
export class OnboardPageModule {}
