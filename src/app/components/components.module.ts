import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

//import { CheckboxWrapperComponent } from './checkbox-wrapper/checkbox-wrapper.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
//import { CounterInputComponent } from './counter-input/counter-input.component';
//import { RatingInputComponent } from './rating-input/rating-input.component';
//import { GoogleMapComponent } from './google-map/google-map.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
   // CheckboxWrapperComponent,
    ShowHidePasswordComponent,
    CountdownTimerComponent,
   // CounterInputComponent,
  //  RatingInputComponent,
   // GoogleMapComponent
  ],
  exports: [
  //  CheckboxWrapperComponent,
    ShowHidePasswordComponent,
    CountdownTimerComponent,
 //   CounterInputComponent,
 //   RatingInputComponent,
  //  GoogleMapComponent
  ]
})
export class ComponentsModule {}
