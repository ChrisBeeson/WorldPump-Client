import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, BehaviorSubject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

const zeroPad = (num, places) => String(num).padStart(places, '0');

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.html',
  styleUrls: ['./countdown-timer.scss']
})


export class CountdownTimer implements OnInit {

  private _targetDate: number = 0;  //milliseconds
  private _interval: Observable<any>;
  private _days: number;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;
  public isPostive = new BehaviorSubject<boolean>(true);
  public separator = ':';

  private sub;

  public countdownString$ = new BehaviorSubject<string>('00:00');

  
  @Input()
  set targetDate(target: number) {
    this._targetDate = target;
    this.countdownString$.next(this.calcTimeString())
  }

  constructor() { }

  ngOnInit() {
    this._interval = interval(1000);
   this._interval.subscribe(x => {
      this.countdownString$.next(this.calcTimeString()); 
    })
    
  };

  calcTimeString(): string {
    this.isPostive.next(true);
    let secondsLeft = (Date.now() - this._targetDate) / 1000;
    if (secondsLeft < 0) {
      this.isPostive.next(false);
      secondsLeft = Math.abs(secondsLeft)
    }

    this._days = Math.floor(secondsLeft / 86400);
    secondsLeft -= this._days * 86400;
    this._hours = Math.floor(secondsLeft / 3600) % 24;
    secondsLeft -= this._hours * 3600;
    this._minutes = Math.floor(secondsLeft / 60) % 60;
    secondsLeft -= this._minutes * 60;
    this._seconds = Math.floor(secondsLeft % 60);

    let returnString ="";
    if (this._days > 0) returnString += zeroPad(this._days,2) + this.separator;
    if (this._hours > 0) returnString += zeroPad(this._hours,2) + this.separator;
    if (this._minutes > 0) returnString += zeroPad(this._minutes,2) + this.separator;
    returnString += zeroPad(this._seconds,2);

    return returnString;
  }
}



/*
<ion-row class="countdown">
  <ion-col class="time" *ngIf="_initialUnit === 'day'">
    <span class="time-unit">D</span>
    <div class="inner-time">
      <span class="time-value">{{ _daysLeft }}</span>
    </div>
  </ion-col>
  <ion-col class="time" *ngIf="(_initialUnit === 'day' && _endingUnit !== 'day') || _initialUnit === 'hour' || _endingUnit === 'hour'">
    <span class="time-unit">H</span>
    <div class="inner-time">
      <span class="time-value">{{ _hoursLeft }}</span>
    </div>
  </ion-col>
  <ion-col class="time" *ngIf="(_initialUnit === 'day' && (_endingUnit !== 'day' && _endingUnit !== 'hour')) || (_initialUnit === 'hour' && _endingUnit !== 'hour') || _initialUnit === 'minute'">
    <span class="time-unit">M</span>
    <div class="inner-time">
      <span class="time-value">{{ _minutesLeft }}</span>
    </div>
  </ion-col>
  <ion-col class="time" *ngIf="_endingUnit === 'second'">
    <span class="time-unit">S</span>
    <div class="inner-time">
      <span class="time-value">{{ _secondsLeft }}</span>
    </div>
  </ion-col>
</ion-row>
*/