import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { RundownService } from 'src/app/pages/rundown/rundown.service';
import { scan, distinct } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController, IonSlides } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pump, Workout } from 'src/app/models/interfaces';
import { NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-rundown',
  templateUrl: './rundown.page.html',
  styleUrls: ['./rundown.page.scss'],
})
export class RundownPage implements OnInit {

  constructor(
    private rundownService: RundownService,
    private fns: AngularFireFunctions
  ) { }

  private _generateWorkout$;

  public targetDate: number;
  public workoutActive = false;
  public showDebugToolbar = true;
  public debugMessage$ = new BehaviorSubject<string>('Debug Bar');
  public currentWorkout: Workout;

  @ViewChild('slides') slides: IonSlides;

  slidesOptions: any = {
    zoom: {
      toggle: false
    },
    allowTouchMove:false
  };

  ngOnInit() {
    this.rundownService.currentWorkout$.pipe(distinct()).subscribe(val => {      // can be Null
      if (val) {
        this.debugMessage$.next('Loaded Workout: ' + this.rundownService.workoutUid);
        this.currentWorkout = val;
        this.workoutActive = true;
        this.targetDate = val!.pumps_startAt.toDate().getTime();
      } else {
        this.workoutActive = false;
        this.currentWorkout = null;
        this.targetDate = null;
      }
    });

    this.rundownService.workoutIsActive$.subscribe(val => { this.workoutActive = val });

    // Debug Bar
    this.rundownService.stepPipe$.subscribe(step => {
      if (!step) {
        this.debugMessage$.next('Debug Bar');
        return;
      }
      let stepString = step.index + '/' + this.rundownService.stepCount + ': ' + step.name;
      if (step.pump !== undefined) stepString = stepString.concat('  ' + JSON.stringify(step.pump).replace(/['"]+/g, ""));
      this.debugMessage$.next(stepString);
    });

    // Slide Controller
    this.rundownService.stepPipe$.pipe(distinct()).subscribe(step => {
      if (!step) return;
    //  this.slides.lockSwipes(false);
      switch (step.page) {
        case 'lobby':
          this.slides.slideTo(0, 0);
          break;
        case 'workout_countdown':
          this.slides.slideTo(1);
          break;
        case 'pump':
          this.slides.slideTo(step.pump!.index + 2);
          break;
        case 'workout_complete':
          this.slides.slideTo(this.currentWorkout.pumps.length + 3);
          break;
        case 'stats':
          console.log('Navigate to Stats');
       //   this.slides.slideTo(0, 0);
          break;
        default:
          console.warn('Step page ' + step.page + ' is unhandled');
          break;
      }
     // this.slides.lockSwipes(true);
    })
  }

  

  publishGenerateWorkout() {
    this.debugMessage$.next("Publishing: generate_workout");
    const payload = {
      topic: 'generate_workout',
      inSeconds: '95',
      TminusModifier: '85',
      key: 'ch78&*@#$%@32fbcvs0-327ehdu81=-31006*&^%F#dwv'
    }

    const callable = this.fns.httpsCallable('appTriggeredPubSubPublsh');
    this._generateWorkout$ = callable(payload).toPromise()
      .then(msg => {
        this.debugMessage$.next('Success!');
      })
      .catch(err => {
        this.debugMessage$.next('Error:' + err);
      });
  }
}
