import { firestore } from 'firebase';


export interface Workout {
    name?: String;
    uid: String,
    startAt?: firestore.Timestamp;
    endAt?: Date;
    pumps: Pump[];
    exercise_duration: number;
    type: String;
    rundown: any[];
    generate_on_completion: boolean;
    channel: string;                   // support for dev in production
    enabled: boolean;
}


export interface Pump {
    index:number;
    display_name:string;
    exercise_required_equiptment:string;
    exercise_uid?: string;
    duration?: number;
    countdown_duration:number;
    startAt?: firestore.Timestamp;
    endAt?: firestore.Timestamp;
}


export interface RundownStep {
    index: number,
    name: string,
    type?: string,
    startAt?: firebase.firestore.Timestamp,
    endAt?: firebase.firestore.Timestamp,
    data?: any
  };
  
  
  export interface RundownSequence {
    startAt: firebase.firestore.Timestamp,
    endAt: firebase.firestore.Timestamp,
    steps: RundownStep[]
  }