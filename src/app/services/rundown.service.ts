import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';


interface RundownStep {
  index: number,
  name: string,
  type: string,
  startAt: Date,
  endAt: Date,
  data: any
};

interface RundownSequence {
  startAt: Date,
  endAt: Date,
  steps: RundownStep[]
}

@Injectable({
  providedIn: 'root'
})
export class RundownService {

  private _rundownSequence = null;
  public alive = false;
  private _workoutUid = null;

  //public rundownPipe$ : Observable<rundownStep>;
  public mainRundownPipe$: BehaviorSubject<RundownStep | null> = new BehaviorSubject<RundownStep | null>(null);

  constructor(private firestore: AngularFirestore) { }


  async loadRundownFromWorkout(workout: string) {

    if (this._workoutUid == workout) return;
    console.log("loading Workout: " + workout);

    let workoutData;


      const workoutDoc = await this.firestore.collection("workouts").doc(workout).get().toPromise();
      if (!workoutDoc.exists) {
        console.log('No such workout!');
       // this.setRundownSequence(null);
        this._workoutUid = null;
        return;
      }
      workoutData = workoutDoc.data();
    console.log("workout :"+workoutData);
    /*
    if (!workoutData.active) {
      console.log('Workout not active');
      this.rundownSequence = null;
      return;
    }
*/
    this._workoutUid = workout;
    const rundownItems = await this.firestore.collection("workouts").doc(workout).collection('rundown', ref => ref.orderBy('index')).get().toPromise();
    console.log("rundown steps: "+JSON.stringify(rundownItems));
    //const sequence: RundownSequence = { startAt: workoutData.startAt, endAt: workoutData.endAt, steps: (rundownItems as RundownStep[]) };
  //  this.setRundownSequence(sequence);
  }

  setRundownSequence(value: RundownSequence) {
    this._rundownSequence = value;
  //  this.mainRundownPipe$.next(null);
    this.update();
  }

  public update() {

    console.log('[RundownService] Updating');
    this.alive = false;
    if (!this._rundownSequence) {
      this.mainRundownPipe$.next(null);
      console.log('[RundownService] Sequence is null');
      return;
    }

    const datenow = new Date();

    // 9. if we are after the endAt then we're not valid
    if (datenow.getTime() >= this._rundownSequence.endAt.getTime()) {
      this._rundownSequence = null;
      this.mainRundownPipe$.next(null);
      console.log('[RundownService] were past the endAt');
      return;
    }

    // 1. if we're before the startTime then we are waiting.
    if (datenow.getTime() < this._rundownSequence.startAt.getTime()) {
      this.mainRundownPipe$.next(null);
      console.log('[RundownService] Were before the start, so waiting');
      this.scheduleNextEvent(0, datenow);
      return;
    }

    // 2. search for the step that its time window is within the current time.
    console.log('[RundownService] Searching for next step');

    for (let [index, step] of this._rundownSequence.steps.entries()) {
      // create the endAt if required.
      let endAt: Date;
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
      if (this.dateWithinTimeWindow(datenow, step.startAt, endAt)) {
        console.log('[RundownService] Were at step: '+index+' waiting for next Step');
        this.mainRundownPipe$.next(step);
        this.scheduleNextEvent(index + 1, datenow);
      }
    }

    // 3. we're done.
  }

  dateWithinTimeWindow(date: Date, start: Date, end: Date): boolean {
    return ((date.getTime() >= start.getTime()) && (date.getTime() <= end.getTime())) ? true : false;
  }

  scheduleNextEvent(index: number, currentDate: Date) {

    let millisToNextEvent = 0;
    // if the index is greater than the array then goto the endAt
    if (index > this._rundownSequence.steps.length) {
      millisToNextEvent = this._rundownSequence.endAt.getTime() - currentDate.getTime();
    } else {
      const stepStartAt = this._rundownSequence.steps[index].startAt;
      millisToNextEvent = stepStartAt.getTime() - currentDate.getTime();
    }
    if (millisToNextEvent < 0) { console.exception('[Rundown service] Time to next event is negative') } else {
      setTimeout(this.update, millisToNextEvent);
    }
  };

}
