import { firestore } from 'firebase';


export interface Workout {
    name?: string;
    uid: string,
    startAt?: firestore.Timestamp;
    endAt?: firestore.Timestamp;
    pumps: Pump[];
    exercise_duration: number;
    type: string;
    rundown: any[];
    generate_on_completion: boolean;
    channel: string;                   // support for dev in production
    enabled: boolean;
    completed: boolean;
    active:boolean;
    pumps_startAt:firestore.Timestamp
}


export interface Pump {
    index:number;
    display_name:string;
    exercise_required_equiptment:string;
    exercise_uid?: string;
    duration: number;
    countdown_duration:number;
    startAt: firestore.Timestamp;
    endAt?: firestore.Timestamp;
    expected_rep_count?:number
}


export interface RundownStep {
    index: number,
    name: string,
    page: string,
    startAt: firebase.firestore.Timestamp,
    endAt?: firebase.firestore.Timestamp,
    pump?: any
  };
  
  
  export interface RundownSequence {
    startAt: firebase.firestore.Timestamp,
    endAt: firebase.firestore.Timestamp,
    steps: RundownStep[]
  }