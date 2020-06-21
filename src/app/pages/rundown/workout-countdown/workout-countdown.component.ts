import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-workout-countdown',
  templateUrl: './workout-countdown.component.html',
  styleUrls: ['./workout-countdown.component.scss'],
})
export class WorkoutCountdownComponent implements OnInit {

  public firstPumpTime;

  constructor() { }

  @Input()
  set targetDate(target: number) {
    this.firstPumpTime = target;
  }


  ngOnInit() {}

}
