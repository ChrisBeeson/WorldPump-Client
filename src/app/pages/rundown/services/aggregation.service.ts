import { Injectable } from '@angular/core';
import { RundownService } from './rundown.service';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { distinct } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {

  private _aggregateDoc$: Observable<any>;
  public attendanceCount$ = new BehaviorSubject<number>(0);
  private _attendanceTimer;
  private _aggregationInterval = 5;

  constructor(
    private rundownService: RundownService,
    private profileService: ProfileService,
    private firestore: AngularFirestore) {

    this.rundownService.currentWorkout$.pipe(distinct()).subscribe(workout => {

      if (workout) {
        // we monitor the current workouts sub collection
        try {
          
          this._aggregateDoc$ = this.firestore.collection("workouts").doc(this.rundownService.workoutUid).collection('attendance_aggregation', ref => {
            return ref.orderBy('createdAt').limitToLast(1)
          }).valueChanges();

        } catch (err) {
          console.log(err);
        }

        this._aggregateDoc$.subscribe(doc => {
          clearTimeout(this._attendanceTimer);
          if (!doc[0]) {
            this.attendanceCount$.next(0);
            clearInterval(this._attendanceTimer);
            return;
          }
          // now animate         
          animateValue(this.attendanceCount$, this._attendanceTimer, this.attendanceCount$.getValue(), Number(doc[0].total_attending), this._aggregationInterval);
        })
      }
    });
  }
}

function animateValue(subject, timerRef, startValue, endValue, duration) {
  if (timerRef) { clearInterval(timerRef); }
  const minInterval = 800;
  const valueRange = endValue - startValue;
  const startTime = new Date().getTime();
  const endTime = startTime + (duration * 1000);
  const interval = Math.max((endTime - startTime) / valueRange, minInterval);

  function run() {
    const now = new Date().getTime();
    const rangePercent = Math.min(1 - ((endTime - now) / (endTime - startTime)), 1);
    const value = Math.round((rangePercent * valueRange) + startValue);

    subject.next(value);
    if (rangePercent >= 1) {
      clearInterval(timerRef);
    }
  }

  timerRef = setInterval(run, interval);
  run();
}