import { Component, OnInit, Input } from '@angular/core';
import { Pump } from '../../../models/interfaces';


@Component({
  selector: 'app-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['./pump.component.scss'],
})
export class PumpComponent implements OnInit {
  private _pump: Pump;
  public pumpName: String;
  public pumpStartTime: Number;
  public pumpDuration:Number;

  @Input()
  set pump(pump: Pump) {
    if (pump) {
    this._pump = pump;
    this.pumpName = pump.display_name;
    this.pumpStartTime = pump.startAt.toDate().getTime();
    this.pumpDuration = pump.duration;
    }
  }
  
  constructor() { }



  ngOnInit() {}

}
