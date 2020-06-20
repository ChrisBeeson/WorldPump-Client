import { Injectable } from '@angular/core';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';
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
  private _currentStepIndex = -1;
  private _activeWorkout$: Observable<any>;

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

    this._activeWorkout$.subscribe(item => {
      if (item[0]) {
        this.loadRundownFromWorkout(item[0].uid);
      }
    });
  }

  clearRundown(msg?: string) {
    if (msg) { console.warn(msg); }
    this._rundownSequence = null;
    this._currentStepIndex = -1;
    this.stepCount = 0
    this.currentWorkout$.next(null);
    this.stepPipe$.next(null);
  }

  setRundownSequence(value: RundownSequence) {
    if (value) {
      this._rundownSequence = value;
      this.update();
    } else {
      console.log('[RundownService] Attempting to set the rundown sequence with null');
    }
  }

  async loadRundownFromWorkout(workout: string) {
    if (!workout) return;
    if (this.workoutUid == workout) {
      this.update(); return;
    };
    console.log('[RundownService] Loading New Workout: ' + workout);

    const workoutDoc = await this.firestore.collection("workouts").doc(workout).get().toPromise();
    if (!workoutDoc.exists) {
      this.clearRundown('[RundownService] Workout doesnt exist'); return;
    }
    const workoutData = workoutDoc.data();
    if (!workoutData.active) {
      this.clearRundown('[RundownService] Workout not active'); return;
    }

    this.workoutUid = workout;
    this.currentWorkout$.next(workoutData);
    this.stepCount = workoutData.rundown.length-1;
    this.setRundownSequence({
      startAt: workoutData.startAt,
      endAt: workoutData.endAt,
      steps: workoutData.rundown
    });
  }

  // TODO: update with rxjs delay

  async populateStepPipe() {
  }

  currentStepIndex(){
  }

  public update() {
    console.log('[RundownService] Updating: ' + this.workoutUid);
    const datenow = new Date();

    if (!this._rundownSequence) {
      console.log("[RundownService] _rundownSequence is Null: " + this._rundownSequence);
      return;
    }

    if (datenow.getTime() >= this._rundownSequence.endAt.toDate().getTime()) {
      this.clearRundown('[RundownService] Past endAt');
      return;
    }

    // 1. if we're before the startTime then we are waiting.
    if (datenow.getTime() < this._rundownSequence.startAt.toDate().getTime()) {
      this.stepPipe$.next({ index: -1, name: 'waiting' });
      this.scheduleNextEvent(0, datenow);
      return;
    }

    // 2. Theres a step thats currently active at this point in time, find it
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

      // 3. cue this update function to run again at the start of the next step.

      if (this.dateWithinTimeWindow(datenow, step.startAt.toDate(), endAt.toDate())) {
        if (this._currentStepIndex !== index) {
          console.log('[RundownService] Step ' + index + ' of ' + this._rundownSequence.steps.length + ' : ' + this._rundownSequence.steps[index].name);
          this.stepPipe$.next({ index: index, ...step });
          this.scheduleNextEvent(index + 1, datenow);
          this._currentStepIndex = index;
        }
      }
    }

    // 3. we're done.
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

  scheduleNextEvent(index: number, currentDate: Date) {
    let millisToNextEvent = 0;
    // if the index is greater than the array then goto the endAt
    if (index > this._rundownSequence.steps.length-1) {
      millisToNextEvent = this._rundownSequence.endAt.toDate().getTime() - currentDate.getTime();
    } else {
      const stepStartAt = this._rundownSequence.steps[index].startAt;
      millisToNextEvent = stepStartAt.toDate().getTime() - currentDate.getTime();
    }
    if (millisToNextEvent < 0) { console.log('[Rundown service] Time to next event is negative') } else {
      setTimeout(this.update, millisToNextEvent);
    }
  };
}
