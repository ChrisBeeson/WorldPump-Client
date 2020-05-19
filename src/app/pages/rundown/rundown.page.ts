import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { RundownService } from 'src/app/services/rundown.service';
import { scan, distinct } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';




@Component({
  selector: 'app-rundown',
  templateUrl: './rundown.page.html',
  styleUrls: ['./rundown.page.scss'],
})
export class RundownPage implements OnInit {

  private _activeWorkout$;
  public rundown$;
  public rundown = [];
  private _generateWorkout$;

  constructor(
    private firestore: AngularFirestore,
    private rundownService: RundownService,
    private fns: AngularFireFunctions) {

    // private pubsub: PubSubService
    /*
        this.rundownService.mainRundownPipe$.subscribe(step => {
          console.log("Adding Step => "+step);
          this.rundown.push(step);
        })
    
        this.rundown$ = this.rundownService.mainRundownPipe$.pipe(distinct(), scan((acc, curr) => Object.assign({}, acc, curr), {}));
    */
  }

  ngOnInit() {

    this._activeWorkout$ = this.firestore.collection("workouts", ref => ref.where('active', '==', true)).valueChanges({ idField: 'uid' });

    this._activeWorkout$.subscribe(item => {
      if (item[0]) {
        console.log('New Active Workout: ' + item[0].uid);
        this.rundownService.loadRundownFromWorkout(item[0].uid);
      }
    });
  }

  reorderItems(event: any) {
  }

  async publishGenerateWorkout() {
    console.log("generating workout");

    const payload = {
      topic: 'generate_workout',
      inSeconds: 5,
      key: 'ch78&*@#$%@32fbcvs0-327ehdu81=-3100(*&^%F#dwv'
    }

    const callable = this.fns.httpsCallable('appTriggeredPubSubPublsh');
    this._generateWorkout$ = callable(payload).toPromise()
      .then(msg => console.log(msg))
      .catch(err => console.log('Error :' + err));
  }
}
