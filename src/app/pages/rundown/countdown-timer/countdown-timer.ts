import { Component, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { Observable, Subject, interval, BehaviorSubject } from 'rxjs';

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
  private _zeroHold = false;
  private _holdAtSecond: number = null;
  private _zeroTriggered = false

  public isPostive = new BehaviorSubject<boolean>(true);
  public separator = ':';
  public countdownString$ = new BehaviorSubject<string>('00:00');

  @Input()
  set targetDate(target: number) {
    this._targetDate = target;
    this.countdownString$.next(this.calcTimeString())
  }

  @Input() @Optional()
  set zeroHold(hold: boolean) {
    this._zeroHold = hold;
  }

  @Input() @Optional()
  set holdAt(holdAtSecond: number) {
    this._holdAtSecond = holdAtSecond;
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
    if (secondsLeft ==0) this._zeroTriggered = true;

    if (this._zeroHold && this._zeroTriggered) {
      return zeroPad(0, 2);
    }

    if (secondsLeft < 0) {
      this.isPostive.next(false);
      secondsLeft = Math.abs(secondsLeft)
    }

    if (this._holdAtSecond && secondsLeft >= this._holdAtSecond) {
      return this.formatSeconds(this._holdAtSecond);
    }

    return this.formatSeconds(secondsLeft);
  }

  formatSeconds(secondsLeft: number): string {
    this._days = Math.floor(secondsLeft / 86400);
    secondsLeft -= this._days * 86400;
    this._hours = Math.floor(secondsLeft / 3600) % 24;
    secondsLeft -= this._hours * 3600;
    this._minutes = Math.floor(secondsLeft / 60) % 60;
    secondsLeft -= this._minutes * 60;
    this._seconds = Math.floor(secondsLeft % 60);

    let returnString = "";
    if (this._days > 0) returnString += zeroPad(this._days, 2) + this.separator;
    if (this._hours > 0) returnString += zeroPad(this._hours, 2) + this.separator;
    if (this._minutes > 0) returnString += zeroPad(this._minutes, 2) + this.separator;
    returnString += zeroPad(this._seconds, 2);

    return returnString;
  }
}
