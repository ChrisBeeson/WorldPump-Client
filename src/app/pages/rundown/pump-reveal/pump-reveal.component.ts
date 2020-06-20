import { Component, OnInit, Input } from '@angular/core';
import { Pump } from 'src/app/models/interfaces';

@Component({
  selector: 'app-pump-reveal',
  templateUrl: './pump-reveal.component.html',
  styleUrls: ['./pump-reveal.component.scss'],
})
export class PumpRevealComponent implements OnInit {

  private _pump: Pump;

  public pumpName:String;


  @Input()
  set pump(pump: Pump) {
    this._pump = pump;
    this.pumpName = pump.display_name;
  }
  
  
  constructor() { }

  ngOnInit() {}

}
