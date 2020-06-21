import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Pump, RundownSequence } from '../../../models/interfaces';
import { distinct } from 'rxjs/operators';
import { RundownService } from '../rundown.service';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['../rundown.page.scss'],
})
export class PumpComponent implements OnInit {

  constructor(private rundownService:RundownService) { }

  private _pump: Pump;
  public pumpName: String;
  public pumpStartTime: Number;
  public pumpDuration:Number;

  // yuck
  public page1_hidden:boolean;
  public page2_hidden:boolean;
  public page3_hidden:boolean;
  public page4_hidden:boolean;

 // @ViewChild(IonSlides) slides: IonSlides;

  @Input()
  set pump(pump: Pump) {
    if (pump) {
    this._pump = pump;
    this.pumpName = pump.display_name;
    this.pumpStartTime = pump.startAt.toDate().getTime();
    this.pumpDuration = pump.duration;
    }
  }

  slidesOptions: any = {
    zoom: {
      toggle: false
    }
  };
  
  ngOnInit() {
    this.hideAll();

    this.rundownService.stepPipe$.pipe(distinct()).subscribe(step => {
      if (!step) return;
      if (step.pump?.index != this._pump.index) return;

      this.hideAll();

      switch (step.name) {
        case 'pump_reveal':
       //   this.slides.slideTo(0, 0);
       this.page1_hidden =false;
          break;
        case 'pump_countdown':
      //    this.slides.slideTo(1);
      this.page2_hidden =false;
          break;
        case 'pump_start':
      //    this.slides.slideTo(1);
      this.page3_hidden =false;
          break;
        case 'pump_complete':
       //   this.slides.slideTo(2);
       this.page4_hidden =false;
          break;
        case 'pump_cooldown':
        //  this.slides.slideTo(2);
        this.page4_hidden =false;
          break;
        default:
          console.warn(step.name + ' is unhandled');
          break;
      }
    });
  }

  hideAll() {
    this.page1_hidden =true;
    this.page2_hidden =true;    
    this.page3_hidden =true;
    this.page4_hidden =true;
  }

}
