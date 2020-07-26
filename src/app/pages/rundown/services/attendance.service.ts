import { Injectable } from '@angular/core';
import { RundownService } from './rundown.service';
import { ProfileService } from '../../profile/profile.service';
import { distinct } from 'rxjs/operators';
import { Workout } from '../../../models/interfaces';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Plugins, AppState } from '@capacitor/core';
const { App } = Plugins;
import { Insomnia } from '@ionic-native/insomnia/ngx';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  public allowed_to_attend = true;  // if user quits during a pump they can no longer attend the workout.
  public currently_attending = false;
  private _currentWorkout: Workout;
  private _currentStep: number;
  private _STRICT_ATTENDANCE = false;

  constructor(
    private rundownService: RundownService,
    private profileService: ProfileService,
    private firestore: AngularFirestore,
    private insomnia: Insomnia
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
        this.insomnia.keepAwake()
          .then(
            () => console.log('[insomnia] keepAwake() success'),
            (err) => console.log('[insomnia] error: ' + err)
          );

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

      if (step.name == 'workout_complete' && this.allowed_to_attend) {
        this.completedWorkout();    // The only way to publish is on this step.
      }
    });
    // watch for plaform move to background after step 4

    App.addListener('appStateChange', (state: AppState) => {

      if (this._STRICT_ATTENDANCE) {
        if (!state.isActive) {
          if (this._currentStep > 4)
            this.allowed_to_attend = false;
          this.setCurrentlyAttending(false)
        }
      }
    });
  }


  async completedWorkout() {

    console.log('completing workout & updating profile');


    // Add this workout to subcollection workouts_attended
    const batch = this.firestore.firestore.batch();

    batch.set(this.firestore.collection('profiles').doc(this.profileService.currentUser.uid).collection('workouts_attended').doc(this._currentWorkout.uid).ref,({
      workout_attended_ref: this._currentWorkout.uid,
      friends_attended: [], //todo:
      challenge_ref: null, // todo:
      pumps_startedAt: this._currentWorkout.pumps_startAt,
      completed: true
    }));

    
    batch.update(this.profileService.profileDoc.ref, ({
      workout_currently_attending: firebase.firestore.FieldValue.delete(),
      stats: {
        workouts_attended: firebase.firestore.FieldValue.increment(1),
        // max_streak:0,
        // max_missed:0,
        //  started_but_not_completed:0,
        total_workout_seconds: firebase.firestore.FieldValue.increment(this._currentWorkout.pumps.length),
        total_pumps: firebase.firestore.FieldValue.increment(this._currentWorkout.pumps.length)
      }
    }));

    // get all exercises_performed
    const user_exercises = await this.profileService.profileDoc.collection('exercises_performed').valueChanges({ idField: "uid" }).toPromise();
   // const newExerciseDoc = this.profileService.profileDoc.collection('exercises_performed').doc();

   user_exercises.forEach(element => {
   // was this an exercise that was performed?
   const exercise_index = this._currentWorkout.pumps.findIndex(x => x.exercise_uid === element.uid);

   if (exercise_index !=-1) { // it is
    const ref = this.firestore.collection('profiles').doc(this.profileService.currentUser.uid).collection('exercises_performed').doc(element.uid);
    batch.update(this.profileService.profileDoc.ref, ({
      total_performed: firebase.firestore.FieldValue.increment(this._currentWorkout.pumps[exercise_index].expected_rep_count),
      total_duration:firebase.firestore.FieldValue.increment(this._currentWorkout.pumps[exercise_index].duration),
      total_pumps:firebase.firestore.FieldValue.increment(1)
    }));
   } else {
     batch.set (this.firestore.collection('profiles').doc(this.profileService.currentUser.uid).collection('exercises_performed').doc(element.uid).ref,({
      total_performed: this._currentWorkout.pumps[exercise_index].expected_rep_count,
      total_duration:this._currentWorkout.pumps[exercise_index].duration,
      total_pumps:1
     }));
   }
});
    await batch.commit();



    this.insomnia.allowSleepAgain()
      .then(
        () => console.log('[Insomina] allowSleepAgain() success'),
        (err) => console.log('[Insomina] error: ' + err)
      );

  }


  async setCurrentlyAttending(attending: boolean, uid?: string) {
    if (attending) {
      if (uid) {
        console.log('updating profile with workout_currently_attending');
        await this.profileService.profileDoc.update({ workout_currently_attending: uid });
      }
      this.currently_attending = true;
    } else {
      this.currently_attending = false;
      // if (this.profileService.profileDoc.workout_currently_attending){
      await this.profileService.profileDoc.update({ workout_currently_attending: firebase.firestore.FieldValue.delete() });
      // }
      this.insomnia.allowSleepAgain()
        .then(
          () => console.log('[Insomina] allowSleepAgain() success'),
          (err) => console.log('[Insomina] error: ' + err)
        );
    }
  }

}
