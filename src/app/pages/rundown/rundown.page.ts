import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { RundownService } from 'src/app/services/rundown.service';
import { scan, distinct } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController, IonSlides } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pump, Workout } from 'src/app/models/interfaces';

// Test
@Component({
  selector: 'app-rundown',
  templateUrl: './rundown.page.html',
  styleUrls: ['./rundown.page.scss'],
})
export class RundownPage implements OnInit {

  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  public rundown$;
  public rundown = [];

  private _generateWorkout$;

  public targetDate: number;
  public workoutActive = false;
  public showDebugToolbar = true;
  public debugMessage$ = new BehaviorSubject<string>('Debug');
  public currentWorkout: Workout;

  ///   <CountdownTimer targetDate={{this.targetDate}} ></CountdownTimer>

  constructor(
    private firestore: AngularFirestore,
    private rundownService: RundownService,
    private fns: AngularFireFunctions,
    private toastController: ToastController
  ) {}

  ngOnInit() {

    this.rundownService.currentWorkout$.pipe(distinct()).subscribe(val => {      // can be Null
      if (val) {
        this.currentWorkout = val;
        this.workoutActive = true;
        this.targetDate = val!.pumps_StartAt.toDate();

      } else {
        this.workoutActive = false;
        this.currentWorkout = null;
        this.targetDate = null;
      }
    });

    this.rundownService.stepPipe$.subscribe(step => {
      if (!step) { 
        this.debugMessage$.next('Debug');
        return;
      }
        const stepString = step.index +' of ' + this.rundownService.stepCount+': ' +step.name;
        if (step.data !== undefined) stepString.concat(' '+JSON.stringify(step.data));
        this.debugMessage$.next(stepString);      
    })
  }


  publishGenerateWorkout() {
    this.debugMessage$.next("generate_workout");

    const payload = {
      topic: 'generate_workout',
      inSeconds: '50',   // <- the time to the start of the first pump so MUST be greater than 45secs
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
