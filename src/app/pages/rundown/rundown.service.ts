import { Injectable } from '@angular/core';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { first, take, tap, delay, distinct } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { RundownSequence, RundownStep } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})

export class RundownService {

  private _rundownSequence = null;
  public workoutUid = null;
  private _activeWorkout$: Observable<any>;

  public workoutIsActive$ = new BehaviorSubject<boolean>(false);
  public currentWorkout$ = new BehaviorSubject<any | null>(null);
  public stepPipe$ = new BehaviorSubject<RundownStep | null>(null);
  public stepCount = 0;

  constructor(private firestore: AngularFirestore) {

    // Montior firebase for new active workouts
    this._activeWorkout$ = this.firestore.collection("workouts", ref => {
      return ref.where('active', '==', true)
        .where('channel', '==', 'master')
        .orderBy('startAt')
        .limitToLast(1)
    }).valueChanges({ idField: 'uid' });

    this._activeWorkout$.pipe(distinct()).subscribe(item => {
      if (item[0]) {
        this.loadRundownFromWorkout(item[0].uid);
      }
    });
  }

  async loadRundownFromWorkout(workout: string) {
    if (!workout) return;
    if (this.workoutUid == workout) return;  // value changes on the doc will try to reload.

    console.log('[RundownService] Loading New Workout: ' + workout);

    const workoutDoc = await this.firestore.collection("workouts").doc(workout).get().toPromise();
    if (!workoutDoc.exists) {
      console.warn('[RundownService] Workout doesnt exist'); return;
    }
    const workoutData = workoutDoc.data();
    if (!workoutData.active) {
      console.warn('[RundownService] Workout not active'); return;
    }

    this.workoutUid = workout;
    this.currentWorkout$.next(workoutData);
    this.stepCount = workoutData.rundown.length - 1;
    this._rundownSequence = {
      startAt: workoutData.startAt,
      endAt: workoutData.endAt,
      steps: workoutData.rundown
    };
    this.populatePipes();
  }

  populatePipes() {

    // If we've already started emit the current step
    const currentIndex = this.currentStepIndex();
    if (currentIndex > -1) {
      this.stepPipe$.next({ index: currentIndex, ...this._rundownSequence.steps[currentIndex] });
      this.workoutIsActive$.next(true);
    }

    // Schedule future steps
    for (let [index, step] of this._rundownSequence.steps.entries()) {

      const stepStartAt = step.startAt.toDate().getTime();
      const millisFromNow = stepStartAt - Date.now();

      if (millisFromNow > 0) {
        setTimeout(() => this.stepPipe$.next({ index: index, ...step }), millisFromNow);
      }

      // If we're not already active schedule when we will be
      if (index == 0) {
        setTimeout(() => this.workoutIsActive$.next(true), millisFromNow);
      }
    }

    // clear workout when we finish
    const finishInMillis = this._rundownSequence.endAt.toDate().getTime() - Date.now();
    setTimeout(() => this.clearWorkout(), finishInMillis);
  }

  currentStepIndex(): number {

    const dateNow = new Date;

    for (let [index, step] of this._rundownSequence.steps.entries()) {
      // create the endAt if required.
      let endAt: firestore.Timestamp;
      if (step.endAt) {
        endAt = step.endAt;
      } else {
        if (index < this._rundownSequence.steps.length - 1) {
          endAt = this._rundownSequence.steps[index + 1].startAt;
        } else {
          endAt = this._rundownSequence.endAt;
        }
      }

      if (this.dateWithinTimeWindow(dateNow, step.startAt.toDate(), endAt.toDate())) {
        return index;
      }
    }
    return -1;
  }

  dateWithinTimeWindow(date: Date, start: Date, end: Date): boolean {
    // console.log('Current Time: '+date.toLocaleTimeString() +' Start: '+start.toLocaleTimeString()+' End: '+ end.toLocaleTimeString());
    if ((date.getTime() >= start.getTime()) && (date.getTime() <= end.getTime())) {
      // console.log('True');
      return true;
    } else {
      // console.log('False');
      return false;
    }
  }

  clearWorkout() {
    this._rundownSequence = null;
    this.stepCount = 0;
    this.currentWorkout$.next(null);
    this.stepPipe$.next(null);
    this.workoutIsActive$.next(false);
    this.workoutUid = null;
  }

}
