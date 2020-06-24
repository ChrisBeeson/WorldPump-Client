import { Injectable } from '@angular/core';
import { RundownService } from './rundown.service';
import { ProfileService } from '../../profile/profile.service';
import { distinct } from 'rxjs/operators';
import { Workout } from '../../../models/interfaces';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  public allowed_to_attend = true;  // if user quits during a pump they can no longer attend the workout.
  public currently_attending = false;
  private _currentWorkout: Workout;

  constructor(
    private rundownService: RundownService,
    private profileService: ProfileService,
    private firestore: AngularFirestore
  ) {

    this.rundownService.currentWorkout$.pipe(distinct()).subscribe(workout => {
      //reset allow_to_attend on end of workout.
      if (!workout && !this.allowed_to_attend) {
        this.allowed_to_attend = true;
        this._currentWorkout = null;
        return;
      }

      if (workout && this.allowed_to_attend) {
        this.setCurrentlyAttending(true, workout.uid);
        this._currentWorkout = workout;
        return;
      }

      /*
      if (!workout && this.allowed_to_attend) {
        this.completedWorkout(workout.uid);
        this._currentWorkout = null;
      }
*/

    });


    this.rundownService.stepPipe$.subscribe(step => {
      if (!step) return;
      if (step.index < 5 && this.allowed_to_attend) {  // 5 = 1st Pump Start
        this.currently_attending = true;
      }

      if (step.name == 'workout_complete') {
        this.completedWorkout();    // The only way to publish is on this step.
      }
    });
    // watch for plaform move to background after step 4
  }


  async completedWorkout() {
    const batch = this.firestore.firestore.batch();

    // Add this workout to subcollection workouts_attended
    const workoutAttendedDoc = this.profileService.profileDoc.collection('workouts_attended').doc();
    batch.set(workoutAttendedDoc.ref, ({
      workout_attended_ref: this._currentWorkout.uid,
      friends_attended: [{ name: "Bob", ref: "FDHJDFSKRIEW" }], //todo:
      challenge_ref: "GF57483f", // todo:
      pumps_startedAt: this._currentWorkout.pumps_startAt
    }));

    // get all exercises_performed
    const exercises_performed = await this.profileService.profileDoc.collection('exercises_performed').valueChanges({ idField: "uid" }).toPromise();
    const newExerciseDoc = this.profileService.profileDoc.collection('exercises_performed').doc();

    // inc total amount of exercises done
    for (const pump of this._currentWorkout.pumps) {

      const exercise_index = exercises_performed.findIndex(x => x.uid === pump.exercise_uid!);
      // if the document doesn't exist create it
      if (exercise_index == -1) {
        batch.set(newExerciseDoc.ref, { amount_performed: pump.expected_rep_count });
      } else {
        batch.update(newExerciseDoc.ref, { amount_performed: pump.expected_rep_count });
      }
    }

    batch.update(this.profileService.profileDoc.ref, ({
      workout_currently_attending: firebase.firestore.FieldValue.delete(),
      workouts_attended: firebase.firestore.FieldValue.increment(1)
    }));

    await batch.commit();
  }


  async setCurrentlyAttending(attending: boolean, uid?: string) {
    if (attending) {
      await this.profileService.profileDoc.update({ workout_currently_attending: uid });
      this.currently_attending = true;
    } else {
      this.currently_attending = false;
      // if (this.profileService.profileDoc.workout_currently_attending){
      await this.profileService.profileDoc.update({ workout_currently_attending: firebase.firestore.FieldValue.delete() });
      // }
    }
  }

}
